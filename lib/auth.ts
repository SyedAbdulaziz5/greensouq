import NextAuth from "next-auth";
import { authConfig } from "@/app/auth/config";

export const runtime = "nodejs";

const AUTH_SECRET = process.env.AUTH_SECRET || "rkibxM3dsw2LYlK5zIPUY4Tn2ili1P7dgaRdBVe/eU4=";

// Use localhost for development, Vercel URL for production
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 
  (process.env.NODE_ENV === "development" 
    ? "http://localhost:3000" 
    : "https://greensouq-one.vercel.app");

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: AUTH_SECRET,
  trustHost: true,
});

