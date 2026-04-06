import { useDirection } from "@/store/DirectionContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useSyncDirectionWithLang = () => {
  const { i18n } = useTranslation();
  const { setDirection } = useDirection();

  useEffect(() => {
    const isArabic = i18n.language === "ar";
    setDirection(isArabic ? "rtl" : "ltr");
  }, [i18n.language, setDirection]);
};
