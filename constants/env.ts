const ENV = {
  geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "",
  model15: process.env.EXPO_PUBLIC_GEMINI_MODEL15 ?? "",
  mode20: process.env.EXPO_PUBLIC_GEMINI_MODEL20 ?? "",
  model25: process.env.EXPO_PUBLIC_GEMINI_MODEL25 ?? "",
};

if (!ENV.geminiApiKey) {
  console.warn(
    "⚠️ GEMINI_API_KEY is missing from .env or maybe model is totally used",
  );
}

export default ENV;
