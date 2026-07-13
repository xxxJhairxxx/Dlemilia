"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import type { ProductoAdminRow } from "@/lib/cms";

const CATS: { value: string; label: string }[] = [
  { value: "torta", label: "Torta" },
  { value: "destacado", label: "Destacado (sección resaltada)" },
  { value: "mas", label: "Helados y postres" },
];
const catLabel = (v: string) => CATS.find((c) => c.value === v)?.label ?? v;

type Form = {
  id?: number;
  nombre: string;
  categoria: string;
  precio: string; // vacío = consultar
  descripcion: string;
  variedades: string;
  imagen: string;
  visible: boolean;
};

const vacio: Form = {
  nombre: "",
  categoria: "torta",
  precio: "",
  descripcion: "",
  variedades: "",
  imagen: "",
  visible: true,
};

const input =
  "w-full rounded-xl border border-carbon/15 bg-white px-4 py-2.5 text-sm text-carbon outline-none focus:border-borgona focus:ring-2 focus:ring-borgona/15";

export default function ProductosAdmin({ productos }: { productos: ProductoAdminRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function nuevo() {
    setError("");
    setForm({ ...vacio });
  }
  function editar(p: ProductoAdminRow) {
    setError("");
    setForm({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio === null ? "" : String(p.precio),
      descripcion: p.descripcion,
      variedades: p.variedades ?? "",
      imagen: p.imagen,
      visible: p.visible === 1,
    });
  }

  async function subirImagen(file: File) {
    setSubiendo(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.path)
        throw new Error(data?.error || "No se pudo subir la imagen (¿archivo muy grande?).");
      setForm((f) => (f ? { ...f, imagen: data.path } : f));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir la imagen.");
    } finally {
      setSubiendo(false);
    }
  }

  async function guardar() {
    if (!form) return;
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      const res = await fetch("/api/admin/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          nombre: form.nombre,
          categoria: form.categoria,
          precio: form.precio.trim() === "" ? null : Number(form.precio),
          descripcion: form.descripcion,
          variedades: form.variedades,
          imagen: form.imagen,
          visible: form.visible ? 1 : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar.");
      setForm(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(p: ProductoAdminRow) {
    if (!confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/admin/productos?id=${p.id}`, { method: "DELETE" });
    router.refresh();
  }

  const grupos: { cat: string; items: ProductoAdminRow[] }[] = CATS.map((c) => ({
    cat: c.value,
    items: productos.filter((p) => p.categoria === c.value),
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-borgona sm:text-3xl">Productos</h1>
          <p className="mt-1 text-sm text-gris">{productos.length} productos en el catálogo.</p>
        </div>
        <button
          onClick={nuevo}
          className="inline-flex items-center gap-2 rounded-full bg-borgona px-5 py-2.5 text-sm font-medium text-crema transition-colors hover:bg-borgona-light"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nuevo producto
        </button>
      </div>

      <div className="mt-8 space-y-8">
        {grupos.map((g) => (
          <div key={g.cat}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gris">
              {catLabel(g.cat)} ({g.items.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((p) => (
                <div key={p.id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-carbon/5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-crema-dark">
                    {p.imagen && (
                      <Image src={p.imagen} alt={p.nombre} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-carbon">{p.nombre}</p>
                    <p className="text-sm text-borgona">
                      {p.precio === null ? "Consultar" : `S/ ${p.precio}`}
                    </p>
                    {p.visible === 0 && <p className="text-xs text-gris">(oculto)</p>}
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => editar(p)} className="text-gris hover:text-borgona" aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => eliminar(p)} className="text-gris hover:text-borgona" aria-label="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {g.items.length === 0 && <p className="text-sm text-gris">Sin productos.</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-carbon/40 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-borgona">
                {form.id ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button onClick={() => setForm(null)} className="text-gris hover:text-carbon" aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-borgona/10 px-4 py-2.5 text-sm font-medium text-borgona">{error}</p>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-carbon">Nombre</label>
                <input className={input} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-carbon">Categoría</label>
                  <select className={input} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                    {CATS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-carbon">Precio (S/)</label>
                  <input className={input} inputMode="numeric" placeholder="Vacío = Consultar" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-carbon">Descripción</label>
                <textarea rows={2} className={input} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-carbon">
                  Variedades <span className="font-normal text-gris">(separadas por coma, ej. Carne, Pollo)</span>
                </label>
                <input className={input} value={form.variedades} onChange={(e) => setForm({ ...form, variedades: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-carbon">Imagen</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-crema-dark">
                    {form.imagen && <Image src={form.imagen} alt="" fill sizes="80px" className="object-cover" />}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-carbon/15 px-4 py-2 text-sm font-medium text-carbon transition-colors hover:bg-crema">
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    {subiendo ? "Subiendo…" : "Subir imagen"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) subirImagen(file);
                      }}
                    />
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-carbon">
                <input type="checkbox" className="h-4 w-4 accent-borgona" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />
                Visible en el sitio
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={guardar}
                disabled={guardando || subiendo}
                className="rounded-full bg-borgona px-6 py-2.5 text-sm font-medium text-crema transition-colors hover:bg-borgona-light disabled:opacity-60"
              >
                {guardando ? "Guardando…" : "Guardar"}
              </button>
              <button onClick={() => setForm(null)} className="rounded-full px-6 py-2.5 text-sm font-medium text-gris hover:text-carbon">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
