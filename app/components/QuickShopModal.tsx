"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { ProductCardProps } from "@/app/types";

interface QuickShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductCardProps;
}

export default function QuickShopModal({
  isOpen,
  onClose,
  product,
}: QuickShopModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedPot, setSelectedPot] = useState("Default Plastic Pot");

  const thumbnails = [product.image, product.image, product.image, product.image, product.image].filter(Boolean);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const originalPrice = product.price * 1.5;
  const salePrice = product.price;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-6xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-lg mx-auto">
            <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden mb-3 sm:mb-4">
              {thumbnails[selectedImage] ? (
                <Image
                  src={thumbnails[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
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
        </div>

        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">by Greensouq</p>

            <div className="mb-4 sm:mb-6">
              <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                Sale
              </span>
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  Dhs. {salePrice.toFixed(2)}
                </span>
                <span className="text-base sm:text-lg text-gray-500 line-through">
                  Dhs. {originalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mb-4">
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

            <div className="mb-6">
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

            <button className="w-full bg-lime-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-lime-700 transition-colors mb-6 sm:mb-8 text-sm sm:text-base">
              Add to cart
            </button>

            {product.description && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  {product.name.split(" ")[0]}
                </h3>
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

  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}

