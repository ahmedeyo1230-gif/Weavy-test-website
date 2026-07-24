import { useEffect, useRef, useState } from 'react';

/**
 * WeaveSection — "connected system map"
 * A premium, structured Platform/Services map with a continuously-animated
 * canvas line system behind it: two strands enter from the left and right,
 * draw in to form an abstract "W", then settle into soft organic drift with
 * a travelling signal pulse looping along the path. Content nodes glow in
 * sequence once on entrance, and carry a subtle looping highlight afterwards.
 *
 * All styles are scoped under .wv-root — nothing leaks into the rest of the site.
 */

const PLATFORM_ITEMS = [
  'Voice Receptionists',
  'Voice Agents',
  'Chatbots',
  'Messaging',
  'CRM & Bookings',
  'Analytics',
]

const SERVICES_ITEMS = [
  'Bespoke Websites',
  'Social Media',
  'Paid Advertising',
  'Creative Design',
  'UGC & Reels',
]

// Normalised (0–1) key points tracing an abstract "W" — shared by the canvas
// line system so the DOM content sits visually inside the shape it forms.
const W_POINTS: [number, number][] = [
  [0.0, 0.14],
  [0.25, 0.86],
  [0.5, 0.30],
  [0.75, 0.86],
  [1.0, 0.14],
]

function pathY(xf: number): number {
  for (let i = 0; i < W_POINTS.length - 1; i++) {
    const [x0, y0] = W_POINTS[i]
    const [x1, y1] = W_POINTS[i + 1]
    if (xf >= x0 && xf <= x1) {
      const t = (xf - x0) / (x1 - x0)
      return y0 + (y1 - y0) * t
    }
  }
  return W_POINTS[W_POINTS.length - 1][1]
}

function PlatformIcon({ color }: { color: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="2.3" />
      <circle cx="18" cy="6" r="2.3" />
      <circle cx="12" cy="18" r="2.3" />
      <path d="M7.9 7.4L11 15.8M16.1 7.4L13 15.8M8.4 6h7.2" />
    </svg>
  )
}

function ServicesIcon({ color }: { color: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5" />
    </svg>
  )
}

export default function WeaveSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true) } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Canvas line system: draws in from both sides once active, then holds a
  // soft organic drift with a travelling signal pulse looping along the path.
  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
    const smooth = (t: number) => t * t * (3 - 2 * t)

    let W = 0
    let H = 0
    let rafId = 0
    let visible = false
    let started = 0
    let formed = reduced ? 1 : 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // Two strands per half (left-entering, right-entering), each a slightly
    // jittered variant of the shared W path for a woven, organic feel.
    const STRANDS = W < 640 ? 2 : 3
    const offsets = Array.from({ length: STRANDS }, (_, i) => (i - (STRANDS - 1) / 2) * 0.045)

    const draw = (now: number) => {
      const t = now / 1000
      if (!started) started = now
      if (!reduced) formed = smooth(clamp((now - started) / 1300, 0, 1))

      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'

      const step = 5
      offsets.forEach((off, si) => {
        ctx.beginPath()
        let first = true
        for (let x = 0; x <= W; x += step) {
          const xf = x / W
          // enters from both sides, converging toward the centre as `formed` grows
          const edgeDist = Math.min(xf, 1 - xf)
          if (edgeDist > formed * 0.52) continue
          const drift = Math.sin(t * 0.35 + si * 1.7 + xf * 3.1) * 0.012
          const yf = clamp(pathY(xf) + off + drift, 0.04, 0.96)
          const y = yf * H
          if (first) { ctx.moveTo(x, y); first = false } else { ctx.lineTo(x, y) }
        }
        const hue = lerp(172, 38, si / Math.max(1, STRANDS - 1))
        ctx.strokeStyle = `hsla(${hue},72%,58%,0.16)`
        ctx.lineWidth = 7
        ctx.stroke()
        ctx.strokeStyle = `hsla(${hue},80%,66%,0.34)`
        ctx.lineWidth = 1.3
        ctx.stroke()
      })

      // Travelling signal pulse — loops along the full width once the lines
      // have finished forming; skipped entirely for reduced motion.
      if (!reduced && formed > 0.98) {
        const cycle = 4.6
        const loopT = ((t % cycle) / cycle)
        const xf = loopT
        const yf = clamp(pathY(xf), 0.04, 0.96)
        const x = xf * W
        const y = yf * H
        const fade = Math.sin(loopT * Math.PI) // fades in/out at the ends of each pass
        ctx.beginPath()
        ctx.fillStyle = `hsla(${lerp(172, 38, xf)},95%,80%,${0.85 * fade})`
        ctx.shadowColor = `hsla(${lerp(172, 38, xf)},95%,70%,${0.6 * fade})`
        ctx.shadowBlur = 10
        ctx.arc(x, y, 2.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      ctx.globalCompositeOperation = 'source-over'
      rafId = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          visible = true
          rafId = requestAnimationFrame(draw)
        } else if (!entry.isIntersecting && visible) {
          visible = false
          cancelAnimationFrame(rafId)
        }
      },
      { threshold: 0 }
    )
    observer.observe(section)

    window.addEventListener('resize', resize)
    resize()

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  const on = active || reduced

  return (
    <section className="wv-root" ref={sectionRef} aria-label="Weavy Automation">
      <style>{CSS}</style>

      {/* Blends into Hero's own fade-out colour above this section */}
      <div className="wv-topfade" aria-hidden="true" />

      {/* Subtle ambient glow behind the centre of the composition */}
      <div className="wv-ambient" aria-hidden="true" />

      {/* Animated line system — enters from both sides, forms an abstract "W",
          then holds a soft drift with a travelling signal pulse. */}
      <div className="wv-lines-wrap" aria-hidden="true">
        <canvas className="wv-canvas" ref={canvasRef} />
      </div>

      <div className="wv-content">
        <div className={`wv-eyebrow${on ? ' wv-in' : ''}`}>Weavy Automation</div>
        <p className={`wv-statement${on ? ' wv-in' : ''}`}>
          One connected system, built around your business.
        </p>

        <div className="wv-columns">
          <div className="wv-col">
            <div className={`wv-col-heading${on ? ' wv-in' : ''}`}>
              <PlatformIcon color="#39C6B4" />
              <span>Platform</span>
            </div>
            <div className="wv-list-wrap">
              <div className="wv-spine" aria-hidden="true">
                <div className={`wv-spine-fill wv-spine-fill--platform${on ? ' wv-spine-fill--on' : ''}`} />
              </div>
              <ul className="wv-list">
                {PLATFORM_ITEMS.map((item, i) => (
                  <li
                    key={item}
                    className={`wv-item${on ? ' wv-in' : ''}`}
                    style={{
                      transitionDelay: on && !reduced ? `${0.32 + i * 0.09}s` : '0s',
                      animationDelay: reduced ? '0s' : `${1.7 + i * 0.28}s`,
                    }}
                  >
                    <span className="wv-node wv-node--platform" />
                    <span className="wv-item-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="wv-col">
            <div className={`wv-col-heading${on ? ' wv-in' : ''}`}>
              <ServicesIcon color="#E8C97A" />
              <span>Services</span>
            </div>
            <div className="wv-list-wrap">
              <div className="wv-spine" aria-hidden="true">
                <div className={`wv-spine-fill wv-spine-fill--services${on ? ' wv-spine-fill--on' : ''}`} />
              </div>
              <ul className="wv-list">
                {SERVICES_ITEMS.map((item, i) => (
                  <li
                    key={item}
                    className={`wv-item${on ? ' wv-in' : ''}`}
                    style={{
                      transitionDelay: on && !reduced ? `${0.32 + i * 0.09}s` : '0s',
                      animationDelay: reduced ? '0s' : `${2.4 + i * 0.28}s`,
                    }}
                  >
                    <span className="wv-node wv-node--services" />
                    <span className="wv-item-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="wv-closing-wrap">
          <div className={`wv-closing-line${on ? ' wv-in' : ''}`} aria-hidden="true">
            <span className={`wv-closing-node${on ? ' wv-in' : ''}`} />
          </div>
          <p className={`wv-closing${on ? ' wv-in' : ''}`}>
            Everything your business needs to grow — managed in one place.
          </p>
        </div>
      </div>
    </section>
  )
}

/* Every rule is scoped under .wv-root so nothing affects the rest of the site. */
const CSS = `
.wv-root {
  --wv-bg: #071011;
  --wv-paper: #F2F6F5;
  --wv-teal: #39C6B4;
  --wv-gold: #E8C97A;
  position: relative;
  overflow: hidden;
  background: var(--wv-bg);
  padding: clamp(5.5rem, 10vw, 8.5rem) clamp(1.5rem, 6vw, 4rem) clamp(5rem, 9vw, 8rem);
  font-family: Inter, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.wv-root *, .wv-root *::before, .wv-root *::after { box-sizing: border-box; }
.wv-root p, .wv-root div, .wv-root span, .wv-root li, .wv-root ul { margin: 0; padding: 0; list-style: none; }

.wv-topfade {
  position: absolute; top: 0; left: 0; right: 0; height: 160px;
  background: linear-gradient(to bottom, #010709 0%, transparent 100%);
  pointer-events: none;
  z-index: 1;
}

.wv-ambient {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background: radial-gradient(ellipse 60% 46% at 50% 40%, rgba(57,198,180,0.055) 0%, rgba(5,20,22,0.02) 46%, transparent 72%);
}

.wv-lines-wrap {
  position: absolute;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);
  width: min(1100px, 94vw);
  height: 48%;
  pointer-events: none;
  z-index: 0;
}
.wv-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

div.wv-content {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  text-align: center;
}

div.wv-eyebrow {
  font-size: clamp(0.9rem, 1.3vw, 1rem);
  letter-spacing: 0.34em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--wv-teal);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
div.wv-eyebrow.wv-in { opacity: 0.9; transform: translateY(0); }

p.wv-statement {
  font-weight: 300;
  font-size: clamp(1.55rem, 3.2vw, 2.4rem);
  line-height: 1.24;
  letter-spacing: -0.01em;
  color: var(--wv-paper);
  max-width: 30ch;
  margin: 16px auto 0;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1) 0.08s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.08s;
}
p.wv-statement.wv-in { opacity: 1; transform: translateY(0); }

div.wv-columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: 44px;
  max-width: 640px;
  margin: clamp(3rem, 6vw, 4.5rem) auto 0;
  text-align: left;
}

div.wv-col-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.78rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(242,246,245,0.86);
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.18s;
}
div.wv-col-heading.wv-in { opacity: 1; transform: translateY(0); }

.wv-list-wrap { position: relative; }

.wv-spine {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: 1px;
  background: rgba(242,246,245,0.10);
}
.wv-spine-fill {
  position: absolute;
  top: 0; left: 0; width: 1px; height: 0;
  transition: height 1.05s cubic-bezier(0.16,1,0.3,1) 0.22s;
}
.wv-spine-fill--platform { background: linear-gradient(to bottom, var(--wv-teal), rgba(57,198,180,0.15)); box-shadow: 0 0 10px rgba(57,198,180,0.35); }
.wv-spine-fill--services { background: linear-gradient(to bottom, var(--wv-gold), rgba(232,201,122,0.15)); box-shadow: 0 0 10px rgba(232,201,122,0.30); }
.wv-spine-fill--on { height: 100%; }

ul.wv-list { display: flex; flex-direction: column; gap: 13px; padding-left: 26px; }

li.wv-item {
  display: flex;
  align-items: center;
  gap: 14px;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1);
}
li.wv-item.wv-in { opacity: 1; transform: translateX(0); }

.wv-node {
  position: relative;
  left: -26px;
  flex-shrink: 0;
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(242,246,245,0.28);
  transition: background 0.4s ease, box-shadow 0.4s ease;
}
li.wv-item.wv-in .wv-node--platform { background: var(--wv-teal); box-shadow: 0 0 9px rgba(57,198,180,0.65); }
li.wv-item.wv-in .wv-node--services { background: var(--wv-gold); box-shadow: 0 0 9px rgba(232,201,122,0.55); }

/* Soft, subtle looping illumination — as if the signal pulse passes this
   node once per lap. Runs only after the entrance reveal has had time to
   finish (staggered per-item delay set inline), and is skipped for
   reduced motion. */
li.wv-item.wv-in .wv-node--platform { animation: wv-node-pulse-teal 4.6s ease-in-out infinite; }
li.wv-item.wv-in .wv-node--services { animation: wv-node-pulse-gold 4.6s ease-in-out infinite; }
@keyframes wv-node-pulse-teal {
  0%, 88%, 100% { box-shadow: 0 0 9px rgba(57,198,180,0.65); }
  94%           { box-shadow: 0 0 15px rgba(57,198,180,0.95); }
}
@keyframes wv-node-pulse-gold {
  0%, 88%, 100% { box-shadow: 0 0 9px rgba(232,201,122,0.55); }
  94%           { box-shadow: 0 0 15px rgba(232,201,122,0.85); }
}

span.wv-item-text {
  margin-left: -20px;
  font-size: clamp(0.97rem, 1.5vw, 1.08rem);
  font-weight: 400;
  color: rgba(242,246,245,0.80);
}

div.wv-closing-wrap {
  margin-top: clamp(3rem, 6vw, 4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.wv-closing-line {
  width: 1px;
  height: 34px;
  background: linear-gradient(to bottom, rgba(242,246,245,0.02), rgba(242,246,245,0.30));
  position: relative;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.85s;
}
.wv-closing-line.wv-in { transform: scaleY(1); }
.wv-closing-node {
  position: absolute; bottom: -3px; left: 50%; transform: translateX(-50%) scale(0);
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--wv-paper);
  box-shadow: 0 0 10px rgba(242,246,245,0.5);
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1) 1.3s;
}
.wv-closing-node.wv-in { transform: translateX(-50%) scale(1); }

p.wv-closing {
  margin-top: 18px;
  font-weight: 500;
  font-size: clamp(1.2rem, 2.1vw, 1.55rem);
  line-height: 1.5;
  letter-spacing: -0.005em;
  color: var(--wv-paper);
  max-width: 26ch;
  text-align: center;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1) 1.4s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 1.4s;
}
p.wv-closing.wv-in { opacity: 1; transform: translateY(0); }

@media (min-width: 700px) {
  div.wv-columns { grid-template-columns: 1fr 1fr; gap: 72px; max-width: 100%; }
}

@media (max-width: 640px) {
  .wv-lines-wrap { width: 100vw; height: 40%; opacity: 0.7; }
}

@media (prefers-reduced-motion: reduce) {
  li.wv-item.wv-in .wv-node--platform, li.wv-item.wv-in .wv-node--services { animation: none; }
  .wv-eyebrow, p.wv-statement, div.wv-col-heading, li.wv-item, .wv-spine-fill,
  .wv-closing-line, .wv-closing-node, p.wv-closing {
    transition: none !important;
  }
}
`
