import { BookOpen } from "lucide-react";

/**
 * Aviso del Libro de Reclamaciones (Anexo 2 del D.S. N° 011-2011-PCM).
 * El texto legal es obligatorio y debe mantenerse literal.
 */
export default function AvisoLibroReclamaciones() {
  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-carbon/5">
      <div className="flex flex-col items-center px-6 py-10 text-center sm:px-10">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-borgona/10">
          <BookOpen className="h-8 w-8 text-borgona" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold leading-tight text-borgona sm:text-4xl">
          Libro de Reclamaciones
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-carbon/80">
          Conforme a lo establecido en el Código de Protección y Defensa del Consumidor,
          este establecimiento cuenta con un Libro de Reclamaciones a tu disposición.
          Solicítalo para registrar la queja o reclamo que tengas.
        </p>
      </div>
    </div>
  );
}
