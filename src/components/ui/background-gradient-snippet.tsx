export function BackgroundGradientSnippet() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Cyan radial bloom at top-center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_560px_at_50%_200px,#38bdf8,transparent)] opacity-[0.08]" />
      {/* 18px sky-blue grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf820_1px,transparent_1px),linear-gradient(to_bottom,#38bdf820_1px,transparent_1px)] bg-[size:18px_18px]" />
    </div>
  )
}
