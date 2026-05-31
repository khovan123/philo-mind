import {
  createTopicPerspectiveSchema,
  updateTopicPerspectiveSchema,
} from "../validators/topic-perspective.validator.js";

// ── T-H01: TopicPerspective Validator Tests ────────────────────

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const TOPIC_UUID = "6ba7b810-9dad-41d1-80b4-00c04fd430c8";

describe("createTopicPerspectiveSchema", () => {
  const validPayload = {
    params: { topicId: TOPIC_UUID },
    body: {
      perspectiveType: "TECH",
      content: "Phân tích góc nhìn công nghệ của chủ đề này...",
    },
  };

  it("accepts a valid create payload", () => {
    const result = createTopicPerspectiveSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects invalid perspectiveType", () => {
    const result = createTopicPerspectiveSchema.safeParse({
      ...validPayload,
      body: {
        ...validPayload.body,
        perspectiveType: "INVALID_TYPE",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing perspectiveType", () => {
    const result = createTopicPerspectiveSchema.safeParse({
      params: { topicId: TOPIC_UUID },
      body: { content: "Some content" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing content", () => {
    const result = createTopicPerspectiveSchema.safeParse({
      params: { topicId: TOPIC_UUID },
      body: { perspectiveType: "TECH" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty content string", () => {
    const result = createTopicPerspectiveSchema.safeParse({
      params: { topicId: TOPIC_UUID },
      body: { perspectiveType: "TECH", content: "   " },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid topicId (not uuid)", () => {
    const result = createTopicPerspectiveSchema.safeParse({
      params: { topicId: "not-a-uuid" },
      body: validPayload.body,
    });
    expect(result.success).toBe(false);
  });
});

describe("updateTopicPerspectiveSchema", () => {
  it("accepts a valid update payload", () => {
    const result = updateTopicPerspectiveSchema.safeParse({
      params: { topicId: TOPIC_UUID, id: VALID_UUID },
      body: { content: "Updated perspective content" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty content", () => {
    const result = updateTopicPerspectiveSchema.safeParse({
      params: { topicId: TOPIC_UUID, id: VALID_UUID },
      body: { content: "   " },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing content key", () => {
    const result = updateTopicPerspectiveSchema.safeParse({
      params: { topicId: TOPIC_UUID, id: VALID_UUID },
      body: {},
    });
    expect(result.success).toBe(false);
  });
});
