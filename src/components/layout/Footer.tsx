"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Linkedin, Twitter, Facebook } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname() ?? "/";
  const isEnglish = pathname.startsWith("/en");

  return (
    <footer className="border-t-[3px] border-[hsl(var(--accent))]">
      <div className="container-wide py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Link href={isEnglish ? "/en" : "/"} className="inline-block group">
              <span className="font-display text-base font-black uppercase tracking-wide text-foreground">
                Derecho Artificial
              </span>
            </Link>
            <p className="mt-3 text-xs text-body leading-relaxed max-w-xs">
              {isEnglish
                ? "Independent critical analysis of the intersection of Law, Ethics and Artificial Intelligence."
                : "Análisis crítico e independiente sobre la intersección del Derecho, la Ética y la Inteligencia Artificial para el mundo hispanohablante."}
            </p>
            <div className="mt-5 pt-4 border-t border-divider/20">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-caption mb-1">
                {isEnglish ? "Editorial Direction" : "Dirección Editorial"}
              </p>
              <p className="text-xs font-medium text-foreground">R.S.C.</p>
              <p className="text-[10px] text-caption">UEM · UNED · IE Business School</p>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--accent))] mb-4">
              {isEnglish ? "Navigation" : "Navegación"}
            </h4>
            <nav className="grid grid-cols-1 gap-y-2">
              {isEnglish ? (
                <>
                  <Link href="/firma-scarpa" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">Scarpa Firm</Link>
                  <Link href="/normativa" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">AI Regulation</Link>
                  <Link href="/jurisprudencia" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">AI Jurisprudence</Link>
                  <Link href="/en/ai-news" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">AI News</Link>
                  <Link href="/propiedad-intelectual-ia" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">AI Intellectual Property</Link>
                  <Link href="/etica-ia" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">AI Ethics</Link>
                  <Link href="/global-ia" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">Global AI</Link>
                  <Link href="/en/legal-ai-glossary" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">Legal AI Glossary</Link>
                </>
              ) : (
                <>
                  <Link href="/firma-scarpa" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">Firma Scarpa</Link>
                  <Link href="/normativa" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">Normativa IA</Link>
                  <Link href="/jurisprudencia" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">Jurisprudencia IA</Link>
                  <Link href="/guias-ia" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">Guías IA</Link>
                  <Link href="/propiedad-intelectual-ia" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">Propiedad Intelectual IA</Link>
                  <Link href="/etica-ia" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">Ética IA</Link>
                  <Link href="/global-ia" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">IA Global</Link>
                  <Link href="/glosario-ia-legal" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors py-1">Glosario IA legal</Link>
                </>
              )}
            </nav>
            <div className="mt-3 flex gap-3">
              <Link href="/quienes-somos" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors">
                {isEnglish ? "About Us" : "Quiénes somos"}
              </Link>
              <Link href="/contacto" className="text-xs font-semibold uppercase tracking-[0.08em] text-body hover:text-[hsl(var(--accent))] transition-colors">
                {isEnglish ? "Contact" : "Contacto"}
              </Link>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--accent))] mb-4">
              Legal
            </h4>
            <nav className="flex flex-col gap-y-2 mb-6">
              <Link href="/aviso-legal" className="text-xs text-caption hover:text-foreground transition-colors py-1">
                {isEnglish ? "Legal Notice" : "Aviso Legal"}
              </Link>
              <Link href="/politica-de-privacidad" className="text-xs text-caption hover:text-foreground transition-colors py-1">
                {isEnglish ? "Privacy Policy" : "Política de Privacidad"}
              </Link>
              <Link href="/cookies" className="text-xs text-caption hover:text-foreground transition-colors py-1">
                Cookies
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <a href="https://x.com/DArtificia59954" target="_blank" rel="noreferrer" aria-label={isEnglish ? "X profile" : "Perfil en X"} className="inline-flex h-8 w-8 items-center justify-center border border-divider/30 text-caption hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))] transition-colors">
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61587246221582" target="_blank" rel="noreferrer" aria-label={isEnglish ? "Facebook page" : "Página en Facebook"} className="inline-flex h-8 w-8 items-center justify-center border border-divider/30 text-caption hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))] transition-colors">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a href="https://www.linkedin.com/in/derecho-artificial/" target="_blank" rel="noreferrer" aria-label={isEnglish ? "LinkedIn profile" : "Perfil en LinkedIn"} className="inline-flex h-8 w-8 items-center justify-center border border-divider/30 text-caption hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))] transition-colors">
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-divider/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-[10px] text-caption">
          <span>© {currentYear} Derecho Artificial. {isEnglish ? "All rights reserved." : "Todos los derechos reservados."}</span>
          <span>{isEnglish ? "An independent editorial project" : "Un proyecto editorial independiente"}</span>
        </div>
      </div>
    </footer>
  );
}
