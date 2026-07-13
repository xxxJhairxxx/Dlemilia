import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL = "https://dlemilia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Productos D'lemilia — Tortas y empanadas artesanales",
    template: "%s | Productos D'lemilia",
  },
  description:
    "Pastelería artesanal Productos D'lemilia: tortas artesanales, empanadas recién horneadas y pedidos personalizados. Sabor único, hecho con pasión. Pide fácilmente por WhatsApp.",
  keywords: [
    "tortas artesanales",
    "empanadas",
    "pastelería",
    "repostería artesanal",
    "tortas personalizadas",
    "D'lemilia",
    "Perú",
  ],
  authors: [{ name: "Productos D'lemilia" }],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: "Productos D'lemilia",
    title: "Productos D'lemilia — Tortas y empanadas artesanales",
    description:
      "Tortas artesanales, empanadas recién horneadas y pedidos personalizados. Sabor único, hecho con pasión.",
    images: [
      {
        url: "/logo/logo-full.jpg",
        width: 1200,
        height: 1200,
        alt: "Productos D'lemilia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Productos D'lemilia — Tortas y empanadas artesanales",
    description:
      "Tortas artesanales, empanadas recién horneadas y pedidos personalizados. Sabor único, hecho con pasión.",
    images: ["/logo/logo-full.jpg"],
  },
  robots: { index: true, follow: true },
};

/** Datos estructurados Schema.org para negocio local de tipo panadería. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Productos D'lemilia",
  slogan: "Sabor único, hecho con pasión",
  description:
    "Pastelería artesanal especializada en tortas y empanadas recién horneadas.",
  telephone: "+51942392993",
  url: SITE_URL,
  image: `${SITE_URL}/logo/logo-full.jpg`,
  servesCuisine: ["Repostería", "Pastelería"],
  priceRange: "S/ 9 - S/ 90",
  areaServed: "PE",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
