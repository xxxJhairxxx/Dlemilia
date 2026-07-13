"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/Product";
import { useWa } from "./WhatsAppProvider";

/**
 * Sección "Destacado": resalta un solo producto (nuevo, en promoción o el
 * más pedido). El producto se elige desde el panel admin marcándolo con la
 * categoría "Destacado". Foto grande y texto sobrio.
 */
export default function Destacado({
  c,
  producto,
}: {
  c: Record<string, string>;
  producto: Product;
}) {
  const wa = useWa();
  return (
    <section id="destacado" className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Imagen */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-crema-dark sm:aspect-square lg:aspect-[4/5]"
        >
          <Image
            src={producto.image}
            alt={producto.name}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>

        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-dorado">
            {c.destacado_eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-medium leading-tight text-borgona sm:text-5xl">
            {producto.name}
          </h2>
          <p className="mt-3 text-lg font-light text-gris">{c.destacado_subtitulo}</p>

          <p className="mt-6 max-w-md font-light leading-relaxed text-gris">
            {producto.description}
          </p>

          <div className="mt-8 flex items-center gap-6">
            <span className="font-display text-4xl font-medium text-borgona">
              {producto.price === null ? "Consultar" : `S/ ${producto.price}`}
            </span>
            <span className="text-sm font-light text-gris">
              {producto.varieties?.join(" · ")}
            </span>
          </div>

          <a
            href={wa.product(producto, 1)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-borgona px-8 py-3.5 text-sm font-medium text-crema transition-colors hover:bg-borgona-light"
          >
            Pedir por WhatsApp
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
