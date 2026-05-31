import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Production CLI and admin operations should use the direct Prisma Postgres
// connection. Local development may use DATABASE_URL for both paths.
const directDatabaseUrl = process.env.DIRECT_DATABASE_URL ?? env("DATABASE_URL");

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
  },
  datasource: {
    url: directDatabaseUrl,
  },
});
