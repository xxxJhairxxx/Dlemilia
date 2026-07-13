import { getDb } from "./db";
import {
  empanadas as seedEmpanadas,
  tortas as seedTortas,
  masProductos as seedMas,
} from "@/data/products";
import type { Product } from "@/types/Product";

/**
 * Capa CMS: productos editables y contenido de texto por secciones.
 * Comparte la conexión SQLite con el módulo de reclamaciones.
 */

export type Categoria = "torta" | "empanada" | "mas";

export interface ProductoCMS extends Product {
  slug: string;
  categoria: Categoria;
  orden: number;
  visible: number;
}

interface ProductoRow {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number | null;
  categoria: string;
  imagen: string;
  variedades: string | null;
  orden: number;
  visible: number;
}

function ensureSchema() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT NOT NULL UNIQUE,
      nombre      TEXT NOT NULL,
      descripcion TEXT NOT NULL DEFAULT '',
      precio      INTEGER,
      categoria   TEXT NOT NULL DEFAULT 'torta',
      imagen      TEXT NOT NULL DEFAULT '',
      variedades  TEXT,
      orden       INTEGER NOT NULL DEFAULT 0,
      visible     INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS contenido (
      clave TEXT PRIMARY KEY,
      valor TEXT NOT NULL DEFAULT ''
    );
  `);
}

/** Contenido de texto por defecto (se usa como semilla y como respaldo). */
export const CONTENIDO_DEFAULT: Record<string, string> = {
  hero_eyebrow: "Sabor único, hecho con pasión",
  hero_titulo: "Productos D'lemilia",
  hero_subtitulo:
    "Tortas artesanales, empanadas recién horneadas y pedidos personalizados, elaborados con dedicación.",

  categorias_eyebrow: "Nuestros productos",
  categorias_titulo: "Hechos a mano, con pasión",
  categorias_subtitulo:
    "Elaboramos cada producto de manera artesanal, en pequeñas cantidades y con los mejores ingredientes.",

  empanada_eyebrow: "Recién horneada",
  empanada_subtitulo: "con café o chocolate",

  tortas_eyebrow: "Catálogo",
  tortas_titulo: "Nuestras tortas",
  tortas_subtitulo:
    "Tortas artesanales de 24 cm · 16 porciones · decoración hecha a mano. Imágenes referenciales.",
  tortas_mas_titulo: "Más delicias artesanales",

  cta_eyebrow: "Personaliza tu torta",
  cta_titulo: "Para cada ocasión especial",
  cta_subtitulo:
    "¿No encuentras la torta que buscas? Creamos tortas personalizadas con la decoración y el sabor que imaginas.",

  about_titulo: "Nuestra historia",
  about_texto:
    "En Productos D'lemilia elaboramos cada torta y empanada de manera artesanal, utilizando ingredientes seleccionados y recetas preparadas con dedicación. Nuestro compromiso es ofrecer productos de excelente calidad para acompañar los momentos más especiales de nuestros clientes.",

  contacto_telefono: "942 392 993",
  contacto_horarios: "",
  contacto_whatsapp: "51942392993",

  // Fotos de la fila "Nuestros productos" (categorías)
  cat_img_tortas: "/tortas/torta-crema-fresas.webp",
  cat_img_empanadas: "/empanadas/empanada.jpg",
  cat_img_personalizadas: "/tortas/personalizada.jpg",
  cat_img_mas: "/tortas/tartaletas-fresa.webp",
};

function ensureSeed() {
  const db = getDb();
  const nProd = (db.prepare("SELECT COUNT(*) c FROM productos").get() as { c: number }).c;
  if (nProd === 0) {
    const stmt = db.prepare(`
      INSERT INTO productos (slug, nombre, descripcion, precio, categoria, imagen, variedades, orden)
      VALUES (@slug, @nombre, @descripcion, @precio, @categoria, @imagen, @variedades, @orden)
    `);
    const seedAll: { arr: Product[]; categoria: Categoria }[] = [
      { arr: seedTortas, categoria: "torta" },
      { arr: seedEmpanadas, categoria: "empanada" },
      { arr: seedMas, categoria: "mas" },
    ];
    const tx = db.transaction(() => {
      let orden = 0;
      for (const { arr, categoria } of seedAll) {
        for (const p of arr) {
          stmt.run({
            slug: p.id,
            nombre: p.name,
            descripcion: p.description,
            precio: p.price,
            categoria,
            imagen: p.image,
            variedades: p.varieties?.join(", ") ?? null,
            orden: orden++,
          });
        }
      }
    });
    tx();
  }

  const nCont = (db.prepare("SELECT COUNT(*) c FROM contenido").get() as { c: number }).c;
  if (nCont === 0) {
    const stmt = db.prepare("INSERT INTO contenido (clave, valor) VALUES (?, ?)");
    const tx = db.transaction(() => {
      for (const [k, v] of Object.entries(CONTENIDO_DEFAULT)) stmt.run(k, v);
    });
    tx();
  }
}

function init() {
  ensureSchema();
  ensureSeed();
}

function mapRow(r: ProductoRow): ProductoCMS {
  return {
    id: r.slug,
    slug: r.slug,
    name: r.nombre,
    description: r.descripcion,
    price: r.precio,
    category: r.categoria === "empanada" ? "empanada" : "torta",
    categoria: (r.categoria as Categoria) ?? "torta",
    image: r.imagen,
    varieties: r.variedades
      ? r.variedades.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined,
    orden: r.orden,
    visible: r.visible,
  };
}

/* ---------- Lectura (sitio público) ---------- */

export function getProductosPorCategoria(categoria: Categoria): ProductoCMS[] {
  init();
  const rows = getDb()
    .prepare(
      "SELECT * FROM productos WHERE categoria = ? AND visible = 1 ORDER BY orden, id"
    )
    .all(categoria) as ProductoRow[];
  return rows.map(mapRow);
}

export function getContenido(): Record<string, string> {
  init();
  const rows = getDb().prepare("SELECT clave, valor FROM contenido").all() as {
    clave: string;
    valor: string;
  }[];
  const map: Record<string, string> = { ...CONTENIDO_DEFAULT };
  for (const r of rows) map[r.clave] = r.valor;
  return map;
}

/* ---------- Administración ---------- */

export interface ProductoAdminRow extends ProductoRow {}

export function getTodosLosProductos(): ProductoAdminRow[] {
  init();
  return getDb()
    .prepare("SELECT * FROM productos ORDER BY categoria, orden, id")
    .all() as ProductoAdminRow[];
}

export interface ProductoInput {
  id?: number;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number | null;
  categoria: Categoria;
  imagen: string;
  variedades?: string | null;
  orden?: number;
  visible?: number;
}

export function upsertProducto(p: ProductoInput): void {
  init();
  const db = getDb();
  if (p.id) {
    db.prepare(
      `UPDATE productos SET slug=@slug, nombre=@nombre, descripcion=@descripcion,
       precio=@precio, categoria=@categoria, imagen=@imagen, variedades=@variedades,
       visible=@visible WHERE id=@id`
    ).run({
      id: p.id,
      slug: p.slug,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      categoria: p.categoria,
      imagen: p.imagen,
      variedades: p.variedades ?? null,
      visible: p.visible ?? 1,
    });
  } else {
    const maxOrden =
      (db.prepare("SELECT MAX(orden) m FROM productos").get() as { m: number | null }).m ?? 0;
    db.prepare(
      `INSERT INTO productos (slug, nombre, descripcion, precio, categoria, imagen, variedades, orden, visible)
       VALUES (@slug, @nombre, @descripcion, @precio, @categoria, @imagen, @variedades, @orden, @visible)`
    ).run({
      slug: p.slug,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      categoria: p.categoria,
      imagen: p.imagen,
      variedades: p.variedades ?? null,
      orden: maxOrden + 1,
      visible: p.visible ?? 1,
    });
  }
}

export function deleteProducto(id: number): void {
  init();
  getDb().prepare("DELETE FROM productos WHERE id = ?").run(id);
}

export function setContenido(entries: Record<string, string>): void {
  init();
  const db = getDb();
  const stmt = db.prepare(
    "INSERT INTO contenido (clave, valor) VALUES (?, ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor"
  );
  const tx = db.transaction(() => {
    for (const [k, v] of Object.entries(entries)) stmt.run(k, v);
  });
  tx();
}
