import Image from "next/image";
import { cn } from "@/lib/utils";

interface PostImageProps {
  src: string;
  alt: string;
  sizes: string;
  aspectClassName?: string;
  priority?: boolean;
  className?: string;
}

export function PostImage({
  src,
  alt,
  sizes,
  aspectClassName = "aspect-[16/9]",
  priority = false,
  className = "",
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
    </div>
  );
}
