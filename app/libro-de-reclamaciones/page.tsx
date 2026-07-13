import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import LibroReclamacionesForm from "@/components/LibroReclamacionesForm";
import AvisoLibroReclamaciones from "@/components/AvisoLibroReclamaciones";
import { WhatsAppProvider } from "@/components/WhatsAppProvider";
import { getContenido } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Libro de Reclamaciones",
  description:
    "Libro de Reclamaciones virtual de Productos D'lemilia. Registra tu reclamo o queja conforme al Código de Protección y Defensa del Consumidor (INDECOPI).",
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default function LibroDeReclamacionesPage() {
  const c = getContenido();
  return (
    <WhatsAppProvider numero={c.contacto_whatsapp} display={c.contacto_telefono}>
      {/* Cabecera propia de la página */}
      <header className="sticky top-0 z-50 bg-crema/95 shadow-soft backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Ir al inicio">
            <span className="relative h-11 w-11 overflow-hidden rounded-full shadow-soft">
              <Image src="/logo/logo-white.jpg" alt="Logo Productos D'lemilia" fill sizes="44px" className="object-cover" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold text-borgona">D&apos;lemilia</span>
              <span className="text-[0.6rem] uppercase tracking-[0.18em] text-gris">Productos artesanales</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-borgona/25 px-5 py-2.5 text-sm font-medium text-borgona transition-colors hover:bg-borgona/5"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="bg-paper py-16 md:py-20">
        {/* Aviso oficial del Libro de Reclamaciones (Anexo 2 - D.S. 011-2011-PCM) */}
        <div className="px-5 sm:px-8">
          <AvisoLibroReclamaciones />
        </div>

        <p className="mx-auto mt-8 max-w-2xl px-5 text-center text-sm font-light leading-relaxed text-gris sm:px-8">
          Completa la siguiente Hoja de Reclamación virtual y recibirás un número de hoja
          como constancia de tu registro.
        </p>

        <div className="mt-10 px-5 sm:px-8">
          <LibroReclamacionesForm />
        </div>
      </main>

      <Footer telefono={c.contacto_telefono} horarios={c.contacto_horarios} />
    </WhatsAppProvider>
  );
}
