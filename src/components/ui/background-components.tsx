import { cn } from "@/lib/utils";

interface GlowProps {
  className?: string;
}

export const SoftYellowGlow = ({ className }: GlowProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      style={{
        backgroundImage: `radial-gradient(circle at center, #FFF991 0%, transparent 70%)`,
        opacity: 0.045,
        mixBlendMode: "screen",
      }}
    />
  );
};

export function MessengerGlowBackground() {
  return (
    <>
      {/* Soft warm glow — adapted from yellow orb for dark bg */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(255,249,145,0.06) 0%, transparent 70%)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* Cool blue glow top-right — Messenger brand tone */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at top right, rgba(70,130,180,0.18), transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />
    </>
  )
}

export function BackgroundComponent() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right,  hsl(0 0% 100% / 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(0 0% 100% / 0.04) 1px, transparent 1px),
          radial-gradient(circle at 50% 50%, hsl(199 89% 60% / 0.13) 0%, hsl(199 89% 60% / 0.05) 40%, transparent 80%)
        `,
        backgroundSize: '32px 32px, 32px 32px, 100% 100%',
      }}
    />
  )
}
