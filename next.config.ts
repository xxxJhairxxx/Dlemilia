import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @libsql/client trae bindings nativos: se deja fuera del bundle del servidor
  serverExternalPackages: ["@libsql/client"],
  images: {
    // Los placeholders del catálogo son SVG locales; permitimos su
    // optimización de forma segura (contenido propio, sin scripts).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    // Imágenes subidas desde el panel admin se guardan en Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
