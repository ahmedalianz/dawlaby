import { COLOR_MAP, Colors } from "@/constants/colors";
import { File } from "expo-file-system";

export const convertToBase64 = async (uri: string): Promise<string | null> => {
  try {
    const file = new File(uri);
    return await file.base64();
  } catch (e) {
    console.error("Base64 conversion failed", e);
    return null;
  }
};

export const normalizeParam = (
  param: string | string[] | undefined,
): string | null => {
  if (!param) return null;
  return Array.isArray(param) ? param[0] : param;
};

export const getColorHex = (colorName: string): string => {
  const key = colorName.toLowerCase().split(" ")[0];
  return COLOR_MAP[key] ?? Colors.primary;
};
