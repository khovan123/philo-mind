// src/services/csv-content-reader.service.ts
import { readFileSync, statSync } from "node:fs";
import { parse } from "csv-parse/sync";

type CacheItem<T> = {
  mtimeMs: number;
  data: T[];
};

const cache = new Map<string, CacheItem<unknown>>();

export type CsvContentReaderOptions<Row, Node> = {
  csvPath: string;
  filterRow?: (row: Row, index: number) => boolean;
  mapRow: (row: Row, index: number) => Node;
  sort?: (a: Node, b: Node) => number;
};

export class CsvContentReaderService {
  static read<Row, Node>({
    csvPath,
    filterRow,
    mapRow,
    sort,
  }: CsvContentReaderOptions<Row, Node>): Node[] {
    const stat = statSync(csvPath);

    const cached = cache.get(csvPath) as CacheItem<Node> | undefined;
    if (cached && cached.mtimeMs === stat.mtimeMs) {
      return cached.data;
    }

    const content = readFileSync(csvPath, "utf-8");
    const rows = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    }) as Row[];

    const data = rows
      .map((row, index) => ({ row, index }))
      .filter(({ row, index }) => (filterRow ? filterRow(row, index) : true))
      .map(({ row, index }) => mapRow(row, index));

    if (sort) {
      data.sort(sort);
    }

    cache.set(csvPath, {
      mtimeMs: stat.mtimeMs,
      data,
    });

    return data;
  }
}
