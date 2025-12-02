import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_jqtVQP2GRln6@ep-proud-wind-ahp7vsl8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
  migrations: {
    seed: "tsx ./prisma/seed.ts",
  },
});

