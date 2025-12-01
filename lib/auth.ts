import NextAuth from "next-auth";
import { authConfig } from "@/app/auth/config";

export const runtime = "nodejs";

const AUTH_SECRET = process.env.AUTH_SECRET || "rkibxM3dsw2LYlK5zIPUY4Tn2ili1P7dgaRdBVe/eU4=";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: AUTH_SECRET,
  trustHost: true,
});

