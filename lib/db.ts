import Database from "better-sqlite3";
import path from "node:path";

/**
 * Conexión SQLite (singleton). El archivo se crea en la raíz del proyecto
 * como `reclamaciones.db`. Se reutiliza la misma conexión en desarrollo
 * para evitar abrir múltiples handles con el hot-reload.
 */
const DB_PATH = path.join(process.cwd(), "reclamaciones.db");

const globalForDb = globalThis as unknown as { _dlemiliaDb?: Database.Database };

function initDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
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

  // Migración para bases de datos creadas antes de agregar estas columnas.
  const cols = (db.prepare("PRAGMA table_info(reclamaciones)").all() as { name: string }[]).map(
    (c) => c.name
  );
  if (!cols.includes("estado"))
    db.exec("ALTER TABLE reclamaciones ADD COLUMN estado TEXT NOT NULL DEFAULT 'pendiente'");
  if (!cols.includes("respuesta")) db.exec("ALTER TABLE reclamaciones ADD COLUMN respuesta TEXT");
  if (!cols.includes("respondido_en"))
    db.exec("ALTER TABLE reclamaciones ADD COLUMN respondido_en TEXT");

  return db;
}

export function getDb(): Database.Database {
  if (!globalForDb._dlemiliaDb) {
    globalForDb._dlemiliaDb = initDb();
  }
  return globalForDb._dlemiliaDb;
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
export function insertReclamacion(data: ReclamacionInput): { id: number; correlativo: string } {
  const db = getDb();
  const now = new Date();
  const creadoEn = now.toISOString();

  const insert = db.prepare(`
    INSERT INTO reclamaciones (
      correlativo, creado_en, nombre, tipo_doc, num_doc, domicilio, telefono,
      correo, menor, apoderado, tipo_bien, monto, descripcion, tipo_reclamo, detalle, pedido
    ) VALUES (
      @correlativo, @creadoEn, @nombre, @tipoDoc, @numDoc, @domicilio, @telefono,
      @correo, @menor, @apoderado, @tipoBien, @monto, @descripcion, @tipoReclamo, @detalle, @pedido
    )
  `);

  // Transacción: reservamos el id y construimos el correlativo con él.
  const tx = db.transaction((): { id: number; correlativo: string } => {
    const temp = `TMP-${now.getTime()}`;
    const res = insert.run({
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
    });
    const id = Number(res.lastInsertRowid);
    const correlativo = `LR-${now.getFullYear()}-${String(id).padStart(6, "0")}`;
    db.prepare("UPDATE reclamaciones SET correlativo = ? WHERE id = ?").run(correlativo, id);
    return { id, correlativo };
  });

  return tx();
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

export function getAllReclamaciones(): ReclamacionRow[] {
  return getDb()
    .prepare("SELECT * FROM reclamaciones ORDER BY id DESC")
    .all() as ReclamacionRow[];
}

/**
 * Registra la respuesta del proveedor (Sección 4 del formato oficial)
 * y marca la reclamación como atendida.
 */
export function updateRespuesta(id: number, respuesta: string): boolean {
  const res = getDb()
    .prepare(
      "UPDATE reclamaciones SET respuesta = ?, respondido_en = ?, estado = 'atendido' WHERE id = ?"
    )
    .run(respuesta, new Date().toISOString(), id);
  return res.changes > 0;
}
