import Image from "next/image";
import { HM_BADGE_SRC } from "@/components/ui/WatermarkedImage";

interface SectionImageStyle {
  objectPosition?: string;
  gradientClassName?: string;
}

const SECTION_IMAGE_STYLES: Record<string, SectionImageStyle> = {
  "/images/sections/normativa-ia.png": { objectPosition: "28% 55%" },
  "/images/sections/jurisprudencia-ia.png": {
    objectPosition: "50% 52%",
    gradientClassName:
      "bg-gradient-to-t from-black/95 via-black/60 via-[58%] to-transparent",
  },
  "/images/sections/firma-scarpa.png": { objectPosition: "62% 68%" },
  "/images/sections/etica-ia.png": { objectPosition: "35% 50%" },
  "/images/sections/propiedad-intelectual-ia.png": {
    objectPosition: "55% 58%",
  },
  "/images/sections/ia-global.png": { objectPosition: "60% 58%" },
  "/images/sections/actualidad-ia.png": { objectPosition: "60% 58%" },
};

interface SectionBannerProps {
  title: string;
  image: string;
  alt?: string;
  kicker?: string;
}

export function SectionBanner({ title, image, alt, kicker }: SectionBannerProps) {
  const imageStyle = SECTION_IMAGE_STYLES[image];
  const gradientClassName =
    imageStyle?.gradientClassName ??
    "bg-gradient-to-t from-black/85 via-black/25 to-transparent";
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden border-t-[3px] border-[hsl(var(--accent))]">
      <Image
        src={image}
        alt={alt ?? title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={imageStyle?.objectPosition ? { objectPosition: imageStyle.objectPosition } : undefined}
      />
      <img
        src={HM_BADGE_SRC}
        alt=""
        aria-hidden="true"
        className="hm-badge"
        loading="lazy"
        decoding="async"
      />
      <div className={`absolute inset-0 ${gradientClassName}`} />
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-10 md:pb-14">
          {kicker && (
            <p className="mb-4 text-[11px] font-display tracking-[0.25em] text-[hsl(var(--accent))]">
              {kicker}
            </p>
          )}
          <h1 className="font-display font-black text-[clamp(2.5rem,6vw,5.5rem)] text-foreground leading-[0.9] tracking-[-0.03em]">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
