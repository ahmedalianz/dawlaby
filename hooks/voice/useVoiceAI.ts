import { APP_NAME } from "@/constants/app";
import ENV from "@/constants/env";
import { FashionResult } from "@/types";
import { askText, callGeminiRaw } from "@/utils/gemini";
import { useCallback, useEffect } from "react";
import { useAsyncError } from "../useAsyncError";

// ─────────────────────────────────────────
// Prompts
// ─────────────────────────────────────────

const buildFashionPrompt = (question: string): string => {
  return `
    Respond entirely in Arabic.
    You are ${APP_NAME}, a luxury AI fashion stylist.
    The user asked: "${question}"
    Respond ONLY with a valid JSON object. No markdown, no backticks, no extra text.
    Use this exact structure:
    {
      "answer": "your main answer in 2-3 sentences",
      "tips": ["tip 1", "tip 2", "tip 3"],
      "avoid": ["thing to avoid 1", "thing to avoid 2"]
    }
    Be specific, elegant, and practical.
  `;
};

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

interface UseVoiceAIProps {
  isMounted: React.RefObject<boolean>;
  onTranscribed: (text: string) => void;
  onResult: (result: FashionResult) => void;
  onThinking: () => void;
  onDone: () => void;
  onError: (message: string) => void;
}

// ─────────────────────────────────────────
// Hook
// ─────────────────────────────────────────

export function useVoiceAI({
  isMounted,
  onTranscribed,
  onResult,
  onThinking,
  onDone,
  onError,
}: UseVoiceAIProps) {
  const { error, execute } = useAsyncError({
    context: "VoiceScreen",
    severity: "high",
  });

  // ── Ask fashion question ──
  const handleProcessQuestion = useCallback(
    async (question: string) => {
      if (!isMounted.current) return;
      onThinking();

      const data = (await askText(
        ENV.model25,
        buildFashionPrompt(question),
      )) as unknown as FashionResult;

      if (!isMounted.current) return;
      onResult(data);
      onDone();
    },
    [isMounted, onThinking, onResult, onDone],
  );

  const processQuestion = useCallback(
    async (question: string) => {
      await execute(() => handleProcessQuestion(question));
    },
    [execute, handleProcessQuestion],
  );

  // ── Transcribe then ask ──
  const processAudio = useCallback(
    async (base64: string) => {
      await execute(async () => {
        const text = await callGeminiRaw(ENV.model25, [
          {
            text: "Return ONLY the transcribed text.",
          },
          {
            inline_data: {
              mime_type: "audio/m4a",
              data: base64,
            },
          },
        ]);

        if (!isMounted.current) return;
        onTranscribed(text);
        await handleProcessQuestion(text);
      });
    },
    [execute, isMounted, onTranscribed, handleProcessQuestion],
  );

  // ── Sync error to callback ──
  useEffect(() => {
    if (error) onError(error.message);
  }, [error, onError]);

  return { processAudio, processQuestion };
}
