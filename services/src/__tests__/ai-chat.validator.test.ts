import {
  createChatSessionSchema,
  listChatSessionsSchema,
  sendChatMessageSchema,
  sessionIdSchema,
} from "../validators/ai-chat.validator.js";

describe("AI Chat Validator", () => {
  it("validates session creation payload", () => {
    const payload = {
      body: {
        characterId: "47fdccee-7f0a-4864-8ace-0d95c0068e74",
        title: "Socratic tutor",
      },
    };

    expect(createChatSessionSchema.parse(payload)).toEqual(payload);
  });

  it("rejects invalid session creation payload", () => {
    const result = createChatSessionSchema.safeParse({ body: { characterId: "bad-id" } });

    expect(result.success).toBe(false);
  });

  it("validates list sessions query parameters", () => {
    expect(listChatSessionsSchema.parse({ query: { page: "2", limit: "10" } })).toEqual({
      query: { page: "2", limit: "10" },
    });
  });

  it("validates session ID route param", () => {
    const params = { params: { id: "4b9d3a8b-1dd0-44c9-9e0d-a531b31a9f6b" } };

    expect(sessionIdSchema.parse(params)).toEqual(params);
  });

  it("rejects invalid message payload", () => {
    const result = sendChatMessageSchema.safeParse({
      params: { id: "bad" },
      body: { message: "" },
    });

    expect(result.success).toBe(false);
  });
});
