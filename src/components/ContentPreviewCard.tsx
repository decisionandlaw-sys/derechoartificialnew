import Image from "next/image";
import Link from "next/link";
import { HM_BADGE_SRC } from "@/components/ui/WatermarkedImage";

export type PreviewItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  badge: string;
  meta: string;
  dateMs: number;
  displayDateMs?: number;
  imageUrl?: string;
};

interface ContentPreviewCardProps {
  item: PreviewItem;
  size?: "small" | "medium" | "large";
}

export function ContentPreviewCard({ item, size = "medium" }: ContentPreviewCardProps) {
  const cardClasses = {
    small: "card-elevated p-4 hover:border-primary/20 transition-all duration-300",
    medium: "card-elevated p-6 hover:border-primary/20 transition-all duration-300",
    large: "bg-card border border-border p-6 hover:border-foreground/30 transition-all duration-300",
  };

  const titleClasses = {
    small: "font-display font-bold text-lg text-foreground mb-2 tracking-tight",
    medium: "font-display font-bold text-2xl text-foreground mb-4 tracking-tight",
    large: "font-display font-bold text-xl md:text-2xl text-foreground mb-2 tracking-tight",
  };

  const descriptionClasses = {
    small: "text-sm text-body mb-3",
    medium: "text-body mb-6",
    large: "text-sm text-body mb-4",
  };

  const metaClasses = {
    small: "text-xs text-caption",
    medium: "text-sm text-caption",
    large: "text-xs text-caption",
  };
  const imageWrapperClasses = {
    small: "-mx-4 -mt-4 mb-4",
    medium: "-mx-6 -mt-6 mb-4",
    large: "-mx-6 -mt-6 mb-4",
  };
  const isExternalImage = item.imageUrl?.startsWith("http");

  return (
    <Link href={item.href} className={cardClasses[size]}>
      {item.imageUrl && (
        <div
          className={`relative aspect-[16/9] w-full overflow-hidden ${imageWrapperClasses[size]}`}
        >
          {isExternalImage ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[50%_65%] scale-[1.08]"
            />
          ) : (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[50%_65%] scale-[1.08]"
            />
          )}
          <img
            src={HM_BADGE_SRC}
            alt=""
            aria-hidden="true"
            className="hm-badge"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">{item.badge}</p>
      <h2 className={titleClasses[size]}>{item.title}</h2>
      {item.description && <p className={descriptionClasses[size]}>{item.description}</p>}
      {item.meta && <div className={metaClasses[size]}>{item.meta}</div>}
    </Link>
  );
}

interface ContentPreviewGridProps {
  items: PreviewItem[];
  columns?: 1 | 2 | 3;
  size?: "small" | "medium" | "large";
  maxItems?: number;
}

export function ContentPreviewGrid({ 
  items, 
  columns = 2, 
  size = "medium", 
  maxItems 
}: ContentPreviewGridProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;
  
  const gridClasses = {
    1: "grid gap-6",
    2: "grid gap-6 md:grid-cols-2",
    3: "grid gap-6 md:grid-cols-3",
  };

  return (
    <section className={gridClasses[columns]}>
      {displayItems.map((item) => (
        <ContentPreviewCard key={item.id} item={item} size={size} />
      ))}
    </section>
  );
}
