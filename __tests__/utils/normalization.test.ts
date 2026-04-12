import { getColorHex, normalizeParam } from "@/utils/normalization";

describe("Normalization", () => {
  it("normalizeParam works", () => {
    expect(normalizeParam("x")).toBe("x");
    expect(normalizeParam(["a", "b"])).toBe("a");
    expect(normalizeParam(undefined)).toBeNull();
  });

  it("getColorHex works", () => {
    expect(getColorHex("black")).toBe("#1a1a1a");
    expect(getColorHex("navy blue")).toBe("#1a2a4a");
  });
});
