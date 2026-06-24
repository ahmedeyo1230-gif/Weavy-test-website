export function DarkIndigoTopGlow() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120,119,198,0.18), transparent)',
      }}
    />
  )
}

export function DarkGridWithBlueGlow() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right,  hsl(0 0% 100% / 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(0 0% 100% / 0.06) 1px, transparent 1px)
        `,
        backgroundSize: '6rem 4rem',
      }}
    >
      {/* Purple glow — top-right, from background-snippets variant */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle 800px at 100% 200px, rgba(213,197,255,0.13), transparent)',
        }}
      />
      {/* Blue glow — centred top, from demo variant */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle 500px at 50% 200px, rgba(201,235,255,0.10), transparent)',
        }}
      />
    </div>
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
