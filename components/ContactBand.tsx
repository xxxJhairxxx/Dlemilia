"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { useWa } from "./WhatsAppProvider";

/**
 * Banda tipo "newsletter" con fondo de confeti pastel y llamada a
 * pedir por WhatsApp (el sitio no usa correo, todo es por WhatsApp).
 */
export default function ContactBand({ telefono }: { telefono?: string } = {}) {
  const wa = useWa();
  const tel = telefono || WHATSAPP_DISPLAY;
  return (
    <section className="bg-confetti py-24 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-2xl px-5 text-center sm:px-8"
      >
        <h2 className="font-display text-3xl font-medium text-borgona sm:text-4xl">
          Haz tu pedido
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-light leading-relaxed text-gris">
          Escríbenos por WhatsApp y prepararemos tu pedido con mucho cariño. Recuerda:
          pedidos con 2 días de anticipación y 50% de adelanto para separar.
        </p>

        <a
          href={wa.general()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-borgona px-8 py-4 text-sm font-medium text-crema shadow-soft transition-colors hover:bg-borgona-light"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Pedir por WhatsApp
        </a>

        <p className="mt-5 text-sm font-light text-gris">
          o llámanos al{" "}
          <span className="font-medium text-borgona">{tel}</span>
        </p>
      </motion.div>
    </section>
  );
}
