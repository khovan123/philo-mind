import {
  startStorySessionSchema,
  decideStorySessionSchema,
  completeStorySessionSchema,
} from "../validators/story-session.validator.js";

// ── T-D03: StorySession Validator Tests ───────────────────────

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const OTHER_VALID_UUID = "6ba7b810-9dad-41d1-80b4-00c04fd430c8";

describe("startStorySessionSchema", () => {
  it("accepts a valid storyId parameter", () => {
    const result = startStorySessionSchema.safeParse({
      params: { storyId: VALID_UUID },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid storyId parameter", () => {
    const result = startStorySessionSchema.safeParse({
      params: { storyId: "not-a-uuid" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing storyId parameter", () => {
    const result = startStorySessionSchema.safeParse({
      params: {},
    });
    expect(result.success).toBe(false);
  });
});

describe("decideStorySessionSchema", () => {
  const validPayload = {
    params: { sessionId: VALID_UUID },
    body: {
      choiceId: OTHER_VALID_UUID,
      userReason: "I decided to choose this because of Stoic reason.",
    },
  };

  it("accepts a valid decision payload", () => {
    const result = decideStorySessionSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts a valid decision payload without userReason", () => {
    const result = decideStorySessionSchema.safeParse({
      params: { sessionId: VALID_UUID },
      body: {
        choiceId: OTHER_VALID_UUID,
      },
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty userReason after trimming", () => {
    const result = decideStorySessionSchema.safeParse({
      params: { sessionId: VALID_UUID },
      body: {
        choiceId: OTHER_VALID_UUID,
        userReason: "   ",
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body.userReason).toBe("");
    }
  });

  it("rejects invalid sessionId", () => {
    const result = decideStorySessionSchema.safeParse({
      ...validPayload,
      params: { sessionId: "not-a-uuid" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid choiceId", () => {
    const result = decideStorySessionSchema.safeParse({
      ...validPayload,
      body: {
        ...validPayload.body,
        choiceId: "not-a-uuid",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing choiceId", () => {
    const result = decideStorySessionSchema.safeParse({
      params: { sessionId: VALID_UUID },
      body: {
        userReason: "Just a reason",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects userReason exceeding 1000 characters", () => {
    const result = decideStorySessionSchema.safeParse({
      params: { sessionId: VALID_UUID },
      body: {
        choiceId: OTHER_VALID_UUID,
        userReason: "a".repeat(1001),
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("completeStorySessionSchema", () => {
  it("accepts a valid sessionId parameter", () => {
    const result = completeStorySessionSchema.safeParse({
      params: { sessionId: VALID_UUID },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid sessionId parameter", () => {
    const result = completeStorySessionSchema.safeParse({
      params: { sessionId: "not-a-uuid" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing sessionId parameter", () => {
    const result = completeStorySessionSchema.safeParse({
      params: {},
    });
    expect(result.success).toBe(false);
  });
});
