import { NextResponse } from "next/server";
import path from "node:path";
import { put } from "@vercel/blob";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX = 6 * 1024 * 1024; // 6 MB

function safeName(name: string): string {
  const ext = path.extname(name).toLowerCase() || ".jpg";
  const base = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return `${Date.now()}-${base || "img"}${ext}`;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }
  if (!TIPOS.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato no permitido (usa JPG, PNG, WEBP o AVIF)." },
      { status: 400 }
    );
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "La imagen supera los 6 MB." }, { status: 400 });
  }

  const filename = safeName(file.name);
  const blob = await put(`uploads/${filename}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ path: blob.url });
}
