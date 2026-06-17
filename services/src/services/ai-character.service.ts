import { prisma } from "../config/prisma.js";

export class AiCharacterError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 500,
  ) {
    super(message);
    this.name = "AiCharacterError";
  }
}

export class AiCharacterService {
  async getAll(_topicId?: string) {
    const characters = await prisma.aiCharacter.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return characters;
  }

  async getById(id: string) {
    const character = await prisma.aiCharacter.findUnique({
      where: { id },
    });

    if (!character) {
      throw new AiCharacterError("CHARACTER_NOT_FOUND", "AI Character not found", 404);
    }

    return {
      ...character,
      starterPrompts: [
        `Bạn là ai?`,
        `${character.name} nghĩ gì về xã hội hiện đại?`,
        `${character.name} có quan điểm gì về đạo đức?`,
      ],
    };
  }

  async create(data: {
    name: string;
    type: string;
    bio?: string;
    worldview?: string;
    promptInstruction: string;
  }) {
    const existing = await prisma.aiCharacter.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existing) {
      throw new AiCharacterError("CHARACTER_ALREADY_EXISTS", "Character already exists", 409);
    }

    return prisma.aiCharacter.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      type?: string;
      bio?: string;
      worldview?: string;
      promptInstruction?: string;
    },
  ) {
    await this.getById(id);

    return prisma.aiCharacter.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.getById(id);

    await prisma.aiCharacter.delete({
      where: { id },
    });

    return {
      deleted: true,
    };
  }
}

export const aiCharacterService = new AiCharacterService();
