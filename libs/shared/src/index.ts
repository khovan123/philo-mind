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
  AuthResponse,
  AuthTokens,
  LoginDTO,
  RefreshTokenRequest,
  RegisterDTO,
  UserProfile,
} from "./types/auth.js";

// Learning
export { ContentStatus, Difficulty, PerspectiveType } from "./types/learning.js";
export type { LessonDTO, QuizAttemptDTO, TopicDTO, TopicPerspectiveDTO } from "./types/learning.js";

// Story
export { AnalysisType, StorySessionStatus } from "./types/story.js";
export type {
  AnalysisTabDTO,
  StoryChoiceDTO,
  StoryConsequenceDTO,
  StoryDecisionDTO,
  StoryScenarioDTO,
  StorySessionDTO,
} from "./types/story.js";

// Interactive (AI Chat, Scenario, Debate)
export { DebateStance, DebateStatus, SenderType, VoteValue } from "./types/interactive.js";
export type {
  AiCharacterDTO,
  AiChatMessageDTO,
  AiChatSessionDTO,
  DebateArgumentDTO,
  DebateCommentDTO,
  DebateDTO,
  DebateVoteDTO,
  ScenarioDTO,
  ScenarioFrameworkDTO,
  ScenarioPerspectiveDTO,
  ScenarioResponseDTO,
} from "./types/interactive.js";

// Activity
export { ActivityType, TargetType } from "./types/activity.js";

// ── Shared Validators ─────────────────────────────────────

export * from "./validators/activity.validator.js";
export * from "./validators/ai-character.validator.js";
export * from "./validators/ai-chat.validator.js";
export * from "./validators/ai.validator.js";
export * from "./validators/analysis-tab.validator.js";
export * from "./validators/auth.validator.js";
export * from "./validators/bookmark.validator.js";
export * from "./validators/choice.validator.js";
export * from "./validators/critical-question.validator.js";
export * from "./validators/debate.validator.js";
export * from "./validators/lesson.validator.js";
export * from "./validators/mindmap.validator.js";
export * from "./validators/minigame.validator.js";
export * from "./validators/notification.validator.js";
export * from "./validators/philosophy-tag.validator.js";
export * from "./validators/progress.validator.js";
export * from "./validators/quiz.validator.js";
export * from "./validators/reflection.validator.js";
export * from "./validators/scenario.validator.js";
export * from "./validators/short-lesson.validator.js";
export * from "./validators/story-learn-card.validator.js";
export * from "./validators/story-session.validator.js";
export * from "./validators/story.validator.js";
export * from "./validators/topic-perspective.validator.js";
export * from "./validators/topic.validator.js";

export { topicIdSchema } from "./validators/topic.validator.js";
export type { SubmitAnswerInput } from "./validators/lesson.validator.js";
