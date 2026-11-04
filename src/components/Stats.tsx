import { useEffect, useRef } from 'react'
import { motion, useInView, animate, useReducedMotion } from 'framer-motion'

interface StatProps {
  value?: number
  suffix?: string
  prefix?: string
  bigText?: string
  label?: string
  description: string
  delay?: number
  pulseDelay?: number
}

// Some cards are a genuine counted stat (value animates 0 -> N); others are a
// short capability statement with no real number — those pass `bigText`
// instead and just render it statically in the same big/prominent slot.
function StatCounter({ value, suffix = '', prefix = '', bigText, label, description, delay = 0, pulseDelay = 0 }: StatProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const inView  = useInView(nodeRef, { once: true, margin: '-50px' })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (value === undefined || !inView || !nodeRef.current) return
    if (reduceMotion) {
      nodeRef.current.textContent = Math.round(value).toString()
      return
    }
    const controls = animate(0, value, {
      duration: 1.8,
      delay,
      ease: 'easeOut',
      onUpdate(v) {
        if (nodeRef.current) nodeRef.current.textContent = Math.round(v).toString()
      },
    })
    return () => controls.stop()
  }, [inView, value, delay, reduceMotion])

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: reduceMotion ? 0.4 : 0.75, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-10 sm:py-12 relative group"
    >
      {/* Subtle top accent line that appears on hover */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {value !== undefined ? (
        <div
          className="font-label stat-pulse text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight flex items-start text-primary mb-3"
          style={{ animationDelay: `${pulseDelay}s` }}
        >
          {prefix && (
            <span className="font-serif italic text-muted text-3xl md:text-4xl mt-2 mr-0.5">{prefix}</span>
          )}
          <span ref={nodeRef}>0</span>
          {suffix && (
            <span className="font-serif italic text-gold text-3xl md:text-4xl mt-2">{suffix}</span>
          )}
        </div>
      ) : (
        <p
          className="font-label stat-pulse text-[1.65rem] sm:text-3xl md:text-4xl xl:text-5xl max-lg:leading-[1.15] font-medium tracking-tight text-primary mb-3"
          style={{ animationDelay: `${pulseDelay}s` }}
        >
          {bigText}
        </p>
      )}
      {label && (
        <p className="section-label mb-2">{label}</p>
      )}
      <p className="font-body text-sm font-medium max-w-[210px] leading-relaxed m-tx-secondary" style={{ color: 'var(--text-description)' }}>{description}</p>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <section className="py-14 md:py-20 px-6 relative overflow-hidden" style={{ background: '#010709' }}>
      {/* Top blend — continues from About's #010709 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to bottom, #010709 0%, rgba(1,7,9,0.6) 42%, rgba(1,7,9,0.18) 72%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Radial glow behind the panel */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, hsl(44 100% 71% / 0.045) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto relative"
      >
        {/* Glass card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(16,24,32,0.7)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 24px 64px -16px rgba(0,0,0,0.6)',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.06]">
            <StatCounter bigText="24/7"            label="Always on"          description="Enquiries answered day or night, even outside working hours." delay={0}   pulseDelay={0}    />
            <StatCounter value={5}                  label="Connected channels" description="Voice, WhatsApp, Instagram, Facebook and web chat."            delay={0.2} pulseDelay={0.12} />
            <StatCounter bigText="One team"        label="Single partner"     description="Automation, websites and creative, managed in one place."       delay={0.4} pulseDelay={0.24} />
            <StatCounter bigText="Bespoke"         label="Built around you"   description="No templates. Every system is built around your business."      delay={0.6} pulseDelay={0.36} />
          </div>
        </div>
      </motion.div>

      {/* Bottom blend — dissolves card shadow before section boundary */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(1,7,9,0.55) 55%, #010709 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </section>
  )
}
