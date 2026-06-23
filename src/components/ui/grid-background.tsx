import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
}

/**
 * Diagonal 45° repeating-line pattern — dark sections only.
 * Uses the site's cyan accent at ultra-low opacity so it reads as
 * a subtle atmospheric texture without competing with content.
 */
export const DiagonalLinesBg = ({ className }: GridBackgroundProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            45deg,
            rgba(31, 196, 241, 0.055) 0px,
            rgba(31, 196, 241, 0)     1.5px,
            transparent               1.5px,
            transparent               28px
          )
        `,
      }}
    />
  );
};

/** Complex multiplier grid — dark sections only.
 *  Horizontal rules + 45°/−45° cross-hatch in green & magenta,
 *  with a soft green radial accent. Intended as a z-[1] atmospheric layer. */
export const ComplexMultiplierBg = ({ className }: GridBackgroundProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg,   rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px),
          repeating-linear-gradient(45deg,  rgba(0,255,128,0.055)  0, rgba(0,255,128,0.055)  1px, transparent 1px, transparent 20px),
          repeating-linear-gradient(-45deg, rgba(255,0,128,0.06)   0, rgba(255,0,128,0.06)   1px, transparent 1px, transparent 30px),
          repeating-linear-gradient(90deg,  rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 80px),
          radial-gradient(circle at 60% 40%, rgba(0,255,128,0.04) 0%, transparent 60%)
        `,
        backgroundSize: "80px 80px, 40px 40px, 60px 60px, 80px 80px, 100% 100%",
        backgroundPosition: "0 0, 0 0, 0 0, 40px 40px, center",
      }}
    />
  );
};

export const GridBackground = ({ className }: GridBackgroundProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(71,85,105,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(71,85,105,0.06) 1px, transparent 1px),
          radial-gradient(circle at 50% 60%, rgba(236,72,153,0.08) 0%, rgba(168,85,247,0.04) 40%, transparent 70%)
        `,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%",
      }}
    />
  );
};

