"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  isSub: boolean;
}

export function ArticleToc() {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const article = document.querySelector(".prose-editorial");
    if (!article) return;

    const headings = article.querySelectorAll("h2, h3");
    const tocItems: TocItem[] = [];
    const seen = new Map<string, number>();

    headings.forEach((h) => {
      const text = h.textContent || "";
      const baseId = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "heading";
      const count = seen.get(baseId) || 0;
      seen.set(baseId, count + 1);
      const id = count > 0 ? `${baseId}-${count}` : baseId;

      if (!h.id) h.id = id;

      tocItems.push({
        id,
        text,
        isSub: h.tagName === "H3",
      });
    });

    setItems(tocItems);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="article-toc">
      <span className="article-toc-label">Sumario</span>
      <nav>
        <ol className="article-toc-list" style={{ counterReset: "toc-counter" }}>
          {items.map((item) => (
            <li key={item.id} className={`article-toc-item${item.isSub ? " article-toc-sub" : ""}`}>
              <a href={`#${item.id}`}>{item.text}</a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
