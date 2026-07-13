"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "No se pudo iniciar sesión.");
      }
      router.replace("/admin/reclamaciones");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-xl border border-carbon/15 bg-white px-4 py-3 text-sm text-carbon outline-none transition-colors placeholder:text-gris/60 focus:border-borgona focus:ring-2 focus:ring-borgona/15";

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft ring-1 ring-carbon/5"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-borgona/10">
          <Lock className="h-6 w-6 text-borgona" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-center font-display text-2xl font-medium text-borgona">
          Panel de administración
        </h1>
        <p className="mt-2 text-center text-sm font-light text-gris">
          Libro de Reclamaciones — Productos D&apos;lemilia
        </p>

        {error && (
          <p className="mt-6 rounded-xl bg-borgona/10 px-4 py-3 text-sm font-medium text-borgona">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-carbon" htmlFor="user">
              Usuario
            </label>
            <input id="user" className={input} value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-carbon" htmlFor="password">
              Contraseña
            </label>
            <input id="password" type="password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-full bg-borgona px-8 py-3.5 text-sm font-medium text-crema transition-colors hover:bg-borgona-light disabled:opacity-60"
        >
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
