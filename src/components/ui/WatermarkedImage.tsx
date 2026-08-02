import { cn } from "@/lib/utils";

export const HM_BADGE_SRC = "/badges/human-machine.webp";

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
      <img
        src={HM_BADGE_SRC}
        alt=""
        aria-hidden="true"
        className="hm-badge"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
