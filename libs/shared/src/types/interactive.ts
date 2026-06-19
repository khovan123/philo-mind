// ── Interactive Enums ────────────────────────────────────────────

export enum SenderType {
  USER = "USER",
  AI = "AI",
  SYSTEM = "SYSTEM",
}

export enum DebateStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED",
}

export enum DebateStance {
  AGREE = "AGREE",
  DISAGREE = "DISAGREE",
  NEUTRAL = "NEUTRAL",
  ALTERNATIVE = "ALTERNATIVE",
}

export enum VoteValue {
  UP = "UP",
  DOWN = "DOWN",
}

// ── AI Chat DTOs ─────────────────────────────────────────────

export interface AiCharacterDTO {
  id: string;
  name: string;
  type: string;
  bio: string | null;
  worldview: string | null;
  promptInstruction: string;
  createdAt: string;
}

export interface AiChatSessionDTO {
  id: string;
  userId: string;
  characterId: string;
  title: string | null;
  createdAt: string;
}

export interface AiChatMessageDTO {
  id: string;
  sessionId: string;
  senderType: SenderType;
  message: string;
  metadata: unknown | null;
  createdAt: string;
}

// ── Scenario DTOs ─────────────────────────────────────────────

export interface ScenarioDTO {
  id: string;
  topicId: string;
  title: string;
  situation: string;
  context: string | null;
  createdAt: string;
}

export interface ScenarioResponseDTO {
  id: string;
  scenarioId: string;
  userId: string;
  selectedDecision: string | null;
  reason: string | null;
  initialPosition: string;
  reasoning: string | null;
  revisedPosition: string | null;
  reflection: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioPerspectiveDTO {
  id: string;
  scenarioId: string;
  perspectiveType: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioFrameworkDTO {
  id: string;
  scenarioId: string;
  name: string;
  description: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ── Debate DTOs ─────────────────────────────────────────────

export interface DebateDTO {
  id: string;
  topicId: string;
  title: string;
  description: string | null;
  status: DebateStatus;
  createdAt: string;
}

export interface DebateArgumentDTO {
  id: string;
  debateId: string;
  userId: string;
  stance: DebateStance;
  argumentText: string;
  voteCount: number;
  createdAt: string;
}

export interface DebateCommentDTO {
  id: string;
  argumentId: string;
  userId: string;
  commentText: string;
  createdAt: string;
}

export interface DebateVoteDTO {
  id: string;
  argumentId: string;
  userId: string;
  value: VoteValue;
  createdAt: string;
}
