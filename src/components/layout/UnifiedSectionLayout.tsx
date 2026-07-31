import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData, createBreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { SectionBanner } from "@/components/layout/SectionBanner";

export type UnifiedItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  badge: string;
  meta: string;
  dateMs: number;
  displayDateMs?: number;
};

export type SectionConfig = {
  title: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  footerTitle: string;
  footerDescription: string;
  breadcrumbItems: Array<{ name: string; url: string }>;
  metadata: Metadata;
};

interface UnifiedSectionLayoutProps {
  config: SectionConfig;
  items: UnifiedItem[];
}

export function UnifiedSectionLayout({ config, items }: UnifiedSectionLayoutProps) {
  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: config.breadcrumbItems,
  });

  // El artículo destacado es automáticamente el más reciente (primero en la lista ordenada)
  const featuredItems: UnifiedItem[] = items.length > 0 ? [items[0]] : [];
  const remainingItems = items.length > 0 ? items.slice(1) : [];

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      <main className="pb-16 md:pb-24">
        {/* Hero Banner */}
        <SectionBanner title={config.title} image={config.heroImage} alt={config.heroAlt} />

        {/* Description Section */}
        <div className="container mx-auto px-4 py-8">
          <p className="lead text-left max-w-3xl">
            {config.description}
          </p>
        </div>

        {/* Content Section */}
        <div className="container-editorial">
          {/* Artículos Destacados - Uno por fila */}
          {featuredItems.map((item) => (
            <section key={item.id} className="mb-12">
              <Link
                href={item.href}
                className="block card-elevated p-8 hover:border-foreground/30 transition-all duration-300"
              >
                <div className="flex flex-col gap-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold">
                    {item.badge}
                  </p>
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground leading-tight tracking-tight">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="text-lg text-body leading-relaxed max-w-4xl">
                      {item.description}
                    </p>
                  )}
                  {item.meta && (
                    <div className="text-sm text-caption mt-2">
                      {item.meta}
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="text-primary font-medium inline-flex items-center gap-2">
                      Leer análisis completo <span className="text-xl">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          ))}

          {/* Resto de artículos en grid de 2 columnas */}
          <section className="grid gap-6 md:grid-cols-2">
            {remainingItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="card-elevated p-6 hover:border-foreground/30 transition-all duration-300"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">
                  {item.badge}
                </p>
                <h2 className="font-display font-bold text-2xl text-foreground mb-4 tracking-tight">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="text-body mb-6">{item.description}</p>
                )}
                {item.meta && (
                  <div className="text-sm text-caption">{item.meta}</div>
                )}
              </Link>
            ))}
          </section>

          {/* Footer Section */}
          <section className="mt-12 border border-divider/30 bg-card p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">
              {config.footerTitle}
            </p>
            <p className="text-body max-w-3xl">
              {config.footerDescription}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
