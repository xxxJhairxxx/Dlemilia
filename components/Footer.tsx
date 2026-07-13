"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Clock, Instagram, Facebook, MessageCircle, BookOpen } from "lucide-react";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { useWa } from "./WhatsAppProvider";

const navLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Tortas", href: "/#tortas" },
  { label: "Empanadas", href: "/#empanadas" },
  { label: "Personaliza tu torta", href: "/#personaliza" },
  { label: "Nosotros", href: "/#nosotros" },
];

/**
 * Footer con logo, slogan, contacto y espacios preparados para
 * horarios y redes sociales.
 */
export default function Footer({
  telefono,
  horarios,
}: {
  telefono?: string;
  horarios?: string;
} = {}) {
  const wa = useWa();
  const year = new Date().getFullYear();
  const tel = telefono || WHATSAPP_DISPLAY;

  return (
    <footer id="contacto" className="bg-borgona-dark text-crema">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
        {/* Marca */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image src="/logo/logo-dark.jpg" alt="Logo Productos D'lemilia" fill sizes="48px" className="object-cover" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-semibold">D&apos;lemilia</span>
              <span className="text-[0.6rem] uppercase tracking-[0.18em] text-crema/70">
                Productos
              </span>
            </span>
          </div>
          <p className="mt-4 font-display text-lg italic text-dorado-light">
            Sabor único, hecho con pasión
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-dorado-light">
            Menú
          </h3>
          <ul className="mt-4 space-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-crema/80 transition-colors hover:text-crema">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto y horarios */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-dorado-light">
            Contacto
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-crema/80">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-dorado-light" aria-hidden="true" />
              {tel}
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 text-dorado-light" aria-hidden="true" />
              <span>
                Horarios de atención
                <br />
                <span className="text-crema/50">{horarios?.trim() ? horarios : "(próximamente)"}</span>
              </span>
            </li>
          </ul>

          {/* Espacio preparado para redes sociales */}
          <div className="mt-5 flex gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-crema/10 text-crema/70 transition-colors hover:bg-crema/20"
              aria-label="Instagram (próximamente)"
              title="Instagram (próximamente)"
            >
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </span>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-crema/10 text-crema/70 transition-colors hover:bg-crema/20"
              aria-label="Facebook (próximamente)"
              title="Facebook (próximamente)"
            >
              <Facebook className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
        </div>

        {/* CTA WhatsApp */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-dorado-light">
            Haz tu pedido
          </h3>
          <p className="mt-4 text-sm text-crema/80">
            Escríbenos y prepararemos tu pedido con mucho cariño.
          </p>
          <a
            href={wa.general()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-dorado px-6 py-3 text-sm font-semibold text-borgona-dark transition-all hover:bg-dorado-light"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Pedir por WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-crema/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-6 sm:flex-row sm:justify-between sm:px-8">
          <p className="text-center text-xs text-crema/60">
            © {year} Productos D&apos;lemilia. Todos los derechos reservados.
          </p>
          {/* Libro de Reclamaciones (obligatorio - INDECOPI) */}
          <Link
            href="/libro-de-reclamaciones"
            className="inline-flex items-center gap-2 rounded-lg border border-crema/25 bg-crema/5 px-4 py-2 text-xs font-medium text-crema/90 transition-colors hover:bg-crema/15"
          >
            <BookOpen className="h-4 w-4 text-dorado-light" aria-hidden="true" />
            Libro de Reclamaciones
          </Link>
        </div>
      </div>
    </footer>
  );
}
