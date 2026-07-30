/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  turbopack: {
    resolveAlias: {},
  },

  onDemandEntries: {
    maxInactiveAge: 5 * 60 * 1000,
    pagesBufferLength: 0,
  },

  compiler: {
    removeConsole: true,
  },

  compress: true,
  productionBrowserSourceMaps: false,

  images: {
    minimumCacheTTL: 60 * 60 * 24 * 365,
    formats: ["image/webp"],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [16, 32, 64, 128, 256],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {},

  async headers() {
    return [];
  },

  async redirects() {
    return [
      {
        source: "/recursos",
        destination: "/guias-ia",
        permanent: true,
      },
      {
        source: "/recursos/noticias",
        destination: "/guias-ia",
        permanent: true,
      },
      {
        source: "/en/ai-news",
        destination: "/guias-ia",
        permanent: true,
      },
      {
        source: "/en/ai-news/:slug*",
        destination: "/guias-ia",
        permanent: true,
      },
      {
        source:
          "/propiedad-intelectual-ia/La%20Inteligencia%20Artificial%20Generativa%20ante%20el%20Desaf%C3%ADo%20del%20Derecho%20de%20Autor%20en%20la%20Uni%C3%B3n%20Europea",
        destination:
          "/propiedad-intelectual-ia/la-inteligencia-artificial-generativa-ante-el-desafio-del-derecho-de-autor-en-la-union-europea",
        permanent: true,
      },
      {
        source: "/ia-global",
        destination: "/global-ia",
        permanent: true,
      },
      {
        source: "/ia-global/:slug*",
        destination: "/global-ia/:slug*",
        permanent: true,
      },
      {
        source: "/analisis-juridico/cox-sony-responsabilidad-secundaria-isp",
        destination: "/firma-scarpa/cox-sony-responsabilidad-secundaria-isp",
        permanent: true,
      },
      {
        source: "/blog/kgm-meta-google-responsabilidad-algoritmico",
        destination: "/firma-scarpa/kgm-meta-google-responsabilidad-algoritmico",
        permanent: true,
      },
      {
        source: "/actualidad-ia",
        destination: "/guias-ia",
        permanent: true,
      },
      {
        source: "/actualidad-ia/:slug*",
        destination: "/guias-ia/:slug*",
        permanent: true,
      },
      {
        source: "/recursos/guias",
        destination: "/guias-ia",
        permanent: true,
      },
      {
        source: "/recursos/guias/:slug*",
        destination: "/guias-ia/:slug*",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [];
  },
};

export default nextConfig;
