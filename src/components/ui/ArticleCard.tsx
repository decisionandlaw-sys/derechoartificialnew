import { Link } from "react-router-dom";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  href: string;
  featured?: boolean;
}

export function ArticleCard({ title, excerpt, date, category, href, featured = false }: ArticleCardProps) {
  return (
    <article className={`group ${featured ? 'card-elevated p-6 md:p-8' : 'card-elevated p-6'}`}>
      <Link to={href} className="block">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.15em] text-caption font-medium px-2 py-1 border border-divider/30">
            {category}
          </span>
          <span className="text-caption">·</span>
          <time className="text-xs text-caption">{date}</time>
        </div>
        
        <h3 className={`font-display font-bold text-foreground tracking-tight ${
          featured ? 'text-2xl md:text-3xl mb-4' : 'text-xl md:text-2xl mb-3'
        }`}>
          {title}
        </h3>
        
        <p className={`text-body leading-relaxed ${featured ? 'text-base md:text-lg' : 'text-base'}`}>
          {excerpt}
        </p>
        
        <span className="inline-flex items-center mt-4 text-xs text-caption font-medium group-hover:text-foreground transition-colors">
          Leer más 
          <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300 go-icon">→</span>
        </span>
      </Link>
    </article>
  );
}
