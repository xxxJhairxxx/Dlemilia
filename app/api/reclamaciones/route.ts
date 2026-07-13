import { NextResponse } from "next/server";
import { insertReclamacion, type ReclamacionInput } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUERIDOS: (keyof ReclamacionInput)[] = [
  "nombre",
  "numDoc",
  "domicilio",
  "correo",
  "descripcion",
  "detalle",
  "pedido",
];

export async function POST(request: Request) {
  let body: Partial<ReclamacionInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  for (const campo of REQUERIDOS) {
    const v = body[campo];
    if (typeof v !== "string" || v.trim() === "") {
      return NextResponse.json(
        { error: `Falta el campo obligatorio: ${campo}.` },
        { status: 400 }
      );
    }
  }

  try {
    const { correlativo } = insertReclamacion({
      nombre: body.nombre!.trim(),
      tipoDoc: body.tipoDoc?.trim() || "DNI",
      numDoc: body.numDoc!.trim(),
      domicilio: body.domicilio!.trim(),
      telefono: body.telefono?.trim() || undefined,
      correo: body.correo!.trim(),
      menor: Boolean(body.menor),
      apoderado: body.apoderado?.trim() || undefined,
      tipoBien: body.tipoBien?.trim() || "Producto",
      monto: body.monto?.trim() || undefined,
      descripcion: body.descripcion!.trim(),
      tipoReclamo: body.tipoReclamo?.trim() || "Reclamo",
      detalle: body.detalle!.trim(),
      pedido: body.pedido!.trim(),
    });

    return NextResponse.json({ correlativo }, { status: 201 });
  } catch (err) {
    console.error("Error al guardar reclamación:", err);
    return NextResponse.json(
      { error: "No se pudo registrar la reclamación. Intenta nuevamente." },
      { status: 500 }
    );
  }
}
