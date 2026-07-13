import type { Product } from "@/types/Product";
import ProductGrid from "./ProductGrid";
import SectionTitle from "./SectionTitle";

/**
 * Catálogo de tortas artesanales, minimalista y con mucho aire.
 */
export default function Tortas({
  c,
  tortas,
  mas,
}: {
  c: Record<string, string>;
  tortas: Product[];
  mas: Product[];
}) {
  return (
    <section id="tortas" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle
          eyebrow={c.tortas_eyebrow}
          title={c.tortas_titulo}
          subtitle={c.tortas_subtitulo}
        />

        <div className="mt-16">
          <ProductGrid products={tortas} />
        </div>

        {/* Más delicias artesanales */}
        {mas.length > 0 && (
          <div className="mt-28">
            <SectionTitle eyebrow="También tenemos" title={c.tortas_mas_titulo} />
            <div className="mt-16">
              <ProductGrid products={mas} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
