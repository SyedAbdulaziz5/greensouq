import { prisma } from "@/lib/prisma";
import { Product, Category } from "@/app/types";

export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  try {
    if (categoryId && typeof categoryId !== "string") {
      throw new Error("Invalid category parameter");
    }

    const products = await prisma.product.findMany({
      where: categoryId ? { category: categoryId } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        imageUrl: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 100,
    });

    return products.map((product: {
      id: number;
      name: string;
      price: number;
      description: string;
      imageUrl: string;
      category: string | null;
      createdAt: Date;
      updatedAt: Date;
    }) => ({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      category: product.category || undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch products");
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    if (!id || typeof id !== "string") {
      return null;
    }

    const productId = parseInt(id, 10);
    if (isNaN(productId) || productId <= 0) {
      return null;
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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      return null;
    }

    return {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      category: product.category || undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch product");
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      where: {
        category: {
          not: null,
        },
      },
    });

    return categories
      .filter((p: { category: string | null }) => p.category)
      .map((p: { category: string | null }) => ({
        id: p.category!.toLowerCase().replace(/\s+/g, "-"),
        name: p.category!,
      }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}
