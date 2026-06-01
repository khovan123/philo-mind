/**
 * Seed: 5 Story Scenarios — Full 7-Step Story Mode Engine
 * Issue: #61 — T-C07
 *
 * Source: ./data/story-scenarios.ts (inline TypeScript data)
 * Dependencies: Topic (matched by title)
 *
 * Records seeded:
 *   - PhilosophyTag       (upsert by name)
 *   - StoryScenario       (upsert by title)
 *   - StoryLearnCard      (upsert by storyId + order)
 *   - StoryLearnCardTag   (upsert by cardId + tagId)
 *   - StoryChoice         (delete + re-create per story for idempotency)
 *   - StoryConsequence    (cascade from StoryChoice)
 *   - AnalysisTab         (upsert by consequenceId + tabType)
 *
 * Idempotency: upsert on stable keys — safe to run multiple times.
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";
import { PHILOSOPHY_TAGS, STORY_SCENARIOS } from "./data/story-scenarios.js";

export async function seedStories(prisma: PrismaClient): Promise<void> {
  // ── Step 1: Upsert PhilosophyTags ──────────────────────────────────────────
  const tagMap = new Map<string, string>(); // name → id

  for (const tag of PHILOSOPHY_TAGS) {
    const record = await prisma.philosophyTag.upsert({
      where: { name: tag.name },
      update: { description: tag.description },
      create: { name: tag.name, description: tag.description },
    });
    tagMap.set(tag.name, record.id);
  }

  // ── Step 2: Seed each StoryScenario ────────────────────────────────────────
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const scenario of STORY_SCENARIOS) {
    // Lookup topic by exact title
    const topic = await prisma.topic.findFirst({
      where: { title: scenario.topicTitle },
    });

    if (!topic) {
      console.warn(
        `    ⚠ Topic not found: "${scenario.topicTitle}" — skipping story "${scenario.title}"`,
      );
      skipped++;
      continue;
    }

    // Upsert the StoryScenario by title
    const existingStory = await prisma.storyScenario.findFirst({
      where: { title: scenario.title },
    });

    let storyId: string;

    if (existingStory) {
      // Update metadata but preserve id
      await prisma.storyScenario.update({
        where: { id: existingStory.id },
        data: {
          topicId: topic.id,
          description: scenario.description,
          characterRole: scenario.characterRole ?? null,
          historicalContext: scenario.historicalContext ?? null,
          difficulty: scenario.difficulty,
        },
      });
      storyId = existingStory.id;
      updated++;
    } else {
      const newStory = await prisma.storyScenario.create({
        data: {
          topicId: topic.id,
          title: scenario.title,
          description: scenario.description,
          characterRole: scenario.characterRole ?? null,
          historicalContext: scenario.historicalContext ?? null,
          difficulty: scenario.difficulty,
        },
      });
      storyId = newStory.id;
      created++;
    }

    // ── Step 3: Upsert LearnCards (by storyId + order) ─────────────────────
    for (const card of scenario.learnCards) {
      const existingCard = await prisma.storyLearnCard.findFirst({
        where: { storyId, order: card.order },
      });

      let cardId: string;

      if (existingCard) {
        await prisma.storyLearnCard.update({
          where: { id: existingCard.id },
          data: {
            title: card.title,
            body: card.body,
            sourceRef: card.sourceRef ?? null,
          },
        });
        cardId = existingCard.id;
      } else {
        const newCard = await prisma.storyLearnCard.create({
          data: {
            storyId,
            title: card.title,
            body: card.body,
            sourceRef: card.sourceRef ?? null,
            order: card.order,
          },
        });
        cardId = newCard.id;
      }

      // Upsert tags for this card
      for (const tagName of card.tags) {
        const tagId = tagMap.get(tagName);
        if (!tagId) {
          console.warn(`    ⚠ Tag not found: "${tagName}" — skipping tag on card "${card.title}"`);
          continue;
        }
        await prisma.storyLearnCardTag.upsert({
          where: { cardId_tagId: { cardId, tagId } },
          update: {},
          create: { cardId, tagId },
        });
      }
    }

    // ── Step 4: Re-seed Choices + Consequences + AnalysisTabs ──────────────
    // Strategy: delete existing choices for this story and recreate
    // This is safe because choices have no user-generated data in seed context
    await prisma.storyChoice.deleteMany({ where: { storyId } });

    for (const choice of scenario.choices) {
      const newChoice = await prisma.storyChoice.create({
        data: {
          storyId,
          choiceText: choice.choiceText,
          reasoningPrompt: choice.reasoningPrompt ?? null,
        },
      });

      // Create the single consequence for this choice
      const newConsequence = await prisma.storyConsequence.create({
        data: {
          choiceId: newChoice.id,
          resultText: choice.consequence.resultText,
          ethicalAnalysis: choice.consequence.ethicalAnalysis ?? null,
          philosophicalAnalysis: choice.consequence.philosophicalAnalysis ?? null,
          politicalEconomicAnalysis: choice.consequence.politicalEconomicAnalysis ?? null,
          historicalImpact: choice.consequence.historicalImpact ?? null,
        },
      });

      // Create AnalysisTabs for this consequence
      // unique constraint: (consequenceId, tabType) — use upsert
      for (const tab of choice.consequence.analysisTabs) {
        await prisma.analysisTab.upsert({
          where: {
            consequenceId_tabType: {
              consequenceId: newConsequence.id,
              tabType: tab.tabType,
            },
          },
          update: { content: tab.content, order: tab.order },
          create: {
            consequenceId: newConsequence.id,
            tabType: tab.tabType,
            content: tab.content,
            order: tab.order,
          },
        });
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  const totalStories = created + updated;
  if (totalStories > 0) {
    seedLog("StoryScenario", totalStories);
    if (created > 0) console.log(`    → ${created} created, ${updated} updated`);
  }
  if (skipped > 0) {
    seedSkip("StoryScenario", `${skipped} skipped (topic not found)`);
  }
  seedLog("PhilosophyTag", tagMap.size);
}
