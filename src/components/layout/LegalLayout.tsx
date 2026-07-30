import { ReactNode } from "react";
import Link from "next/link";
import { HmcIndicator } from "@/components/HmcIndicator";

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  category: string;
  date?: string;
  hero?: ReactNode;
  author?: {
    name: string;
    href?: string;
  };
}

export function LegalLayout({
  children,
  title,
  category,
  date,
  hero,
  author = { name: "Ricardo Scarpa", href: "/quienes-somos" }
}: LegalLayoutProps) {
  return (
    <main>
      {hero ? (
        hero
      ) : (
        <section className="border-b border-divider/30">
          <div className="container-narrow py-10 md:py-14">
            <span className="inline-block mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-caption border border-divider/30 px-2 py-1">
              {category}
            </span>
            <h1 className="font-display font-black text-[clamp(1.8rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.03em] text-foreground mb-5">
              {title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-caption">
              {date && (
                <>
                  <time dateTime={date}>
                    {new Date(date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="text-divider/50">·</span>
                </>
              )}
              <span>Por</span>
              {author.href ? (
                <Link
                  href={author.href}
                  className="font-medium text-foreground hover:text-foreground/70 transition-colors border-b border-foreground/20 hover:border-foreground/50"
                >
                  {author.name}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{author.name}</span>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 md:py-14">
        <div className="container-narrow">
          <div className="prose-editorial">
            {children}
          </div>
          <HmcIndicator />
        </div>
      </section>
    </main>
  );
}
