import { createClient, type Client } from "@libsql/client";

/**
 * Conexión libSQL / Turso (singleton).
 *
 * En producción (Vercel) se usa Turso mediante las variables de entorno
 * TURSO_DATABASE_URL y TURSO_AUTH_TOKEN. En desarrollo, si no están
 * definidas, se cae automáticamente a un archivo SQLite local
 * (`file:reclamaciones.db`) para poder trabajar sin configurar nada.
 */
const globalForDb = globalThis as unknown as {
  _dlemiliaClient?: Client;
  _dlemiliaReclInit?: Promise<void>;
};

export function getClient(): Client {
  if (!globalForDb._dlemiliaClient) {
    const url = process.env.TURSO_DATABASE_URL ?? "file:reclamaciones.db";
    globalForDb._dlemiliaClient = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return globalForDb._dlemiliaClient;
}

/** Crea la tabla de reclamaciones (una sola vez por instancia). */
function ensureSchema(): Promise<void> {
  if (!globalForDb._dlemiliaReclInit) {
    globalForDb._dlemiliaReclInit = (async () => {
      const db = getClient();
      await db.execute(`
        CREATE TABLE IF NOT EXISTS reclamaciones (
          id           INTEGER PRIMARY KEY AUTOINCREMENT,
          correlativo  TEXT NOT NULL UNIQUE,
          creado_en    TEXT NOT NULL,
          nombre       TEXT NOT NULL,
          tipo_doc     TEXT NOT NULL,
          num_doc      TEXT NOT NULL,
          domicilio    TEXT NOT NULL,
          telefono     TEXT,
          correo       TEXT NOT NULL,
          menor        INTEGER NOT NULL DEFAULT 0,
          apoderado    TEXT,
          tipo_bien    TEXT NOT NULL,
          monto        TEXT,
          descripcion  TEXT NOT NULL,
          tipo_reclamo TEXT NOT NULL,
          detalle      TEXT NOT NULL,
          pedido       TEXT NOT NULL,
          estado       TEXT NOT NULL DEFAULT 'pendiente',
          respuesta    TEXT,
          respondido_en TEXT
        )
      `);

      // Migración para bases creadas antes de agregar estas columnas.
      const cols = (
        await db.execute("PRAGMA table_info(reclamaciones)")
      ).rows.map((c) => c.name as string);
      if (!cols.includes("estado"))
        await db.execute(
          "ALTER TABLE reclamaciones ADD COLUMN estado TEXT NOT NULL DEFAULT 'pendiente'"
        );
      if (!cols.includes("respuesta"))
        await db.execute("ALTER TABLE reclamaciones ADD COLUMN respuesta TEXT");
      if (!cols.includes("respondido_en"))
        await db.execute("ALTER TABLE reclamaciones ADD COLUMN respondido_en TEXT");
    })();
  }
  return globalForDb._dlemiliaReclInit;
}

export interface ReclamacionInput {
  nombre: string;
  tipoDoc: string;
  numDoc: string;
  domicilio: string;
  telefono?: string;
  correo: string;
  menor: boolean;
  apoderado?: string;
  tipoBien: string;
  monto?: string;
  descripcion: string;
  tipoReclamo: string;
  detalle: string;
  pedido: string;
}

/**
 * Inserta una reclamación y devuelve su correlativo (LR-AÑO-000001).
 */
export async function insertReclamacion(
  data: ReclamacionInput
): Promise<{ id: number; correlativo: string }> {
  await ensureSchema();
  const db = getClient();
  const now = new Date();
  const creadoEn = now.toISOString();

  // Transacción: reservamos el id y construimos el correlativo con él.
  const tx = await db.transaction("write");
  try {
    const temp = `TMP-${now.getTime()}`;
    const res = await tx.execute({
      sql: `
        INSERT INTO reclamaciones (
          correlativo, creado_en, nombre, tipo_doc, num_doc, domicilio, telefono,
          correo, menor, apoderado, tipo_bien, monto, descripcion, tipo_reclamo, detalle, pedido
        ) VALUES (
          @correlativo, @creadoEn, @nombre, @tipoDoc, @numDoc, @domicilio, @telefono,
          @correo, @menor, @apoderado, @tipoBien, @monto, @descripcion, @tipoReclamo, @detalle, @pedido
        )
      `,
      args: {
        correlativo: temp,
        creadoEn,
        nombre: data.nombre,
        tipoDoc: data.tipoDoc,
        numDoc: data.numDoc,
        domicilio: data.domicilio,
        telefono: data.telefono ?? null,
        correo: data.correo,
        menor: data.menor ? 1 : 0,
        apoderado: data.apoderado ?? null,
        tipoBien: data.tipoBien,
        monto: data.monto ?? null,
        descripcion: data.descripcion,
        tipoReclamo: data.tipoReclamo,
        detalle: data.detalle,
        pedido: data.pedido,
      },
    });
    const id = Number(res.lastInsertRowid);
    const correlativo = `LR-${now.getFullYear()}-${String(id).padStart(6, "0")}`;
    await tx.execute({
      sql: "UPDATE reclamaciones SET correlativo = ? WHERE id = ?",
      args: [correlativo, id],
    });
    await tx.commit();
    return { id, correlativo };
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

export interface ReclamacionRow {
  id: number;
  correlativo: string;
  creado_en: string;
  nombre: string;
  tipo_doc: string;
  num_doc: string;
  domicilio: string;
  telefono: string | null;
  correo: string;
  menor: number;
  apoderado: string | null;
  tipo_bien: string;
  monto: string | null;
  descripcion: string;
  tipo_reclamo: string;
  detalle: string;
  pedido: string;
  estado: string;
  respuesta: string | null;
  respondido_en: string | null;
}

export async function getAllReclamaciones(): Promise<ReclamacionRow[]> {
  await ensureSchema();
  const res = await getClient().execute(
    "SELECT * FROM reclamaciones ORDER BY id DESC"
  );
  return res.rows as unknown as ReclamacionRow[];
}

/**
 * Registra la respuesta del proveedor (Sección 4 del formato oficial)
 * y marca la reclamación como atendida.
 */
export async function updateRespuesta(
  id: number,
  respuesta: string
): Promise<boolean> {
  await ensureSchema();
  const res = await getClient().execute({
    sql: "UPDATE reclamaciones SET respuesta = ?, respondido_en = ?, estado = 'atendido' WHERE id = ?",
    args: [respuesta, new Date().toISOString(), id],
  });
  return res.rowsAffected > 0;
}
