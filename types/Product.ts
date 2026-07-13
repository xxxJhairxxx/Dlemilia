export type ProductCategory = "torta" | "empanada";

export interface Product {
  /** Identificador único (slug) del producto */
  id: string;
  /** Nombre comercial del producto */
  name: string;
  /** Descripción artesanal breve */
  description: string;
  /** Precio en soles peruanos (S/). Si es null, se muestra "Consultar". */
  price: number | null;
  /** Categoría a la que pertenece */
  category: ProductCategory;
  /** Ruta de la imagen dentro de /public */
  image: string;
  /** Variedades opcionales (ej. Carne / Pollo) */
  varieties?: string[];
}
