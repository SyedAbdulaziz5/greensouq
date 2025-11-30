"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Product } from "@/app/types";

interface Props {
  title?: string;
  category?: string;
}

export default function HorizontalScrollSection({
  title = "Featured Products",
  category,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(5);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardsPerView(1);
      } else if (width < 1024) {
        setCardsPerView(2);
      } else if (width < 1280) {
        setCardsPerView(3);
      } else {
        setCardsPerView(5);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const url = category
          ? `/api/products?category=${encodeURIComponent(category)}`
          : "/api/products";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Fetch failed");
        const data: Product[] = await res.json();
        if (active) {
          setProducts(data);
          setIndex(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [category]);

  const maxIndex = Math.max(0, products.length - cardsPerView);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const next = () => {
    if (index >= maxIndex || isTransitioning) return;
    setIsTransitioning(true);
    setIndex((prev) => Math.min(prev + 1, maxIndex));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prev = () => {
    if (index === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setIndex((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (loading) {
    return (
      <section className="my-16">
        <h2 className="text-2xl mb-6 text-center text-gray-800 font-semibold">
          {title}
        </h2>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="my-8 sm:my-12 lg:my-16">
      <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6 text-center text-gray-800 font-semibold px-4">
        {title}
      </h2>

      <div className="relative max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <button
          onClick={prev}
          disabled={index === 0 || isTransitioning}
          aria-label="Previous"
          className="hidden sm:flex absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2
                     w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border shadow 
                     items-center justify-center hover:bg-gray-50
                     disabled:opacity-30 disabled:cursor-not-allowed z-10
                     transition-opacity duration-300"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>

        <div className="overflow-hidden">
          <div
            ref={containerRef}
            className="flex gap-4 sm:gap-6 transition-all duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${index} * ((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView} + 1.5rem)))`,
              opacity: isTransitioning ? 0.7 : 1,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="shrink-0"
                style={{
                  width: `calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})`,
                  flexShrink: 0,
                  flexGrow: 0,
                }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={next}
          disabled={index >= maxIndex || isTransitioning}
          aria-label="Next"
          className="hidden sm:flex absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2
                     w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border shadow 
                     items-center justify-center hover:bg-gray-50
                     disabled:opacity-30 disabled:cursor-not-allowed z-10
                     transition-opacity duration-300"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />  
        </button>
      </div>
    </section>
  );
}
