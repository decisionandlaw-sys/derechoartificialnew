import { cn } from "@/lib/utils";

export const HM_BADGE_SRC = "/badges/human-machine-red.webp";

interface WatermarkedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  watermark?: boolean;
}

export function WatermarkedImage({
  watermark = true,
  className,
  src,
  alt,
  ...rest
}: WatermarkedImageProps) {
  if (!watermark) {
    return <img src={src} alt={alt} className={className} {...rest} />;
  }

  return (
    <span className="hm-watermark relative inline-block max-w-full">
      <img src={src} alt={alt} className={cn(className)} {...rest} />
      <span className="hm-badge" aria-hidden="true">
        <img
          src={HM_BADGE_SRC}
          alt=""
          className="hm-badge-seal"
          loading="lazy"
          decoding="async"
        />
      </span>
    </span>
  );
}
