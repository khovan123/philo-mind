import {
  createAnalysisTabSchema,
  updateAnalysisTabSchema,
} from "../validators/analysis-tab.validator.js";

// ── T-D01: AnalysisTab Validator Tests ───────────────────────

const CONSEQUENCE_UUID = "550e8400-e29b-41d4-a716-446655440000";
const TAB_UUID = "6ba7b810-9dad-41d1-80b4-00c04fd430c8";

describe("createAnalysisTabSchema", () => {
  const validPayload = {
    params: { consequenceId: CONSEQUENCE_UUID },
    body: {
      tabType: "ETHICAL",
      content: "From an ethical standpoint, the choice reflects virtue ethics.",
      order: 0,
    },
  };

  it("accepts a valid ETHICAL tab", () => {
    const result = createAnalysisTabSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts all valid tabType enum values", () => {
    const types = ["ETHICAL", "PHILOSOPHICAL", "POLITICAL_ECONOMIC", "HISTORICAL"] as const;
    for (const tabType of types) {
      const result = createAnalysisTabSchema.safeParse({
        params: { consequenceId: CONSEQUENCE_UUID },
        body: { tabType, content: "analysis content", order: 0 },
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects an invalid tabType", () => {
    const result = createAnalysisTabSchema.safeParse({
      params: { consequenceId: CONSEQUENCE_UUID },
      body: { tabType: "SOCIAL", content: "content", order: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing content", () => {
    const result = createAnalysisTabSchema.safeParse({
      params: { consequenceId: CONSEQUENCE_UUID },
      body: { tabType: "ETHICAL", order: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty content string", () => {
    const result = createAnalysisTabSchema.safeParse({
      params: { consequenceId: CONSEQUENCE_UUID },
      body: { tabType: "ETHICAL", content: "  ", order: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid consequenceId", () => {
    const result = createAnalysisTabSchema.safeParse({
      params: { consequenceId: "not-a-uuid" },
      body: { tabType: "ETHICAL", content: "analysis", order: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative order", () => {
    const result = createAnalysisTabSchema.safeParse({
      params: { consequenceId: CONSEQUENCE_UUID },
      body: { tabType: "ETHICAL", content: "analysis", order: -1 },
    });
    expect(result.success).toBe(false);
  });
});

describe("updateAnalysisTabSchema", () => {
  it("accepts update with only content", () => {
    const result = updateAnalysisTabSchema.safeParse({
      params: { consequenceId: CONSEQUENCE_UUID, id: TAB_UUID },
      body: { content: "Updated analysis" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts update with only order", () => {
    const result = updateAnalysisTabSchema.safeParse({
      params: { consequenceId: CONSEQUENCE_UUID, id: TAB_UUID },
      body: { order: 2 },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty body (nothing to update)", () => {
    const result = updateAnalysisTabSchema.safeParse({
      params: { consequenceId: CONSEQUENCE_UUID, id: TAB_UUID },
      body: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid tab id", () => {
    const result = updateAnalysisTabSchema.safeParse({
      params: { consequenceId: CONSEQUENCE_UUID, id: "not-a-uuid" },
      body: { content: "content" },
    });
    expect(result.success).toBe(false);
  });
});
