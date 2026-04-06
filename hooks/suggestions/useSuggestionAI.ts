import { APP_NAME } from "@/constants/app";
import ENV from "@/constants/env";
import { OutfitResult } from "@/types";
import { analyzeImage } from "@/utils/gemini";
import { saveToHistory } from "@/utils/history";
import { convertToBase64 } from "@/utils/normalization";
import { useCallback, useEffect } from "react";
import { useAsyncError } from "../useAsyncError";

interface UseSuggestionAIProps {
  imageUri: string | null;
  context: string | null;
  onLoading: (val: boolean) => void;
  onResult: (result: OutfitResult) => void;
  onError: (message: string) => void;
  onAnimateIn: () => void;
}

export function useSuggestionAI({
  imageUri,
  context,
  onLoading,
  onResult,
  onError,
  onAnimateIn,
}: UseSuggestionAIProps) {
  const { error, isLoading, execute } = useAsyncError({
    context: "SuggestionScreen",
    severity: "high",
  });
  const analyzeOutfit = useCallback(
    async (base64Image: string): Promise<OutfitResult | null> => {
      const contextLine = context
        ? `Additional context from the user: ${context}`
        : "";

      const prompt = `
        Respond entirely in Arabic.
        You are ${APP_NAME}, a luxury AI fashion stylist.
        ${contextLine}
        Analyze this outfit photo and respond ONLY in this exact JSON format with no extra text:
        {
          "detected_items": ["item1", "item2", "item3"],
          "style_vibe": "one short phrase like: Casual Chic / Street Luxe / Smart Casual",
          "color_palette": ["color1", "color2", "color3"],
          "occasions": ["occasion1", "occasion2"],
          "suggestions": [
            { "title": "suggestion title", "description": "detailed tip" },
            { "title": "suggestion title", "description": "detailed tip" },
            { "title": "suggestion title", "description": "detailed tip" }
          ],
          "stylist_note": "one elegant closing sentence from the stylist"
        }
        Be specific, elegant, and concise.
      `;
      const response = await analyzeImage(ENV.model25, prompt, base64Image);

      const parsed = response;
      if (!parsed.style_vibe || !Array.isArray(parsed.detected_items)) {
        throw new Error("Invalid AI response structure");
      }

      return parsed;
    },
    [context],
  );

  // ── Full fetch flow ──
  const fetchSuggestion = useCallback(async () => {
    if (!imageUri) {
      onError("No image provided.");
      onLoading(false);
      return;
    }

    await execute(async () => {
      const base64 = await convertToBase64(imageUri);
      if (!base64) throw new Error("Could not read image file");

      const data = await analyzeOutfit(base64);
      if (!data) throw new Error("No result returned from AI");

      onResult(data);

      await saveToHistory({
        imageUri,
        styleVibe: data.style_vibe,
        detectedItems: data.detected_items,
        occasions: data.occasions,
        stylistNote: data.stylist_note,
        result: data,
      });

      onAnimateIn();
    });
  }, [
    imageUri,
    analyzeOutfit,
    onAnimateIn,
    onResult,
    execute,
    onLoading,
    onError,
  ]);

  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading, onLoading]);

  useEffect(() => {
    if (error) {
      onError(error.message);
    }
  }, [error, onError]);

  return { fetchSuggestion };
}
