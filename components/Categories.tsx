"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Fila "Nuestros productos" con fichas de categoría (foto redondeada y
 * etiqueta centrada), inspirada en boutiques de repostería.
 */
export default function Categories({ c }: { c: Record<string, string> }) {
  const categories = [
    { label: "Tortas", href: "#tortas", image: c.cat_img_tortas },
    { label: "Empanadas", href: "#empanadas", image: c.cat_img_empanadas },
    { label: "Tortas personalizadas", href: "#personaliza", image: c.cat_img_personalizadas },
    { label: "Más delicias", href: "#tortas", image: c.cat_img_mas },
  ];

  return (
    <section className="bg-blush py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-dorado">
            {c.categorias_eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl font-medium text-borgona sm:text-4xl md:text-5xl">
            {c.categorias_titulo}
          </h2>
          <p className="mt-5 font-light leading-relaxed text-gris">{c.categorias_subtitulo}</p>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.label}
              href={cat.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-full bg-crema-dark shadow-soft ring-4 ring-white transition-all duration-500 group-hover:shadow-card">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <h3 className="mt-5 font-display text-lg font-medium text-carbon transition-colors group-hover:text-borgona">
                {cat.label}
              </h3>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
