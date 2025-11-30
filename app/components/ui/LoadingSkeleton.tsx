export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-60 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="relative bg-gray-200 rounded-lg overflow-hidden animate-pulse h-75">
      <div className="w-full h-full bg-gray-300" />
      <div className="absolute bottom-6 left-6 space-y-2">
        <div className="h-6 bg-gray-300 rounded w-32" />
        <div className="h-4 bg-gray-300 rounded w-24" />
        <div className="h-10 bg-gray-300 rounded w-20" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

