import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { updateRespuesta } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: { id?: number; respuesta?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const id = Number(body.id);
  const respuesta = (body.respuesta ?? "").trim();
  if (!Number.isInteger(id) || id <= 0 || !respuesta) {
    return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
  }

  const ok = updateRespuesta(id, respuesta);
  if (!ok) {
    return NextResponse.json({ error: "No se encontró la reclamación." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
