import { getClient } from "./db";
import {
  empanadas as seedEmpanadas,
  tortas as seedTortas,
  masProductos as seedMas,
} from "@/data/products";
import type { Product } from "@/types/Product";

/**
 * Capa CMS: productos editables y contenido de texto por secciones.
 * Comparte la conexión libSQL/Turso con el módulo de reclamaciones.
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

const globalForCms = globalThis as unknown as { _dlemiliaCmsInit?: Promise<void> };

async function ensureSchema(): Promise<void> {
  const db = getClient();
  await db.execute(`
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
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contenido (
      clave TEXT PRIMARY KEY,
      valor TEXT NOT NULL DEFAULT ''
    )
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

async function ensureSeed(): Promise<void> {
  const db = getClient();
  const nProd = Number(
    (await db.execute("SELECT COUNT(*) c FROM productos")).rows[0].c
  );
  if (nProd === 0) {
    const seedAll: { arr: Product[]; categoria: Categoria }[] = [
      { arr: seedTortas, categoria: "torta" },
      { arr: seedEmpanadas, categoria: "empanada" },
      { arr: seedMas, categoria: "mas" },
    ];
    const tx = await db.transaction("write");
    try {
      let orden = 0;
      for (const { arr, categoria } of seedAll) {
        for (const p of arr) {
          await tx.execute({
            sql: `
              INSERT INTO productos (slug, nombre, descripcion, precio, categoria, imagen, variedades, orden)
              VALUES (@slug, @nombre, @descripcion, @precio, @categoria, @imagen, @variedades, @orden)
            `,
            args: {
              slug: p.id,
              nombre: p.name,
              descripcion: p.description,
              precio: p.price,
              categoria,
              imagen: p.image,
              variedades: p.varieties?.join(", ") ?? null,
              orden: orden++,
            },
          });
        }
      }
      await tx.commit();
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }

  const nCont = Number(
    (await db.execute("SELECT COUNT(*) c FROM contenido")).rows[0].c
  );
  if (nCont === 0) {
    const tx = await db.transaction("write");
    try {
      for (const [k, v] of Object.entries(CONTENIDO_DEFAULT)) {
        await tx.execute({
          sql: "INSERT INTO contenido (clave, valor) VALUES (?, ?)",
          args: [k, v],
        });
      }
      await tx.commit();
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }
}

/** Inicializa esquema y semilla una sola vez por instancia. */
function init(): Promise<void> {
  if (!globalForCms._dlemiliaCmsInit) {
    globalForCms._dlemiliaCmsInit = (async () => {
      await ensureSchema();
      await ensureSeed();
    })();
  }
  return globalForCms._dlemiliaCmsInit;
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

export async function getProductosPorCategoria(
  categoria: Categoria
): Promise<ProductoCMS[]> {
  await init();
  const rows = (
    await getClient().execute({
      sql: "SELECT * FROM productos WHERE categoria = ? AND visible = 1 ORDER BY orden, id",
      args: [categoria],
    })
  ).rows as unknown as ProductoRow[];
  return rows.map(mapRow);
}

export async function getContenido(): Promise<Record<string, string>> {
  await init();
  const rows = (
    await getClient().execute("SELECT clave, valor FROM contenido")
  ).rows as unknown as { clave: string; valor: string }[];
  const map: Record<string, string> = { ...CONTENIDO_DEFAULT };
  for (const r of rows) map[r.clave] = r.valor;
  return map;
}

/* ---------- Administración ---------- */

export interface ProductoAdminRow extends ProductoRow {}

export async function getTodosLosProductos(): Promise<ProductoAdminRow[]> {
  await init();
  return (
    await getClient().execute(
      "SELECT * FROM productos ORDER BY categoria, orden, id"
    )
  ).rows as unknown as ProductoAdminRow[];
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

export async function upsertProducto(p: ProductoInput): Promise<void> {
  await init();
  const db = getClient();
  if (p.id) {
    await db.execute({
      sql: `UPDATE productos SET slug=@slug, nombre=@nombre, descripcion=@descripcion,
       precio=@precio, categoria=@categoria, imagen=@imagen, variedades=@variedades,
       visible=@visible WHERE id=@id`,
      args: {
        id: p.id,
        slug: p.slug,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        categoria: p.categoria,
        imagen: p.imagen,
        variedades: p.variedades ?? null,
        visible: p.visible ?? 1,
      },
    });
  } else {
    const maxOrden = Number(
      (await db.execute("SELECT MAX(orden) m FROM productos")).rows[0].m ?? 0
    );
    await db.execute({
      sql: `INSERT INTO productos (slug, nombre, descripcion, precio, categoria, imagen, variedades, orden, visible)
       VALUES (@slug, @nombre, @descripcion, @precio, @categoria, @imagen, @variedades, @orden, @visible)`,
      args: {
        slug: p.slug,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        categoria: p.categoria,
        imagen: p.imagen,
        variedades: p.variedades ?? null,
        orden: maxOrden + 1,
        visible: p.visible ?? 1,
      },
    });
  }
}

export async function deleteProducto(id: number): Promise<void> {
  await init();
  await getClient().execute({
    sql: "DELETE FROM productos WHERE id = ?",
    args: [id],
  });
}

export async function setContenido(entries: Record<string, string>): Promise<void> {
  await init();
  const db = getClient();
  const tx = await db.transaction("write");
  try {
    for (const [k, v] of Object.entries(entries)) {
      await tx.execute({
        sql: "INSERT INTO contenido (clave, valor) VALUES (?, ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor",
        args: [k, v],
      });
    }
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}
