import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminHeader from "@/components/AdminHeader";

export const metadata: Metadata = {
  title: "Panel — Libro de Reclamaciones",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen bg-paper">
      <AdminHeader />
      {children}
    </div>
  );
}
