import { getConsequenceByChoiceSchema } from "../validators/choice.validator.js";

// ── T-D04: Choice Consequence Validator Tests ──────────────────

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("getConsequenceByChoiceSchema", () => {
  it("accepts a valid choiceId parameter", () => {
    const result = getConsequenceByChoiceSchema.safeParse({
      params: { choiceId: VALID_UUID },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid choiceId parameter", () => {
    const result = getConsequenceByChoiceSchema.safeParse({
      params: { choiceId: "not-a-uuid" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing choiceId parameter", () => {
    const result = getConsequenceByChoiceSchema.safeParse({
      params: {},
    });
    expect(result.success).toBe(false);
  });
});
