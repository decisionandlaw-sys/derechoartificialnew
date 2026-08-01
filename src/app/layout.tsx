import type { Metadata } from "next";
import Link from "next/link";
import { Archivo_Black, Inter } from "next/font/google";
import "../index.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/ui/CookieBanner";

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-archivo",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

import {
  StructuredData,
  createOrganizationJsonLd,
  createPersonJsonLd,
  createWebSiteJsonLd,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL("https://derechoartificial.com"),
  title: {
    default: "Regulación IA: AI Act, RGPD y compliance | Derecho Artificial",
    template: "%s | Derecho Artificial",
  },
  description:
    "Domina el AI Act, el RGPD y la jurisprudencia IA. Análisis jurídico, guías de compliance y sentencias comentadas para abogados y DPO.",
  keywords: [
    "derecho artificial",
    "inteligencia artificial",
    "regulación IA",
    "AI Act",
    "RGPD",
    "jurisprudencia",
    "cumplimiento",
    "ética",
    "tecnología y derecho",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/",
      "en-US": "https://decisionandlaw.com/",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo-icono.png",
    shortcut: "/logo-icono.png",
    apple: "/logo-icono.png",
  },
  openGraph: {
    type: "website",
    siteName: "Derecho Artificial",
    url: "/",
    title: "Derecho Artificial",
    description:
      "Análisis jurídico experto del Reglamento IA. Guías prácticas y criterio independiente para abogados y compliance.",
    locale: "es_ES",
    images: [
      {
        url: "/og-default-1200x630.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Derecho Artificial",
    description:
      "Análisis jurídico experto del Reglamento IA. Guías prácticas y criterio independiente para abogados y compliance.",
    images: ["/og-default-1200x630.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/logo-icono.png" />
        <link rel="alternate" hrefLang="es" href="https://derechoartificial.com/" />
        <link rel="alternate" hrefLang="en" href="https://decisionandlaw.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://derechoartificial.com/" />
        <StructuredData
          data={[
            createOrganizationJsonLd(),
            createWebSiteJsonLd(),
            createPersonJsonLd({
              name: "Ricardo Scarpa",
              url: "https://derechoartificial.com/quienes-somos",
              description:
                "Responsable editorial de Derecho Artificial. Licenciado en Derecho por la Universidad Europea de Madrid. Máster en Informática Jurídica por la UNED. Máster en Dirección de Empresas Audiovisuales por el Instituto de Empresa (IE) de Madrid.",
            }),
          ]}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
