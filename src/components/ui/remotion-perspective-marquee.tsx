import { useEffect, useRef, useState } from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Player } from '@remotion/player'

const MARQUEE_TEXT =
  'BUILT TO PERFORM • DESIGNED TO CONVERT • FASTER RESPONSE • MORE ENQUIRIES • LESS MANUAL WORK • '

// Depth-of-field bands: sharp centre, progressively blurred and faded toward
// both outer edges. Each band renders the same 3D-transformed text, clipped
// to its own horizontal slice — a pure-CSS way to fake a focus falloff since
// a CSS `perspective` transform alone foreshortens but doesn't blur.
const FOCUS_BANDS = [
  { from: 0,   to: 12,  blur: 12, opacity: 0.06 },
  { from: 12,  to: 26,  blur: 7,  opacity: 0.22 },
  { from: 26,  to: 38,  blur: 3,  opacity: 0.55 },
  { from: 38,  to: 62,  blur: 0,  opacity: 1 },
  { from: 62,  to: 74,  blur: 3,  opacity: 0.55 },
  { from: 74,  to: 88,  blur: 7,  opacity: 0.22 },
  { from: 88,  to: 100, blur: 12, opacity: 0.06 },
]

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
  reduced: boolean
}

// The supplied Remotion "PerspectiveMarquee" composition — a Remotion
// component driven by `useCurrentFrame()`, rendered standalone via
// `@remotion/player` (no Composition/registerRoot wiring needed).
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
  reduced,
}: PerspectiveMarqueeSceneProps) {
  const frame = useCurrentFrame()
  const measureRef = useRef<HTMLSpanElement>(null)
  const [unitWidth, setUnitWidth] = useState(0)

  useEffect(() => {
    if (measureRef.current) {
      setUnitWidth(measureRef.current.getBoundingClientRect().width)
    }
  }, [text, fontWeight])

  // Reduced motion: freeze on a single static, fully-readable frame.
  const distance = reduced ? 0 : frame * pixelsPerFrame
  const x = unitWidth > 0 ? -(distance % unitWidth) : 0

  const textStyle: React.CSSProperties = {
    fontSize: 128,
    fontWeight,
    color: textColor,
    whiteSpace: 'nowrap',
    letterSpacing: '0.01em',
    paddingRight: 72,
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
            aria-hidden={i !== 3}
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

      {/* Soft black edge fades */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to right, ${fadeColor} 0%, transparent 20%, transparent 80%, ${fadeColor} 100%)`,
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

// Self-contained section: responsive height, prefers-reduced-motion aware,
// renders PerspectiveMarqueeScene through the Remotion Player.
export function PerspectiveMarquee() {
  const reduced = useReducedMotion()

  return (
    <div className="rpm-root">
      <style>{`
        .rpm-root { position: relative; width: 100%; overflow: hidden; background: #050505; }
        .rpm-stage { position: relative; width: 100%; height: 360px; }
        @media (min-width: 700px) {
          .rpm-stage { height: 520px; }
        }
        @media (min-width: 1024px) {
          .rpm-stage { height: 680px; }
        }
        .rpm-stage > div { border: none !important; }
      `}</style>
      <div className="rpm-stage">
        <Player
          component={PerspectiveMarqueeScene}
          inputProps={{
            text: MARQUEE_TEXT,
            rotateY: -28,
            rotateX: 8,
            perspective: 1200,
            pixelsPerFrame: 2,
            backgroundColor: '#050505',
            fadeColor: '#050505',
            textColor: '#fafafa',
            fontWeight: 700,
            reduced,
          }}
          durationInFrames={240}
          fps={30}
          compositionWidth={1280}
          compositionHeight={720}
          controls={false}
          autoPlay
          loop
          clickToPlay={false}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}
