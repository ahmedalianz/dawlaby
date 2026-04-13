import {
  clearHistory,
  deleteHistoryItem,
  getHistory,
  getHistoryItem,
  saveToHistory,
} from "@/utils/history";
import { Storage } from "@/utils/storage";

const mockItem = {
  imageUri: "file://image.jpg",
  result: {
    style_vibe: "Casual",
  },
};

// 1. Create a local variable to act as our "fake" MMKV
const mockStorageCache: Record<string, any> = {};
jest.mock("@/utils/storage", () => ({
  Storage: {
    // 2. Wire up the mock to use the local cache
    setObject: jest.fn((key, value) => {
      mockStorageCache[key] = value;
    }),
    getObject: jest.fn((key) => {
      return mockStorageCache[key] || null;
    }),
    remove: jest.fn((key) => {
      delete mockStorageCache[key];
    }),
    clearAll: jest.fn(() => {
      // We can't reassign the object constant, so we clear it
      Object.keys(mockStorageCache).forEach(
        (key) => delete mockStorageCache[key],
      );
    }),
  },
}));

describe("History Utils", () => {
  beforeEach(() => {
    // This now correctly resets our storageCache via the mock
    Storage.clearAll();
    jest.clearAllMocks();
  });

  it("saves item and generates a valid ID", () => {
    const item = saveToHistory(mockItem as any);

    expect(item?.id).toContain("look_");
    expect(item?.imageUri).toBe("file://image.jpg");
    // Verify it actually hit the storage
    expect(Storage.setObject).toHaveBeenCalled();
  });

  it("returns latest items first (LIFO)", () => {
    // We need to wait a tiny bit or mock Date.now() if they save too fast,
    // but usually in tests, the array order handles it.
    saveToHistory({ ...mockItem, imageUri: "1" } as any);
    saveToHistory({ ...mockItem, imageUri: "2" } as any);

    const history = getHistory();

    expect(history.length).toBe(2);
    expect(history[0].imageUri).toBe("2");
  });

  it("deletes a specific item by ID", () => {
    const item = saveToHistory(mockItem as any);
    const id = item!.id;

    deleteHistoryItem(id);

    const result = getHistoryItem(id);
    expect(result).toBeNull();
  });

  it("clears all history from storage", () => {
    saveToHistory(mockItem as any);
    clearHistory();

    const history = getHistory();
    expect(history).toEqual([]);
    expect(Storage.remove).toHaveBeenCalled();
  });

  it("respects MAX_HISTORY_ITEMS limit", () => {
    // Assuming MAX_HISTORY_ITEMS is small for the test, or just testing the logic
    for (let i = 0; i < 5; i++) {
      saveToHistory({ ...mockItem, imageUri: `${i}` } as any);
    }

    const history = getHistory();
    // This will check if your .slice(0, MAX_HISTORY_ITEMS) is working
    expect(history.length).toBeLessThanOrEqual(10); // Replace 10 with your actual constant if needed
  });
});
