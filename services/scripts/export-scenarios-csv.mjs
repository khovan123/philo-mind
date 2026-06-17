import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { REAL_LIFE_SCENARIOS } from "../src/seed/data/real-life-scenarios.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

function esc(value) {
  const text = String(value ?? "").replace(/"/g, '""');
  return /[",\n\r]/.test(text) ? `"${text}"` : text;
}

const header =
  "chủ_đề,tiêu_đề,tình_huống,bối_cảnh,phân_tích_thực_dụng,phân_tích_nghĩa_vụ,phân_tích_đức_hạnh,phân_tích_quan_tâm";

const rows = REAL_LIFE_SCENARIOS.map((scenario) => {
  const byType = Object.fromEntries(
    scenario.perspectives.map((p) => [p.perspectiveType, p.content]),
  );
  return [
    scenario.topicTitle,
    scenario.title,
    scenario.situation,
    scenario.context,
    byType["thực_dụng"] ?? "",
    byType["nghĩa_vụ"] ?? "",
    byType["đức_hạnh"] ?? "",
    byType["quan_tâm"] ?? "",
  ]
    .map(esc)
    .join(",");
});

const csv = `${[header, ...rows].join("\n")}\n`;
const target = resolve(root, "data/07-scenarios.csv");
writeFileSync(target, csv, "utf8");

console.log(`Wrote ${rows.length} scenario rows to data/`);
