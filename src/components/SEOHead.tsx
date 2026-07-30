import type { Metadata } from "next";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: "website" | "article" | "book" | "profile";
  keywords?: string;
}

export function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "article",
  keywords,
}: SEOHeadProps): Metadata {
  const baseUrl = "https://derechoartificial.com";
  const defaultImage = "/logo-principal.png";
  const finalImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`) : defaultImage;

  return {
    title,
    description,
    keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      type: ogType,
      title,
      description,
      url: canonical,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "es_ES",
      siteName: "Derecho Artificial",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [finalImage],
      creator: "@RicardoScarpa",
    },
  };
}
