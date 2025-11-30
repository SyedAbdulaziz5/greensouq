import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchProduct, fetchProducts } from "../../lib/api";
import ProductPageClient from "./ProductPageClient";
import RelatedProducts from "./RelatedProducts";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const products = await fetchProducts();
    return products.slice(0, 10).map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await fetchProduct(id);

    if (!product) {
      return {
        title: "Product Not Found",
      };
    }

    return {
      title: product.name,
      description: product.description || `Buy ${product.name} at GreenSouq. ${product.category ? `Category: ${product.category}` : ""}`,
      openGraph: {
        title: product.name,
        description: product.description || `Buy ${product.name} at GreenSouq`,
        images: product.image ? [product.image] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { id } = await params;
    const product = await fetchProduct(id);

    if (!product) {
      notFound();
    }

    const thumbnails = [product.image, product.image, product.image, product.image, product.image].filter(Boolean);
    const originalPrice = product.price * 1.5;
    const salePrice = product.price;

    return (
      <>
        <ProductPageClient 
          product={product} 
          thumbnails={thumbnails} 
          originalPrice={originalPrice} 
          salePrice={salePrice} 
        />
        <div className="container mx-auto px-4 max-w-6xl">
          <RelatedProducts category={product.category} currentId={product.id} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error loading product page:", error);
    notFound();
  }
}
