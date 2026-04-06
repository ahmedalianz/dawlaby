import ENV from "@/constants/env";
import { OutfitResult } from "@/types";
import axios from "axios";

const BASE = `https://generativelanguage.googleapis.com/v1beta/models`;

// ── Helpers ──
const parseGeminiJSON = (raw: string): any => {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const match = new RegExp(/\{[\s\S]*\}/).exec(cleaned);
  if (!match) throw new Error("Could not extract JSON from response");
  return JSON.parse(match[0]);
};

const callGemini = async (
  model: string,
  parts: object[],
  config = {},
): Promise<OutfitResult> => {
  try {
    const response = await axios.post(
      `${BASE}/${model}:generateContent?key=${ENV.geminiApiKey}`,
      {
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
          ...config,
        },
      },
    );

    const data = response.data;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from Gemini");
    const json = parseGeminiJSON(text);
    return json;
  } catch (error: any) {
    const message = error.response?.data?.error?.message ?? "Gemini API failed";
    throw new Error(message);
  }
};

// ── Vision (image analysis) ──
export const analyzeImage = (
  model: string,
  prompt: string,
  base64Image: string,
) =>
  callGemini(model, [
    { text: prompt },
    { inline_data: { mime_type: "image/jpeg", data: base64Image } },
  ]);

// ── Text only ──
export const askText = (model: string, prompt: string) =>
  callGemini(model, [{ text: prompt }], {
    maxOutputTokens: 1024,
  });

// ── Audio transcription ──
export const transcribeAudioAi = (
  model: string,
  base64Audio: string,
  hint: string,
) =>
  callGemini(
    model,
    [
      { text: `${hint} Return ONLY the transcribed text.` },
      { inline_data: { mime_type: "audio/m4a", data: base64Audio } },
    ],
    { temperature: 0, maxOutputTokens: 256 },
  );

// ── Raw text response (for transcription) ──
export const callGeminiRaw = async (
  model: string,
  parts: object[],
  config = {},
): Promise<string> => {
  try {
    const response = await axios.post(
      `${BASE}/${model}:generateContent?key=${ENV.geminiApiKey}`,
      {
        contents: [{ parts }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 256,
          ...config,
        },
      },
    );

    const data = response.data;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from Gemini");
    return text.trim();
  } catch (error: any) {
    const message = error.response?.data?.error?.message ?? "Gemini API failed";
    throw new Error(message);
  }
};
