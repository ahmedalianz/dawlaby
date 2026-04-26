import { Storage } from "@/utils/storage";

describe("Storage Helper", () => {
  beforeEach(() => {
    Storage.clearAll();
  });

  it("sets and gets a string correctly", () => {
    Storage.set("test-key", "hello");
    expect(Storage.getString("test-key")).toBe("hello");
  });

  it("handles objects (JSON parsing) correctly", () => {
    const user = { id: 1, name: "Ahmed" };
    Storage.setObject("user-data", user);

    const retrieved = Storage.getObject<typeof user>("user-data");
    expect(retrieved).toEqual(user);
  });

  it("returns null if getObject fails to parse or is missing", () => {
    Storage.set("invalid-json", "not-json");
    expect(Storage.getObject("invalid-json")).toBeNull();
    expect(Storage.getObject("missing-key")).toBeNull();
  });

  it("removes a key correctly", () => {
    Storage.set("temp", "value");
    Storage.remove("temp");
    expect(Storage.contains("temp")).toBe(false);
  });
});
