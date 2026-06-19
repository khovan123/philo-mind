/**
 * CSV Reader Utility
 * Reads seed CSV files from project-root/data/ directory
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";
import type { QuestionType } from "../../prisma/generated/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Navigate from services/src/seed/utils -> project root -> data/
const DATA_DIR = resolve(__dirname, "../../../../data");

export function readCsv<T extends object>(filename: string): T[] {
  const filepath = resolve(DATA_DIR, filename);
  const content = readFileSync(filepath, "utf-8");

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as T[];

  return records;
}

/**
 * Read a JSON seed file from project-root/data/ (relative path allowed,
 * e.g. "chapter-01/flashcards.json").
 */
export function readJson<T>(relativePath: string): T {
  const filepath = resolve(DATA_DIR, relativePath);
  const content = readFileSync(filepath, "utf-8");
  return JSON.parse(content) as T;
}

/**
 * Map Vietnamese difficulty values to Prisma enum
 */
export function mapDifficulty(vi: string): "EASY" | "MEDIUM" | "HARD" {
  const map: Record<string, "EASY" | "MEDIUM" | "HARD"> = {
    Dễ: "EASY",
    "Trung bình": "MEDIUM",
    Khó: "HARD",
  };
  return map[vi] || "EASY";
}

/**
 * Map Vietnamese question type values to Prisma enum
 */
export function mapQuestionType(vi: string): QuestionType {
  const map: Record<string, QuestionType> = {
    trắc_nghiệm: "SINGLE_CHOICE" as QuestionType,
    nhiều_đáp_án: "MULTIPLE_CHOICE" as QuestionType,
    tự_luận: "OPEN_TEXT" as QuestionType,
    tình_huống_đạo_đức: "MORAL_DILEMMA" as QuestionType,
    logic: "LOGIC" as QuestionType,
  };
  return map[vi] || ("OPEN_TEXT" as QuestionType);
}
