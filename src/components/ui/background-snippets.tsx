export function BackgroundSnippet() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 h-full w-full"
      style={{
        backgroundImage: `
          linear-gradient(to right,  hsl(0 0% 100% / 0.035) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(0 0% 100% / 0.035) 1px, transparent 1px)
        `,
        backgroundSize: '6rem 4rem',
      }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 top-0"
        style={{
          background: 'radial-gradient(circle 800px at 100% 200px, hsl(270 70% 65% / 0.12), transparent)',
        }}
      />
    </div>
  )
}

// ─── Video Showcase background ────────────────────────────────────────────────
// Combines background-snippets.tsx (grid) + demo.tsx (dark radial bloom).
// Colors adapted for Weavy always-dark palette: bg-white → transparent,
// #f0f0f0 grid → cyan 5%, #d5c5ff radial → Weavy blue bloom from top.
export const Component = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{
        backgroundImage: [
          'linear-gradient(to right,  rgba(58,179,232,0.05) 1px, transparent 1px)',
          'linear-gradient(to bottom, rgba(58,179,232,0.05) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '6rem 4rem',
      }}
    >
      {/* demo.tsx radial: dark centre → Weavy-blue bloom at edges, origin near top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 125% at 50% 10%, rgba(2,8,10,0) 35%, rgba(37,99,235,0.22) 100%)',
        }}
      />
    </div>
  )
}
