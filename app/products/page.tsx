import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchProducts, fetchCategories } from "../lib/api";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { ProductGridSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete collection of plants, gardening tools, and accessories. Filter by category to find exactly what you need.",
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

async function ProductsList({ category }: { category?: string }) {
  try {
    const products = await fetchProducts(category);

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {category 
              ? `No products found in "${category}" category.` 
              : "No products available at the moment."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error loading products:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">
          Failed to load products. Please try again later.
        </p>
      </div>
    );
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams;
  
  let categories: Awaited<ReturnType<typeof fetchCategories>> = [];
  try {
    categories = await fetchCategories();
  } catch (error) {
    console.error("Error loading categories:", error);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">All Products</h1>
        
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 sm:overflow-visible sm:pb-0">
            <a
              href="/products"
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                !category
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  category === cat.name
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}
      </div>

      <ErrorBoundary>
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <ProductsList category={category} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

