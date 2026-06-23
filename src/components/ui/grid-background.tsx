import { useEffect, useRef } from "react";
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

/**
 * Animated canvas grain + orange top spotlight + masked dot grid.
 * Matches the dark-noise-effect11 demo. Use on dark sections where
 * you want visible film-grain texture with a warm orange glow at top.
 */
const NoiseCanvas = ({ patternRefreshInterval = 3, patternAlpha = 20 }: { patternRefreshInterval?: number; patternAlpha?: number }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;
    let f = 0, id = 0;
    const S = 1024;
    const resize = () => { c.width = S; c.height = S; c.style.width = "100%"; c.style.height = "100%"; };
    const draw = () => {
      const img = ctx.createImageData(S, S);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = patternAlpha;
      }
      ctx.putImageData(img, 0, 0);
    };
    const loop = () => { if (f % patternRefreshInterval === 0) draw(); f++; id = requestAnimationFrame(loop); };
    window.addEventListener("resize", resize);
    resize();
    loop();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(id); };
  }, [patternRefreshInterval, patternAlpha]);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 w-full h-full" style={{ imageRendering: "pixelated" }} />;
};

export const NoiseCanvasBg = ({ className }: GridBackgroundProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 z-0 pointer-events-none overflow-hidden", className)}
    >
      {/* Orange radial spotlight from top */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(251,146,60,0.20) 0%, transparent 70%)' }} />
      {/* Masked dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(226,232,240,0.6) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage: 'radial-gradient(circle at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 60%, transparent 100%)',
        }}
      />
      {/* Animated film grain */}
      <NoiseCanvas patternAlpha={20} patternRefreshInterval={3} />
    </div>
  );
};

/**
 * Dark faded grid — 40 px slate-toned lines at 20 % opacity.
 * Matches the dark-basic-grid demo. Use on very dark sections (#010709)
 * where a subtle structural depth is needed without adding colour.
 */
export const DarkGridBg = ({ className }: GridBackgroundProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      style={{
        backgroundImage: `
          linear-gradient(to right,  rgba(148,163,184,0.20) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148,163,184,0.20) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
  );
};

