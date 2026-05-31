import { useEffect, useRef, useState, useCallback } from 'react'

const STATS = [
  {
    target: 100,
    suffix: '%',
    label: 'Custom Solutions',
    caption: 'Built from scratch — no templates, no compromise.',
  },
  {
    target: 90,
    suffix: '%',
    label: 'Automation Efficiency',
    caption: 'Workflows that replace manual effort around the clock.',
  },
  {
    target: 95,
    suffix: '%',
    label: 'Client Satisfaction',
    caption: 'Measured after every project. Consistently delivered.',
  },
  {
    target: 85,
    suffix: '%',
    label: 'Faster Deployment',
    caption: 'Clean planning, focused execution, on-time launches.',
  },
]

const DURATION = 1600
const PAUSE    = 5000
const STAGGER  = 130

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function StatItem({
  target,
  suffix,
  label,
  caption,
  index,
  cycle,
  isLast,
}: {
  target: number
  suffix: string
  label: string
  caption: string
  index: number
  cycle: number
  isLast: boolean
}) {
  const [count,   setCount]   = useState(0)
  const [visible, setVisible] = useState(false)
  const rafRef   = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const runCountUp = useCallback(() => {
    setCount(0)
    setVisible(false)
    timerRef.current = setTimeout(() => {
      setVisible(true)
      let startTs: number | null = null
      const step = (ts: number) => {
        if (!startTs) startTs = ts
        const elapsed  = ts - startTs
        const progress = Math.min(elapsed / DURATION, 1)
        setCount(Math.round(easeOutCubic(progress) * target))
        if (progress < 1) rafRef.current = requestAnimationFrame(step)
      }
      rafRef.current = requestAnimationFrame(step)
    }, index * STAGGER)
  }, [target, index])

  useEffect(() => {
    if (cycle === 0) return
    runCountUp()
    return () => {
      clearTimeout(timerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, [cycle, runCountUp])

  return (
    <div
      className="relative flex flex-col items-center text-center px-6 py-10 sm:py-12"
      style={{
        borderRight: isLast ? 'none' : '1px solid hsl(0 0% 100% / 0.06)',
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.75s ease, transform 0.75s cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      {/* Number */}
      <span
        className="font-sans font-light"
        style={{
          fontSize: 'clamp(3rem, 6.5vw, 5rem)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
          color: 'hsl(0 0% 96%)',
          display: 'block',
          marginBottom: '0.55rem',
        }}
      >
        {count}{suffix}
      </span>

      {/* Accent line */}
      <div
        style={{
          width: '1.8rem',
          height: '1px',
          background: 'linear-gradient(to right, hsl(199 89% 60% / 0.6), transparent)',
          marginBottom: '0.85rem',
          transition: `opacity 0.4s ease ${index * 0.1 + 0.4}s`,
          opacity: visible ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Label */}
      <span
        className="font-sans font-light block mb-2"
        style={{
          fontSize: 'clamp(0.72rem, 1.1vw, 0.82rem)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'hsl(0 0% 52%)',
        }}
      >
        {label}
      </span>

      {/* Caption */}
      <span
        className="font-sans font-light"
        style={{
          fontSize: '0.76rem',
          lineHeight: 1.75,
          color: 'hsl(0 0% 30%)',
          maxWidth: '14rem',
          display: 'block',
        }}
      >
        {caption}
      </span>
    </div>
  )
}

export default function Stats() {
  const sectionRef  = useRef<HTMLElement>(null)
  const [cycle, setCycle] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const startLoop = useCallback(() => {
    setCycle(c => c + 1)
    intervalRef.current = setInterval(() => {
      setCycle(c => c + 1)
    }, DURATION + (STATS.length - 1) * STAGGER + PAUSE)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoop()
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearInterval(intervalRef.current)
    }
  }, [startLoop])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#02080A', padding: 'clamp(5rem, 9vw, 8rem) 0' }}
    >
      {/* Top fade from About */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(to right, transparent, hsl(0 0% 100% / 0.07) 20%, hsl(0 0% 100% / 0.07) 80%, transparent)',
        }}
      />

      {/* Subtle radial ambient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 0%, hsl(199 89% 60% / 0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">

        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <p
            className="font-sans font-light uppercase mb-4"
            style={{ fontSize: '0.65rem', letterSpacing: '0.32em', color: 'hsl(199 89% 60% / 0.7)' }}
          >
            Performance
          </p>
          <h2
            className="font-sans font-light text-text mb-6"
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
            }}
          >
            Results that{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              speak
            </em>{' '}
            for themselves.
          </h2>
          <div
            style={{
              width: '2rem',
              height: '1px',
              background: 'linear-gradient(to right, hsl(199 89% 60% / 0.4), transparent)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{
            border: '1px solid hsl(0 0% 100% / 0.06)',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            background: 'hsl(215 20% 8% / 0.35)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {STATS.map(({ target, suffix, label, caption }, i) => (
            <StatItem
              key={label}
              target={target}
              suffix={suffix}
              label={label}
              caption={caption}
              index={i}
              cycle={cycle}
              isLast={i === STATS.length - 1}
            />
          ))}
        </div>

      </div>

      {/* Bottom fade into Testimonials */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
          background: 'linear-gradient(to bottom, transparent, #010709)',
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}
