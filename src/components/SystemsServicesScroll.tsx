import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SmoothScroll } from './ui/smooth-scroll'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const BLUE = '#6F8CFF'
const GOLD = '#E9963F'

const SYSTEMS_ITEMS = ['Voice Receptionists', 'Voice Agents', 'Chatbots', 'Messaging', 'CRM & Bookings', 'Analytics']
const SERVICES_ITEMS = ['Bespoke Websites', 'Social Media', 'Paid Advertising', 'Creative Design', 'UGC & Creator Content']

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

function ListPanel({
  heading, items, accent, ambientRgb, reduced, className,
}: {
  heading: string
  items: string[]
  accent: string
  ambientRgb: string
  reduced: boolean
  className: string
}) {
  return (
    <div className={`ssp-panel ${className}`}>
      <div aria-hidden="true" className="ssp-ambient" style={{
        background: `radial-gradient(circle at 50% 42%, ${ambientRgb} 0%, transparent 68%)`,
      }} />
      <div aria-hidden="true" className="ssp-dots" />

      <div className="ssp-inner">
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: E }}
          className="ssp-heading"
          style={{ color: accent }}
        >
          {heading}
        </motion.h2>

        <ul className="ssp-list">
          {items.map((item, i) => (
            <motion.li
              key={item}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.12 + i * 0.07, ease: E }}
              className="ssp-item"
            >
              <span
                className={reduced ? 'ssp-dot' : 'ssp-dot ssp-dot--animate'}
                style={{
                  background: accent,
                  ['--dot-glow' as string]: accent,
                  animationDelay: `${0.3 + i * 0.07}s`,
                }}
              />
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function SystemsServicesScroll() {
  const reduced = useReducedMotion()

  return (
    <SmoothScroll>
      <section aria-label="Systems and Services" className="ssp-root">
        <style>{CSS}</style>

        <ListPanel
          heading="Systems"
          items={SYSTEMS_ITEMS}
          accent={BLUE}
          ambientRgb="rgba(111,140,255,0.10)"
          reduced={reduced}
          className="ssp-panel--systems"
        />

        <ListPanel
          heading="Services"
          items={SERVICES_ITEMS}
          accent={GOLD}
          ambientRgb="rgba(233,150,63,0.09)"
          reduced={reduced}
          className="ssp-panel--services"
        />

        <div className="ssp-panel ssp-panel--closing">
          <div aria-hidden="true" className="ssp-ambient" style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(24,105,125,0.14) 0%, rgba(5,26,32,0.06) 42%, transparent 74%)',
          }} />
          <div className="ssp-inner ssp-inner--closing">
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.65, ease: E }}
              className="ssp-closing"
            >
              Everything your business needs to grow—
              <span className="weavy-shimmer-text">connected and managed by one team</span>.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.25, ease: E }}
              className="ssp-scroll-cue"
            >
              <span className="ssp-scroll-cue-text">Scroll to explore</span>
              <svg
                className={reduced ? 'ssp-scroll-cue-arrow' : 'ssp-scroll-cue-arrow ssp-scroll-cue-arrow--animate'}
                width="20"
                height="26"
                viewBox="0 0 20 26"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 2 V19 M3 13 L10 20 L17 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>
    </SmoothScroll>
  )
}

/* Scoped styles for the sticky three-panel sequence. Sticky stacking is the
   default (desktop/tablet); below 768px and under prefers-reduced-motion we
   fall back to normal stacked sections, since a sticky-pin scroll effect is
   easy to get trapped in on small touch screens and is explicitly an
   unwanted experience for reduced-motion users. */
const CSS = `
.ssp-root {
  position: relative;
  background: #010709;
}

.ssp-panel {
  position: sticky;
  top: 0;
  height: 100svh;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #010709;
}

.ssp-panel--systems { background: #010709; }
.ssp-panel--services { background: #010508; }
.ssp-panel--closing { background: #01080a; }

.ssp-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ssp-dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(125,220,255,0.045) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 100%);
}

.ssp-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: clamp(96px, 14vw, 140px) clamp(1.5rem, 6vw, 4rem) 2rem;
  text-align: center;
}

.ssp-heading {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.26em;
  font-size: clamp(2rem, 5.5vw, 4rem);
  margin: 0 0 clamp(2.5rem, 5vw, 3.5rem);
}

.ssp-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1rem, 2.4vw, 1.6rem);
  margin: 0 auto;
  padding: 0;
  list-style: none;
  max-width: 40rem;
}

.ssp-item {
  display: flex;
  align-items: center;
  gap: 18px;
  font-family: 'Poppins', 'Inter', sans-serif;
  font-weight: 400;
  font-size: clamp(1.3rem, 3.2vw, 2rem);
  color: rgba(242,246,245,0.86);
  letter-spacing: -0.005em;
}

.ssp-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 10px var(--dot-glow, transparent);
}

.ssp-dot--animate {
  animation: ssp-dot-glow-once 900ms ease-out both;
}

@keyframes ssp-dot-glow-once {
  0%   { box-shadow: 0 0 0px transparent; opacity: 0.4; }
  55%  { box-shadow: 0 0 18px var(--dot-glow, transparent); opacity: 1; }
  100% { box-shadow: 0 0 10px var(--dot-glow, transparent); opacity: 1; }
}

.ssp-inner--closing {
  padding-top: clamp(96px, 14vw, 140px);
  padding-bottom: clamp(96px, 14vw, 140px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.ssp-closing {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: clamp(1.9rem, 4.6vw, 3.4rem);
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: #F2F6F5;
  max-width: 46rem;
  margin: 0 auto;
}

.ssp-scroll-cue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: clamp(60px, 6vw, 80px);
  color: rgba(125, 220, 255, 0.68);
}

.ssp-scroll-cue-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.ssp-scroll-cue-arrow--animate {
  animation: ssp-scroll-cue-drift 2.4s ease-in-out infinite;
}

@keyframes ssp-scroll-cue-drift {
  0%, 100% { transform: translateY(0); opacity: 0.75; }
  50%      { transform: translateY(6px); opacity: 1; }
}

@media (max-width: 700px), (prefers-reduced-motion: reduce) {
  .ssp-panel {
    position: static;
    height: auto;
    min-height: 100svh;
    min-height: 100vh;
    padding: 0;
  }
  .ssp-inner, .ssp-inner--closing {
    padding-top: clamp(72px, 18vw, 110px);
    padding-bottom: clamp(56px, 14vw, 90px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ssp-dot--animate { animation: none; box-shadow: 0 0 10px var(--dot-glow, transparent); }
  .ssp-scroll-cue-arrow--animate { animation: none; }
}
`
