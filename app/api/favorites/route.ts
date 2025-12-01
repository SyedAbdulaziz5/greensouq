import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Fetch user's favorites
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            imageUrl: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedFavorites = favorites.map((fav) => ({
      id: fav.product.id.toString(),
      name: fav.product.name,
      price: fav.product.price,
      description: fav.product.description,
      image: fav.product.imageUrl,
      category: fav.product.category || undefined,
      favoritedAt: fav.createdAt,
    }));

    return NextResponse.json(formattedFavorites);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching favorites:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST - Add favorite
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const productIdNum = parseInt(productId, 10);
    if (isNaN(productIdNum)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productIdNum },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productIdNum,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Product already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId: productIdNum,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            imageUrl: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Product added to favorites",
      favorite: {
        id: favorite.product.id.toString(),
        name: favorite.product.name,
        price: favorite.product.price,
        description: favorite.product.description,
        image: favorite.product.imageUrl,
        category: favorite.product.category || undefined,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error adding favorite:", error);
    }
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}

// DELETE - Remove favorite
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const productIdNum = parseInt(productId, 10);
    if (isNaN(productIdNum)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productIdNum,
        },
      },
    });

    return NextResponse.json({ message: "Product removed from favorites" });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error removing favorite:", error);
    }
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}

