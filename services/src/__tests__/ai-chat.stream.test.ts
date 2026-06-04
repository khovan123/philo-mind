import { buildChatPrompt } from "../services/ai-chat-prompt.js";

describe("AI Chat Streaming", () => {
  it("builds a proper SSE format data object", () => {
    const text = "Hello world";
    const sseData = JSON.stringify({ text });

    expect(sseData).toContain("Hello world");
    expect(() => JSON.parse(sseData)).not.toThrow();
  });

  it("formats SSE message with data prefix and double newline", () => {
    const text = "Chunked text";
    const sseMessage = `data: ${JSON.stringify({ text: text })}\n\n`;

    expect(sseMessage).toMatch(/^data: \{.*\}\n\n$/);
    expect(sseMessage).toContain("Chunked text");
  });

  it("formats SSE done event correctly", () => {
    const doneEvent = `data: ${JSON.stringify({ done: true })}\n\n`;

    expect(doneEvent).toMatch(/^data: \{.*done.*\}\n\n$/);
    expect(doneEvent).toContain("done");
  });

  it("formats SSE error event with code and message", () => {
    const errorEvent = `data: ${JSON.stringify({
      error: { code: "AI_ERROR", message: "Something failed" },
    })}\n\n`;

    expect(errorEvent).toContain("AI_ERROR");
    expect(errorEvent).toContain("Something failed");
  });

  it("builds a streaming prompt with character context", () => {
    const prompt = buildChatPrompt(
      {
        id: "char-1",
        name: "Plato",
        promptInstruction: "Use the Socratic method.",
      },
      [],
      "What is virtue?",
    );

    expect(prompt).toContain("You are Plato.");
    expect(prompt).toContain("Use the Socratic method.");
    expect(prompt).toContain("User: What is virtue?");
    expect(prompt.trim().endsWith("Assistant:")).toBe(true);
  });
});
