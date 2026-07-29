import { useEffect, useRef, useState } from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Player } from '@remotion/player'

const PHRASES = [
  'DESIGNED TO CONVERT',
  'BUILT TO PERFORM',
  'MADE TO CONNECT',
  'CRAFTED FOR IMPACT',
  'READY TO GROW',
]
// Generous spacing between complete phrases — no separator dots.
const MARQUEE_TEXT = PHRASES.join('        ') + '        '

// Smooth, continuous depth-of-field built from many small steps (rather than
// a handful of large ones) so the blur/opacity falloff toward the edges
// reads as a gradual gradient, not visible blur "blocks". Centre 60% of the
// strip stays perfectly sharp; the outer edges cap at 3px blur / 0.65
// opacity, both well within the requested maximum.
const MAX_EDGE_BLUR = 3
const MIN_EDGE_OPACITY = 0.65
const SHARP_ZONE_PCT = 30 // half-width (%) of the perfectly sharp centre zone
const STEPS_PER_SIDE = 6

function buildFocusBands() {
  const bands: { from: number; to: number; blur: number; opacity: number }[] = [
    { from: 50 - SHARP_ZONE_PCT, to: 50 + SHARP_ZONE_PCT, blur: 0, opacity: 1 },
  ]
  const edgeSpan = 50 - SHARP_ZONE_PCT
  const stepWidth = edgeSpan / STEPS_PER_SIDE
  for (let i = 0; i < STEPS_PER_SIDE; i++) {
    const innerPct = SHARP_ZONE_PCT + i * stepWidth
    const outerPct = SHARP_ZONE_PCT + (i + 1) * stepWidth
    const t = (i + 0.5) / STEPS_PER_SIDE
    const blur = t * MAX_EDGE_BLUR
    const opacity = 1 - t * (1 - MIN_EDGE_OPACITY)
    bands.push({ from: 50 - outerPct, to: 50 - innerPct, blur, opacity })
    bands.push({ from: 50 + innerPct, to: 50 + outerPct, blur, opacity })
  }
  return bands
}
const FOCUS_BANDS = buildFocusBands()

interface PerspectiveMarqueeSceneProps {
  text: string
  rotateY: number
  rotateX: number
  perspective: number
  pixelsPerFrame: number
  backgroundColor: string
  fadeColor: string
  textColor: string
  fontWeight: number
  fontSize: number
  reduced: boolean
}

// The Remotion "PerspectiveMarquee" composition — driven by
// `useCurrentFrame()`, rendered standalone via `@remotion/player` (no
// Composition/registerRoot wiring needed).
function PerspectiveMarqueeScene({
  text,
  rotateY,
  rotateX,
  perspective,
  pixelsPerFrame,
  backgroundColor,
  fadeColor,
  textColor,
  fontWeight,
  fontSize,
  reduced,
}: PerspectiveMarqueeSceneProps) {
  const frame = useCurrentFrame()
  const measureRef = useRef<HTMLSpanElement>(null)
  const [unitWidth, setUnitWidth] = useState(0)

  useEffect(() => {
    if (measureRef.current) {
      setUnitWidth(measureRef.current.getBoundingClientRect().width)
    }
  }, [text, fontWeight, fontSize])

  // Reduced motion: freeze on a single static, fully-readable frame.
  const distance = reduced ? 0 : frame * pixelsPerFrame
  const x = unitWidth > 0 ? -(distance % unitWidth) : 0

  const textStyle: React.CSSProperties = {
    fontSize,
    fontWeight,
    color: textColor,
    // `pre` (not `nowrap`) so the literal multi-space gaps between phrases
    // in MARQUEE_TEXT render as real gaps instead of collapsing to one space.
    whiteSpace: 'pre',
    letterSpacing: '0.01em',
    fontFamily: "'Poppins', 'Inter', sans-serif",
  }

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: `${perspective}px`,
        }}
      >
        {FOCUS_BANDS.map((band, i) => (
          <div
            key={i}
            aria-hidden={i !== 0}
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(0 ${100 - band.to}% 0 ${band.from}%)`,
              filter: band.blur ? `blur(${band.blur}px)` : undefined,
              opacity: band.opacity,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: 'preserve-3d',
                display: 'flex',
              }}
            >
              <div style={{ display: 'flex', transform: `translateX(${x}px)` }}>
                <span ref={i === 0 ? measureRef : undefined} style={textStyle}>{text}</span>
                <span style={textStyle}>{text}</span>
                <span style={textStyle}>{text}</span>
                <span style={textStyle}>{text}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Soft black edge fades, restrained to the outermost ~14% each side */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to right, ${fadeColor} 0%, transparent 14%, transparent 86%, ${fadeColor} 100%)`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

// Tracks the stage's real rendered pixel size so compositionWidth/Height can
// match it exactly — Remotion Player scales its fixed-resolution composition
// to *fit* whatever box it's given, so unless the composition's aspect ratio
// equals the container's, that produces letterboxing. Feeding the Player the
// container's own live dimensions keeps the fit at a permanent 1:1 (no
// scaling, no letterboxing) at every viewport width and every breakpoint.
function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 1600, height: 220 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        setSize({ width: Math.round(r.width), height: Math.round(r.height) })
      }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

function useMarqueeFontSize(): number {
  const [size, setSize] = useState(64)
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      if (w < 700) setSize(32)
      else if (w < 1024) setSize(48)
      else setSize(64)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])
  return size
}

// Self-contained section: responsive height, prefers-reduced-motion aware,
// renders PerspectiveMarqueeScene through the Remotion Player.
export function PerspectiveMarquee() {
  const reduced = useReducedMotion()
  const [stageRef, stageSize] = useElementSize<HTMLDivElement>()
  const fontSize = useMarqueeFontSize()

  return (
    <div className="rpm-root">
      <style>{`
        .rpm-root { position: relative; width: 100%; overflow: hidden; background: #050505; }
        .rpm-stage { position: relative; width: 100%; height: 130px; overflow: hidden; }
        @media (min-width: 700px) {
          .rpm-stage { height: 170px; }
        }
        @media (min-width: 1024px) {
          .rpm-stage { height: 220px; }
        }
      `}</style>
      <div className="rpm-stage" ref={stageRef}>
        <Player
          component={PerspectiveMarqueeScene}
          inputProps={{
            text: MARQUEE_TEXT,
            rotateY: -18,
            rotateX: 2,
            perspective: 1400,
            pixelsPerFrame: 2,
            backgroundColor: '#050505',
            fadeColor: '#050505',
            textColor: '#fafafa',
            fontWeight: 600,
            fontSize,
            reduced,
          }}
          durationInFrames={240}
          fps={30}
          compositionWidth={stageSize.width}
          compositionHeight={stageSize.height}
          controls={false}
          autoPlay
          loop
          clickToPlay={false}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </div>
  )
}
