import SplashAnimation from "@/components/common/SplashAnimation";
import { Colors } from "@/constants/colors";
import { Storage } from "@/utils/storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function IndexScreen() {
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  // Check onboarding status once (only after splash finishes)
  useEffect(() => {
    if (!isSplashFinished) return;

    try {
      const value = Storage.getString("hasCompletedOnboarding");
      setHasOnboarded(value === "true");
    } catch (e) {
      console.error("Failed to read onboarding status", e);
      setHasOnboarded(false);
    }
  }, [isSplashFinished]);

  // While splash is playing → show only splash
  if (!isSplashFinished) {
    return (
      <SplashAnimation
        onFinish={() => {
          setIsSplashFinished(true);
          // Small delay helps avoid any render flash during navigation
          // setTimeout(() => {}, 50); // optional if needed
        }}
      />
    );
  }

  // Still checking onboarding status → show nothing (or a blank dark screen)
  if (hasOnboarded === null) {
    return <View style={{ flex: 1, backgroundColor: Colors.surface }} />;
  }

  // Final redirect — this happens in one clean step
  return hasOnboarded ? (
    <Redirect href="/home" />
  ) : (
    <Redirect href="/onboarding" />
  );
}
