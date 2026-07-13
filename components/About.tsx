"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

/**
 * Sección "Nosotros" — Nuestra historia.
 */
export default function About({ c }: { c: Record<string, string> }) {
  return (
    <section id="nosotros" className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative aspect-square overflow-hidden rounded-xl bg-borgona"
        >
          <Image
            src="/logo/logo-full.jpg"
            alt="Productos D'lemilia — Sabor único, hecho con pasión"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain "
          />
        </motion.div>

        <div>
          <SectionTitle eyebrow="Nosotros" title={c.about_titulo} align="left" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-6 whitespace-pre-line text-lg leading-relaxed text-carbon/85"
          >
            {c.about_texto}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-6 font-display text-xl italic text-borgona"
          >
            Sabor único, hecho con pasión.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
