"use client";

import Image from "next/image";
import Link from "next/link";

const topCategories = [
  {
    id: "1",
    name: "Indoor Plants",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300",
    slug: "indoor-plants",
  },
  {
    id: "2",
    name: "Succulents",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=300",
    slug: "succulents",
  },
  {
    id: "3",
    name: "Outdoor Plants",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300",
    slug: "outdoor-plants",
  },
  {
    id: "4",
    name: "Pots & Planters",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
    slug: "pots-planters",
  },
  {
    id: "5",
    name: "Fertilizers",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300",
    slug: "fertilizer-pesticides",
  },
  {
    id: "6",
    name: "Garden Tools",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300",
    slug: "garden-services",
  },
  {
    id: "7",
    name: "Seeds",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300",
    slug: "seeds",
  },
  {
    id: "8",
    name: "Decorative Stones",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=300",
    slug: "soil-stones",
  },
];

export default function TopCategoriesSection() {
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Top Categories This Week
          </h2>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
            {topCategories.slice(0, 4).map((category) => (
              <CategoryCircle key={category.id} category={category} />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {topCategories.slice(4, 8).map((category) => (
              <CategoryCircle key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCircle({ category }: { category: (typeof topCategories)[0] }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group block text-center"
    >
      <div
        className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-56 lg:h-56 xl:w-60 xl:h-60 2xl:w-64 2xl:h-64 rounded-full overflow-hidden transition-all duration-300
          group-hover:scale-100"
      >
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 160px,
           (max-width: 768px) 192px,
           (max-width: 1024px) 208px,
           (max-width: 1280px) 224px,
           (max-width: 1536px) 240px,
           256px"
        />
      </div>

      <h3 className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold group-hover:text-lime-600 transition-colors duration-300 mt-2">
        {category.name}
      </h3>
    </Link>
  );
}
