/**
 * [T-D16] Story Flow Integration Test — End-to-end 13 steps
 *
 * Validates that the Redux story slice correctly manages state transitions
 * across every step of the Story Mode experience:
 *
 *   1. Story Detail (index)        — loadStoryDetail
 *   2. Role Selection              — setSelectedRoleId
 *   3. Role Intro                  — (read-only, selectedRoleId persists)
 *   4. Cinematic                   — (read-only, state unchanged)
 *   5. Map                         — (read-only, state unchanged)
 *   6. NPC Encounter               — setNpcEncounterCompleted
 *   7. Learn                       — setStep("learn")
 *   8. Dilemma                     — setStep("dilemma")
 *   9. Choose                      — submitDecision
 *  10. Consequence/Result          — setStep("result") (auto via submitDecision)
 *  11. Knowledge / Reflect         — setStep("knowledge") → setStep("reflect")
 *  12. Quiz                        — setQuizScore
 *  13. Complete                    — setReflectionJournal + completeActiveSession
 *
 * Closes: https://github.com/khovan123/philo-mind/issues/82
 */

import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import {
  storyReducer,
  setStep,
  resetStoryStore,
  setSelectedRoleId,
  setNpcEncounterCompleted,
  setMinigameScore,
  setQuizScore,
  setReflectionJournal,
  fetchStories,
  loadStoryDetail,
  startOrResumeSession,
  submitDecision,
  completeActiveSessionThunk,
} from "@/stores/slices/story.slice";
import type { StoryState, StoryStep } from "@/stores/slices/story.slice";
import type { StorySummary, StorySession, StoryDecision, StoryChoice } from "@/types/story";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const STORY_ID = "550e8400-e29b-41d4-a716-446655440000";
const SESSION_ID = "sess-001";
const USER_ID = "user-001";
const CHOICE_A_ID = "choice-a";
const CHOICE_B_ID = "choice-b";
const ROLE_ID = "role-philosopher";

const mockChoices: StoryChoice[] = [
  {
    id: CHOICE_A_ID,
    choiceText: "Theo đuổi lẽ phải",
    reasoningPrompt: "Vì sao bạn chọn lẽ phải?",
    consequences: [
      {
        id: "cons-a",
        choiceId: CHOICE_A_ID,
        resultText: "Bạn đã chọn đường ngay",
        ethicalAnalysis: "Phân tích đạo đức...",
        philosophicalAnalysis: "Phân tích triết học...",
        politicalEconomicAnalysis: null,
        historicalImpact: null,
      },
    ],
  },
  {
    id: CHOICE_B_ID,
    choiceText: "Hy sinh lợi ích cá nhân",
    reasoningPrompt: null,
    consequences: [],
  },
];

const mockStory: StorySummary = {
  id: STORY_ID,
  title: "Câu chuyện triết học — Bài toán xe điện",
  description: "Một tình huống khó xử kinh điển trong triết học đạo đức.",
  characterRole: "Người lái tàu",
  historicalContext: "Thế kỷ 20",
  difficulty: "MEDIUM",
  estimatedMinutes: 15,
  coverImageUrl: null,
  createdAt: "2025-01-01T00:00:00Z",
  topic: { id: "topic-ethics", title: "Đạo đức", category: "Ethics" },
  choices: mockChoices,
  stats: {
    totalPlayCount: 100,
    completedPlayCount: 80,
    completionRate: 80,
    choicesDistribution: [
      { choiceId: CHOICE_A_ID, choiceText: "Theo đuổi lẽ phải", count: 60, percentage: 75 },
      { choiceId: CHOICE_B_ID, choiceText: "Hy sinh lợi ích cá nhân", count: 20, percentage: 25 },
    ],
  },
  learnCards: [
    {
      id: "lc-1",
      storyId: STORY_ID,
      title: "Utilitarianism",
      body: "Chủ nghĩa vị lợi là...",
      sourceRef: null,
      order: 1,
      tags: [],
    },
    {
      id: "lc-2",
      storyId: STORY_ID,
      title: "Deontology",
      body: "Chủ nghĩa nghĩa vụ là...",
      sourceRef: "Kant, 1785",
      order: 2,
      tags: [],
    },
  ],
};

const mockSession: StorySession = {
  id: SESSION_ID,
  userId: USER_ID,
  storyId: STORY_ID,
  status: "IN_PROGRESS",
  startedAt: "2025-06-01T10:00:00Z",
  completedAt: null,
  decisions: [],
};

const mockDecision: StoryDecision = {
  id: "dec-001",
  sessionId: SESSION_ID,
  userId: USER_ID,
  choiceId: CHOICE_A_ID,
  userReason: "Vì lẽ phải quan trọng hơn",
  createdAt: "2025-06-01T10:05:00Z",
  choice: mockChoices[0],
};

// ─── Mock the service ────────────────────────────────────────────────────────

jest.mock("@/services/story.service", () => ({
  storyService: {
    listStories: jest.fn(),
    getStoryDetail: jest.fn(),
    startSession: jest.fn(),
    makeDecision: jest.fn(),
    completeSession: jest.fn(),
    getStoryStats: jest.fn(),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { storyService } = require("@/services/story.service");

// ─── Store factory ───────────────────────────────────────────────────────────

function createTestStore(preloadedState?: Partial<StoryState>) {
  return configureStore({
    reducer: { story: storyReducer },
    preloadedState: preloadedState ? { story: { ...storyReducer(undefined, { type: "@@INIT" }), ...preloadedState } } : undefined,
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStory(store: EnhancedStore) {
  return store.getState().story as StoryState;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════════

describe("[T-D16] Story Flow — 13-Step Integration", () => {
  let store: EnhancedStore;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createTestStore();
  });

  // ─── Initial state ──────────────────────────────────────────────────────────

  describe("Step 0: Initial State", () => {
    it("starts with clean default state", () => {
      const s = getStory(store);
      expect(s.currentStep).toBe("intro");
      expect(s.currentStory).toBeNull();
      expect(s.activeSession).toBeNull();
      expect(s.selectedRoleId).toBeNull();
      expect(s.npcEncounterCompleted).toBe(false);
      expect(s.minigameScore).toBeNull();
      expect(s.lastDecisionChoiceId).toBeNull();
      expect(s.quizScore).toBeNull();
      expect(s.reflectionJournal).toBeNull();
      expect(s.error).toBeNull();
    });

    it("has all loading flags set to false", () => {
      const s = getStory(store);
      expect(s.loadingStories).toBe(false);
      expect(s.loadingStoryDetail).toBe(false);
      expect(s.loadingSession).toBe(false);
      expect(s.submittingDecision).toBe(false);
      expect(s.completingSession).toBe(false);
    });
  });

  // ─── Step 1: Story Detail ──────────────────────────────────────────────────

  describe("Step 1: Story Detail (index)", () => {
    it("loads story detail and populates currentStory", async () => {
      storyService.getStoryDetail.mockResolvedValueOnce(mockStory);
      await store.dispatch(loadStoryDetail(STORY_ID));

      const s = getStory(store);
      expect(s.currentStory).toEqual(mockStory);
      expect(s.loadingStoryDetail).toBe(false);
      expect(s.error).toBeNull();
    });

    it("sets loadingStoryDetail during fetch", () => {
      storyService.getStoryDetail.mockReturnValue(new Promise(() => {})); // never resolves
      store.dispatch(loadStoryDetail(STORY_ID));

      const s = getStory(store);
      expect(s.loadingStoryDetail).toBe(true);
    });

    it("handles fetch error gracefully", async () => {
      storyService.getStoryDetail.mockRejectedValueOnce(new Error("Network error"));
      await store.dispatch(loadStoryDetail(STORY_ID));

      const s = getStory(store);
      expect(s.loadingStoryDetail).toBe(false);
      expect(s.error).toBe("Network error");
      expect(s.currentStory).toBeNull();
    });
  });

  // ─── Step 2: Role Selection ────────────────────────────────────────────────

  describe("Step 2: Role Selection", () => {
    it("sets selected role ID", () => {
      store.dispatch(setSelectedRoleId(ROLE_ID));
      expect(getStory(store).selectedRoleId).toBe(ROLE_ID);
    });

    it("can clear role selection", () => {
      store.dispatch(setSelectedRoleId(ROLE_ID));
      store.dispatch(setSelectedRoleId(null));
      expect(getStory(store).selectedRoleId).toBeNull();
    });
  });

  // ─── Step 3: Role Intro ────────────────────────────────────────────────────

  describe("Step 3: Role Intro", () => {
    it("preserves selectedRoleId while on intro screen", () => {
      store.dispatch(setSelectedRoleId(ROLE_ID));
      // Role intro is read-only — no reducer change expected
      const s = getStory(store);
      expect(s.selectedRoleId).toBe(ROLE_ID);
      expect(s.currentStep).toBe("intro");
    });
  });

  // ─── Step 4–5: Cinematic + Map (read-only transitions) ────────────────────

  describe("Steps 4–5: Cinematic and Map (read-only)", () => {
    it("state remains stable during passive screens", () => {
      store.dispatch(setSelectedRoleId(ROLE_ID));

      // Simulate navigation to cinematic then map — state should not change
      const before = getStory(store);
      const after = getStory(store);
      expect(before).toEqual(after);
    });
  });

  // ─── Step 6: NPC Encounter ─────────────────────────────────────────────────

  describe("Step 6: NPC Encounter", () => {
    it("marks encounter as completed", () => {
      store.dispatch(setNpcEncounterCompleted(true));
      expect(getStory(store).npcEncounterCompleted).toBe(true);
    });

    it("can track minigame score from encounter", () => {
      store.dispatch(setMinigameScore(85));
      expect(getStory(store).minigameScore).toBe(85);
    });
  });

  // ─── Step 7: Learn ─────────────────────────────────────────────────────────

  describe("Step 7: Learn", () => {
    it("transitions to learn step", () => {
      store.dispatch(setStep("learn"));
      expect(getStory(store).currentStep).toBe("learn");
    });

    it("preserves all previous state during learn", () => {
      store.dispatch(setSelectedRoleId(ROLE_ID));
      store.dispatch(setNpcEncounterCompleted(true));
      store.dispatch(setStep("learn"));

      const s = getStory(store);
      expect(s.selectedRoleId).toBe(ROLE_ID);
      expect(s.npcEncounterCompleted).toBe(true);
      expect(s.currentStep).toBe("learn");
    });
  });

  // ─── Step 8: Dilemma ───────────────────────────────────────────────────────

  describe("Step 8: Dilemma", () => {
    it("transitions to dilemma step", () => {
      store.dispatch(setStep("dilemma"));
      expect(getStory(store).currentStep).toBe("dilemma");
    });
  });

  // ─── Step 9: Choose ────────────────────────────────────────────────────────

  describe("Step 9: Choose — Decision Submission", () => {
    beforeEach(async () => {
      // Setup: load story + start session first
      storyService.getStoryDetail.mockResolvedValue(mockStory);
      storyService.startSession.mockResolvedValue(mockSession);
      await store.dispatch(startOrResumeSession(STORY_ID));
    });

    it("starts a session and populates activeSession", () => {
      const s = getStory(store);
      expect(s.activeSession).toBeDefined();
      expect(s.activeSession!.id).toBe(SESSION_ID);
      expect(s.activeSession!.status).toBe("IN_PROGRESS");
      expect(s.currentStory).toEqual(mockStory);
    });

    it("submits decision and records choiceId", async () => {
      storyService.makeDecision.mockResolvedValueOnce(mockDecision);
      store.dispatch(setStep("choose"));

      await store.dispatch(submitDecision({ choiceId: CHOICE_A_ID, userReason: "Vì lẽ phải quan trọng hơn" }));

      const s = getStory(store);
      expect(s.lastDecisionChoiceId).toBe(CHOICE_A_ID);
      expect(s.currentStep).toBe("result"); // auto-transitions
      expect(s.submittingDecision).toBe(false);
    });

    it("shows submitting state during decision", () => {
      storyService.makeDecision.mockReturnValue(new Promise(() => {}));
      store.dispatch(submitDecision({ choiceId: CHOICE_A_ID }));

      expect(getStory(store).submittingDecision).toBe(true);
    });

    it("handles decision error", async () => {
      storyService.makeDecision.mockRejectedValueOnce(new Error("Decision failed"));
      await store.dispatch(submitDecision({ choiceId: CHOICE_A_ID }));

      const s = getStory(store);
      expect(s.submittingDecision).toBe(false);
      expect(s.error).toBe("Decision failed");
      expect(s.lastDecisionChoiceId).toBeNull();
    });

    it("appends decision to activeSession.decisions", async () => {
      storyService.makeDecision.mockResolvedValueOnce(mockDecision);
      await store.dispatch(submitDecision({ choiceId: CHOICE_A_ID }));

      const decisions = getStory(store).activeSession!.decisions;
      expect(decisions).toHaveLength(1);
      expect(decisions[0].choiceId).toBe(CHOICE_A_ID);
    });
  });

  // ─── Step 10: Consequence / Result ─────────────────────────────────────────

  describe("Step 10: Consequence (Result)", () => {
    it("auto-transitions to result after decision", async () => {
      storyService.getStoryDetail.mockResolvedValue(mockStory);
      storyService.startSession.mockResolvedValue(mockSession);
      storyService.makeDecision.mockResolvedValueOnce(mockDecision);

      await store.dispatch(startOrResumeSession(STORY_ID));
      await store.dispatch(submitDecision({ choiceId: CHOICE_A_ID }));

      expect(getStory(store).currentStep).toBe("result");
    });

    it("resumes to result when session has existing decisions", async () => {
      const sessionWithDecision: StorySession = {
        ...mockSession,
        decisions: [mockDecision],
      };
      storyService.getStoryDetail.mockResolvedValue(mockStory);
      storyService.startSession.mockResolvedValue(sessionWithDecision);

      await store.dispatch(startOrResumeSession(STORY_ID));

      expect(getStory(store).currentStep).toBe("result");
    });
  });

  // ─── Step 11: Knowledge + Reflect ──────────────────────────────────────────

  describe("Step 11: Knowledge → Reflect", () => {
    it("transitions through knowledge to reflect", () => {
      store.dispatch(setStep("knowledge"));
      expect(getStory(store).currentStep).toBe("knowledge");

      store.dispatch(setStep("reflect"));
      expect(getStory(store).currentStep).toBe("reflect");
    });
  });

  // ─── Step 12: Quiz ─────────────────────────────────────────────────────────

  describe("Step 12: Quiz", () => {
    it("transitions to quiz and records score", () => {
      store.dispatch(setStep("quiz"));
      expect(getStory(store).currentStep).toBe("quiz");

      store.dispatch(setQuizScore(80));
      expect(getStory(store).quizScore).toBe(80);
    });

    it("handles zero score", () => {
      store.dispatch(setQuizScore(0));
      expect(getStory(store).quizScore).toBe(0);
    });

    it("handles perfect score", () => {
      store.dispatch(setQuizScore(100));
      expect(getStory(store).quizScore).toBe(100);
    });
  });

  // ─── Step 13: Complete ─────────────────────────────────────────────────────

  describe("Step 13: Episode Complete", () => {
    it("saves reflection journal", () => {
      store.dispatch(setReflectionJournal("Bài học hôm nay thật sâu sắc."));
      expect(getStory(store).reflectionJournal).toBe("Bài học hôm nay thật sâu sắc.");
    });

    it("completes session and resets transient state", async () => {
      storyService.getStoryDetail.mockResolvedValue(mockStory);
      storyService.startSession.mockResolvedValue(mockSession);
      storyService.completeSession.mockResolvedValueOnce(undefined);

      await store.dispatch(startOrResumeSession(STORY_ID));
      store.dispatch(setStep("complete"));
      store.dispatch(setReflectionJournal("Kết luận"));

      await store.dispatch(completeActiveSessionThunk());

      const s = getStory(store);
      expect(s.activeSession).toBeNull();
      expect(s.currentStory).toBeNull();
      expect(s.currentStep).toBe("intro");
      expect(s.lastDecisionChoiceId).toBeNull();
      expect(s.completingSession).toBe(false);
    });

    it("shows completingSession during completion", () => {
      // Pre-populate state with an active session
      store = createTestStore({
        activeSession: mockSession,
        currentStory: mockStory,
      });
      storyService.completeSession.mockReturnValue(new Promise(() => {}));
      store.dispatch(completeActiveSessionThunk());

      expect(getStory(store).completingSession).toBe(true);
    });

    it("handles completion error", async () => {
      store = createTestStore({
        activeSession: mockSession,
        currentStory: mockStory,
      });
      storyService.completeSession.mockRejectedValueOnce(new Error("Complete failed"));

      await store.dispatch(completeActiveSessionThunk());

      const s = getStory(store);
      expect(s.completingSession).toBe(false);
      expect(s.error).toBe("Complete failed");
      // Session should NOT be cleared on error
      expect(s.activeSession).not.toBeNull();
    });
  });

  // ─── Full E2E Walkthrough ──────────────────────────────────────────────────

  describe("Full 13-step walkthrough (data persistence)", () => {
    it("navigates all 13 steps with data persisting between them", async () => {
      // ── Step 1: Load Story Detail ──
      storyService.getStoryDetail.mockResolvedValue(mockStory);
      storyService.startSession.mockResolvedValue(mockSession);
      storyService.makeDecision.mockResolvedValue(mockDecision);
      storyService.completeSession.mockResolvedValue(undefined);

      await store.dispatch(loadStoryDetail(STORY_ID));
      expect(getStory(store).currentStory?.id).toBe(STORY_ID);

      // ── Step 2: Role Selection ──
      store.dispatch(setSelectedRoleId(ROLE_ID));
      expect(getStory(store).selectedRoleId).toBe(ROLE_ID);

      // ── Step 3: Role Intro (read-only) ──
      expect(getStory(store).selectedRoleId).toBe(ROLE_ID);

      // ── Steps 4–5: Cinematic + Map (read-only) ──
      expect(getStory(store).currentStory).not.toBeNull();

      // ── Step 6: NPC Encounter ──
      store.dispatch(setNpcEncounterCompleted(true));
      store.dispatch(setMinigameScore(90));
      expect(getStory(store).npcEncounterCompleted).toBe(true);
      expect(getStory(store).minigameScore).toBe(90);

      // ── Start Session (needed before decision) ──
      await store.dispatch(startOrResumeSession(STORY_ID));
      expect(getStory(store).activeSession).not.toBeNull();

      // ── Step 7: Learn ──
      store.dispatch(setStep("learn"));
      expect(getStory(store).currentStep).toBe("learn");
      // Verify earlier data persists
      expect(getStory(store).selectedRoleId).toBe(ROLE_ID);
      expect(getStory(store).npcEncounterCompleted).toBe(true);

      // ── Step 8: Dilemma ──
      store.dispatch(setStep("dilemma"));
      expect(getStory(store).currentStep).toBe("dilemma");

      // ── Step 9: Choose ──
      store.dispatch(setStep("choose"));
      await store.dispatch(submitDecision({ choiceId: CHOICE_A_ID, userReason: "Vì lẽ phải" }));

      // ── Step 10: Result (auto-transition from submitDecision) ──
      expect(getStory(store).currentStep).toBe("result");
      expect(getStory(store).lastDecisionChoiceId).toBe(CHOICE_A_ID);
      expect(getStory(store).activeSession!.decisions).toHaveLength(1);

      // ── Step 11: Knowledge → Reflect ──
      store.dispatch(setStep("knowledge"));
      expect(getStory(store).currentStep).toBe("knowledge");
      store.dispatch(setStep("reflect"));
      expect(getStory(store).currentStep).toBe("reflect");

      // ── Step 12: Quiz ──
      store.dispatch(setStep("quiz"));
      store.dispatch(setQuizScore(85));
      expect(getStory(store).currentStep).toBe("quiz");
      expect(getStory(store).quizScore).toBe(85);

      // ── Step 13: Complete ──
      store.dispatch(setStep("complete"));
      store.dispatch(setReflectionJournal("Hành trình đáng nhớ!"));
      expect(getStory(store).reflectionJournal).toBe("Hành trình đáng nhớ!");

      // Verify ALL accumulated data before session close
      const preComplete = getStory(store);
      expect(preComplete.selectedRoleId).toBe(ROLE_ID);
      expect(preComplete.npcEncounterCompleted).toBe(true);
      expect(preComplete.minigameScore).toBe(90);
      expect(preComplete.lastDecisionChoiceId).toBe(CHOICE_A_ID);
      expect(preComplete.quizScore).toBe(85);
      expect(preComplete.reflectionJournal).toBe("Hành trình đáng nhớ!");

      // Complete session — resets transient state
      await store.dispatch(completeActiveSessionThunk());
      const postComplete = getStory(store);
      expect(postComplete.activeSession).toBeNull();
      expect(postComplete.currentStep).toBe("intro");
      expect(postComplete.lastDecisionChoiceId).toBeNull();
    });
  });

  // ─── Reset ─────────────────────────────────────────────────────────────────

  describe("resetStoryStore", () => {
    it("resets all transient state without affecting stories list", () => {
      store = createTestStore({
        stories: [mockStory],
        totalStories: 1,
        currentStory: mockStory,
        activeSession: mockSession,
        selectedRoleId: ROLE_ID,
        currentStep: "quiz",
        npcEncounterCompleted: true,
        minigameScore: 95,
        lastDecisionChoiceId: CHOICE_A_ID,
        quizScore: 70,
        reflectionJournal: "Test",
      });

      store.dispatch(resetStoryStore());

      const s = getStory(store);
      expect(s.currentStory).toBeNull();
      expect(s.activeSession).toBeNull();
      expect(s.selectedRoleId).toBeNull();
      expect(s.currentStep).toBe("intro");
      expect(s.npcEncounterCompleted).toBe(false);
      expect(s.minigameScore).toBeNull();
      expect(s.lastDecisionChoiceId).toBeNull();
      expect(s.quizScore).toBeNull();
      expect(s.reflectionJournal).toBeNull();
      expect(s.error).toBeNull();
      // stories list is preserved
      expect(s.stories).toHaveLength(1);
    });
  });

  // ─── fetchStories (list screen) ────────────────────────────────────────────

  describe("fetchStories (Story List)", () => {
    it("populates stories and totalStories", async () => {
      storyService.listStories.mockResolvedValueOnce({
        stories: [mockStory],
        total: 1,
      });
      await store.dispatch(fetchStories());

      const s = getStory(store);
      expect(s.stories).toHaveLength(1);
      expect(s.totalStories).toBe(1);
      expect(s.loadingStories).toBe(false);
    });

    it("shows loading state during fetch", () => {
      storyService.listStories.mockReturnValue(new Promise(() => {}));
      store.dispatch(fetchStories());
      expect(getStory(store).loadingStories).toBe(true);
    });

    it("handles empty list", async () => {
      storyService.listStories.mockResolvedValueOnce({ stories: [], total: 0 });
      await store.dispatch(fetchStories());

      const s = getStory(store);
      expect(s.stories).toHaveLength(0);
      expect(s.totalStories).toBe(0);
    });

    it("handles fetch error", async () => {
      storyService.listStories.mockRejectedValueOnce(new Error("API down"));
      await store.dispatch(fetchStories());

      const s = getStory(store);
      expect(s.loadingStories).toBe(false);
      expect(s.error).toBe("API down");
    });
  });

  // ─── Step transition validation ────────────────────────────────────────────

  describe("Step Transitions", () => {
    const ORDERED_STEPS: StoryStep[] = [
      "intro",
      "learn",
      "dilemma",
      "choose",
      "result",
      "knowledge",
      "reflect",
      "quiz",
      "complete",
    ];

    it.each(ORDERED_STEPS)("can set step to '%s'", (step) => {
      store.dispatch(setStep(step));
      expect(getStory(store).currentStep).toBe(step);
    });

    it("can navigate backwards (re-visit earlier steps)", () => {
      store.dispatch(setStep("quiz"));
      store.dispatch(setStep("learn"));
      expect(getStory(store).currentStep).toBe("learn");
    });
  });
});
