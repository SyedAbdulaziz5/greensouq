# Edge Runtime Fix for Authentication

## Issue
NextAuth v5 uses Edge runtime by default, but bcryptjs requires Node.js runtime.

## Solution Applied

### 1. **Route Handlers Set to Node.js Runtime**
- ✅ `app/auth/[...nextauth]/route.ts` - Added `export const runtime = "nodejs"`
- ✅ `app/api/auth/signup/route.ts` - Added `export const runtime = "nodejs"`

### 2. **Runtime Configuration Added**
- ✅ Added `export const runtime = "nodejs"` to auth configuration files
- ✅ Ensures all authentication operations use Node.js runtime

### 3. **Imports Updated**
- ✅ Changed from `import bcrypt from "bcryptjs"` to `import { compare, hash } from "bcryptjs"`
- ✅ This ensures only the needed functions are imported

### 4. **How It Works**
- All authentication route handlers explicitly use Node.js runtime
- The auth configuration and lib files are set to Node.js runtime
- The `authorize` function in the Credentials provider runs in Node.js context
- bcrypt operations (compare/hash) work correctly in Node.js runtime

## Files Modified

1. `app/auth/[...nextauth]/route.ts` - Added `export const runtime = "nodejs"`
2. `app/api/auth/signup/route.ts` - Added `export const runtime = "nodejs"`
3. `app/auth/config.ts` - Added `export const runtime = "nodejs"`, updated imports, and fixed Prisma typing
4. `lib/auth.ts` - Added `export const runtime = "nodejs"`
5. `middleware.ts` - Added `export const runtime = "nodejs"`
6. `lib/prisma.ts` - Simplified Prisma client setup and added logging
7. `prisma/schema.prisma` - Added url field to datasource for Prisma 6 compatibility
8. `package.json` - Downgraded Prisma from v7 to v6 for better compatibility

## Verification

The error should be resolved because:
- ✅ All routes using bcrypt are set to Node.js runtime
- ✅ bcrypt functions are properly imported
- ✅ Prisma operations work in Node.js runtime

If the error persists, ensure:
1. Environment variables are set correctly
2. Database connection is working
3. Prisma client is generated (`npx prisma generate`)

