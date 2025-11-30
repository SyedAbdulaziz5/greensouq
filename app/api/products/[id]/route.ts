import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const productId = parseInt(id, 10);

    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        imageUrl: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const formattedProduct = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      category: product.category || undefined,
    };

    return NextResponse.json(formattedProduct, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    
    const errorMessage = process.env.NODE_ENV === "development"
      ? (error instanceof Error ? error.message : "Failed to fetch product")
      : "Failed to fetch product";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
