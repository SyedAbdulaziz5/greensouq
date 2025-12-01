import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Check if products are favorited
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ favorited: [] });
    }

    const { searchParams } = new URL(request.url);
    const productIds = searchParams.get("ids");

    if (!productIds) {
      return NextResponse.json({ favorited: [] });
    }

    const ids = productIds.split(",").map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));

    if (ids.length === 0) {
      return NextResponse.json({ favorited: [] });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
        productId: { in: ids },
      },
      select: {
        productId: true,
      },
    });

    const favoritedIds = favorites.map((f) => f.productId.toString());

    return NextResponse.json({ favorited: favoritedIds });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error checking favorites:", error);
    }
    return NextResponse.json({ favorited: [] });
  }
}

