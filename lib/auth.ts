import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Autenticación simple para el panel admin, basada en credenciales en
 * variables de entorno y una cookie de sesión firmada (HMAC-SHA256).
 */
export const COOKIE_NAME = "dlemilia_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 horas

const SECRET = process.env.ADMIN_SECRET || "cambia-este-secreto-en-produccion";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dlemilia2026";

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function verifyCredentials(user: string, password: string): boolean {
  return safeEqual(user, ADMIN_USER) && safeEqual(password, ADMIN_PASSWORD);
}

export function createToken(): string {
  const exp = String(Date.now() + COOKIE_MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(sig, sign(payload))) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Date.now();
}

/** Comprueba la cookie de sesión en un Server Component o Route Handler. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}
