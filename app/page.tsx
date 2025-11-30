import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchCategories } from "./lib/api";
import CategoryCard from "./components/CategoryCard";
import HeroSection from "./components/sections/HeroSection";
import TopCategoriesSection from "./components/sections/TopCategoriesSection";
import IndoorPlantsSection from "./components/sections/IndoorPlantsSection";
import OutdoorPlantsSection from "./components/sections/OutdoorPlantsSection";
import HorizontalScrollSection from "./components/sections/HorizontalScrollSection";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { ProductGridSkeleton, CategoryCardSkeleton } from "./components/ui/LoadingSkeleton";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

export const metadata: Metadata = {
  title: "Home",
  description: "Browse our collection of beautiful plants, gardening tools, and accessories. Find the perfect plants for your home and garden.",
};

async function CategoriesSection() {
  try {
    const categories = await fetchCategories();

    if (categories.length === 0) {
      return null;
    }

    return (
      <section className="my-5">
        <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
          {categories.map((category) => (
            <div key={category.id} className="w-full sm:w-[48%] lg:w-[32%]">
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading categories:", error);
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load categories. Please try again later.
      </div>
    );
  }
}


export default async function Home() {
  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 -mt-8 sm:-mt-12 lg:-mt-16 relative z-20">
        <ErrorBoundary>
          <Suspense
            fallback={
              <section className="my-5">
                <div className="flex justify-center gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full sm:w-[48%] lg:w-[32%]">
                      <CategoryCardSkeleton />
                    </div>
                  ))}
                </div>
              </section>
            }
          >
            <CategoriesSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <TopCategoriesSection />
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense
            fallback={
              <section className="my-14">
                <h2 className="text-2xl text-gray-800 mb-6 text-center">Top Selling Indoor Plants</h2>
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              </section>
            }
          >
            <IndoorPlantsSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense
            fallback={
              <section className="my-14">
                <h2 className="text-2xl text-gray-800 mb-6 text-center">Top Selling Outdoor Plants</h2>
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              </section>
            }
          >
            <OutdoorPlantsSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <HorizontalScrollSection title="Featured Products" />
        </ErrorBoundary>
      </div>
    </div>
  );
}
