import { analyzeImage, askText, callGeminiRaw } from "@/utils/gemini";
import axios from "axios";

const mockPost = axios.post as jest.Mock;

const mockSuccess = (text: string) => ({
  data: {
    candidates: [
      {
        content: {
          parts: [{ text }],
        },
      },
    ],
  },
});

describe("Gemini Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("askText returns parsed JSON", async () => {
    const mockData = { style_vibe: "Casual" };

    mockPost.mockResolvedValueOnce(mockSuccess(JSON.stringify(mockData)));

    const result = await askText("model", "prompt");

    expect(result).toEqual(mockData);
  });

  it("throws on API error", async () => {
    mockPost.mockRejectedValueOnce({
      response: {
        data: { error: { message: "API error" } },
      },
    });

    await expect(askText("model", "prompt")).rejects.toThrow("API error");
  });

  it("callGeminiRaw returns trimmed text", async () => {
    mockPost.mockResolvedValueOnce(mockSuccess(" hello world "));

    const result = await callGeminiRaw("model", []);

    expect(result).toBe("hello world");
  });

  it("analyzeImage sends image data", async () => {
    mockPost.mockResolvedValueOnce(mockSuccess(JSON.stringify({ ok: true })));

    await analyzeImage("model", "prompt", "base64");

    const body = mockPost.mock.calls[0][1];

    expect(body.contents[0].parts).toHaveLength(2);
    expect(body.contents[0].parts[1].inline_data.data).toBe("base64");
  });
});
