import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Environment variables with defaults
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_jqtVQP2GRln6@ep-proud-wind-ahp7vsl8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Debug environment variables
console.log("DATABASE_URL", DATABASE_URL ? "✓ Set" : "✗ Not set");

function getPrismaClient() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not set.');
  }

  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  } as any);
}

export const prisma =
  globalForPrisma.prisma ??
  (globalForPrisma.prisma = getPrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
