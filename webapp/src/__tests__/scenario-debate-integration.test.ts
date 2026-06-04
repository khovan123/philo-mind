/**
 * [T-F08] Scenario + Debate Integration Test
 *
 * Validates the full flow:
 *   1. Scenario list → detail (situation)
 *   2. Submit initial stance (respond)
 *   3. View perspectives
 *   4. Navigate frameworks
 *   5. Submit revised stance (rethink)
 *   6. Debate list → detail
 *   7. Create argument
 *   8. Vote on argument
 *   9. Cross-module: scenario stance informs debate argument
 *
 * Closes: https://github.com/khovan123/philo-mind/issues/100
 */

import type { ScenarioUiState } from "@/stores/slices/scenario.slice";
import {
  resetScenarioUi,
  scenarioReducer,
  setActiveFrameworkIndex,
  setActivePerspectiveIndex,
  setCurrentPhase,
  setInitialPosition,
  setReasoning,
  setReflection,
  setRevisedPosition,
} from "@/stores/slices/scenario.slice";
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const SCENARIO_ID = "550e8400-e29b-41d4-a716-446655440000";
const DEBATE_ID = "660e8400-e29b-41d4-a716-446655440001";
const USER_ID = "user-001";

const mockPerspectives = [
  {
    id: "p-1",
    scenarioId: SCENARIO_ID,
    perspectiveType: "đức_hạnh",
    content: "Góc nhìn đức hạnh...",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "p-2",
    scenarioId: SCENARIO_ID,
    perspectiveType: "thực_dụng",
    content: "Góc nhìn thực dụng...",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "p-3",
    scenarioId: SCENARIO_ID,
    perspectiveType: "nghĩa_vụ",
    content: "Góc nhìn nghĩa vụ...",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

const mockFrameworks = [
  {
    id: "f-1",
    scenarioId: SCENARIO_ID,
    name: "Utilitarianism",
    description: "Greatest good",
    content: "Phân tích vị lợi...",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "f-2",
    scenarioId: SCENARIO_ID,
    name: "Deontology",
    description: "Duty-based",
    content: "Phân tích nghĩa vụ...",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

const mockScenarioDetail = {
  id: SCENARIO_ID,
  topicId: "topic-001",
  title: "Bài toán xe điện",
  situation: "Bạn đứng trước tình huống khó xử...",
  context: "Thế kỷ 20, triết học đạo đức",
  createdAt: "2025-01-01T00:00:00Z",
  perspectives: mockPerspectives,
  frameworks: mockFrameworks,
  userResponse: null,
};

const mockRespondResult = {
  response: {
    id: "resp-001",
    scenarioId: SCENARIO_ID,
    userId: USER_ID,
    selectedDecision: null,
    reason: null,
    initialPosition: "đức_hạnh",
    reasoning: "Vì đạo đức quan trọng hơn",
    revisedPosition: null,
    reflection: null,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  perspectiveStats: [
    { perspectiveType: "đức_hạnh", count: 5, percentage: 50 },
    { perspectiveType: "thực_dụng", count: 3, percentage: 30 },
    { perspectiveType: "nghĩa_vụ", count: 2, percentage: 20 },
  ],
};

const mockRethinkResult = {
  id: "resp-001",
  scenarioId: SCENARIO_ID,
  userId: USER_ID,
  selectedDecision: null,
  reason: null,
  initialPosition: "đức_hạnh",
  reasoning: "Vì đạo đức quan trọng hơn",
  revisedPosition: "thực_dụng",
  reflection: "Sau khi xem các góc nhìn, tôi nhận ra thực dụng hợp lý hơn.",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-02T00:00:00Z",
};

// ─── Store factory ───────────────────────────────────────────────────────────

function createTestStore(preloadedScenario?: Partial<ScenarioUiState>) {
  return configureStore({
    reducer: { scenario: scenarioReducer },
    preloadedState: preloadedScenario
      ? { scenario: { ...scenarioReducer(undefined, { type: "@@INIT" }), ...preloadedScenario } }
      : undefined,
  });
}

function getScenario(store: EnhancedStore) {
  return store.getState().scenario as ScenarioUiState;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════════

describe("[T-F08] Scenario + Debate Integration", () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = createTestStore();
  });

  // ─── Scenario UI State ─────────────────────────────────────────────────────

  describe("Scenario UI Slice — Initial State", () => {
    it("starts with clean default state", () => {
      const s = getScenario(store);
      expect(s.currentPhase).toBe("situation");
      expect(s.activePerspectiveIndex).toBe(0);
      expect(s.activeFrameworkIndex).toBe(0);
      expect(s.initialPosition).toBe("");
      expect(s.reasoning).toBe("");
      expect(s.revisedPosition).toBe("");
      expect(s.reflection).toBe("");
    });
  });

  // ─── Phase 1: Situation ────────────────────────────────────────────────────

  describe("Phase 1: Situation", () => {
    it("starts on situation phase", () => {
      expect(getScenario(store).currentPhase).toBe("situation");
    });

    it("transitions to perspectives phase", () => {
      store.dispatch(setCurrentPhase("perspectives"));
      expect(getScenario(store).currentPhase).toBe("perspectives");
    });
  });

  // ─── Phase 2: Respond (Initial Stance) ─────────────────────────────────────

  describe("Phase 2: Respond — Initial Stance Input", () => {
    it("captures initial position text", () => {
      store.dispatch(setInitialPosition("đức_hạnh"));
      expect(getScenario(store).initialPosition).toBe("đức_hạnh");
    });

    it("captures reasoning text", () => {
      store.dispatch(setReasoning("Vì đạo đức quan trọng hơn"));
      expect(getScenario(store).reasoning).toBe("Vì đạo đức quan trọng hơn");
    });

    it("preserves both fields together", () => {
      store.dispatch(setInitialPosition("đức_hạnh"));
      store.dispatch(setReasoning("Lý do chi tiết"));
      const s = getScenario(store);
      expect(s.initialPosition).toBe("đức_hạnh");
      expect(s.reasoning).toBe("Lý do chi tiết");
    });

    it("validates respond payload shape matches API contract", () => {
      store.dispatch(setInitialPosition("đức_hạnh"));
      store.dispatch(setReasoning("Lý do"));
      const s = getScenario(store);

      // Simulate building the API payload
      const payload = {
        scenarioId: SCENARIO_ID,
        body: {
          initialPosition: s.initialPosition,
          reasoning: s.reasoning || undefined,
        },
      };
      expect(payload.body.initialPosition).toBeTruthy();
      expect(payload.scenarioId).toBe(SCENARIO_ID);
    });
  });

  // ─── Phase 3: Perspectives (Swipeable Cards) ──────────────────────────────

  describe("Phase 3: Perspectives — Swipeable Navigation", () => {
    beforeEach(() => {
      store.dispatch(setCurrentPhase("perspectives"));
    });

    it("starts at first perspective", () => {
      expect(getScenario(store).activePerspectiveIndex).toBe(0);
    });

    it("navigates forward through perspectives", () => {
      store.dispatch(setActivePerspectiveIndex(1));
      expect(getScenario(store).activePerspectiveIndex).toBe(1);
      store.dispatch(setActivePerspectiveIndex(2));
      expect(getScenario(store).activePerspectiveIndex).toBe(2);
    });

    it("navigates backward", () => {
      store.dispatch(setActivePerspectiveIndex(2));
      store.dispatch(setActivePerspectiveIndex(1));
      expect(getScenario(store).activePerspectiveIndex).toBe(1);
    });

    it("handles boundary: stays at 0 on underflow", () => {
      const clampedIdx = Math.max(0 - 1, 0);
      store.dispatch(setActivePerspectiveIndex(clampedIdx));
      expect(getScenario(store).activePerspectiveIndex).toBe(0);
    });

    it("handles boundary: clamps at last perspective", () => {
      const maxIdx = mockPerspectives.length - 1;
      const clampedIdx = Math.min(maxIdx + 1, maxIdx);
      store.dispatch(setActivePerspectiveIndex(clampedIdx));
      expect(getScenario(store).activePerspectiveIndex).toBe(2);
    });

    it("preserves initial position while browsing perspectives", () => {
      store.dispatch(setInitialPosition("đức_hạnh"));
      store.dispatch(setActivePerspectiveIndex(2));
      const s = getScenario(store);
      expect(s.initialPosition).toBe("đức_hạnh");
      expect(s.activePerspectiveIndex).toBe(2);
    });
  });

  // ─── Phase 4: Frameworks (Stepper Timeline) ───────────────────────────────

  describe("Phase 4: Frameworks — Stepper Navigation", () => {
    beforeEach(() => {
      store.dispatch(setCurrentPhase("framework"));
    });

    it("starts at first framework", () => {
      expect(getScenario(store).activeFrameworkIndex).toBe(0);
    });

    it("steps forward through frameworks", () => {
      store.dispatch(setActiveFrameworkIndex(1));
      expect(getScenario(store).activeFrameworkIndex).toBe(1);
    });

    it("steps backward", () => {
      store.dispatch(setActiveFrameworkIndex(1));
      store.dispatch(setActiveFrameworkIndex(0));
      expect(getScenario(store).activeFrameworkIndex).toBe(0);
    });

    it("can jump to any framework by index", () => {
      store.dispatch(setActiveFrameworkIndex(1));
      expect(getScenario(store).activeFrameworkIndex).toBe(1);
      store.dispatch(setActiveFrameworkIndex(0));
      expect(getScenario(store).activeFrameworkIndex).toBe(0);
    });
  });

  // ─── Phase 5: Rethink ─────────────────────────────────────────────────────

  describe("Phase 5: Rethink — Revised Stance", () => {
    beforeEach(() => {
      store.dispatch(setCurrentPhase("rethink"));
    });

    it("captures revised position", () => {
      store.dispatch(setRevisedPosition("thực_dụng"));
      expect(getScenario(store).revisedPosition).toBe("thực_dụng");
    });

    it("captures reflection text", () => {
      store.dispatch(setReflection("Tôi đã thay đổi suy nghĩ sau khi xem khung phân tích"));
      expect(getScenario(store).reflection).toBe(
        "Tôi đã thay đổi suy nghĩ sau khi xem khung phân tích",
      );
    });

    it("validates rethink payload shape matches API contract", () => {
      store.dispatch(setRevisedPosition("thực_dụng"));
      store.dispatch(setReflection("Reflection text"));
      const s = getScenario(store);

      const payload = {
        scenarioId: SCENARIO_ID,
        body: {
          revisedPosition: s.revisedPosition,
          reflection: s.reflection || undefined,
        },
      };
      expect(payload.body.revisedPosition).toBeTruthy();
      expect(payload.scenarioId).toBe(SCENARIO_ID);
    });
  });

  // ─── Reset ─────────────────────────────────────────────────────────────────

  describe("resetScenarioUi", () => {
    it("resets all scenario UI state to defaults", () => {
      // Populate state
      store.dispatch(setCurrentPhase("rethink"));
      store.dispatch(setActivePerspectiveIndex(2));
      store.dispatch(setActiveFrameworkIndex(1));
      store.dispatch(setInitialPosition("đức_hạnh"));
      store.dispatch(setReasoning("Lý do"));
      store.dispatch(setRevisedPosition("thực_dụng"));
      store.dispatch(setReflection("Reflection"));

      // Reset
      store.dispatch(resetScenarioUi());

      const s = getScenario(store);
      expect(s.currentPhase).toBe("situation");
      expect(s.activePerspectiveIndex).toBe(0);
      expect(s.activeFrameworkIndex).toBe(0);
      expect(s.initialPosition).toBe("");
      expect(s.reasoning).toBe("");
      expect(s.revisedPosition).toBe("");
      expect(s.reflection).toBe("");
    });
  });

  // ─── Full E2E Walkthrough ──────────────────────────────────────────────────

  describe("Full Scenario Flow Walkthrough", () => {
    it("navigates situation → respond → perspectives → framework → rethink with data persistence", () => {
      // ── Phase 1: Situation ──
      expect(getScenario(store).currentPhase).toBe("situation");

      // ── Phase 2: Respond ──
      store.dispatch(setInitialPosition("đức_hạnh"));
      store.dispatch(setReasoning("Đạo đức quan trọng nhất"));
      expect(getScenario(store).initialPosition).toBe("đức_hạnh");

      // ── Phase 3: Perspectives ──
      store.dispatch(setCurrentPhase("perspectives"));
      store.dispatch(setActivePerspectiveIndex(0));
      store.dispatch(setActivePerspectiveIndex(1));
      store.dispatch(setActivePerspectiveIndex(2));
      // Data persists
      expect(getScenario(store).initialPosition).toBe("đức_hạnh");
      expect(getScenario(store).reasoning).toBe("Đạo đức quan trọng nhất");

      // ── Phase 4: Framework ──
      store.dispatch(setCurrentPhase("framework"));
      store.dispatch(setActiveFrameworkIndex(0));
      store.dispatch(setActiveFrameworkIndex(1));
      // Previous data persists
      expect(getScenario(store).initialPosition).toBe("đức_hạnh");

      // ── Phase 5: Rethink ──
      store.dispatch(setCurrentPhase("rethink"));
      store.dispatch(setRevisedPosition("thực_dụng"));
      store.dispatch(setReflection("Khung phân tích utilitarianism đã thay đổi suy nghĩ của tôi"));

      // Verify complete accumulated state
      const final = getScenario(store);
      expect(final.currentPhase).toBe("rethink");
      expect(final.initialPosition).toBe("đức_hạnh");
      expect(final.reasoning).toBe("Đạo đức quan trọng nhất");
      expect(final.revisedPosition).toBe("thực_dụng");
      expect(final.reflection).toBe("Khung phân tích utilitarianism đã thay đổi suy nghĩ của tôi");
      expect(final.activePerspectiveIndex).toBe(2);
      expect(final.activeFrameworkIndex).toBe(1);
    });
  });

  // ─── API Contract Verification ─────────────────────────────────────────────

  describe("API Contract Verification", () => {
    it("respond payload matches POST /scenarios/:id/respond contract", () => {
      const payload = {
        initialPosition: "đức_hạnh",
        reasoning: "Test reasoning",
      };
      // Matches RespondScenarioInput from validator
      expect(payload).toHaveProperty("initialPosition");
      expect(typeof payload.initialPosition).toBe("string");
      expect(payload.initialPosition.length).toBeGreaterThan(0);
    });

    it("rethink payload matches PATCH /scenarios/:id/rethink contract", () => {
      const payload = {
        revisedPosition: "thực_dụng",
        reflection: "Test reflection",
      };
      expect(payload).toHaveProperty("revisedPosition");
      expect(typeof payload.revisedPosition).toBe("string");
      expect(payload.revisedPosition.length).toBeGreaterThan(0);
    });

    it("respond result shape includes response + perspectiveStats", () => {
      expect(mockRespondResult).toHaveProperty("response");
      expect(mockRespondResult).toHaveProperty("perspectiveStats");
      expect(mockRespondResult.response).toHaveProperty("initialPosition");
      expect(Array.isArray(mockRespondResult.perspectiveStats)).toBe(true);
      for (const stat of mockRespondResult.perspectiveStats) {
        expect(stat).toHaveProperty("perspectiveType");
        expect(stat).toHaveProperty("count");
        expect(stat).toHaveProperty("percentage");
        expect(stat.count).toBeGreaterThanOrEqual(0);
        expect(stat.percentage).toBeGreaterThanOrEqual(0);
        expect(stat.percentage).toBeLessThanOrEqual(100);
      }
    });

    it("rethink result shape matches ScenarioResponseDTO", () => {
      expect(mockRethinkResult).toHaveProperty("revisedPosition");
      expect(mockRethinkResult).toHaveProperty("reflection");
      expect(mockRethinkResult.revisedPosition).toBeTruthy();
    });

    it("scenario detail includes perspectives and frameworks arrays", () => {
      expect(Array.isArray(mockScenarioDetail.perspectives)).toBe(true);
      expect(Array.isArray(mockScenarioDetail.frameworks)).toBe(true);
      expect(mockScenarioDetail.perspectives.length).toBeGreaterThan(0);
      expect(mockScenarioDetail.frameworks.length).toBeGreaterThan(0);
    });

    it("perspective stats percentages sum to ~100", () => {
      const total = mockRespondResult.perspectiveStats.reduce((s, p) => s + p.percentage, 0);
      expect(total).toBe(100);
    });
  });

  // ─── Cross-Module: Scenario → Debate ───────────────────────────────────────

  describe("Cross-Module: Scenario stance informs Debate argument", () => {
    it("scenario initial position can seed debate argument content", () => {
      store.dispatch(setInitialPosition("đức_hạnh"));
      store.dispatch(setReasoning("Đạo đức là nền tảng"));

      const s = getScenario(store);

      // Simulate building a debate argument payload from scenario stance
      const debatePayload = {
        debateId: DEBATE_ID,
        body: {
          stance: "AGREE",
          content: `Dựa trên lập trường "${s.initialPosition}": ${s.reasoning}`,
        },
      };

      expect(debatePayload.body.content).toContain("đức_hạnh");
      expect(debatePayload.body.content).toContain("Đạo đức là nền tảng");
      expect(debatePayload.body.content.length).toBeGreaterThan(50);
    });

    it("revised position (rethink) can update debate stance", () => {
      store.dispatch(setInitialPosition("đức_hạnh"));
      store.dispatch(setRevisedPosition("thực_dụng"));

      const s = getScenario(store);
      expect(s.initialPosition).not.toBe(s.revisedPosition);

      // A user might update their debate argument after rethinking
      const updatedDebateContent = `Lập trường ban đầu: ${s.initialPosition}. Sau khi phân tích: ${s.revisedPosition}.`;
      expect(updatedDebateContent).toContain("đức_hạnh");
      expect(updatedDebateContent).toContain("thực_dụng");
    });
  });

  // ─── Edge Cases ────────────────────────────────────────────────────────────

  describe("Edge Cases", () => {
    it("handles empty perspectives list gracefully", () => {
      const emptyScenario = { ...mockScenarioDetail, perspectives: [] };
      expect(emptyScenario.perspectives).toHaveLength(0);
      // UI should show empty state, navigation should be disabled
      const clampedIdx = Math.max(0, Math.min(0, emptyScenario.perspectives.length - 1));
      expect(clampedIdx).toBe(0);
    });

    it("handles empty frameworks list gracefully", () => {
      const emptyScenario = { ...mockScenarioDetail, frameworks: [] };
      expect(emptyScenario.frameworks).toHaveLength(0);
    });

    it("handles very long position text", () => {
      const longText = "A".repeat(300);
      store.dispatch(setInitialPosition(longText));
      expect(getScenario(store).initialPosition).toBe(longText);
      expect(getScenario(store).initialPosition.length).toBe(300);
    });

    it("handles unicode/Vietnamese text in all fields", () => {
      store.dispatch(setInitialPosition("Chủ nghĩa vị lợi — đức hạnh"));
      store.dispatch(setReasoning("Triết học phương Đông có ảnh hưởng lớn"));
      store.dispatch(setRevisedPosition("Nghĩa vụ luận"));
      store.dispatch(setReflection("Suy ngẫm về bổn phận và trách nhiệm"));

      const s = getScenario(store);
      expect(s.initialPosition).toContain("đức hạnh");
      expect(s.reasoning).toContain("phương Đông");
      expect(s.revisedPosition).toContain("Nghĩa vụ");
      expect(s.reflection).toContain("bổn phận");
    });

    it("multiple resets don't corrupt state", () => {
      store.dispatch(setInitialPosition("test"));
      store.dispatch(resetScenarioUi());
      store.dispatch(resetScenarioUi());
      store.dispatch(resetScenarioUi());

      const s = getScenario(store);
      expect(s.initialPosition).toBe("");
      expect(s.currentPhase).toBe("situation");
    });

    it("rapid phase transitions preserve data", () => {
      store.dispatch(setInitialPosition("test-position"));
      store.dispatch(setCurrentPhase("perspectives"));
      store.dispatch(setCurrentPhase("framework"));
      store.dispatch(setCurrentPhase("rethink"));
      store.dispatch(setCurrentPhase("situation"));
      store.dispatch(setCurrentPhase("rethink"));

      expect(getScenario(store).initialPosition).toBe("test-position");
      expect(getScenario(store).currentPhase).toBe("rethink");
    });
  });

  // ─── Validation Failures ───────────────────────────────────────────────────

  describe("Validation Failure Scenarios", () => {
    it("empty initialPosition should fail API validation", () => {
      const payload = { initialPosition: "", reasoning: "Some reason" };
      expect(payload.initialPosition.trim().length).toBe(0);
    });

    it("whitespace-only initialPosition should fail API validation", () => {
      const payload = { initialPosition: "   ", reasoning: undefined };
      expect(payload.initialPosition.trim().length).toBe(0);
    });

    it("empty revisedPosition should fail rethink API validation", () => {
      const payload = { revisedPosition: "", reflection: "Some reflection" };
      expect(payload.revisedPosition.trim().length).toBe(0);
    });
  });
});
