import { buildChatPrompt } from "../services/ai-chat.service.js";

describe("AI Chat Service", () => {
  it("builds a prompt with character instruction and conversation history", () => {
    const prompt = buildChatPrompt(
      {
        id: "char-1",
        name: "Socrates",
        promptInstruction: "Ask the student to think through their assumptions.",
        worldview: "Truth is found through questions.",
      },
      [
        { senderType: "USER", message: "Hello" },
        { senderType: "AI", message: "Hi, how can I help?" },
      ],
      "Explain critical thinking.",
    );

    expect(prompt).toContain("You are Socrates.");
    expect(prompt).toContain("Ask the student to think through their assumptions.");
    expect(prompt).toContain("Worldview: Truth is found through questions.");
    expect(prompt).toContain("User: Hello");
    expect(prompt).toContain("Assistant: Hi, how can I help?");
    expect(prompt).toContain("User: Explain critical thinking.");
    expect(prompt.trim().endsWith("Assistant:")).toBe(true);
  });
});
