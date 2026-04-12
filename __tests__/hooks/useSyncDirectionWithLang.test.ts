import { useSyncDirectionWithLang } from "@/hooks/useSyncDirectionWithLang";
import { useDirection } from "@/store/DirectionContext";
import { renderHook } from "@testing-library/react-native";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("@/store/DirectionContext", () => ({
  useDirection: jest.fn(),
}));

describe("useSyncDirectionWithLang", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets direction to ltr when lang is english", () => {
    const setDirection = jest.fn();
    (useDirection as jest.Mock).mockReturnValue({ setDirection });
    (useTranslation as jest.Mock).mockReturnValue({ i18n: { language: "en" } });

    renderHook(() => useSyncDirectionWithLang());

    expect(setDirection).toHaveBeenCalledWith("ltr");
  });

  it("sets direction to rtl when lang is arabic", () => {
    const setDirection = jest.fn();
    (useDirection as jest.Mock).mockReturnValue({ setDirection });
    (useTranslation as jest.Mock).mockReturnValue({ i18n: { language: "ar" } });

    renderHook(() => useSyncDirectionWithLang());

    expect(setDirection).toHaveBeenCalledWith("rtl");
  });
});
