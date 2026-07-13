"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}

/**
 * Encabezado de sección minimalista: pequeño rótulo dorado, título serif
 * grande y subtítulo discreto. Sin adornos, mucho aire.
 */
export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionTitleProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col ${alignment} ${align === "center" ? "mx-auto max-w-2xl" : ""}`}
    >
      {eyebrow && (
        <span
          className={`mb-4 text-xs font-medium uppercase tracking-[0.35em] ${
            light ? "text-dorado-light" : "text-dorado"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl font-medium leading-[1.15] sm:text-4xl md:text-5xl ${
          light ? "text-crema" : "text-borgona"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 max-w-xl text-base font-light leading-relaxed ${
            light ? "text-crema/70" : "text-gris"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
