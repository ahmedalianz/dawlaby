import AppScrollView from "@/components/common/AppScrollView";
import AppText from "@/components/common/AppText";
import RtlArrow from "@/components/common/RtlArrow";
import Screen from "@/components/common/Screen";
import TopBar from "@/components/common/TopBar";
import ProcessingStep from "@/components/voice/ProcessingStep";
import SectionHeader from "@/components/voice/SectionHeader";
import { APP_NAME_LARGE } from "@/constants/app";
import { QUICK_QUESTIONS, STATUS_LABELS } from "@/constants/common";
import { useRecorder } from "@/hooks/voice/useRecorder";
import { useVoiceAI } from "@/hooks/voice/useVoiceAI";
import { useVoiceAnimations } from "@/hooks/voice/useVoiceAnimations";
import { FashionResult, ScreenState } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { Colors } from "../constants/colors";

const { width } = Dimensions.get("window");

function VoiceScreen() {
  const { t, i18n } = useTranslation();

  const [state, setState] = useState<ScreenState>(ScreenState.Idle);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<FashionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isMounted = useRef(true);

  // ── Hooks ──
  const animations = useVoiceAnimations(state);

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);
    setState(ScreenState.Error);
  }, []);

  const { processAudio, processQuestion } = useVoiceAI({
    isMounted,
    onTranscribed: setTranscript,
    onThinking: () => setState(ScreenState.Thinking),
    onResult: setResult,
    onDone: () => {
      setState(ScreenState.Result);
      animations.showResult();
    },
    onError: handleError,
  });

  const { startRecording, stopRecording } = useRecorder({
    isMounted,
    onRecordingStart: () => {
      setState(ScreenState.Recording);
      animations.startWaveAnimation();
    },
    onTranscribeStart: () => {
      animations.stopWaveAnimation();
      setState(ScreenState.Transcribing);
    },
    onBase64Ready: processAudio,
    onError: handleError,
  });

  // ── Handlers ──
  const handleQuickQuestion = useCallback(
    (q: string) => {
      setTranscript(q);
      processQuestion(q);
    },
    [processQuestion],
  );

  const resetScreen = useCallback(() => {
    setState(ScreenState.Idle);
    setTranscript("");
    setResult(null);
    setErrorMessage("");
    animations.resetAnimations();
  }, [animations]);

  // ── Derived state ──
  const isRecording = state === ScreenState.Recording;
  const hasResult = state === ScreenState.Result;
  const isProcessing =
    state === ScreenState.Transcribing || state === ScreenState.Thinking;
  const isDoneTranscribing = state === ScreenState.Thinking || hasResult;
  const quickQuestions =
    QUICK_QUESTIONS[i18n.language === "ar" ? "arabic" : "english"] ??
    QUICK_QUESTIONS.english;

  return (
    <Screen>
      {/* TOP BAR */}
      <TopBar
        firstButtonIcon={state === ScreenState.Idle ? undefined : "refresh"}
        onFirstButtonPress={resetScreen}
        title={t("voice.title", { appName: t(APP_NAME_LARGE) })}
      />
      <AppScrollView contentContainerStyle={styles.scrollContent}>
        {/* MIC SECTION */}
        <View style={styles.micSection}>
          <View style={styles.bgGlow} pointerEvents="none" />
          <AppText style={styles.statusLabel}>
            {t(STATUS_LABELS[state])}
          </AppText>

          <View style={styles.micWrapper}>
            {isRecording && (
              <>
                <Animated.View
                  style={[styles.wave, styles.wave1, animations.wave1Style]}
                />
                <Animated.View
                  style={[styles.wave, styles.wave2, animations.wave2Style]}
                />
                <Animated.View
                  style={[styles.wave, styles.wave3, animations.wave3Style]}
                />
              </>
            )}

            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              disabled={isProcessing || hasResult}
              activeOpacity={0.85}
              testID="mic-button"
            >
              <LinearGradient
                colors={
                  isRecording
                    ? [Colors.errorLight, Colors.error]
                    : [Colors.primary, Colors.primaryContainer]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.micButton}
              >
                {isProcessing ? (
                  <Animated.View style={animations.pulseStyle}>
                    <Ionicons
                      name="hourglass-outline"
                      size={40}
                      color={Colors.onPrimary}
                    />
                  </Animated.View>
                ) : (
                  <Ionicons
                    name={isRecording ? "stop" : "mic"}
                    size={44}
                    color={Colors.onPrimary}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {isProcessing && (
            <View style={styles.processingSteps}>
              <ProcessingStep
                label={t("voice.transcribing")}
                done={isDoneTranscribing}
                active={state === ScreenState.Transcribing}
              />
              <ProcessingStep
                label={t("voice.analyzing")}
                done={hasResult}
                active={state === ScreenState.Thinking}
              />
              <ProcessingStep
                label={t("voice.analyzing")}
                done={hasResult}
                active={state === ScreenState.Thinking}
              />
            </View>
          )}

          {transcript !== "" && (
            <View style={styles.transcriptBubble}>
              <Ionicons
                name="chatbubble-outline"
                size={14}
                color={Colors.primary}
              />
              <AppText
                style={styles.transcriptText}
              >{`"${transcript}"`}</AppText>
            </View>
          )}
        </View>

        {/* QUICK QUESTIONS */}
        {state === ScreenState.Idle && (
          <View style={styles.quickSection}>
            <View style={styles.quickHeader}>
              <Ionicons name="flash-outline" size={14} color={Colors.primary} />
              <AppText style={styles.quickTitle}>
                {t("voice.quickQuestions")}
              </AppText>
              <View style={styles.sectionDivider} />
            </View>
            {quickQuestions.map((q, i) => (
              <TouchableOpacity
                key={q + i}
                style={styles.quickCard}
                onPress={() => handleQuickQuestion(q)}
              >
                <AppText style={styles.quickCardText}>{q}</AppText>
                <RtlArrow size={16} reversed />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* RESULT */}
        {hasResult && result && (
          <Animated.View style={[styles.resultContainer, animations.fadeStyle]}>
            <View style={styles.answerCard}>
              <LinearGradient
                colors={[Colors.primaryAlpha10, "transparent"]}
                style={styles.answerGradient}
              >
                <Ionicons name="sparkles" size={18} color={Colors.primary} />
                <AppText style={styles.answerText}>{result.answer}</AppText>
              </LinearGradient>
            </View>

            <View style={styles.section}>
              <SectionHeader
                icon="checkmark-circle-outline"
                title="Style Tips"
              />
              {result.tips.map((tip, i) => (
                <View key={tip + i} style={styles.tipRow}>
                  <View style={styles.tipDot} />
                  <AppText style={styles.tipText}>{tip}</AppText>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <SectionHeader
                icon="close-circle-outline"
                title="Avoid"
                color={Colors.errorLight}
              />
              {result.avoid.map((item, i) => (
                <View key={item + i} style={styles.tipRow}>
                  <View
                    style={[
                      styles.tipDot,
                      { backgroundColor: Colors.errorLight },
                    ]}
                  />
                  <AppText
                    style={[styles.tipText, { color: Colors.errorLight }]}
                  >
                    {item}
                  </AppText>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.askAgainBtn}
              onPress={resetScreen}
              testID="refresh-button"
            >
              <Ionicons name="mic-outline" size={18} color={Colors.primary} />
              <AppText style={styles.askAgainText}>
                {t("voice.askAnother")}
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ERROR */}
        {state === ScreenState.Error && (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color={Colors.errorLight}
            />
            <AppText style={styles.errorText}>
              {errorMessage || t("voice.errorMsg")}
            </AppText>
            <TouchableOpacity style={styles.retryBtn} onPress={resetScreen}>
              <AppText style={styles.retryText}>{t("voice.tryAgain")}</AppText>
            </TouchableOpacity>
          </View>
        )}
      </AppScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 20,
  },
  bgGlow: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.primaryAlpha05,
  },
  micSection: { alignItems: "center", paddingVertical: 32, gap: 24 },
  statusLabel: {
    color: Colors.secondary,
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: "500",
  },
  micWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    height: 160,
  },
  wave: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha25,
  },
  wave1: { width: 160, height: 160 },
  wave2: { width: 130, height: 130 },
  wave3: { width: 105, height: 105 },
  micButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  processingSteps: { gap: 10, alignItems: "flex-start" },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariantAlpha20,
  },
  transcriptBubble: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha15,
    maxWidth: width - 48,
  },
  transcriptText: {
    color: Colors.onSurface,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  quickSection: { gap: 10, marginTop: "auto" },
  quickHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  quickTitle: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  quickCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariantAlpha20,
  },
  quickCardText: { color: Colors.onSurface, fontSize: 14, flex: 1 },
  resultContainer: { gap: 24 },
  answerCard: { borderRadius: 16, overflow: "hidden" },
  answerGradient: {
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha15,
    borderRadius: 16,
    alignItems: "flex-start",
  },
  answerText: {
    color: Colors.onSurface,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "400",
  },
  section: { gap: 10 },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingLeft: 4,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  tipText: { color: Colors.secondary, fontSize: 14, lineHeight: 21, flex: 1 },
  askAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha30,
  },
  askAgainText: { color: Colors.primary, fontSize: 14, fontWeight: "600" },
  errorBox: { alignItems: "center", gap: 14, paddingTop: 20 },
  errorText: { color: Colors.secondary, fontSize: 14, textAlign: "center" },
  retryBtn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  retryText: { color: Colors.primary, fontWeight: "600" },
});

export default VoiceScreen;
