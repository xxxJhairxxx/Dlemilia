import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { setContenido } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  let body: { entries?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  if (!body.entries || typeof body.entries !== "object") {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(body.entries)) clean[k] = String(v ?? "");
  await setContenido(clean);
  return NextResponse.json({ ok: true });
}
