import { getTodosLosProductos } from "@/lib/cms";
import ProductosAdmin from "@/components/ProductosAdmin";

export const dynamic = "force-dynamic";

export default function AdminProductosPage() {
  const productos = getTodosLosProductos();
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <ProductosAdmin productos={productos} />
    </main>
  );
}
