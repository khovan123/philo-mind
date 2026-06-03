type Session = { id: string; title?: string; characterId?: string; createdAt: string };
type Message = {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const useMock = true; // Flip to false when backend ready

// Simple in-memory mock storage
const sessions: Record<string, Session> = {};
const messages: Record<string, Message[]> = {};

function makeId(prefix = "s") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export const aiChatService = {
  async createSession({ characterId, title }: { characterId: string; title?: string }) {
    if (!useMock) {
      const res = await fetch("/api/v1/ai/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, title }),
      });
      return await res.json();
    }

    const id = makeId("sess");
    const s: Session = { id, characterId, title, createdAt: new Date().toISOString() };
    sessions[id] = s;
    messages[id] = [];
    return { id: s.id, title: s.title };
  },

  async getSession(sessionId: string) {
    if (!useMock) {
      const res = await fetch(`/api/v1/ai/chat/sessions/${sessionId}`);
      return await res.json();
    }
    const s = sessions[sessionId];
    if (!s) throw new Error("Not found");
    return s;
  },

  // sendMessage supports an optional onProgress callback for streaming text
  async sendMessage(
    sessionId: string,
    prompt: string,
    onProgress?: (chunk: string) => void,
  ): Promise<Message> {
    if (!useMock) {
      const res = await fetch(`/api/v1/ai/chat/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      return await res.json();
    }

    // Create user message
    const userMsg: Message = {
      id: makeId("m"),
      sessionId,
      role: "user",
      content: prompt,
      createdAt: new Date().toISOString(),
    };
    messages[sessionId].push(userMsg);

    // Simulate streaming assistant response by calling onProgress repeatedly
    const full = `Responding to: ${prompt.split(" ").slice(0, 20).join(" ")}...`;
    const parts = full.match(/.{1,18}/g) ?? [full];

    let buffer = "";
    for (const part of parts) {
      // small delay to simulate stream
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 120));
      buffer += part;
      if (onProgress) onProgress(buffer);
    }

    const assistantMsg: Message = {
      id: makeId("m"),
      sessionId,
      role: "assistant",
      content: full,
      createdAt: new Date().toISOString(),
    };
    messages[sessionId].push(assistantMsg);

    return assistantMsg;
  },

  // helper to list messages
  async listMessages(sessionId: string) {
    if (!useMock) {
      const res = await fetch(`/api/v1/ai/chat/sessions/${sessionId}/messages`);
      return await res.json();
    }
    return messages[sessionId] ?? [];
  },
};

export type { Session, Message };
