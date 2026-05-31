import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  CheckCircle,
  Target,
  CreditCard,
  PieChart,
  Gauge,
  UserRound,
} from 'lucide-react'

/* ─── Feature data ───────────────────────────────────────────── */
const FEATURES = [
  {
    Icon: CheckCircle,
    num: '01',
    title: 'Strategy-First Approach',
    body: 'We start by understanding your brand, goals, and audience before shaping systems designed to drive measurable growth.',
    color: 'hsl(24 95% 60%)',
    bg:   'hsl(24 95% 60% / 0.08)',
    border: 'hsl(24 95% 60% / 0.2)',
  },
  {
    Icon: Target,
    num: '02',
    title: 'Tailored For Your Brand',
    body: 'Every website, automation flow, and creative asset is custom-built around your identity, market, and business objectives.',
    color: 'hsl(199 89% 60%)',
    bg:   'hsl(199 89% 60% / 0.08)',
    border: 'hsl(199 89% 60% / 0.2)',
  },
  {
    Icon: CreditCard,
    num: '03',
    title: 'Transparent Communication',
    body: 'Clear updates, organised workflows, and honest project direction keep every stage focused and easy to follow.',
    color: 'hsl(142 68% 55%)',
    bg:   'hsl(142 68% 55% / 0.08)',
    border: 'hsl(142 68% 55% / 0.2)',
  },
  {
    Icon: PieChart,
    num: '04',
    title: 'Data-Driven Decisions',
    body: 'We use insights, performance signals, and user behaviour to refine design, automation, and campaign outcomes.',
    color: 'hsl(38 95% 60%)',
    bg:   'hsl(38 95% 60% / 0.08)',
    border: 'hsl(38 95% 60% / 0.2)',
  },
  {
    Icon: Gauge,
    num: '05',
    title: 'Results That Matter',
    body: 'Every section, interaction, and system is created to improve trust, engagement, enquiries, and long-term growth.',
    color: 'hsl(220 80% 65%)',
    bg:   'hsl(220 80% 65% / 0.08)',
    border: 'hsl(220 80% 65% / 0.2)',
  },
  {
    Icon: UserRound,
    num: '06',
    title: 'Partnered For Your Success',
    body: 'We support, optimise, and improve your digital systems beyond launch so the work keeps performing.',
    color: 'hsl(346 80% 62%)',
    bg:   'hsl(346 80% 62% / 0.08)',
    border: 'hsl(346 80% 62% / 0.2)',
  },
]

/* ─── Component ──────────────────────────────────────────────── */
export default function ExceedingExpectations() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const headerEls  = el.querySelectorAll('.ee-header-el')
    const featureEls = el.querySelectorAll('.ee-feature')
    const iconEls    = el.querySelectorAll('.ee-icon')

    gsap.set(headerEls,  { opacity: 0, y: 30 })
    gsap.set(featureEls, { opacity: 0, y: 26 })
    gsap.set(iconEls,    { opacity: 0, scale: 0.82 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(headerEls,  { opacity: 1, y: 0, duration: 1.0, stagger: 0.12 }, 0)
      tl.to(featureEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 }, 0.3)
      tl.to(iconEls,    { opacity: 1, scale: 1, duration: 0.6, stagger: 0.09, ease: 'back.out(1.5)' }, 0.34)

      obs.disconnect()
    }, { threshold: 0.08 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 9rem) 0' }}
    >
      {/* Grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.018 }}>
        <filter id="ee-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#ee-gr)" fill="white"/>
      </svg>

      {/* Vignette — subtle radial dark edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, hsl(0 0% 0% / 0.25) 100%)',
        }}
      />

      {/* Top hairline */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(to right, transparent, hsl(0 0% 100% / 0.07) 30%, hsl(0 0% 100% / 0.07) 70%, transparent)',
        }}
      />

      <div className="relative z-10 max-w-[76rem] mx-auto px-6 sm:px-10">

        {/* ── Centered header ── */}
        <div className="text-center mb-16 lg:mb-20">
          <p
            className="ee-header-el font-sans font-light uppercase mb-5"
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.34em',
              color: 'hsl(199 89% 60% / 0.65)',
            }}
          >
            Why Clients Choose Weavy
          </p>

          <h2
            className="ee-header-el font-sans font-light mx-auto"
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: 'hsl(0 0% 96%)',
              maxWidth: '36rem',
              marginBottom: '1.4rem',
            }}
          >
            Exceeding expectations{' '}
            <em style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'hsl(0 0% 68%)',
            }}>
              from day one.
            </em>
          </h2>

          {/* Accent rule */}
          <div
            className="ee-header-el mx-auto"
            aria-hidden="true"
            style={{
              width: '2rem',
              height: '1px',
              background: 'hsl(199 89% 60% / 0.35)',
              marginTop: '1.4rem',
            }}
          />
        </div>

        {/* ── Features grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 lg:gap-x-14 lg:gap-y-14">
          {FEATURES.map(({ Icon, num, title, body, color, bg, border }, i) => (
            <div
              key={num}
              className="ee-feature"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                cursor: 'default',
                transform: hovered === i ? 'translateY(-5px)' : 'translateY(0)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Icon + title row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1rem' }}>

                {/* Icon container */}
                <div
                  className="ee-icon"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: bg,
                    border: `1px solid ${border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background 0.3s ease, border-color 0.3s ease',
                  }}
                >
                  <Icon
                    size={19}
                    strokeWidth={1.5}
                    style={{ color }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-sans font-light"
                  style={{
                    fontSize: 'clamp(0.9rem, 1.5vw, 1.02rem)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.018em',
                    color: hovered === i ? 'hsl(0 0% 96%)' : 'hsl(0 0% 82%)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {title}
                </h3>
              </div>

              {/* Subtle top-left accent line */}
              <div
                aria-hidden="true"
                style={{
                  width: hovered === i ? '2rem' : '1.2rem',
                  height: '1px',
                  background: color,
                  opacity: hovered === i ? 0.5 : 0.18,
                  marginBottom: '0.9rem',
                  transition: 'width 0.4s ease, opacity 0.3s ease',
                }}
              />

              {/* Body */}
              <p
                className="font-sans font-light"
                style={{
                  fontSize: 'clamp(0.82rem, 1.2vw, 0.9rem)',
                  lineHeight: 1.88,
                  color: 'hsl(0 0% 36%)',
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, #010709)',
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}
