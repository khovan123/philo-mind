import { STORY_SCENARIOS } from "../seed/data/story-scenarios.js";
import { TOPIC_PERSPECTIVES } from "../seed/data/topic-perspectives.js";

const ANALYSIS_TAB_TYPES = [
  "ETHICAL",
  "PHILOSOPHICAL",
  "POLITICAL_ECONOMIC",
  "HISTORICAL",
] as const;

describe("STORY_SCENARIOS seed data (T-C07)", () => {
  const topicTitles = new Set(TOPIC_PERSPECTIVES.map((entry) => entry.topicTitle));
  topicTitles.add("Biện chứng và Siêu hình");

  it("includes 6 complete story scenarios", () => {
    expect(STORY_SCENARIOS).toHaveLength(6);
  });

  it.each(STORY_SCENARIOS.map((story) => [story.title, story] as const))(
    "maps story %s to an existing topic title",
    (_title, story) => {
      expect(topicTitles.has(story.topicTitle)).toBe(true);
    },
  );

  it.each(STORY_SCENARIOS.map((story) => [story.title, story] as const))(
    "story %s has learn cards, choices, and 4 analysis tabs per consequence",
    (_title, story) => {
      expect(story.learnCards.length).toBeGreaterThan(0);
      expect(story.choices.length).toBeGreaterThan(0);

      for (const choice of story.choices) {
        const tabTypes = choice.consequence.analysisTabs.map((tab) => tab.tabType);
        expect(tabTypes).toHaveLength(4);
        expect(new Set(tabTypes)).toEqual(new Set(ANALYSIS_TAB_TYPES));
      }
    },
  );
});
