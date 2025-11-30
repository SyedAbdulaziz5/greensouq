import Link from "next/link";
import Image from "next/image";
import { CategoryCardProps } from "@/app/types";

import indoorImg from "@/public/Img1.webp";
import outdoorImg from "@/public/Img2.webp";
import succulentsImg from "@/public/Img3.webp";

const categoryImages: Record<string, any> = {
  "Indoor Plants": indoorImg,
  "Outdoor Plants": outdoorImg,
  "Succulents": succulentsImg,
};  

export default function CategoryCard({ name, description }: CategoryCardProps) {
  const cardImage = categoryImages[name] ?? indoorImg;

  return (
    <Link
      href={`/products?category=${encodeURIComponent(name)}`}
      className="block h-full"
    >
      <article className="relative bg-white overflow-hidden h-75">

        <div className="relative w-full h-full">
          <Image
            src={cardImage}
            alt={name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />

          <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 text-white max-w-[75%] sm:max-w-[70%]">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 sm:mb-2 drop-shadow-lg">
              {name}
            </h3>

            {description && (
              <p className="text-xs sm:text-sm opacity-90 mb-2 sm:mb-4 line-clamp-2 drop-shadow-md">
                {description}
              </p>
            )}

            <button className="bg-black hover:bg-gray-700 text-white px-3 py-2 sm:px-5 sm:py-3 rounded-sm font-medium text-xs sm:text-sm">
              Shop Now
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
