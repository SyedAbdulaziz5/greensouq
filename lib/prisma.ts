import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Debug environment variables
console.log("DATABASE_URL", process.env.DATABASE_URL ? "✓ Set" : "✗ Not set");
console.log("AUTH_SECRET", process.env.AUTH_SECRET ? "✓ Set" : "✗ Not set");
console.log("NEXTAUTH_URL", process.env.NEXTAUTH_URL || "Not set");

function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is not set.\n' +
      'Please set DATABASE_URL in your Vercel environment variables.'
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter: adapter as any,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  } as any);
}

export const prisma =
  globalForPrisma.prisma ??
  (globalForPrisma.prisma = getPrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
