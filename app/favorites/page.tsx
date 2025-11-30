import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/app/components/ProductCard";
import { ProductCardSkeleton } from "@/app/components/ui/LoadingSkeleton";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "My Favorites",
  description: "View your favorite plants and products",
};

async function FavoritesList() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  try {
    const favorites = await (prisma as any).favorite.findMany({
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

    const formattedFavorites = favorites.map((fav: any) => ({
      id: fav.product.id.toString(),
      name: fav.product.name,
      price: fav.product.price,
      description: fav.product.description,
      image: fav.product.imageUrl,
      category: fav.product.category || undefined,
    }));

    if (formattedFavorites.length === 0) {
      return (
        <div className="text-center py-12 sm:py-16 px-4">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
            No favorites yet
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Start adding products to your favorites to see them here!
          </p>
          <a
            href="/products"
            className="inline-block bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-sm hover:bg-green-700 transition text-sm sm:text-base"
          >
            Browse Products
          </a>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {formattedFavorites.map((product: any) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error loading favorites:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">
          Failed to load favorites. Please try again later.
        </p>
      </div>
    );
  }
}

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Your saved favorite plants and products
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <FavoritesList />
      </Suspense>
    </div>
  );
}

