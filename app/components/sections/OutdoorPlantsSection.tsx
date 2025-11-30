import { fetchProducts } from "@/app/lib/api";
import ProductCard from "../ProductCard";

async function OutdoorPlantsSection() {
  try {
    const products = await fetchProducts("Outdoor Plants");

    return (
      <section>
        <h2 className="text-xl sm:text-2xl text-gray-800 mb-4 sm:mb-6 text-center mt-8 sm:mt-12 lg:mt-14 px-4">
          Top Selling Outdoor Plants
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 px-4 sm:px-0">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No products available</p>
        )}
      </section>
    );
  } catch (error) {
    console.error("Error loading outdoor plants:", error);
    return (
      <section>
        <h2 className="text-xl sm:text-2xl text-gray-800 mb-4 sm:mb-6 text-center mt-8 sm:mt-12 lg:mt-14 px-4">
          Top Selling Outdoor Plants
        </h2>
        <p className="text-red-600 text-center py-8">
          Failed to load products. Please try again later.
        </p>
      </section>
    );
  }
}

export default OutdoorPlantsSection;

