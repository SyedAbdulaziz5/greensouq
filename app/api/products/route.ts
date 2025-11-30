import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (category && typeof category !== "string") {
      return NextResponse.json(
        { error: "Invalid category parameter" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        imageUrl: true,
        category: true,
      },
      take: 100,
    });

    const formattedProducts = products.map((product) => ({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      category: product.category || undefined,
    }));

    return NextResponse.json(formattedProducts, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    
    const errorMessage = process.env.NODE_ENV === "development" 
      ? (error instanceof Error ? error.message : "Failed to fetch products")
      : "Failed to fetch products";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
