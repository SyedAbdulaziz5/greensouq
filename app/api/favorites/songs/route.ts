import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Fetch user's favorite songs
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const songs = await prisma.favoriteSong.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        songName: true,
        createdAt: true,
      },
    });

    return NextResponse.json(songs);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching favorite songs:", error);
    }
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch favorite songs";
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === "development" ? errorMessage : "Failed to fetch favorite songs" 
      },
      { status: 500 }
    );
  }
}

// POST - Add favorite song
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { songName } = await request.json();

    if (!songName || typeof songName !== "string" || songName.trim() === "") {
      return NextResponse.json(
        { error: "Song name is required" },
        { status: 400 }
      );
    }

    const trimmedSongName = songName.trim();

    const favoriteSong = await prisma.favoriteSong.create({
      data: {
        userId: session.user.id,
        songName: trimmedSongName,
      },
      select: {
        id: true,
        songName: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Song added to favorites",
      song: favoriteSong,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error adding favorite song:", error);
    }
    const errorMessage = error instanceof Error ? error.message : "Failed to add favorite song";
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === "development" ? errorMessage : "Failed to add favorite song" 
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove favorite song
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const songId = searchParams.get("songId");

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      );
    }

    // Verify the song belongs to the user
    const song = await prisma.favoriteSong.findUnique({
      where: { id: songId },
    });

    if (!song) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      );
    }

    if (song.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.favoriteSong.delete({
      where: { id: songId },
    });

    return NextResponse.json({ message: "Song removed from favorites" });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error removing favorite song:", error);
    }
    return NextResponse.json(
      { error: "Failed to remove favorite song" },
      { status: 500 }
    );
  }
}

