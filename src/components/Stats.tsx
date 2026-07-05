import { useEffect, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'

interface StatProps {
  value?: number
  suffix?: string
  prefix?: string
  bigText?: string
  label?: string
  description: string
  delay?: number
}

// Some cards are a genuine counted stat (value animates 0 -> N); others are a
// short capability statement with no real number — those pass `bigText`
// instead and just render it statically in the same big/prominent slot.
function StatCounter({ value, suffix = '', prefix = '', bigText, label, description, delay = 0 }: StatProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const inView  = useInView(nodeRef, { once: true, margin: '-50px' })

  useEffect(() => {
    if (value === undefined || !inView || !nodeRef.current) return
    const controls = animate(0, value, {
      duration: 1.8,
      delay,
      ease: 'easeOut',
      onUpdate(v) {
        if (nodeRef.current) nodeRef.current.textContent = Math.round(v).toString()
      },
    })
    return () => controls.stop()
  }, [inView, value, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center px-6 py-8 relative group"
    >
      {/* Subtle top accent line that appears on hover */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {value !== undefined ? (
        <div className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter flex items-start text-primary mb-3">
          {prefix && (
            <span className="font-serif italic text-muted text-3xl md:text-4xl mt-2 mr-0.5">{prefix}</span>
          )}
          <span ref={nodeRef}>0</span>
          {suffix && (
            <span className="font-serif italic text-accent-cyan text-3xl md:text-4xl mt-2">{suffix}</span>
          )}
        </div>
      ) : (
        <p className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-primary mb-3">
          {bigText}
        </p>
      )}
      {label && (
        <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#94A3B8', letterSpacing: '0.15em' }}>{label}</p>
      )}
      <p className="text-xs font-medium max-w-[120px] leading-relaxed" style={{ color: '#64748B' }}>{description}</p>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: '#071011' }}>
      {/* Top blend — continues from About's #0B1114 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to bottom, #071011 0%, rgba(7,16,17,0.6) 42%, rgba(7,16,17,0.18) 72%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Radial glow behind the panel */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, hsl(199 89% 60% / 0.045) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto relative"
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
            <StatCounter value={100} suffix="%"  label="Custom"          description="No templates. Every system is built around the business." delay={0}   />
            <StatCounter value={3}                label="Service Pillars" description="Automation, websites, and creative content."               delay={0.1} />
            <StatCounter bigText="Fast Response"  label="Focus"           description="Designed to reduce missed enquiries."                       delay={0.2} />
            <StatCounter bigText="Built to Scale"                         description="Systems made for growth from day one."                      delay={0.3} />
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
          background: 'linear-gradient(to bottom, transparent 0%, rgba(7,16,17,0.55) 55%, #071011 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </section>
  )
}
