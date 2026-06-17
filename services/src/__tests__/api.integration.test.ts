import { jest } from "@jest/globals";
import crypto from "crypto";
import request from "supertest";

// 1. Setup environment variables
process.env.PORT = "3001";
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://ci:ci@localhost:5432/ci";
process.env.JWT_SECRET = "test-secret-at-least-32-characters-long";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-at-least-32-characters-long";
process.env.GEMINI_API_KEY = "mock-gemini-api-key-at-least-32-chars-long";

// 2. Mock external services
const mockEmailState = { lastSentCode: "" };
jest.unstable_mockModule("../utils/email.js", () => ({
  sendResetEmail: jest.fn(async (to: string, code: string) => {
    mockEmailState.lastSentCode = code;
  }),
}));

jest.unstable_mockModule("@google/generative-ai", () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: async () => ({
          response: { text: () => "Mock philosophical response" },
        }),
      };
    }
  },
  HarmBlockThreshold: {
    BLOCK_MEDIUM_AND_ABOVE: "BLOCK_MEDIUM_AND_ABOVE",
  },
  HarmCategory: {
    HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
    HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
    HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
    HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  },
}));

jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    PORT: 3001,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://ci:ci@localhost:5432/ci",
    JWT_SECRET: "test-secret-at-least-32-characters-long",
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    LOG_LEVEL: "error",
    GEMINI_API_KEY: "mock-gemini-api-key-at-least-32-chars-long",
  },
}));

jest.unstable_mockModule("../services/redis.service.js", () => ({
  redis: {
    isConnected: () => false,
    get: async () => null,
    set: async () => {},
    delPattern: async () => {},
  },
}));

jest.unstable_mockModule("../services/activity-log.service.js", () => ({
  ActivityLogService: {
    logActivity: jest.fn(async () => ({ newlyEarnedBadges: [] })),
  },
  ActivityType: {
    DECIDE_STORY: "DECIDE_STORY",
    DO_QUIZ: "DO_QUIZ",
  },
}));

const TOPIC_UUID = "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d";
const LESSON_UUID = "b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e";
const QUIZ_UUID = "c3d4e5f6-a7b8-4c7d-8e1f-2a3b4c5d6e7f";
const QUESTION_UUID = "d4e5f6a7-b8c9-4d8e-9f2a-3b4c5d6e7f8a";
const OPTION_UUID_1 = "e5f6a7b8-c9d0-4e9f-8a3b-4c5d6e7f8a9b";
const OPTION_UUID_2 = "f6a7b8c9-d0e1-4fa0-9b4c-5d6e7f8a9b0c";
const STORY_UUID = "a7b8c9d0-e1f2-41a1-8c9d-0e1f2a3b4c5d";
const CHOICE_UUID = "b8c9d0e1-f2a3-42b2-9d0e-1f2a3b4c5d6e";
const CONSEQUENCE_UUID = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d";
const NONEXISTENT_UUID = "00000000-0000-4000-a000-000000000000";

// 3. Database simulation in-memory
const db = {
  users: [] as any[],
  userSessions: [] as any[],
  refreshTokens: [] as any[],
  passwordResets: [] as any[],
  topics: [] as any[],
  lessons: [] as any[],
  quizzes: [] as any[],
  quizQuestions: [] as any[],
  quizAttempts: [] as any[],
  quizAttemptAnswers: [] as any[],
  storyScenarios: [] as any[],
  storySessions: [] as any[],
  storyChoices: [] as any[],
  storyDecisions: [] as any[],
};

function resetDb() {
  mockEmailState.lastSentCode = "";
  db.users = [];
  db.userSessions = [];
  db.refreshTokens = [];
  db.passwordResets = [];
  db.quizAttempts = [];
  db.quizAttemptAnswers = [];
  db.storySessions = [];
  db.storyDecisions = [];

  db.topics = [
    {
      id: TOPIC_UUID,
      title: "Stoicism",
      category: "Ethics",
      difficulty: "MEDIUM",
      description: "Stoic philosophy",
    },
  ];

  db.lessons = [
    {
      id: LESSON_UUID,
      topicId: TOPIC_UUID,
      title: "Introduction to Stoicism",
      conflict: "How to handle adversity",
      estimatedMinutes: 5,
      content: "Content about Stoicism...",
      topic: db.topics[0],
      status: "PUBLISHED",
      questions: [],
    },
  ];

  db.quizzes = [
    {
      id: QUIZ_UUID,
      lessonId: LESSON_UUID,
      title: "Stoicism Quiz",
      lesson: db.lessons[0],
      questions: [],
    },
  ];

  db.quizQuestions = [
    {
      id: QUESTION_UUID,
      quizId: QUIZ_UUID,
      question: "What is dichotomy of control?",
      options: [
        {
          id: OPTION_UUID_1,
          optionText: "Focusing only on what is in our power",
          isCorrect: true,
          questionId: QUESTION_UUID,
        },
        {
          id: OPTION_UUID_2,
          optionText: "Controlling other people",
          isCorrect: false,
          questionId: QUESTION_UUID,
        },
      ],
    },
  ];

  db.quizzes[0].questions = [
    {
      id: QUESTION_UUID,
      question: "What is dichotomy of control?",
      options: [
        {
          id: OPTION_UUID_1,
          optionText: "Focusing only on what is in our power",
          isCorrect: true,
        },
        {
          id: OPTION_UUID_2,
          optionText: "Controlling other people",
          isCorrect: false,
        },
      ],
    },
  ] as any;

  db.storyScenarios = [
    {
      id: STORY_UUID,
      title: "Marcus Aurelius on the Frontlines",
      description: "Faced with pandemic and war",
      topicId: TOPIC_UUID,
      difficulty: "MEDIUM",
      topic: db.topics[0],
      choices: [],
      learnCards: [],
    },
  ];

  db.storyChoices = [
    {
      id: CHOICE_UUID,
      storyId: STORY_UUID,
      choiceText: "Retreat and preserve your health",
      consequences: [
        {
          id: CONSEQUENCE_UUID,
          choiceId: CHOICE_UUID,
          type: "IMMEDIATE",
          text: "You chose to retreat.",
          analysisTabs: [],
        },
      ],
    },
  ];

  db.storyScenarios[0].choices = [
    {
      id: CHOICE_UUID,
      choiceText: "Retreat and preserve your health",
      consequences: [
        {
          id: CONSEQUENCE_UUID,
          choiceId: CHOICE_UUID,
          type: "IMMEDIATE",
          text: "You chose to retreat.",
          analysisTabs: [],
        },
      ],
    },
  ] as any;
}

const mockPrisma = {
  $transaction: async (arg: any) => {
    if (typeof arg === "function") return arg(mockPrisma);
    if (Array.isArray(arg)) return Promise.all(arg);
    return arg;
  },
  user: {
    findUnique: jest.fn(async (args: any) => {
      const email = args?.where?.email;
      const id = args?.where?.id;
      return db.users.find((u) => (email && u.email === email) || (id && u.id === id)) || null;
    }),
    create: jest.fn(async (args: any) => {
      const newUser = {
        id: `user-${db.users.length + 1}`,
        email: args.data.email,
        passwordHash: args.data.passwordHash || "hashed-password",
        fullName: args.data.fullName,
        role: args.data.role || "USER",
        isActive: args.data.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.users.push(newUser);
      return newUser;
    }),
    update: jest.fn(async (args: any) => {
      const id = args.where.id;
      const user = db.users.find((u) => u.id === id);
      if (!user) throw new Error("User not found");
      Object.assign(user, args.data);
      return user;
    }),
  },
  userSession: {
    create: jest.fn(async (args: any) => {
      const s = {
        id: crypto.randomUUID(),
        userId: args.data.userId,
        status: args.data.status ?? "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.userSessions.push(s);
      return s;
    }),
    update: jest.fn(async (args: any) => {
      const s = db.userSessions.find((x) => x.id === args.where.id);
      if (s) Object.assign(s, args.data);
      return s;
    }),
    updateMany: jest.fn(async (args: any) => {
      const userId = args.where.userId;
      const matching = db.userSessions.filter((x) => x.userId === userId);
      matching.forEach((x) => Object.assign(x, args.data));
      return { count: matching.length };
    }),
  },
  refreshToken: {
    findUnique: jest.fn(async (args: any) => {
      const tokenHash = args.where.tokenHash;
      const t = db.refreshTokens.find((t) => t.tokenHash === tokenHash) || null;
      if (!t) return null;
      let session = null;
      if (args.include?.session) {
        session = db.userSessions.find((s) => s.id === t.sessionId) || null;
      }
      return {
        ...t,
        session,
      };
    }),
    create: jest.fn(async (args: any) => {
      const t = {
        id: crypto.randomUUID(),
        tokenHash: args.data.tokenHash,
        userId: args.data.userId,
        sessionId: args.data.sessionId,
        revokedAt: args.data.revokedAt || null,
        expiresAt: args.data.expiresAt,
        createdAt: new Date(),
      };
      db.refreshTokens.push(t);
      return t;
    }),
    update: jest.fn(async (args: any) => {
      const t = db.refreshTokens.find((x) => x.id === args.where.id);
      if (t) Object.assign(t, args.data);
      return t;
    }),
    updateMany: jest.fn(async (args: any) => {
      const userId = args.where.userId;
      const matching = db.refreshTokens.filter((x) => x.userId === userId);
      matching.forEach((x) => Object.assign(x, args.data));
      return { count: matching.length };
    }),
  },
  passwordReset: {
    create: jest.fn(async (args: any) => {
      const r = {
        id: `reset-${db.passwordResets.length + 1}`,
        userId: args.data.userId || null,
        email: args.data.email,
        codeHash: args.data.codeHash,
        tokenHash: args.data.tokenHash,
        attempts: args.data.attempts ?? 0,
        expiresAt: args.data.expiresAt,
        usedAt: null,
        createdAt: new Date(),
      };
      db.passwordResets.push(r);
      return r;
    }),
    findFirst: jest.fn(async (args: any) => {
      const { email, tokenHash, usedAt, expiresAt } = args.where;
      return (
        db.passwordResets.find((r) => {
          if (email && r.email !== email) return false;
          if (tokenHash && r.tokenHash !== tokenHash) return false;
          if (usedAt === null && r.usedAt !== null) return false;
          if (expiresAt && expiresAt.gt) {
            if (r.expiresAt <= expiresAt.gt) return false;
          }
          return true;
        }) || null
      );
    }),
    update: jest.fn(async (args: any) => {
      const r = db.passwordResets.find((x) => x.id === args.where.id);
      if (r) {
        if (args.data.attempts?.increment) {
          r.attempts += args.data.attempts.increment;
        } else {
          Object.assign(r, args.data);
        }
      }
      return r;
    }),
  },
  topic: {
    findMany: jest.fn(async () => db.topics),
    count: jest.fn(async () => db.topics.length),
    findUnique: jest.fn(async (args: any) => {
      return db.topics.find((t) => t.id === args.where.id) || null;
    }),
  },
  lesson: {
    findMany: jest.fn(async () => db.lessons),
    count: jest.fn(async () => db.lessons.length),
    findUnique: jest.fn(async (args: any) => {
      const l = db.lessons.find((l) => l.id === args.where.id);
      if (!l) return null;
      return {
        ...l,
        questions: l.questions || [],
      };
    }),
  },
  storyScenario: {
    findMany: jest.fn(async () => db.storyScenarios),
    count: jest.fn(async () => db.storyScenarios.length),
    findUnique: jest.fn(async (args: any) => {
      return db.storyScenarios.find((s) => s.id === args.where.id) || null;
    }),
  },
  storySession: {
    findFirst: jest.fn(async (args: any) => {
      return (
        db.storySessions.find(
          (s) =>
            s.userId === args.where.userId &&
            s.storyId === args.where.storyId &&
            s.status === args.where.status,
        ) || null
      );
    }),
    findUnique: jest.fn(async (args: any) => {
      return db.storySessions.find((s) => s.id === args.where.id) || null;
    }),
    create: jest.fn(async (args: any) => {
      const s = {
        id: crypto.randomUUID(),
        userId: args.data.userId,
        storyId: args.data.storyId,
        status: args.data.status,
        decisions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.storySessions.push(s);
      return s;
    }),
    update: jest.fn(async (args: any) => {
      const s = db.storySessions.find((x) => x.id === args.where.id);
      if (s) {
        Object.assign(s, args.data);
      }
      return s;
    }),
    groupBy: jest.fn(async () => []),
  },
  storyChoice: {
    findUnique: jest.fn(async (args: any) => {
      const choice = db.storyChoices.find((c) => c.id === args.where.id);
      if (!choice) return null;
      return choice;
    }),
  },
  storyDecision: {
    findFirst: jest.fn(async (args: any) => {
      const d = db.storyDecisions.find(
        (d) => d.sessionId === args.where.sessionId && d.choiceId === args.where.choiceId,
      );
      if (!d) return null;
      return {
        ...d,
        choice: db.storyChoices.find((c) => c.id === d.choiceId),
      };
    }),
    create: jest.fn(async (args: any) => {
      const d = {
        id: crypto.randomUUID(),
        sessionId: args.data.sessionId,
        userId: args.data.userId,
        choiceId: args.data.choiceId,
        userReason: args.data.userReason,
        choice: db.storyChoices.find((c) => c.id === args.data.choiceId),
        createdAt: new Date(),
      };
      db.storyDecisions.push(d);
      return d;
    }),
    groupBy: jest.fn(async () => []),
  },
  quiz: {
    findMany: jest.fn(async () => db.quizzes),
    count: jest.fn(async () => db.quizzes.length),
    findFirst: jest.fn(async (args: any) => {
      return db.quizzes.find((q) => q.lessonId === args.where.lessonId) || null;
    }),
    findUnique: jest.fn(async (args: any) => {
      return db.quizzes.find((q) => q.id === args.where.id) || null;
    }),
  },
  quizAttempt: {
    create: jest.fn(async (args: any) => {
      const a = {
        id: crypto.randomUUID(),
        quizId: args.data.quizId,
        userId: args.data.userId,
        score: args.data.score,
        createdAt: new Date(),
        answers: [],
        quiz: db.quizzes.find((q) => q.id === args.data.quizId),
      };
      db.quizAttempts.push(a);
      return a;
    }),
    findFirst: jest.fn(async (args: any) => {
      const { id, userId, quizId, completedAt } = args.where;
      const attempt = db.quizAttempts.find((a) => {
        if (id && a.id !== id) return false;
        if (userId && a.userId !== userId) return false;
        if (quizId && a.quizId !== quizId) return false;
        if (completedAt === null && a.completedAt !== undefined && a.completedAt !== null)
          return false;
        return true;
      });
      if (attempt) {
        attempt.answers = db.quizAttemptAnswers.filter((ans) => ans.attemptId === attempt.id);
        attempt.quiz = db.quizzes.find((q) => q.id === attempt.quizId);
      }
      return attempt || null;
    }),
    findUnique: jest.fn(async (args: any) => {
      const id = args.where.id;
      const attempt = db.quizAttempts.find((a) => a.id === id);
      if (attempt) {
        attempt.answers = db.quizAttemptAnswers.filter((ans) => ans.attemptId === attempt.id);
        attempt.quiz = db.quizzes.find((q) => q.id === attempt.quizId);
      }
      return attempt || null;
    }),
    update: jest.fn(async (args: any) => {
      const a = db.quizAttempts.find((x) => x.id === args.where.id);
      if (a) Object.assign(a, args.data);
      return a;
    }),
  },
  quizQuestion: {
    findUnique: jest.fn(async (args: any) => {
      return db.quizQuestions.find((q) => q.id === args.where.id) || null;
    }),
  },
  quizAttemptAnswer: {
    findFirst: jest.fn(async (args: any) => {
      return (
        db.quizAttemptAnswers.find(
          (ans) =>
            ans.attemptId === args.where.attemptId && ans.questionId === args.where.questionId,
        ) || null
      );
    }),
    create: jest.fn(async (args: any) => {
      const ans = {
        id: crypto.randomUUID(),
        attemptId: args.data.attemptId,
        questionId: args.data.questionId,
        selectedOptionId: args.data.selectedOptionId,
        textAnswer: args.data.textAnswer,
        isCorrect: args.data.isCorrect,
      };
      db.quizAttemptAnswers.push(ans);
      return ans;
    }),
    update: jest.fn(async (args: any) => {
      const ans = db.quizAttemptAnswers.find((x) => x.id === args.where.id);
      if (ans) Object.assign(ans, args.data);
      return ans;
    }),
  },
};

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: mockPrisma,
}));

// Mock bcryptjs
jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: async (pw: string) => "hashed-" + pw,
    compare: async (pw: string, hash: string) => hash === "hashed-" + pw || hash === pw,
  },
}));

const { default: app } = await import("../index.js");

describe("API Integration Tests (In-Memory DB)", () => {
  const testEmail = "test.integration@example.com";
  const testPassword = "Password123!";
  const testFullName = "Test Integration User";

  beforeEach(() => {
    resetDb();
  });

  describe("Authentication Endpoints", () => {
    it("POST /api/v1/auth/register - succeeds with valid fields", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });

    it("POST /api/v1/auth/register - fails with invalid email format", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: "not-an-email", password: testPassword, fullName: testFullName });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("POST /api/v1/auth/register - fails when email already exists", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("EMAIL_EXISTS");
    });

    it("POST /api/v1/auth/login - succeeds with correct password", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });

    it("POST /api/v1/auth/login - fails with incorrect password", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: "WrongPassword123!" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("POST /api/v1/auth/login - fails when user not found", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "nonexistent@example.com", password: testPassword });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("POST /api/v1/auth/refresh - succeeds with valid refresh token", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: loginRes.body.data.tokens.refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });

    it("POST /api/v1/auth/refresh - fails with missing token", async () => {
      const res = await request(app).post("/api/v1/auth/refresh").send({});
      expect(res.status).toBe(400);
    });

    it("POST /api/v1/auth/logout - succeeds", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      const res = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${loginRes.body.data.tokens.accessToken}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("POST /api/v1/auth/forgot - generates a reset code", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const res = await request(app).post("/api/v1/auth/forgot").send({ email: testEmail });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("POST /api/v1/auth/verify-otp - succeeds with correct code", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      await request(app).post("/api/v1/auth/forgot").send({ email: testEmail });
      await new Promise((resolve) => setTimeout(resolve, 10));

      const otp = mockEmailState.lastSentCode;

      const res = await request(app)
        .post("/api/v1/auth/verify-otp")
        .send({ email: testEmail, otp });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.resetToken).toBeDefined();
    });

    it("POST /api/v1/auth/verify-otp - fails with invalid code", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      await request(app).post("/api/v1/auth/forgot").send({ email: testEmail });

      const res = await request(app)
        .post("/api/v1/auth/verify-otp")
        .send({ email: testEmail, otp: "000000" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("POST /api/v1/auth/reset - updates password", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      await request(app).post("/api/v1/auth/forgot").send({ email: testEmail });
      await new Promise((resolve) => setTimeout(resolve, 10));

      const otp = mockEmailState.lastSentCode;

      const verifyRes = await request(app)
        .post("/api/v1/auth/verify-otp")
        .send({ email: testEmail, otp });

      const resetToken = verifyRes.body.data.resetToken;

      const res = await request(app)
        .post("/api/v1/auth/reset")
        .send({ email: testEmail, resetToken, newPassword: "NewSecurePassword123!" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("GET /api/v1/auth/me - returns profile details if authorized", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${loginRes.body.data.tokens.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testEmail);
    });

    it("GET /api/v1/auth/me - fails if token is missing", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    });

    it("PATCH /api/v1/auth/me - updates full name successfully", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      const res = await request(app)
        .patch("/api/v1/auth/me")
        .set("Authorization", `Bearer ${loginRes.body.data.tokens.accessToken}`)
        .send({ fullName: "Updated Name" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(db.users[0].fullName).toBe("Updated Name");
    });

    it("POST /api/v1/auth/me/change-password - changes password successfully", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      const res = await request(app)
        .post("/api/v1/auth/me/change-password")
        .set("Authorization", `Bearer ${loginRes.body.data.tokens.accessToken}`)
        .send({ currentPassword: testPassword, newPassword: "AnotherNewPassword1!" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("Topic & Lesson Endpoints", () => {
    let token: string;

    beforeEach(async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      token = loginRes.body.data.tokens.accessToken;
    });

    it("GET /api/v1/topics - returns paginated topics", async () => {
      const res = await request(app).get("/api/v1/topics").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0].title).toBe("Stoicism");
    });

    it("GET /api/v1/topics/:id - returns details of a single topic", async () => {
      const res = await request(app)
        .get(`/api/v1/topics/${TOPIC_UUID}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(TOPIC_UUID);
    });

    it("GET /api/v1/topics/:id - returns 404 if topic not found", async () => {
      const res = await request(app)
        .get(`/api/v1/topics/${NONEXISTENT_UUID}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("GET /api/v1/lessons - returns list of lessons", async () => {
      const res = await request(app).get("/api/v1/lessons").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it("GET /api/v1/lessons/:id - returns lesson detail", async () => {
      const res = await request(app)
        .get(`/api/v1/lessons/${LESSON_UUID}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(LESSON_UUID);
    });

    it("GET /api/v1/lessons/:id - returns 404 if lesson not found", async () => {
      const res = await request(app)
        .get(`/api/v1/lessons/${NONEXISTENT_UUID}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("Story Endpoints", () => {
    let token: string;

    beforeEach(async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      token = loginRes.body.data.tokens.accessToken;
    });

    it("GET /api/v1/stories - returns stories with stats", async () => {
      const res = await request(app).get("/api/v1/stories").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0].title).toBe("Marcus Aurelius on the Frontlines");
    });

    it("GET /api/v1/stories/:id - returns details of story", async () => {
      const res = await request(app)
        .get(`/api/v1/stories/${STORY_UUID}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(STORY_UUID);
    });

    it("GET /api/v1/stories/:id - returns 404 if story not found", async () => {
      const res = await request(app)
        .get(`/api/v1/stories/${NONEXISTENT_UUID}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("POST /api/v1/stories/:storyId/sessions - starts active session", async () => {
      const res = await request(app)
        .post(`/api/v1/stories/${STORY_UUID}/sessions`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("IN_PROGRESS");
    });

    it("POST /api/v1/story-sessions/:sessionId/decide - records a decision choice", async () => {
      const startRes = await request(app)
        .post(`/api/v1/stories/${STORY_UUID}/sessions`)
        .set("Authorization", `Bearer ${token}`);

      const sessionId = startRes.body.data.id;

      const res = await request(app)
        .post(`/api/v1/story-sessions/${sessionId}/decide`)
        .set("Authorization", `Bearer ${token}`)
        .send({ choiceId: CHOICE_UUID, userReason: "Integration test reason" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.choiceId).toBe(CHOICE_UUID);
    });

    it("POST /api/v1/story-sessions/:sessionId/complete - completes the session", async () => {
      const startRes = await request(app)
        .post(`/api/v1/stories/${STORY_UUID}/sessions`)
        .set("Authorization", `Bearer ${token}`);

      const sessionId = startRes.body.data.id;

      const res = await request(app)
        .post(`/api/v1/story-sessions/${sessionId}/complete`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("COMPLETED");
    });
  });

  describe("Quiz Endpoints", () => {
    let token: string;

    beforeEach(async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, fullName: testFullName });

      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      token = loginRes.body.data.tokens.accessToken;
    });

    it("GET /api/v1/quizzes - returns quizzes list", async () => {
      const res = await request(app).get("/api/v1/quizzes").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it("GET /api/v1/quizzes/by-lesson/:lessonId - returns quiz for a lesson", async () => {
      const res = await request(app)
        .get(`/api/v1/quizzes/by-lesson/${LESSON_UUID}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.lessonId).toBe(LESSON_UUID);
    });

    it("POST /api/v1/quizzes/:quizId/attempts - starts attempt", async () => {
      const res = await request(app)
        .post(`/api/v1/quizzes/${QUIZ_UUID}/attempts`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.attemptId).toBeDefined();
    });

    it("POST /api/v1/quizzes/attempts/:attemptId/answers - submits answer option", async () => {
      const attemptRes = await request(app)
        .post(`/api/v1/quizzes/${QUIZ_UUID}/attempts`)
        .set("Authorization", `Bearer ${token}`);

      const attemptId = attemptRes.body.data.attemptId;

      const res = await request(app)
        .post(`/api/v1/quizzes/attempts/${attemptId}/answers`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: QUESTION_UUID, selectedOptionId: OPTION_UUID_1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isCorrect).toBe(true);
    });

    it("POST /api/v1/quizzes/attempts/:attemptId/complete - completes attempt with score", async () => {
      const attemptRes = await request(app)
        .post(`/api/v1/quizzes/${QUIZ_UUID}/attempts`)
        .set("Authorization", `Bearer ${token}`);

      const attemptId = attemptRes.body.data.attemptId;

      await request(app)
        .post(`/api/v1/quizzes/attempts/${attemptId}/answers`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: QUESTION_UUID, selectedOptionId: OPTION_UUID_1 });

      const res = await request(app)
        .post(`/api/v1/quizzes/attempts/${attemptId}/complete`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.score).toBe(100);
    });
  });
});
