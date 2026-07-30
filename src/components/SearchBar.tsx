"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchResult = {
  slug: string;
  title: string;
  category: string;
  date?: string;
  excerpt?: string;
  url: string;
};

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setLoading(true);
      const controller = new AbortController();

      fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || []);
          setOpen(true);
        })
        .catch(() => {
          setResults([]);
          setOpen(true);
        })
        .finally(() => {
          setLoading(false);
        });

      return () => {
        controller.abort();
      };
    }, 200);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const hasResults = results.length > 0;

  const handleNavigate = (result: SearchResult | null) => {
    if (!result) return;
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(result.url);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (results[0]) {
        handleNavigate(results[0]);
      }
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const formattedResults = useMemo(
    () =>
      results.map((result) => {
        const dateLabel =
          result.date && !Number.isNaN(new Date(result.date).getTime())
            ? new Date(result.date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })
            : "";
        return {
          ...result,
          dateLabel,
        };
      }),
    [results],
  );

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-xs", className)}>
      <div className="flex items-center gap-2 rounded-md border border-input bg-background px-2 py-1 text-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-background">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar análisis..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-full max-w-md rounded-md border border-border bg-popover shadow-lg">
          <div className="max-h-80 overflow-auto">
            {loading && (
              <div className="px-4 py-3 text-sm text-muted-foreground">Buscando…</div>
            )}

            {!loading && !hasResults && query.trim().length > 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No se encontraron resultados
              </div>
            )}

            {!loading &&
              formattedResults.map((result) => (
                <button
                  key={`${result.category}-${result.slug}`}
                  type="button"
                  onClick={() => handleNavigate(result)}
                  className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Ver ${result.title} - ${result.category}`}
                >
                  <span className="font-medium text-foreground">{result.title}</span>
                  <span className="text-[11px] uppercase tracking-wide text-caption">
                    {result.category} {result.dateLabel ? `· ${result.dateLabel}` : ""}
                  </span>
                  {result.excerpt && (
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {result.excerpt}
                    </span>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
