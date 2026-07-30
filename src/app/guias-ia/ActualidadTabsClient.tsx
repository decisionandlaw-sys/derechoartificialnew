"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentPreviewGrid, type PreviewItem } from "@/components/ContentPreviewCard";

type TabKey = "todas" | "noticias" | "guias";

type Props = {
  initialTab: TabKey;
  allItems: PreviewItem[];
  noticiasItems: PreviewItem[];
  guiasItems: PreviewItem[];
};

const tabLabels: Record<TabKey, string> = {
  todas: "Todas",
  noticias: "Noticias",
  guias: "Guías y Protocolos",
};

const getPlaceholder = (tab: TabKey) => {
  if (tab === "noticias") return "No hay noticias disponibles por ahora.";
  if (tab === "guias") return "No hay guías disponibles por ahora.";
  return "No hay contenidos disponibles por ahora.";
};

function ActualidadTabsContent({
  initialTab,
  allItems,
  noticiasItems,
  guiasItems,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const onChangeTab = (value: string) => {
    const next = (value || "todas") as TabKey;
    setActiveTab(next);
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (next === "todas") {
      params.delete("tab");
    } else {
      params.set("tab", next);
    }
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl);
  };

  const getItems = () => {
    switch (activeTab) {
      case "noticias":
        return noticiasItems;
      case "guias":
        return guiasItems;
      default:
        return allItems;
    }
  };

  const items = getItems();
  const hasItems = items.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={onChangeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="noticias">Noticias</TabsTrigger>
          <TabsTrigger value="guias">Guías y Protocolos</TabsTrigger>
        </TabsList>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-6 tracking-tight">{tabLabels[activeTab]}</h2>
        {hasItems ? (
          <ContentPreviewGrid items={items} columns={2} size="medium" />
        ) : (
          <div className="rounded-lg border border-divider bg-surface p-8 text-sm text-body">
            {getPlaceholder(activeTab)}
          </div>
        )}
      </Tabs>
    </div>
  );
}

export function ActualidadTabsClient(props: Props) {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Cargando...</div>}>
      <ActualidadTabsContent {...props} />
    </Suspense>
  );
}
