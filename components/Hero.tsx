"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useWa } from "./WhatsAppProvider";

/**
 * Hero a pantalla completa: fotografía con degradado y el mensaje
 * directamente sobre la imagen (sin tarjeta central).
 */
export default function Hero({ c }: { c: Record<string, string> }) {
  const wa = useWa();
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-28 text-center sm:px-8"
    >
      {/* Fotografía de fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/empanadas/portada.jpeg"
          alt="Productos artesanales de D'lemilia"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Degradado + viñeta radial para dar contraste al texto central */}
        <div className="absolute inset-0 bg-gradient-to-b from-borgona-dark/70 via-borgona-dark/55 to-borgona-dark/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,9,14,0.55)_0%,transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative mx-auto max-w-2xl [text-shadow:0_2px_12px_rgba(74,9,14,0.45)]"
      >
        <span className="text-xs font-medium uppercase tracking-[0.4em] text-dorado-light">
          {c.hero_eyebrow}
        </span>

        <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] text-crema sm:text-6xl md:text-7xl">
          {c.hero_titulo}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-crema/90">
          {c.hero_subtitulo}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#tortas"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-dorado px-8 py-3.5 text-sm font-medium text-borgona-dark shadow-card transition-colors hover:bg-dorado-light"
          >
            Ver catálogo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <a
            href={wa.general()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-crema/60 px-8 py-3.5 text-sm font-medium text-crema backdrop-blur-sm transition-colors hover:bg-crema/10"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
