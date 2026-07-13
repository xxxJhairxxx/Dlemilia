"use client";

import { createContext, useContext, useMemo } from "react";
import type { Product } from "@/types/Product";
import {
  sendWhatsApp,
  generalWhatsApp,
  customCakeWhatsApp,
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY,
} from "@/lib/whatsapp";

interface WaValue {
  numero: string;
  display: string;
  general: () => string;
  product: (p: Product, quantity?: number, variety?: string) => string;
  customCake: () => string;
}

const WaContext = createContext<WaValue | null>(null);

export function WhatsAppProvider({
  numero,
  display,
  children,
}: {
  numero?: string;
  display?: string;
  children: React.ReactNode;
}) {
  const value = useMemo<WaValue>(() => {
    const num = numero || WHATSAPP_NUMBER;
    return {
      numero: num,
      display: display || WHATSAPP_DISPLAY,
      general: () => generalWhatsApp(num),
      product: (p, q = 1, v) => sendWhatsApp(num, p, q, v),
      customCake: () => customCakeWhatsApp(num),
    };
  }, [numero, display]);

  return <WaContext.Provider value={value}>{children}</WaContext.Provider>;
}

/** Hook para construir enlaces de WhatsApp con el número configurado. */
export function useWa(): WaValue {
  const ctx = useContext(WaContext);
  if (!ctx) {
    // Respaldo si se usa fuera del provider (evita romper el render).
    return {
      numero: WHATSAPP_NUMBER,
      display: WHATSAPP_DISPLAY,
      general: () => generalWhatsApp(WHATSAPP_NUMBER),
      product: (p, q = 1, v) => sendWhatsApp(WHATSAPP_NUMBER, p, q, v),
      customCake: () => customCakeWhatsApp(WHATSAPP_NUMBER),
    };
  }
  return ctx;
}
