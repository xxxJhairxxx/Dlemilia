"use client";

import { motion } from "framer-motion";
import { Leaf, Sparkles, Cake, HandHeart, CalendarClock, Percent } from "lucide-react";
import SectionTitle from "./SectionTitle";

const benefits = [
  { icon: Leaf, title: "Ingredientes de calidad", text: "Seleccionados para un sabor único." },
  { icon: Sparkles, title: "Decoración artesanal", text: "Cada detalle hecho a mano." },
  { icon: Cake, title: "Pedidos personalizados", text: "Para cada ocasión especial." },
  { icon: HandHeart, title: "Hecho artesanalmente", text: "Con los mejores ingredientes." },
  { icon: CalendarClock, title: "2 días de anticipación", text: "Para asegurar tu pedido." },
  { icon: Percent, title: "50% de adelanto", text: "Para separar y garantizar." },
];

/**
 * Sección de beneficios, minimalista: iconos finos sin cajas.
 */
export default function Benefits() {
  return (
    <section className="bg-blush py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionTitle
          eyebrow="Por qué elegirnos"
          title="Hecho artesanalmente con pasión"
        />

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" }}
              className="text-center"
            >
              <b.icon className="mx-auto h-7 w-7 text-dorado" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-medium text-carbon">{b.title}</h3>
              <p className="mt-1.5 text-sm font-light text-gris">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
