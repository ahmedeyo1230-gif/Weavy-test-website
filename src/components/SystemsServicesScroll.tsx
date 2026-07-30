import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SmoothScroll } from './ui/smooth-scroll'
import { GradientDots } from './ui/gradient-dots'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const BLUE = '#6F8CFF'
const VIOLET_HEADING = '#B7AEFF'
const VIOLET_DOT = '#9F94FF'
const VIOLET_LINE = 'rgba(183, 174, 255, 0.24)'

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
  heading, items, accent, headingColor = accent, lineColor = accent, ambientRgb, bgBase, reduced, className,
  dotLayerOpacity = 0.13, dotsAlpha = 0.045, cornerLabel,
}: {
  heading: string
  items: string[]
  accent: string
  headingColor?: string
  lineColor?: string
  ambientRgb: string
  bgBase: string
  reduced: boolean
  className: string
  dotLayerOpacity?: number
  dotsAlpha?: number
  cornerLabel?: string
}) {
  return (
    <div className={`ssp-panel ${className}`}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: dotLayerOpacity }}>
        <GradientDots
          backgroundColor={bgBase}
          dotSize={8}
          spacing={10}
          duration={42}
          colorCycleDuration={20}
          {...(reduced ? { animate: false } : {})}
        />
      </div>
      <div aria-hidden="true" className="ssp-ambient" style={{
        background: `radial-gradient(circle at 50% 42%, ${ambientRgb} 0%, transparent 68%)`,
      }} />
      <div aria-hidden="true" className="ssp-dots" style={{ ['--ssp-dots-alpha' as string]: dotsAlpha }} />

      {cornerLabel && (
        <span className="ssp-corner-label" aria-hidden="true">{cornerLabel}</span>
      )}

      <div className="ssp-inner">
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: E }}
          className="ssp-heading"
          style={{ color: headingColor }}
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
              style={{ ['--accent' as string]: lineColor }}
            >
              <span
                className={reduced ? 'ssp-dot' : 'ssp-dot ssp-dot--animate'}
                style={{
                  background: accent,
                  ['--dot-glow' as string]: accent,
                  animationDelay: `${0.3 + i * 0.07}s`,
                }}
              />
              <span
                className={reduced ? 'ssp-item-text' : 'ssp-item-text ssp-item-text--animate'}
                style={{ animationDelay: `${0.3 + i * 0.07}s` }}
              >
                {item}
              </span>
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
          ambientRgb="rgba(111,140,255,0.07)"
          bgBase="#020202"
          reduced={reduced}
          className="ssp-panel--systems"
          dotLayerOpacity={0.091}
          dotsAlpha={0.032}
          cornerLabel="01 — SYSTEMS THAT WORK FOR YOU"
        />

        <ListPanel
          heading="Services"
          items={SERVICES_ITEMS}
          accent={VIOLET_DOT}
          headingColor={VIOLET_HEADING}
          lineColor={VIOLET_LINE}
          ambientRgb="rgba(159, 148, 255, 0.058)"
          bgBase="#020202"
          reduced={reduced}
          className="ssp-panel--services"
          dotLayerOpacity={0.078}
          dotsAlpha={0.027}
          cornerLabel="02 — HOW WE HELP YOU GROW"
        />

        <div className="ssp-panel ssp-panel--closing">
          {/* Reuses the exact Systems-panel dotted background (same GradientDots
              component + ssp-dots texture, same size/spacing/colour palette). */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.12 }}>
            <GradientDots
              backgroundColor="#020202"
              dotSize={8}
              spacing={10}
              duration={42}
              colorCycleDuration={20}
              {...(reduced ? { animate: false } : {})}
            />
          </div>
          <div aria-hidden="true" className="ssp-ambient" style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(24,105,125,0.14) 0%, rgba(5,26,32,0.06) 42%, transparent 74%)',
          }} />
          <div aria-hidden="true" className="ssp-dots" style={{ ['--ssp-dots-alpha' as string]: 0.021 }} />
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
.ssp-panel--services { background: #010709; }
.ssp-panel--closing { background: linear-gradient(to bottom, #010709 0%, #020405 50%, #010709 100%); }

/* Cross-fades the hero's own bottom fade colour (#010709) into the top of
   the Systems panel so its dot-grid/gradient-dots texture reveals gradually
   instead of starting with a hard-edged seam at the hero/Systems boundary. */
.ssp-panel--systems::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 110px;
  background: linear-gradient(to bottom, #010709 0%, transparent 100%);
  pointer-events: none;
}

.ssp-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ssp-corner-label {
  position: absolute;
  top: clamp(64px, 6vw, 80px);
  left: 6vw;
  z-index: 2;
  font-family: var(--font-label);
  font-weight: 500;
  font-size: clamp(13px, 1vw, 14px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(191, 225, 245, 0.55);
  pointer-events: none;
}

@media (max-width: 700px) {
  .ssp-corner-label {
    top: 32px;
    left: 24px;
    font-size: 11px;
  }
}

.ssp-dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(125,220,255,var(--ssp-dots-alpha, 0.045)) 1px, transparent 1px);
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
  font-family: var(--font-heading);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.26em;
  font-size: clamp(1.82rem, 5vw, 3.6rem);
  margin: 0 0 clamp(2.25rem, 4.5vw, 3.1rem);
}

.ssp-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: fit-content;
  gap: clamp(0.85rem, 1.9vw, 1.25rem);
  margin: 0 auto;
  padding: 0;
  list-style: none;
  max-width: 40rem;
}

.ssp-item {
  display: flex;
  align-items: center;
  gap: 18px;
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(1.13rem, 2.8vw, 1.74rem);
  color: rgba(242,246,245,0.86);
  letter-spacing: -0.005em;
  text-align: left;
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

.ssp-item:hover .ssp-dot,
.ssp-item:focus-within .ssp-dot {
  animation: ssp-dot-glow-once 420ms ease-out;
}

@keyframes ssp-dot-glow-once {
  0%   { box-shadow: 0 0 0px transparent; opacity: 0.4; }
  55%  { box-shadow: 0 0 18px var(--dot-glow, transparent); opacity: 1; }
  100% { box-shadow: 0 0 10px var(--dot-glow, transparent); opacity: 1; }
}

.ssp-item-text {
  position: relative;
  display: inline-block;
  opacity: 0.76;
  transition: opacity 380ms ease;
}

.ssp-item-text::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -5px;
  height: 1px;
  background: var(--accent, currentColor);
  opacity: 0;
  transition: opacity 380ms ease;
}

.ssp-item-text--animate {
  animation: ssp-item-text-glow-once 900ms ease-out both;
}

.ssp-item-text--animate::after {
  animation: ssp-item-line-glow-once 900ms ease-out both;
}

@keyframes ssp-item-text-glow-once {
  0%   { opacity: 0.76; }
  55%  { opacity: 1; }
  100% { opacity: 0.76; }
}

@keyframes ssp-item-line-glow-once {
  0%   { opacity: 0; }
  55%  { opacity: 0.5; }
  100% { opacity: 0; }
}

.ssp-item:hover .ssp-item-text,
.ssp-item:focus-within .ssp-item-text {
  opacity: 1 !important;
}

.ssp-item:hover .ssp-item-text::after,
.ssp-item:focus-within .ssp-item-text::after {
  opacity: 0.5 !important;
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
  font-family: var(--font-heading);
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
  font-family: var(--font-label);
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
    position: relative;
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
  .ssp-item-text, .ssp-item-text--animate {
    animation: none;
    opacity: 1;
    transition: none;
  }
  .ssp-item-text::after, .ssp-item-text--animate::after {
    animation: none;
    opacity: 0;
  }
}
`
