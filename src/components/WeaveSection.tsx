import { useEffect, useRef, useState } from 'react';

/**
 * WeaveSection — "connected system map"
 * A restrained, structured premium section: a two-column Platform/Services
 * map with small glowing nodes strung along a vertical signal line per
 * column, and a low-opacity abstract "W" line motif drawn in behind the
 * content. Everything animates once, on first scroll into view.
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
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.22 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const on = active || reduced

  return (
    <section className="wv-root" ref={sectionRef} aria-label="Weavy Automation">
      <style>{CSS}</style>

      {/* Blends into Hero's own fade-out colour above this section */}
      <div className="wv-topfade" aria-hidden="true" />

      {/* Subtle ambient glow behind the centre of the composition */}
      <div className="wv-ambient" aria-hidden="true" />

      {/* Abstract "W" line motif — draws in from both sides, once */}
      <svg
        className={`wv-w${on ? ' wv-w--on' : ''}`}
        viewBox="0 0 1200 420"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="wv-w-path wv-w-path--l" pathLength={1} d="M20,50 L300,380 L600,140" />
        <path className="wv-w-path wv-w-path--r" pathLength={1} d="M1180,50 L900,380 L600,140" />
      </svg>

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
                    style={{ transitionDelay: on && !reduced ? `${0.32 + i * 0.09}s` : '0s' }}
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
                    style={{ transitionDelay: on && !reduced ? `${0.32 + i * 0.09}s` : '0s' }}
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
}

.wv-ambient {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 60% 46% at 50% 40%, rgba(57,198,180,0.055) 0%, rgba(5,20,22,0.02) 46%, transparent 72%);
}

.wv-w {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: min(1100px, 92vw);
  height: 46%;
  pointer-events: none;
  overflow: visible;
}
.wv-w-path {
  fill: none;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1);
  opacity: 0.24;
}
.wv-w-path--l { stroke: #39C6B4; }
.wv-w-path--r { stroke: #E8C97A; }
.wv-w--on .wv-w-path { stroke-dashoffset: 0; }

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
.wv-col-heading.wv-in { opacity: 1; transform: translateY(0); }

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

@media (prefers-reduced-motion: reduce) {
  .wv-w-path, .wv-eyebrow, p.wv-statement, .wv-col-heading, li.wv-item, .wv-spine-fill,
  .wv-closing-line, .wv-closing-node, p.wv-closing {
    transition: none !important;
  }
}
`
