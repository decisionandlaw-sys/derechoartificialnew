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
        <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 border border-border bg-muted/30 flex items-center justify-center p-1.5 rounded-none">
          <Image
            src="/badges/human-machine.webp"
            alt={config.title}
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm md:text-base font-semibold tracking-wider text-muted-foreground uppercase">
            {config.badge}
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
            {config.description}
          </p>
          <a
            href="https://www.digitaldubai.ae/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm md:text-base text-muted-foreground/60 hover:text-primary transition-colors underline underline-offset-2"
          >
            DFF HMC Classification System
          </a>
        </div>
      </div>
    </aside>
  );
}
