"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { ProductCardProps } from "@/app/types";
import QuickShopModal from "./QuickShopModal";

export default function ProductCard({
  id,
  name,
  price,
  image,
  description,
  category,
}: ProductCardProps) {
  const { data: session } = useSession();
  const [isQuickShopOpen, setIsQuickShopOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      checkFavoriteStatus();
    }
  }, [session, id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites/check?ids=${id}`);
      const data = await response.json();
      setIsFavorited(data.favorited.includes(id));
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user?.id) {
      return;
    }

    setIsToggling(true);

    try {
      if (isFavorited) {
        await fetch(`/api/favorites?productId=${id}`, {
          method: "DELETE",
        });
        setIsFavorited(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };
  
  return (
    <>
      <Link href={`/products/${id}`} className="block h-full">
        <article
          className="
            group bg-white border border-gray-200 
            shadow-sm hover:shadow-lg transition-all duration-300 
            flex flex-col relative
          "
        >
        <div className="w-full flex justify-center items-center p-4 relative">
          <div className="relative w-full h-60 overflow-hidden">
            {image && (
              <Image 
                src={image} 
                alt={name} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
          {session?.user?.id && (
            <button
              onClick={toggleFavorite}
              disabled={isToggling}
              className="absolute top-6 right-6 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all disabled:opacity-50"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorited
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
              />
            </button>
          )}
        </div>

        <div className="px-4 pb-4 flex flex-col grow">
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {description}
            </p>
          )}

          <span className="text-xl font-bold text-gray-800">
            ${price.toFixed(2)}
          </span>

          <div
            className="
              mt-4 
              max-h-0 opacity-0 overflow-hidden
              group-hover:max-h-40 group-hover:opacity-100
              transition-all duration-300 ease-out
              flex gap-2
            "
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickShopOpen(true);
              }}
              className="py-1 px-1 w-full cursor-pointer border border-black rounded-sm text-sm transition hover:bg-gray-100"
            >
              Quick Shop
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="bg-gray-800 cursor-pointer text-white py-1 px-1 w-full rounded-sm text-sm hover:bg-gray-900 transition"
            >
              Choose Options
            </button>
          </div>
        </div>
      </article>
      </Link>

      <QuickShopModal
        isOpen={isQuickShopOpen}
        onClose={() => setIsQuickShopOpen(false)}
        product={{ id, name, price, image, description, category }}
      />
    </>
  );
}
