import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { File } from "expo-file-system";
import { useCallback, useEffect } from "react";

interface UseRecorderProps {
  isMounted: React.RefObject<boolean>;
  onRecordingStart: () => void;
  onTranscribeStart: () => void;
  onBase64Ready: (base64: string) => void;
  onError: (message: string) => void;
}

export function useRecorder({
  isMounted,
  onRecordingStart,
  onTranscribeStart,
  onBase64Ready,
  onError,
}: UseRecorderProps) {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  // ── Cleanup on unmount ──
  const stopRecorderForCleanUp = useCallback(async () => {
    try {
      if (audioRecorder.isRecording) {
        await audioRecorder.stop();
      }
    } catch {
      // ignore — recorder may already be released
    }
  }, [audioRecorder]);

  useEffect(() => {
    return () => {
      stopRecorderForCleanUp();
    };
  }, [stopRecorderForCleanUp]);

  const startRecording = useCallback(async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        onError("Microphone permission is required.");
        return;
      }
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      onRecordingStart();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Could not start recording";
      console.error("startRecording:", message);
      onError(message);
    }
  }, [audioRecorder, onRecordingStart, onError]);

  const stopRecording = useCallback(async () => {
    try {
      if (!isMounted.current) return;
      onTranscribeStart();

      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (!uri) throw new Error("No audio file was recorded");

      const normalizedUri = uri.startsWith("file://") ? uri : `file://${uri}`;
      const file = new File(normalizedUri);
      const base64Audio = await file.base64();

      if (!base64Audio) throw new Error("Could not read audio file");
      if (!isMounted.current) return;

      onBase64Ready(base64Audio);
    } catch (e) {
      if (!isMounted.current) return;
      const message = e instanceof Error ? e.message : "Recording failed";
      console.error("stopRecording:", message);
      onError(message);
    }
  }, [isMounted, onTranscribeStart, onBase64Ready, onError, audioRecorder]);

  return {
    startRecording,
    stopRecording,
    isRecording: audioRecorder.isRecording,
  };
}
