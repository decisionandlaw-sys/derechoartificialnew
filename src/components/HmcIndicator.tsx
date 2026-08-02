import Image from "next/image";

const LABELS = {
  "human-led-machine-oversight": {
    title: "DFF HMC — Human-Led, Machine Oversight",
    description:
      "Contenido liderado por humanos con supervisión, revisión y corrección asistida por inteligencia artificial.",
    badge: "Liderado por humanos · Supervisado por IA",
  },
};

type HmcType = keyof typeof LABELS;

interface HmcIndicatorProps {
  type?: HmcType;
}

export function HmcIndicator({ type = "human-led-machine-oversight" }: HmcIndicatorProps) {
  const config = LABELS[type];

  return (
    <aside className="hmc-indicator mt-16 pt-8 border-t border-border/50">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 p-1 hm-badge-icon">
          <Image
            src="/badges/human-machine-red.webp"
            alt={config.title}
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm md:text-base font-semibold tracking-wider text-foreground uppercase">
            {config.badge}
          </p>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed max-w-lg">
            {config.description}
          </p>
          <a
            href="https://www.digitaldubai.ae/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm md:text-base text-foreground/70 hover:text-primary transition-colors underline underline-offset-2"
          >
            DFF HMC Classification System
          </a>
        </div>
      </div>
    </aside>
  );
}
