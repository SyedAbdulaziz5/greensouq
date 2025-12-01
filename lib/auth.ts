import NextAuth from "next-auth";
import { authConfig } from "@/app/auth/config";

export const runtime = "nodejs";

const AUTH_SECRET = process.env.AUTH_SECRET;

if (!AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is not set. Please configure it in your .env file.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: AUTH_SECRET,
  trustHost: true,
});

