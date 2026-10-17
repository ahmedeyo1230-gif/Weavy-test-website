import { useState, useEffect } from 'react'
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
          className="relative mx-auto"
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
          </div>

          {/* The workflow as text: visible list on phones/tablets (the image's
              lettering is too small there); screen-reader only on desktop,
              where the image itself shows the five panels. */}
          <ol className="cs-steps" aria-label="How an enquiry becomes a booked client">
            {WORKFLOW_STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                className="cs-step"
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
