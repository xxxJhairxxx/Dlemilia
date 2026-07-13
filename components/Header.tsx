"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { useWa } from "./WhatsAppProvider";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Tortas", href: "#tortas" },
  { label: "Empanadas", href: "#empanadas" },
  { label: "Personaliza tu torta", href: "#personaliza" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

/**
 * Header fijo con transición al hacer scroll y menú hamburguesa en móvil.
 */
export default function Header() {
  const wa = useWa();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-crema/95 shadow-soft backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8"
        aria-label="Navegación principal"
      >
        <Link href="#inicio" className="flex items-center gap-3" aria-label="Ir al inicio">
          <span className="relative h-11 w-11 overflow-hidden rounded-full shadow-soft">
            {/* Logo sobre fondo oscuro (navbar arriba, sobre la foto) */}
            <Image
              src="/logo/logo-dark.jpg"
              alt="Logo Productos D'lemilia"
              fill
              sizes="50px"
              priority
              className={`object-cover transition-opacity duration-300 ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
            />
            {/* Logo sobre fondo claro (navbar al hacer scroll) */}
            <Image
              src="/logo/logo-white.jpg"
              alt=""
              aria-hidden="true"
              fill
              sizes="80px"
              className={`object-cover transition-opacity duration-300 ${
                scrolled ? "opacity-0" : "opacity-100"
              }`}
            />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={`font-display text-lg font-semibold transition-colors ${
                scrolled ? "text-borgona" : "text-crema"
              }`}
            >
              D&apos;lemilia
            </span>
            <span
              className={`text-[0.6rem] uppercase tracking-[0.18em] transition-colors ${
                scrolled ? "text-gris" : "text-crema/80"
              }`}
            >
              Productos artesanales
            </span>
          </span>
        </Link>

        {/* Navegación escritorio */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-dorado ${
                  scrolled ? "text-carbon" : "text-crema"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={wa.general()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-borgona px-5 py-2.5 text-sm font-medium text-crema shadow-soft transition-all hover:bg-borgona-light hover:shadow-card sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Pedir por WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${
              scrolled ? "text-borgona" : "text-crema"
            }`}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        className={`fixed inset-x-0 top-[68px] z-40 origin-top bg-crema px-5 pb-8 pt-4 shadow-soft transition-all duration-300 lg:hidden ${
          open ? "visible scale-y-100 opacity-100" : "invisible scale-y-95 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-medium text-carbon transition-colors hover:bg-crema-dark hover:text-borgona"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={wa.general()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-borgona px-5 py-3 text-sm font-medium text-crema shadow-soft"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Pedir por WhatsApp
        </a>
      </div>
    </header>
  );
}
