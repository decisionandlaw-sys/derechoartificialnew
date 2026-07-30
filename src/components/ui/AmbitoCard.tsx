import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface AmbitoCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export function AmbitoCard({ title, description, icon: Icon, href }: AmbitoCardProps) {
  return (
    <Link to={href} className="group block p-6 bg-card border border-divider hover:border-muted-foreground/30 transition-colors">
      <Icon className="h-6 w-6 text-muted-foreground mb-4" />
      
      <h3 className="font-serif text-xl text-foreground group-hover:text-muted-foreground transition-colors mb-3">
        {title}
      </h3>
      
      <p className="text-sm text-body leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
