import {
  createTopicPerspectiveSchema,
  updateTopicPerspectiveSchema,
} from "../validators/topic-perspective.validator.js";
import { PERSPECTIVE_TYPES, TOPIC_PERSPECTIVES } from "../seed/data/topic-perspectives.js";

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

describe("TOPIC_PERSPECTIVES seed data (T-C12)", () => {
  it("defines all five perspective types for acceptance criteria", () => {
    expect(PERSPECTIVE_TYPES).toEqual(["TECH", "ETHICAL", "ECONOMIC", "SOCIAL", "PHILOSOPHICAL"]);
  });

  it("provides non-empty content for every perspective entry", () => {
    for (const topic of TOPIC_PERSPECTIVES) {
      expect(topic.perspectives).toHaveLength(5);
      for (const perspective of topic.perspectives) {
        expect(PERSPECTIVE_TYPES).toContain(perspective.perspectiveType);
        expect(perspective.content.trim().length).toBeGreaterThan(20);
      }
    }
  });

  it("uses unique topic titles in seed source", () => {
    const titles = TOPIC_PERSPECTIVES.map((topic) => topic.topicTitle);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("covers 10 topics with 50 perspective records total", () => {
    expect(TOPIC_PERSPECTIVES).toHaveLength(10);
    const totalPerspectives = TOPIC_PERSPECTIVES.reduce(
      (count, topic) => count + topic.perspectives.length,
      0,
    );
    expect(totalPerspectives).toBe(50);
  });
});
