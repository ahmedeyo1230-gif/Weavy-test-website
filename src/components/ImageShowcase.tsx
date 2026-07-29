import { useEffect, useRef, useState, useCallback } from 'react'
import Footer from './Footer'


// ─── Types ─────────────────────────────────────────────────────────────────────

interface Project {
  src: string
  title: string
  category: string
  year: string
  objectPosition?: string
}

// ─── Project data ──────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  // [0] Cinematic hero — Perfume
  {
    src:            '/brand_assets/Perfume.webp',
    title:          'Midnight Perfume Brand Launch',
    category:       'Luxury Campaign',
    year:           '2026',
    objectPosition: 'center center',
  },
  // [1] Tall accent — Evy cream
  {
    src:            '/brand_assets/Evy_cream.webp',
    title:          'EVY Skincare Campaign',
    category:       'Beauty Advertising',
    year:           '2026',
    objectPosition: 'center top',
  },
  // [2] Wide cinematic — Taste summer
  {
    src:            '/brand_assets/Taste_summer.webp',
    title:          'Sahra Experiences',
    category:       'Travel Branding',
    year:           '2026',
    objectPosition: 'center center',
  },
  // [3] Left — H
  {
    src:            '/brand_assets/H.webp',
    title:          'Paradiso Holidays',
    category:       'Resort Branding',
    year:           '2026',
    objectPosition: 'center top',
  },
  // [4] Centre — Fefo
  {
    src:            '/brand_assets/Fefo.webp',
    title:          'Natural Juice Campaign',
    category:       'Product Advertising',
    year:           '2026',
    objectPosition: 'center center',
  },
]

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ src, title, category, onClose }: { src: string; title: string; category: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 320)
  }

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `hsl(0 0% 0% / ${visible ? 0.92 : 0})`,
        backdropFilter: visible ? 'blur(12px)' : 'blur(0px)',
        transition: 'background 0.32s ease, backdrop-filter 0.32s ease',
        padding: 'clamp(1rem, 4vw, 3rem)',
        cursor: 'zoom-out',
      }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid hsl(0 0% 100% / 0.15)',
          background: 'hsl(0 0% 100% / 0.07)',
          color: '#fff',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.32s ease, background 0.2s ease',
          backdropFilter: 'blur(8px)',
          zIndex: 10,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'hsl(0 0% 100% / 0.16)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'hsl(0 0% 100% / 0.07)' }}
      >
        ✕
      </button>

      {/* Image container */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '88vh',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
          transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          cursor: 'default',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px hsl(0 0% 100% / 0.08)',
        }}
      >
        <img
          loading="lazy"
          decoding="async"
          src={src}
          alt={title}
          style={{
            display: 'block',
            maxWidth: '90vw',
            maxHeight: '85vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
        />

        {/* Caption bar */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '1.2rem 1.6rem',
          background: 'linear-gradient(to top, hsl(0 0% 0% / 0.75) 0%, transparent 100%)',
        }}>
          <p style={{ fontFamily: 'var(--font-label)', fontWeight: 300, fontSize: '0.58rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'hsl(195 60% 65%)', margin: '0 0 0.3rem' }}>
            {category}
          </p>
          <p style={{ fontFamily: 'var(--font-label)', fontWeight: 300, fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
            {title}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Scroll reveal hook ────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  delay = 0,
  visible = true,
  style,
  onOpen,
}: {
  project: Project
  delay?: number
  visible?: boolean
  style?: React.CSSProperties
  onOpen?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      style={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'hsl(195 80% 55% / 0.18)' : 'hsl(0 0% 100% / 0.07)'}`,
        boxShadow: hovered
          ? '0 0 0 1px hsl(195 80% 55% / 0.08), 0 32px 80px rgba(0,0,0,0.6)'
          : '0 16px 48px rgba(0,0,0,0.45)',
        transform: `translateY(${visible ? (hovered ? '-8px' : '0') : '36px'})`,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, border-color 0.4s ease, box-shadow 0.4s ease`,
        cursor: 'zoom-in',
        background: '#06100f',
        ...style,
      }}
    >
      {/* Image */}
      <img
        src={project.src}
        alt={project.title}
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: project.objectPosition ?? 'center center',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          display: 'block',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 0% / 0.28) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom gradient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '60%',
          background: 'linear-gradient(to top, hsl(0 0% 0% / 0.88) 0%, hsl(0 0% 0% / 0.4) 45%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Text */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: 'clamp(1rem, 2vw, 1.6rem)',
          zIndex: 10,
        }}
      >
        <p style={{
          fontFamily: 'var(--font-label)',
          fontWeight: 300,
          fontSize: '0.58rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'hsl(195 60% 65%)',
          margin: '0 0 0.4rem',
        }}>
          {project.category} — {project.year}
        </p>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 300,
          fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          color: '#fff',
          margin: 0,
          opacity: 0.95,
        }}>
          {project.title}
        </h3>
      </div>
    </div>
  )
}

// ─── CTA section ──────────────────────────────────────────────────────────────

function WorkCTA() {
  const { ref, visible } = useScrollReveal(0.1)
  const [btnHover,   setBtnHover]   = useState(false)
  const [emailHover, setEmailHover] = useState(false)

  const item = (delay: number): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  return (
    <section
      ref={ref}
      style={{
        background: '#010709',
        borderTop: '1px solid rgba(125, 220, 255, 0.10)',
        padding: 'clamp(6rem, 12vw, 10rem) clamp(1.2rem, 3.5vw, 3rem)',
      }}
    >
      <div
        style={{
          maxWidth: '54rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Label */}
        <p
          style={{
            ...item(0),
            fontFamily: 'var(--font-label)',
            fontWeight: 300,
            fontSize: '0.58rem',
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'hsl(195 80% 60%)',
            marginBottom: '1.8rem',
          }}
        >
          Start a Project
        </p>

        {/* Headline */}
        <h2
          style={{
            ...item(140),
            fontFamily: 'var(--font-heading)',
            fontWeight: 300,
            fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)',
            lineHeight: 1.07,
            letterSpacing: '-0.04em',
            color: '#fff',
            marginBottom: '1.8rem',
          }}
        >
          Let&apos;s build work{' '}
          <em style={{
            fontFamily: 'var(--font-accent)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'hsl(0 0% 62%)',
          }}>
            people remember.
          </em>
        </h2>

        {/* Thin rule */}
        <div
          aria-hidden="true"
          style={{
            ...item(220),
            width: '2.5rem',
            height: '1px',
            background: 'hsl(195 80% 55% / 0.35)',
            marginBottom: '1.8rem',
          }}
        />

        {/* Paragraph */}
        <p
          style={{
            ...item(280),
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
            lineHeight: 1.9,
            color: 'rgba(210, 224, 232, 0.70)',
            maxWidth: '38rem',
            marginBottom: 'clamp(2.5rem, 5vw, 3.8rem)',
          }}
        >
          Whether you need a brand campaign, digital launch, visual system, or
          content-led creative direction, we&apos;ll help shape the idea into something
          polished, purposeful, and ready to perform.
        </p>

        {/* Buttons */}
        <div
          style={{
            ...item(420),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.2rem',
          }}
        >
          {/* Primary CTA */}
          <a
            href="mailto:hello@weavyautomation.com"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              display: 'inline-block',
              padding: '1rem 2.8rem',
              borderRadius: '999px',
              background: btnHover ? 'hsl(0 0% 92%)' : '#fff',
              color: '#050e10',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'clamp(0.85rem, 1.3vw, 0.96rem)',
              letterSpacing: '0.01em',
              textDecoration: 'none',
              boxShadow: btnHover
                ? '0 0 0 4px hsl(195 80% 55% / 0.18), 0 12px 40px rgba(0,0,0,0.5)'
                : '0 8px 32px rgba(0,0,0,0.4)',
              transform: btnHover ? 'scale(1.03)' : 'scale(1)',
              transition: 'background 0.3s ease, box-shadow 0.35s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
              whiteSpace: 'nowrap',
            }}
          >
            Book a discovery call
          </a>

          {/* Email link */}
          <a
            href="mailto:hello@weavyautomation.com"
            onMouseEnter={() => setEmailHover(true)}
            onMouseLeave={() => setEmailHover(false)}
            style={{
              fontFamily: 'var(--font-label)',
              fontWeight: 300,
              fontSize: 'clamp(0.82rem, 1.2vw, 0.9rem)',
              letterSpacing: '0.02em',
              color: emailHover ? 'hsl(0 0% 78%)' : 'rgba(235, 245, 255, 0.80)',
              textDecoration: 'none',
              borderBottom: `1px solid ${emailHover ? 'hsl(0 0% 78% / 0.5)' : 'rgba(125, 220, 255, 0.28)'}`,
              paddingBottom: '1px',
              transition: 'color 0.3s ease, border-color 0.3s ease',
            }}
          >
            hello@weavyautomation.com
          </a>
        </div>

        {/* Availability row */}
        <div
          style={{
            ...item(540),
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginTop: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          {/* Pulsing dot */}
          <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
            <span
              className="animate-ping"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'hsl(142 71% 45%)',
                opacity: 0.65,
              }}
            />
            <span style={{
              position: 'relative',
              display: 'inline-flex',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'hsl(142 71% 52%)',
              boxShadow: '0 0 8px hsl(142 71% 52% / 0.6)',
            }} />
          </span>
          <span style={{
            fontFamily: 'var(--font-label)',
            fontWeight: 300,
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            color: 'rgba(191, 239, 255, 0.72)',
          }}>
            Available for selected projects
          </span>
        </div>

      </div>
    </section>
  )
}

// ─── Testimonial section ───────────────────────────────────────────────────────

function WorkTestimonial() {
  const { ref, visible } = useScrollReveal(0.1)
  const [starsVis,  setStarsVis]  = useState(false)
  const [quoteVis,  setQuoteVis]  = useState(false)
  const [clientVis, setClientVis] = useState(false)

  useEffect(() => {
    if (!visible) return
    setTimeout(() => setStarsVis(true),  100)
    setTimeout(() => setQuoteVis(true),  380)
    setTimeout(() => setClientVis(true), 720)
  }, [visible])

  return (
    <section
      ref={ref}
      style={{
        background: '#010709',
        borderTop: '1px solid rgba(125, 220, 255, 0.10)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.2rem, 3.5vw, 3rem)',
      }}
    >
      <div style={{ maxWidth: '1480px', margin: '0 auto' }}>

        {/* Stars */}
        <div
          style={{
            display: 'flex',
            gap: '0.35rem',
            marginBottom: 'clamp(2rem, 4vw, 3.2rem)',
            opacity: starsVis ? 1 : 0,
            transform: starsVis ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="16" height="16" viewBox="0 0 24 24"
              fill="hsl(5 72% 58%)"
              style={{
                opacity: starsVis ? 1 : 0,
                transition: `opacity 0.4s ease ${i * 80}ms`,
              }}
            >
              <path d="M12 2l2.9 6.26L22 9.27l-5 5.14 1.18 7.23L12 18.4l-6.18 3.24L7 14.41 2 9.27l7.1-1.01L12 2z"/>
            </svg>
          ))}
        </div>

        {/* Quote */}
        <blockquote
          style={{
            fontFamily: 'var(--font-accent)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(1.7rem, 4vw, 3.4rem)',
            lineHeight: 1.18,
            letterSpacing: '-0.03em',
            color: '#fff',
            maxWidth: '56rem',
            margin: '0 0 clamp(2rem, 4vw, 3rem)',
            opacity: quoteVis ? 1 : 0,
            transform: quoteVis ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          &ldquo;A rare mix of strategy, taste, and execution. The work felt premium from
          the first concept and translated beautifully across every digital touchpoint.&rdquo;
        </blockquote>

        {/* Client */}
        <div
          style={{
            opacity: clientVis ? 1 : 0,
            transform: clientVis ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.75s ease, transform 0.75s cubic-bezier(0.16,1,0.3,1)',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
            letterSpacing: '0.01em',
            color: '#fff',
            margin: '0 0 0.3rem',
          }}>
            Amira Hassan
          </p>
          <p style={{
            fontFamily: 'var(--font-label)',
            fontWeight: 300,
            fontSize: 'clamp(0.78rem, 1.1vw, 0.88rem)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(191, 239, 255, 0.72)',
            margin: 0,
          }}>
            Founder at Vela Studio
          </p>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            height: '1px',
            background: 'rgba(125, 220, 255, 0.10)',
            opacity: clientVis ? 1 : 0,
            transition: 'opacity 0.8s ease 0.2s',
          }}
        />

      </div>
    </section>
  )
}

// ─── Philosophy data ───────────────────────────────────────────────────────────

const PHILOSOPHY_POINTS = [
  {
    num:   '01',
    title: 'Strategy before visuals',
    body:  'We define the message, audience, and creative direction before anything is designed.',
  },
  {
    num:   '02',
    title: 'Design with commercial intent',
    body:  'Every visual decision supports recognition, trust, engagement, or conversion.',
  },
  {
    num:   '03',
    title: 'Built for every touchpoint',
    body:  'We create assets that work across web, social, campaigns, print, and brand systems.',
  },
]

// ─── Philosophy row ─────────────────────────────────────────────────────────────

function PhilosophyRow({
  num, title, body, visible, delay,
}: {
  num: string; title: string; body: string; visible: boolean; delay: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '3rem 1fr',
        gap: '0 2rem',
        padding: 'clamp(1.4rem, 2.5vw, 2rem) 0',
        borderBottom: '1px solid rgba(125, 220, 255, 0.10)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        cursor: 'default',
      }}
    >
      {/* Number */}
      <span
        style={{
          fontFamily: 'var(--font-label)',
          fontWeight: 300,
          fontSize: '0.72rem',
          letterSpacing: '0.06em',
          color: hovered ? 'hsl(195 80% 62%)' : 'rgba(125, 220, 255, 0.55)',
          textShadow: '0 0 10px rgba(125, 220, 255, 0.10)',
          paddingTop: '0.18rem',
          transition: 'color 0.35s ease',
          lineHeight: 1,
        }}
      >
        {num}
      </span>

      <div>
        {/* Accent line */}
        <div
          aria-hidden="true"
          style={{
            width: hovered ? '2rem' : '1.2rem',
            height: '1px',
            background: hovered ? 'hsl(195 80% 55% / 0.7)' : 'hsl(195 80% 55% / 0.25)',
            marginBottom: '0.75rem',
            transition: 'width 0.4s ease, background 0.35s ease',
          }}
        />
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 300,
            fontSize: 'clamp(0.95rem, 1.6vw, 1.12rem)',
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            color: hovered ? '#fff' : 'hsl(0 0% 72%)',
            marginBottom: '0.6rem',
            transition: 'color 0.3s ease',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 'clamp(0.82rem, 1.25vw, 0.92rem)',
            lineHeight: 1.85,
            color: 'rgba(210, 224, 232, 0.68)',
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  )
}

// ─── Project Philosophy section ─────────────────────────────────────────────────

function ProjectPhilosophy() {
  const left  = useScrollReveal(0.08)
  const right = useScrollReveal(0.08)

  const [rowVisible, setRowVisible] = useState([false, false, false])
  useEffect(() => {
    if (!right.visible) return
    PHILOSOPHY_POINTS.forEach((_, i) => {
      setTimeout(() => {
        setRowVisible(prev => { const n = [...prev]; n[i] = true; return n })
      }, 200 + i * 140)
    })
  }, [right.visible])

  return (
    <section
      style={{
        background: '#010709',
        borderTop: '1px solid rgba(125, 220, 255, 0.10)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.2rem, 3.5vw, 3rem)',
      }}
    >
      {/* Grain texture */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="pp-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
      </svg>

      <div
        style={{
          maxWidth: '1480px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 'clamp(3rem, 8vw, 7rem)',
          alignItems: 'start',
        }}
      >

        {/* ── LEFT: label + headline ── */}
        <div
          ref={left.ref}
          style={{
            opacity: left.visible ? 1 : 0,
            transform: left.visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.85s ease, transform 0.85s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Label */}
          <p
            style={{
              fontFamily: 'var(--font-label)',
              fontWeight: 300,
              fontSize: '0.58rem',
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              color: 'hsl(195 80% 60%)',
              marginBottom: '1.8rem',
            }}
          >
            The Thinking Behind the Work
          </p>

          {/* Headline */}
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3.6vw, 3.1rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              color: '#fff',
              marginBottom: '2.2rem',
            }}
          >
            We don&apos;t just make things look{' '}
            <em
              style={{
                fontFamily: 'var(--font-accent)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'hsl(0 0% 58%)',
              }}
            >
              good —
            </em>
            <br />
            we build visual systems with{' '}
            <em
              style={{
                fontFamily: 'var(--font-accent)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'hsl(0 0% 58%)',
              }}
            >
              purpose.
            </em>
          </h2>

          {/* Thin cyan rule */}
          <div
            aria-hidden="true"
            style={{
              width: '2.5rem',
              height: '1px',
              background: 'hsl(195 80% 55% / 0.4)',
            }}
          />
        </div>

        {/* ── RIGHT: paragraph + numbered points ── */}
        <div ref={right.ref}>
          {/* Paragraph */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
              lineHeight: 1.9,
              color: 'rgba(220, 232, 240, 0.72)',
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
              opacity: right.visible ? 1 : 0,
              transform: right.visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
            }}
          >
            Every project starts with clarity: what the brand needs to say, who it needs
            to reach, and how the visual system should make people feel. From strategy to
            final execution, we design work that feels polished, intentional, and built to
            perform across every platform.
          </p>

          {/* Numbered rows */}
          <div style={{ borderTop: '1px solid rgba(125, 220, 255, 0.10)' }}>
            {PHILOSOPHY_POINTS.map((point, i) => (
              <PhilosophyRow
                key={point.num}
                {...point}
                visible={rowVisible[i]}
                delay={i * 140}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Gallery section ───────────────────────────────────────────────────────────

function WorkGallery() {
  const header = useScrollReveal(0.06)
  const row1   = useScrollReveal(0.04)
  const row2   = useScrollReveal(0.04)
  const row3   = useScrollReveal(0.04)

  const [lightbox, setLightbox] = useState<Project | null>(null)
  const openLightbox  = useCallback((p: Project) => setLightbox(p), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  const [cv1, setCv1] = useState([false, false])
  const [cv2, setCv2] = useState([false, false])
  const [cv3, setCv3] = useState([false, false])

  useEffect(() => {
    if (!row1.visible) return
    setTimeout(() => setCv1([true, false]), 0)
    setTimeout(() => setCv1([true, true]),  120)
  }, [row1.visible])

  useEffect(() => {
    if (!row2.visible) return
    setTimeout(() => setCv2([true, false]), 0)
    setTimeout(() => setCv2([true, true]),  140)
  }, [row2.visible])

  useEffect(() => {
    if (!row3.visible) return
    setTimeout(() => setCv3([true, false]), 0)
    setTimeout(() => setCv3([true, true]),  110)
  }, [row3.visible])

  return (
    <>
    {lightbox && (
      <Lightbox
        src={lightbox.src}
        title={lightbox.title}
        category={lightbox.category}
        onClose={closeLightbox}
      />
    )}

    <section style={{ background: '#010709', borderTop: '1px solid rgba(125, 220, 255, 0.10)' }}>
      <div style={{ maxWidth: '1520px', margin: '0 auto', padding: 'clamp(5rem, 9vw, 8rem) clamp(1.2rem, 3.5vw, 3rem)' }}>

        {/* ── Section header ── */}
        <div
          ref={header.ref}
          style={{
            maxWidth: '58rem',
            marginBottom: 'clamp(3.5rem, 6vw, 5.5rem)',
            opacity: header.visible ? 1 : 0,
            transform: header.visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-label)',
            fontWeight: 300,
            fontSize: '0.58rem',
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'hsl(195 80% 60%)',
            marginBottom: '1.6rem',
          }}>
            Selected Work
          </p>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 300,
            fontSize: 'clamp(2rem, 4.2vw, 3.6rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            color: '#f8fafc',
            marginBottom: '1.6rem',
          }}>
            Campaigns crafted to look premium,{' '}
            <em style={{
              fontFamily: 'var(--font-accent)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'hsl(0 0% 58%)',
            }}>
              move fast,
            </em>
            {' '}and refuse to be ordinary.
          </h1>

          <div aria-hidden="true" style={{ width: '2.5rem', height: '1px', background: 'hsl(195 80% 55% / 0.35)', marginBottom: '1.6rem' }} />

          <p style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 'clamp(0.86rem, 1.35vw, 0.98rem)',
            lineHeight: 1.9,
            color: 'rgba(220, 232, 240, 0.74)',
            maxWidth: '40rem',
          }}>
            A curated selection of brand visuals, campaign systems, product launches,
            and digital storytelling created for modern businesses that want to stand out.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════
            DESKTOP EDITORIAL BENTO  (≥ 1024 px)
            ──────────────────────────────────────────────────
            12-col grid, 3 row bands:

            Row 1 — 520px
              Perfume     col 1–8   (cinematic large hero)
              Evy cream   col 8–13  (tall accent portrait)

            Row 2 — 400px
              Taste_summer  col 1–13  (full-width cinematic)

            Row 3 — 380px
              Paradiso (H.png)   col 1–7   (reflowed after removing Baaris)
              Natural Juice      col 7–13  (reflowed after removing A6 Flyer)
        ══════════════════════════════════════════════════ */}

        {/* ─── DESKTOP layout ─── */}
        <div ref={row1.ref}>
          <style>{`
            @media (min-width: 1024px) {
              .wg-desktop { display: grid !important; }
              .wg-mobile  { display: none !important; }
              .wg-tablet  { display: none !important; }
            }
            @media (min-width: 640px) and (max-width: 1023px) {
              .wg-tablet  { display: grid !important; }
              .wg-desktop { display: none !important; }
              .wg-mobile  { display: none !important; }
            }
            @media (max-width: 639px) {
              .wg-mobile  { display: flex !important; }
              .wg-desktop { display: none !important; }
              .wg-tablet  { display: none !important; }
            }
          `}</style>

          {/* ─── Desktop bento ─── */}
          <div
            className="wg-desktop"
            style={{
              display: 'none',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridTemplateRows: '520px 400px 380px',
              gap: '14px',
            }}
          >
            {/* Perfume — large hero col 1–8 row 1 */}
            <div style={{ gridColumn: '1 / 8', gridRow: '1 / 2' }}>
              <ProjectCard project={PROJECTS[0]} delay={0} visible={cv1[0]} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[0])} />
            </div>

            {/* Evy cream — tall col 8–13 row 1 */}
            <div style={{ gridColumn: '8 / 13', gridRow: '1 / 2' }}>
              <ProjectCard project={PROJECTS[1]} delay={120} visible={cv1[1]} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[1])} />
            </div>

            {/* Taste summer — full-width cinematic row 2 */}
            <div ref={row2.ref} style={{ gridColumn: '1 / 13', gridRow: '2 / 3' }}>
              <ProjectCard project={PROJECTS[2]} delay={0} visible={cv2[0]} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[2])} />
            </div>

            {/* Row 3 — two equal cards, reflowed to fill the row after removing Baaris */}
            <div ref={row3.ref} style={{ gridColumn: '1 / 7', gridRow: '3 / 4' }}>
              <ProjectCard project={PROJECTS[3]} delay={0}   visible={cv3[0]} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[3])} />
            </div>
            <div style={{ gridColumn: '7 / 13', gridRow: '3 / 4' }}>
              <ProjectCard project={PROJECTS[4]} delay={110} visible={cv3[1]} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[4])} />
            </div>
          </div>

          {/* ─── Tablet 2-col ─── */}
          <div
            className="wg-tablet"
            style={{ display: 'none', gridTemplateColumns: '1fr 1fr', gap: '12px' }}
          >
            {/* Full-width hero */}
            <div style={{ gridColumn: '1 / 3', height: '380px' }}>
              <ProjectCard project={PROJECTS[0]} delay={0} visible={true} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[0])} />
            </div>
            {[1,2,3,4].map((idx, i) => (
              <div key={idx} style={{ height: '280px' }}>
                <ProjectCard project={PROJECTS[idx]} delay={(i+1)*80} visible={true} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[idx])} />
              </div>
            ))}
          </div>

          {/* ─── Mobile single-col ─── */}
          <div
            className="wg-mobile"
            style={{ display: 'none', flexDirection: 'column', gap: '12px' }}
          >
            {PROJECTS.map((p, i) => (
              <div key={i} style={{ height: i === 0 ? '300px' : '240px' }}>
                <ProjectCard project={p} delay={i * 60} visible={true} style={{ height: '100%' }} onOpen={() => openLightbox(p)} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
    </>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function ImageShowcase() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        id="work"
        className="relative w-full overflow-hidden pb-4 sm:pb-6 lg:pb-0 lg:h-auto"
        style={{ background: '#040B0E' }}
      >
        <video
          src="https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/section-work.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="object-cover object-top h-[63vw] sm:h-[63vw] lg:h-auto lg:object-contain lg:object-center"
          style={{
            display: 'block',
            width: '100%',
          }}
        />

        {/* Bottom fade into next section */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', zIndex: 1,
            background: 'linear-gradient(to bottom, transparent, #040B0E)',
            pointerEvents: 'none',
          }}
        />
      </section>

      {/* ── Section 1 — Video showcase ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: '#040B0E', padding: 'clamp(1.5rem, 3vw, 2.5rem) 0' }}
      >
        <div className="relative max-w-[109rem] mx-auto px-[4px] sm:px-[7px] lg:px-8">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              objectPosition: 'center center',
              borderRadius: '0.75rem',
            }}
          >
            <source src="https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/HERO_SECTION2.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Bottom blend into gallery */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
            background: 'linear-gradient(to bottom, transparent, #010709)',
            pointerEvents: 'none', zIndex: 2,
          }}
        />
      </section>

      {/* ── Premium Work Gallery ── */}
      <WorkGallery />

      {/* ── Project Philosophy ── */}
      <ProjectPhilosophy />

      {/* ── Testimonial ── */}
      <WorkTestimonial />

      {/* ── CTA ── */}
      <WorkCTA />

      {/* ── Contact / Footer ── */}
      <Footer
        heading={<>
          Ready to{' '}
          <em style={{
            fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 400,
            background: 'linear-gradient(90deg, #FFFFFF 0%, #7DDCFF 45%, #B7AEFF 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 24px rgba(125, 220, 255, 0.16)',
          }}>
            automate
          </em>{' '}
          your business?
        </>}
        subtext={<>
          Book a free demo and see how Weavy can manage your calls, messages, bookings, and{' '}
          leads from one <span style={{ color: 'rgba(191, 239, 255, 0.9)', fontWeight: 500 }}>managed AI platform</span>.
        </>}
        ctaLabel="hello@weavyautomation.com"
      />
    </>
  )
}
