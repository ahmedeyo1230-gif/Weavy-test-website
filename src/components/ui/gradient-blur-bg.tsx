import { cn } from "@/lib/utils";

interface GradientBlurBgProps {
  className?: string;
  /** Accent colour for the radial bloom — defaults to cyan */
  accentColor?: string;
  /** Where the radial bloom is anchored, e.g. "100% 200px" */
  accentPosition?: string;
  /** Radius of the radial bloom */
  accentRadius?: string;
  /** Grid line colour */
  gridColor?: string;
  /** Grid cell size, e.g. "96px 64px" */
  gridSize?: string;
}

export function GradientBlurBg({
  className,
  accentColor    = "hsl(199 89% 60% / 0.10)",
  accentPosition = "8% 60%",
  accentRadius   = "640px",
  gridColor      = "hsl(0 0% 100% / 0.028)",
  gridSize       = "80px 56px",
}: GradientBlurBgProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      style={{
        backgroundImage: [
          `linear-gradient(to right, ${gridColor} 1px, transparent 1px)`,
          `linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          `radial-gradient(circle ${accentRadius} at ${accentPosition}, ${accentColor}, transparent)`,
        ].join(", "),
        backgroundSize: `${gridSize}, ${gridSize}, 100% 100%`,
      }}
    />
  );
}
