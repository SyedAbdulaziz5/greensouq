"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Product } from "@/app/types";

interface ProductPageClientProps {
  product: Product;
  thumbnails: (string | undefined)[];
  originalPrice: number;
  salePrice: number;
}

export default function ProductPageClient({
  product,
  thumbnails,
  originalPrice,
  salePrice,
}: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedPot, setSelectedPot] = useState("Default Plastic Pot");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="space-y-4">
            <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden">
              {thumbnails[selectedImage] ? (
                <Image
                  src={thumbnails[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-lime-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  {thumb && (
                    <Image
                      src={thumb}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="text-sm text-gray-600">by Greensouq</p>

            <div>
              <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                Sale
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  Dhs. {salePrice.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  Dhs. {originalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Pot:
              </label>
              <select
                value={selectedPot}
                onChange={(e) => setSelectedPot(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600 text-gray-900"
              >
                <option>Default Plastic Pot</option>
                <option>Ceramic Pot</option>
                <option>Decorative Pot</option>
                <option>Self-Watering Pot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-lime-600 text-gray-900"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className="w-full bg-lime-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-lime-700 transition-colors">
              Add to cart
            </button>

            {product.description && (
              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  {product.name.split(" ")[0]}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                Deliverable
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <li>• Healthy plant in its pot with premium soil</li>
                <li>• Free delivery on orders over AED 500.00, most plants arrive within a week</li>
                <li>• All the tips and tricks for expert-level care</li>
                <li>• Safe arrival guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

