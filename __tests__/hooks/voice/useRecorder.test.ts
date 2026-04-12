import { useRecorder } from "@/hooks/voice/useRecorder";
import { act, renderHook } from "@testing-library/react-native";
import { AudioModule } from "expo-audio";
import { File } from "expo-file-system";

jest.mock("expo-file-system", () => ({
  File: jest.fn().mockImplementation(() => ({
    base64: jest.fn().mockResolvedValue("mockBase64Audio"),
  })),
}));

describe("useRecorder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles startRecording lifecycle properly", async () => {
    const isMounted = { current: true };
    const onRecordingStart = jest.fn();
    const onError = jest.fn();

    const { result } = renderHook(() =>
      useRecorder({
        isMounted,
        onRecordingStart,
        onTranscribeStart: jest.fn(),
        onBase64Ready: jest.fn(),
        onError,
      }),
    );

    await act(async () => {
      await result.current.startRecording();
    });

    expect(AudioModule.requestRecordingPermissionsAsync).toHaveBeenCalled();
    expect(onRecordingStart).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it("handles stopRecording lifecycle properly", async () => {
    const isMounted = { current: true };
    const onTranscribeStart = jest.fn();
    const onBase64Ready = jest.fn();
    const onError = jest.fn();

    const { result } = renderHook(() =>
      useRecorder({
        isMounted,
        onRecordingStart: jest.fn(),
        onTranscribeStart,
        onBase64Ready,
        onError,
      }),
    );

    await act(async () => {
      await result.current.stopRecording();
    });

    expect(onTranscribeStart).toHaveBeenCalled();
    expect(File).toHaveBeenCalledWith("file://mock/audio.m4a");
    expect(onBase64Ready).toHaveBeenCalledWith("mockBase64Audio");
  });
});
