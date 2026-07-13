import type { Product } from "@/types/Product";

/** Número y display por defecto (respaldo si no hay valor en el CMS). */
export const WHATSAPP_NUMBER = "51942392993";
export const WHATSAPP_DISPLAY = "942 392 993";

/** Normaliza el número a solo dígitos para el enlace wa.me. */
function digits(numero: string): string {
  return (numero || "").replace(/\D/g, "") || WHATSAPP_NUMBER;
}

function buildUrl(numero: string, message: string): string {
  return `https://wa.me/${digits(numero)}?text=${encodeURIComponent(message)}`;
}

/**
 * URL de WhatsApp para pedir un producto del catálogo.
 */
export function sendWhatsApp(
  numero: string,
  product: Product,
  quantity: number = 1,
  variety?: string
): string {
  let message: string;
  const nombre = variety ? `${product.name} (${variety})` : product.name;

  if (product.price === null) {
    message = `Hola.

Quisiera consultar por el siguiente producto:
${nombre}

¿Me podrían indicar el precio y la disponibilidad?

Muchas gracias.`;
  } else {
    message = `Hola.

Quisiera pedir el siguiente producto:

• ${nombre}

Cantidad: ${quantity}

Muchas gracias.`;
  }

  return buildUrl(numero, message);
}

/** URL genérica de WhatsApp (header, footer, botón flotante). */
export function generalWhatsApp(numero: string): string {
  return buildUrl(numero, `Hola. Me gustaría hacer un pedido en Productos D'lemilia.`);
}

/** URL de WhatsApp para solicitar cotización de torta personalizada. */
export function customCakeWhatsApp(numero: string): string {
  return buildUrl(
    numero,
    `Hola.

Me gustaría solicitar una cotización para una torta personalizada.

Ocasión:
Fecha:
Detalles:

Muchas gracias.`
  );
}
