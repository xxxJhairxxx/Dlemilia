import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // better-sqlite3 es un módulo nativo: se deja fuera del bundle del servidor
  serverExternalPackages: ["better-sqlite3"],
  images: {
    // Los placeholders del catálogo son SVG locales; permitimos su
    // optimización de forma segura (contenido propio, sin scripts).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
