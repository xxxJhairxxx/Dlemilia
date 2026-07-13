import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { upsertProducto, deleteProducto, type Categoria } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIAS: Categoria[] = ["torta", "empanada", "mas"];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const nombre = String(b.nombre ?? "").trim();
  const categoria = String(b.categoria ?? "torta") as Categoria;
  if (!nombre) return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });
  if (!CATEGORIAS.includes(categoria))
    return NextResponse.json({ error: "Categoría inválida." }, { status: 400 });

  const precioRaw = b.precio;
  const precio =
    precioRaw === null || precioRaw === "" || precioRaw === undefined
      ? null
      : Number(precioRaw);
  if (precio !== null && !Number.isFinite(precio))
    return NextResponse.json({ error: "Precio inválido." }, { status: 400 });

  const id = b.id ? Number(b.id) : undefined;
  const slug = String(b.slug ?? "").trim() || slugify(nombre) || `producto-${Date.now()}`;

  await upsertProducto({
    id,
    slug,
    nombre,
    descripcion: String(b.descripcion ?? "").trim(),
    precio,
    categoria,
    imagen: String(b.imagen ?? "").trim(),
    variedades: b.variedades ? String(b.variedades).trim() : null,
    visible: b.visible === 0 || b.visible === false ? 0 : 1,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0)
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  await deleteProducto(id);
  return NextResponse.json({ ok: true });
}
