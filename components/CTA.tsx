"use client";

import { motion } from "framer-motion";
import { ArrowRight, Cake, Heart, Gift, Baby, PartyPopper } from "lucide-react";
import { useWa } from "./WhatsAppProvider";

const occasions = [
  { icon: Cake, label: "Cumpleaños" },
  { icon: Heart, label: "Aniversarios" },
  { icon: Gift, label: "Bodas" },
  { icon: Baby, label: "Baby Shower" },
  { icon: PartyPopper, label: "Eventos" },
];

/**
 * Sección "Personaliza tu torta" como bloque pastel suave (estilo boutique).
 */
export default function CTA({ c }: { c: Record<string, string> }) {
  const wa = useWa();
  return (
    <section id="personaliza" className="bg-sage py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-sage-text">
            {c.cta_eyebrow}
          </span>
          <h2 className="mt-5 font-display text-3xl font-medium leading-tight text-borgona sm:text-4xl md:text-5xl">
            {c.cta_titulo}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-light leading-relaxed text-sage-text/80">
            {c.cta_subtitulo}
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {occasions.map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 px-4 py-7 transition-all hover:-translate-y-1 hover:bg-white"
            >
              <o.icon className="h-7 w-7 text-borgona" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-sm font-medium text-carbon">{o.label}</span>
            </motion.div>
          ))}
        </div>

        <a
          href={wa.customCake()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-14 inline-flex items-center gap-2 rounded-full bg-borgona px-8 py-3.5 text-sm font-medium text-crema transition-colors hover:bg-borgona-light"
        >
          Solicitar cotización
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
