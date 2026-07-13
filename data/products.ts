import type { Product } from "@/types/Product";

/**
 * Catálogo completo de Productos D'lemilia.
 * Información obtenida directamente de las imágenes de referencia
 * (publicación de empanadas y catálogo de tortas artesanales).
 */

export const empanadas: Product[] = [
  {
    id: "empanada-mixta",
    name: "Empanada Mixta",
    description:
      "Recién horneada. Masa dorada y crujiente, con un relleno generoso que te encanta.",
    price: 9,
    category: "empanada",
    image: "/empanadas/empanada-mixta.jpg",
    varieties: ["Carne", "Pollo"],
  },
];

export const tortas: Product[] = [
  {
    id: "torta-chocolate",
    name: "Torta de Chocolate",
    description: "Queque de chocolate húmedo con fudge.",
    price: 60,
    category: "torta",
    image: "/tortas/torta-chocolate.jpg",
  },
  {
    id: "torta-selva-negra",
    name: "Torta Selva Negra",
    description:
      "Queque de chocolate con cerezas, crema chantilly, virutas de chocolate y rellena de mermelada de fresa.",
    price: 60,
    category: "torta",
    image: "/tortas/torta-selva-negra.png",
  },
  {
    id: "torta-sublime",
    name: "Torta Sublime",
    description: "Queque de chocolate con manjar y cobertura de chocolate.",
    price: 60,
    category: "torta",
    image: "/tortas/torta-sublime.jpg",
  },
  {
    id: "torta-moka",
    name: "Torta Moka",
    description: "Queque de chocolate bañado en almíbar de café con crema mocca.",
    price: 60,
    category: "torta",
    image: "/tortas/torta-moka.jpg",
  },
  {
    id: "torta-red-velvet",
    name: "Torta Red Velvet",
    description: "Queque rojo con crema chantilly y un toque de cacao.",
    price: 60,
    category: "torta",
    image: "/tortas/torta-red-velvet.jpg",
  },
  {
    id: "torta-chocolucuma",
    name: "Torta Chocolúcuma",
    description: "Queque de chocolate con pulpa de lúcuma y cobertura de chocolate.",
    price: 60,
    category: "torta",
    image: "/tortas/torta-choco-lucuma.webp",
  },
  {
    id: "torta-maracumango",
    name: "Torta Maracumango",
    description:
      "Queque de chocolate o vainilla con mousse de maracuyá y relleno de pulpa de maracumango.",
    price: 60,
    category: "torta",
    image: "/tortas/torta-maracumango.jpg",
  },
  {
    id: "torta-pistacho",
    name: "Torta Pistacho",
    description: "Queque de vainilla con crema de pistacho y cobertura de pistacho.",
    price: 90,
    category: "torta",
    image: "/tortas/torta-pistacho.jpg",
  },
  {
    id: "torta-tres-leches",
    name: "Torta Tres Leches",
    description:
      "Queque esponjoso bañado en tres leches y decorado con crema chantilly y cerezas.",
    price: 70,
    category: "torta",
    image: "/tortas/torta-tres-leches.jpg",
  },
  // {
  //   id: "torta-helada",
  //   name: "Torta Helada",
  //   description:
  //     "Bizcocho de vainilla o chocolate con gelatina en la parte superior y mousse en la parte baja.",
  //   price: 50,
  //   category: "torta",
  //   image: "/tortas/torta-helada.jpg",
  // },
];

/**
 * Otras delicias artesanales con foto real de Productos D'lemilia.
 * Precio a consultar por WhatsApp (aún por definir).
 */
export const masProductos: Product[] = [
  {
    id: "cheesecake-fresa",
    name: "Cheesecake de Fresa",
    description: "Cremoso cheesecake artesanal con cobertura de fresa.",
    price: null,
    category: "torta",
    image: "/tortas/cheesecake-fresa.webp",
  },
  {
    id: "torta-vainilla",
    name: "Torta de Vainilla",
    description: "Bizcocho de vainilla con crema chantilly y decoración artesanal.",
    price: null,
    category: "torta",
    image: "/tortas/torta-vainilla.webp",
  },
  {
    id: "tartaletas-fresa",
    name: "Tartaletas de Fresa",
    description: "Tartaletas artesanales con crema y fresas frescas.",
    price: null,
    category: "torta",
    image: "/tortas/tartaletas-fresa.webp",
  },
];

export const allProducts: Product[] = [...empanadas, ...tortas, ...masProductos];
