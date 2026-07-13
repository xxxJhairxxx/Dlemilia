"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, BookOpen, FileText, Cake, Inbox } from "lucide-react";

const tabs = [
  { href: "/admin/contenido", label: "Contenido", icon: FileText },
  { href: "/admin/productos", label: "Productos", icon: Cake },
  { href: "/admin/reclamaciones", label: "Reclamaciones", icon: Inbox },
];

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-carbon/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-5 w-5 text-borgona" aria-hidden="true" />
          <span className="font-display text-lg font-medium text-borgona">
            Administración D&apos;lemilia
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-1.5">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-borgona text-crema"
                    : "text-carbon ring-1 ring-carbon/10 hover:bg-crema"
                }`}
              >
                <t.icon className="h-4 w-4" aria-hidden="true" />
                {t.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-gris transition-colors hover:bg-crema hover:text-carbon"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Salir
          </button>
        </nav>
      </div>
    </header>
  );
}
