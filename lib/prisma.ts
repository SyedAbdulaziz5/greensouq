import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient() {
  // Check for DATABASE_URL at runtime
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is not set.\n' +
      'Please create a .env.local file in the root directory with:\n' +
      'DATABASE_URL="your-postgresql-connection-string"\n' +
      'AUTH_SECRET="your-auth-secret"\n' +
      'NEXTAUTH_URL="http://localhost:3000"\n\n' +
      'You can copy .env.example to .env.local and fill in your values.'
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter: adapter as any,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  } as any);
}

// Lazy initialization - only create client when actually accessed
let _prisma: PrismaClient | undefined;

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  
  if (_prisma) {
    return _prisma;
  }
  
  // Only initialize if DATABASE_URL is available
  // This allows the module to be imported during build without errors
  if (process.env.DATABASE_URL) {
    _prisma = getPrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = _prisma;
    }
    return _prisma;
  }
  
  // If DATABASE_URL is not set, return a proxy that throws when accessed
  // This allows build to complete but will error at runtime if used
  return new Proxy({} as PrismaClient, {
    get(_target, prop) {
      if (prop === 'then') {
        // Handle promise-like behavior
        return undefined;
      }
      throw new Error(
        'DATABASE_URL environment variable is not set. Prisma client cannot be used.'
      );
    },
  });
}

export const prisma = getPrisma();
