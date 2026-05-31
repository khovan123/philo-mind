import { Difficulty } from "./learning.js";

// ── Story Enums ────────────────────────────────────────────

export enum StorySessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ABANDONED = "ABANDONED",
}

export enum AnalysisType {
  ETHICAL = "ETHICAL",
  PHILOSOPHICAL = "PHILOSOPHICAL",
  POLITICAL_ECONOMIC = "POLITICAL_ECONOMIC",
  HISTORICAL = "HISTORICAL",
}

// ── Story DTOs ─────────────────────────────────────────────

/**
 * Đại diện cho một kịch bản câu chuyện trong DB (story_scenarios).
 * Mỗi kịch bản gồm mô tả, vai nhân vật và danh sách lựa chọn.
 */
export interface StoryScenarioDTO {
  id: string;
  topicId: string;
  title: string;
  description: string;
  characterRole: string | null;
  historicalContext: string | null;
  difficulty: Difficulty;
  createdAt: string;
}

/**
 * Đại diện cho một lựa chọn trong kịch bản (story_choices).
 */
export interface StoryChoiceDTO {
  id: string;
  storyId: string;
  choiceText: string;
  reasoningPrompt: string | null;
}

/**
 * Phiên làm việc của người dùng trong một kịch bản (story_sessions).
 */
export interface StorySessionDTO {
  id: string;
  userId: string;
  storyId: string;
  status: StorySessionStatus;
  startedAt: string;
  completedAt: string | null;
}

/**
 * Quyết định của người dùng tại một bước trong phiên (story_decisions).
 */
export interface StoryDecisionDTO {
  id: string;
  sessionId: string;
  userId: string;
  choiceId: string;
  userReason: string | null;
  createdAt: string;
}

/**
 * Một tab phân tích hậu quả (ETHICAL / PHILOSOPHICAL / POLITICAL_ECONOMIC / HISTORICAL).
 * Derived từ các trường của model StoryConsequence trong DB.
 */
export interface AnalysisTabDTO {
  type: AnalysisType;
  label: string;
  content: string;
}

/**
 * Toàn bộ kết quả hậu quả của một lựa chọn, gồm nội dung kết quả
 * và danh sách các tab phân tích tương ứng.
 * Derived từ model StoryConsequence trong DB.
 */
export interface StoryConsequenceDTO {
  id: string;
  choiceId: string;
  resultText: string;
  analysisTabs: AnalysisTabDTO[];
}
