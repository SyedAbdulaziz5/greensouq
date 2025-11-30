import { fetchProducts } from "../../lib/api";
import ProductCard from "../../components/ProductCard";

interface RelatedProductsProps {
  category?: string;
  currentId: string;
}

export default async function RelatedProducts({ 
  category, 
  currentId 
}: RelatedProductsProps) {
  if (!category) return null;

  try {
    const products = await fetchProducts(category);
    const related = products.filter((p) => p.id !== currentId).slice(0, 4);

    if (related.length === 0) return null;

    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading related products:", error);
    return null;
  }
}

