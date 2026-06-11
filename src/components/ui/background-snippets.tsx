// Copied from demo.tsx — dark radial glow from above, scoped to section.
// bg-neutral-950 removed (section already owns #02080A); h-screen/w-screen
// narrowed to h-full/w-full; pointer-events-none + aria-hidden added.
// z-index: -1 kept so it renders above the section bg but below all content
// (requires the parent section to have z-index: 0 to form a stacking context).
export const Component = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{
        zIndex: -1,
        background:
          'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120,119,198,0.3), rgba(255,255,255,0))',
      }}
    />
  )
}

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
