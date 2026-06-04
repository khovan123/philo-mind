import {
  listStoryScenariosSchema,
  getStoryScenarioDetailSchema,
  getStoryStatsSchema,
} from "../validators/story.validator.js";

// ── T-D02: StoryScenario Validator Tests ───────────────────────

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("listStoryScenariosSchema", () => {
  it("accepts an empty query", () => {
    const result = listStoryScenariosSchema.safeParse({ query: {} });
    expect(result.success).toBe(true);
  });

  it("accepts valid page and limit as numeric strings", () => {
    const result = listStoryScenariosSchema.safeParse({
      query: { page: "2", limit: "15" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-numeric page or limit", () => {
    const result1 = listStoryScenariosSchema.safeParse({
      query: { page: "abc" },
    });
    expect(result1.success).toBe(false);

    const result2 = listStoryScenariosSchema.safeParse({
      query: { limit: "-5" },
    });
    expect(result2.success).toBe(false);
  });

  it("accepts valid topicId", () => {
    const result = listStoryScenariosSchema.safeParse({
      query: { topicId: VALID_UUID },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid topicId uuid", () => {
    const result = listStoryScenariosSchema.safeParse({
      query: { topicId: "not-a-uuid" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid difficulty enums", () => {
    const difficulties = ["EASY", "MEDIUM", "HARD"];
    for (const diff of difficulties) {
      const result = listStoryScenariosSchema.safeParse({
        query: { difficulty: diff },
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid difficulty", () => {
    const result = listStoryScenariosSchema.safeParse({
      query: { difficulty: "EXTREME" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts search term", () => {
    const result = listStoryScenariosSchema.safeParse({
      query: { search: "Resilience" },
    });
    expect(result.success).toBe(true);
  });
});

describe("getStoryScenarioDetailSchema", () => {
  it("accepts a valid story ID parameter", () => {
    const result = getStoryScenarioDetailSchema.safeParse({
      params: { id: VALID_UUID },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid story ID parameter", () => {
    const result = getStoryScenarioDetailSchema.safeParse({
      params: { id: "not-a-uuid" },
    });
    expect(result.success).toBe(false);
  });
});

describe("getStoryStatsSchema", () => {
  it("accepts a valid story ID parameter", () => {
    const result = getStoryStatsSchema.safeParse({
      params: { id: VALID_UUID },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid story ID parameter", () => {
    const result = getStoryStatsSchema.safeParse({
      params: { id: "not-a-uuid" },
    });
    expect(result.success).toBe(false);
  });
});
