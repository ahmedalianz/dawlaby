import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Colors } from "@/constants/colors";
import { useSyncDirectionWithLang } from "@/hooks/useSyncDirectionWithLang";
import { ConfirmProvider } from "@/store/ConfirmContext";
import { DirectionProvider } from "@/store/DirectionContext";
import { initI18n } from "@/utils/i18n";
import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Tajawal_800ExtraBold,
} from "@expo-google-fonts/tajawal";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
export default function Layout() {
  const [ready, setReady] = useState(false);

  useFonts({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Tajawal_800ExtraBold,
  });

  useEffect(() => {
    initI18n().then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <DirectionProvider>
      <ConfirmProvider>
        <AppContent />
      </ConfirmProvider>
    </DirectionProvider>
  );
}
function AppContent() {
  useSyncDirectionWithLang();

  return (
    <ErrorBoundary
      showHomeButton
      onError={(error) => {
        console.error("Root error:", error.message);
      }}
      errorType="render"
    >
      <View style={{ flex: 1, backgroundColor: Colors.surface }}>
        <StatusBar barStyle="light-content" />

        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade_from_bottom",
            contentStyle: { backgroundColor: Colors.surface },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
          <Stack.Screen name="camera" options={{ animation: "fade" }} />
          <Stack.Screen
            name="suggestions"
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="voice"
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="history/index"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="history/[id]"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="profile"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="upload"
            options={{ animation: "slide_from_right" }}
          />
        </Stack>
      </View>
    </ErrorBoundary>
  );
}
