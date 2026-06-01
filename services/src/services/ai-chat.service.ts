import type { Prisma } from "../prisma/generated/client.js";
import { prisma } from "../config/prisma.js";
import { aiService, AiError } from "./ai.service.js";

const MAX_CHAT_HISTORY = 20;

export class AiChatError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "AiChatError";
  }
}

export interface AiChatPromptCharacter {
  id: string;
  name: string;
  promptInstruction: string;
  worldview?: string | null;
}

export interface AiChatMessageContext {
  senderType: "USER" | "AI";
  message: string;
}

function buildCharacterInstruction(character: AiChatPromptCharacter) {
  const pieces = [
    `You are ${character.name}.`,
    character.promptInstruction,
  ];

  if (character.worldview) {
    pieces.push(`Worldview: ${character.worldview}`);
  }

  return pieces.filter(Boolean).join(" ");
}

export function buildChatPrompt(
  character: AiChatPromptCharacter,
  history: AiChatMessageContext[],
  userMessage: string,
) {
  const lines = [buildCharacterInstruction(character), ""];

  for (const item of history) {
    if (item.senderType === "USER") {
      lines.push(`User: ${item.message}`);
    } else {
      lines.push(`Assistant: ${item.message}`);
    }
  }

  lines.push(`User: ${userMessage}`);
  lines.push("Assistant:");

  return lines.join("\n");
}

export class AiChatService {
  async createSession(
    userId: string,
    characterId: string,
    title?: string,
  ) {
    const character = await prisma.aiCharacter.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new AiChatError(
        "CHARACTER_NOT_FOUND",
        "Nhân vật AI không tồn tại",
        404,
      );
    }

    const sessionTitle = title?.trim() || `Chat với ${character.name}`;

    return prisma.aiChatSession.create({
      data: {
        userId,
        characterId,
        title: sessionTitle,
      },
      include: {
        character: true,
      },
    });
  }

  async listSessions(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [total, sessions] = await prisma.$transaction([
      prisma.aiChatSession.count({ where: { userId } }),
      prisma.aiChatSession.findMany({
        where: { userId },
        include: {
          character: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      sessions: sessions.map((session) => ({
        id: session.id,
        title: session.title,
        createdAt: session.createdAt,
        character: session.character,
        lastMessage: session.messages[0] ?? null,
      })),
    };
  }

  async getSession(userId: string, sessionId: string) {
    const session = await prisma.aiChatSession.findUnique({
      where: { id: sessionId, userId },
      include: {
        character: true,
      },
    });

    if (!session) {
      throw new AiChatError(
        "SESSION_NOT_FOUND",
        "Phiên trò chuyện không tồn tại",
        404,
      );
    }

    const messages = await prisma.aiChatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
      take: MAX_CHAT_HISTORY,
    });

    return {
      ...session,
      messages: messages.reverse(),
    };
  }

  async sendMessage(
    userId: string,
    sessionId: string,
    message: string,
  ) {
    const session = await prisma.aiChatSession.findUnique({
      where: { id: sessionId, userId },
      include: {
        character: true,
      },
    });

    if (!session) {
      throw new AiChatError(
        "SESSION_NOT_FOUND",
        "Phiên trò chuyện không tồn tại",
        404,
      );
    }

    const chatHistory = await prisma.aiChatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
      take: MAX_CHAT_HISTORY,
    });

    const context = chatHistory
      .reverse()
      .map((item) => ({
        senderType: item.senderType as "USER" | "AI",
        message: item.message,
      }));

    const userMessage = await prisma.aiChatMessage.create({
      data: {
        sessionId,
        senderType: "USER",
        message,
      },
    });

    const prompt = buildChatPrompt(session.character, context, message);

    try {
      const assistantResponse = await aiService.generate(prompt);

      const assistantMessage = await prisma.aiChatMessage.create({
        data: {
          sessionId,
          senderType: "AI",
          message: assistantResponse.text,
          metadata: {
            model: "gemini-2.5-flash",
          },
        },
      });

      return {
        sessionId,
        userMessage,
        assistantMessage,
      };
    } catch (error: unknown) {
      if (error instanceof AiError) {
        throw error;
      }

      throw new AiChatError(
        "CHAT_GENERATION_FAILED",
        error instanceof Error
          ? error.message
          : "Lỗi khi tạo phản hồi AI",
        502,
      );
    }
  }

  async *streamMessage(
    userId: string,
    sessionId: string,
    message: string,
  ): AsyncGenerator<string> {
    const session = await prisma.aiChatSession.findUnique({
      where: { id: sessionId, userId },
      include: {
        character: true,
      },
    });

    if (!session) {
      throw new AiChatError(
        "SESSION_NOT_FOUND",
        "Phiên trò chuyện không tồn tại",
        404,
      );
    }

    const chatHistory = await prisma.aiChatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
      take: MAX_CHAT_HISTORY,
    });

    const context = chatHistory
      .reverse()
      .map((item) => ({
        senderType: item.senderType as "USER" | "AI",
        message: item.message,
      }));

    const userMessage = await prisma.aiChatMessage.create({
      data: {
        sessionId,
        senderType: "USER",
        message,
      },
    });

    const prompt = buildChatPrompt(session.character, context, message);
    let assistantText = "";

    try {
      for await (const chunk of aiService.stream(prompt)) {
        assistantText += chunk;
        yield chunk;
      }

      await prisma.aiChatMessage.create({
        data: {
          sessionId,
          senderType: "AI",
          message: assistantText,
          metadata: {
            model: "gemini-2.5-flash",
          },
        },
      });
    } catch (error: unknown) {
      if (error instanceof AiError) {
        throw error;
      }

      throw new AiChatError(
        "STREAM_GENERATION_FAILED",
        error instanceof Error ? error.message : "Lỗi khi stream phản hồi AI",
        502,
      );
    }
  }
}

export const aiChatService = new AiChatService();
