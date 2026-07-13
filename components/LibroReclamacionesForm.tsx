"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useWa } from "./WhatsAppProvider";

/**
 * Datos del proveedor. COMPLETAR el RUC y la dirección fiscal reales.
 */
const PROVEEDOR = {
  razonSocial: "Productos D'lemilia",
  ruc: "", // ← Completar con el RUC real del negocio
  direccion: "", // ← Completar con la dirección del establecimiento
};

type Estado = {
  // Consumidor
  nombre: string;
  tipoDoc: string;
  numDoc: string;
  domicilio: string;
  telefono: string;
  correo: string;
  menor: boolean;
  apoderado: string;
  // Bien contratado
  tipoBien: string;
  monto: string;
  descripcion: string;
  // Detalle
  tipoReclamo: string;
  detalle: string;
  pedido: string;
  // Consentimiento
  acepta: boolean;
};

const inicial: Estado = {
  nombre: "",
  tipoDoc: "DNI",
  numDoc: "",
  domicilio: "",
  telefono: "",
  correo: "",
  menor: false,
  apoderado: "",
  tipoBien: "Producto",
  monto: "",
  descripcion: "",
  tipoReclamo: "Reclamo",
  detalle: "",
  pedido: "",
  acepta: false,
};

const inputBase =
  "w-full rounded-xl border border-carbon/15 bg-white px-4 py-3 text-sm text-carbon outline-none transition-colors placeholder:text-gris/60 focus:border-borgona focus:ring-2 focus:ring-borgona/15";
const labelBase = "mb-1.5 block text-sm font-medium text-carbon";

export default function LibroReclamacionesForm() {
  const wa = useWa();
  const [f, setF] = useState<Estado>(inicial);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [correlativo, setCorrelativo] = useState<string | null>(null);

  const fechaHoy = new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const set = <K extends keyof Estado>(k: K, v: Estado[K]) => setF((s) => ({ ...s, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (
      !f.nombre.trim() ||
      !f.numDoc.trim() ||
      !f.domicilio.trim() ||
      !f.correo.trim() ||
      !f.descripcion.trim() ||
      !f.detalle.trim() ||
      !f.pedido.trim()
    ) {
      setError("Por favor completa todos los campos obligatorios (*).");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!f.acepta) {
      setError("Debes aceptar la declaración para enviar la hoja de reclamación.");
      return;
    }

    setEnviando(true);
    let nro: string;
    try {
      const res = await fetch("/api/reclamaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo registrar la reclamación.");
      }
      nro = data.correlativo as string;
    } catch (err) {
      setEnviando(false);
      setError(
        err instanceof Error ? err.message : "No se pudo registrar la reclamación."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setEnviando(false);
    setCorrelativo(nro);

    const msg = `📕 LIBRO DE RECLAMACIONES — ${PROVEEDOR.razonSocial}
Hoja N°: ${nro}
Fecha: ${fechaHoy}

1) IDENTIFICACIÓN DEL CONSUMIDOR
Nombre: ${f.nombre}
Documento: ${f.tipoDoc} ${f.numDoc}
Domicilio: ${f.domicilio}
Teléfono: ${f.telefono || "-"}
Correo: ${f.correo}
Menor de edad: ${f.menor ? `Sí (Apoderado: ${f.apoderado || "-"})` : "No"}

2) BIEN CONTRATADO
Tipo: ${f.tipoBien}
Monto reclamado: ${f.monto ? `S/ ${f.monto}` : "-"}
Descripción: ${f.descripcion}

3) DETALLE
Tipo: ${f.tipoReclamo}
Detalle: ${f.detalle}
Pedido del consumidor: ${f.pedido}`;

    window.open(`https://wa.me/${wa.numero}?text=${encodeURIComponent(msg)}`, "_blank");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (correlativo) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-carbon/5 sm:p-12">
        <CheckCircle2 className="mx-auto h-16 w-16 text-borgona" strokeWidth={1.4} aria-hidden="true" />
        <h2 className="mt-5 font-display text-2xl font-medium text-borgona">
          Hoja de reclamación registrada
        </h2>
        <p className="mt-3 font-light leading-relaxed text-gris">
          Tu reclamo fue enviado a{" "}
          <span className="font-medium text-carbon">{PROVEEDOR.razonSocial}</span>. Guarda tu
          número de hoja como constancia.
        </p>
        <p className="mt-6 inline-block rounded-full bg-crema px-6 py-2 font-display text-lg font-medium text-borgona">
          {correlativo}
        </p>
        <p className="mt-6 text-sm font-light leading-relaxed text-gris">
          El proveedor dará respuesta en un plazo no mayor a <strong>quince (15) días
          hábiles</strong>. Conserva el mensaje de WhatsApp enviado como respaldo de tu
          reclamo.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-borgona px-8 py-3.5 text-sm font-medium text-crema transition-colors hover:bg-borgona-light"
        >
          Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
      {/* Datos del proveedor */}
      <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-carbon/5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-gris">Razón social</p>
            <p className="mt-1 font-medium text-carbon">{PROVEEDOR.razonSocial}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gris">RUC</p>
            <p className="mt-1 font-medium text-carbon">{PROVEEDOR.ruc || "Por completar"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gris">Fecha</p>
            <p className="mt-1 font-medium text-carbon">{fechaHoy}</p>
          </div>
          {PROVEEDOR.direccion && (
            <div className="sm:col-span-3">
              <p className="text-xs uppercase tracking-wider text-gris">Dirección</p>
              <p className="mt-1 font-medium text-carbon">{PROVEEDOR.direccion}</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-xl bg-borgona/10 px-4 py-3 text-sm font-medium text-borgona">
          {error}
        </p>
      )}

      {/* 1. Consumidor */}
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-carbon/5 sm:p-8">
        <h2 className="font-display text-lg font-medium text-borgona">
          1. Identificación del consumidor reclamante
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelBase} htmlFor="nombre">Nombre y apellidos *</label>
            <input id="nombre" className={inputBase} value={f.nombre} onChange={(e) => set("nombre", e.target.value)} />
          </div>
          <div>
            <label className={labelBase} htmlFor="tipoDoc">Tipo de documento *</label>
            <select id="tipoDoc" className={inputBase} value={f.tipoDoc} onChange={(e) => set("tipoDoc", e.target.value)}>
              <option>DNI</option>
              <option>Carné de extranjería</option>
              <option>Pasaporte</option>
            </select>
          </div>
          <div>
            <label className={labelBase} htmlFor="numDoc">Número de documento *</label>
            <input id="numDoc" className={inputBase} value={f.numDoc} onChange={(e) => set("numDoc", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelBase} htmlFor="domicilio">Domicilio *</label>
            <input id="domicilio" className={inputBase} value={f.domicilio} onChange={(e) => set("domicilio", e.target.value)} />
          </div>
          <div>
            <label className={labelBase} htmlFor="telefono">Teléfono</label>
            <input id="telefono" className={inputBase} value={f.telefono} onChange={(e) => set("telefono", e.target.value)} />
          </div>
          <div>
            <label className={labelBase} htmlFor="correo">Correo electrónico *</label>
            <input id="correo" type="email" className={inputBase} value={f.correo} onChange={(e) => set("correo", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-carbon">
              <input type="checkbox" className="h-4 w-4 accent-borgona" checked={f.menor} onChange={(e) => set("menor", e.target.checked)} />
              El consumidor es menor de edad
            </label>
          </div>
          {f.menor && (
            <div className="sm:col-span-2">
              <label className={labelBase} htmlFor="apoderado">Nombre del padre, madre o apoderado</label>
              <input id="apoderado" className={inputBase} value={f.apoderado} onChange={(e) => set("apoderado", e.target.value)} />
            </div>
          )}
        </div>
      </div>

      {/* 2. Bien contratado */}
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-carbon/5 sm:p-8">
        <h2 className="font-display text-lg font-medium text-borgona">
          2. Identificación del bien contratado
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <span className={labelBase}>Tipo *</span>
            <div className="flex gap-4 pt-1">
              {["Producto", "Servicio"].map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm text-carbon">
                  <input type="radio" name="tipoBien" className="h-4 w-4 accent-borgona" checked={f.tipoBien === t} onChange={() => set("tipoBien", t)} />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={labelBase} htmlFor="monto">Monto reclamado (S/)</label>
            <input id="monto" inputMode="decimal" className={inputBase} value={f.monto} onChange={(e) => set("monto", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelBase} htmlFor="descripcion">Descripción del producto o servicio *</label>
            <textarea id="descripcion" rows={2} className={inputBase} value={f.descripcion} onChange={(e) => set("descripcion", e.target.value)} />
          </div>
        </div>
      </div>

      {/* 3. Detalle */}
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-carbon/5 sm:p-8">
        <h2 className="font-display text-lg font-medium text-borgona">
          3. Detalle de la reclamación y pedido del consumidor
        </h2>
        <div className="mt-4 grid gap-5">
          <div>
            <span className={labelBase}>Tipo *</span>
            <div className="mt-1 grid gap-3 sm:grid-cols-2">
              {[
                { t: "Reclamo", d: "Disconformidad relacionada a los productos o servicios." },
                {
                  t: "Queja",
                  d: "Disconformidad no relacionada a los productos o servicios; o malestar o descontento respecto a la atención al público.",
                },
              ].map((o) => (
                <label
                  key={o.t}
                  className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors ${
                    f.tipoReclamo === o.t ? "border-borgona bg-borgona/5" : "border-carbon/15"
                  }`}
                >
                  <input type="radio" name="tipoReclamo" className="mt-0.5 h-4 w-4 accent-borgona" checked={f.tipoReclamo === o.t} onChange={() => set("tipoReclamo", o.t)} />
                  <span>
                    <span className="block text-sm font-medium text-carbon">{o.t}</span>
                    <span className="block text-xs text-gris">{o.d}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={labelBase} htmlFor="detalle">Detalle *</label>
            <textarea id="detalle" rows={4} className={inputBase} value={f.detalle} onChange={(e) => set("detalle", e.target.value)} />
          </div>
          <div>
            <label className={labelBase} htmlFor="pedido">Pedido del consumidor *</label>
            <textarea id="pedido" rows={3} className={inputBase} value={f.pedido} onChange={(e) => set("pedido", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Consentimiento y notas legales */}
      <div className="mt-6 rounded-3xl bg-crema p-6 sm:p-8">
        <label className="flex items-start gap-3 text-sm text-carbon">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-borgona" checked={f.acepta} onChange={(e) => set("acepta", e.target.checked)} />
          <span>
            Declaro que los datos consignados son verdaderos y autorizo el uso de mis datos
            personales únicamente para la atención de este reclamo. *
          </span>
        </label>
        <div className="mt-5 space-y-2 text-xs leading-relaxed text-gris">
          <p>
            <strong>Reclamo:</strong> Disconformidad relacionada a los productos o servicios.
          </p>
          <p>
            <strong>Queja:</strong> Disconformidad no relacionada a los productos o servicios;
            o malestar o descontento respecto a la atención al público.
          </p>
          <p>
            • La formulación del reclamo no impide acudir a otras vías de solución de
            controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.
          </p>
          <p>
            • El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince
            (15) días hábiles, conforme al Código de Protección y Defensa del Consumidor.
          </p>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-borgona px-8 py-4 text-sm font-medium text-crema transition-colors hover:bg-borgona-light disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {enviando ? "Enviando…" : "Enviar hoja de reclamación"}
        </button>
      </div>
    </form>
  );
}
