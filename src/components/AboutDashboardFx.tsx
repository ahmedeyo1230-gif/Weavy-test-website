import { useEffect, useRef } from 'react'

// Animated light layer for the About WEAVY dashboard illustration.
//
// The illustration (dashboard1-transparent.webp, 1400×772) is a single
// flattened image — its cards, chat bubbles and characters are not separate
// layers. Nothing in the artwork moves; this SVG adds precisely aligned
// light (outlines, rings, a travelling trail, a sheen) on top of it, in the
// image's own coordinate space so it scales exactly with the picture.
// Geometry was measured from the asset's pixels. Paths deliberately stop
// short of both characters (the seated woman covers the scheduler's lower
// right edge; the standing man covers the sidebar's lower left).
//
// One 9s cycle, all CSS keyframes on a shared clock — each element only sets
// its start (--d, seconds) and which keyframe it uses:
//   0–1.5s   dashboard activates — frame trail, rim, active nav item
//   1.5–3s   analytics — metric cards and their icons, in sequence
//   3–4.5s   chat — panel, messages in order, typing indicator
//   4.5–6.5s workflow — light travels chat → preview → scheduler
//   6.5–8s   completion — scheduled day and "Scheduled" badge
//   8–9s     everything settles back to the untouched illustration
//
// Runs only while the illustration is on screen and the tab is visible;
// hidden entirely under prefers-reduced-motion (the static artwork remains).

type Box = [x: number, y: number, w: number, h: number, r: number]

const CARDS: Box[] = [[392, 173, 174, 87, 12], [581, 173, 174, 87, 12], [770, 173, 174, 87, 12], [958, 173, 174, 87, 12]]
const CARD_ICONS: [number, number][] = [[423, 215], [613, 215], [801, 215], [989, 215]]
const CHAT: Box = [392, 281, 173, 380, 14]
const BUBBLES: Box[] = [[432, 371, 120, 50, 10], [432, 440, 120, 34, 10], [432, 494, 120, 51, 10]]
const TYPING: Box = [432, 563, 35, 22, 11]
const TYPING_DOTS: [number, number][] = [[440.5, 573.5], [449, 573.5], [457.5, 573.5]]
const PREVIEW: Box = [578, 281, 323, 379, 14]
const PREVIEW_HERO: Box = [583, 315, 314, 190, 8]
const HOME: Box = [297, 187, 53, 40, 9]
const DAY_24: [number, number, number] = [1054, 392, 13]
const BADGE: Box = [1066, 444, 52, 16, 8]
// Navy frame band: along the top, round the corner, down the right side —
// stopping above the seated woman.
const FRAME_PATH = 'M 290 90 L 1141 90 Q 1161 90 1161 110 L 1161 480'
// Through the white gap between the metric cards and the panels.
const LINK_PATH = 'M 478 281 L 478 271 L 1022 271 L 1022 281'
// Scheduler outline, open where the woman's laptop and legs overlap it.
const SCHED_PATH = 'M 1060 661 L 929 661 Q 915 661 915 647 L 915 295 Q 915 281 929 281 L 1116 281 Q 1130 281 1130 295 L 1130 480'

const T = {
  rim: 0.1, frame: 0.15, home: 0.5,
  cards: [1.5, 1.8, 2.1, 2.4], icons: [1.6, 1.9, 2.2, 2.5],
  chat: 3.0, bubbles: [3.2, 3.55, 3.9], dots: [4.15, 4.3, 4.45],
  link: 4.6, preview: 4.85, sheen: 4.95, sched: 5.5,
  day: 6.45, badge: 6.8,
}

const d = (s: number) => ({ ['--d' as string]: `${s}s` }) as React.CSSProperties
const rect = ([x, y, w, h, r]: Box) => ({ x, y, width: w, height: h, rx: r })

/** Highlight for a card/panel: soft tint + wide glow + crisp outline. */
function Glow({ box, at, kind = 'hl' }: { box: Box; at: number; kind?: 'hl' | 'hl-long' }) {
  return (
    <g className={`afx-${kind}`} style={d(at)}>
      <rect {...rect(box)} className="afx-tint" />
      <rect {...rect(box)} className="afx-glow" />
      <rect {...rect(box)} className="afx-line" />
    </g>
  )
}

export default function AboutDashboardFx() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const io = new IntersectionObserver(([e]) => svg.classList.toggle('is-live', e.isIntersecting), { threshold: 0.15 })
    io.observe(svg)
    const onVis = () => svg.classList.toggle('tab-hidden', document.hidden)
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis) }
  }, [])

  return (
    <svg ref={ref} className="about-fx" viewBox="0 0 1400 772" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="afx-grad" gradientUnits="userSpaceOnUse" x1="380" y1="0" x2="1170" y2="0">
          <stop offset="0" stopColor="#38BDF8" />
          <stop offset="0.55" stopColor="#7C8CFF" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="afx-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7DDCFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#E0F7FF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7DDCFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="afx-hero-clip"><rect {...rect(PREVIEW_HERO)} /></clipPath>
      </defs>

      {/* 1 · Activation */}
      <path d={FRAME_PATH} className="afx-rim" style={d(T.rim)} />
      <g className="afx-trail" style={d(T.frame)}>
        <path d={FRAME_PATH} pathLength={1000} className="afx-trail-glow" />
        <path d={FRAME_PATH} pathLength={1000} className="afx-trail-core" />
      </g>
      <rect {...rect(HOME)} className="afx-ring afx-ring--rect" style={d(T.home)} />

      {/* 2 · Analytics */}
      {CARDS.map((b, i) => <Glow key={`c${i}`} box={b} at={T.cards[i]} />)}
      {CARD_ICONS.map(([cx, cy], i) => <circle key={`i${i}`} cx={cx} cy={cy} r={17} className="afx-ring" style={d(T.icons[i])} />)}

      {/* 3 · Chat & automation */}
      <Glow box={CHAT} at={T.chat} kind="hl-long" />
      {BUBBLES.map((b, i) => <Glow key={`b${i}`} box={b} at={T.bubbles[i]} />)}
      <rect {...rect(TYPING)} className="afx-ring afx-ring--rect" style={d(T.dots[0])} />
      {TYPING_DOTS.map(([cx, cy], i) => <circle key={`t${i}`} cx={cx} cy={cy} r={4.2} className="afx-dot" style={d(T.dots[i])} />)}

      {/* 4 · Connected workflow */}
      <g className="afx-link" style={d(T.link)}>
        <path d={LINK_PATH} pathLength={1000} className="afx-trail-glow" />
        <path d={LINK_PATH} pathLength={1000} className="afx-trail-core" />
      </g>
      <Glow box={PREVIEW} at={T.preview} />
      <g clipPath="url(#afx-hero-clip)">
        <rect x={PREVIEW_HERO[0] - 120} y={PREVIEW_HERO[1] - 20} width={110} height={PREVIEW_HERO[3] + 40}
          fill="url(#afx-sheen)" className="afx-sheen" style={d(T.sheen)} />
      </g>
      <g className="afx-draw" style={d(T.sched)}>
        <path d={SCHED_PATH} pathLength={1000} className="afx-glow" />
        <path d={SCHED_PATH} pathLength={1000} className="afx-line" />
      </g>

      {/* 5 · Completion */}
      <circle cx={DAY_24[0]} cy={DAY_24[1]} r={DAY_24[2] + 3} className="afx-done-ring" style={d(T.day)} />
      <circle cx={DAY_24[0]} cy={DAY_24[1]} r={DAY_24[2]} className="afx-ring afx-ring--done" style={d(T.day + 0.15)} />
      <rect {...rect(BADGE)} className="afx-done-ring" style={d(T.badge)} />
    </svg>
  )
}
