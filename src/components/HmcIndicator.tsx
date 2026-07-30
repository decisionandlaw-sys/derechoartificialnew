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
        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 border border-border bg-muted/30 flex items-center justify-center p-1.5">
          <Image
            src="/images/hmc-human-led-machine-oversight.svg"
            alt={config.title}
            width={44}
            height={50}
            className="w-full h-full"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {config.badge}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            {config.description}
          </p>
          <a
            href="https://www.digitaldubai.ae/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-muted-foreground/60 hover:text-primary transition-colors underline underline-offset-2"
          >
            DFF HMC Classification System
          </a>
        </div>
      </div>
    </aside>
  );
}
