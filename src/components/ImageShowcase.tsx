import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'


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
    src:            '/brand_assets/Perfume.png',
    title:          'Midnight Perfume Brand Launch',
    category:       'Luxury Campaign',
    year:           '2026',
    objectPosition: 'center center',
  },
  // [1] Tall accent — Evy cream
  {
    src:            '/brand_assets/Evy_cream.png',
    title:          'EVY Skincare Campaign',
    category:       'Beauty Advertising',
    year:           '2026',
    objectPosition: 'center top',
  },
  // [2] Wide cinematic — Taste summer
  {
    src:            '/brand_assets/Taste_summer.png',
    title:          'Sahra Experiences',
    category:       'Travel Branding',
    year:           '2026',
    objectPosition: 'center center',
  },
  // [3] Square luxury — Baaris
  {
    src:            '/brand_assets/Baaris.png',
    title:          'Baaris Brand Identity',
    category:       'Brand Identity',
    year:           '2026',
    objectPosition: 'center center',
  },
  // [4] Left — H
  {
    src:            '/brand_assets/H.png',
    title:          'Paradiso Holidays',
    category:       'Resort Branding',
    year:           '2026',
    objectPosition: 'center top',
  },
  // [5] Centre — Fefo
  {
    src:            '/brand_assets/Fefo.png',
    title:          'Natural Juice Campaign',
    category:       'Product Advertising',
    year:           '2026',
    objectPosition: 'center center',
  },
  // [6] Right — A6 Flyer
  {
    src:            '/brand_assets/A6_Flyer_Mockup_2.png',
    title:          'Digital Marketing Campaign',
    category:       'Social Media Design',
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
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.58rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'hsl(195 60% 65%)', margin: '0 0 0.3rem' }}>
            {category}
          </p>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
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
          fontFamily: "'Inter', system-ui, sans-serif",
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
          fontFamily: "'Inter', system-ui, sans-serif",
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

// ─── Contact / Footer ─────────────────────────────────────────────────────────

const WCF_HLS = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'
const WCF_MARQUEE = 'BUILDING THE FUTURE \u2022 '

function WcfIconX() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}
function WcfIconLinkedIn() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
function WcfIconDribbble() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm7.369 5.633a10.004 10.004 0 012.187 5.946c-.32-.066-3.52-.712-6.742-.308-.075-.187-.148-.376-.228-.565-.208-.499-.434-1-.669-1.495 3.578-1.458 5.21-3.554 5.452-3.578zM12 2.056a9.955 9.955 0 016.546 2.44c-.196.197-1.673 2.148-5.133 3.444-1.603-2.945-3.381-5.368-3.654-5.752A10.028 10.028 0 0112 2.056zm-4.057.862c.263.369 2.01 2.801 3.633 5.686-4.584 1.218-8.632 1.196-9.056 1.187A10.015 10.015 0 017.943 2.918zM2.048 12.037l.014-.344c.408.01 5.146.041 10.063-1.395.28.547.545 1.104.793 1.664l-.35.097c-5.087 1.647-7.783 6.146-7.99 6.494A9.96 9.96 0 012.048 12.037zm9.952 9.914a9.975 9.975 0 01-6.054-2.043c.165-.318 2.039-3.95 7.625-5.912l.053-.019c1.362 3.534 1.921 6.499 2.066 7.352a9.963 9.963 0 01-3.69.622zm5.624-1.508c-.098-.585-.614-3.414-1.879-6.895 3.024-.484 5.669.311 5.993.416a10.02 10.02 0 01-4.114 6.479z"/>
    </svg>
  )
}
function WcfIconGitHub() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

const WCF_SOCIALS = [
  { label: 'Twitter',  href: '#', Icon: WcfIconX        },
  { label: 'LinkedIn', href: '#', Icon: WcfIconLinkedIn  },
  { label: 'Dribbble', href: '#', Icon: WcfIconDribbble  },
  { label: 'GitHub',   href: '#', Icon: WcfIconGitHub    },
]

function WorkContactFooter() {
  const marqueeRef   = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const [ctaHover, setCtaHover] = useState(false)

  // ── HLS video — only initialise when the footer scrolls into view ────────────
  useEffect(() => {
    const video     = videoRef.current
    const container = containerRef.current
    if (!video || !container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined
    let initialized = false

    const init = () => {
      if (initialized) return
      initialized = true
      import('hls.js').then(({ default: Hls }) => {
        if (!videoRef.current) return
        if (Hls.isSupported()) {
          const hls = new Hls({ startLevel: -1, maxBufferLength: 20, maxMaxBufferLength: 40 })
          hls.loadSource(WCF_HLS)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}) })
          cleanup = () => hls.destroy()
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = WCF_HLS
          video.play().catch(() => {})
        }
      })
    }

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { init(); observer.disconnect() } },
      { rootMargin: '200px' }
    )
    observer.observe(container)
    return () => { observer.disconnect(); cleanup?.() }
  }, [])

  // ── GSAP marquee ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = marqueeRef.current
    if (!el) return
    const tween = gsap.to(el, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
    return () => { tween.kill() }
  }, [])

  return (
    <section ref={containerRef} className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">

      {/* ── Video background ── */}
      <div className="absolute inset-0" aria-hidden="true" style={{ zIndex: 0 }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline aria-hidden="true"
          className="scale-y-[-1]"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div className="absolute inset-0 bg-black/35 lg:bg-black/60" />
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '160px', background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)', zIndex: 2 }} />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '200px', background: 'linear-gradient(to top, #010709 0%, transparent 100%)', zIndex: 2 }} />
      </div>

      {/* ── Content ── */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>

        {/* Eyebrow */}
        <p className="font-sans font-light uppercase mb-10" style={{ fontSize: '0.68rem', letterSpacing: '0.28em', color: 'hsl(199 89% 68%)' }}>
          Get in touch
        </p>

        {/* Marquee */}
        <div
          className="w-full overflow-hidden mb-16"
          aria-hidden="true"
          style={{ borderTop: '1px solid hsl(0 0% 100% / 0.07)', borderBottom: '1px solid hsl(0 0% 100% / 0.07)', padding: '1rem 0' }}
        >
          <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  fontFamily: "'Instrument Serif', 'Didot', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.75rem)',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  color: 'hsl(0 0% 100% / 0.15)',
                  padding: '0 2.5rem',
                }}
              >
                {WCF_MARQUEE}
              </span>
            ))}
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-sans font-light text-text text-center mb-5 px-6" style={{ fontSize: 'clamp(2.4rem, 5.8vw, 4.4rem)', lineHeight: 1.06, letterSpacing: '-0.04em' }}>
          Let&apos;s create something{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(0 0% 72%)' }}>amazing</em>{' '}
          together
        </h2>

        {/* Subtext */}
        <p className="font-sans font-light text-center mb-14 px-6" style={{ fontSize: 'clamp(0.84rem, 1.35vw, 0.96rem)', lineHeight: 1.9, color: 'hsl(0 0% 40%)', maxWidth: '34rem' }}>
          Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can work together.
        </p>

        {/* CTA button */}
        <a
          href="mailto:hello@weavyautomation.com"
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          className="relative mb-24 rounded-full"
          style={{
            padding: '2px',
            display: 'inline-block',
            background: ctaHover
              ? 'linear-gradient(135deg, hsl(199 89% 65%) 0%, hsl(213 90% 55%) 40%, hsl(240 80% 68%) 100%)'
              : 'linear-gradient(135deg, hsl(0 0% 22%) 0%, hsl(0 0% 14%) 100%)',
            boxShadow: ctaHover
              ? '0 0 0 4px hsl(199 89% 60% / 0.12), 0 0 40px -6px hsl(199 89% 60% / 0.5), 0 8px 32px -8px hsl(0 0% 0% / 0.7)'
              : '0 4px 28px -8px hsl(0 0% 0% / 0.65)',
            transition: 'box-shadow 0.35s ease, background 0.35s ease',
          }}
        >
          <span
            className="flex items-center gap-3 rounded-full font-sans font-light"
            style={{
              padding: '1rem 2.4rem',
              background: ctaHover ? 'hsl(205 80% 7%)' : 'hsl(0 0% 5%)',
              fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
              letterSpacing: '0.01em',
              color: ctaHover ? 'hsl(199 89% 80%)' : 'hsl(0 0% 80%)',
              transition: 'color 0.35s ease, background 0.35s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: ctaHover ? 'hsl(199 89% 65%)' : 'hsl(0 0% 32%)', boxShadow: ctaHover ? '0 0 8px hsl(199 89% 65% / 0.8)' : 'none', transition: 'all 0.35s ease' }} />
            hello@weavyautomation.com
            <span aria-hidden="true" style={{ fontSize: '1em', opacity: ctaHover ? 1 : 0.35, transform: ctaHover ? 'translateX(3px)' : 'translateX(0)', transition: 'all 0.35s ease', display: 'inline-block' }}>→</span>
          </span>
        </a>

        {/* Footer bar */}
        <div
          className="w-full px-6 sm:px-10"
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            borderTop: '1px solid hsl(0 0% 100% / 0.06)',
            paddingTop: '1.75rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {/* Availability */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex" style={{ width: 8, height: 8 }}>
              <span className="absolute inline-flex rounded-full animate-ping" style={{ width: '100%', height: '100%', background: 'hsl(142 71% 45%)', opacity: 0.7 }} />
              <span className="relative inline-flex rounded-full" style={{ width: 8, height: 8, background: 'hsl(142 71% 52%)', boxShadow: '0 0 8px hsl(142 71% 52% / 0.6)' }} />
            </span>
            <span className="font-sans font-light" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'hsl(0 0% 48%)' }}>
              Available for projects
            </span>
          </div>

          {/* Copyright */}
          <p className="font-sans font-light text-center" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: 'hsl(0 0% 28%)' }}>
            © {new Date().getFullYear()} Weavy. All rights reserved.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-1 justify-end">
            {WCF_SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label} href={href} aria-label={label}
                className="rounded-full flex items-center justify-center"
                style={{ width: 36, height: 36, color: 'hsl(0 0% 36%)', transition: 'color 0.2s ease, background 0.2s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'hsl(0 0% 84%)'; el.style.background = 'hsl(0 0% 100% / 0.07)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'hsl(0 0% 36%)'; el.style.background = 'transparent' }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
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
        borderTop: '1px solid hsl(0 0% 100% / 0.05)',
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
            fontFamily: "'Inter', system-ui, sans-serif",
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
            fontFamily: "'Inter', system-ui, sans-serif",
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
            fontFamily: "'Instrument Serif', Georgia, serif",
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
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
            lineHeight: 1.9,
            color: 'hsl(0 0% 38%)',
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
              fontFamily: "'Inter', system-ui, sans-serif",
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
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(0.82rem, 1.2vw, 0.9rem)',
              letterSpacing: '0.02em',
              color: emailHover ? 'hsl(0 0% 78%)' : 'hsl(0 0% 36%)',
              textDecoration: 'none',
              borderBottom: `1px solid ${emailHover ? 'hsl(0 0% 78% / 0.5)' : 'hsl(0 0% 36% / 0.3)'}`,
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
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            color: 'hsl(0 0% 36%)',
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
        borderTop: '1px solid hsl(0 0% 100% / 0.05)',
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
            fontFamily: "'Instrument Serif', Georgia, serif",
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
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
            letterSpacing: '0.01em',
            color: '#fff',
            margin: '0 0 0.3rem',
          }}>
            Amira Hassan
          </p>
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(0.78rem, 1.1vw, 0.88rem)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'hsl(0 0% 32%)',
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
            background: 'hsl(0 0% 100% / 0.06)',
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
        borderBottom: '1px solid hsl(0 0% 100% / 0.06)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        cursor: 'default',
      }}
    >
      {/* Number */}
      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: '0.72rem',
          letterSpacing: '0.06em',
          color: hovered ? 'hsl(195 80% 62%)' : 'hsl(0 0% 28%)',
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
            fontFamily: "'Inter', system-ui, sans-serif",
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
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(0.82rem, 1.25vw, 0.92rem)',
            lineHeight: 1.85,
            color: 'hsl(0 0% 36%)',
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
        borderTop: '1px solid hsl(0 0% 100% / 0.05)',
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
              fontFamily: "'Inter', system-ui, sans-serif",
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
              fontFamily: "'Inter', system-ui, sans-serif",
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
                fontFamily: "'Instrument Serif', Georgia, serif",
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
                fontFamily: "'Instrument Serif', Georgia, serif",
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
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
              lineHeight: 1.9,
              color: 'hsl(0 0% 40%)',
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
          <div style={{ borderTop: '1px solid hsl(0 0% 100% / 0.06)' }}>
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
  const [cv3, setCv3] = useState([false, false, false])

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
    setTimeout(() => setCv3([true, false, false]), 0)
    setTimeout(() => setCv3([true, true,  false]), 110)
    setTimeout(() => setCv3([true, true,  true]),  220)
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

    <section style={{ background: '#010709', borderTop: '1px solid hsl(0 0% 100% / 0.05)' }}>
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
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.58rem',
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'hsl(195 80% 60%)',
            marginBottom: '1.6rem',
          }}>
            Selected Work
          </p>

          <h2 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(2rem, 4.2vw, 3.6rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            color: '#f8fafc',
            marginBottom: '1.6rem',
          }}>
            Campaigns crafted to look premium,{' '}
            <em style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'hsl(0 0% 58%)',
            }}>
              move fast,
            </em>
            {' '}and refuse to be ordinary.
          </h2>

          <div aria-hidden="true" style={{ width: '2.5rem', height: '1px', background: 'hsl(195 80% 55% / 0.35)', marginBottom: '1.6rem' }} />

          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(0.86rem, 1.35vw, 0.98rem)',
            lineHeight: 1.9,
            color: 'hsl(0 0% 36%)',
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
              Baaris        col 1–5   (square luxury)
              this_one      col 5–9   (product portrait)
              A6 Flyer      col 9–13  (social square)

            H.png spans rows 1–2 on the far right as a
            floating tall card — editorial magazine feel.
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

            {/* Row 3 — three equal cards */}
            <div ref={row3.ref} style={{ gridColumn: '1 / 5', gridRow: '3 / 4' }}>
              <ProjectCard project={PROJECTS[3]} delay={0}   visible={cv3[0]} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[3])} />
            </div>
            <div style={{ gridColumn: '5 / 9', gridRow: '3 / 4' }}>
              <ProjectCard project={PROJECTS[4]} delay={110} visible={cv3[1]} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[4])} />
            </div>
            <div style={{ gridColumn: '9 / 13', gridRow: '3 / 4' }}>
              <ProjectCard project={PROJECTS[5]} delay={220} visible={cv3[2]} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[5])} />
            </div>

            {/* A6 Flyer — bonus card appended below as full row */}
          </div>

          {/* A6 flyer — standalone full-width row under bento (desktop) */}
          <div
            className="wg-desktop"
            style={{ display: 'none', marginTop: '14px', height: '340px' }}
          >
            <ProjectCard project={PROJECTS[6]} delay={0} visible={true} style={{ height: '100%' }} onOpen={() => openLightbox(PROJECTS[6])} />
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
            {[1,2,3,4,5,6].map((idx, i) => (
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
        className="relative w-full overflow-hidden"
        style={{ background: '#040B0E' }}
      >
        <video
          src="https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/section-work.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
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
        className="relative w-full overflow-hidden h-[50vh] sm:h-[65vh] lg:h-screen"
        style={{ background: '#040B0E' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        >
          <source src="https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/HERO_SECTION2.mp4" type="video/mp4" />
        </video>

        {/* Bottom blend into gallery */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
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
      <WorkContactFooter />
    </>
  )
}
