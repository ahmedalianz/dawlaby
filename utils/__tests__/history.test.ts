import {
  clearHistory,
  deleteHistoryItem,
  getHistory,
  getHistoryItem,
  saveToHistory,
} from "@/utils/history";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mockItem = {
  imageUri: "file://image.jpg",
  result: {
    style_vibe: "Casual",
  },
};

describe("History Utils", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("saves item", async () => {
    const item = await saveToHistory(mockItem as any);

    expect(item?.id).toBeDefined();
    expect(item?.imageUri).toBe("file://image.jpg");
  });

  it("returns latest first", async () => {
    await saveToHistory({ ...mockItem, imageUri: "1" } as any);
    await saveToHistory({ ...mockItem, imageUri: "2" } as any);

    const history = await getHistory();

    expect(history[0].imageUri).toBe("2");
  });

  it("deletes item", async () => {
    const item = await saveToHistory(mockItem as any);

    await deleteHistoryItem(item!.id);

    const result = await getHistoryItem(item!.id);
    expect(result).toBeNull();
  });

  it("clears history", async () => {
    await saveToHistory(mockItem as any);
    await clearHistory();

    const history = await getHistory();
    expect(history).toEqual([]);
  });
});
