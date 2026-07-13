import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Empanadas from "@/components/Empanadas";
import Tortas from "@/components/Tortas";
import CTA from "@/components/CTA";
import Benefits from "@/components/Benefits";
import About from "@/components/About";
import ContactBand from "@/components/ContactBand";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { WhatsAppProvider } from "@/components/WhatsAppProvider";
import { getContenido, getProductosPorCategoria } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const c = await getContenido();
  const tortas = await getProductosPorCategoria("torta");
  const mas = await getProductosPorCategoria("mas");
  const empanada = (await getProductosPorCategoria("empanada"))[0] ?? null;

  return (
    <WhatsAppProvider numero={c.contacto_whatsapp} display={c.contacto_telefono}>
      <Header />
      <main>
        <Hero c={c} />
        <Categories c={c} />
        {empanada && <Empanadas c={c} empanada={empanada} />}
        <Tortas c={c} tortas={tortas} mas={mas} />
        <CTA c={c} />
        <Benefits />
        <About c={c} />
        <ContactBand telefono={c.contacto_telefono} />
      </main>
      <Footer telefono={c.contacto_telefono} horarios={c.contacto_horarios} />
      <WhatsAppButton />
    </WhatsAppProvider>
  );
}
