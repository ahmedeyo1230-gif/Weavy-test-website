import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]
/* ── Hooks ── */

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

/* ── Workflow light sequence — overlay geometry ──
   Measured from Glass.png (2688×1520) pixels: the five card outlines, the four
   arrow glyphs and the check ring. The overlay SVG shares that coordinate
   system (viewBox + "slice" scaling = the image's object-fit: cover), so the
   light stays locked to the artwork at every desktop size. */
const FX_CARDS = [
  { x: 87,   y: 353, w: 292, h: 414, icon: [228, 484] },
  { x: 447,  y: 365, w: 299, h: 399, icon: [591, 497] },
  { x: 812,  y: 376, w: 274, h: 385, icon: [948, 498] },
  { x: 1146, y: 388, w: 251, h: 370, icon: [1278, 508] },
  { x: 1450, y: 398, w: 248, h: 357, icon: [1573, 516] },
]
const FX_ARROWS = [
  { x1: 389, x2: 435, y: 510 },
  { x1: 756, x2: 800, y: 514 },
  { x1: 1095, x2: 1137, y: 519 },
  { x1: 1401, x2: 1441, y: 524 },
]
const FX_CHECK = { cx: 1573, cy: 516, r: 59 }
// Continuous 6s cycle (CSS keyframes, infinite): stage i activates at i × 1s
// (0–1 New lead … 4–5 Client booked + completion pulse); each arrow light
// travels in the 0.35s before the next stage; 5–6s everything settles to rest,
// so the loop rejoins without a visible reset.
const FX_STEP = 1

function WorkflowLight() {
  return (
    <svg className="cs-fx" viewBox="0 0 2688 1520" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="cs-fx-icon">
          <stop offset="0%" stopColor="#8EDFF5" stopOpacity="0.42" />
          <stop offset="45%" stopColor="#4CC9F0" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#4CC9F0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cs-fx-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B8F1FF" stopOpacity="0" />
          <stop offset="48%" stopColor="#B8F1FF" stopOpacity="0.10" />
          <stop offset="52%" stopColor="#B8F1FF" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#B8F1FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {FX_CARDS.map((c, i) => (
        <g key={i} className="cs-fx-stage" data-i={i} style={{ ['--d' as string]: `${i * FX_STEP}s` }}>
          <circle className="cs-fx-icon" cx={c.icon[0]} cy={c.icon[1]} r={118} fill="url(#cs-fx-icon)" />
          <rect className="cs-fx-card" x={c.x} y={c.y} width={c.w} height={c.h} rx={18} fill="url(#cs-fx-sheen)" />
        </g>
      ))}
      {FX_ARROWS.map((a, i) => (
        <g key={i} style={{ ['--d' as string]: `${i * FX_STEP + 0.6}s` }}>
          <line className="cs-fx-trail" x1={a.x1} y1={a.y} x2={a.x2} y2={a.y} />
          <line className="cs-fx-arrow" x1={a.x1} y1={a.y} x2={a.x2} y2={a.y} />
        </g>
      ))}
      <g className="cs-fx-done" style={{ ['--d' as string]: `${4 * FX_STEP}s` }}>
        <circle className="cs-fx-done-ring" cx={FX_CHECK.cx} cy={FX_CHECK.cy} r={FX_CHECK.r} />
        <circle className="cs-fx-done-pulse" cx={FX_CHECK.cx} cy={FX_CHECK.cy} r={FX_CHECK.r} />
      </g>
      {/* Invisible hover targets exactly over the five cards (desktop, mouse
          only): hovering one holds the loop and lights just that stage. */}
      {FX_CARDS.map((c, i) => (
        <rect key={i} className="cs-fx-hit" data-i={i} x={c.x} y={c.y} width={c.w} height={c.h} rx={18} />
      ))}
    </svg>
  )
}

/* ── Connected workflow (same five steps shown in Glass.png) ── */

const WORKFLOW_STEPS = [
  { title: 'New lead',         desc: 'Ad click or website enquiry' },
  { title: 'Capture',          desc: 'WhatsApp, Instagram, Facebook or website chat' },
  { title: 'Sync & qualify',   desc: 'Contact added to CRM' },
  { title: 'Book appointment', desc: 'Qualified lead books a time' },
  { title: 'Client booked',    desc: 'Appointment confirmed' },
]

/* ── Main export ── */

export default function ConnectedSystems() {
  const reduced = useReducedMotion()
  // Continuous 6s light loop (never with reduced motion). Pure CSS; React
  // only toggles classes/data attributes on the wrapper — no re-renders.
  //   frame visible → "is-live" (desktop overlay) · list visible → "steps-live"
  //   (phone/tablet cards). Leaving view or hiding the tab pauses the loop in
  //   place (animation-play-state), so scrolling never restarts it.
  //   Hover a card (mouse) / tap a step (touch) → highlight just that stage.
  const visualRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = visualRef.current
    if (!root || reduced) return
    const frame = root.querySelector('.cs-glass-frame')
    const list = root.querySelector('.cs-steps')
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        root.classList.toggle(e.target === frame ? 'is-live' : 'steps-live', e.isIntersecting)
      }
    }, { threshold: 0.25 })
    if (frame) io.observe(frame)
    if (list) io.observe(list)

    const onVisibility = () => root.classList.toggle('tab-hidden', document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)

    const onOver = (ev: Event) => {
      const hit = (ev.target as Element | null)?.closest?.('.cs-fx-hit')
      if (hit) root.dataset.hover = hit.getAttribute('data-i') ?? ''
      else delete root.dataset.hover
    }
    const onOut = (ev: Event) => {
      const to = (ev as MouseEvent).relatedTarget as Element | null
      if (!to?.closest?.('.cs-fx-hit')) delete root.dataset.hover
    }
    const svg = root.querySelector('.cs-fx')
    svg?.addEventListener('mouseover', onOver)
    svg?.addEventListener('mouseout', onOut)

    let tapTimer: ReturnType<typeof setTimeout> | undefined
    const onTap = (ev: Event) => {
      const step = (ev.target as Element | null)?.closest?.('.cs-step')
      if (!step || !list) return
      root.dataset.tap = String([...list.children].indexOf(step))
      clearTimeout(tapTimer)
      tapTimer = setTimeout(() => { delete root.dataset.tap }, 2400)
    }
    list?.addEventListener('click', onTap)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      svg?.removeEventListener('mouseover', onOver)
      svg?.removeEventListener('mouseout', onOut)
      list?.removeEventListener('click', onTap)
      clearTimeout(tapTimer)
    }
  }, [reduced])

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: '#000506',
        paddingTop: 'clamp(72px, 15vw, 200px)',
        paddingBottom: 'clamp(72px, 15vw, 200px)',
      }}
      aria-label="Connected Systems"
    >
      {/* Thin glowing connection line continuing down from the Weavy Platform
          section above — fades in from transparent so it reads as a
          continuation rather than a hard-edged line starting mid-air. */}
      <motion.div
        aria-hidden="true"
        className="connected-system-line pointer-events-none absolute left-1/2 top-0"
        initial={reduced ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: E }}
        style={{
          width: 1,
          height: 'clamp(120px, 16vw, 200px)',
          transform: 'translateX(-50%)',
          transformOrigin: 'top',
          background: 'linear-gradient(to bottom, rgba(125, 220, 255, 0), rgba(125, 220, 255, 0.42), rgba(125, 220, 255, 0.10))',
          boxShadow: '0 0 18px rgba(125, 220, 255, 0.18)',
          zIndex: 1,
        }}
      />

      {/* Ambient glow behind the dashboard — kept below the Platform section's
          brightness, per the "not brighter than Platform" requirement. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(circle at 50% 48%, rgba(24, 105, 125, 0.11) 0%, rgba(5, 26, 32, 0.05) 42%, rgba(1, 7, 9, 0) 72%)',
      }} />

      {/* Very faint dotted texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(125,220,255,0.045) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 25%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 25%, transparent 100%)',
      }} />

      {/* Top / bottom fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, #000506, transparent)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, #000506, transparent)', pointerEvents: 'none' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">

        {/* ── Editorial header ── */}
        <div
          className="grid grid-cols-1 min-[900px]:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)] min-[900px]:items-end"
          style={{ columnGap: 80 }}
        >
          <div>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12, ease: E }}
              className="font-label"
              style={{ fontSize: '0.85rem', letterSpacing: '0.30em', textTransform: 'uppercase', color: 'rgba(174,235,255,0.94)', marginBottom: '1.4rem' }}
            >
              Connected Systems
            </motion.p>

            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.18, ease: E }}
              className="font-heading font-medium"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 6rem)', lineHeight: 0.98, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
            >
              From first click to{' '}
              <em style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400, color: '#7DDCFF' }}>
                booked client.
              </em>
            </motion.h2>
          </div>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.24, ease: E }}
            className="font-body font-normal"
            style={{ fontSize: 'clamp(17px, 1.2vw, 18px)', lineHeight: 1.7, color: 'var(--text-body)', maxWidth: 430, marginTop: '1.6rem' }}
          >
            Designed to capture, qualify and follow up enquiries—moving more
            conversations towards booking.
          </motion.p>
        </div>

        {/* ── Cinematic workflow visual (Glass.png) ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, delay: 0.3, ease: E }}
          ref={visualRef}
          className="relative mx-auto cs-anim"
          style={{ width: 'min(86vw, 1240px)', marginTop: 'clamp(56px, 9vw, 100px)' }}
        >
          {/* Soft ambient glow behind the image — an elevated feel without a
              hard shape or extra panel. */}
          <div aria-hidden="true" className="pointer-events-none absolute" style={{
            inset: '-9%',
            background: 'radial-gradient(ellipse 60% 56% at 50% 50%, rgba(24,105,125,0.16) 0%, rgba(5,26,32,0.07) 45%, rgba(1,7,9,0) 78%)',
            filter: 'blur(44px)',
          }} />

          {/* Desktop: the full widescreen composition. Below 1024px the frame
              re-composes around the man and laptop (see .cs-glass-* in
              index.css) and the five steps follow as real text. */}
          <div className="cs-glass-frame">
            <img
              className="cs-glass-img"
              src="/brand_assets/Glass.png"
              srcSet="/brand_assets/Glass-1400.webp 1400w, /brand_assets/Glass-2400.webp 2400w"
              sizes="(max-width: 1023px) 145vw, min(86vw, 1240px)"
              width={2688}
              height={1520}
              loading="lazy"
              decoding="async"
              alt="A professional at a laptop in a night-time city office, beside a connected enquiry-to-booking workflow"
            />
            <div aria-hidden="true" className="cs-glass-shade" />
            <WorkflowLight />
          </div>

          {/* The workflow as text: visible list on phones/tablets (the image's
              lettering is too small there); screen-reader only on desktop,
              where the image itself shows the five panels. */}
          <ol className="cs-steps" aria-label="How an enquiry becomes a booked client">
            {WORKFLOW_STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                className="cs-step"
                style={{ ['--d' as string]: `${i * FX_STEP}s` }}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: E }}
              >
                <span className="cs-step-num" aria-hidden="true">{i + 1}</span>
                <span className="cs-step-text">
                  <span className="cs-step-title">{step.title}</span>
                  <span className="cs-step-desc">{step.desc}</span>
                </span>
              </motion.li>
            ))}
          </ol>
        </motion.div>

      </div>
    </section>
  )
}
