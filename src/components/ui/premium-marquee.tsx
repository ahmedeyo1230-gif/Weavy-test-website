import { useEffect, useRef, useState } from 'react'

const WORDS = ['PERFORM', 'CONVERT', 'RESPOND', 'ATTRACT', 'AUTOMATE']
const SPEED_PX_PER_SEC = 35

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

// One "group" = every word joined by a champagne em-dash, including a
// trailing dash — so consecutive groups read as one continuous
// "…AUTOMATE — PERFORM — CONVERT…" sequence with no seam at the join.
function Group({ measureRef, trailingDash = true }: { measureRef?: React.Ref<HTMLSpanElement>; trailingDash?: boolean }) {
  return (
    <span ref={measureRef} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      {WORDS.map((word, i) => (
        <span key={word} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
          <span className="pmq-word">{word}</span>
          {(i < WORDS.length - 1 || trailingDash) && <span className="pmq-dash">—</span>}
        </span>
      ))}
    </span>
  )
}

// Genuine continuous marquee: the whole track (N duplicated groups) is moved
// by exactly one measured group-width per loop via a single CSS animation —
// no per-word animation, no fading, no perspective. Duration is derived from
// the measured width so the perceived speed (~35px/s) stays constant
// regardless of viewport size or font-size changes.
export function PremiumMarquee() {
  const reduced = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLSpanElement>(null)
  const [groupWidth, setGroupWidth] = useState(900)
  const [stageWidth, setStageWidth] = useState(1440)

  useEffect(() => {
    const stage = stageRef.current
    const group = groupRef.current
    if (!stage || !group) return

    const stageObserver = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width
      if (w) setStageWidth(w)
    })
    const groupObserver = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width
      if (w) setGroupWidth(w)
    })
    stageObserver.observe(stage)
    groupObserver.observe(group)
    return () => {
      stageObserver.disconnect()
      groupObserver.disconnect()
    }
  }, [])

  // Enough duplicated groups to keep the track at least ~2x the visible
  // stage width at all times, so there's always content on screen at every
  // scroll offset — never just "2 copies" regardless of how narrow a single
  // group is relative to the viewport.
  const copies = Math.max(2, Math.ceil((stageWidth * 2) / groupWidth) + 2)
  const durationSeconds = groupWidth / SPEED_PX_PER_SEC

  return (
    <section
      aria-label="What we do"
      style={{ position: 'relative', width: '100%', overflow: 'hidden', background: 'transparent' }}
    >
      <style>{`
        .pmq-stage {
          position: relative;
          width: 100%;
          height: 100px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        @media (min-width: 700px) {
          .pmq-stage { height: 120px; }
        }
        @media (min-width: 1024px) {
          .pmq-stage { height: 140px; }
        }

        .pmq-track {
          display: flex;
          width: max-content;
          white-space: nowrap;
          will-change: transform;
        }
        .pmq-track--animate {
          animation: pmq-scroll ${durationSeconds}s linear infinite;
        }
        @keyframes pmq-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-${groupWidth}px, 0, 0); }
        }

        .pmq-word,
        .pmq-dash {
          font-family: 'Poppins', 'Inter', sans-serif;
          font-weight: 500;
          font-size: clamp(28px, 3.2vw, 52px);
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .pmq-word {
          color: #F5F2EE;
          text-shadow: 0 0 30px rgba(125,220,255,0.10), 0 0 60px rgba(24,105,125,0.06);
        }
        .pmq-dash {
          color: rgba(218,183,106,0.70);
          text-shadow: 0 0 18px rgba(218,183,106,0.22);
          margin: 0 72px;
        }

        /* Outer ~7% edge fade only — the centre text stays fully sharp/opaque */
        .pmq-mask {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%);
        }
      `}</style>

      <div className="pmq-stage pmq-mask" ref={stageRef}>
        {reduced ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Group trailingDash={false} />
          </div>
        ) : (
          <div className="pmq-track pmq-track--animate">
            {Array.from({ length: copies }).map((_, i) => (
              <Group key={i} measureRef={i === 0 ? groupRef : undefined} />
            ))}
          </div>
        )}
        {/* Hidden measurement copy so groupWidth is known even while reduced
            motion is active and the animated track above isn't rendered. */}
        {reduced && (
          <span style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
            <Group measureRef={groupRef} />
          </span>
        )}
      </div>
    </section>
  )
}
