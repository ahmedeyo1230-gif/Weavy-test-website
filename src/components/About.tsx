import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Icons (green, minimal) ───────────────────────────────────────────────────

const G = 'hsl(150 58% 50%)'

function IconGrowth() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <polyline
        points="2,15 6.5,9.5 10,12 16.5,4"
        stroke={G} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
      <polyline
        points="12.5,4 16.5,4 16.5,8"
        stroke={G} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
      <line x1="2" y1="18" x2="18" y2="18" stroke={G} strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}

function IconEfficiency() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="2.6" stroke={G} strokeWidth="1.4" />
      <path
        d="M10 2v1.6M10 16.4V18M2 10h1.6M16.4 10H18M4.1 4.1l1.1 1.1M14.8 14.8l1.1 1.1M14.8 5.2l-1.1 1.1M5.2 14.8l-1.1 1.1"
        stroke={G} strokeWidth="1.3" strokeLinecap="round"
      />
      <circle cx="10" cy="10" r="5" stroke={G} strokeWidth="1" strokeDasharray="2 2.5" opacity="0.3" />
    </svg>
  )
}

function IconEngagement() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 4.5C3 3.67 3.67 3 4.5 3h11C16.33 3 17 3.67 17 4.5v8c0 .83-.67 1.5-1.5 1.5H6.5L3 17V4.5z"
        stroke={G} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
      <line x1="6.5" y1="7.5" x2="13.5" y2="7.5" stroke={G} strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
      <line x1="6.5" y1="10.5" x2="10.5" y2="10.5" stroke={G} strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  icon: React.ReactNode
  label: string
  description: string
}

function StatCard({ icon, label, description }: CardProps) {
  return (
    <div className="stat-card about-card-border">
      <div
        className="about-card-inner relative flex flex-col gap-5 p-6 overflow-hidden"
        style={{
          background: 'linear-gradient(150deg, hsl(215 28% 10% / 0.96) 0%, hsl(215 18% 7% / 0.99) 100%)',
          boxShadow: '0 0 0 1px hsl(0 0% 100% / 0.03) inset, 0 1px 0 0 hsl(210 70% 70% / 0.05) inset',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        {/* Top-left corner bloom */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: '130px', height: '130px',
            background: 'radial-gradient(circle at 0% 0%, hsl(205 85% 62% / 0.07) 0%, transparent 70%)',
          }}
        />

        {/* Green icon pill */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'hsl(150 55% 50% / 0.07)',
            border: '1px solid hsl(150 58% 50% / 0.22)',
            boxShadow: '0 0 12px -2px hsl(150 60% 50% / 0.18)',
          }}
        >
          {icon}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <span
            className="font-sans font-light text-text"
            style={{ fontSize: '1.15rem', letterSpacing: '-0.018em', lineHeight: 1.3 }}
          >
            {label}
          </span>
          <span
            className="font-sans font-light"
            style={{ fontSize: '0.9rem', color: 'hsl(0 0% 48%)', lineHeight: 1.75 }}
          >
            {description}
          </span>
        </div>

        {/* Bottom-right blue accent dot */}
        <div
          aria-hidden="true"
          className="absolute bottom-4 right-4 w-1 h-1 rounded-full"
          style={{
            background: 'hsl(205 90% 65% / 0.6)',
            boxShadow: '0 0 8px 2px hsl(205 90% 65% / 0.25)',
          }}
        />
      </div>
    </div>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.about-eyebrow, .about-heading, .about-body, .about-divider', {
        opacity: 0, y: 28,
      })
      gsap.set('.stat-card', { opacity: 0, y: 40 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.to('.about-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0)
          tl.to('.about-heading',  { opacity: 1, y: 0, duration: 0.9 }, 0.1)
          tl.to('.about-body',     { opacity: 1, y: 0, duration: 0.8 }, 0.2)
          tl.to('.about-divider',  { opacity: 1, y: 0, duration: 0.6 }, 0.3)
          tl.to('.stat-card',      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.35)
        },
        once: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full overflow-hidden"
      style={{ background: '#02080A', padding: 'clamp(5rem, 10vw, 8rem) 0', marginTop: '-4px', zIndex: 1 }}
    >
      {/* Top blend — absorbs any edge from previous section */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, #02080A, transparent)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Dot-grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.025) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 65% 45% at 50% 0%, hsl(210 50% 28% / 0.05) 0%, transparent 70%)',
            'radial-gradient(ellipse 35% 25% at 90% 90%, hsl(150 50% 28% / 0.03) 0%, transparent 60%)',
          ].join(', '),
        }}
      />


      <div className="relative z-10 max-w-[52rem] mx-auto px-6 sm:px-10">

        {/* Eyebrow */}
        <p
          className="about-eyebrow font-sans uppercase text-muted mb-5"
          style={{ fontSize: '0.7rem', letterSpacing: '0.32em' }}
        >
          About
        </p>

        {/* Heading */}
        <h2
          id="about-heading"
          className="about-heading font-sans font-light text-text mb-6"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
          }}
        >
          We are a{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
            Triple X
          </em>{' '}
          automation agency
        </h2>

        {/* Body */}
        <p
          className="about-body font-sans font-light mb-10 max-w-xl"
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
            lineHeight: 1.8,
            color: 'hsl(0 0% 56%)',
          }}
        >
          We craft bespoke websites, deploy AI-powered chatbots, and build intelligent
          systems for digital marketing, social media automation, and UGC content — so
          your brand operates at scale without adding headcount. We also deliver high-quality
          video editing that enhances storytelling and drives engagement, helping your content
          perform across platforms — with content optimised for reach, retention, and conversion.
        </p>

        {/* Divider */}
        <div
          className="about-divider w-full h-px mb-10"
          style={{ background: 'linear-gradient(to right, hsl(0 0% 14%), transparent)' }}
          aria-hidden="true"
        />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<IconGrowth />}
            label="Drive Growth"
            description="Turning attention into measurable revenue."
          />
          <StatCard
            icon={<IconEfficiency />}
            label="Increase Efficiency"
            description="24/7 automations that free your team to focus."
          />
          <StatCard
            icon={<IconEngagement />}
            label="Boost Engagement"
            description="Chatbots and pipelines that convert without you lifting a finger."
          />
        </div>

      </div>

      {/* Bottom fade — blends into Stats (#02080A) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent, #02080A)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </section>
  )
}
