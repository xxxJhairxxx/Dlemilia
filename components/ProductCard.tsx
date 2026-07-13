"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/Product";
import { useWa } from "./WhatsAppProvider";

interface ProductCardProps {
  product: Product;
  index?: number;
}

/**
 * Tarjeta de producto minimalista: foto protagonista, nombre, precio
 * discreto y un enlace sobrio para pedir por WhatsApp.
 */
export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const wa = useWa();
  const isQuote = product.price === null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: "easeOut" }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-crema-dark shadow-soft">
        <Image
          src={product.image}
          alt={`${product.name} — ${product.description}`}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-medium text-carbon">{product.name}</h3>
          <span className="shrink-0 font-display text-lg font-medium text-borgona">
            {isQuote ? "Consultar" : `S/ ${product.price}`}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-gris">
          {product.description}
        </p>

        <a
          href={wa.product(product, 1)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-borgona transition-colors hover:text-dorado"
          aria-label={`${isQuote ? "Consultar" : "Pedir"} ${product.name} por WhatsApp`}
        >
          {isQuote ? "Consultar" : "Pedir por WhatsApp"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}
