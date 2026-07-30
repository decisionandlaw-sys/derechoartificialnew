"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

const navigationES = [
  { name: "Firma Scarpa", href: "/firma-scarpa" },
  { name: "Normativa IA", href: "/normativa" },
  { name: "Jurisprudencia IA", href: "/jurisprudencia" },
  { name: "Guías IA", href: "/guias-ia" },
  { name: "Propiedad Intelectual IA", href: "/propiedad-intelectual-ia" },
  { name: "Ética IA", href: "/etica-ia" },
  { name: "IA Global", href: "/global-ia" },
];

const navigationEN = [
  { name: "Scarpa Firm", href: "/firma-scarpa" },
  { name: "AI Regulation", href: "/normativa" },
  { name: "AI Jurisprudence", href: "/jurisprudencia" },
  { name: "AI News", href: "/en/ai-news" },
  { name: "AI Intellectual Property", href: "/propiedad-intelectual-ia" },
  { name: "AI Ethics", href: "/etica-ia" },
  { name: "Global AI", href: "/global-ia" },
];

const esEnRouteMap: Record<string, string> = {
  "/": "/en",
  "/firma-scarpa": "/en/scarpa-firm",
  "/jurisprudencia": "/en/jurisprudence",
  "/guias-ia": "/en/ai-news",
  "/normativa": "/en/legislation",
  "/propiedad-intelectual-ia": "/en",
  "/etica-ia": "/en",
  "/global-ia": "/en",
  "/recursos": "/en/ai-news",
};

const enEsRouteMap: Record<string, string> = {
  "/en": "/",
  "/en/scarpa-firm": "/firma-scarpa",
  "/en/jurisprudence": "/jurisprudencia",
  "/en/ai-news": "/guias-ia",
  "/en/legislation": "/normativa",
  "/en/guides-protocols": "/recursos/guias",
};

function HamburgerButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-6 h-6 text-foreground hover:text-newsroom transition-colors"
      aria-label={open ? "Cerrar menú" : "Abrir menú"}
    >
      {open ? (
        <X className="h-5 w-5" strokeWidth={2} />
      ) : (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="1" y="4" width="20" height="1.5" rx="0" fill="currentColor" />
          <rect x="1" y="10" width="20" height="1.5" rx="0" fill="currentColor" />
          <rect x="1" y="16" width="20" height="1.5" rx="0" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}

function MegaNav({
  open,
  onClose,
  navigation,
  isEnglish,
  getAlternateRoute,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  navigation: { name: string; href: string }[];
  isEnglish: boolean;
  getAlternateRoute: () => string;
  pathname: string;
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.6)]" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[min(380px,100%)] bg-background border-l border-[hsl(var(--border))] transition-transform duration-300 ease-[cubic-bezier(.39,.575,.565,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full px-8 pt-20 pb-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>

          <nav className="flex flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight text-foreground hover:text-newsroom transition-colors py-2"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="border-t border-[hsl(var(--divider))] pt-6 mb-6">
              <Link
                href={isEnglish ? "/en/about-us" : "/quienes-somos"}
                onClick={onClose}
                className="block text-sm text-caption hover:text-foreground transition-colors mb-3"
              >
                {isEnglish ? "About Us" : "Quiénes somos"}
              </Link>
              <Link
                href={isEnglish ? "/en/contact" : "/contacto"}
                onClick={onClose}
                className="block text-sm text-caption hover:text-foreground transition-colors mb-6"
              >
                {isEnglish ? "Contact" : "Contacto"}
              </Link>
              <Link
                href={getAlternateRoute()}
                onClick={onClose}
                className="text-sm font-semibold text-foreground hover:text-newsroom transition-colors"
              >
                {isEnglish ? "Versión en español" : "English version"} →
              </Link>
            </div>
            <div className="flex items-center gap-5">
              <a href="https://x.com/DArtificia59954" target="_blank" rel="noreferrer" className="text-caption hover:text-foreground transition-colors" aria-label="X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/derecho-artificial/" target="_blank" rel="noreferrer" className="text-caption hover:text-foreground transition-colors" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61587246221582" target="_blank" rel="noreferrer" className="text-caption hover:text-foreground transition-colors" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const [megaNavOpen, setMegaNavOpen] = useState(false);

  const isEnglish = pathname.startsWith("/en");
  const navigation = isEnglish ? navigationEN : navigationES;

  useEffect(() => {
    if (megaNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [megaNavOpen]);

  const getAlternateRoute = () => {
    if (isEnglish) {
      if (enEsRouteMap[pathname]) return enEsRouteMap[pathname];
      if (pathname.startsWith("/en/scarpa-firm")) return "/firma-scarpa";
      if (pathname.startsWith("/en/legislation")) return "/normativa";
      if (pathname.startsWith("/en/jurisprudence")) return "/jurisprudencia";
      if (pathname.startsWith("/en/guides-protocols")) return "/recursos/guias";
      if (pathname.startsWith("/en/ai-news")) return "/guias-ia";
      return "/";
    }
    if (esEnRouteMap[pathname]) return esEnRouteMap[pathname];
    if (pathname.startsWith("/firma-scarpa")) return "/en/scarpa-firm";
    if (pathname.startsWith("/normativa")) return "/en/legislation";
    if (pathname.startsWith("/jurisprudencia")) return "/en/jurisprudence";
    if (pathname.startsWith("/recursos/guias")) return "/en/guides-protocols";
    if (pathname.startsWith("/recursos")) return "/en/ai-news";
    if (pathname.startsWith("/guias-ia")) return "/en/ai-news";
    if (pathname.startsWith("/propiedad-intelectual-ia")) return "/en";
    if (pathname.startsWith("/etica-ia")) return "/en";
    if (pathname.startsWith("/global-ia")) return "/en";
    return "/en";
  };

  const handleLangToggle = () => {
    const target = getAlternateRoute();
    window.location.href = target;
  };

  return (
    <>
      <MegaNav
        open={megaNavOpen}
        onClose={() => setMegaNavOpen(false)}
        navigation={navigation}
        isEnglish={isEnglish}
        getAlternateRoute={getAlternateRoute}
        pathname={pathname}
      />

      <header className="fixed top-0 z-30 w-full bg-background border-b border-[hsl(var(--divider))]">
        <div className="container-wide">
          <div className="flex items-center justify-between h-[52px]">
            <Link href={isEnglish ? "/en" : "/"} className="flex items-center gap-3 group shrink-0">
              <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-display font-black text-xs leading-none">
                DA
              </div>
              <span className="font-display text-xs tracking-[0.15em] text-foreground/70 group-hover:text-foreground transition-colors hidden sm:block">
                DERECHO ARTIFICIAL
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigation.slice(0, 4).map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-display text-[11px] tracking-[0.12em] px-3 py-1.5 transition-colors ${
                      isActive
                        ? "text-foreground bg-foreground/5"
                        : "text-caption hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-caption hover:text-foreground transition-colors"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={handleLangToggle}
                className="font-display text-[11px] tracking-[0.12em] text-caption hover:text-foreground transition-colors"
              >
                {isEnglish ? "ES" : "EN"}
              </button>
              <div className="w-px h-4 bg-[hsl(var(--divider))]" />
              <HamburgerButton open={megaNavOpen} onClick={() => setMegaNavOpen(!megaNavOpen)} />
            </div>
          </div>
        </div>
      </header>

      {/* Secondary subnav — category tabs */}
      <div className="fixed top-[52px] z-20 w-full bg-background border-b border-[hsl(var(--divider))] overflow-x-auto scrollbar-none">
        <div className="flex h-[32px] min-w-max">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-center px-4 font-display text-[10px] tracking-[0.15em] whitespace-nowrap transition-colors border-r border-[hsl(var(--divider)/0.5)] ${
                  isActive
                    ? "text-foreground border-b-2 border-b-newsroom"
                    : "text-caption hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="h-[84px]" />
    </>
  );
}
