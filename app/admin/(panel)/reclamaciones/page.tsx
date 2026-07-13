import { getAllReclamaciones } from "@/lib/db";
import AdminReclamaciones from "@/components/AdminReclamaciones";

export const dynamic = "force-dynamic";

export default async function AdminReclamacionesPage() {
  const rows = await getAllReclamaciones();
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <AdminReclamaciones rows={rows} />
    </main>
  );
}
