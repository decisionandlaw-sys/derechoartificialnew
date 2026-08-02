import Link from "next/link";
import Image from "next/image";
import { HM_BADGE_SRC } from "@/components/ui/WatermarkedImage";

interface NewsCardProps {
  title: string;
  date: string;
  source: string;
  url: string;
  summary: string;
  tags: string[];
  image?: string;
}

export function NewsCard({ title, date, source, url, summary, tags, image }: NewsCardProps) {
  const isInternal = url.startsWith("/");

  const TitleLink = isInternal ? (
    <Link href={url} className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      {title}
    </Link>
  ) : (
    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      {title}
    </a>
  );

  const SourceLink = isInternal ? (
    <Link href={url} className="text-body hover:text-foreground transition-colors underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      {source} →
    </Link>
  ) : (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-body hover:text-foreground transition-colors underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {source} →
    </a>
  );

  return (
    <article className="border border-divider mb-10 last:mb-0 bg-card">
      {image && (
        <div className="aspect-video w-full overflow-hidden border-b border-divider relative">
          <Image
            src={image}
            alt=""
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className="hm-badge" aria-hidden="true">
            <img
              src={HM_BADGE_SRC}
              alt=""
              className="hm-badge-seal"
              loading="lazy"
              decoding="async"
            />
          </span>
        </div>
      )}

      <div className="p-6 md:p-8 border-b border-divider bg-surface">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <time className="text-xs text-caption uppercase tracking-wider">{date}</time>
          <span className="text-caption">·</span>
          <span className="text-xs text-caption uppercase tracking-wider">{source}</span>
        </div>

        <h2 className="font-display font-bold text-xl md:text-2xl text-foreground leading-tight tracking-tight">{TitleLink}</h2>
      </div>

      <div className="p-6 md:p-8 border-b border-divider">
        <p className="text-body leading-relaxed">{summary}</p>
      </div>

      <div className="p-6 md:p-8 border-b border-divider">
        <h3 className="text-xs uppercase tracking-wider text-caption mb-3">Fuente original</h3>
        {SourceLink}
      </div>

      <div className="p-6 md:p-8 border-t border-divider">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 bg-surface text-caption border border-divider">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
