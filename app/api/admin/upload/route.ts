import { NextResponse } from "next/server";
import path from "node:path";
import { put } from "@vercel/blob";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
// Vercel corta las peticiones de ~4.5 MB antes de llegar aquí, así que
// mantenemos el límite por debajo para poder devolver un error claro.
const MAX = 4 * 1024 * 1024; // 4 MB

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
    return NextResponse.json(
      { error: "La imagen supera los 4 MB. Usa una más liviana." },
      { status: 400 }
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "El almacenamiento de imágenes no está configurado (falta BLOB_READ_WRITE_TOKEN). Conecta Vercel Blob y vuelve a desplegar.",
      },
      { status: 500 }
    );
  }

  try {
    const filename = safeName(file.name);
    const blob = await put(`uploads/${filename}`, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ path: blob.url });
  } catch (err) {
    console.error("Error al subir a Vercel Blob:", err);
    return NextResponse.json(
      { error: "No se pudo subir la imagen. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
