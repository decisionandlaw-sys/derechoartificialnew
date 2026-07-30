"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X, Linkedin, Twitter, Facebook } from "lucide-react";

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

function LogoMark() {
  return (
    <div className="w-7 h-7 bg-foreground text-background flex items-center justify-center font-display font-black text-[11px] leading-none tracking-tight">
      DA
    </div>
  );
}

function SearchBarCompact({ onActivate }: { onActivate?: () => void }) {
  return (
    <button
      type="button"
      onClick={onActivate}
      className="flex items-center gap-2 text-xs text-caption hover:text-foreground transition-colors"
      aria-label="Buscar"
    >
      <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
      <span className="hidden sm:inline">Buscar</span>
    </button>
  );
}

function LanguageToggle({ isEnglish, onToggle }: { isEnglish: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-xs font-medium uppercase tracking-wider text-caption hover:text-foreground transition-colors"
    >
      {isEnglish ? "ES" : "EN"}
    </button>
  );
}

function HamburgerButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-5 text-foreground/70 hover:text-foreground transition-colors"
      aria-label={open ? "Cerrar menú" : "Abrir menú"}
    >
      {open ? (
        <X className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="block">
          <rect x="2" y="4.5" width="16" height="1.2" rx="0.6" fill="currentColor" />
          <rect x="2" y="9.5" width="16" height="1.2" rx="0.6" fill="currentColor" />
          <rect x="2" y="14.5" width="16" height="1.2" rx="0.6" fill="currentColor" />
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
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(6,6,6,0.5)]"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[min(400px,100%)] bg-[#E3E3E3] text-[#060606] transition-transform duration-300 ease-[cubic-bezier(.39,.575,.565,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-[#060606] hover:opacity-70 transition-opacity"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <nav className="mt-12 flex flex-col gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`text-xl md:text-2xl font-bold font-display tracking-tight transition-opacity hover:opacity-60 ${
                  pathname === item.href ? "opacity-100" : "opacity-80"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="border-t border-[#060606]/20 pt-6 mb-6">
              <Link
                href={isEnglish ? "/en/about-us" : "/quienes-somos"}
                onClick={onClose}
                className="block text-sm text-[#060606]/70 hover:text-[#060606] transition-colors mb-3"
              >
                {isEnglish ? "About Us" : "Quiénes somos"}
              </Link>
              <Link
                href={isEnglish ? "/en/contact" : "/contacto"}
                onClick={onClose}
                className="block text-sm text-[#060606]/70 hover:text-[#060606] transition-colors mb-6"
              >
                {isEnglish ? "Contact" : "Contacto"}
              </Link>
              <Link
                href={getAlternateRoute()}
                onClick={onClose}
                className="text-sm font-medium text-[#060606] hover:opacity-70 transition-opacity"
              >
                {isEnglish ? "Versión en español" : "English version"} →
              </Link>
            </div>
            <div className="flex items-center gap-5">
              <a href="https://x.com/DArtificia59954" target="_blank" rel="noreferrer" className="text-[#060606]/60 hover:text-[#060606] transition-colors" aria-label="X">
                <Twitter className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a href="https://www.linkedin.com/in/derecho-artificial/" target="_blank" rel="noreferrer" className="text-[#060606]/60 hover:text-[#060606] transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61587246221582" target="_blank" rel="noreferrer" className="text-[#060606]/60 hover:text-[#060606] transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" strokeWidth={1.5} />
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
  const [scrolled, setScrolled] = useState(false);

  const isEnglish = pathname.startsWith("/en");
  const navigation = isEnglish ? navigationEN : navigationES;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      <header
        className={`fixed top-0 z-30 w-full h-[50px] transition-all duration-300 ${
          scrolled ? "bg-background/98" : "bg-background"
        }`}
      >
        <div className="container-wide h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <Link href={isEnglish ? "/en" : "/"} className="flex items-center gap-3 group">
                <LogoMark />
                <span className="w-px h-4 bg-foreground/20" />
                <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/70 hidden sm:block">
                  Derecho Artificial
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <SearchBarCompact />
              <LanguageToggle isEnglish={isEnglish} onToggle={handleLangToggle} />
              <span className="w-px h-3 bg-divider" />
              <HamburgerButton open={megaNavOpen} onClick={() => setMegaNavOpen(!megaNavOpen)} />
            </div>
          </div>
        </div>
      </header>

      <div className="fixed top-[50px] z-20 w-full h-[30px] bg-background border-b border-divider/50 overflow-x-auto scrollbar-none">
        <div className="flex h-full min-w-max">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-center px-4 text-[11px] font-medium uppercase tracking-[0.1em] whitespace-nowrap transition-colors border-r border-divider/30 ${
                  isActive
                    ? "text-foreground bg-foreground/5"
                    : "text-caption hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="h-[80px]" />
    </>
  );
}
