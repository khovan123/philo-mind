import {
  createStoryLearnCardSchema,
  updateStoryLearnCardSchema,
} from "../validators/story-learn-card.validator.js";

// ── T-D01: StoryLearnCard Validator Tests ─────────────────────

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const STORY_UUID = "6ba7b810-9dad-41d1-80b4-00c04fd430c8";

describe("createStoryLearnCardSchema", () => {
  const validPayload = {
    params: { storyId: STORY_UUID },
    body: {
      title: "Stoic Resilience",
      body: "Marcus Aurelius teaches that we suffer more in imagination than reality.",
      order: 0,
    },
  };

  it("accepts a valid create payload", () => {
    const result = createStoryLearnCardSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts optional sourceRef and tagIds", () => {
    const result = createStoryLearnCardSchema.safeParse({
      ...validPayload,
      body: {
        ...validPayload.body,
        sourceRef: "Meditations 5.8",
        tagIds: [VALID_UUID],
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = createStoryLearnCardSchema.safeParse({
      params: { storyId: STORY_UUID },
      body: { body: "Some content", order: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing body", () => {
    const result = createStoryLearnCardSchema.safeParse({
      params: { storyId: STORY_UUID },
      body: { title: "Card title", order: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid storyId (not uuid)", () => {
    const result = createStoryLearnCardSchema.safeParse({
      params: { storyId: "not-a-uuid" },
      body: validPayload.body,
    });
    expect(result.success).toBe(false);
  });

  it("rejects title exceeding 200 chars", () => {
    const result = createStoryLearnCardSchema.safeParse({
      params: { storyId: STORY_UUID },
      body: { title: "a".repeat(201), body: "content", order: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative order", () => {
    const result = createStoryLearnCardSchema.safeParse({
      params: { storyId: STORY_UUID },
      body: { title: "title", body: "content", order: -1 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid uuid in tagIds", () => {
    const result = createStoryLearnCardSchema.safeParse({
      params: { storyId: STORY_UUID },
      body: { title: "title", body: "content", order: 0, tagIds: ["bad-id"] },
    });
    expect(result.success).toBe(false);
  });
});

describe("updateStoryLearnCardSchema", () => {
  it("accepts partial update with only body", () => {
    const result = updateStoryLearnCardSchema.safeParse({
      params: { storyId: STORY_UUID, id: VALID_UUID },
      body: { body: "Updated content" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts replacing tagIds with empty array", () => {
    const result = updateStoryLearnCardSchema.safeParse({
      params: { storyId: STORY_UUID, id: VALID_UUID },
      body: { tagIds: [] },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty body object", () => {
    const result = updateStoryLearnCardSchema.safeParse({
      params: { storyId: STORY_UUID, id: VALID_UUID },
      body: {},
    });
    expect(result.success).toBe(false);
  });
});
