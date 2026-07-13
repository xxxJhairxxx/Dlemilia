"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2, Upload } from "lucide-react";

type Campo = { clave: string; label: string; area?: boolean; image?: boolean };
type Seccion = { titulo: string; campos: Campo[] };

const SECCIONES: Seccion[] = [
  {
    titulo: "Portada (Hero)",
    campos: [
      { clave: "hero_eyebrow", label: "Rótulo pequeño" },
      { clave: "hero_titulo", label: "Título" },
      { clave: "hero_subtitulo", label: "Subtítulo", area: true },
    ],
  },
  {
    titulo: "Nuestros productos (categorías)",
    campos: [
      { clave: "categorias_eyebrow", label: "Rótulo pequeño" },
      { clave: "categorias_titulo", label: "Título" },
      { clave: "categorias_subtitulo", label: "Subtítulo", area: true },
    ],
  },
  {
    titulo: "Producto destacado",
    campos: [
      { clave: "destacado_eyebrow", label: "Etiqueta (ej. Destacado, Nuevo, En promoción)" },
      { clave: "destacado_subtitulo", label: "Frase corta bajo el nombre" },
    ],
  },
  {
    titulo: "Tortas",
    campos: [
      { clave: "tortas_eyebrow", label: "Rótulo pequeño" },
      { clave: "tortas_titulo", label: "Título" },
      { clave: "tortas_subtitulo", label: "Subtítulo", area: true },
      { clave: "tortas_mas_titulo", label: "Título de 'Helados y postres'" },
    ],
  },
  {
    titulo: "Personaliza tu torta",
    campos: [
      { clave: "cta_eyebrow", label: "Rótulo pequeño" },
      { clave: "cta_titulo", label: "Título" },
      { clave: "cta_subtitulo", label: "Subtítulo", area: true },
    ],
  },
  {
    titulo: "Nosotros",
    campos: [
      { clave: "about_titulo", label: "Título" },
      { clave: "about_texto", label: "Texto", area: true },
    ],
  },
  {
    titulo: "Contacto",
    campos: [
      { clave: "contacto_telefono", label: "Teléfono (mostrado en el sitio)" },
      {
        clave: "contacto_whatsapp",
        label: "WhatsApp para pedidos (con código país, ej. 51999888777)",
      },
      { clave: "contacto_horarios", label: "Horarios de atención" },
    ],
  },
  {
    titulo: "Fotos de categorías (Nuestros productos)",
    campos: [
      { clave: "cat_img_tortas", label: "Foto: Tortas", image: true },
      { clave: "cat_img_destacado", label: "Foto: Destacado", image: true },
      { clave: "cat_img_personalizadas", label: "Foto: Tortas personalizadas", image: true },
      { clave: "cat_img_postres", label: "Foto: Helados y postres", image: true },
    ],
  },
];

const input =
  "w-full rounded-xl border border-carbon/15 bg-white px-4 py-2.5 text-sm text-carbon outline-none transition-colors focus:border-borgona focus:ring-2 focus:ring-borgona/15";

export default function ContenidoForm({ inicial }: { inicial: Record<string, string> }) {
  const router = useRouter();
  const [vals, setVals] = useState<Record<string, string>>(inicial);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function set(k: string, v: string) {
    setVals((s) => ({ ...s, [k]: v }));
    setOk(false);
  }

  async function subirImagen(clave: string, file: File) {
    setSubiendo(clave);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.path) set(clave, data.path);
      else alert(data?.error || "No se pudo subir la imagen (¿archivo muy grande?).");
    } finally {
      setSubiendo(null);
    }
  }

  async function guardar() {
    setGuardando(true);
    setOk(false);
    try {
      const res = await fetch("/api/admin/contenido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: vals }),
      });
      if (!res.ok) throw new Error();
      setOk(true);
      router.refresh();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-borgona sm:text-3xl">
            Contenido del sitio
          </h1>
          <p className="mt-1 text-sm text-gris">Edita los textos de cada sección.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {SECCIONES.map((s) => (
          <section key={s.titulo} className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-carbon/5">
            <h2 className="font-display text-lg font-medium text-borgona">{s.titulo}</h2>
            <div className="mt-4 space-y-4">
              {s.campos.map((c) => (
                <div key={c.clave}>
                  <label className="mb-1.5 block text-sm font-medium text-carbon" htmlFor={c.clave}>
                    {c.label}
                  </label>
                  {c.image ? (
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-crema-dark ring-2 ring-white">
                        {vals[c.clave] && (
                          <Image src={vals[c.clave]} alt="" fill sizes="80px" className="object-cover" />
                        )}
                      </div>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-carbon/15 px-4 py-2 text-sm font-medium text-carbon transition-colors hover:bg-crema">
                        <Upload className="h-4 w-4" aria-hidden="true" />
                        {subiendo === c.clave ? "Subiendo…" : "Subir imagen"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) subirImagen(c.clave, file);
                          }}
                        />
                      </label>
                    </div>
                  ) : c.area ? (
                    <textarea
                      id={c.clave}
                      rows={3}
                      className={input}
                      value={vals[c.clave] ?? ""}
                      onChange={(e) => set(c.clave, e.target.value)}
                    />
                  ) : (
                    <input
                      id={c.clave}
                      className={input}
                      value={vals[c.clave] ?? ""}
                      onChange={(e) => set(c.clave, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="sticky bottom-4 mt-6 flex items-center gap-3">
        <button
          onClick={guardar}
          disabled={guardando}
          className="inline-flex items-center gap-2 rounded-full bg-borgona px-7 py-3 text-sm font-medium text-crema shadow-card transition-colors hover:bg-borgona-light disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
        {ok && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-text">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Guardado
          </span>
        )}
      </div>
    </div>
  );
}
