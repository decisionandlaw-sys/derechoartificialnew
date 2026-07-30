"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timer: number | null = null;

    const showBanner = () => {
      setShouldRender(true);
      timer = window.setTimeout(() => setIsVisible(true), 2000);
    };

    try {
      const raw = window.localStorage.getItem("da_cookie_consent");
      if (!raw) {
        showBanner();
      } else {
        try {
          const parsed = JSON.parse(raw) as { expiry?: string } | null;
          if (parsed && parsed.expiry) {
            const expiry = new Date(parsed.expiry);
            if (Number.isNaN(expiry.getTime()) || new Date() > expiry) {
              window.localStorage.removeItem("da_cookie_consent");
              showBanner();
            }
          } else {
            showBanner();
          }
        } catch {
          showBanner();
        }
      }
    } catch {
      showBanner();
    }

    return () => {
      if (timer != null) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const saveConsent = (type: "all" | "essential") => {
    setIsVisible(false);

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 365);

    const consentData = {
      value: type,
      timestamp: new Date().toISOString(),
      expiry: expiry.toISOString(),
    };

    try {
      window.localStorage.setItem("da_cookie_consent", JSON.stringify(consentData));
    } catch {
      void 0;
    }

    window.setTimeout(() => setShouldRender(false), 500);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[99] transition-all duration-700 ease-in-out transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0",
      )}
    >
      <div className="bg-[hsl(var(--card))] text-foreground p-6 border border-divider/30">
        <h3 className="font-display font-bold text-lg mb-3">Privacidad y Transparencia</h3>

        <p className="text-body text-sm leading-relaxed mb-4">
          En Derecho Artificial utilizamos cookies propias y de terceros para analizar nuestros servicios y mostrarle
          publicidad relacionada con sus preferencias mediante el análisis de sus hábitos de navegación.
          <br />
          <Link
            href="/cookies"
            className="text-foreground underline underline-offset-2 hover:text-foreground/70 transition-colors mt-1 inline-block"
          >
            Leer Política de Cookies
          </Link>
        </p>

        <div className="flex flex-col space-y-3">
          <div className="flex gap-3">
            <Button
              onClick={() => saveConsent("all")}
              className="flex-1 bg-foreground text-background hover:opacity-80 font-medium"
            >
              Aceptar todas
            </Button>
            <Button
              onClick={() => saveConsent("essential")}
              variant="outline"
              className="flex-1 border-divider/50 text-caption hover:border-foreground/50 hover:text-foreground"
            >
              Rechazar opcionales
            </Button>
          </div>

          <div className="text-center">
            <Link href="/cookies" className="text-xs text-caption hover:text-foreground transition-colors">
              Configurar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
