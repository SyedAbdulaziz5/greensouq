import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is not set.\n' +
      'Please set DATABASE_URL in your environment variables.'
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter: adapter as any,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  } as any);
}

if (!globalForPrisma.prisma && process.env.DATABASE_URL) {
  globalForPrisma.prisma = getPrismaClient();
}

// Lazy getter for prisma client
function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Please configure it in your environment variables.');
  }
  globalForPrisma.prisma = getPrismaClient();
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
