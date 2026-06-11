import { useEffect, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'

interface StatProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  delay?: number
}

function StatCounter({ value, suffix = '', prefix = '', label, delay = 0 }: StatProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const inView  = useInView(nodeRef, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView || !nodeRef.current) return
    const controls = animate(0, value, {
      duration: 2,
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center md:items-start space-y-2"
    >
      <div className="text-5xl md:text-6xl font-light tracking-tighter flex items-center text-primary">
        {prefix && (
          <span className="font-serif italic mr-1 text-muted">{prefix}</span>
        )}
        <span ref={nodeRef}>0</span>
        {suffix && (
          <span className="font-serif italic ml-1 text-accent-cyan">{suffix}</span>
        )}
      </div>
      <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <section className="py-24 px-6 border-y border-border bg-surface/30 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, hsl(199 89% 60% / 0.04) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 text-center md:text-left">
          <StatCounter value={50}  suffix="+"  label="Systems Built"       delay={0}   />
          <StatCounter value={3}               label="Continents"          delay={0.2} />
          <StatCounter value={2}   prefix="£" suffix="M+" label="Revenue Generated"  delay={0.4} />
          <StatCounter value={100} suffix="%" label="Client Retention"    delay={0.6} />
        </div>
      </div>
    </section>
  )
}
