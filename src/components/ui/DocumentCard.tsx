import { FileText } from "lucide-react";

interface DocumentCardProps {
  title: string;
  description: string;
  type: string;
  source: string;
  year: string;
}

export function DocumentCard({ title, description, type, source, year }: DocumentCardProps) {
  return (
    <article className="group p-6 bg-card border border-divider hover:border-muted-foreground/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-muted rounded">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider text-caption font-medium">
              {type}
            </span>
            <span className="text-caption">·</span>
            <span className="text-xs text-caption">{year}</span>
          </div>
          
          <h3 className="font-serif text-lg text-foreground group-hover:text-muted-foreground transition-colors mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-body mb-3">
            {description}
          </p>
          
          <span className="text-xs text-caption">
            Fuente: {source}
          </span>
        </div>
      </div>
    </article>
  );
}
