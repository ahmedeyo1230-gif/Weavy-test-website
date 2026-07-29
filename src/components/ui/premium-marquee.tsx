import { useEffect, useRef, useState } from 'react'

const WORDS = ['PERFORM', 'CONVERT', 'RESPOND', 'ATTRACT', 'AUTOMATE']
const SPEED_PX_PER_SEC = 45
const MAX_BLUR_PX = 4
const MIN_OPACITY = 0.45

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

// Smoothstep: eases in/out with zero slope at both ends, so the focus
// effect never has a sudden change as a word enters or leaves the centre.
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

// One "group" = every word with a uniform trailing gap (including after the
// last word), so consecutive groups butt together with identical spacing —
// no separator glyph, just clean horizontal space.
function Group({
  measureRef,
  registerWordRef,
  groupIndex,
  trailingGap = true,
}: {
  measureRef?: React.Ref<HTMLSpanElement>
  registerWordRef?: (groupIndex: number, wordIndex: number) => (el: HTMLSpanElement | null) => void
  groupIndex: number
  trailingGap?: boolean
}) {
  return (
    <span ref={measureRef} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      {WORDS.map((word, i) => (
        <span
          key={word}
          ref={registerWordRef?.(groupIndex, i)}
          className="pmq-word"
          style={!trailingGap && i === WORDS.length - 1 ? { marginRight: 0 } : undefined}
        >
          {word}
        </span>
      ))}
    </span>
  )
}

// Genuine continuous marquee: the whole track (N duplicated groups) is moved
// by exactly one measured group-width per loop via a single CSS animation —
// no per-word position animation, no perspective. Duration is derived from
// the measured width so the perceived speed (~45px/s) stays constant
// regardless of viewport size or font-size changes. Layered on top, a
// requestAnimationFrame loop reads each word's live distance from the
// viewport centre and mutates its blur/opacity directly via the DOM ref —
// never through React state — so the per-frame focus effect causes zero
// re-renders.
export function PremiumMarquee() {
  const reduced = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLSpanElement>(null)
  const wordRefs = useRef<Map<string, HTMLSpanElement>>(new Map())
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

  const registerWordRef = (groupIndex: number, wordIndex: number) => (el: HTMLSpanElement | null) => {
    const key = `${groupIndex}-${wordIndex}`
    if (el) wordRefs.current.set(key, el)
    else wordRefs.current.delete(key)
  }

  // Dynamic centre-focus blur: sharp and fully opaque at the viewport centre,
  // progressively blurred/faded toward the edges. Runs entirely through refs
  // and direct style mutation so it never triggers a React re-render.
  useEffect(() => {
    if (reduced) return
    let rafId: number

    const tick = () => {
      const viewportCenter = window.innerWidth / 2
      const focusRadius = window.innerWidth / 2
      wordRefs.current.forEach(el => {
        const rect = el.getBoundingClientRect()
        const wordCenter = rect.left + rect.width / 2
        const t = Math.min(1, Math.abs(wordCenter - viewportCenter) / focusRadius)
        const eased = smoothstep(t)
        const blur = eased * MAX_BLUR_PX
        const opacity = 1 - eased * (1 - MIN_OPACITY)
        el.style.filter = blur > 0.02 ? `blur(${blur.toFixed(2)}px)` : 'none'
        el.style.opacity = opacity.toFixed(3)
      })
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [reduced])

  return (
    <section
      aria-label="What we do"
      style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#010709' }}
    >
      <style>{`
        .pmq-stage {
          position: relative;
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        @media (min-width: 700px) {
          .pmq-stage { height: 95px; }
        }
        @media (min-width: 1024px) {
          .pmq-stage { height: 110px; }
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

        .pmq-word {
          display: inline-block;
          font-family: 'Poppins', 'Inter', sans-serif;
          font-weight: 500;
          letter-spacing: 0.04em;
          white-space: nowrap;
          color: #F5F2EE;
          text-shadow: 0 0 30px rgba(125,220,255,0.10), 0 0 60px rgba(24,105,125,0.06);
          margin-right: 70px;
          opacity: 1;
          filter: none;
          will-change: filter, opacity;
        }

        .pmq-word { font-size: clamp(18px, 5vw, 22px); }
        @media (min-width: 700px) {
          .pmq-word { font-size: clamp(27px, 3.4vw, 32px); }
        }
        @media (min-width: 1024px) {
          .pmq-word { font-size: clamp(27px, 2.1vw, 32px); }
        }

        /* Outer ~7% edge fade only — the centre text stays fully sharp/opaque */
        .pmq-mask {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%);
        }

        .pmq-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>

      <div className="pmq-stage pmq-mask" ref={stageRef}>
        <span className="pmq-sr-only">Perform, Convert, Respond, Attract, Automate</span>

        {reduced ? (
          <div aria-hidden="true" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Group groupIndex={0} measureRef={groupRef} trailingGap={false} />
          </div>
        ) : (
          <div className="pmq-track pmq-track--animate" aria-hidden="true">
            {Array.from({ length: copies }).map((_, i) => (
              <Group
                key={i}
                groupIndex={i}
                measureRef={i === 0 ? groupRef : undefined}
                registerWordRef={registerWordRef}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
