import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Debug environment variables
console.log("DATABASE_URL", process.env.DATABASE_URL);
console.log("AUTH_SECRET", process.env.AUTH_SECRET);
console.log("NEXTAUTH_URL", process.env.NEXTAUTH_URL);

export const prisma =
  globalForPrisma.prisma ??
  (globalForPrisma.prisma = (() => {
    if (!process.env.DATABASE_URL) {
      // Return a mock client during build
      return {
        product: { findMany: async () => [], findUnique: async () => null, count: async () => 0 },
        user: { findUnique: async () => null, findMany: async () => [] },
        favorite: { findMany: async () => [], create: async () => ({}), delete: async () => ({}) },
        $disconnect: async () => {},
      } as any;
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter: adapter as any,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    } as any);
  })());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
