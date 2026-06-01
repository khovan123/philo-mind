import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DEBATES } from "../src/seed/data/debates.ts";
import { CRITICAL_QUESTIONS } from "../src/seed/data/critical-questions.ts";
import { BADGE_DEFINITIONS } from "../src/services/badge.service.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

function esc(value) {
  const text = String(value ?? "").replace(/"/g, '""');
  return /[",\n\r]/.test(text) ? `"${text}"` : text;
}

const questionTypeVi = {
  OPEN_TEXT: "tự_luận",
  MORAL_DILEMMA: "tình_huống_đạo_đức",
  LOGIC: "logic",
  SINGLE_CHOICE: "trắc_nghiệm",
  MULTIPLE_CHOICE: "nhiều_đáp_án",
};

const debateRows = DEBATES.map((d) =>
  [d.topicTitle, d.title, d.description].map(esc).join(","),
);
const debateCsv = `chủ_đề,tiêu_đề,mô_tả\n${debateRows.join("\n")}\n`;

const questionRows = CRITICAL_QUESTIONS.map((q) =>
  [q.topicTitle, q.question, questionTypeVi[q.questionType] ?? q.questionType]
    .map(esc)
    .join(","),
);
const questionCsv = `chủ_đề,câu_hỏi,loại\n${questionRows.join("\n")}\n`;

const badgeRows = BADGE_DEFINITIONS.map((b) =>
  [b.name, b.description, b.iconUrl, b.conditionType].map(esc).join(","),
);
const badgeCsv = `tên,mô_tả,icon,điều_kiện\n${badgeRows.join("\n")}\n`;

writeFileSync(resolve(root, "data/08-debates.csv"), debateCsv, "utf8");
writeFileSync(resolve(root, "data_real/08-debates.csv"), debateCsv, "utf8");
writeFileSync(resolve(root, "data/09-critical-questions.csv"), questionCsv, "utf8");
writeFileSync(resolve(root, "data_real/09-critical-questions.csv"), questionCsv, "utf8");
writeFileSync(resolve(root, "data/10-badges.csv"), badgeCsv, "utf8");
writeFileSync(resolve(root, "data_real/10-badges.csv"), badgeCsv, "utf8");

console.log(
  `Exported ${DEBATES.length} debates, ${CRITICAL_QUESTIONS.length} questions, ${BADGE_DEFINITIONS.length} badges`,
);
