import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MINI_GAMES } from "../src/seed/data/minigames.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../../data/11-minigames");

function matchingMarkdown(game) {
  const pairs = game.config.pairs ?? [];
  const header = "| Quan điểm / Câu nói | Trường phái / Khái niệm |\n| :-- | :-- |\n";
  const rows = pairs
    .map((pair) => `| ${pair.left} | ${pair.right} |`)
    .join("\n");
  return `${header}${rows}\n`;
}

function guessWhoMarkdown(game) {
  const characters = game.config.characters ?? [];
  return characters
    .map((character, index) => {
      const hints = (character.hints ?? [])
        .map((hint, hintIndex) => `- Gợi ý ${hintIndex + 1}: ${hint}`)
        .join("\n");
      return `### Nhân vật ${index + 1}:\n\n${hints}\n- Đáp án: ${character.answer}`;
    })
    .join("\n\n");
}

function logicMarkdown(game) {
  const items = game.config.items ?? [];
  const lines = items.map((item, index) => `${index + 1}. ${item.text}`);
  return `${game.config.prompt ?? ""}\n\n${lines.join("\n")}\n\n**Solution:** ${game.config.solution}\n`;
}

function frontmatter(game) {
  const lines = [
    "---",
    `tên: ${game.title}`,
    `loại: ${game.gameType}`,
    `mô_tả: ${game.description}`,
  ];
  if (game.topicTitle) lines.push(`chủ_đề: ${game.topicTitle}`);
  if (game.config.timeLimit) lines.push(`thời_gian: ${game.config.timeLimit} giây`);
  lines.push("---", "");
  return lines.join("\n");
}

function slugify(title) {
  const index = MINI_GAMES.findIndex((game) => game.title === title) + 1;
  const slug = title
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${String(index).padStart(2, "0")}-${slug}.md`;
}

function bodyFor(game) {
  switch (game.gameType) {
    case "matching":
      return matchingMarkdown(game);
    case "guess-who":
      return guessWhoMarkdown(game);
    case "logic-puzzle":
      return logicMarkdown(game);
    default:
      return "";
  }
}

mkdirSync(outDir, { recursive: true });
for (const game of MINI_GAMES) {
  const content = `${frontmatter(game)}${bodyFor(game)}`;
  writeFileSync(resolve(outDir, slugify(game.title)), content, "utf8");
}

console.log(`Exported ${MINI_GAMES.length} minigame markdown files`);
