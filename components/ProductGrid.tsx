import type { Product } from "@/types/Product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

/**
 * Grid responsivo de tarjetas de producto.
 */
export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
