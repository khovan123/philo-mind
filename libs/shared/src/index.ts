// ── Shared Types ───────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  meta: PaginationMeta;
}

// ── Shared Constants ───────────────────────────────────────

export const API_VERSION = "v1";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ── Re-exports ─────────────────────────────────────────────

// Auth
export { UserRole } from "./types/auth.js";
export type {
  RegisterDTO,
  LoginDTO,
  RefreshTokenRequest,
  AuthTokens,
  UserProfile,
  AuthResponse,
} from "./types/auth.js";

// Learning
export { Difficulty, ContentStatus } from "./types/learning.js";
export type {
  TopicDTO,
  LessonDTO,
  QuizAttemptDTO,
} from "./types/learning.js";

// Story
export { StorySessionStatus, AnalysisType } from "./types/story.js";
export type {
  StoryScenarioDTO,
  StoryChoiceDTO,
  StorySessionDTO,
  StoryDecisionDTO,
  StoryConsequenceDTO,
  AnalysisTabDTO,
} from "./types/story.js";

// Interactive (AI Chat, Scenario, Debate)
export { SenderType, DebateStatus, DebateStance, VoteValue } from "./types/interactive.js";
export type {
  AiCharacterDTO,
  AiChatSessionDTO,
  AiChatMessageDTO,
  ScenarioDTO,
  ScenarioResponseDTO,
  ScenarioAnalysisDTO,
  DebateDTO,
  DebateArgumentDTO,
  DebateCommentDTO,
  DebateVoteDTO,
} from "./types/interactive.js";

