import { buildCacheKey } from "../utils/cache-key.js";

describe("buildCacheKey", () => {
  it("builds a stable key for reordered query parameters", () => {
    const first = buildCacheKey("/api/v1/stories", "/", {
      difficulty: "EASY",
      topicId: "topic-1",
    });
    const second = buildCacheKey("/api/v1/stories", "/", {
      topicId: "topic-1",
      difficulty: "EASY",
    });

    expect(first).toBe("cache:api:/api/v1/stories/?difficulty=EASY&topicId=topic-1");
    expect(second).toBe(first);
  });

  it("encodes search parameters safely", () => {
    const key = buildCacheKey("/api/v1/stories", "/", {
      search: "đạo đức & xã hội",
    });

    expect(key).toBe(
      "cache:api:/api/v1/stories/?search=%C4%91%E1%BA%A1o%20%C4%91%E1%BB%A9c%20%26%20x%C3%A3%20h%E1%BB%99i",
    );
  });

  it("sorts repeated filter values", () => {
    const key = buildCacheKey("/api/v1/stories", "/", {
      difficulty: ["MEDIUM", "EASY"],
    });

    expect(key).toBe("cache:api:/api/v1/stories/?difficulty=EASY&difficulty=MEDIUM");
  });
});
