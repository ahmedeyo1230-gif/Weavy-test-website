import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// ─── Animated grain canvas ────────────────────────────────────────────────────

const NoiseCanvas: React.FC<{
  patternRefreshInterval?: number;
  patternAlpha?: number;
}> = ({ patternRefreshInterval = 2, patternAlpha = 14 }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;

    let f = 0;
    let id = 0;
    const S = 512; // internal canvas resolution — CSS scales it to fill

    const setup = () => {
      c.width = S;
      c.height = S;
    };

    const draw = () => {
      const img = ctx.createImageData(S, S);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = patternAlpha;
      }
      ctx.putImageData(img, 0, 0);
    };

    const loop = () => {
      if (f % patternRefreshInterval === 0) draw();
      f++;
      id = requestAnimationFrame(loop);
    };

    setup();
    loop();

    return () => {
      cancelAnimationFrame(id);
    };
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
};

// ─── Composite section background ────────────────────────────────────────────

interface NoiseSectionBgProps {
  className?: string;
  /** Alpha for the grain canvas (0–255). Default 14 — very subtle on dark. */
  grainAlpha?: number;
}

/**
 * Animated grain + faded grid + cyan radial spotlight.
 * Drop inside any `relative overflow-hidden` section as the first child.
 * Renders at z-0 so all content naturally sits above it.
 */
export function NoiseSectionBg({
  className,
  grainAlpha = 14,
}: NoiseSectionBgProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 z-0 pointer-events-none overflow-hidden",
        className
      )}
    >
      {/* Cyan radial spotlight — anchored at top-centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 680px at 50% -80px, rgba(31,196,241,0.10), transparent 68%)",
        }}
      />

      {/* Faded grid — softly masks toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 85% 55% at 50% 10%, black 68%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 55% at 50% 10%, black 68%, transparent 100%)",
        }}
      />

      {/* Animated grain */}
      <NoiseCanvas patternRefreshInterval={2} patternAlpha={grainAlpha} />
    </div>
  );
}
