import Image from "next/image";

interface SectionBannerProps {
  title: string;
  image: string;
  alt?: string;
  kicker?: string;
}

export function SectionBanner({ title, image, alt, kicker }: SectionBannerProps) {
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden border-t-[3px] border-[hsl(var(--accent))]">
      <Image
        src={image}
        alt={alt ?? title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
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
