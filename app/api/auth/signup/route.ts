import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await (prisma as any).user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await (prisma as any).user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
    });

    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Check for specific Prisma errors
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }
    
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Database connection failed. Please check your database configuration." },
        { status: 500 }
      );
    }
    
    // Return more detailed error information in development
    const errorMessage = process.env.NODE_ENV === "development"
      ? error?.message || "Failed to create account"
      : "Failed to create account";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error?.code : undefined
      },
      { status: 500 }
    );
  }
}

