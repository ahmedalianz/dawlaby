import AppText from "@/components/common/AppText";
import { Colors } from "@/constants/colors";
import { OnboardingStep } from "@/types";
import { useTranslation } from "react-i18next";
import { Dimensions, I18nManager, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");
const isRTL = I18nManager.isRTL;

function SlideHeadline({ item }: Readonly<{ item: OnboardingStep }>) {
  const { t } = useTranslation();

  if (item.id === "3") {
    // Step 3: "Instant Looks," then "Endless Inspiration"
    return (
      <AppText style={slideStyles.headline}>
        {t("onboarding.title3")}
        {"\n"}
        <AppText style={slideStyles.headlineGold}>
          {t("onboarding.titleHighlight3")}
        </AppText>
      </AppText>
    );
  }

  if (item.id === "2") {
    // Step 2: "Snap, Upload or Speak"
    return (
      <AppText style={slideStyles.headline}>
        {t("onboarding.title2")}{" "}
        <AppText style={slideStyles.headlineGold}>
          {t("onboarding.titleHighlight2")}
        </AppText>
      </AppText>
    );
  }

  // Step 1: "Your Personal Stylist is Here"
  return (
    <AppText style={slideStyles.headline}>
      {t("onboarding.title1")}
      {"\n"}
      <AppText style={slideStyles.headlineGold}>
        {t("onboarding.titleHighlight1")}
      </AppText>
    </AppText>
  );
}

const SlideItem: React.FC<Readonly<{ item: OnboardingStep }>> = ({ item }) => {
  const { t } = useTranslation();
  const Visual = item.visual;

  return (
    <View style={[slideStyles.container, { width }]}>
      {/* Visual */}
      <View style={slideStyles.visualWrapper}>
        <Visual />
      </View>

      {/* Text */}
      <View style={slideStyles.textWrapper}>
        <SlideHeadline item={item} />
        <AppText style={slideStyles.subtitle}>
          {t(`onboarding.desc${item.id}`)}
        </AppText>
      </View>
    </View>
  );
};

const slideStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 32,
  },
  visualWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    alignItems: "center",
    gap: 14,
    width: "100%",
  },
  headline: {
    fontSize: 38,
    fontWeight: "800",
    color: Colors.onSurface,
    textAlign: isRTL ? "right" : "center",
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  headlineGold: {
    fontSize: 38,
    fontWeight: "800",
    color: Colors.primary,
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "300",
    color: Colors.secondary,
    textAlign: isRTL ? "right" : "center",
    lineHeight: 24,
    opacity: 0.85,
    paddingHorizontal: 8,
  },
});

export default SlideItem;
