import Image from "next/image";
import { cn } from "@/lib/utils";
import { HM_BADGE_SRC } from "@/components/ui/WatermarkedImage";

interface PostImageProps {
  src: string;
  alt: string;
  sizes: string;
  aspectClassName?: string;
  priority?: boolean;
  className?: string;
  watermark?: boolean;
}

export function PostImage({
  src,
  alt,
  sizes,
  aspectClassName = "aspect-[16/9]",
  priority = false,
  className = "",
  watermark = true,
}: PostImageProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[hsl(var(--muted))]",
        aspectClassName,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {watermark && (
        <span className="hm-badge" aria-hidden="true">
          <img
            src={HM_BADGE_SRC}
            alt=""
            className="hm-badge-seal"
            loading="lazy"
            decoding="async"
          />
        </span>
      )}
    </div>
  );
}
