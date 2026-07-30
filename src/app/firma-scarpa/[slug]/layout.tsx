import type { ReactNode } from "react";
import { createArticleJsonLd, StructuredData } from "@/components/seo/StructuredData";
import { getContentEntry } from "@/lib/content";

export default async function FirmaScarpaArticleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getContentEntry("firma-scarpa", slug);

  return (
    <>
      <head>
        {entry ? (
          <StructuredData
            data={createArticleJsonLd({
              url: entry.url,
              headline: entry.title,
              description: entry.description,
              datePublished: entry.datePublished,
              authorName: entry.author,
            })}
          />
        ) : null}
      </head>
      {children}
    </>
  );
}
