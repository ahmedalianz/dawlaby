import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import VoiceScreen from "../../app/voice";
// Mock the voice hooks
jest.mock("../../hooks/voice/useVoiceAnimations", () => ({
  useVoiceAnimations: () => ({
    wave1Style: {},
    wave2Style: {},
    wave3Style: {},
    pulseStyle: {},
    fadeStyle: {},
    startWaveAnimation: jest.fn(),
    stopWaveAnimation: jest.fn(),
    showResult: jest.fn(),
    resetAnimations: jest.fn(),
  }),
}));

const mockStartRecording = jest.fn();
const mockStopRecording = jest.fn();

jest.mock("../../hooks/voice/useRecorder", () => ({
  useRecorder: ({ onRecordingStart, onTranscribeStart, onError }: any) => {
    return {
      startRecording: () => {
        mockStartRecording();
        onRecordingStart();
      },
      stopRecording: () => {
        mockStopRecording();
        onTranscribeStart();
      },
    };
  },
}));

const mockProcessAudio = jest.fn();
const mockProcessQuestion = jest.fn();

jest.mock("../../hooks/voice/useVoiceAI", () => ({
  useVoiceAI: ({ onResult, onDone, onThinking }: any) => {
    return {
      processAudio: mockProcessAudio,
      processQuestion: (q: string) => {
        mockProcessQuestion(q);
        onThinking();
        onResult({
          answer: "AI Fashion Answer",
          tips: ["Tip 1"],
          avoid: ["Avoid this"],
        });
        onDone();
      },
    };
  },
}));

describe("Voice Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders idle state with Quick Questions", () => {
    const { getByText } = render(<VoiceScreen />);
    // Checks Idle rendering
    expect(getByText("voice.tapToSpeak")).toBeTruthy();
    expect(getByText("voice.quickQuestions")).toBeTruthy();
    expect(getByText("What goes with blue jeans?")).toBeTruthy();
  });

  it("handles quick question click", async () => {
    const { getByText, findByText } = render(<VoiceScreen />);

    const question = getByText("What goes with blue jeans?");
    fireEvent.press(question);

    // Verify AI logic was triggered
    expect(mockProcessQuestion).toHaveBeenCalledWith(
      "What goes with blue jeans?",
    );

    // Verify the UI transitioned to Result state
    // findByText uses waitFor internally
    expect(await findByText("AI Fashion Answer")).toBeTruthy();
    expect(getByText("Tip 1")).toBeTruthy();
    expect(getByText("Avoid this")).toBeTruthy();
  });

  it("transitions to recording when mic is pressed", async () => {
    const { getByTestId, getByText } = render(<VoiceScreen />);

    // The button doesn't have text, but the STATUS_LABEL changes.
    // STATUS_LABELS[Idle] = "voice.status.idle"
    // STATUS_LABELS[Recording] = "voice.status.recording"

    // Find the mic button by its icon name (Ionicons mock usually renders the name as a prop)
    // Or simpler: find the TouchableOpacity.
    // Since it's the only one in micSection during Idle:
    const micButton = getByTestId("mic-button");

    fireEvent.press(micButton);

    expect(mockStartRecording).toHaveBeenCalled();

    // Check if status label updated
    await waitFor(() => {
      expect(getByText("voice.listening")).toBeTruthy();
    });
  });

  it("stops recording and shows processing steps when pressed again", async () => {
    const { getAllByText, getByTestId } = render(<VoiceScreen />);
    const micButton = getByTestId("mic-button");

    // Start
    fireEvent.press(micButton);

    // Stop
    fireEvent.press(micButton);

    expect(mockStopRecording).toHaveBeenCalled();

    // Should show processing steps (transcribing/analyzing)
    await waitFor(() => {
      expect(getAllByText("voice.transcribing").length).toBeGreaterThan(0);
    });
  });

  it("resets the screen when the refresh button is pressed", async () => {
    const { getByText, queryByText, findByText, getByTestId } = render(
      <VoiceScreen />,
    );

    // 1. Move to result state via quick question
    fireEvent.press(getByText("What goes with blue jeans?"));
    await findByText("AI Fashion Answer");
    // 2. The TopBar refresh button should be visible.

    const resetButton = getByTestId("refresh-button");
    fireEvent.press(resetButton);

    // 3. Verify we are back to Idle
    await waitFor(() => {
      expect(getByText("voice.quickQuestions")).toBeTruthy();
      expect(queryByText("AI Fashion Answer")).toBeNull();
    });
  });
});
