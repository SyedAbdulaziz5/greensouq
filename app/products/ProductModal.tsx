"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "../components/Modal";
import { Product } from "../types";

interface ProductModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({
  productId,
  isOpen,
  onClose,
}: ProductModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct();
    } else {
      setProduct(null);
      setError(null);
    }
  }, [isOpen, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError("Failed to load product");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product?.name}>
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : product ? (
        <div className="space-y-4">
          {product.image && (
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
          <div>
            <p className="text-2xl font-bold text-green-600 mb-2">
              ${product.price.toFixed(2)}
            </p>
            {product.description && (
              <p className="text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            )}
            {product.category && (
              <p className="text-sm text-gray-500 mt-2">
                Category: {product.category}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">Product not found</div>
      )}
    </Modal>
  );
}
