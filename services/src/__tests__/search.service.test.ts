import { jest } from "@jest/globals";

// Mock env before any imports
jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    PORT: 3001,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://ci:ci@localhost:5432/ci",
    JWT_SECRET: "test-secret-at-least-32-characters-long",
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    LOG_LEVEL: "error",
  },
}));

const mockQueryRaw = jest.fn<(...args: any[]) => Promise<any>>();
const mockQueryRawUnsafe = jest.fn<(...args: any[]) => Promise<any>>();
const mockExecuteRaw = jest.fn<(...args: any[]) => Promise<any>>();
const mockExecuteRawUnsafe = jest.fn<(...args: any[]) => Promise<any>>();

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    $queryRaw: mockQueryRaw,
    $queryRawUnsafe: mockQueryRawUnsafe,
    $executeRaw: mockExecuteRaw,
    $executeRawUnsafe: mockExecuteRawUnsafe,
    chapterNode: { update: jest.fn() },
    movie: { update: jest.fn() },
    quiz: { update: jest.fn() },
  },
}));

jest.unstable_mockModule("../services/ai.service.js", () => ({
  aiService: {
    getEmbedding: jest.fn<() => Promise<number[]>>().mockResolvedValue(new Array(3072).fill(0.1)),
  },
}));

const { searchService } = await import("../services/search.service.js");

describe("SearchService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty array when query is empty or whitespace", async () => {
    const results = await searchService.search("   ");
    expect(results).toEqual([]);
  });

  it("should handle missing search_documents relation gracefully during FTS search", async () => {
    // Mock FTS to throw missing relation error 42P01
    mockQueryRaw.mockImplementationOnce(() => {
      const err: any = new Error('relation "search_documents" does not exist');
      err.code = "P2010";
      return Promise.reject(err);
    });

    // Mock pgvector semantic search to return 1 item
    mockQueryRawUnsafe.mockResolvedValueOnce([
      {
        id: "lesson-1",
        type: "lesson",
        title: "Giá trị thặng dư",
        subtitle: "Chương 3 - Mục 1",
        routeParams: { chapter: "3", muc: "1" },
        semanticScore: 0.85,
        semanticRank: 1,
      },
    ]);

    // Mock initializeSearchIndexes calls
    mockExecuteRaw.mockResolvedValue(0);
    mockExecuteRawUnsafe.mockResolvedValue(0);

    const results = await searchService.search("thặng dư");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe("lesson-1");
    expect(results[0].title).toBe("Giá trị thặng dư");
  });

  it("should fall back to direct source table keyword search if search_documents is missing and FTS/semantic search return 0 items", async () => {
    // FTS fails with relation missing error
    mockQueryRaw.mockImplementationOnce(() => {
      const err: any = new Error('relation "search_documents" does not exist');
      err.code = "P2010";
      return Promise.reject(err);
    });

    // Semantic search returns no items
    mockQueryRawUnsafe.mockResolvedValueOnce([]);

    // Fallback search_documents query fails
    mockQueryRaw.mockImplementationOnce(() => {
      const err: any = new Error('relation "search_documents" does not exist');
      err.code = "P2010";
      return Promise.reject(err);
    });

    // Direct source table keyword search returns 1 fallback item
    mockQueryRawUnsafe.mockResolvedValueOnce([
      {
        id: "lesson-fallback-1",
        type: "lesson",
        title: "Giá trị thặng dư trong Hàng hóa",
        subtitle: "Chương 3 - Mục 2",
        routeParams: { chapter: "3", muc: "2" },
        ftsScore: 1.0,
        ftsRank: 1,
      },
    ]);

    // Mock initializeSearchIndexes calls
    mockExecuteRaw.mockResolvedValue(0);
    mockExecuteRawUnsafe.mockResolvedValue(0);

    const results = await searchService.search("thặng dư");

    expect(results.length).toBe(1);
    expect(results[0].id).toBe("lesson-fallback-1");
    expect(results[0].title).toBe("Giá trị thặng dư trong Hàng hóa");
  });
});
