import { getContenido } from "@/lib/cms";
import ContenidoForm from "@/components/ContenidoForm";

export const dynamic = "force-dynamic";

export default function AdminContenidoPage() {
  const contenido = getContenido();
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <ContenidoForm inicial={contenido} />
    </main>
  );
}
