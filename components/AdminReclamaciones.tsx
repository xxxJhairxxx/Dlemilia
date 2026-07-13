"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, ChevronDown, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import type { ReclamacionRow } from "@/lib/db";

const MS_DIA = 86_400_000;

/** Suma días hábiles (lun-vie) a una fecha. */
function addBusinessDays(base: Date, days: number): Date {
  const d = new Date(base);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) added++;
  }
  return d;
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function csvEscape(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export default function AdminReclamaciones({ rows }: { rows: ReclamacionRow[] }) {
  const router = useRouter();
  const [filtro, setFiltro] = useState<"todos" | "pendiente" | "atendido">("todos");
  const [abierto, setAbierto] = useState<number | null>(null);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [guardando, setGuardando] = useState<number | null>(null);

  const stats = useMemo(
    () => ({
      total: rows.length,
      pendientes: rows.filter((r) => r.estado !== "atendido").length,
      atendidos: rows.filter((r) => r.estado === "atendido").length,
    }),
    [rows]
  );

  const visibles = rows.filter((r) =>
    filtro === "todos" ? true : filtro === "atendido" ? r.estado === "atendido" : r.estado !== "atendido"
  );

  async function responder(id: number) {
    const texto = (respuestas[id] ?? "").trim();
    if (!texto) return;
    setGuardando(id);
    try {
      const res = await fetch("/api/admin/responder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, respuesta: texto }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } finally {
      setGuardando(null);
    }
  }

  function exportarCSV() {
    const cols: (keyof ReclamacionRow)[] = [
      "correlativo", "creado_en", "estado", "nombre", "tipo_doc", "num_doc", "domicilio",
      "telefono", "correo", "menor", "apoderado", "tipo_bien", "monto", "descripcion",
      "tipo_reclamo", "detalle", "pedido", "respuesta", "respondido_en",
    ];
    const head = cols.join(",");
    const body = rows.map((r) => cols.map((c) => csvEscape(r[c])).join(",")).join("\n");
    const blob = new Blob(["﻿" + head + "\n" + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reclamaciones-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function EstadoBadge({ r }: { r: ReclamacionRow }) {
    if (r.estado === "atendido") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1 text-xs font-medium text-sage-text">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Atendido
        </span>
      );
    }
    const vence = addBusinessDays(new Date(r.creado_en), 15);
    const vencido = Date.now() > vence.getTime();
    const dias = Math.ceil((vence.getTime() - Date.now()) / MS_DIA);
    return vencido ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-borgona/10 px-3 py-1 text-xs font-medium text-borgona">
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Vencido
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full bg-dorado/20 px-3 py-1 text-xs font-medium text-carbon">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Vence en {dias} día{dias === 1 ? "" : "s"}
      </span>
    );
  }

  return (
    <div>
      {/* Encabezado + resumen */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-borgona sm:text-3xl">
            Reclamaciones recibidas
          </h1>
          <p className="mt-1 text-sm text-gris">
            {stats.total} en total · {stats.pendientes} pendientes · {stats.atendidos} atendidas
          </p>
        </div>
        <button
          onClick={exportarCSV}
          disabled={rows.length === 0}
          className="inline-flex items-center gap-2 self-start rounded-full border border-carbon/15 px-4 py-2 text-sm font-medium text-carbon transition-colors hover:bg-white disabled:opacity-50"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <div className="mt-6 flex gap-2">
        {([
          ["todos", "Todos"],
          ["pendiente", "Pendientes"],
          ["atendido", "Atendidas"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filtro === key ? "bg-borgona text-crema" : "bg-white text-carbon ring-1 ring-carbon/10 hover:bg-crema"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="mt-6 space-y-3">
        {visibles.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-gris ring-1 ring-carbon/5">
            No hay reclamaciones en esta vista.
          </p>
        )}

        {visibles.map((r) => {
          const open = abierto === r.id;
          return (
            <div key={r.id} className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-carbon/5">
              <button
                onClick={() => setAbierto(open ? null : r.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-display font-medium text-borgona">{r.correlativo}</span>
                    <EstadoBadge r={r} />
                    <span className="rounded-full bg-crema px-2.5 py-0.5 text-xs text-gris">{r.tipo_reclamo}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-carbon">
                    {r.nombre} · {fmt(r.creado_en)}
                  </p>
                </div>
                <ChevronDown className={`h-5 w-5 shrink-0 text-gris transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>

              {open && (
                <div className="border-t border-carbon/10 px-5 py-5 text-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo label="Consumidor" val={r.nombre} />
                    <Campo label="Documento" val={`${r.tipo_doc} ${r.num_doc}`} />
                    <Campo label="Domicilio" val={r.domicilio} />
                    <Campo label="Teléfono" val={r.telefono || "-"} />
                    <Campo label="Correo" val={r.correo} />
                    <Campo label="Menor de edad" val={r.menor ? `Sí (${r.apoderado || "-"})` : "No"} />
                    <Campo label="Bien" val={`${r.tipo_bien}${r.monto ? ` · S/ ${r.monto}` : ""}`} />
                    <Campo label="Fecha" val={fmt(r.creado_en)} />
                  </div>
                  <div className="mt-4 space-y-3">
                    <Campo label="Descripción del bien" val={r.descripcion} />
                    <Campo label={`Detalle (${r.tipo_reclamo})`} val={r.detalle} />
                    <Campo label="Pedido del consumidor" val={r.pedido} />
                  </div>

                  {/* Sección 4: respuesta del proveedor */}
                  <div className="mt-6 rounded-2xl bg-crema p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gris">
                      Acciones adoptadas por el proveedor
                    </p>
                    {r.estado === "atendido" ? (
                      <div className="mt-2">
                        <p className="whitespace-pre-line text-carbon">{r.respuesta}</p>
                        {r.respondido_en && (
                          <p className="mt-2 text-xs text-gris">Respondido el {fmt(r.respondido_en)}</p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2">
                        <textarea
                          rows={3}
                          placeholder="Escribe la respuesta al consumidor…"
                          className="w-full rounded-xl border border-carbon/15 bg-white px-4 py-3 text-sm text-carbon outline-none focus:border-borgona focus:ring-2 focus:ring-borgona/15"
                          value={respuestas[r.id] ?? ""}
                          onChange={(e) => setRespuestas((s) => ({ ...s, [r.id]: e.target.value }))}
                        />
                        <button
                          onClick={() => responder(r.id)}
                          disabled={guardando === r.id || !(respuestas[r.id] ?? "").trim()}
                          className="mt-3 rounded-full bg-borgona px-6 py-2.5 text-sm font-medium text-crema transition-colors hover:bg-borgona-light disabled:opacity-50"
                        >
                          {guardando === r.id ? "Guardando…" : "Guardar respuesta y marcar atendida"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Campo({ label, val }: { label: string; val: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gris">{label}</p>
      <p className="mt-0.5 whitespace-pre-line text-carbon">{val}</p>
    </div>
  );
}
