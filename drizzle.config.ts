import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./apps/api/src/infrastructure/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});