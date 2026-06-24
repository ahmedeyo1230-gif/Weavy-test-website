import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Globe, Bot, BarChart2, Sparkles, Video, Settings2, Plug, Clock, UserCheck, CalendarDays, Zap, Camera, Target, Layers } from 'lucide-react'
import { MessengerGlowBackground, SoftYellowGlow } from './ui/background-components'
import { TestimonialsSection } from './ui/testimonials-1'
import { GridBackground, DarkGridBg, NoiseCanvasBg, DarkSphereGridBg } from './ui/grid-background'
import { BeamsBackgroundLayer } from './ui/beams-background'
import { CircularGallery, type GalleryItem } from './ui/circular-gallery'
import { GradientBlurBg } from './ui/gradient-blur-bg'
import { BorderRotate } from './ui/animated-gradient-border'

gsap.registerPlugin(ScrollTrigger)

// ─── Lazy HLS hook — IntersectionObserver gated ───────────────────────────────
function useHlsVideo(src: string) {
  const videoRef     = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
          hls.loadSource(src)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}) })
          cleanup = () => hls.destroy()
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src
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
  }, [src])

  return { videoRef, containerRef }
}

// ─── Service data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'bespoke-website-design',
    icon: Globe,
    title: 'Bespoke Website Design',
    description: 'Tailored, high-performance websites designed for brand identity and user experience.',
    accent: 'hsl(205 85% 62%)',        // blue
    accentMuted: 'hsl(205 85% 62% / 0.12)',
    accentBorder: 'hsl(205 85% 62% / 0.35)',
    accentGlow: 'hsl(205 85% 62% / 0.22)',
  },
  {
    id: 'custom-chatbots',
    icon: Bot, // replaced below via customIcon
    customIcon: (color: string) => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="cbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(195 90% 68%)"/>
            <stop offset="100%" stopColor="hsl(215 85% 55%)"/>
          </linearGradient>
        </defs>
        {/* bubble */}
        <rect x="2" y="2" width="14" height="12" rx="3" stroke={color} strokeWidth="1.2" fill="none"/>
        <path d="M6 14l-2 2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
        {/* eyes */}
        <circle cx="6.5" cy="8" r="1" fill={color}/>
        <circle cx="11.5" cy="8" r="1" fill={color}/>
        {/* antenna */}
        <line x1="9" y1="2" x2="9" y2="0.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="9" cy="0.5" r="0.8" fill={color}/>
      </svg>
    ),
    title: 'Custom Chatbots',
    description: 'Intelligent AI chatbots for automation, support, and customer engagement.',
    accent: 'hsl(150 58% 50%)',        // green
    accentMuted: 'hsl(150 58% 50% / 0.12)',
    accentBorder: 'hsl(150 58% 50% / 0.35)',
    accentGlow: 'hsl(150 58% 50% / 0.22)',
  },
  {
    id: 'social-media-marketing',
    icon: BarChart2,
    title: 'Social Media Marketing',
    description: 'Data-driven strategies to grow audience, reach, and conversions.',
    accent: 'hsl(280 65% 65%)',        // purple
    accentMuted: 'hsl(280 65% 65% / 0.12)',
    accentBorder: 'hsl(280 65% 65% / 0.35)',
    accentGlow: 'hsl(280 65% 65% / 0.22)',
  },
  {
    id: 'graphic-design-animation',
    icon: Sparkles,
    title: 'Graphic Design / Animation',
    description: 'High-quality visuals, branding assets, and engaging motion graphics.',
    accent: 'hsl(38 90% 58%)',         // amber
    accentMuted: 'hsl(38 90% 58% / 0.12)',
    accentBorder: 'hsl(38 90% 58% / 0.35)',
    accentGlow: 'hsl(38 90% 58% / 0.22)',
  },
  {
    id: 'ugc',
    icon: Video,
    title: 'UGC',
    description: 'Authentic content creation to boost trust and audience connection.',
    accent: 'hsl(0 72% 60%)',          // red
    accentMuted: 'hsl(0 72% 60% / 0.12)',
    accentBorder: 'hsl(0 72% 60% / 0.35)',
    accentGlow: 'hsl(0 72% 60% / 0.22)',
  },
]

// ─── Card ─────────────────────────────────────────────────────────────────────

interface ServiceCardProps {
  service: typeof SERVICES[number]
  index: number
  onLearnMore?: () => void
}

function ServiceCard({ service, onLearnMore }: ServiceCardProps) {
  const Icon = service.icon
  const hasCustomIcon = 'customIcon' in service && typeof service.customIcon === 'function'

  return (
    <a
      href={`#${service.id}-detail`}
      className="service-card group block no-underline"
      style={{ scrollBehavior: 'smooth' } as React.CSSProperties}
      onClick={e => {
        e.preventDefault()
        if (onLearnMore) {
          onLearnMore()
          setTimeout(() => {
            document.getElementById(`${service.id}-detail`)?.scrollIntoView({ behavior: 'smooth' })
          }, 50)
        } else {
          document.getElementById(`${service.id}-detail`)?.scrollIntoView({ behavior: 'smooth' })
        }
      }}
    >
      {/* Outer border shell */}
      <div
        data-shell
        className="relative rounded-2xl p-px transition-shadow duration-500"
        style={{
          background: `linear-gradient(145deg, ${service.accentBorder}, hsl(0 0% 12% / 0.6) 40%, ${service.accentBorder})`,
          boxShadow: `0 0 0 0 ${service.accentGlow}`,
          transition: 'box-shadow 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* ── Icon badge embedded on the top border ── */}
        <div
          className="absolute -top-5 left-6 z-10 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, hsl(215 18% 10%) 0%, hsl(215 12% 7%) 100%)`,
            border: `1px solid ${service.accentBorder}`,
            boxShadow: `0 0 16px -3px ${service.accent}, 0 2px 8px -2px hsl(0 0% 0% / 0.6)`,
          }}
        >
          {hasCustomIcon
            ? (service as typeof service & { customIcon: (c: string) => React.ReactNode }).customIcon(service.accent)
            : <Icon size={18} strokeWidth={1.5} style={{ color: service.accent }}
                className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
          }
        </div>

        {/* Inner card surface */}
        <div
          className="relative rounded-2xl flex flex-col pt-8 pb-6 px-6 overflow-hidden"
          style={{
            background: 'linear-gradient(150deg, hsl(215 22% 9% / 0.98) 0%, hsl(215 14% 6% / 0.99) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Top-corner ambient bloom */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0"
            style={{
              width: '160px', height: '120px',
              background: `radial-gradient(circle at 0% 0%, ${service.accentMuted} 0%, transparent 70%)`,
            }}
          />

          {/* Title */}
          <h3
            className="font-sans font-light text-text mb-3 relative z-10"
            style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
            }}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p
            className="font-sans font-light relative z-10 mb-6 flex-1"
            style={{
              fontSize: '0.82rem',
              color: 'hsl(0 0% 48%)',
              lineHeight: 1.75,
            }}
          >
            {service.description}
          </p>

          {/* Learn More button */}
          <div className="relative z-10">
            <span
              className="inline-flex items-center gap-1.5 font-sans text-xs font-light tracking-wide uppercase transition-colors duration-200"
              style={{
                color: service.accent,
                letterSpacing: '0.1em',
              }}
            >
              Learn More
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          {/* Bottom accent dot */}
          <div
            aria-hidden="true"
            className="absolute bottom-4 right-4 w-1 h-1 rounded-full pointer-events-none"
            style={{
              background: service.accent,
              boxShadow: `0 0 8px 2px ${service.accentGlow}`,
              opacity: 0.7,
            }}
          />
        </div>
      </div>
    </a>
  )
}

// ─── Bespoke Follow-Up Section ───────────────────────────────────────────────

function BespokeFollowUp() {
  const ref           = useRef<HTMLElement>(null)
  const primaryRef    = useRef<HTMLDivElement>(null)   // 3-D tilt + float target
  const secondaryRef  = useRef<HTMLDivElement>(null)   // cursor-parallax target
  const hasCountedRef = useRef(false)
  const [s1, setS1]   = useState(0)   // → 320
  const [s2, setS2]   = useState(0)   // → 48  (/10 = 4.8)
  const [s3, setS3]   = useState(0)   // → 92

  // ── Cursor-reactive 3-D parallax ──────────────────────────────────────────
  useEffect(() => {
    const section = ref.current
    if (!section) return

    // Set initial subtle 3-D tilt
    if (primaryRef.current) {
      gsap.set(primaryRef.current, { rotateX: 3, rotateY: -5, transformPerspective: 1500 })
    }

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width  - 0.5
      const y = (e.clientY - r.top)  / r.height - 0.5
      if (primaryRef.current) {
        gsap.to(primaryRef.current, { rotateX: 3 - y * 4, rotateY: -5 + x * 7, transformPerspective: 1500, duration: 1.6, ease: 'power2.out' })
      }
      if (secondaryRef.current) {
        gsap.to(secondaryRef.current, { x: x * 24, y: y * 16, duration: 2, ease: 'power2.out' })
      }
    }
    section.addEventListener('mousemove', onMove)
    return () => section.removeEventListener('mousemove', onMove)
  }, [])

  // ── Scroll reveal + gentle float + counters ────────────────────────────────
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reveals = el.querySelectorAll('.bfu3-r')
    gsap.set(reveals, { opacity: 0, y: 40 })

    // Gentle float on primary — uses y; cursor uses rotateX/Y — no conflict
    if (primaryRef.current) {
      gsap.to(primaryRef.current, { y: -10, duration: 4.8, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.6 })
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.to(reveals, { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out', stagger: 0.1 })
      if (!hasCountedRef.current) {
        hasCountedRef.current = true
        const run = (setter: (v: number) => void, target: number, step: number, ms: number) => {
          let v = 0
          const id = setInterval(() => { v = Math.min(v + step, target); setter(v); if (v >= target) clearInterval(id) }, ms)
        }
        run(setS1, 320, 7, 16)
        run(setS2,  48, 1, 38)
        run(setS3,  92, 2, 22)
      }
      obs.disconnect()
    }, { threshold: 0.08 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 8vw, 8rem) 0 clamp(4rem, 7vw, 7rem)' }}
    >
      {/* ── Grain ── */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.026 }}>
        <filter id="bfu3-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#bfu3-gr)" fill="white"/>
      </svg>

      {/* ── Ambient — centre-top bloom ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 70% 55% at 50% 28%, hsl(199 89% 60% / 0.06) 0%, transparent 70%)',
          'radial-gradient(ellipse 35% 28% at 82% 72%, hsl(215 80% 55% / 0.025) 0%, transparent 60%)',
        ].join(', '),
      }}/>

      {/* ── Cinematic vignette ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 90% at 50% 50%, transparent 44%, hsl(0 0% 0% / 0.3) 100%)',
      }}/>

      {/* Section boundary fades — mask vignette/grain cutoff at overflow:hidden edges */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      {/* ════════════════════════════════════════════════════════
          UPPER — Full-width editorial header
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[88rem] mx-auto px-6 sm:px-12 mb-16">

        {/* Metadata bar */}
        <div
          className="bfu3-r flex items-center justify-between pb-5 mb-12"
          style={{ borderBottom: '1px solid hsl(0 0% 100% / 0.06)' }}
        >
          <div className="flex items-center gap-4">
            <div style={{ width: 24, height: 1, background: 'hsl(199 89% 60% / 0.55)' }}/>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'hsl(199 89% 60%)', fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500 }}>
              02 — Conversion-Focused Design
            </span>
          </div>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'hsl(0 0% 28%)', fontFamily: 'var(--font-sans, sans-serif)' }}>
            Bespoke Website Design
          </span>
        </div>

        {/* Heading left / body+stats right */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 lg:gap-20">

          {/* Oversized stacked heading */}
          <div className="bfu3-r" style={{ letterSpacing: '-0.046em', lineHeight: 0.87, flexShrink: 0 }}>
            <p style={{
              fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 200,
              fontSize: 'clamp(3.8rem, 8.5vw, 7.5rem)',
              color: 'hsl(0 0% 90%)', display: 'block', marginBottom: '0.04em',
            }}>Designed</p>
            <p style={{
              fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400,
              fontSize: 'clamp(3.8rem, 8.5vw, 7.5rem)',
              color: 'hsl(0 0% 44%)', display: 'block',
            }}>to convert.</p>
          </div>

          {/* Body copy + editorial stat numbers */}
          <div className="bfu3-r" style={{ maxWidth: '26rem', paddingBottom: '0.5rem' }}>
            <p className="font-sans font-light mb-10" style={{
              fontSize: 'clamp(0.84rem, 1.3vw, 0.98rem)', lineHeight: 1.9, color: '#F2F8FC',
            }}>
              Your website should do more than look good. We build clear, fast, and persuasive
              experiences that help people understand your value and take action.
            </p>

            {/* Editorial stat trio */}
            <div className="flex gap-8 sm:gap-10">
              {([
                { val: `+${s1}%`,                label: 'Conversion Growth', col: 'hsl(199 89% 65%)' },
                { val: `${(s2/10).toFixed(1)}×`, label: 'Engagement',        col: 'hsl(145 65% 50%)' },
                { val: `${s3}%`,                 label: 'Faster Action',     col: 'hsl(280 65% 65%)' },
              ] as const).map(({ val, label, col }) => (
                <div key={label}>
                  <p style={{
                    fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 300,
                    fontSize: 'clamp(1.4rem, 2.5vw, 2.1rem)',
                    color: col, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.4rem',
                  }}>{val}</p>
                  <p style={{
                    fontFamily: 'var(--font-sans, sans-serif)', fontSize: '0.6rem',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'hsl(0 0% 32%)', fontWeight: 400,
                  }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          LOWER — Panoramic mockup stage
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[88rem] mx-auto px-6 sm:px-12">
        <div className="relative" style={{ minHeight: '580px' }}>

          {/* Glow behind all mockups */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: '-64px',
            background: 'radial-gradient(ellipse 80% 65% at 42% 55%, hsl(199 89% 60% / 0.11) 0%, transparent 65%)',
            filter: 'blur(52px)', zIndex: 0,
          }}/>

          {/* ── PRIMARY MOCKUP — perspective-tilted, left-anchored ── */}
          {/* Outer: scroll-reveal (opacity/y). Inner: GSAP 3-D tilt + float (rotateX/Y + y). No conflict. */}
          <div
            className="bfu3-r"
            style={{ position: 'relative', zIndex: 3, width: '72%' }}
          >
            <div
              ref={primaryRef}
              style={{
                borderRadius: '1.25rem', overflow: 'hidden',
                border: '1px solid hsl(0 0% 100% / 0.08)',
                boxShadow: [
                  '0 4px 8px hsl(0 0% 0% / 0.5)',
                  '0 60px 130px -28px hsl(0 0% 0% / 0.92)',
                  '0 0 0 1px hsl(199 89% 60% / 0.04) inset',
                ].join(', '),
                background: 'hsl(220 28% 6%)',
                cursor: 'default',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Chrome */}
              <div style={{ padding: '0.6rem 1rem', background: 'hsl(220 26% 8%)', borderBottom: '1px solid hsl(0 0% 100% / 0.06)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'hsl(0 70% 45% / 0.42)' }}/>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'hsl(40 75% 48% / 0.36)' }}/>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'hsl(120 48% 40% / 0.36)' }}/>
                <div style={{ marginLeft: '0.75rem', flex: 1, height: 22, borderRadius: 6, background: 'hsl(0 0% 100% / 0.03)', border: '1px solid hsl(0 0% 100% / 0.06)', display: 'flex', alignItems: 'center', paddingLeft: 10, gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'hsl(199 89% 60% / 0.3)' }}/>
                  <div style={{ height: 4, width: '28%', borderRadius: 3, background: 'hsl(0 0% 100% / 0.1)' }}/>
                </div>
              </div>

              {/* Page body */}
              <div style={{ background: 'linear-gradient(170deg, hsl(220 30% 7%) 0%, hsl(220 26% 5%) 100%)' }}>

                {/* Nav */}
                <div style={{ padding: '1.4rem 2.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid hsl(0 0% 100% / 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'hsl(199 89% 60% / 0.2)', border: '1px solid hsl(199 89% 60% / 0.3)' }}/>
                    <div style={{ height: 8, width: 56, borderRadius: 4, background: 'hsl(0 0% 100% / 0.2)' }}/>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {[40, 48, 36, 44].map((w, i) => <div key={i} style={{ height: 4, width: w, borderRadius: 3, background: 'hsl(0 0% 100% / 0.08)' }}/>)}
                    <div style={{ height: 30, width: 88, borderRadius: 999, background: 'hsl(199 89% 60% / 0.16)', border: '1px solid hsl(199 89% 60% / 0.3)', boxShadow: '0 0 16px -4px hsl(199 89% 60% / 0.2)' }}/>
                  </div>
                </div>

                {/* Hero — gradient blobs + editorial content */}
                <div style={{ position: 'relative', padding: '3rem 2.2rem 2.5rem', overflow: 'hidden' }}>
                  {/* Atmospheric blobs inside the mockup */}
                  <div aria-hidden="true" style={{ position: 'absolute', top: '-30%', right: '5%', width: '50%', height: '220%', background: 'radial-gradient(circle, hsl(199 89% 60% / 0.14) 0%, transparent 70%)', filter: 'blur(44px)' }}/>
                  <div aria-hidden="true" style={{ position: 'absolute', bottom: '-15%', left: '15%', width: '40%', height: '160%', background: 'radial-gradient(circle, hsl(280 65% 60% / 0.07) 0%, transparent 70%)', filter: 'blur(44px)' }}/>

                  <div style={{ position: 'relative' }}>
                    {/* Status badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 999, background: 'hsl(199 89% 60% / 0.1)', border: '1px solid hsl(199 89% 60% / 0.24)', marginBottom: '1.5rem' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'hsl(199 89% 60%)', boxShadow: '0 0 7px hsl(199 89% 60% / 0.9)' }}/>
                      <div style={{ height: 4, width: 72, borderRadius: 3, background: 'hsl(199 89% 60% / 0.44)' }}/>
                    </div>

                    {/* Editorial heading bars — graded weight creates typographic depth */}
                    <div style={{ marginBottom: '1.6rem' }}>
                      <div style={{ height: 30, width: '84%', borderRadius: 6, background: 'linear-gradient(to right, hsl(0 0% 100% / 0.24), hsl(0 0% 100% / 0.12))', marginBottom: '0.6rem' }}/>
                      <div style={{ height: 30, width: '63%', borderRadius: 6, background: 'linear-gradient(to right, hsl(0 0% 100% / 0.16), hsl(0 0% 100% / 0.07))', marginBottom: '0.6rem' }}/>
                      <div style={{ height: 30, width: '42%', borderRadius: 6, background: 'linear-gradient(to right, hsl(199 89% 60% / 0.28), hsl(199 89% 60% / 0.07), transparent)' }}/>
                    </div>

                    {/* Body text */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.42rem', marginBottom: '1.8rem' }}>
                      <div style={{ height: 5, width: '70%', borderRadius: 3, background: 'hsl(0 0% 100% / 0.07)' }}/>
                      <div style={{ height: 5, width: '55%', borderRadius: 3, background: 'hsl(0 0% 100% / 0.07)' }}/>
                      <div style={{ height: 5, width: '63%', borderRadius: 3, background: 'hsl(0 0% 100% / 0.05)' }}/>
                    </div>

                    {/* CTAs */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ height: 42, width: 140, borderRadius: 999, background: 'hsl(199 89% 60% / 0.22)', border: '1px solid hsl(199 89% 60% / 0.42)', boxShadow: '0 0 32px -6px hsl(199 89% 60% / 0.3)' }}/>
                      <div style={{ height: 42, width: 112, borderRadius: 999, background: 'hsl(0 0% 100% / 0.04)', border: '1px solid hsl(0 0% 100% / 0.1)' }}/>
                    </div>
                  </div>
                </div>

                {/* Work showcase grid — coloured project cards */}
                <div style={{ padding: '0 2.2rem 2.2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.7rem' }}>
                  {[
                    { bg: 'linear-gradient(135deg, hsl(199 89% 14%) 0%, hsl(215 80% 10%) 100%)', accent: 'hsl(199 89% 60%)' },
                    { bg: 'linear-gradient(135deg, hsl(270 50% 13%) 0%, hsl(280 60% 17%) 100%)', accent: 'hsl(280 65% 65%)' },
                    { bg: 'linear-gradient(135deg, hsl(28 60% 12%) 0%, hsl(18 70% 15%) 100%)',   accent: 'hsl(28 85% 58%)' },
                  ].map(({ bg, accent }, i) => (
                    <div key={i} style={{ borderRadius: 12, padding: '1.2rem', background: bg, border: `1px solid ${accent}28`, height: 104, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: 6, background: `${accent}22`, border: `1px solid ${accent}40` }}/>
                      <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                        <div style={{ height: 5, width: '58%', borderRadius: 3, background: 'hsl(0 0% 100% / 0.22)', marginBottom: '0.4rem' }}/>
                        <div style={{ height: 4, width: '78%', borderRadius: 3, background: 'hsl(0 0% 100% / 0.1)' }}/>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* ── SECONDARY MOCKUP — right, cursor-parallax, subtle tilt ── */}
          {/* Outer: scroll-reveal. Inner: cursor parallax target. Rotation on innermost CSS layer. */}
          <div
            className="bfu3-r"
            style={{ position: 'absolute', top: '4%', right: 0, width: '30%', zIndex: 4 }}
          >
            <div ref={secondaryRef}>
              <div style={{
                borderRadius: '1.1rem', overflow: 'hidden',
                border: '1px solid hsl(0 0% 100% / 0.1)',
                boxShadow: [
                  '0 20px 60px -12px hsl(0 0% 0% / 0.78)',
                  '0 0 40px -20px hsl(199 89% 60% / 0.12)',
                ].join(', '),
                background: 'hsl(218 26% 7%)',
                transform: 'rotate(2.5deg)',
                transformOrigin: 'top right',
                opacity: 0.92,
              }}>
                <div style={{ padding: '0.5rem 0.9rem', background: 'hsl(218 24% 9%)', borderBottom: '1px solid hsl(0 0% 100% / 0.06)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {[0, 40, 120].map((h, i) => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: `hsl(${h} 60% 45% / 0.38)` }}/>)}
                  <div style={{ marginLeft: 6, flex: 1, height: 16, borderRadius: 4, background: 'hsl(0 0% 100% / 0.03)', border: '1px solid hsl(0 0% 100% / 0.05)' }}/>
                </div>
                <div style={{ padding: '1.4rem 1.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ height: 5, width: '42%', borderRadius: 3, background: 'hsl(0 0% 100% / 0.15)' }}/>
                    <div style={{ height: 4, width: '22%', borderRadius: 3, background: 'hsl(199 89% 60% / 0.42)' }}/>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem', marginBottom: '1rem' }}>
                    {[
                      { col: 'hsl(199 89% 60%)', val: '98%',  lw: '55%' },
                      { col: 'hsl(145 70% 48%)', val: '4.8×', lw: '65%' },
                    ].map(({ col, val, lw }, i) => (
                      <div key={i} style={{ borderRadius: 9, padding: '0.75rem 0.85rem', background: 'hsl(220 28% 9%)', border: '1px solid hsl(0 0% 100% / 0.07)' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 300, color: col, fontFamily: 'var(--font-sans, sans-serif)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>{val}</div>
                        <div style={{ height: 4, width: lw, borderRadius: 3, background: 'hsl(0 0% 100% / 0.08)' }}/>
                      </div>
                    ))}
                  </div>
                  {/* Bar chart — trailing bars in cyan */}
                  <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 46, marginBottom: '0.7rem' }}>
                    {[38, 52, 44, 62, 56, 70, 65, 78, 72, 90].map((h, i) => (
                      <div key={i} style={{
                        flex: 1, height: `${h}%`, borderRadius: 3,
                        background: i >= 8 ? 'hsl(199 89% 60%)' : `hsl(199 89% 60% / ${0.05 + i * 0.022})`,
                        boxShadow: i >= 8 ? '0 0 9px hsl(199 89% 60% / 0.5)' : 'none',
                      }}/>
                    ))}
                  </div>
                  <div style={{ height: 4, width: '68%', borderRadius: 3, background: 'hsl(0 0% 100% / 0.07)', marginBottom: '0.35rem' }}/>
                  <div style={{ height: 4, width: '48%', borderRadius: 3, background: 'hsl(0 0% 100% / 0.05)' }}/>
                </div>
              </div>
            </div>
          </div>

          {/* ── FLOATING GLASS CARD — bottom-left, overlapping mockup ── */}
          <div
            className="bfu3-r"
            style={{
              position: 'absolute', bottom: '-14px', left: '8%', zIndex: 5,
              borderRadius: 14, padding: '0.9rem 1.25rem',
              background: 'hsl(218 24% 7% / 0.92)',
              backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
              border: '1px solid hsl(0 0% 100% / 0.1)',
              boxShadow: '0 20px 50px -8px hsl(0 0% 0% / 0.55)',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'hsl(199 89% 60% / 0.12)', border: '1px solid hsl(199 89% 60% / 0.26)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: 'hsl(199 89% 60% / 0.5)' }}/>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '0.78rem', fontWeight: 300, color: 'hsl(0 0% 86%)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>
                Conversion rate up
              </p>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '0.6rem', color: 'hsl(0 0% 36%)', letterSpacing: '0.04em' }}>
                Last 30 days vs. previous period
              </p>
            </div>
            <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '1.15rem', fontWeight: 300, color: 'hsl(145 65% 52%)', letterSpacing: '-0.03em', marginLeft: '0.4rem', flexShrink: 0 }}>
              +{s1}%
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Bespoke Care Stories (Section 4) ───────────────────────────────────────

function BespokeCareStories() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.set(el.querySelectorAll('.bcs-img'),     { opacity: 0, x: -36 })
    gsap.set(el.querySelectorAll('.bcs-eyebrow'), { opacity: 0, y: 18 })
    gsap.set(el.querySelectorAll('.bcs-hword'),   { opacity: 0, y: '110%' })
    gsap.set(el.querySelectorAll('.bcs-body'),    { opacity: 0, y: 22 })
    gsap.set(el.querySelectorAll('.bcs-feat'),    { opacity: 0, y: 16 })

    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(el.querySelectorAll('.bcs-img'),     { opacity: 1, x: 0, duration: 1.1, ease: 'power2.out' }, 0)
      tl.to(el.querySelectorAll('.bcs-eyebrow'), { opacity: 1, y: 0, duration: 0.6 }, 0.18)
      tl.to(el.querySelectorAll('.bcs-hword'),   { opacity: 1, y: '0%', duration: 0.72, stagger: 0.08, ease: 'power3.out' }, 0.3)
      tl.to(el.querySelectorAll('.bcs-body'),    { opacity: 1, y: 0, duration: 0.7, stagger: 0.14 }, 0.52)
      tl.to(el.querySelectorAll('.bcs-feat'),    { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, 0.72)
      obs.disconnect()
    }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        background: '#010709',
        padding: 'clamp(5rem, 9vw, 8rem) 0',
      }}
    >
      {/* Subtle warm ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 20% 55%, hsl(36 50% 55% / 0.04) 0%, transparent 65%)',
      }}/>

      {/* Section boundary fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div className="relative z-10 max-w-[80rem] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Image ── */}
          <div className="bcs-img relative">
            {/* Soft glow behind image */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: '-24px',
              background: 'radial-gradient(ellipse 75% 65% at 50% 50%, hsl(36 45% 55% / 0.07) 0%, transparent 70%)',
              filter: 'blur(28px)',
              pointerEvents: 'none',
            }}/>

            {/* Image container */}
            <div style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: [
                '0 40px 90px -16px hsl(0 0% 0% / 0.82)',
                '0 8px 24px -6px hsl(0 0% 0% / 0.45)',
                '0 0 0 1px hsl(36 30% 60% / 0.1)',
              ].join(', '),
            }}>
              <img
                loading="lazy"
                decoding="async"
                src="/brand_assets/Website_examples.png"
                alt="CareWell — bespoke website designed for a care support brand"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  maxHeight: 'clamp(300px, 38vw, 480px)',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                }}
              />
              {/* Thin bottom vignette */}
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
                background: 'linear-gradient(to top, hsl(210 20% 3% / 0.35) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}/>
            </div>
          </div>

          {/* ── RIGHT: Text ── */}
          <div style={{ paddingTop: 'clamp(0rem, 2vw, 1.5rem)' }}>

            {/* Eyebrow */}
            <p
              className="bcs-eyebrow font-sans uppercase"
              style={{
                fontSize: '0.64rem',
                letterSpacing: '0.34em',
                color: 'hsl(36 40% 58%)',
                marginBottom: '1.4rem',
              }}
            >
              Care Stories
            </p>

            {/* Headline — word-by-word reveal */}
            <h2
              className="font-sans font-light"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.035em',
                color: 'hsl(36 18% 92%)',
                marginBottom: '1.8rem',
              }}
            >
              {['Support', 'That', 'Feels'].map((w, i) => (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.22em', paddingBottom: '0.04em' }}>
                  <span className="bcs-hword" style={{ display: 'inline-block', transform: 'translateY(110%)', opacity: 0 }}>{w}</span>
                </span>
              ))}
              <em style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.04em',
                fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
                <span className="bcs-hword" style={{ display: 'inline-block', transform: 'translateY(110%)', opacity: 0,
                  color: 'hsl(36 45% 70%)' }}>Human.</span>
              </em>
            </h2>

            {/* Body paragraphs */}
            <p
              className="bcs-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.86rem, 1.35vw, 0.98rem)',
                lineHeight: 1.85,
                color: '#F2F8FC',
                maxWidth: '34rem',
                marginBottom: '1.2rem',
              }}
            >
              Practical guidance, thoughtful advice, and real stories designed to help families navigate care with more clarity and confidence. Every resource is created to feel reassuring, useful, and easy to understand.
            </p>

            <p
              className="bcs-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.86rem, 1.35vw, 0.98rem)',
                lineHeight: 1.85,
                color: '#F2F8FC',
                maxWidth: '34rem',
                marginBottom: '2.4rem',
              }}
            >
              From everyday support to deeper insight, we shape content that connects with people emotionally while delivering information in a calm, trusted, and beautifully presented way.
            </p>

            {/* Feature list */}
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {[
                'Real stories that resonate',
                'Expert-led guidance',
                'Clear, compassionate resources',
              ].map(item => (
                <li
                  key={item}
                  className="bcs-feat"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}
                >
                  <span style={{
                    display: 'inline-block', width: '18px', height: '1px',
                    background: 'hsl(36 40% 58%)', flexShrink: 0,
                  }}/>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontWeight: 300,
                    fontSize: 'clamp(0.8rem, 1.2vw, 0.88rem)',
                    letterSpacing: '0.02em', color: '#F2F8FC',
                  }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Bespoke Web Showcase ─────────────────────────────────────────────────────

function BespokeWebShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const card1Ref   = useRef<HTMLDivElement>(null)
  const card2Ref   = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const headerEls = el.querySelectorAll('.bws-header')
    const wrap1 = card1Ref.current
    const wrap2 = card2Ref.current
    if (!wrap1 || !wrap2) return
    gsap.set(headerEls, { opacity: 0, y: 30, filter: 'blur(8px)' })
    gsap.set(wrap1, { opacity: 0, y: 60, scale: 0.96, filter: 'blur(4px)' })
    gsap.set(wrap2, { opacity: 0, y: 80, scale: 0.94, filter: 'blur(4px)' })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(headerEls, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, stagger: 0.12 }, 0)
      tl.to(wrap1, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.15 }, 0.25)
      tl.to(wrap2, { opacity: 0.72, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.05 }, 0.4)
      obs.disconnect()
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current!.getBoundingClientRect()
    setMouse({
      x: (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2),
      y: (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2),
    })
  }
  const handleMouseLeave = () => setMouse({ x: 0, y: 0 })

  const t1 = `perspective(1400px) rotateX(${4  + mouse.y * 1.8}deg) rotateY(${-7  + mouse.x * 4}deg) rotateZ(-0.6deg)`
  const t2 = `perspective(1400px) rotateX(${5  + mouse.y * 1.2}deg) rotateY(${-10 + mouse.x * 2.5}deg) rotateZ(-1.2deg)`

  /* ── Property photo helper ── */
  const PropPhoto = ({ src, height = '80px' }: { src: string; height?: string }) => (
    <div style={{ height, overflow: 'hidden', borderRadius: '6px' }}>
      <img
        loading="lazy"
        decoding="async"
        src={src}
        alt="Property"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 12vw, 10rem) 0 clamp(7rem, 14vw, 12rem)' }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to bottom, transparent, #010709)', pointerEvents: 'none' }} />

      <div className="relative z-10 max-w-[80rem] mx-auto px-6 sm:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-16 lg:mb-20" style={{ maxWidth: '44rem', margin: '0 auto clamp(4rem, 8vw, 5.5rem)' }}>
          <p className="bws-header font-sans uppercase" style={{ fontSize: '0.58rem', letterSpacing: '0.34em', color: 'hsl(199 89% 60% / 0.65)', marginBottom: '1.1rem' }}>
            Website Showcase
          </p>
          <h2 className="bws-header font-sans" style={{ fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.038em', fontWeight: 300, color: 'hsl(0 0% 94%)', marginBottom: '1.4rem' }}>
            Crafted to captivate,{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(0 0% 65%)' }}>
              built to perform.
            </em>
          </h2>
          <p className="bws-header font-sans font-light" style={{ fontSize: 'clamp(0.84rem, 1.3vw, 0.97rem)', lineHeight: 1.9, color: '#F2F8FC', marginBottom: '1rem' }}>
            Every site we build is a precision-crafted system — visual, functional, and designed to earn trust from the first scroll. We don't use templates. Every layout, interaction, and detail is shaped around your brand and your audience.
          </p>
          <p className="bws-header font-sans font-light" style={{ fontSize: 'clamp(0.84rem, 1.3vw, 0.97rem)', lineHeight: 1.9, color: '#F2F8FC' }}>
            From real estate platforms and service businesses to e-commerce brands and creative studios — we build websites that feel premium, load fast, and convert visitors into clients.
          </p>
          {/* Tags */}
          <div className="bws-header" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.6rem' }}>
            {['Bespoke Design', 'Responsive', 'SEO Optimised', 'Fast Loading', 'Conversion-Focused'].map(tag => (
              <span key={tag} style={{ padding: '0.3rem 0.9rem', borderRadius: '9999px', border: '1px solid hsl(0 0% 100% / 0.1)', fontSize: '0.62rem', letterSpacing: '0.06em', color: 'hsl(0 0% 46%)', background: 'hsl(0 0% 100% / 0.03)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Floating mockup stage ── */}
        <div className="relative mx-auto" style={{ maxWidth: '980px', height: 'clamp(420px, 56vw, 620px)' }}>

          {/* ── Card 2 — back panel (Poley secondary view) ── */}
          <div
            ref={card2Ref}
            className="hidden md:block"
            style={{ position: 'absolute', top: 0, right: 0, width: 'clamp(360px, 50%, 520px)', zIndex: 0, transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)', transform: t2, willChange: 'transform' }}
          >
            <div aria-hidden="true" style={{ position: 'absolute', bottom: '-28px', left: '8%', right: '8%', height: '40px', background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(0,0,0,0.22), transparent 80%)', filter: 'blur(16px)' }} />
            <div style={{ background: '#FAF3E8', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 6px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              {/* Chrome */}
              <div style={{ height: '30px', background: '#F0F0EE', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF6058' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28CA41' }} />
                <div style={{ flex: 1, height: '16px', background: '#E5E5E3', borderRadius: '4px', marginLeft: '8px', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                  <span style={{ fontSize: '7.5px', color: '#AAA' }}>poley.co/listings</span>
                </div>
              </div>
              {/* Nav */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 18px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.07em', color: '#1A1A1A' }}>POLEY</span>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['Buy', 'Rent', 'Sell', 'Agents'].map(item => (
                    <span key={item} style={{ fontSize: '9.5px', color: '#888' }}>{item}</span>
                  ))}
                </div>
              </div>
              {/* Featured listing hero image */}
              <PropPhoto src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=75" height="90px" />
              {/* Listing info */}
              <div style={{ padding: '14px 18px' }}>
                <p style={{ fontSize: '7.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#AAA', marginBottom: '5px' }}>Featured Listing · London</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#111', lineHeight: 1.2, marginBottom: '6px' }}>Kensington Garden Villa</p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '9px', color: '#888', marginBottom: '12px' }}>
                  <span>5 bed</span><span>·</span><span>4 bath</span><span>·</span><span>3,200 sq ft</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>£2,400,000</span>
                  <div style={{ padding: '6px 14px', background: '#1A1A1A', borderRadius: '6px', fontSize: '9px', fontWeight: 600, color: '#FFF' }}>View Property</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Card 1 — front panel (Poley main) ── */}
          <div
            ref={card1Ref}
            style={{ position: 'absolute', bottom: 0, left: 0, width: 'clamp(340px, 74%, 700px)', zIndex: 1, transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)', transform: t1, willChange: 'transform' }}
          >
            <div aria-hidden="true" style={{ position: 'absolute', bottom: '-36px', left: '6%', right: '6%', height: '50px', background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(0,0,0,0.28), transparent 80%)', filter: 'blur(20px)' }} />
            <div style={{ background: '#FAF3E8', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 52px 130px rgba(0,0,0,0.22), 0 14px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              {/* Chrome */}
              <div style={{ height: '36px', background: '#F2F2F0', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF6058' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28CA41' }} />
                <div style={{ flex: 1, height: '22px', background: '#E8E8E6', borderRadius: '6px', marginLeft: '12px', display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
                  <span style={{ fontSize: '8.5px', color: '#AAA', letterSpacing: '0.02em' }}>poley.co</span>
                </div>
              </div>
              {/* Nav */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 24px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.07em', color: '#0A0A0A' }}>POLEY</span>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {['Buy', 'Rent', 'Sell', 'New Homes', 'Agents'].map(item => (
                    <span key={item} style={{ fontSize: '10px', color: '#888', letterSpacing: '0.01em' }}>{item}</span>
                  ))}
                </div>
                <div style={{ padding: '6px 16px', background: '#0A0A0A', borderRadius: '7px', fontSize: '10px', fontWeight: 700, color: '#FFF', letterSpacing: '0.02em' }}>
                  Book Valuation
                </div>
              </div>
              {/* Hero copy */}
              <div style={{ padding: '20px 24px 16px' }}>
                <p style={{ fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B0B0AE', marginBottom: '8px' }}>Premium Real Estate · Est. 2018</p>
                <h3 style={{ fontSize: 'clamp(16px, 2.6vw, 22px)', fontWeight: 800, color: '#080808', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                  Find your perfect home.<br />Live where you belong.
                </h3>
                <p style={{ fontSize: '10.5px', color: '#999', lineHeight: 1.65, marginBottom: '14px', maxWidth: '360px' }}>
                  Discover premium properties across London, Manchester, and Edinburgh. Expert agents, seamless process, exceptional results.
                </p>
              </div>
              {/* Property listing grid */}
              <div style={{ padding: '0 24px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {/* Listing 1 */}
                <div style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
                  <PropPhoto src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=75" />
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ fontSize: '9.5px', fontWeight: 700, color: '#111', marginBottom: '2px' }}>Chelsea Townhouse</p>
                    <p style={{ fontSize: '8px', color: '#AAA', marginBottom: '5px' }}>4 bed · 3 bath</p>
                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#111' }}>£1,850,000</p>
                  </div>
                </div>
                {/* Listing 2 */}
                <div style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
                  <PropPhoto src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=75" />
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ fontSize: '9.5px', fontWeight: 700, color: '#111', marginBottom: '2px' }}>City Penthouse</p>
                    <p style={{ fontSize: '8px', color: '#AAA', marginBottom: '5px' }}>2 bed · 2 bath</p>
                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#111' }}>£950,000</p>
                  </div>
                </div>
                {/* Listing 3 */}
                <div style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
                  <PropPhoto src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=75" />
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ fontSize: '9.5px', fontWeight: 700, color: '#111', marginBottom: '2px' }}>Cotswolds Retreat</p>
                    <p style={{ fontSize: '8px', color: '#AAA', marginBottom: '5px' }}>6 bed · 5 bath</p>
                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#111' }}>£3,200,000</p>
                  </div>
                </div>
              </div>
              {/* Stats bar */}
              <div style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                {[
                  { val: '2,400+', label: 'Active Listings' },
                  { val: '98%',    label: 'Client Satisfaction' },
                  { val: '14 days', label: 'Avg. Time to Sell' },
                ].map((stat, i) => (
                  <div key={i} style={{ flex: 1, padding: '12px 16px', borderRight: i < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <div style={{ fontSize: 'clamp(12px, 1.8vw, 15px)', fontWeight: 800, color: '#0A0A0A', lineHeight: 1 }}>{stat.val}</div>
                    <div style={{ fontSize: '8.5px', color: '#C0C0BE', marginTop: '3px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Bespoke Process Timeline ────────────────────────────────────────────────

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Discover',
    desc: 'We understand your brand, goals, audience, and website purpose.',
  },
  {
    num: '02',
    title: 'Design',
    desc: 'We create a clean visual direction focused on trust and clarity.',
  },
  {
    num: '03',
    title: 'Build',
    desc: 'We develop a responsive, fast, and scalable website.',
  },
  {
    num: '04',
    title: 'Launch',
    desc: 'We test, refine, and prepare your site for real users.',
  },
]

function BespokeProcessTimeline() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const heading = el.querySelector('.bpt-heading')
    const para    = el.querySelector('.bpt-para')
    const line    = el.querySelector('.bpt-line')
    const steps   = el.querySelectorAll('.bpt-step')

    gsap.set([heading, para], { opacity: 0, y: 28 })
    gsap.set(steps, { opacity: 0, y: 36 })
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(heading, { opacity: 1, y: 0, duration: 0.75 }, 0)
      tl.to(para,    { opacity: 1, y: 0, duration: 0.65 }, 0.1)
      tl.to(line,    { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.35)
      tl.to(steps,   { opacity: 1, y: 0, duration: 0.6, stagger: 0.13 }, 0.4)

      // Pulse each number bubble every 3 s (staggered by step index)
      tl.add(() => {
        el.querySelectorAll<HTMLElement>('.bpt-num-bubble').forEach((bubble, i) => {
          gsap.to(bubble, {
            scale: 1.22,
            boxShadow: '0 0 28px -2px hsl(199 89% 60% / 0.7)',
            background: 'hsl(199 89% 60% / 0.18)',
            duration: 0.38,
            ease: 'power2.out',
            delay: i * 0.22,
            repeat: -1,
            repeatDelay: 3 - 0.38,
            yoyo: true,
          })
        })
      }, 1.0)

      obs.disconnect()
    }, { threshold: 0.15 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
    >
      {/* Ambient top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 55% 35% at 50% 0%, hsl(199 89% 60% / 0.05) 0%, transparent 70%)',
        }}
      />

      {/* Section boundary fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">

        {/* Heading + para — centered */}
        <div className="text-center max-w-[42rem] mx-auto mb-16 sm:mb-20">
          <h2
            className="bpt-heading font-sans font-light text-text mb-6"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.033em',
            }}
          >
            From idea to launch —{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              built with precision
            </em>
          </h2>
          <p
            className="bpt-para font-sans font-light"
            style={{
              fontSize: 'clamp(0.88rem, 1.5vw, 1.02rem)',
              lineHeight: 1.85,
              color: '#F2F8FC',
            }}
          >
            We guide every project through a clear process, so your website feels
            intentional, polished, and ready to perform.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Connecting line — desktop only */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute"
            style={{
              top: '1.15rem',
              left: 'calc(12.5% + 1rem)',
              right: 'calc(12.5% + 1rem)',
              height: '1px',
              zIndex: 0,
            }}
          >
            {/* Track */}
            <div style={{ width: '100%', height: '100%', background: 'hsl(0 0% 100% / 0.07)' }} />
            {/* Animated fill */}
            <div
              className="bpt-line"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, hsl(199 89% 60% / 0.6), hsl(205 80% 55% / 0.25))',
                boxShadow: '0 0 8px 0 hsl(199 89% 60% / 0.3)',
              }}
            />
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-6 relative z-10">
            {PROCESS_STEPS.map(({ num, title, desc }) => (
              <div
                key={num}
                className="bpt-step flex flex-col items-center sm:items-center text-left sm:text-center"
              >
                {/* Number bubble */}
                <div
                  className="bpt-num-bubble"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    border: '1px solid hsl(199 89% 60% / 0.35)',
                    background: 'hsl(199 89% 60% / 0.07)',
                    boxShadow: '0 0 18px -4px hsl(199 89% 60% / 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="font-sans"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 400,
                      letterSpacing: '0.08em',
                      color: 'hsl(199 89% 70%)',
                    }}
                  >
                    {num}
                  </span>
                </div>

                {/* Title */}
                <p
                  className="font-sans font-light text-text mb-2"
                  style={{
                    fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {title}
                </p>

                {/* Description */}
                <p
                  className="font-sans font-light"
                  style={{
                    fontSize: '0.84rem',
                    lineHeight: 1.75,
                    color: '#F2F8FC',
                    maxWidth: '16rem',
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Bespoke Real Users (Section 5) ─────────────────────────────────────────

const REAL_USER_ROWS = [
  {
    num: '01',
    title: 'Fast loading structure',
    desc: 'Optimised layouts, lightweight sections, and clean visual hierarchy keep the experience smooth.',
  },
  {
    num: '02',
    title: 'Clear user journeys',
    desc: 'Every section is placed with intention so visitors know where they are and what to do next.',
  },
  {
    num: '03',
    title: 'Responsive across devices',
    desc: 'Your site is built to feel polished on desktop, tablet, and mobile.',
  },
  {
    num: '04',
    title: 'Conversion-focused actions',
    desc: 'Buttons, contact points, and key messages are positioned to support enquiries and sales.',
  },
]

// ─── Bespoke Web Design Showcase (Section 8) ─────────────────────────────────

const BWDS_FEATURES = [
  'Bespoke landing page design',
  'Premium visual presentation',
  'Clear user journeys',
  'Responsive layouts across devices',
  'Conversion-focused structure',
]

function BespokeWebDesignShowcase() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const label    = el.querySelector('.bwds-label')
    const heading  = el.querySelector('.bwds-heading')
    const rule     = el.querySelector('.bwds-rule')
    const para1    = el.querySelector('.bwds-para1')
    const para2    = el.querySelector('.bwds-para2')
    const features = el.querySelectorAll('.bwds-feature')
    const rightEl  = el.querySelector('.bwds-right')
    const imgWrap  = el.querySelector('.bwds-img-wrap')

    gsap.set(label,    { opacity: 0, y: 20 })
    gsap.set(heading,  { opacity: 0, y: 36, filter: 'blur(10px)' })
    gsap.set(rule,     { opacity: 0, scaleX: 0, transformOrigin: 'left center' })
    gsap.set(para1,    { opacity: 0, y: 22 })
    gsap.set(para2,    { opacity: 0, y: 22 })
    gsap.set(features, { opacity: 0, x: -16 })
    gsap.set(rightEl,  { opacity: 0, y: 30 })
    gsap.set(imgWrap,  { scale: 0.96 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(label,    { opacity: 1, y: 0, duration: 0.7 }, 0)
      tl.to(heading,  { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05 }, 0.1)
      tl.to(rule,     { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 0.3)
      tl.to(para1,    { opacity: 1, y: 0, duration: 0.8 }, 0.38)
      tl.to(para2,    { opacity: 1, y: 0, duration: 0.8 }, 0.5)
      tl.to(features, { opacity: 1, x: 0, duration: 0.6, stagger: 0.09 }, 0.58)
      tl.to(rightEl,  { opacity: 1, y: 0, duration: 1.1 }, 0.2)
      tl.to(imgWrap,  { scale: 1, duration: 1.3, ease: 'power2.out' }, 0.2)
      obs.disconnect()
    }, { threshold: 0.08 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 9rem) 0' }}
    >
      {/* Grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.018 }}>
        <filter id="bwds-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#bwds-gr)" fill="white"/>
      </svg>

      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 55% 60% at 100% 50%, hsl(199 89% 60% / 0.03) 0%, transparent 70%)',
      }} />

      {/* Section boundary fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div className="relative z-10 max-w-[76rem] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Left: copy ── */}
          <div>
            {/* Label */}
            <p className="bwds-label font-sans font-light uppercase mb-5" style={{
              fontSize: '0.6rem', letterSpacing: '0.34em', color: 'hsl(199 89% 60% / 0.65)',
            }}>
              Website Design
            </p>

            {/* Headline */}
            <h2 className="bwds-heading font-sans font-light mb-7" style={{
              fontSize: 'clamp(1.9rem, 3.8vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: 'hsl(0 0% 96%)',
            }}>
              Premium websites built to{' '}
              <em style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'hsl(0 0% 68%)',
              }}>
                look sharp
              </em>{' '}
              and work harder.
            </h2>

            {/* Accent rule */}
            <div className="bwds-rule" aria-hidden="true" style={{
              width: '2rem', height: '1px',
              background: 'hsl(199 89% 60% / 0.35)',
              marginBottom: '1.8rem',
            }} />

            {/* Para 1 */}
            <p className="bwds-para1 font-sans font-light mb-5" style={{
              fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
              lineHeight: 1.9,
              color: '#F2F8FC',
            }}>
              We design websites that feel polished from the first glance, with clear structure,
              refined visuals, and user journeys that help visitors understand your value quickly.
            </p>

            {/* Para 2 */}
            <p className="bwds-para2 font-sans font-light mb-10" style={{
              fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
              lineHeight: 1.9,
              color: '#F2F8FC',
            }}>
              Every page is shaped around clarity, trust, and conversion — from the first
              hero section to the final call to action.
            </p>

            {/* Feature list */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {BWDS_FEATURES.map((feat) => (
                <li key={feat} className="bwds-feature" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Cyan tick */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <circle cx="7" cy="7" r="6.5" stroke="hsl(199 89% 60% / 0.3)"/>
                    <polyline points="4,7 6,9.2 10,4.8" stroke="hsl(199 89% 60%)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-sans font-light" style={{
                    fontSize: 'clamp(0.82rem, 1.2vw, 0.9rem)',
                    color: '#F2F8FC',
                    letterSpacing: '0.01em',
                  }}>
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: image ── */}
          <div className="bwds-right" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="bwds-img-wrap" style={{
              borderRadius: '32px',
              overflow: 'hidden',
              border: '1px solid hsl(0 0% 100% / 0.1)',
              boxShadow: '0 40px 100px hsl(0 0% 0% / 0.45), 0 8px 32px hsl(0 0% 0% / 0.25)',
              width: '100%',
              maxWidth: '580px',
            }}>
              <img
                loading="lazy"
                decoding="async"
                src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=900&q=80"
                alt="Premium website design by Weavy"
                style={{
                  width: '100%',
                  height: 'clamp(380px, 55vw, 580px)',
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(to bottom, transparent, #010709)',
        pointerEvents: 'none',
      }} />
    </section>
  )
}

function BespokeRealUsers() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el.querySelectorAll('.bru-eyebrow'), { opacity: 0, y: 16 })
    gsap.set(el.querySelectorAll('.bru-heading'), { opacity: 0, y: 36, filter: 'blur(10px)' })
    gsap.set(el.querySelectorAll('.bru-body'),    { opacity: 0, y: 24 })
    gsap.set(el.querySelectorAll('.bru-panel'),   { opacity: 0, y: 40, scale: 0.97 })
    gsap.set(el.querySelectorAll('.bru-row'),     { opacity: 0, x: 22 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(el.querySelectorAll('.bru-eyebrow'), { opacity: 1, y: 0, duration: 0.7 }, 0)
      tl.to(el.querySelectorAll('.bru-heading'), { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05 }, 0.1)
      tl.to(el.querySelectorAll('.bru-body'),    { opacity: 1, y: 0, duration: 0.85 }, 0.25)
      tl.to(el.querySelectorAll('.bru-panel'),   { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power2.out' }, 0.15)
      tl.to(el.querySelectorAll('.bru-row'),     { opacity: 1, x: 0, duration: 0.6, stagger: 0.12 }, 0.42)
      obs.disconnect()
    }, { threshold: 0.1 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        background: '#010709',
        padding: 'clamp(5rem, 10vw, 8rem) 0',
      }}
    >
      {/* Subtle ambient glow */}
      {/* Grid + radial bloom behind the left text */}
      <GradientBlurBg
        accentColor="hsl(199 89% 60% / 0.09)"
        accentPosition="22% 55%"
        accentRadius="580px"
        gridColor="hsl(0 0% 100% / 0.025)"
        gridSize="80px 56px"
      />

      {/* Section boundary fades — mask grid pattern abrupt start/end */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div className="relative z-10 max-w-[82rem] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.12fr] gap-14 lg:gap-20 items-start">

          {/* ── LEFT: Editorial text ── */}
          <div style={{ paddingTop: 'clamp(0rem, 2vw, 2rem)' }}>

            <p
              className="bru-eyebrow font-sans uppercase"
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.36em',
                color: 'hsl(199 89% 62%)',
                marginBottom: '1.6rem',
              }}
            >
              Real User Experience
            </p>

            <h2
              className="bru-heading font-sans font-light"
              style={{
                fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
                lineHeight: 1.12,
                letterSpacing: '-0.036em',
                color: 'hsl(0 0% 93%)',
                marginBottom: '1.8rem',
                maxWidth: '22rem',
              }}
            >
              Built to feel effortless from the{' '}
              <em style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'hsl(199 89% 74%)',
              }}>
                first click.
              </em>
            </h2>

            <p
              className="bru-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
                lineHeight: 1.88,
                color: '#F2F8FC',
                maxWidth: '30rem',
              }}
            >
              A high-performing website should feel simple, fast, and natural to use. We design every page around real user behaviour, making it easier for visitors to understand your offer, explore your services, and take action with confidence.
            </p>

          </div>

          {/* ── RIGHT: Glass panel ── */}
          <div
            className="bru-panel"
            style={{
              borderRadius: '28px',
              border: '1px solid hsl(0 0% 100% / 0.08)',
              background: 'hsl(214 24% 6% / 0.72)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow: [
                '0 32px 80px -20px hsl(0 0% 0% / 0.72)',
                '0 0 0 1px hsl(0 0% 100% / 0.03) inset',
              ].join(', '),
              overflow: 'hidden',
            }}
          >
            {/* Cyan top accent line */}
            <div style={{
              height: '2px',
              background: 'linear-gradient(to right, hsl(199 89% 60% / 0.7), hsl(205 80% 55% / 0.2), transparent)',
            }}/>

            <div style={{ padding: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
              {REAL_USER_ROWS.map(({ num, title, desc }, i) => (
                <div key={num}>
                  {i > 0 && (
                    <div style={{
                      height: '1px',
                      background: 'hsl(0 0% 100% / 0.06)',
                      margin: '0',
                    }}/>
                  )}
                  <div
                    className="bru-row"
                    style={{
                      padding: 'clamp(1.2rem, 2vw, 1.6rem) 0',
                      display: 'grid',
                      gridTemplateColumns: '2.4rem 1fr',
                      gap: '1rem',
                      transition: 'background 0.3s ease',
                      borderRadius: '12px',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'hsl(199 89% 60% / 0.04)'
                      const numEl = el.querySelector('.bru-num') as HTMLElement | null
                      if (numEl) numEl.style.color = 'hsl(199 89% 68%)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'transparent'
                      const numEl = el.querySelector('.bru-num') as HTMLElement | null
                      if (numEl) numEl.style.color = 'hsl(199 89% 60% / 0.55)'
                    }}
                  >
                    {/* Number */}
                    <span
                      className="bru-num font-sans"
                      style={{
                        fontSize: '0.62rem',
                        letterSpacing: '0.14em',
                        color: 'hsl(199 89% 60% / 0.55)',
                        paddingTop: '0.2rem',
                        transition: 'color 0.3s ease',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {num}
                    </span>

                    {/* Content */}
                    <div>
                      <p
                        className="font-sans font-light"
                        style={{
                          fontSize: 'clamp(0.9rem, 1.4vw, 1.02rem)',
                          letterSpacing: '-0.018em',
                          color: 'hsl(0 0% 86%)',
                          marginBottom: '0.45rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {title}
                      </p>
                      <p
                        className="font-sans font-light"
                        style={{
                          fontSize: '0.83rem',
                          lineHeight: 1.78,
                          color: '#F2F8FC',
                        }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Bespoke Testimonials ─────────────────────────────────────────────────────

const BESPOKE_TESTIMONIALS = [
  {
    name: 'Lena Hoffmann',
    role: 'Founder, Atelier Lune',
    rating: 5,
    text: 'The website they built for us completely elevated our brand. Leads converted at nearly double our old rate within the first month. Worth every penny.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
  },
  {
    name: 'Marcus Reid',
    role: 'CEO, Northfield Capital',
    rating: 5,
    text: 'Our online presence went from embarrassing to industry-leading. The attention to detail and speed of delivery was unlike anything we had seen from an agency before.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
  },
  {
    name: 'Sofia Andrade',
    role: 'Marketing Director, Veva Studio',
    rating: 5,
    text: 'Seamless process from start to finish. They understood our vision immediately and the final product genuinely exceeded what we had imagined. Our clients constantly compliment the site.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
  },
  {
    name: 'James Okafor',
    role: 'Co-Founder, Lumin Labs',
    rating: 5,
    text: 'We had tried two other agencies before. Weavy was the only team that actually delivered a fast, beautiful site on time — with zero hand-holding required on our end.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
  },
]

function BespokeTestimonials() {
  return (
    <TestimonialsSection
      badgeText="Client Stories"
      title="Built for results, validated by clients"
      subtitle="Founders and marketing teams who needed more than a template — and got it."
      testimonials={BESPOKE_TESTIMONIALS}
    />
  )
}

// ─── Bespoke Contact / Footer — Section 5 ───────────────────────────────────

// Same HLS source as the hero section
const HLS_FOOTER = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

const BCF_MARQUEE_TEXT = 'BUILDING THE FUTURE \u2022 '

function BcfIconX() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}
function BcfIconLinkedIn() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
function BcfIconDribbble() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm7.369 5.633a10.004 10.004 0 012.187 5.946c-.32-.066-3.52-.712-6.742-.308-.075-.187-.148-.376-.228-.565-.208-.499-.434-1-.669-1.495 3.578-1.458 5.21-3.554 5.452-3.578zM12 2.056a9.955 9.955 0 016.546 2.44c-.196.197-1.673 2.148-5.133 3.444-1.603-2.945-3.381-5.368-3.654-5.752A10.028 10.028 0 0112 2.056zm-4.057.862c.263.369 2.01 2.801 3.633 5.686-4.584 1.218-8.632 1.196-9.056 1.187A10.015 10.015 0 017.943 2.918zM2.048 12.037l.014-.344c.408.01 5.146.041 10.063-1.395.28.547.545 1.104.793 1.664l-.35.097c-5.087 1.647-7.783 6.146-7.99 6.494A9.96 9.96 0 012.048 12.037zm9.952 9.914a9.975 9.975 0 01-6.054-2.043c.165-.318 2.039-3.95 7.625-5.912l.053-.019c1.362 3.534 1.921 6.499 2.066 7.352a9.963 9.963 0 01-3.69.622zm5.624-1.508c-.098-.585-.614-3.414-1.879-6.895 3.024-.484 5.669.311 5.993.416a10.02 10.02 0 01-4.114 6.479z"/>
    </svg>
  )
}
function BcfIconGitHub() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

const BCF_SOCIAL_LINKS = [
  { label: 'Twitter',  href: '#', Icon: BcfIconX        },
  { label: 'LinkedIn', href: '#', Icon: BcfIconLinkedIn  },
  { label: 'Dribbble', href: '#', Icon: BcfIconDribbble  },
  { label: 'GitHub',   href: '#', Icon: BcfIconGitHub    },
]

function BespokeContactFooter() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const { videoRef, containerRef } = useHlsVideo(HLS_FOOTER)
  const [ctaHover, setCtaHover] = useState(false)

  // ── GSAP infinite marquee ─────────────────────────────────────────────────
  useEffect(() => {
    const el = marqueeRef.current
    if (!el) return
    const tween = gsap.to(el, {
      xPercent: -50,
      duration: 40,
      ease: 'none',
      repeat: -1,
    })
    return () => { tween.kill() }
  }, [])

  return (
    <section
      id="bespoke-contact"
      className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden"
    >
      {/* ── HLS Video background — flipped vertically ── */}
      <div ref={containerRef} className="absolute inset-0" aria-hidden="true" style={{ zIndex: 0 }}>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          aria-hidden="true"
          className="scale-y-[-1]"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: 0.88,
            filter: 'brightness(1.06) contrast(1.38) saturate(1.15)',
          }}
        />
        {/* Heavy overlay */}
        <div className="absolute inset-0 bg-black/28 lg:bg-black/52" />
        {/* Top fade — blends into section above */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: '160px', background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)', zIndex: 2 }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '200px', background: 'linear-gradient(to top, #010709 0%, transparent 100%)', zIndex: 2 }}
        />
      </div>

      {/* ── All content sits above video ── */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>

        {/* Eyebrow label */}
        <p
          className="font-sans font-light uppercase mb-10"
          style={{ fontSize: '0.68rem', letterSpacing: '0.28em', color: 'hsl(199 89% 68%)' }}
        >
          Get in touch
        </p>

        {/* ── GSAP Marquee — 10 × repeated text, seamless loop via 20 DOM nodes ── */}
        <div
          className="w-full overflow-hidden mb-16"
          style={{
            borderTop: '1px solid hsl(0 0% 100% / 0.07)',
            borderBottom: '1px solid hsl(0 0% 100% / 0.07)',
            padding: '1rem 0',
          }}
          aria-hidden="true"
        >
          {/*
            20 DOM nodes (10 + 10) so that when GSAP reaches xPercent:-50
            the visible content is identical to the start — seamless loop.
          */}
          <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  fontFamily: "'Instrument Serif', 'Didot', 'GFS Didot', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.75rem)',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  color: 'hsl(0 0% 100% / 0.15)',
                  padding: '0 2.5rem',
                }}
              >
                {BCF_MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>

        {/* Main heading */}
        <h2
          className="font-sans font-light text-text text-center mb-5 px-6"
          style={{
            fontSize: 'clamp(2.4rem, 5.8vw, 4.4rem)',
            lineHeight: 1.06,
            letterSpacing: '-0.04em',
          }}
        >
          Let&apos;s create something{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(0 0% 72%)' }}>
            amazing
          </em>{' '}
          together
        </h2>

        {/* Subtext */}
        <p
          className="font-sans font-light text-center mb-14 px-6"
          style={{
            fontSize: 'clamp(0.84rem, 1.35vw, 0.96rem)',
            lineHeight: 1.9,
            color: '#F2F8FC',
            maxWidth: '34rem',
          }}
        >
          Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can work together.
        </p>

        {/* ── CTA Email button — premium gradient hover ring ── */}
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
              ? [
                  '0 0 0 4px hsl(199 89% 60% / 0.12)',
                  '0 0 40px -6px hsl(199 89% 60% / 0.5)',
                  '0 0 90px -16px hsl(199 89% 60% / 0.22)',
                  '0 8px 32px -8px hsl(0 0% 0% / 0.7)',
                ].join(', ')
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
              transition: 'all 0.35s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Indicator dot */}
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                flexShrink: 0,
                background: ctaHover ? 'hsl(199 89% 65%)' : 'hsl(0 0% 32%)',
                boxShadow: ctaHover ? '0 0 8px hsl(199 89% 65% / 0.8)' : 'none',
                transition: 'all 0.35s ease',
              }}
            />
            hello@weavyautomation.com
            <span
              aria-hidden="true"
              style={{
                fontSize: '1em',
                opacity: ctaHover ? 1 : 0.35,
                transform: ctaHover ? 'translateX(3px)' : 'translateX(0)',
                transition: 'all 0.35s ease',
                display: 'inline-block',
              }}
            >
              →
            </span>
          </span>
        </a>

        {/* ── Footer bar ── */}
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
          {/* Left — green pulsing dot + availability */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex" style={{ width: 8, height: 8 }}>
              <span
                className="absolute inline-flex rounded-full animate-ping"
                style={{
                  width: '100%', height: '100%',
                  background: 'hsl(142 71% 45%)',
                  opacity: 0.7,
                }}
              />
              <span
                className="relative inline-flex rounded-full"
                style={{
                  width: 8, height: 8,
                  background: 'hsl(142 71% 52%)',
                  boxShadow: '0 0 8px hsl(142 71% 52% / 0.6)',
                }}
              />
            </span>
            <span
              className="font-sans font-light"
              style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'hsl(0 0% 48%)' }}
            >
              Available for projects
            </span>
          </div>

          {/* Centre — copyright */}
          <p
            className="font-sans font-light text-center"
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: 'hsl(0 0% 28%)' }}
          >
            © {new Date().getFullYear()} Weavy. All rights reserved.
          </p>

          {/* Right — social links */}
          <div className="flex items-center gap-1 justify-end">
            {BCF_SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  color: 'hsl(0 0% 36%)',
                  transition: 'color 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'hsl(0 0% 84%)'
                  el.style.background = 'hsl(0 0% 100% / 0.07)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'hsl(0 0% 36%)'
                  el.style.background = 'transparent'
                }}
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

// ─── Chatbot WhatsApp Business (Section 2) ───────────────────────────────────

const WHATSAPP_FEATURES = [
  'Instant WhatsApp replies',
  'Menu, service, and FAQ automation',
  'Booking and enquiry collection',
  'Lead capture and customer qualification',
  'Smooth handover to a human team when needed',
]

function ChatbotWhatsAppBusiness() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.set(el.querySelectorAll('.cbwb-label'),   { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.cbwb-heading'), { opacity: 0, y: 28 })
    gsap.set(el.querySelectorAll('.cbwb-body'),    { opacity: 0, y: 20 })
    gsap.set(el.querySelectorAll('.cbwb-feat'),    { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.cbwb-img'),     { opacity: 0, x: -36, scale: 0.97 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(el.querySelectorAll('.cbwb-img'),     { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power2.out' }, 0)
      tl.to(el.querySelectorAll('.cbwb-label'),   { opacity: 1, y: 0, duration: 0.55 }, 0.14)
      tl.to(el.querySelectorAll('.cbwb-heading'), { opacity: 1, y: 0, duration: 0.8  }, 0.24)
      tl.to(el.querySelectorAll('.cbwb-body'),    { opacity: 1, y: 0, duration: 0.7, stagger: 0.13 }, 0.36)
      tl.to(el.querySelectorAll('.cbwb-feat'),    { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, 0.52)
      obs.disconnect()
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="whatsapp-chat"
      className="relative w-full overflow-hidden"
      style={{
        background: '#010709',
        padding: 'clamp(5rem, 10vw, 8rem) 0',
      }}
    >
      {/* Grid + bloom behind the right text column */}
      <GradientBlurBg
        accentColor="hsl(142 60% 48% / 0.08)"
        accentPosition="76% 52%"
        accentRadius="540px"
        gridColor="hsl(0 0% 100% / 0.024)"
        gridSize="80px 56px"
      />
      {/* Section boundary fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div className="relative z-10 max-w-[84rem] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── LEFT: Image ── */}
          <div className="cbwb-img relative flex items-center justify-center lg:justify-start">

            {/* Ambient glow behind image */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: '-24px',
              background: 'radial-gradient(ellipse 75% 65% at 45% 50%, hsl(142 60% 45% / 0.07) 0%, transparent 70%)',
              filter: 'blur(32px)',
              pointerEvents: 'none',
            }}/>

            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              borderRadius: '28px',
              overflow: 'hidden',
              border: '1px solid hsl(0 0% 100% / 0.1)',
              boxShadow: [
                '0 48px 100px -20px hsl(0 0% 0% / 0.88)',
                '0 0 0 1px hsl(0 0% 100% / 0.03) inset',
                '0 0 60px -18px hsl(142 60% 45% / 0.18)',
              ].join(', '),
              background: '#080b0f',
            }}>
              <img
                loading="lazy"
                decoding="async"
                src="/brand_assets/Whatsapp.png"
                alt="WhatsApp Business chatbot interface"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
              {/* Subtle bottom vignette */}
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '18%',
                background: 'linear-gradient(to top, hsl(210 20% 3% / 0.45) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}/>
            </div>
          </div>

          {/* ── RIGHT: Text ── */}
          <div>
            <p
              className="cbwb-label font-sans uppercase"
              style={{ fontSize: '0.62rem', letterSpacing: '0.36em', color: 'hsl(142 60% 52%)', marginBottom: '1.6rem' }}
            >
              Section 02
            </p>

            <h2
              className="cbwb-heading font-sans font-light"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 3.4rem)', lineHeight: 1.1, letterSpacing: '-0.036em', color: 'hsl(0 0% 93%)', marginBottom: '1.8rem', maxWidth: '30rem' }}
            >
              WhatsApp Business chatbots that{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(142 60% 64%)' }}>
                reply instantly.
              </em>
            </h2>

            <p
              className="cbwb-body font-sans font-light"
              style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', lineHeight: 1.88, color: '#F2F8FC', maxWidth: '32rem', marginBottom: '1.3rem' }}
            >
              Turn WhatsApp into a faster customer support and sales channel. We build intelligent
              chatbots that answer common questions, guide people through your services, collect
              enquiries, and keep conversations moving without making customers wait.
            </p>

            <p
              className="cbwb-body font-sans font-light"
              style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', lineHeight: 1.88, color: '#F2F8FC', maxWidth: '32rem', marginBottom: '2.6rem' }}
            >
              From menus, bookings, FAQs, locations, pricing, product details, and lead capture,
              your WhatsApp chatbot becomes a reliable assistant that helps convert more
              conversations into real business opportunities.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {WHATSAPP_FEATURES.map(item => (
                <li
                  key={item}
                  className="cbwb-feat"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '18px', height: '1px',
                    background: 'hsl(142 60% 52%)',
                    flexShrink: 0,
                  }}/>
                  <span className="font-sans font-light" style={{ fontSize: 'clamp(0.82rem, 1.2vw, 0.9rem)', letterSpacing: '0.02em', color: '#F2F8FC' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Chatbot Instagram DM (Section 3) ────────────────────────────────────────

const INSTAGRAM_FEATURES = [
  'Instant Instagram DM replies',
  'FAQ and service automation',
  'Lead capture and enquiry collection',
  'Booking and product guidance',
  'Smooth handover to a human team when needed',
]

function ChatbotInstagramDM() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.set(el.querySelectorAll('.cbid-label'),   { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.cbid-heading'), { opacity: 0, y: 28 })
    gsap.set(el.querySelectorAll('.cbid-body'),    { opacity: 0, y: 20 })
    gsap.set(el.querySelectorAll('.cbid-feat'),    { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.cbid-img'),     { opacity: 0, x: 36, scale: 0.97 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(el.querySelectorAll('.cbid-label'),   { opacity: 1, y: 0, duration: 0.55 }, 0)
      tl.to(el.querySelectorAll('.cbid-heading'), { opacity: 1, y: 0, duration: 0.8  }, 0.1)
      tl.to(el.querySelectorAll('.cbid-body'),    { opacity: 1, y: 0, duration: 0.7, stagger: 0.13 }, 0.22)
      tl.to(el.querySelectorAll('.cbid-feat'),    { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, 0.38)
      tl.to(el.querySelectorAll('.cbid-img'),     { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power2.out' }, 0.14)
      obs.disconnect()
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="instagram-chat"
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
    >
      {/* ── Original Section 3 background effects — preserved exactly ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 50% 55% at 75% 50%, hsl(320 80% 55% / 0.07) 0%, transparent 65%)',
          'radial-gradient(ellipse 35% 40% at 85% 20%, hsl(35 90% 58% / 0.05) 0%, transparent 55%)',
          'radial-gradient(ellipse 30% 35% at 65% 80%, hsl(270 70% 60% / 0.05) 0%, transparent 55%)',
        ].join(', '),
      }}/>
      <GridBackground />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(hsl(320 40% 60% / 0.018) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}/>
      {/* Section boundary fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div className="relative z-10 max-w-[84rem] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── LEFT: Text ── */}
          <div>
            <p
              className="cbid-label font-sans uppercase"
              style={{ fontSize: '0.62rem', letterSpacing: '0.36em', color: 'hsl(320 70% 65%)', marginBottom: '1.6rem' }}
            >
              Section 03
            </p>

            <h2
              className="cbid-heading font-sans font-light"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 3.4rem)', lineHeight: 1.1, letterSpacing: '-0.036em', color: 'hsl(0 0% 93%)', marginBottom: '1.8rem', maxWidth: '30rem' }}
            >
              Instagram DM automation that keeps{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(320 70% 72%)' }}>
                conversations moving.
              </em>
            </h2>

            <p
              className="cbid-body font-sans font-light"
              style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', lineHeight: 1.88, color: '#F2F8FC', maxWidth: '32rem', marginBottom: '1.3rem' }}
            >
              Turn Instagram messages into a faster customer journey. We build DM automation
              that replies instantly, answers common questions, captures enquiries, and guides
              people toward bookings, purchases, or the next step.
            </p>

            <p
              className="cbid-body font-sans font-light"
              style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', lineHeight: 1.88, color: '#F2F8FC', maxWidth: '32rem', marginBottom: '2.6rem' }}
            >
              From FAQs and service details to lead qualification and follow-up messages, your
              Instagram inbox becomes a smarter system that helps convert attention into real
              business opportunities.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {INSTAGRAM_FEATURES.map(item => (
                <li
                  key={item}
                  className="cbid-feat"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '18px', height: '1px',
                    background: 'hsl(320 70% 65%)',
                    flexShrink: 0,
                  }}/>
                  <span className="font-sans font-light" style={{ fontSize: 'clamp(0.82rem, 1.2vw, 0.9rem)', letterSpacing: '0.02em', color: '#F2F8FC' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── RIGHT: Image ── */}
          <div className="cbid-img relative flex items-center justify-center lg:justify-end">

            <div aria-hidden="true" style={{
              position: 'absolute', inset: '-24px',
              background: 'radial-gradient(ellipse 75% 65% at 55% 50%, hsl(320 70% 55% / 0.07) 0%, transparent 70%)',
              filter: 'blur(32px)',
              pointerEvents: 'none',
            }}/>

            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              borderRadius: '28px',
              overflow: 'hidden',
              border: '1px solid hsl(0 0% 100% / 0.1)',
              boxShadow: [
                '0 48px 100px -20px hsl(0 0% 0% / 0.88)',
                '0 0 0 1px hsl(0 0% 100% / 0.03) inset',
                '0 0 60px -18px hsl(320 70% 55% / 0.18)',
              ].join(', '),
              background: '#080b0f',
            }}>
              <img
                loading="lazy"
                decoding="async"
                src="/brand_assets/Instagram.png"
                alt="Instagram DM automation interface"
                style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'contain' }}
              />
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '18%',
                background: 'linear-gradient(to top, hsl(210 20% 3% / 0.45) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}/>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Chatbot Facebook Messenger (Section 4) ──────────────────────────────────

const MESSENGER_FEATURES = [
  'Instant replies for common questions',
  'Automated lead capture and qualification',
  'Booking, service, and product guidance',
  'Smart conversation flows for Messenger',
  'Seamless escalation to your human team when needed',
]

function ChatbotFacebookMessenger() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.set(el.querySelectorAll('.cbfm-img'),     { opacity: 0, x: -36, scale: 0.97 })
    gsap.set(el.querySelectorAll('.cbfm-label'),   { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.cbfm-heading'), { opacity: 0, y: 28 })
    gsap.set(el.querySelectorAll('.cbfm-body'),    { opacity: 0, y: 20 })
    gsap.set(el.querySelectorAll('.cbfm-feat'),    { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.cbfm-closing'), { opacity: 0, y: 12 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(el.querySelectorAll('.cbfm-img'),     { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power2.out' }, 0)
      tl.to(el.querySelectorAll('.cbfm-label'),   { opacity: 1, y: 0, duration: 0.55 }, 0.14)
      tl.to(el.querySelectorAll('.cbfm-heading'), { opacity: 1, y: 0, duration: 0.8  }, 0.24)
      tl.to(el.querySelectorAll('.cbfm-body'),    { opacity: 1, y: 0, duration: 0.7, stagger: 0.13 }, 0.36)
      tl.to(el.querySelectorAll('.cbfm-feat'),    { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, 0.52)
      tl.to(el.querySelectorAll('.cbfm-closing'), { opacity: 1, y: 0, duration: 0.6 }, 0.82)
      obs.disconnect()
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="facebook-messenger"
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
    >
      {/* ── Original Section 4 backgrounds — preserved ── */}
      <MessengerGlowBackground />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 50% 55% at 28% 50%, hsl(215 90% 58% / 0.07) 0%, transparent 65%)',
          'radial-gradient(ellipse 35% 40% at 15% 25%, hsl(225 85% 62% / 0.05) 0%, transparent 55%)',
          'radial-gradient(ellipse 30% 35% at 40% 80%, hsl(200 80% 58% / 0.04) 0%, transparent 55%)',
        ].join(', '),
      }}/>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(hsl(215 50% 60% / 0.018) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}/>
      {/* Section boundary fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      {/* ── Grid + radial bloom anchored to the text (right) column ── */}
      <GradientBlurBg
        accentColor="hsl(215 60% 62% / 0.028)"
        accentPosition="76% 52%"
        accentRadius="560px"
        gridColor="hsl(215 40% 70% / 0.04)"
        gridSize="80px 56px"
      />

      <div className="relative z-10 max-w-[84rem] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── LEFT: Image ── */}
          <div className="cbfm-img relative flex items-center justify-center lg:justify-start">

            <div aria-hidden="true" style={{
              position: 'absolute', inset: '-24px',
              background: 'radial-gradient(ellipse 75% 65% at 45% 50%, hsl(215 85% 58% / 0.07) 0%, transparent 70%)',
              filter: 'blur(32px)',
              pointerEvents: 'none',
            }}/>

            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              borderRadius: '28px',
              overflow: 'hidden',
              border: '1px solid hsl(0 0% 100% / 0.1)',
              boxShadow: [
                '0 48px 100px -20px hsl(0 0% 0% / 0.88)',
                '0 0 0 1px hsl(0 0% 100% / 0.03) inset',
                '0 0 60px -18px hsl(215 85% 58% / 0.18)',
              ].join(', '),
              background: '#080b0f',
            }}>
              <img
                loading="lazy"
                decoding="async"
                src="/brand_assets/messenger.png"
                alt="Facebook Messenger automation interface"
                style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'contain' }}
              />
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '18%',
                background: 'linear-gradient(to top, hsl(210 20% 3% / 0.45) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}/>
            </div>
          </div>

          {/* ── RIGHT: Text ── */}
          <div>
            <p
              className="cbfm-label font-sans uppercase"
              style={{ fontSize: '0.62rem', letterSpacing: '0.36em', color: 'hsl(215 85% 65%)', marginBottom: '1.6rem' }}
            >
              Section 04
            </p>

            <h2
              className="cbfm-heading font-sans font-light"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 3.4rem)', lineHeight: 1.1, letterSpacing: '-0.036em', color: 'hsl(0 0% 93%)', marginBottom: '1.8rem', maxWidth: '30rem' }}
            >
              Facebook Messenger automation built for{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(215 85% 72%)' }}>
                faster conversations.
              </em>
            </h2>

            <p
              className="cbfm-body font-sans font-light"
              style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', lineHeight: 1.88, color: '#F2F8FC', maxWidth: '32rem', marginBottom: '1.3rem' }}
            >
              Keep your brand responsive with Messenger automation that answers questions
              instantly, guides users to the right information, and helps turn everyday
              enquiries into real business opportunities.
            </p>

            <p
              className="cbfm-body font-sans font-light"
              style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', lineHeight: 1.88, color: '#F2F8FC', maxWidth: '32rem', marginBottom: '2.6rem' }}
            >
              From product questions and booking support to lead capture and follow-ups, we
              design Messenger workflows that reduce response time, improve consistency, and
              create a smoother customer experience across every interaction.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {MESSENGER_FEATURES.map(item => (
                <li
                  key={item}
                  className="cbfm-feat"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '18px', height: '1px',
                    background: 'hsl(215 85% 65%)',
                    flexShrink: 0,
                  }}/>
                  <span className="font-sans font-light" style={{ fontSize: 'clamp(0.82rem, 1.2vw, 0.9rem)', letterSpacing: '0.02em', color: '#F2F8FC' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p
              className="cbfm-closing font-sans font-light"
              style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.88rem)', lineHeight: 1.8, color: '#F2F8FC', maxWidth: '30rem', fontStyle: 'italic' }}
            >
              Designed to help businesses stay available, professional, and efficient without
              relying only on manual replies.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Chatbot Automation Workflow (Section 6) ─────────────────────────────────

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Instant response',
    desc: 'The system replies immediately across your chosen channels, so customers are never left waiting.',
  },
  {
    num: '02',
    title: 'Smart qualification',
    desc: 'It asks the right questions, collects key details, and understands what the customer needs.',
  },
  {
    num: '03',
    title: 'Guided next step',
    desc: 'Customers are directed toward bookings, services, product information, FAQs, or enquiry forms.',
  },
  {
    num: '04',
    title: 'Human handover',
    desc: 'When a conversation needs personal attention, the chatbot passes it smoothly to your team.',
  },
]

function ChatbotWorkflowSection() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.set(el.querySelectorAll('.cwf-label'),   { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.cwf-heading'),  { opacity: 0, y: 28 })
    gsap.set(el.querySelectorAll('.cwf-body'),     { opacity: 0, y: 20 })
    gsap.set(el.querySelectorAll('.cwf-line'),     { opacity: 0, scaleX: 0, transformOrigin: 'left center' })
    gsap.set(el.querySelectorAll('.cwf-step'),     { opacity: 0, y: 32 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(el.querySelectorAll('.cwf-label'),   { opacity: 1, y: 0, duration: 0.55 }, 0)
      tl.to(el.querySelectorAll('.cwf-heading'),  { opacity: 1, y: 0, duration: 0.8  }, 0.1)
      tl.to(el.querySelectorAll('.cwf-body'),     { opacity: 1, y: 0, duration: 0.7  }, 0.25)
      tl.to(el.querySelectorAll('.cwf-line'),     { opacity: 1, scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0.55)
      tl.to(el.querySelectorAll('.cwf-step'),     { opacity: 1, y: 0, duration: 0.65, stagger: 0.14 }, 0.48)
      obs.disconnect()
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 65% 50% at 50% 0%, hsl(199 89% 60% / 0.05) 0%, transparent 70%)',
          'radial-gradient(ellipse 40% 35% at 80% 80%, hsl(215 80% 60% / 0.03) 0%, transparent 60%)',
        ].join(', '),
      }}/>

      {/* Dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(hsl(199 89% 60% / 0.018) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}/>
      {/* Section boundary fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div className="relative z-10 max-w-[80rem] mx-auto px-6 sm:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-16 lg:mb-20">
          <p
            className="cwf-label font-sans uppercase"
            style={{ fontSize: '0.62rem', letterSpacing: '0.38em', color: 'hsl(199 89% 60%)', marginBottom: '1.4rem' }}
          >
            Automation Workflow
          </p>
          <h2
            className="cwf-heading font-sans font-light"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.034em',
              color: 'hsl(0 0% 93%)',
              maxWidth: '38rem',
              margin: '0 auto 1.6rem',
            }}
          >
            From first message to qualified lead —{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(199 89% 68%)' }}>
              automatically.
            </em>
          </h2>
          <p
            className="cwf-body font-sans font-light"
            style={{
              fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
              lineHeight: 1.88,
              color: '#F2F8FC',
              maxWidth: '36rem',
              margin: '0 auto',
            }}
          >
            Your chatbot system is designed to handle the first layer of customer communication
            instantly, giving people clear answers, collecting useful details, and guiding serious
            enquiries toward the right next step.
          </p>
        </div>

        {/* ── Workflow steps ── */}
        <div className="relative">

          {/* Connecting line — desktop only */}
          <div
            aria-hidden="true"
            className="cwf-line hidden lg:block absolute"
            style={{
              top: '2.75rem',
              left: 'calc(12.5% + 1.5rem)',
              right: 'calc(12.5% + 1.5rem)',
              height: '1px',
              background: 'linear-gradient(to right, hsl(199 89% 60% / 0.0), hsl(199 89% 60% / 0.22), hsl(199 89% 60% / 0.22), hsl(199 89% 60% / 0.0))',
              zIndex: 0,
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 relative z-10">
            {WORKFLOW_STEPS.map((step) => (
              <BorderRotate
                key={step.num}
                className="cwf-step"
                animationMode="auto-rotate"
                animationSpeed={4}
                borderWidth={1}
                borderRadius={28}
                backgroundColor="#05080b"
                gradientColors={{
                  primary:   '#020609',
                  secondary: '#093747',
                  accent:    '#1ab8d4',
                }}
                style={{
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           '1.1rem',
                  padding:       'clamp(1.6rem, 3vw, 2.2rem)',
                  boxShadow:     '0 24px 48px -12px hsl(0 0% 0% / 0.55)',
                }}
              >
                {/* Top accent line */}
                <div aria-hidden="true" style={{
                  height:     '1px',
                  background: 'linear-gradient(to right, hsl(199 89% 60% / 0.45), transparent)',
                  borderRadius: '1px',
                  marginBottom: '0.2rem',
                }}/>

                {/* Number badge */}
                <span className="font-sans" style={{
                  display:       'inline-block',
                  fontSize:      '0.62rem',
                  letterSpacing: '0.22em',
                  color:         'hsl(199 89% 60% / 0.7)',
                  fontWeight:    400,
                }}>
                  {step.num}
                </span>

                {/* Title */}
                <p className="font-sans" style={{
                  fontSize:      'clamp(0.95rem, 1.5vw, 1.05rem)',
                  fontWeight:    300,
                  letterSpacing: '-0.018em',
                  color:         'hsl(0 0% 90%)',
                  lineHeight:    1.3,
                }}>
                  {step.title}
                </p>

                {/* Description */}
                <p className="font-sans font-light" style={{
                  fontSize:   'clamp(0.8rem, 1.15vw, 0.875rem)',
                  lineHeight: 1.8,
                  color:      'hsl(0 0% 42%)',
                }}>
                  {step.desc}
                </p>
              </BorderRotate>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Chatbot Integrations (Section 8) ────────────────────────────────────────

const INTEGRATION_ROWS = [
  { num: '01', title: 'Website Chat',        desc: 'Instant support directly on your website.' },
  { num: '02', title: 'WhatsApp Business',   desc: 'Fast replies, FAQs, bookings, and customer conversations.' },
  { num: '03', title: 'Instagram DM',        desc: 'Automated responses for enquiries, offers, and lead capture.' },
  { num: '04', title: 'Facebook Messenger',  desc: 'Smart message flows for customers already engaging with your page.' },
  { num: '05', title: 'CRM & Email Alerts',  desc: 'Send qualified leads, contact details, and enquiry summaries to your team.' },
  { num: '06', title: 'Human Handover',      desc: 'Escalate important conversations when personal support is needed.' },
]

function ChatbotIntegrationsSection() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.set(el.querySelectorAll('.cbi-label'),   { opacity: 0, y: 12 })
    gsap.set(el.querySelectorAll('.cbi-heading'),  { opacity: 0, y: 28 })
    gsap.set(el.querySelectorAll('.cbi-body'),     { opacity: 0, y: 18 })
    gsap.set(el.querySelectorAll('.cbi-panel'),    { opacity: 0, y: 24, scale: 0.99 })
    gsap.set(el.querySelectorAll('.cbi-row'),      { opacity: 0, x: 16 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(el.querySelectorAll('.cbi-label'),   { opacity: 1, y: 0, duration: 0.5  }, 0)
      tl.to(el.querySelectorAll('.cbi-heading'),  { opacity: 1, y: 0, duration: 0.8  }, 0.1)
      tl.to(el.querySelectorAll('.cbi-body'),     { opacity: 1, y: 0, duration: 0.7  }, 0.24)
      tl.to(el.querySelectorAll('.cbi-panel'),    { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.18)
      tl.to(el.querySelectorAll('.cbi-row'),      { opacity: 1, x: 0, duration: 0.5, stagger: 0.09 }, 0.38)
      obs.disconnect()
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 55% 45% at 0% 55%, hsl(199 89% 60% / 0.05) 0%, transparent 65%)',
          'radial-gradient(ellipse 40% 35% at 100% 30%, hsl(215 80% 60% / 0.03) 0%, transparent 60%)',
        ].join(', '),
      }}/>

      {/* Dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(hsl(199 89% 60% / 0.016) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}/>
      {/* Section boundary fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div className="relative z-10 max-w-[82rem] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* ── LEFT: Text ── */}
          <div className="lg:pt-2">
            <p
              className="cbi-label font-sans uppercase"
              style={{ fontSize: '0.62rem', letterSpacing: '0.38em', color: 'hsl(199 89% 60%)', marginBottom: '1.4rem' }}
            >
              Connected Systems
            </p>

            <h2
              className="cbi-heading font-sans font-light"
              style={{
                fontSize:      'clamp(2rem, 4vw, 3.2rem)',
                lineHeight:    1.1,
                letterSpacing: '-0.034em',
                color:         'hsl(0 0% 93%)',
                maxWidth:      '26rem',
                marginBottom:  '1.8rem',
              }}
            >
              One automation system connected across every customer{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(199 89% 68%)' }}>
                touchpoint.
              </em>
            </h2>

            <p
              className="cbi-body font-sans font-light"
              style={{
                fontSize:   'clamp(0.88rem, 1.4vw, 1rem)',
                lineHeight: 1.88,
                color:      'hsl(0 0% 44%)',
                maxWidth:   '30rem',
              }}
            >
              Your chatbot should not work in isolation. We connect your automation across the
              channels your customers already use, helping enquiries move smoothly from message
              to booking, lead capture, follow-up, or human support.
            </p>

            {/* Decorative hairline */}
            <div aria-hidden="true" style={{
              marginTop:  '2.8rem',
              width:      '3rem',
              height:     '1px',
              background: 'hsl(199 89% 60% / 0.35)',
              boxShadow:  '0 0 8px 0 hsl(199 89% 60% / 0.2)',
            }}/>
          </div>

          {/* ── RIGHT: Integration panel ── */}
          <div
            className="cbi-panel"
            style={{
              borderRadius:    '28px',
              border:          '1px solid hsl(0 0% 100% / 0.07)',
              background:      'hsl(0 0% 100% / 0.018)',
              backdropFilter:  'blur(14px)',
              boxShadow:       '0 32px 64px -20px hsl(0 0% 0% / 0.7)',
              overflow:        'hidden',
            }}
          >
            {/* Panel top bar */}
            <div style={{
              padding:      '1.1rem 1.8rem',
              borderBottom: '1px solid hsl(0 0% 100% / 0.06)',
              display:      'flex',
              alignItems:   'center',
              gap:          '0.6rem',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(199 89% 60% / 0.5)' }}/>
              <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'hsl(0 0% 28%)', textTransform: 'uppercase' }}>
                Active integrations
              </span>
              <span style={{
                marginLeft:    'auto',
                fontSize:      '0.6rem',
                letterSpacing: '0.2em',
                color:         'hsl(199 89% 60% / 0.55)',
                fontFamily:    'monospace',
              }}>
                {INTEGRATION_ROWS.length} channels
              </span>
            </div>

            {/* Rows */}
            <div>
              {INTEGRATION_ROWS.map((row, i) => (
                <div
                  key={row.num}
                  className="cbi-row"
                  style={{
                    display:    'flex',
                    alignItems: 'flex-start',
                    gap:        '1.2rem',
                    padding:    '1.25rem 1.8rem',
                    borderBottom: i < INTEGRATION_ROWS.length - 1 ? '1px solid hsl(0 0% 100% / 0.045)' : 'none',
                    transition: 'background 0.25s ease',
                    cursor:     'default',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'hsl(199 89% 60% / 0.03)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                  }}
                >
                  {/* Number */}
                  <span className="font-sans" style={{
                    fontSize:      '0.58rem',
                    letterSpacing: '0.2em',
                    color:         'hsl(199 89% 60% / 0.45)',
                    fontWeight:    400,
                    paddingTop:    '0.18rem',
                    flexShrink:    0,
                    width:         '1.8rem',
                  }}>
                    {row.num}
                  </span>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="font-sans" style={{
                      fontSize:      'clamp(0.85rem, 1.25vw, 0.92rem)',
                      fontWeight:    300,
                      letterSpacing: '-0.01em',
                      color:         'hsl(0 0% 88%)',
                      marginBottom:  '0.28rem',
                      lineHeight:    1.3,
                    }}>
                      {row.title}
                    </p>
                    <p className="font-sans font-light" style={{
                      fontSize:   'clamp(0.75rem, 1.1vw, 0.8rem)',
                      lineHeight: 1.7,
                      color:      'hsl(0 0% 38%)',
                    }}>
                      {row.desc}
                    </p>
                  </div>

                  {/* Right accent dot */}
                  <div style={{
                    width:      5,
                    height:     5,
                    borderRadius: '50%',
                    background: 'hsl(199 89% 60% / 0.2)',
                    flexShrink: 0,
                    marginTop:  '0.45rem',
                    transition: 'background 0.25s ease',
                  }}/>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Chatbot TikTok Automation (Section 5) ───────────────────────────────────

const TIKTOK_FEATURES = [
  'Automated video scheduling',
  'Engagement and comment workflows',
  'Auto DM and follower follow-up',
  'Performance analytics and reporting',
  'Growth tracking across campaigns',
]

function ChatbotTikTokAutomation() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el.querySelectorAll('.ctta-label'),   { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.ctta-heading'), { opacity: 0, y: 28 })
    gsap.set(el.querySelectorAll('.ctta-body'),    { opacity: 0, y: 20 })
    gsap.set(el.querySelectorAll('.ctta-feat'),    { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.ctta-img'),     { opacity: 0, x: 36, scale: 0.97 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(el.querySelectorAll('.ctta-label'),   { opacity: 1, y: 0, duration: 0.55 }, 0)
      tl.to(el.querySelectorAll('.ctta-heading'), { opacity: 1, y: 0, duration: 0.8  }, 0.1)
      tl.to(el.querySelectorAll('.ctta-body'),    { opacity: 1, y: 0, duration: 0.7, stagger: 0.13 }, 0.22)
      tl.to(el.querySelectorAll('.ctta-feat'),    { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, 0.4)
      tl.to(el.querySelectorAll('.ctta-img'),     { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power2.out' }, 0.14)
      obs.disconnect()
    }, { threshold: 0.1 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        background: '#010709',
        padding: 'clamp(5rem, 10vw, 8rem) 0',
      }}
    >
      {/* Grid + radial bloom behind the left text */}
      <GradientBlurBg
        accentColor="hsl(195 90% 55% / 0.08)"
        accentPosition="24% 52%"
        accentRadius="560px"
        gridColor="hsl(0 0% 100% / 0.025)"
        gridSize="80px 56px"
      />
      {/* Section boundary fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div className="relative z-10 max-w-[84rem] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── LEFT: Text ── */}
          <div>
            <p
              className="ctta-label font-sans uppercase"
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.36em',
                color: 'hsl(195 88% 62%)',
                marginBottom: '1.6rem',
              }}
            >
              Section 05
            </p>

            <h2
              className="ctta-heading font-sans font-light"
              style={{
                fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.036em',
                color: 'hsl(0 0% 93%)',
                marginBottom: '1.8rem',
                maxWidth: '28rem',
              }}
            >
              TikTok automation built for faster{' '}
              <em style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'hsl(195 88% 72%)',
              }}>
                content growth.
              </em>
            </h2>

            <p
              className="ctta-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
                lineHeight: 1.88,
                color: '#F2F8FC',
                maxWidth: '32rem',
                marginBottom: '1.3rem',
              }}
            >
              We help brands turn TikTok into a smarter growth channel with automated publishing, engagement workflows, performance tracking, and audience insights designed to save time and improve consistency.
            </p>

            <p
              className="ctta-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
                lineHeight: 1.88,
                color: '#F2F8FC',
                maxWidth: '32rem',
                marginBottom: '2.6rem',
              }}
            >
              From scheduled uploads to automated follow-up actions and clear reporting, your TikTok system becomes easier to manage, easier to measure, and better prepared for growth.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {TIKTOK_FEATURES.map(item => (
                <li
                  key={item}
                  className="ctta-feat"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '18px', height: '1px',
                    background: 'hsl(195 88% 62%)',
                    flexShrink: 0,
                  }}/>
                  <span
                    className="font-sans font-light"
                    style={{
                      fontSize: 'clamp(0.82rem, 1.2vw, 0.9rem)',
                      letterSpacing: '0.02em',
                      color: '#F2F8FC',
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── RIGHT: Image ── */}
          <div className="ctta-img relative flex items-center justify-center lg:justify-end">

            {/* Ambient glow behind image */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: '-24px',
              background: 'radial-gradient(ellipse 75% 65% at 55% 50%, hsl(195 88% 55% / 0.08) 0%, transparent 70%)',
              filter: 'blur(32px)',
              pointerEvents: 'none',
            }}/>

            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '680px',
              borderRadius: '28px',
              overflow: 'hidden',
              border: '1px solid hsl(0 0% 100% / 0.08)',
              boxShadow: [
                '0 48px 100px -20px hsl(0 0% 0% / 0.88)',
                '0 0 0 1px hsl(0 0% 100% / 0.03) inset',
                '0 0 60px -18px hsl(195 88% 55% / 0.18)',
              ].join(', '),
              background: '#080b0f',
            }}>
              <img
                loading="lazy"
                decoding="async"
                src="/brand_assets/Tiktok_automatiom.png"
                alt="TikTok automation dashboard"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
              {/* Subtle bottom vignette */}
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%',
                background: 'linear-gradient(to top, hsl(210 20% 3% / 0.5) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}/>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Social Media Marketing — premium 5-section flow ────────────────────────

const STRATEGY_ITEMS = [
  { label: 'Content Scheduling',            desc: 'Consistent posting cadence across all platforms, planned weeks in advance.' },
  { label: 'Reels & Short-Form Content',    desc: 'Scroll-stopping vertical video crafted for reach and retention.' },
  { label: 'Stories & Carousel Posts',      desc: 'Engaging multi-frame formats that drive saves, shares, and swipe-throughs.' },
  { label: 'Paid Advertising Campaigns',    desc: 'Data-driven ad campaigns targeting the right audience at the right moment.' },
  { label: 'Audience Growth Strategy',      desc: 'Organic growth tactics built around your niche and brand voice.' },
  { label: 'Analytics & Performance Tracking', desc: 'Monthly reporting with clear metrics — reach, engagement, conversions.' },
]


function SocialMediaMarketing() {
  const heroRef     = useRef<HTMLElement>(null)
  const platRef     = useRef<HTMLElement>(null)
  const stratRef    = useRef<HTMLElement>(null)
  const proofRef    = useRef<HTMLElement>(null)
  const beautyRef   = useRef<HTMLElement>(null)
  const ctaRef      = useRef<HTMLElement>(null)
  const s6Ref       = useRef<HTMLElement>(null)
  const smFeatRef   = useRef<HTMLElement>(null)

  // Shared observer helper
  function observe(ref: React.RefObject<HTMLElement | null>, fn: (el: HTMLElement) => void) {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { fn(el); obs.disconnect() } }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }

  // ── Section 1: Hero ──
  useEffect(() => observe(heroRef, el => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(el.querySelectorAll('.smh-eyebrow'), { opacity: 1, y: 0, duration: 0.6 }, 0)
    tl.to(el.querySelectorAll('.smh-heading'), { opacity: 1, y: 0, duration: 0.85 }, 0.1)
    tl.to(el.querySelectorAll('.smh-body'),    { opacity: 1, y: 0, duration: 0.7 }, 0.22)
    tl.to(el.querySelectorAll('.smh-stat'),    { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, 0.38)
    tl.to(el.querySelectorAll('.smh-img-a'),   { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.2)
    tl.to(el.querySelectorAll('.smh-img-b'),   { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.38)
  }), [])

  // ── Section 2: Digital Ecosystem ──
  useEffect(() => observe(platRef, el => {
    const mockupEl = el.querySelector('.smp-mockup') as HTMLElement | null
    const chipEls  = el.querySelectorAll('.smp-chip')

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(el.querySelectorAll('.smp-label'),   { opacity: 1, y: 0, duration: 0.6 }, 0)
    tl.to(el.querySelectorAll('.smp-heading'), { opacity: 1, y: 0, duration: 0.9 }, 0.1)
    tl.to(el.querySelectorAll('.smp-body'),    { opacity: 1, y: 0, duration: 0.75 }, 0.22)
    tl.to(el.querySelectorAll('.smp-feat'),    { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, 0.32)
    tl.to(el.querySelectorAll('.smp-mockup'),  { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, 0.12)
    tl.to(el.querySelectorAll('.smp-chip'),    { opacity: 1, y: 0, duration: 0.75, stagger: 0.22, ease: 'power2.out' }, 0.55)

    // Continuous float after reveal
    tl.add(() => {
      if (mockupEl) {
        gsap.to(mockupEl, { y: -12, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      }
      chipEls.forEach((chip, i) => {
        gsap.to(chip, {
          y: i % 2 === 0 ? -7 : -9,
          duration: 3.4 + i * 0.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.5,
        })
      })

      // Count-up loops — cycle every 4 s (1.4 s count + 2.6 s pause)
      const reachEl   = el.querySelector('.smp-reach-val')  as HTMLElement | null
      const engageEl  = el.querySelector('.smp-engage-val') as HTMLElement | null

      if (reachEl) {
        const r = { val: 280 }
        gsap.fromTo(r, { val: 0 }, {
          val: 280, duration: 1.4, ease: 'power2.out',
          repeat: -1, repeatDelay: 4.6, delay: 1.2,
          onUpdate: () => { reachEl.textContent = '+' + Math.round(r.val) },
        })
      }

      if (engageEl) {
        const e = { val: 8.4 }
        gsap.fromTo(e, { val: 0 }, {
          val: 8.4, duration: 1.4, ease: 'power2.out',
          repeat: -1, repeatDelay: 4.6, delay: 1.5,
          onUpdate: () => { engageEl.textContent = e.val.toFixed(1) },
        })
      }
    }, '-=0.1')
  }), [])

  // ── Section 3: Strategy ──
  useEffect(() => observe(stratRef, el => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(el.querySelectorAll('.sms-heading'), { opacity: 1, y: 0, duration: 0.8 }, 0)
    tl.to(el.querySelectorAll('.sms-line'),    { scaleX: 1, duration: 0.6, stagger: 0.1, ease: 'power2.inOut' }, 0.2)
    tl.to(el.querySelectorAll('.sms-item'),    { opacity: 1, x: 0, duration: 0.55, stagger: 0.09 }, 0.25)
  }), [])

  // ── Section 4: Brand Presence ──
  useEffect(() => observe(proofRef, el => {
    const mainImg = el.querySelector('.smpr-main') as HTMLElement | null
    const bgImg   = el.querySelector('.smpr-bg')   as HTMLElement | null

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(el.querySelectorAll('.smpr-label'),   { opacity: 1, y: 0, duration: 0.6 }, 0)
    tl.to(el.querySelectorAll('.smpr-hword'),   { opacity: 1, y: 0, duration: 0.72, stagger: 0.1, ease: 'power3.out' }, 0.1)
    tl.to(el.querySelectorAll('.smpr-body'),    { opacity: 1, y: 0, duration: 0.75 }, 0.22)
    tl.to(el.querySelectorAll('.smpr-metric'),  { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.3)
    tl.to(el.querySelectorAll('.smpr-bg'),      { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 0.1)
    tl.to(el.querySelectorAll('.smpr-main'),    { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.25)
    tl.to(el.querySelectorAll('.smpr-badge'),   { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power2.out' }, 0.5)

    // Continuous float after reveal
    tl.add(() => {
      if (mainImg) gsap.to(mainImg, { y: -10, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      if (bgImg)   gsap.to(bgImg,  { y: -6,  duration: 5.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.6 })
      el.querySelectorAll('.smpr-badge').forEach((b, i) => {
        gsap.to(b, { y: i % 2 === 0 ? -7 : -9, duration: 3.6 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.4 })
      })
    }, '-=0.1')
  }), [])

  // ── Section 5: Beauty Campaign Showcase ──
  useEffect(() => observe(beautyRef, el => {
    const imgEl  = el.querySelector('.smbs-img') as HTMLElement | null
    const numEl  = el.querySelector('.smbs-num-val') as HTMLElement | null
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(el.querySelectorAll('.smbs-label'),  { opacity: 1, y: 0, duration: 0.6 }, 0)
    tl.to(el.querySelectorAll('.smbs-hword'),  { opacity: 1, y: 0, duration: 0.72, stagger: 0.09, ease: 'power3.out' }, 0.1)
    tl.to(el.querySelectorAll('.smbs-body'),   { opacity: 1, y: 0, duration: 0.75, stagger: 0.12 }, 0.22)
    tl.to(el.querySelectorAll('.smbs-item'),   { opacity: 1, y: 0, duration: 0.5,  stagger: 0.09 }, 0.3)
    tl.to(el.querySelectorAll('.smbs-img'),    { opacity: 1, y: 0, duration: 1.2,  ease: 'power2.out' }, 0.15)
    tl.add(() => {
      if (imgEl) gsap.to(imgEl, { y: -10, duration: 4.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      // Looping counter: 0 → 3.8 over 1.5s, then pause 1.5s, repeat (total 3s cycle)
      if (numEl) {
        const counter = { val: 0 }
        gsap.to(counter, {
          val: 3.8,
          duration: 1.5,
          ease: 'power2.out',
          repeat: -1,
          repeatDelay: 1.5,
          onUpdate: () => { numEl.innerText = counter.val.toFixed(1) },
        })
      }
    }, '-=0.1')
  }), [])

  // ── Section 6: Platform-Ready Campaign Visuals ──
  useEffect(() => observe(ctaRef, el => {
    const imgAFrame = el.querySelector('.s5cv-img-a') as HTMLElement | null
    const imgBFrame = el.querySelector('.s5cv-img-b') as HTMLElement | null
    const imgAInner = el.querySelector('.s5cv-img-a img') as HTMLElement | null
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(el.querySelectorAll('.s5cv-label'),   { opacity: 1, y: 0, duration: 0.6 }, 0)
    tl.to(el.querySelectorAll('.s5cv-hword'),   { opacity: 1, y: 0, duration: 0.72, stagger: 0.09, ease: 'power3.out' }, 0.1)
    tl.to(el.querySelectorAll('.s5cv-body'),    { opacity: 1, y: 0, duration: 0.75, stagger: 0.12 }, 0.22)
    tl.to(el.querySelectorAll('.s5cv-item'),    { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, 0.3)
    tl.to(el.querySelectorAll('.s5cv-img-a'),   { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.15)
    tl.to(el.querySelectorAll('.s5cv-img-b'),   { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, 0.28)
    tl.add(() => {
      // Image 1: floats UP, tilts, inner img zooms in and out
      if (imgAFrame) gsap.to(imgAFrame, { y: -16, rotation: 1.8, duration: 4.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      if (imgAInner) gsap.to(imgAInner, { scale: 1.09, duration: 4.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      // Image 2: floats DOWN, tilts opposite direction
      if (imgBFrame) gsap.to(imgBFrame, { y: 16, rotation: -1.8, duration: 4.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.35 })
    }, '-=0.1')
  }), [])

  // ── Section 6: Short-Form ──
  useEffect(() => observe(s6Ref, el => {
    const videoEl = el.querySelector('.s6-video') as HTMLElement | null
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(el.querySelectorAll('.s6-badge'),   { opacity: 1, y: 0, duration: 0.6 }, 0)
    tl.to(el.querySelectorAll('.s6-heading'), { opacity: 1, y: 0, duration: 0.85 }, 0.1)
    tl.to(el.querySelectorAll('.s6-body'),    { opacity: 1, y: 0, duration: 0.7 }, 0.22)
    tl.to(el.querySelectorAll('.s6-pill'),    { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, 0.3)
    tl.to(el.querySelectorAll('.s6-video'),   { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.35)
    tl.add(() => {
      if (videoEl) gsap.to(videoEl, { y: -10, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, '-=0.1')
  }), [])

  // ── Section 7: Why Brands Work With Weavy ──
  useEffect(() => observe(smFeatRef, el => {
    // Header elements
    gsap.set(el.querySelectorAll('.smf-eyebrow'),      { opacity: 0, y: 18 })
    gsap.set(el.querySelectorAll('.smf-heading'),      { opacity: 0, y: 28, filter: 'blur(8px)' })
    gsap.set(el.querySelectorAll('.smf-rule'),         { opacity: 0, scaleX: 0, transformOrigin: 'center' })
    // Per-element block targets
    gsap.set(el.querySelectorAll('.smf-icon'),         { opacity: 0, scale: 0.55, filter: 'blur(4px)' })
    gsap.set(el.querySelectorAll('.smf-block-heading'),{ opacity: 0, y: 18, filter: 'blur(6px)' })
    gsap.set(el.querySelectorAll('.smf-block-body'),   { opacity: 0, y: 14 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    // Header sequence
    tl.to(el.querySelectorAll('.smf-eyebrow'),       { opacity: 1, y: 0, duration: 0.6 }, 0)
    tl.to(el.querySelectorAll('.smf-heading'),       { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0 }, 0.1)
    tl.to(el.querySelectorAll('.smf-rule'),          { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0.3)
    // Icons pop in with spring stagger
    tl.to(el.querySelectorAll('.smf-icon'),          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.14, ease: 'back.out(1.8)' }, 0.55)
    // Headings fade up, staggered behind icons
    tl.to(el.querySelectorAll('.smf-block-heading'), { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, stagger: 0.14 }, 0.72)
    // Body copy fades in last, softer
    tl.to(el.querySelectorAll('.smf-block-body'),    { opacity: 1, y: 0, duration: 0.65, stagger: 0.14 }, 0.9)

    // ── Continuous idle animations per icon ──
    tl.add(() => {
      const icons = el.querySelectorAll('.smf-icon')

      // Icon 1 (orange) — outer ring breathes in opacity + whole icon gentle float
      const icon0 = icons[0] as HTMLElement | undefined
      if (icon0) {
        const ring = icon0.querySelector('circle:first-child') as SVGCircleElement | null
        if (ring) gsap.to(ring, { opacity: 0.55, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap.to(icon0, { y: -5, duration: 3.0, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      }

      // Icon 2 (cyan) — full SVG slow rotation (radial ticks spin like a gear)
      const icon1 = icons[1] as HTMLElement | undefined
      if (icon1) {
        const svg1 = icon1.querySelector('svg')
        if (svg1) gsap.to(svg1, { rotation: 360, duration: 9, ease: 'none', repeat: -1, transformOrigin: '50% 50%' })
      }

      // Icon 3 (magenta star) — scale pulse breathe
      const icon2 = icons[2] as HTMLElement | undefined
      if (icon2) {
        const svg2 = icon2.querySelector('svg')
        if (svg2) gsap.to(svg2, { scale: 1.12, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 50%' })
      }

      // Icon 4 (blue chart) — polyline stroke-draw loop
      const icon3 = icons[3] as HTMLElement | undefined
      if (icon3) {
        const line = icon3.querySelector('polyline:first-child') as SVGGeometryElement | null
        if (line) {
          const len = line.getTotalLength()
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
          gsap.to(line, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power2.inOut',
            repeat: -1,
            repeatDelay: 1.8,
            onRepeat() { gsap.set(line, { strokeDashoffset: len }) },
          })
        }
      }
    }, '>')
  }), [])

  return (
    <>
    {/* ══ SECTION 1 — Hero Showcase ══════════════════════════════════════════ */}
    <section
      ref={heroRef}
      id="social-media-marketing-detail"
      className="relative w-screen overflow-hidden"
      style={{ height: 'clamp(460px, 58vw, 700px)', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', background: '#010709' }}
    >
      {/* Full-width background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          pointerEvents: 'none',
        }}
        src="/brand_assets/Social_media.mp4"
      />

      {/* Dark overlay for text legibility */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, hsl(0 0% 0% / 0.72) 0%, hsl(0 0% 0% / 0.35) 60%, transparent 100%)',
      }}/>

      {/* Dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.022) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}/>

      {/* Text content */}
      <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-20">
        <div>
          <h1
            className="smh-heading font-sans font-light text-text"
            style={{ opacity: 0, transform: 'translateY(28px)', fontSize: 'clamp(2.6rem, 6vw, 5rem)', lineHeight: 1.1, letterSpacing: '-0.04em' }}
          >
            <span style={{ display: 'block' }}>Social Media</span>
            <em style={{ display: 'block', fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(280 65% 72%)' }}>
              Marketing
            </em>
          </h1>
        </div>
      </div>
    </section>

    {/* ══ SECTION 2 — Digital Ecosystem ════════════════════════════════════════ */}
    <section
      ref={platRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 12vw, 10rem) 0' }}
    >
      {/* Top fade — blends seamlessly with Section 1 */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-0" style={{
        height: '120px',
        background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>

      {/* SVG grain texture */}
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.045, pointerEvents: 'none', zIndex: 1 }}>
        <filter id="smp-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#smp-noise)" style={{ fill: 'white' }}/>
      </svg>

      {/* Dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 0,
        backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.025) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}/>

      {/* Barely-there atmospheric lift */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 0,
        background: 'radial-gradient(ellipse 70% 55% at 60% 50%, hsl(199 30% 25% / 0.012) 0%, transparent 70%)',
        filter: 'blur(160px)',
        opacity: 0.6,
      }}/>

      <div className="relative z-10 max-w-[80rem] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.18fr] gap-20 lg:gap-12 xl:gap-24 items-center">

          {/* ── LEFT: copy ── */}
          <div className="relative flex flex-col justify-center">

            {/* Oversize watermark text */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '-2.5rem', left: '-1rem',
                fontSize: 'clamp(7rem, 17vw, 14rem)',
                lineHeight: 0.82,
                letterSpacing: '-0.06em',
                color: 'transparent',
                WebkitTextStroke: '1px hsl(0 0% 100% / 0.032)',
                userSelect: 'none',
                pointerEvents: 'none',
                zIndex: 0,
                fontFamily: 'sans-serif',
                fontWeight: 300,
              }}
            >
              Social
            </div>

            {/* All real content — above watermark */}
            <div className="relative z-10 flex flex-col">

              {/* Badge */}
              <span
                className="smp-label inline-flex items-center gap-2 mb-8 font-sans font-light uppercase self-start"
                style={{
                  opacity: 0, transform: 'translateY(16px)',
                  fontSize: '0.63rem', letterSpacing: '0.3em',
                  color: 'hsl(199 89% 68%)',
                  border: '1px solid hsl(199 89% 60% / 0.28)',
                  borderRadius: '999px',
                  padding: '0.33rem 1.05rem',
                  background: 'hsl(199 89% 60% / 0.06)',
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'hsl(199 89% 60%)', flexShrink: 0 }}/>
                Digital Ecosystem
              </span>

              {/* Heading */}
              <h2
                className="smp-heading font-sans font-light text-text mb-5"
                style={{
                  opacity: 0, transform: 'translateY(28px)',
                  fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.036em',
                }}
              >
                Every platform<br />
                working together to{' '}
                <em
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: 'italic',
                    fontWeight: 400,
                    background: 'linear-gradient(108deg, hsl(199 89% 74%) 0%, hsl(240 60% 74%) 55%, hsl(280 65% 74%) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  grow your brand
                </em>
              </h2>

              {/* Thin accent rule */}
              <div style={{
                height: 1,
                background: 'linear-gradient(to right, hsl(199 89% 60% / 0.35), transparent)',
                marginBottom: '1.6rem',
                maxWidth: '20rem',
              }}/>

              {/* Body */}
              <p
                className="smp-body font-sans font-light mb-10"
                style={{
                  opacity: 0, transform: 'translateY(18px)',
                  fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
                  lineHeight: 1.9,
                  color: '#F2F8FC',
                  maxWidth: '34rem',
                }}
              >
                We create connected social media systems that keep your content active, engaging,
                and strategically aligned across every major platform.
              </p>

              {/* Feature list — horizontal-rule style */}
              <ul className="flex flex-col" style={{ borderTop: '1px solid hsl(0 0% 100% / 0.07)' }}>
                {[
                  'Multi-platform content strategy',
                  'Consistent visual identity',
                  'Real-time audience engagement',
                  'Performance-focused campaign structure',
                ].map(text => (
                  <li
                    key={text}
                    className="smp-feat flex items-center justify-between font-sans font-light"
                    style={{
                      opacity: 0, transform: 'translateY(10px)',
                      fontSize: 'clamp(0.84rem, 1.2vw, 0.92rem)',
                      color: '#F2F8FC',
                      borderBottom: '1px solid hsl(0 0% 100% / 0.07)',
                      padding: '0.88rem 0',
                      cursor: 'default',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = 'hsl(0 0% 88%)';
                      ((e.currentTarget as HTMLElement).querySelector('.smp-arrow') as HTMLElement | null)?.style.setProperty('opacity', '1')
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = '#F2F8FC';
                      ((e.currentTarget as HTMLElement).querySelector('.smp-arrow') as HTMLElement | null)?.style.setProperty('opacity', '0.28')
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span style={{ fontSize: '0.45rem', color: 'hsl(199 89% 60%)', flexShrink: 0 }}>◆</span>
                      {text}
                    </span>
                    <span
                      className="smp-arrow font-sans"
                      style={{
                        fontSize: '0.72rem',
                        color: 'hsl(199 89% 65%)',
                        opacity: 0.28,
                        transition: 'opacity 0.25s ease',
                        flexShrink: 0,
                        marginLeft: '1rem',
                      }}
                    >
                      →
                    </span>
                  </li>
                ))}
              </ul>

            </div>
          </div>

          {/* ── RIGHT: floating mockup ── */}
          <div
            className="relative flex items-center justify-center lg:justify-end"
            style={{ minHeight: '560px' }}
          >

            {/* Deep ambient glow slab behind image — removed */}

            {/* GSAP-controlled wrapper: handles opacity + float y */}
            <div
              className="smp-mockup relative z-10"
              style={{ opacity: 0, transform: 'translateY(44px)', width: '100%', maxWidth: '560px' }}
            >
              {/* Perspective tilt + CSS hover inner layer */}
              <div
                style={{
                  transform: 'perspective(1100px) rotateY(-10deg) rotateX(5deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.75s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.75s ease',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 80px 160px -24px hsl(0 0% 0% / 0.88), 0 0 0 1px hsl(0 0% 100% / 0.05)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'perspective(1100px) rotateY(-4deg) rotateX(2deg) scale(1.03)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 100px 180px -24px hsl(0 0% 0% / 0.92), 0 0 0 1px hsl(0 0% 100% / 0.08)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'perspective(1100px) rotateY(-10deg) rotateX(5deg)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 80px 160px -24px hsl(0 0% 0% / 0.88), 0 0 0 1px hsl(0 0% 100% / 0.05)'
                }}
              >
                <video
                  src="https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/social_control_room.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
                {/* Bottom vignette */}
                <div aria-hidden="true" style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
                  background: 'linear-gradient(to bottom, transparent 0%, hsl(200 30% 3% / 0.72) 100%)',
                  pointerEvents: 'none',
                }}/>
                {/* Left edge fade */}
                <div aria-hidden="true" style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0, width: '18%',
                  background: 'linear-gradient(to right, hsl(200 25% 3% / 0.65) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }}/>
              </div>
            </div>

            {/* Floating stat chip — top left */}
            <div
              className="smp-chip"
              style={{
                opacity: 0, transform: 'translateY(18px)',
                position: 'absolute', top: '6%', left: '0', zIndex: 20,
                background: 'hsl(0 0% 5% / 0.9)',
                backdropFilter: 'blur(22px)',
                border: '1px solid hsl(0 0% 100% / 0.07)',
                borderRadius: '0.875rem',
                padding: '0.9rem 1.3rem',
                boxShadow: '0 12px 40px -8px hsl(0 0% 0% / 0.65), 0 0 0 1px hsl(0 0% 100% / 0.04)',
              }}
            >
              <p className="font-sans" style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'hsl(199 89% 65%)', marginBottom: '0.32rem' }}>Reach Growth</p>
              <p className="font-sans font-light text-text" style={{ fontSize: '1.75rem', letterSpacing: '-0.036em', lineHeight: 1 }}>
                <span className="smp-reach-val">+280</span><span style={{ fontSize: '0.88rem', color: 'hsl(199 89% 60%)', marginLeft: '1px' }}>%</span>
              </p>
              <p className="font-sans font-light" style={{ fontSize: '0.63rem', color: 'hsl(0 0% 36%)', marginTop: '0.22rem', letterSpacing: '0.04em' }}>avg. across clients</p>
            </div>

            {/* Floating stat chip — bottom right */}
            <div
              className="smp-chip"
              style={{
                opacity: 0, transform: 'translateY(18px)',
                position: 'absolute', bottom: '5%', right: '0', zIndex: 20,
                background: 'hsl(0 0% 5% / 0.9)',
                backdropFilter: 'blur(22px)',
                border: '1px solid hsl(0 0% 100% / 0.07)',
                borderRadius: '0.875rem',
                padding: '0.9rem 1.3rem',
                boxShadow: '0 12px 40px -8px hsl(0 0% 0% / 0.65), 0 0 0 1px hsl(0 0% 100% / 0.04)',
              }}
            >
              <p className="font-sans" style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'hsl(280 65% 72%)', marginBottom: '0.32rem' }}>Engagement Rate</p>
              <p className="font-sans font-light text-text" style={{ fontSize: '1.75rem', letterSpacing: '-0.036em', lineHeight: 1 }}>
                <span className="smp-engage-val">8.4</span><span style={{ fontSize: '0.88rem', color: 'hsl(280 65% 65%)', marginLeft: '1px' }}>%</span>
              </p>
              <p className="font-sans font-light" style={{ fontSize: '0.63rem', color: 'hsl(0 0% 36%)', marginTop: '0.22rem', letterSpacing: '0.04em' }}>12-week average</p>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom fade — blends grain/dot textures into Section 3 */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 bottom-0" style={{
        height: '120px',
        background: 'linear-gradient(to top, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>
    </section>

    {/* ══ SECTION 3 — Content Strategy ═══════════════════════════════════════ */}
    <section
      ref={stratRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
    >
      {/* Soft cinematic atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 70% 55% at 55% 50%, hsl(199 89% 60% / 0.07) 0%, transparent 70%)',
          'radial-gradient(ellipse 45% 40% at 20% 75%, hsl(195 70% 50% / 0.05) 0%, transparent 65%)',
        ].join(', '),
        filter: 'blur(60px)',
      }}/>

      <div className="relative z-10 max-w-[62rem] mx-auto px-6 sm:px-10">

        {/* Heading */}
        <div className="mb-16">
          <p className="sms-heading font-sans uppercase mb-4" style={{ opacity: 0, transform: 'translateY(20px)', fontSize: '0.7rem', letterSpacing: '0.3em', color: 'hsl(0 0% 40%)' }}>
            What we deliver
          </p>
          <h2
            className="sms-heading font-sans font-light text-text"
            style={{ opacity: 0, transform: 'translateY(24px)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.033em', maxWidth: '34rem' }}
          >
            Content backed by{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>strategy</em>
          </h2>
        </div>

        {/* Horizontal blocks */}
        <div className="flex flex-col">
          {STRATEGY_ITEMS.map(({ label, desc }, i) => (
            <div key={i}>
              <div
                className="sms-line"
                style={{ height: '1px', background: 'hsl(0 0% 100% / 0.07)', transformOrigin: 'left center', transform: 'scaleX(0)' }}
                aria-hidden="true"
              />
              <div
                className="sms-item flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-12 py-7"
                style={{ opacity: 0, transform: 'translateX(-20px)' }}
                onMouseEnter={e => {
                  const num = e.currentTarget.querySelector('.sms-num') as HTMLElement | null
                  if (!num) return
                  num.style.filter = 'drop-shadow(0 0 6px hsl(199 89% 60% / 0.8)) drop-shadow(0 0 14px hsl(199 89% 60% / 0.45))'
                  gsap.killTweensOf(num)
                  gsap.to(num, { scale: 1.12, duration: 0.25, ease: 'power2.out', transformOrigin: 'center center' })
                  gsap.to(num, { scale: 1, duration: 0.7, delay: 0.25, ease: 'elastic.out(1, 0.45)', transformOrigin: 'center center' })
                }}
                onMouseLeave={e => {
                  const num = e.currentTarget.querySelector('.sms-num') as HTMLElement | null
                  if (!num) return
                  num.style.filter = 'drop-shadow(0 0 4px hsl(199 89% 60% / 0.35))'
                  gsap.killTweensOf(num)
                  gsap.to(num, { scale: 1, duration: 0.35, ease: 'power2.inOut', transformOrigin: 'center center' })
                }}
              >
                {/* Number */}
                <span
                  className="sms-num font-sans shrink-0"
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    minWidth: '2rem',
                    fontVariantNumeric: 'tabular-nums',
                    background: 'linear-gradient(135deg, hsl(199 89% 78%) 0%, hsl(215 80% 68%) 60%, hsl(199 70% 60%) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 4px hsl(199 89% 60% / 0.35))',
                    transition: 'filter 0.3s ease',
                    display: 'inline-block',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Label */}
                <p className="font-sans font-light text-text shrink-0" style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', letterSpacing: '-0.015em', minWidth: '18rem' }}>
                  {label}
                </p>
                {/* Desc */}
                <p className="font-sans font-light" style={{ fontSize: '0.84rem', lineHeight: 1.75, color: '#F2F8FC' }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
          {/* Final line */}
          <div
            className="sms-line"
            style={{ height: '1px', background: 'hsl(0 0% 100% / 0.07)', transformOrigin: 'left center', transform: 'scaleX(0)' }}
            aria-hidden="true"
          />
        </div>

      </div>
    </section>

    {/* ══ SECTION 4 — Brand Presence & Engagement ════════════════════════════ */}
    <section
      ref={proofRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 12vw, 10rem) 0' }}
    >
      {/* Top fade — blends seamlessly with Section 3 */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-0" style={{
        height: '120px',
        background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>

      {/* SVG grain texture */}
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none', zIndex: 1 }}>
        <filter id="smpr-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#smpr-noise)" style={{ fill: 'white' }}/>
      </svg>

      {/* Dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 0,
        backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.025) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}/>

      {/* Cyan-blue tint — center/right biased */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 0,
        background: [
          'radial-gradient(ellipse 80% 60% at 62% 50%, hsl(195 80% 55% / 0.07) 0%, transparent 70%)',
          'radial-gradient(ellipse 50% 40% at 75% 40%, hsl(199 89% 60% / 0.05) 0%, transparent 60%)',
          'radial-gradient(ellipse 60% 50% at 50% 100%, hsl(195 70% 40% / 0.04) 0%, transparent 65%)',
        ].join(', '),
      }}/>

      <div className="relative z-10 max-w-[82rem] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-12 xl:gap-20 items-center">

          {/* ── LEFT: Side-by-side image row ── */}
          <div className="flex flex-col gap-6">

            {/* Image row */}
            <div className="flex flex-col sm:flex-row gap-6 items-stretch">

              {/* PRIMARY: OmarEventOrganiser — larger, left */}
              <div
                className="smpr-main relative rounded-2xl overflow-hidden"
                style={{
                  opacity: 0, transform: 'translateY(36px)',
                  flex: '0.7',
                  boxShadow: [
                    '0 40px 80px -16px hsl(0 0% 0% / 0.88)',
                    '0 0 0 1px hsl(280 65% 65% / 0.14)',
                    '0 0 72px -18px hsl(280 65% 65% / 0.38)',
                  ].join(', '),
                  transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.02)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = [
                    '0 56px 100px -16px hsl(0 0% 0% / 0.92)',
                    '0 0 0 1px hsl(280 65% 65% / 0.26)',
                    '0 0 90px -14px hsl(280 65% 65% / 0.52)',
                  ].join(', ')
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'none'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = [
                    '0 40px 80px -16px hsl(0 0% 0% / 0.88)',
                    '0 0 0 1px hsl(280 65% 65% / 0.14)',
                    '0 0 72px -18px hsl(280 65% 65% / 0.38)',
                  ].join(', ')
                }}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src="/brand_assets/OmarEventOrganiser's Facebook profile page-2.png"
                  alt="Omar Event Organiser Facebook profile page"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
                <div aria-hidden="true" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, transparent 55%, hsl(270 20% 3% / 0.6) 100%)',
                  pointerEvents: 'none',
                }}/>
              </div>

              {/* SECONDARY: aimedia.png — slightly smaller, right */}
              <div
                className="smpr-bg relative rounded-2xl overflow-hidden"
                style={{
                  opacity: 0, transform: 'translateY(44px)',
                  flex: '1.3',
                  alignSelf: 'flex-start',
                  boxShadow: [
                    '0 32px 64px -16px hsl(0 0% 0% / 0.82)',
                    '0 0 0 1px hsl(199 89% 60% / 0.14)',
                    '0 0 56px -16px hsl(199 89% 60% / 0.32)',
                  ].join(', '),
                  transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.02)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = [
                    '0 44px 80px -16px hsl(0 0% 0% / 0.88)',
                    '0 0 0 1px hsl(199 89% 60% / 0.24)',
                    '0 0 70px -12px hsl(199 89% 60% / 0.46)',
                  ].join(', ')
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'none'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = [
                    '0 32px 64px -16px hsl(0 0% 0% / 0.82)',
                    '0 0 0 1px hsl(199 89% 60% / 0.14)',
                    '0 0 56px -16px hsl(199 89% 60% / 0.32)',
                  ].join(', ')
                }}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src="/brand_assets/aimedia.png"
                  alt="AI Media social media showcase"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
                {/* Subtle neon tint */}
                <div aria-hidden="true" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, hsl(199 89% 60% / 0.08) 0%, hsl(280 65% 65% / 0.07) 100%)',
                  mixBlendMode: 'screen', pointerEvents: 'none',
                }}/>
                <div aria-hidden="true" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, transparent 55%, hsl(200 25% 3% / 0.6) 100%)',
                  pointerEvents: 'none',
                }}/>
              </div>

            </div>

            {/* Stat chips row — below images */}
            <div className="flex gap-4">
              <div
                className="smpr-badge flex-1"
                style={{
                  opacity: 0, transform: 'translateY(16px)',
                  background: 'hsl(0 0% 5% / 0.92)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid hsl(199 89% 60% / 0.22)',
                  borderRadius: '0.875rem',
                  padding: '0.85rem 1.2rem',
                  boxShadow: '0 8px 28px -8px hsl(0 0% 0% / 0.6), 0 0 24px -8px hsl(199 89% 60% / 0.22)',
                }}
              >
                <p className="font-sans" style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'hsl(199 89% 65%)', marginBottom: '0.28rem' }}>Audience Reach</p>
                <p className="font-sans font-light text-text" style={{ fontSize: '1.6rem', letterSpacing: '-0.036em', lineHeight: 1 }}>
                  450<span style={{ fontSize: '0.95rem', color: 'hsl(199 89% 60%)' }}>K+</span>
                </p>
                <p className="font-sans font-light" style={{ fontSize: '0.62rem', color: 'hsl(0 0% 36%)', marginTop: '0.2rem' }}>avg. combined reach</p>
              </div>

              <div
                className="smpr-badge flex-1"
                style={{
                  opacity: 0, transform: 'translateY(16px)',
                  background: 'hsl(0 0% 5% / 0.92)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid hsl(280 65% 65% / 0.22)',
                  borderRadius: '0.875rem',
                  padding: '0.85rem 1.2rem',
                  boxShadow: '0 8px 28px -8px hsl(0 0% 0% / 0.6), 0 0 24px -8px hsl(280 65% 65% / 0.2)',
                }}
              >
                <p className="font-sans" style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'hsl(280 65% 72%)', marginBottom: '0.28rem' }}>Engagement</p>
                <p className="font-sans font-light text-text" style={{ fontSize: '1.6rem', letterSpacing: '-0.036em', lineHeight: 1 }}>
                  9.2<span style={{ fontSize: '0.9rem', color: 'hsl(280 65% 65%)' }}>%</span>
                </p>
                <p className="font-sans font-light" style={{ fontSize: '0.62rem', color: 'hsl(0 0% 36%)', marginTop: '0.2rem' }}>12-week avg rate</p>
              </div>
            </div>

          </div>

          {/* ── RIGHT: copy ── */}
          <div className="relative flex flex-col justify-center">

            {/* Ghost watermark */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: '-2rem', right: '-1rem',
              fontSize: 'clamp(6rem, 14vw, 12rem)',
              lineHeight: 0.82, letterSpacing: '-0.06em',
              color: 'transparent',
              WebkitTextStroke: '1px hsl(0 0% 100% / 0.03)',
              userSelect: 'none', pointerEvents: 'none', zIndex: 0,
              fontFamily: 'sans-serif', fontWeight: 300,
            }}>
              Brand
            </div>

            <div className="relative z-10 flex flex-col">

              {/* Badge */}
              <span
                className="smpr-label inline-flex items-center gap-2 mb-8 font-sans font-light uppercase self-start"
                style={{
                  opacity: 0, transform: 'translateY(16px)',
                  fontSize: '0.63rem', letterSpacing: '0.3em',
                  color: 'hsl(280 65% 72%)',
                  border: '1px solid hsl(280 65% 65% / 0.28)',
                  borderRadius: '999px',
                  padding: '0.33rem 1.05rem',
                  background: 'hsl(280 65% 65% / 0.06)',
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'hsl(280 65% 65%)', boxShadow: '0 0 7px hsl(280 65% 65%)', flexShrink: 0 }}/>
                Social Authority
              </span>

              {/* Heading */}
              <h2
                className="smpr-heading font-sans font-light text-text mb-5"
                style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3rem)', lineHeight: 1.22, letterSpacing: '-0.035em' }}
              >
                {['Profiles', 'built', 'to', 'attract'].map((word, i) => (
                  <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.24em', paddingBottom: '0.05em' }}>
                    <span className="smpr-hword" style={{ display: 'inline-block', transform: 'translateY(110%)', opacity: 0 }}>
                      {word}
                    </span>
                  </span>
                ))}
                <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.05em' }}>
                  <span
                    className="smpr-hword"
                    style={{
                      display: 'inline-block', transform: 'translateY(110%)', opacity: 0,
                      background: 'linear-gradient(108deg, hsl(280 65% 74%) 0%, hsl(240 60% 74%) 50%, hsl(199 89% 74%) 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}
                  >
                    attention and build trust
                  </span>
                </em>
              </h2>

              {/* Accent rule */}
              <div style={{
                height: 1,
                background: 'linear-gradient(to right, hsl(280 65% 65% / 0.35), transparent)',
                marginBottom: '1.6rem', maxWidth: '20rem',
              }}/>

              {/* Body */}
              <p
                className="smpr-body font-sans font-light mb-10"
                style={{
                  opacity: 0, transform: 'translateY(18px)',
                  fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
                  lineHeight: 1.9, color: '#F2F8FC', maxWidth: '34rem',
                }}
              >
                We create high-converting social media experiences that make brands look professional,
                engaging, and instantly recognisable across every major platform.
              </p>

              {/* Metrics list — horizontal rule style */}
              <ul className="flex flex-col" style={{ borderTop: '1px solid hsl(0 0% 100% / 0.07)' }}>
                {[
                  { stat: '450K+', label: 'Audience Reach' },
                  { stat: '∞',     label: 'Multi-Platform Visibility' },
                  { stat: '↑',     label: 'High-Engagement Content Systems' },
                  { stat: '◆',     label: 'Optimised Brand Positioning' },
                ].map(({ stat, label }) => (
                  <li
                    key={label}
                    className="smpr-metric flex items-center justify-between font-sans font-light"
                    style={{
                      opacity: 0, transform: 'translateY(10px)',
                      fontSize: 'clamp(0.84rem, 1.2vw, 0.92rem)',
                      color: '#F2F8FC',
                      borderBottom: '1px solid hsl(0 0% 100% / 0.07)',
                      padding: '0.88rem 0',
                      cursor: 'default',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'hsl(0 0% 88%)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#F2F8FC' }}
                  >
                    <span className="flex items-center gap-3">
                      <span style={{ fontSize: '0.7rem', color: 'hsl(280 65% 65%)', flexShrink: 0, width: '1.8rem', textAlign: 'center' }}>{stat}</span>
                      {label}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'hsl(280 65% 65%)', opacity: 0.35, flexShrink: 0, marginLeft: '1rem' }}>→</span>
                  </li>
                ))}
              </ul>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade — blends grain/dot textures into Section 5 */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 bottom-0" style={{
        height: '120px',
        background: 'linear-gradient(to top, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>
    </section>

    {/* ══ SECTION 5 — Beauty Campaign Showcase ════════════════════════════════ */}
    <section
      ref={beautyRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 12vw, 10rem) 0' }}
    >
      {/* Top fade */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-0" style={{
        height: '120px',
        background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>

      {/* Dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 0,
        backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.025) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}/>

      {/* Ambient glow — left-biased */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 0,
        background: [
          'radial-gradient(ellipse 70% 60% at 25% 50%, hsl(280 65% 65% / 0.07) 0%, transparent 70%)',
          'radial-gradient(ellipse 50% 40% at 15% 40%, hsl(199 89% 60% / 0.04) 0%, transparent 60%)',
          'radial-gradient(ellipse 60% 50% at 50% 100%, hsl(280 60% 40% / 0.04) 0%, transparent 65%)',
        ].join(', '),
      }}/>

      <div className="relative z-10 max-w-[82rem] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-12 xl:gap-20 items-center">

          {/* ── LEFT: beauty.png image ── */}
          <div className="relative">
            <div
              className="smbs-img relative rounded-2xl overflow-hidden"
              style={{
                opacity: 0, transform: 'translateY(36px)',
                height: window.innerWidth >= 1024 ? '160px' : 'clamp(200px, 24vw, 320px)',
                boxShadow: [
                  '0 48px 96px -16px hsl(0 0% 0% / 0.9)',
                  '0 0 0 1px hsl(280 65% 65% / 0.14)',
                  '0 0 72px -18px hsl(280 65% 65% / 0.32)',
                ].join(', '),
                transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px) scale(1.01)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = [
                  '0 64px 120px -14px hsl(0 0% 0% / 0.94)',
                  '0 0 0 1px hsl(280 65% 65% / 0.26)',
                  '0 0 96px -14px hsl(280 65% 65% / 0.46)',
                ].join(', ')
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'none'
                ;(e.currentTarget as HTMLElement).style.boxShadow = [
                  '0 48px 96px -16px hsl(0 0% 0% / 0.9)',
                  '0 0 0 1px hsl(280 65% 65% / 0.14)',
                  '0 0 72px -18px hsl(280 65% 65% / 0.32)',
                ].join(', ')
              }}
            >
              <img
                loading="lazy"
                decoding="async"
                src="/brand_assets/beauty.png"
                alt="Beauty brand social media campaign showcase"
                style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, hsl(280 65% 65% / 0.06) 0%, hsl(199 89% 60% / 0.05) 100%)',
                mixBlendMode: 'screen', pointerEvents: 'none',
              }}/>
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, hsl(270 20% 3% / 0.55) 100%)',
                pointerEvents: 'none',
              }}/>
            </div>

            {/* Floating stat badge */}
            <div
              className="smbs-img absolute -bottom-4 right-0 sm:bottom-5 sm:right-5"
              style={{
                opacity: 0, transform: 'translateY(16px)',
                background: 'hsl(0 0% 4% / 0.92)',
                backdropFilter: 'blur(20px)',
                border: '1px solid hsl(199 89% 60% / 0.22)',
                borderRadius: '0.875rem',
                padding: '0.85rem 1.25rem',
                boxShadow: '0 8px 28px -8px hsl(0 0% 0% / 0.6), 0 0 24px -8px hsl(199 89% 60% / 0.22)',
              }}
            >
              <p className="font-sans" style={{ fontSize: '0.56rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'hsl(199 89% 65%)', marginBottom: '0.26rem', fontFamily: "'Poppins', sans-serif" }}>Conversion Lift</p>
              <p className="font-sans font-light text-text" style={{ fontSize: '1.55rem', letterSpacing: '-0.036em', lineHeight: 1, fontFamily: "'Poppins', sans-serif" }}>
                <span className="smbs-num-val">3.8</span><span style={{ fontSize: '0.9rem', color: 'hsl(199 89% 60%)' }}>×</span>
              </p>
              <p className="font-sans font-light" style={{ fontSize: '0.6rem', color: 'hsl(0 0% 36%)', marginTop: '0.2rem', fontFamily: "'Poppins', sans-serif" }}>avg. campaign lift</p>
            </div>
          </div>

          {/* ── RIGHT: copy ── */}
          <div className="relative flex flex-col justify-center">

            {/* Ghost watermark */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: '-2rem', right: '-1rem',
              fontSize: 'clamp(6rem, 14vw, 12rem)',
              lineHeight: 0.82, letterSpacing: '-0.06em',
              color: 'transparent',
              WebkitTextStroke: '1px hsl(0 0% 100% / 0.03)',
              userSelect: 'none', pointerEvents: 'none', zIndex: 0,
              fontFamily: 'sans-serif', fontWeight: 300,
            }}>
              Beauty
            </div>

            <div className="relative z-10 flex flex-col">

              {/* Section label */}
              <p
                className="smbs-label font-sans uppercase mb-6"
                style={{
                  opacity: 0, transform: 'translateY(16px)',
                  fontSize: '0.6rem', letterSpacing: '0.32em',
                  color: 'hsl(0 0% 32%)', fontWeight: 300,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                SECTION 05
              </p>

              {/* Heading */}
              <h2
                className="smbs-heading font-sans font-light text-text mb-5"
                style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3rem)', lineHeight: 1.22, letterSpacing: '-0.035em' }}
              >
                {['Visuals', 'that', 'stop', 'the'].map((word, i) => (
                  <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.24em', paddingBottom: '0.05em' }}>
                    <span className="smbs-hword" style={{ display: 'inline-block', transform: 'translateY(110%)', opacity: 0 }}>
                      {word}
                    </span>
                  </span>
                ))}
                <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.05em' }}>
                  <span
                    className="smbs-hword"
                    style={{
                      display: 'inline-block', transform: 'translateY(110%)', opacity: 0,
                      background: 'linear-gradient(108deg, hsl(280 65% 74%) 0%, hsl(240 60% 74%) 50%, hsl(199 89% 74%) 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}
                  >
                    scroll cold.
                  </span>
                </em>
              </h2>

              {/* Accent rule */}
              <div style={{
                height: 1,
                background: 'linear-gradient(to right, hsl(280 65% 65% / 0.35), transparent)',
                marginBottom: '1.6rem', maxWidth: '20rem',
              }}/>

              {/* Body 1 */}
              <p
                className="smbs-body font-sans font-light mb-5"
                style={{
                  opacity: 0, transform: 'translateY(18px)',
                  fontSize: 'clamp(0.87rem, 1.35vw, 0.97rem)',
                  lineHeight: 1.9, color: '#F2F8FC', maxWidth: '34rem',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                We produce beauty and lifestyle visuals engineered for social performance — content
                that looks editorial, feels on-brand, and drives measurable results across Instagram,
                TikTok, and paid placements.
              </p>

              {/* Body 2 */}
              <p
                className="smbs-body font-sans font-light mb-10"
                style={{
                  opacity: 0, transform: 'translateY(18px)',
                  fontSize: 'clamp(0.87rem, 1.35vw, 0.97rem)',
                  lineHeight: 1.9, color: '#F2F8FC', maxWidth: '34rem',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                From luxury skincare to high-end fragrance and cosmetics, every creative is
                crafted to reflect premium positioning and connect instantly with the right audience.
              </p>

              {/* Bullet list */}
              <ul className="flex flex-col" style={{ borderTop: '1px solid hsl(0 0% 100% / 0.07)' }}>
                {[
                  'Editorial beauty and lifestyle photography',
                  'Luxury skincare & cosmetics campaign visuals',
                  'Short-form video reels for organic and paid',
                  'Influencer-style UGC creative direction',
                  'Platform-optimised carousel and story formats',
                ].map(item => (
                  <li
                    key={item}
                    className="smbs-item flex items-center gap-3 font-sans font-light"
                    style={{
                      opacity: 0, transform: 'translateY(10px)',
                      fontSize: 'clamp(0.84rem, 1.2vw, 0.9rem)',
                      color: '#F2F8FC',
                      borderBottom: '1px solid hsl(0 0% 100% / 0.07)',
                      padding: '0.82rem 0',
                      cursor: 'default',
                      transition: 'color 0.25s ease',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'hsl(0 0% 86%)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#F2F8FC' }}
                  >
                    <span style={{ fontSize: '0.42rem', color: 'hsl(280 65% 65%)', flexShrink: 0 }}>◆</span>
                    {item}
                  </li>
                ))}
              </ul>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 bottom-0" style={{
        height: '120px',
        background: 'linear-gradient(to top, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>
    </section>

    {/* ══ SECTION 6 — Platform-Ready Campaign Visuals ══════════════════════════ */}
    <section
      ref={ctaRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 12vw, 10rem) 0' }}
    >
      {/* Top fade */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-0" style={{
        height: '120px',
        background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>

      {/* Atmospheric glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 65% 50% at 72% 50%, hsl(199 89% 60% / 0.055) 0%, transparent 70%)',
          'radial-gradient(ellipse 45% 40% at 22% 55%, hsl(280 65% 65% / 0.035) 0%, transparent 65%)',
        ].join(', '),
        filter: 'blur(60px)',
      }}/>

      {/* Dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.022) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}/>

      <div className="relative z-10 max-w-[84rem] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-12 xl:gap-24 items-center">

          {/* ── LEFT: copy ── */}
          <div className="flex flex-col justify-center">

            {/* Section label */}
            <p
              className="s5cv-label font-sans uppercase mb-6"
              style={{
                opacity: 0, transform: 'translateY(16px)',
                fontSize: '0.6rem', letterSpacing: '0.32em',
                color: 'hsl(0 0% 32%)', fontWeight: 300,
              }}
            >
              SECTION 06
            </p>

            {/* Headline */}
            <h2
              className="s5cv-heading font-sans font-light text-text mb-5"
              style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3.1rem)', lineHeight: 1.22, letterSpacing: '-0.035em' }}
            >
              {['Social', 'campaigns', 'built', 'for', 'the', 'platforms'].map((word, i) => (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.24em', paddingBottom: '0.05em' }}>
                  <span className="s5cv-hword" style={{ display: 'inline-block', transform: 'translateY(110%)', opacity: 0 }}>
                    {word}
                  </span>
                </span>
              ))}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.05em' }}>
                <span
                  className="s5cv-hword"
                  style={{
                    display: 'inline-block', transform: 'translateY(110%)', opacity: 0,
                    background: 'linear-gradient(108deg, hsl(199 89% 74%) 0%, hsl(240 60% 74%) 55%, hsl(280 65% 74%) 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}
                >
                  people actually use.
                </span>
              </em>
            </h2>

            {/* Thin accent rule */}
            <div style={{
              height: 1,
              background: 'linear-gradient(to right, hsl(199 89% 60% / 0.3), transparent)',
              marginBottom: '1.8rem', maxWidth: '22rem',
            }}/>

            {/* Body 1 */}
            <p
              className="s5cv-body font-sans font-light mb-5"
              style={{
                opacity: 0, transform: 'translateY(18px)',
                fontSize: 'clamp(0.87rem, 1.35vw, 0.97rem)',
                lineHeight: 1.9, color: '#F2F8FC', maxWidth: '34rem',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              We design campaign visuals that feel native to Instagram, TikTok, Facebook, and paid social
              placements — not generic graphics forced into a feed. Every creative is shaped around the
              format, audience behaviour, visual hook, and brand tone.
            </p>

            {/* Body 2 */}
            <p
              className="s5cv-body font-sans font-light mb-10"
              style={{
                opacity: 0, transform: 'translateY(18px)',
                fontSize: 'clamp(0.87rem, 1.35vw, 0.97rem)',
                lineHeight: 1.9, color: '#F2F8FC', maxWidth: '34rem',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              From luxury product posts to scroll-stopping short-form visuals, we create assets that
              look premium, communicate quickly, and are ready to perform across organic content, ads,
              stories, reels, and social launches.
            </p>

            {/* Bullet list */}
            <ul className="flex flex-col" style={{ borderTop: '1px solid hsl(0 0% 100% / 0.07)' }}>
              {[
                'Instagram post and carousel visuals',
                'TikTok-ready vertical campaign assets',
                'Product-led social advertising',
                'Captions, hooks, and platform-native presentation',
                'Luxury brand visuals for paid and organic campaigns',
              ].map(item => (
                <li
                  key={item}
                  className="s5cv-item flex items-center gap-3 font-sans font-light"
                  style={{
                    opacity: 0, transform: 'translateY(10px)',
                    fontSize: 'clamp(0.84rem, 1.2vw, 0.9rem)',
                    color: '#F2F8FC',
                    borderBottom: '1px solid hsl(0 0% 100% / 0.07)',
                    padding: '0.82rem 0',
                    cursor: 'default',
                    transition: 'color 0.25s ease',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'hsl(0 0% 86%)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#F2F8FC' }}
                >
                  <span style={{ fontSize: '0.42rem', color: 'hsl(199 89% 60%)', flexShrink: 0 }}>◆</span>
                  {item}
                </li>
              ))}
            </ul>

          </div>

          {/* ── RIGHT: image showcase ── */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 order-2">

            {/* Image 1: Instagram Watch — gallery-mounted tall frame */}
            <div className="flex-1 relative w-full sm:w-auto" style={{ zIndex: 1 }}>
              <div
                className="s5cv-img-a"
                style={{
                  opacity: 0, transform: 'translateY(36px)',
                  borderRadius: '28px', overflow: 'hidden',
                  height: 'clamp(400px, 46vw, 580px)',
                  boxShadow: [
                    '0 36px 72px -16px hsl(0 0% 0% / 0.9)',
                    '0 0 0 1px hsl(0 0% 100% / 0.07)',
                    '0 0 56px -18px hsl(199 89% 60% / 0.22)',
                  ].join(', '),
                  background: '#080a0e',
                  transition: 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.65s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = [
                    '0 50px 96px -14px hsl(0 0% 0% / 0.94)',
                    '0 0 0 1px hsl(0 0% 100% / 0.1)',
                    '0 0 76px -14px hsl(199 89% 60% / 0.32)',
                  ].join(', ')
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = [
                    '0 36px 72px -16px hsl(0 0% 0% / 0.9)',
                    '0 0 0 1px hsl(0 0% 100% / 0.07)',
                    '0 0 56px -18px hsl(199 89% 60% / 0.22)',
                  ].join(', ')
                }}
              >
                <img
                  src="/brand_assets/Watch_L.png"
                  alt="Instagram luxury watch campaign visual"
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'contain', objectPosition: 'center',
                  }}
                />
                {/* Instagram platform tag */}
                <div style={{
                  position: 'absolute', bottom: '0.85rem', left: '0.85rem',
                  background: 'hsl(0 0% 4% / 0.9)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid hsl(199 89% 60% / 0.22)',
                  borderRadius: '999px',
                  padding: '0.28rem 0.8rem',
                  display: 'flex', alignItems: 'center', gap: '0.38rem',
                  zIndex: 2,
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'hsl(199 89% 60%)', flexShrink: 0 }}/>
                  <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'hsl(199 89% 68%)', fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}>
                    Instagram
                  </span>
                </div>
              </div>
            </div>

            {/* Image 2: TikTok Shampoo — natural tall vertical */}
            <div className="flex-1 relative" style={{ zIndex: 2 }}>
              <div
                className="s5cv-img-b"
                style={{
                  opacity: 0, transform: 'translateY(48px)',
                  borderRadius: '28px', overflow: 'hidden',
                  boxShadow: [
                    '0 48px 96px -16px hsl(0 0% 0% / 0.93)',
                    '0 0 0 1px hsl(0 0% 100% / 0.08)',
                    '0 0 72px -16px hsl(280 65% 65% / 0.24)',
                  ].join(', '),
                  background: '#080a0e',
                  transition: 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.65s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = [
                    '0 64px 120px -14px hsl(0 0% 0% / 0.97)',
                    '0 0 0 1px hsl(0 0% 100% / 0.12)',
                    '0 0 90px -12px hsl(280 65% 65% / 0.34)',
                  ].join(', ')
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = [
                    '0 48px 96px -16px hsl(0 0% 0% / 0.93)',
                    '0 0 0 1px hsl(0 0% 100% / 0.08)',
                    '0 0 72px -16px hsl(280 65% 65% / 0.24)',
                  ].join(', ')
                }}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src="/brand_assets/Shampoo.png"
                  alt="TikTok shampoo campaign visual"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
                {/* TikTok platform tag */}
                <div style={{
                  position: 'absolute', bottom: '0.85rem', right: '0.85rem',
                  background: 'hsl(0 0% 4% / 0.9)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid hsl(280 65% 65% / 0.22)',
                  borderRadius: '999px',
                  padding: '0.28rem 0.8rem',
                  display: 'flex', alignItems: 'center', gap: '0.38rem',
                  zIndex: 2,
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'hsl(280 65% 65%)', flexShrink: 0 }}/>
                  <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'hsl(280 65% 72%)', fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}>
                    TikTok
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom fade — blends into Section 6 */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 bottom-0" style={{
        height: '120px',
        background: 'linear-gradient(to top, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>
    </section>

    {/* ══ SECTION 6 — Food & Brand Content ══════════════════════════════════ */}
    <section
      ref={s6Ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 12vw, 10rem) 0' }}
    >
      {/* Top fade */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-0" style={{
        height: '120px',
        background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>

      {/* Dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.022) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}/>

      {/* Warm amber atmospheric tint */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 75% 55% at 50% 55%, hsl(32 90% 55% / 0.055) 0%, transparent 70%)',
          'radial-gradient(ellipse 50% 40% at 25% 60%, hsl(199 89% 60% / 0.04) 0%, transparent 65%)',
        ].join(', '),
        filter: 'blur(60px)',
      }}/>

      {/* ── Unified campaign showcase ── */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-10 lg:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">

          {/* ── Top: label + headline + paragraph ── */}
          <div className="mb-10 lg:mb-14">

            <p
              className="s6-badge font-sans font-light uppercase mb-4"
              style={{
                opacity: 0, transform: 'translateY(16px)',
                fontSize: '0.56rem', letterSpacing: '0.38em',
                color: 'hsl(199 89% 60% / 0.65)',
              }}
            >
              Campaign Formats
            </p>

            <h2
              className="s6-heading font-sans font-light"
              style={{
                opacity: 0, transform: 'translateY(24px)',
                fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.036em',
                color: 'hsl(0 0% 95%)',
                marginBottom: 'clamp(1rem, 2vw, 1.4rem)',
              }}
            >
              One campaign.{' '}
              <em style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic', fontWeight: 400,
                color: 'hsl(0 0% 58%)',
              }}>
                Built for every platform.
              </em>
            </h2>

            {/* Accent rule */}
            <div
              aria-hidden="true"
              style={{
                width: '2rem', height: '1px',
                background: 'hsl(199 89% 60% / 0.3)',
                marginBottom: 'clamp(1rem, 2vw, 1.4rem)',
              }}
            />

            <p
              className="s6-body font-sans font-light"
              style={{
                opacity: 0, transform: 'translateY(18px)',
                fontSize: 'clamp(0.85rem, 1.3vw, 0.97rem)',
                lineHeight: 1.9,
                color: '#F2F8FC',
                maxWidth: '42rem',
              }}
            >
              We deliver campaign content in both cinematic landscape and vertical social
              formats, so your brand looks polished across websites, Instagram, TikTok,
              YouTube Shorts, paid ads, and mobile-first feeds.
            </p>

          </div>

          {/* ── Bottom: two-video showcase ── */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

            {/* ── Landscape column (16:9) ── */}
            <div className="w-full flex flex-col gap-4" style={{ flex: '1.778 1.778 0' }}>

              {/* Caption */}
              <div
                className="s6-body"
                style={{ opacity: 0, transform: 'translateY(18px)' }}
              >
                <p
                  className="font-sans font-light uppercase mb-1"
                  style={{
                    fontSize: '0.54rem', letterSpacing: '0.32em',
                    color: 'hsl(32 90% 62%)',
                  }}
                >
                  Landscape Campaign
                </p>
                <p
                  className="font-sans font-light"
                  style={{
                    fontSize: 'clamp(0.76rem, 1.1vw, 0.84rem)',
                    lineHeight: 1.7, color: '#F2F8FC',
                  }}
                >
                  Built for websites, YouTube, presentations, and premium brand storytelling.
                </p>
              </div>

              {/* Video frame */}
              <div
                className="s6-video aspect-video rounded-[28px] overflow-hidden border border-white/10"
                style={{
                  opacity: 0, transform: 'translateY(40px)',
                  background: '#06080a',
                  boxShadow: [
                    '0 32px 72px -16px hsl(0 0% 0% / 0.88)',
                    '0 0 60px -20px hsl(32 90% 55% / 0.14)',
                  ].join(', '),
                }}
              >
                <video
                  src="/brand_assets/Food.mp4"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>

            </div>

            {/* ── Vertical column (9:16) ── */}
            <div
              className="w-[72%] mx-auto lg:w-auto lg:mx-0 flex flex-col gap-4"
              style={{ flex: '0.5625 0.5625 0' }}
            >

              {/* Caption */}
              <div
                className="s6-body"
                style={{ opacity: 0, transform: 'translateY(18px)' }}
              >
                <p
                  className="font-sans font-light uppercase mb-1"
                  style={{
                    fontSize: '0.54rem', letterSpacing: '0.32em',
                    color: 'hsl(199 89% 62%)',
                  }}
                >
                  Vertical Social Cut
                </p>
                <p
                  className="font-sans font-light"
                  style={{
                    fontSize: 'clamp(0.76rem, 1.1vw, 0.84rem)',
                    lineHeight: 1.7, color: '#F2F8FC',
                  }}
                >
                  Designed for TikTok, Instagram Reels, Shorts, paid ads, and mobile-first content.
                </p>
              </div>

              {/* Video frame */}
              <div
                className="s6-video aspect-[9/16] rounded-[28px] overflow-hidden border border-white/10"
                style={{
                  opacity: 0, transform: 'translateY(40px)',
                  background: '#06080a',
                  boxShadow: [
                    '0 32px 72px -16px hsl(0 0% 0% / 0.88)',
                    '0 0 60px -20px hsl(199 89% 55% / 0.12)',
                  ].join(', '),
                }}
              >
                <video
                  src="https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/Damaal.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 bottom-0" style={{
        height: '120px',
        background: 'linear-gradient(to top, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>
    </section>

    {/* ══ SECTION 7 — Why Brands Work With Weavy ════════════════════════════ */}
    <section
      ref={smFeatRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 12vw, 10rem) 0' }}
    >
      {/* Subtle grain */}
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.022, pointerEvents: 'none', zIndex: 0 }}>
        <filter id="smf-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#smf-grain)" style={{ fill: 'white' }}/>
      </svg>

      <div className="relative z-10 max-w-[68rem] mx-auto px-6 sm:px-10">

        {/* ── Centered header ── */}
        <div className="text-center mb-20 lg:mb-24">
          <p
            className="smf-eyebrow font-sans font-light uppercase mb-5"
            style={{ opacity: 0, fontSize: '0.6rem', letterSpacing: '0.38em', color: 'hsl(280 65% 72% / 0.65)' }}
          >
            The Weavy Difference
          </p>
          <h2
            className="smf-heading font-sans font-light mx-auto"
            style={{
              opacity: 0,
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
              lineHeight: 1.06,
              letterSpacing: '-0.04em',
              color: 'hsl(0 0% 96%)',
              maxWidth: '38rem',
            }}
          >
            Why Brands{' '}
            <em style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'hsl(0 0% 64%)',
            }}>
              Work With Weavy
            </em>
          </h2>
          {/* Rule */}
          <div
            className="smf-rule mx-auto mt-6"
            aria-hidden="true"
            style={{
              opacity: 0,
              width: '2.4rem',
              height: '1px',
              background: 'hsl(280 65% 72% / 0.35)',
            }}
          />
        </div>

        {/* ── 2×2 grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-16 lg:gap-x-24 lg:gap-y-20">

          {/* Block 1 — Conversion-Focused Strategy — soft orange */}
          <div className="smf-block">
            {/* Icon */}
            <div className="smf-icon" style={{ marginBottom: '1.4rem', display: 'inline-block' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="12" stroke="hsl(24 95% 62%)" strokeWidth="1.4" opacity="0.25"/>
                <path d="M10 22 L16 10 L22 22" stroke="hsl(24 95% 62%)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.5 18 h7" stroke="hsl(24 95% 62%)" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
                <circle cx="16" cy="10" r="1.8" fill="hsl(24 95% 62%)"/>
              </svg>
            </div>
            {/* Heading */}
            <h3
              className="smf-block-heading font-sans font-semibold mb-4"
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.12rem)',
                letterSpacing: '-0.022em',
                lineHeight: 1.25,
                color: 'hsl(24 95% 68%)',
              }}
            >
              Conversion-Focused Strategy
            </h3>
            {/* Body */}
            <p
              className="smf-block-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.85rem, 1.2vw, 0.94rem)',
                lineHeight: 1.9,
                color: '#F2F8FC',
                maxWidth: '28rem',
              }}
            >
              Every project is designed around clarity, positioning, and measurable growth. We build digital systems that guide attention, strengthen trust, and turn visitors into real customers.
            </p>
          </div>

          {/* Block 2 — Automation That Scales — electric cyan */}
          <div className="smf-block">
            {/* Icon */}
            <div className="smf-icon" style={{ marginBottom: '1.4rem', display: 'inline-block' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="5" stroke="hsl(195 100% 55%)" strokeWidth="1.6"/>
                <path d="M16 4 v4 M16 24 v4 M4 16 h4 M24 16 h4" stroke="hsl(195 100% 55%)" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
                <path d="M7.5 7.5 l2.8 2.8 M21.7 21.7 l2.8 2.8 M21.7 10.3 l-2.8 2.8 M10.3 21.7 l-2.8 2.8" stroke="hsl(195 100% 55%)" strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
                <circle cx="16" cy="16" r="2.2" fill="hsl(195 100% 55%)" opacity="0.9"/>
              </svg>
            </div>
            {/* Heading */}
            <h3
              className="smf-block-heading font-sans font-semibold mb-4"
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.12rem)',
                letterSpacing: '-0.022em',
                lineHeight: 1.25,
                color: 'hsl(195 100% 62%)',
              }}
            >
              Automation That Scales
            </h3>
            {/* Body */}
            <p
              className="smf-block-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.85rem, 1.2vw, 0.94rem)',
                lineHeight: 1.9,
                color: '#F2F8FC',
                maxWidth: '28rem',
              }}
            >
              From AI chatbots to automated workflows, we create systems that continue working behind the scenes — helping brands respond faster, operate smoother, and scale efficiently.
            </p>
          </div>

          {/* Block 3 — Premium Brand Presence — soft magenta */}
          <div className="smf-block">
            {/* Icon */}
            <div className="smf-icon" style={{ marginBottom: '1.4rem', display: 'inline-block' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <polygon points="16,5 19.5,13 28,13.5 22,19.5 24,28 16,23.5 8,28 10,19.5 4,13.5 12.5,13" stroke="hsl(320 80% 65%)" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2.4" fill="hsl(320 80% 65%)" opacity="0.8"/>
              </svg>
            </div>
            {/* Heading */}
            <h3
              className="smf-block-heading font-sans font-semibold mb-4"
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.12rem)',
                letterSpacing: '-0.022em',
                lineHeight: 1.25,
                color: 'hsl(320 80% 68%)',
              }}
            >
              Premium Brand Presence
            </h3>
            {/* Body */}
            <p
              className="smf-block-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.85rem, 1.2vw, 0.94rem)',
                lineHeight: 1.9,
                color: '#F2F8FC',
                maxWidth: '28rem',
              }}
            >
              We combine clean design, cinematic visuals, and modern digital experiences to help brands look more established, more trusted, and more valuable online.
            </p>
          </div>

          {/* Block 4 — Built for Long-Term Growth — bright blue */}
          <div className="smf-block">
            {/* Icon */}
            <div className="smf-icon" style={{ marginBottom: '1.4rem', display: 'inline-block' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <polyline points="4,24 10,16 16,19 24,9 28,12" stroke="hsl(215 90% 62%)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="21,9 28,9 28,16" stroke="hsl(215 90% 62%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="4" y1="27" x2="28" y2="27" stroke="hsl(215 90% 62%)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28"/>
              </svg>
            </div>
            {/* Heading */}
            <h3
              className="smf-block-heading font-sans font-semibold mb-4"
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.12rem)',
                letterSpacing: '-0.022em',
                lineHeight: 1.25,
                color: 'hsl(215 90% 68%)',
              }}
            >
              Built for Long-Term Growth
            </h3>
            {/* Body */}
            <p
              className="smf-block-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.85rem, 1.2vw, 0.94rem)',
                lineHeight: 1.9,
                color: '#F2F8FC',
                maxWidth: '28rem',
              }}
            >
              Every website, campaign, and automation is created with performance and longevity in mind — designed to evolve as your audience and business continue to grow.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 bottom-0" style={{
        height: '100px',
        background: 'linear-gradient(to top, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>
    </section>

    {/* ══ SECTION 8 — Contact / Footer ════════════════════════════════════════ */}
    <S7ContactFooter />
    </>
  )
}

// ─── Section 7 — Contact / Footer ─────────────────────────────────────────────

const HLS_SRC_CONTACT = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

function ContactVideo() {
  const { videoRef, containerRef } = useHlsVideo(HLS_SRC_CONTACT)
  return (
    <div ref={containerRef} className="absolute inset-0">
      <video
        ref={videoRef}
        muted loop playsInline
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover"
        style={{ transform: 'translate(-50%, -50%) scaleY(-1)', opacity: 0.88, filter: 'brightness(1.06) contrast(1.38) saturate(1.15)' }}
      />
    </div>
  )
}

function S7ContactFooter() {
  const marqueeRef  = useRef<HTMLDivElement>(null)
  const [ctaHov, setCtaHov] = useState(false)

  // GSAP marquee
  useEffect(() => {
    const el = marqueeRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      })
    })
    return () => ctx.revert()
  }, [])

  const MARQUEE_TEXT = 'BUILDING THE FUTURE • '
  const marqueeItems = Array.from({ length: 20 }, (_, i) => MARQUEE_TEXT + (i % 2 === 0 ? '' : ''))

  return (
    <section className="bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden relative">

      {/* Top fade — blends seamlessly with Section 6 */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-0" style={{
        height: '120px',
        background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)',
        zIndex: 4,
      }}/>

      {/* ── Background video ── */}
      <div className="absolute inset-0 overflow-hidden">
        <ContactVideo />
        {/* Heavy overlay */}
        <div className="absolute inset-0 bg-black/28 lg:bg-black/52" />
        {/* Edge vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, hsl(0 0% 0% / 0.55) 100%)',
        }}/>
      </div>

      {/* ── GSAP Marquee ── */}
      <div className="relative z-10 overflow-hidden mb-16 md:mb-24 border-y border-white/[0.06] py-5">
        <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
          {marqueeItems.map((text, i) => (
            <span
              key={i}
              className="font-sans font-light shrink-0 px-6"
              style={{
                fontSize: 'clamp(0.7rem, 1.4vw, 0.88rem)',
                letterSpacing: '0.28em',
                color: i % 3 === 0 ? 'hsl(199 89% 68%)' : 'hsl(0 0% 32%)',
                textTransform: 'uppercase',
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main CTA area ── */}
      <div className="relative z-10 max-w-[56rem] mx-auto px-6 sm:px-10 flex flex-col items-center text-center mb-20 md:mb-28">

        {/* Eyebrow */}
        <p className="font-sans font-light uppercase mb-6" style={{
          fontSize: '0.65rem', letterSpacing: '0.3em', color: 'hsl(0 0% 36%)',
        }}>
          Let's build something
        </p>

        {/* Headline */}
        <h2 className="font-sans font-light text-text mb-10" style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
          lineHeight: 1.06,
          letterSpacing: '-0.038em',
          maxWidth: '22ch',
        }}>
          Ready to grow your{' '}
          <em style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 400,
            background: 'linear-gradient(108deg, hsl(199 89% 74%) 0%, hsl(240 60% 74%) 55%, hsl(280 65% 74%) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            brand?
          </em>
        </h2>

        {/* Email CTA button */}
        <a
          href="mailto:hello@weavyautomation.com"
          onMouseEnter={() => setCtaHov(true)}
          onMouseLeave={() => setCtaHov(false)}
          style={{
            display: 'inline-block',
            padding: '2px',
            borderRadius: '999px',
            background: ctaHov
              ? 'linear-gradient(135deg, hsl(199 89% 60%), hsl(240 70% 68%), hsl(280 65% 65%))'
              : 'linear-gradient(135deg, hsl(0 0% 18%), hsl(0 0% 12%))',
            boxShadow: ctaHov
              ? '0 0 40px -6px hsl(199 89% 60% / 0.4), 0 0 80px -12px hsl(280 65% 65% / 0.2)'
              : '0 4px 24px -6px hsl(0 0% 0% / 0.6)',
            transition: 'background 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          <span
            className="flex items-center gap-3 font-sans font-light"
            style={{
              padding: '1rem 2.8rem',
              borderRadius: '999px',
              background: ctaHov ? 'hsl(220 40% 6%)' : 'hsl(0 0% 5%)',
              fontSize: 'clamp(0.88rem, 1.5vw, 1.05rem)',
              letterSpacing: '0.01em',
              color: ctaHov ? 'hsl(199 89% 80%)' : 'hsl(0 0% 78%)',
              transition: 'background 0.4s ease, color 0.4s ease',
            }}
          >
            hello@weavyautomation.com
            <span aria-hidden="true" style={{
              fontSize: '0.9em',
              opacity: ctaHov ? 1 : 0.35,
              transition: 'opacity 0.3s ease',
            }}>→</span>
          </span>
        </a>
      </div>

      {/* ── Footer bar ── */}
      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">
        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, hsl(0 0% 100% / 0.08), transparent)', marginBottom: '1.5rem' }} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Left: availability */}
          <div className="flex items-center gap-2.5">
            {/* Pulsing green dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'hsl(142 71% 45%)' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'hsl(142 71% 50%)' }} />
            </span>
            <span className="font-sans font-light" style={{ fontSize: '0.75rem', letterSpacing: '0.04em', color: 'hsl(0 0% 44%)' }}>
              Available for projects
            </span>
          </div>

          {/* Center: copyright */}
          <p className="font-sans font-light" style={{ fontSize: '0.7rem', letterSpacing: '0.06em', color: 'hsl(0 0% 28%)' }}>
            © {new Date().getFullYear()} Weavy. All rights reserved.
          </p>

          {/* Right: social links */}
          <div className="flex items-center gap-5">
            {[
              {
                label: 'Twitter',
                href: 'https://twitter.com',
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                ),
              },
              {
                label: 'LinkedIn',
                href: 'https://linkedin.com',
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                ),
              },
              {
                label: 'Dribbble',
                href: 'https://dribbble.com',
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.048 6.39a10.09 10.09 0 0 0 6.31 2.166c1.42 0 2.77-.29 4-.806zm-9.98-2.71c.25-.466 3.28-5.42 8.57-7.17.022-.01.043-.016.064-.023-.22-.499-.45-.99-.692-1.475-5.507 1.648-10.84 1.578-11.346 1.57a10.11 10.11 0 0 0 3.404 7.098zm-3.688-8.89c.514.01 5.068.052 10.192-1.318C11.02 6.49 9.69 4.67 8.234 3.106A10.08 10.08 0 0 0 2.337 9.85zm7.646-7.36c1.482 1.566 2.83 3.43 3.857 5.51 3.674-1.376 5.228-3.465 5.412-3.715a10.13 10.13 0 0 0-9.27-1.794zm9.981 2.958c-.225.28-1.938 2.48-5.742 4.026.24.49.47.99.68 1.495.08.197.157.398.232.6 3.408-.43 6.792.258 7.134.33-.028-2.39-.85-4.595-2.304-6.45z"/>
                  </svg>
                ),
              },
              {
                label: 'GitHub',
                href: 'https://github.com',
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                ),
              },
            ].map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group"
                style={{
                  color: 'hsl(0 0% 30%)',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'hsl(0 0% 72%)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'hsl(0 0% 30%)'}
              >
                {icon}
              </a>
            ))}
          </div>

        </div>
      </div>

    </section>
  )
}


// ─── Chatbot section visual ───────────────────────────────────────────────────

const CHATBOT_FEATURES = [
  { Icon: Settings2,    title: 'Custom Logic',        desc: 'Built around your exact workflows, not off-the-shelf scripts.' },
  { Icon: Plug,         title: 'Easy Integration',    desc: 'Live on your website or platform within hours.' },
  { Icon: Clock,        title: '24 / 7 Support',      desc: 'Never misses a query — handles volume around the clock.' },
  { Icon: UserCheck,    title: 'Lead Qualification',  desc: 'Captures and routes leads before they reach your team.' },
  { Icon: CalendarDays, title: 'Bookings & Orders',   desc: 'Manages appointments, queries, and orders autonomously.' },
  { Icon: Zap,          title: 'Trained on Your Data',desc: 'Fine-tuned on your knowledge base and improves over time.' },
]

function ChatbotMockup() {
  const [showUser,   setShowUser]   = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [showReply,  setShowReply]  = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowUser(true); setShowTyping(true); setShowReply(true)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    const cycle = () => {
      setShowUser(false); setShowTyping(false); setShowReply(false)
      timers.push(setTimeout(() => setShowUser(true),   1200))
      timers.push(setTimeout(() => setShowTyping(true), 2500))
      timers.push(setTimeout(() => setShowReply(true),  4100))
      timers.push(setTimeout(cycle, 8800))
    }

    const init = setTimeout(cycle, 400)
    timers.push(init)
    return () => timers.forEach(clearTimeout)
  }, [])

  const msgAnim = (show: boolean): React.CSSProperties => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(7px)',
    transition: 'opacity 0.48s cubic-bezier(0.25, 1, 0.5, 1), transform 0.48s cubic-bezier(0.25, 1, 0.5, 1)',
    pointerEvents: 'none',
  })

  return (
    <div className="relative select-none" style={{ minHeight: '580px' }}>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 75% 65% at 50% 48%, hsl(195 90% 55% / 0.1) 0%, transparent 68%)',
        filter: 'blur(28px)',
      }}/>

      {/* ── Main chat card — centering wrapper (no animation here to avoid transform conflict) ── */}
      <div style={{
        position: 'absolute', left: '50%', top: '16px',
        transform: 'translateX(-50%)',
        width: '100%', maxWidth: '348px',
        filter: 'drop-shadow(0 30px 50px hsl(195 90% 50% / 0.18))',
      }}>
        {/* Float wrapper — owns the chatbot-float animation */}
        <div style={{ animation: 'chatbot-float 4.5s ease-in-out infinite' }}>
          {/* Gradient border shell */}
          <div style={{
            borderRadius: '20px', padding: '1px',
            background: 'linear-gradient(148deg, hsl(195 85% 55% / 0.65), hsl(215 75% 52% / 0.18) 48%, hsl(195 85% 55% / 0.52))',
            boxShadow: '0 0 40px -10px hsl(195 90% 55% / 0.26), 0 28px 56px -18px hsl(0 0% 0% / 0.65)',
          }}>
            <div style={{
              borderRadius: '19px', overflow: 'hidden',
              background: 'linear-gradient(155deg, hsl(215 30% 9%) 0%, hsl(215 20% 6%) 100%)',
            }}>

              {/* Header */}
              <div style={{
                padding: '13px 17px', background: 'hsl(215 28% 8%)',
                borderBottom: '1px solid hsl(0 0% 100% / 0.05)',
                display: 'flex', alignItems: 'center', gap: '11px',
              }}>
                <div style={{
                  width: '33px', height: '33px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, hsl(195 90% 55%), hsl(215 80% 46%))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 14px hsl(195 90% 55% / 0.55)',
                }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <rect x="3" y="5" width="14" height="11" rx="3.5" stroke="white" strokeWidth="1.4"/>
                    <circle cx="7.5" cy="10.5" r="1.3" fill="white"/>
                    <circle cx="12.5" cy="10.5" r="1.3" fill="white"/>
                    <line x1="10" y1="5" x2="10" y2="2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                    <circle cx="10" cy="2" r="1" fill="white"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.84rem', color: 'hsl(0 0% 92%)', fontFamily: 'Inter,sans-serif', fontWeight: 300, letterSpacing: '-0.01em' }}>AI Assistant</div>
                  <div style={{ fontSize: '0.67rem', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '5px', color: 'hsl(150 65% 52%)' }}>
                    {/* Online dot — subtle pulse to simulate live connection */}
                    <span aria-hidden="true" style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: 'hsl(150 65% 52%)', display: 'inline-block',
                      boxShadow: '0 0 6px hsl(150 65% 52%)',
                      animation: 'chatbot-status-pulse 2.6s ease-in-out infinite',
                    }}/>
                    Online · Trained on your data
                  </div>
                </div>
                <div aria-hidden="true" style={{ display: 'flex', gap: '4px' }}>
                  {[0,1,2].map(j => <span key={j} style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'hsl(0 0% 28%)', display: 'block' }}/>)}
                </div>
              </div>

              {/* Messages — space is always reserved; opacity drives visibility */}
              <div style={{ padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: '13px' }}>

                {/* Bot greeting — always visible */}
                <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end' }}>
                  <div aria-hidden="true" style={{ width: '25px', height: '25px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(195 90% 55%), hsl(215 80% 46%))', flexShrink: 0 }}/>
                  <div style={{ background: 'hsl(215 22% 13%)', border: '1px solid hsl(0 0% 100% / 0.06)', borderRadius: '5px 14px 14px 14px', padding: '9px 13px', maxWidth: '80%' }}>
                    <p style={{ fontSize: '0.77rem', color: 'hsl(0 0% 80%)', fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
                      Hi! I'm your AI assistant, trained specifically for your business. How can I help?
                    </p>
                  </div>
                </div>

                {/* User message — fades in at phase 1 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', ...msgAnim(showUser) }}>
                  <div style={{ background: 'linear-gradient(135deg, hsl(205 78% 40%), hsl(215 72% 33%))', borderRadius: '14px 5px 14px 14px', padding: '9px 13px', maxWidth: '80%' }}>
                    <p style={{ fontSize: '0.77rem', color: 'hsl(0 0% 94%)', fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
                      Can I book a consultation for Thursday?
                    </p>
                  </div>
                </div>

                {/* Bot reply — fades in at phase 3 (above typing in DOM = below typing in sequence) */}
                <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end', ...msgAnim(showReply) }}>
                  <div aria-hidden="true" style={{ width: '25px', height: '25px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(195 90% 55%), hsl(215 80% 46%))', flexShrink: 0 }}/>
                  <div style={{ background: 'hsl(215 22% 13%)', border: '1px solid hsl(0 0% 100% / 0.06)', borderRadius: '5px 14px 14px 14px', padding: '9px 13px', maxWidth: '80%' }}>
                    <p style={{ fontSize: '0.77rem', color: 'hsl(0 0% 80%)', fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
                      Thursday works! I have 2 pm and 4 pm available — which suits you?
                    </p>
                  </div>
                </div>

                {/* Typing indicator — appears at phase 2, stays through phase 3+ */}
                <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end', ...msgAnim(showTyping) }}>
                  <div aria-hidden="true" style={{ width: '25px', height: '25px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(195 90% 55%), hsl(215 80% 46%))', flexShrink: 0 }}/>
                  <div style={{ background: 'hsl(215 22% 13%)', border: '1px solid hsl(0 0% 100% / 0.06)', borderRadius: '5px 14px 14px 14px', padding: '11px 15px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    {[0,1,2].map(j => (
                      <span key={j} aria-hidden="true" style={{
                        width: '5px', height: '5px', borderRadius: '50%', display: 'block',
                        background: 'hsl(195 85% 60%)',
                        animation: `typing-dot 1.4s ease-in-out ${j * 0.18}s infinite`,
                      }}/>
                    ))}
                  </div>
                </div>

              </div>

              {/* Input bar with blinking cursor */}
              <div style={{
                padding: '10px 14px 13px', background: 'hsl(215 25% 7%)',
                borderTop: '1px solid hsl(0 0% 100% / 0.04)',
                display: 'flex', gap: '9px', alignItems: 'center',
              }}>
                <div style={{
                  flex: 1, padding: '8px 13px', borderRadius: '18px',
                  background: 'hsl(215 18% 12%)', border: '1px solid hsl(0 0% 100% / 0.07)',
                  fontSize: '0.75rem', color: 'hsl(0 0% 30%)', fontFamily: 'Inter,sans-serif',
                  display: 'flex', alignItems: 'center',
                }}>
                  Ask me anything…
                  <span aria-hidden="true" style={{
                    color: 'hsl(195 85% 60%)', marginLeft: '1px',
                    animation: 'cursor-blink 1.1s ease-in-out infinite',
                    lineHeight: 1, fontSize: '0.78rem',
                  }}>|</span>
                </div>
                <div aria-hidden="true" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, hsl(195 90% 55%), hsl(215 80% 46%))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px hsl(195 90% 55% / 0.4)' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Floating stat cards — float + occasional glow pulse ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '32px', right: '0',
        background: 'hsl(215 25% 9% / 0.92)', backdropFilter: 'blur(14px)',
        border: '1px solid hsl(150 60% 50% / 0.28)', borderRadius: '12px', padding: '10px 15px',
        animation: 'chatbot-float 5.5s ease-in-out 0.8s infinite, chatbot-card-glow-green 7s ease-in-out 1.5s infinite',
      }}>
        <div style={{ fontSize: '0.58rem', color: 'hsl(0 0% 40%)', fontFamily: 'Inter,sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Response</div>
        <div style={{ fontSize: '1.05rem', color: 'hsl(150 68% 54%)', fontFamily: 'Inter,sans-serif', fontWeight: 300, letterSpacing: '-0.02em' }}>{'< 0.8s'}</div>
      </div>

      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '64px', left: '0',
        background: 'hsl(215 25% 9% / 0.92)', backdropFilter: 'blur(14px)',
        border: '1px solid hsl(205 85% 62% / 0.28)', borderRadius: '12px', padding: '10px 15px',
        animation: 'chatbot-float 6s ease-in-out 0.3s infinite, chatbot-card-glow-blue 7s ease-in-out 4s infinite',
      }}>
        <div style={{ fontSize: '0.58rem', color: 'hsl(0 0% 40%)', fontFamily: 'Inter,sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Satisfaction</div>
        <div style={{ fontSize: '1.05rem', color: 'hsl(205 85% 62%)', fontFamily: 'Inter,sans-serif', fontWeight: 300, letterSpacing: '-0.02em' }}>97.4%</div>
      </div>

    </div>
  )
}

// ─── Custom Chatbots — Hero ───────────────────────────────────────────────────

function ChatbotHero() {
  return (
    <section
      id="chatbot-hero"
      className="relative w-full"
      style={{
        background: '#010709',
        backgroundImage: 'radial-gradient(ellipse 65% 70% at 72% 50%, hsl(192 80% 14% / 0.28) 0%, transparent 70%)',
        padding: 'clamp(5rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem) clamp(3rem, 5vw, 4.5rem)',
      }}
    >
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: '1800px',
          height: 'clamp(640px, 44vw, 820px)',
          borderRadius: '28px',
          boxShadow: '0 20px 80px rgba(0,0,0,0.45)',
        }}
      >
        <video
          src="/brand_assets/chatbot-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 0,
          }}
        />

        {/* Gradient overlay for text legibility */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, hsl(0 0% 0% / 0.72) 0%, hsl(0 0% 0% / 0.18) 50%, transparent 100%)',
            borderRadius: '28px',
          }}
        />

        {/* Text overlay — bottom left */}
        <div
          className="absolute bottom-0 left-0 px-10 pb-10 sm:px-14 sm:pb-12"
          style={{ zIndex: 10 }}
        >
          {/* Eyebrow */}
          <p
            className="font-sans font-light uppercase mb-3"
            style={{ fontSize: '0.63rem', letterSpacing: '0.32em', color: 'hsl(195 80% 68%)' }}
          >
            AI-Powered
          </p>

          {/* Heading */}
          <h1
            className="font-sans font-light text-white"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.2rem)', lineHeight: 1.08, letterSpacing: '-0.04em' }}
          >
            <span style={{ display: 'block' }}>Custom</span>
            <em style={{ display: 'block', fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(195 80% 72%)' }}>
              Chatbot
            </em>
          </h1>
        </div>
      </div>
    </section>
  )
}

// ─── Graphic Design / Animation — Cinematic Hero ─────────────────────────────

function GraphicDesignHero() {
  // Use a medium pair: start collapsed by default so desktop loads normally,
  // but allow expanding to a large (but not extreme) size for review.
  const [expanded, setExpanded] = useState(false)

  const desktopCollapsed = 'clamp(440px, 62vh, 820px)'
  const desktopExpanded = 'min(400vh, 3200px)'
  const desktopHeight = expanded ? desktopExpanded : desktopCollapsed

  return (
    <section
      id="graphic-design-hero"
      className="relative w-full"
      style={{
        background: '#010709',
        backgroundImage: 'radial-gradient(ellipse 65% 70% at 72% 50%, hsl(192 80% 14% / 0.28) 0%, transparent 70%)',
        paddingTop: 'clamp(3rem, 6vw, 5rem)',
      }}
    >
      {/* Desktop: collapsible hero image */}
      <div className="hidden lg:block">
        <div style={{ position: 'relative' }}>
          <img
            loading="lazy"
            decoding="async"
            src="/brand_assets/Claude_image.png"
            alt="Graphic design and animation showcase"
            style={{
              display: 'block',
              width: '100%',
              height: desktopHeight,
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />

          {/* Collapse / Expand control (desktop only) */}
          <button
            aria-expanded={expanded}
            onClick={() => setExpanded(v => !v)}
            style={{
              position: 'absolute',
              right: 20,
              top: 20,
              zIndex: 30,
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '0.55rem 0.85rem',
              borderRadius: 999,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            {expanded ? '' : ''}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet: improved fitted image (only below lg) */}
      <div className="block lg:hidden w-full overflow-hidden bg-[#010709]">
        <div className="relative mx-auto w-full max-w-[720px] overflow-hidden sm:rounded-[24px] aspect-[3/2]">
          <img
            loading="lazy"
            decoding="async"
            src="/brand_assets/Claude_image.png"
            alt="Graphic design and animation showcase"
            className="w-full h-full object-contain object-center"
            style={{ display: 'block' }}
          />
        </div>
      </div>

      {/* Bottom fade — blends hero image edge into Editorial */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '140px',
        background: 'linear-gradient(to bottom, rgba(1,7,9,0), #010709)',
        pointerEvents: 'none',
        zIndex: 5,
      }}/>
    </section>
  )
}

// ─── Graphic Design / Animation — gallery data ───────────────────────────────

const GD_GALLERY_ITEMS: GalleryItem[] = [
  {
    common: 'Brand Identity',
    binomial: 'Identity Systems',
    photo: { url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&auto=format&fit=crop&q=80', text: 'Brand identity design', pos: 'center', by: 'Unsplash' },
  },
  {
    common: 'Motion Graphics',
    binomial: 'Commercial Animation',
    photo: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80', text: 'Motion graphics', pos: 'center', by: 'Unsplash' },
  },
  {
    common: 'Campaign Visuals',
    binomial: 'Digital Advertising',
    photo: { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80', text: 'Campaign visual design', pos: 'center', by: 'Unsplash' },
  },
  {
    common: 'Editorial Design',
    binomial: 'Typography & Layout',
    photo: { url: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?w=900&auto=format&fit=crop&q=80', text: 'Editorial typography', pos: 'center', by: 'Unsplash' },
  },
  {
    common: 'Social Creatives',
    binomial: 'Platform Content',
    photo: { url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&auto=format&fit=crop&q=80', text: 'Social media creatives', pos: 'center', by: 'Unsplash' },
  },
  {
    common: 'Product Visuals',
    binomial: 'Commercial Photography',
    photo: { url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=900&auto=format&fit=crop&q=80', text: 'Product visual design', pos: 'center', by: 'Unsplash' },
  },
  {
    common: 'Packaging Design',
    binomial: 'Brand Expression',
    photo: { url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=900&auto=format&fit=crop&q=80', text: 'Packaging design', pos: 'center', by: 'Unsplash' },
  },
  {
    common: 'Digital Illustration',
    binomial: 'Concept Art',
    photo: { url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=900&auto=format&fit=crop&q=80', text: 'Digital illustration', pos: 'center', by: 'Unsplash' },
  },
  {
    common: 'UI Design',
    binomial: 'Digital Experience',
    photo: { url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=900&auto=format&fit=crop&q=80', text: 'UI design work', pos: 'center', by: 'Unsplash' },
  },
  {
    common: 'Cinematic Grade',
    binomial: 'Colour & Tone',
    photo: { url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=900&auto=format&fit=crop&q=80', text: 'Cinematic colour grading', pos: 'center', by: 'Unsplash' },
  },
]

// ─── Graphic Design / Animation — Editorial Content + Gallery ────────────────

function GraphicDesignEditorial() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reveals = el.querySelectorAll('.gde-r')
    gsap.set(reveals, { opacity: 0, y: 40 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.to(reveals, { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out', stagger: 0.1 })
      obs.disconnect()
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709' }}
    >
      {/* ── Grain ── */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.026, zIndex: 1 }}>
        <filter id="gde-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#gde-gr)" fill="white"/>
      </svg>

      {/* ── Amber ambient bloom ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 1,
        background: [
          'radial-gradient(ellipse 70% 55% at 50% 28%, hsl(38 90% 58% / 0.05) 0%, transparent 70%)',
          'radial-gradient(ellipse 35% 28% at 82% 72%, hsl(28 80% 50% / 0.025) 0%, transparent 60%)',
        ].join(', '),
      }}/>

      {/* ── Vignette ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 1,
        background: 'radial-gradient(ellipse 100% 90% at 50% 50%, transparent 44%, hsl(0 0% 0% / 0.3) 100%)',
      }}/>

      {/* ── BeamsBackgroundLayer — sits right behind gallery cards ── */}
      <div className="absolute inset-0" style={{ zIndex: 2 }} aria-hidden="true">
        <BeamsBackgroundLayer intensity="subtle" />
      </div>

      {/* ════ EDITORIAL HEADER ════ */}
      <div
        className="relative z-10 max-w-[88rem] mx-auto px-6 sm:px-12"
        style={{ paddingTop: 'clamp(5rem, 8vw, 8rem)' }}
      >
        {/* Metadata bar */}
        <div
          className="gde-r flex items-center justify-between pb-5 mb-12"
          style={{ borderBottom: '1px solid hsl(0 0% 100% / 0.06)' }}
        >
          <div className="flex items-center gap-4">
            <div style={{ width: 24, height: 1, background: 'hsl(38 90% 58% / 0.55)' }}/>
            <span style={{
              fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'hsl(38 90% 65%)', fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500,
            }}>
              02 — Premium Visual Execution
            </span>
          </div>
          <span style={{
            fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'hsl(0 0% 28%)', fontFamily: 'var(--font-sans, sans-serif)',
          }}>
            Graphic Design / Animation
          </span>
        </div>

        {/* Heading left / Body right */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 lg:gap-20">

          <div className="gde-r" style={{ letterSpacing: '-0.046em', lineHeight: 0.87, flexShrink: 0 }}>
            <p style={{
              fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 200,
              fontSize: 'clamp(3.8rem, 8.5vw, 7.5rem)',
              color: 'hsl(0 0% 90%)', display: 'block', marginBottom: '0.04em',
            }}>Motion that</p>
            <p style={{
              fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400,
              fontSize: 'clamp(3.8rem, 8.5vw, 7.5rem)',
              color: 'hsl(0 0% 44%)', display: 'block',
            }}>commands.</p>
          </div>

          <div className="gde-r" style={{ maxWidth: '26rem', paddingBottom: '0.5rem' }}>
            <p className="font-sans font-light mb-7" style={{
              fontSize: 'clamp(0.84rem, 1.3vw, 0.98rem)', lineHeight: 1.9, color: '#F2F8FC',
            }}>
              Every brand deserves a visual language that is impossible to ignore. We design and
              animate premium assets — from complete identity systems to campaign-ready motion
              graphics — built to perform across every screen and platform.
            </p>
            <p className="font-sans font-light" style={{
              fontSize: 'clamp(0.84rem, 1.3vw, 0.98rem)', lineHeight: 1.9, color: '#F2F8FC',
            }}>
              From concept to delivery, our creative process is shaped around clarity and impact.
              Cinematic animations, social-first creatives, and high-production brand visuals
              that leave a lasting impression.
            </p>
          </div>

        </div>
      </div>

      {/* ════ GALLERY — directly below "a lasting impression." ════ */}
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ height: '90vh', zIndex: 10 }}
      >
        <CircularGallery
          items={GD_GALLERY_ITEMS}
          radius={560}
          autoRotateSpeed={0.018}
          className="w-full h-full"
        />
      </div>

      {/* Bottom fade — above gallery (z-index 20) to mask the gallery's lower edge */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '220px',
        background: 'linear-gradient(to bottom, rgba(1,7,9,0), #010709)',
        pointerEvents: 'none',
        zIndex: 20,
      }}/>
    </section>
  )
}

// ─── Graphic Design — Services Grid ──────────────────────────────────────────

const GDS_ITEMS = [
  'Animated Promo Videos',
  'Animated Explainer Videos',
  'Animated Social Content',
  'Social Media Design',
  'Social Media Content',
  'Flyer and Leaflet Design',
  'Poster and Large Format Design',
  'Photo Retouching',
  'Logo Concept / Design',
  'Advertising Material Design',
  'Company Branding',
  'Presentation Slides',
]

function GdsCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" fill="hsl(38 90% 58% / 0.10)" stroke="hsl(38 90% 60% / 0.20)" strokeWidth="0.75"/>
      <path d="M5 8L7 10L11 6" stroke="hsl(38 85% 68%)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function GraphicDesignServices() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const header = el.querySelectorAll<HTMLElement>('.gdsvs-h')
    const cards  = el.querySelectorAll<HTMLElement>('.gdsvs-c')
    gsap.set(header, { opacity: 0, y: 28 })
    gsap.set(cards,  { opacity: 0, y: 20, scale: 0.96 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.to(header, { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.1 })
      gsap.to(cards,  {
        opacity: 1, y: 0, scale: 1,
        duration: 0.7, ease: 'back.out(1.4)',
        stagger: { amount: 0.6, from: 'start' },
        delay: 0.35,
      })
      obs.disconnect()
    }, { threshold: 0.06 })
    obs.observe(el)

    const cardEls = Array.from(cards)
    cardEls.forEach(c => {
      const shimmer = c.querySelector<HTMLElement>('.gdsvs-shimmer')

      const onEnter = () => {
        gsap.to(c, {
          y: -5, scale: 1.03,
          duration: 0.3, ease: 'power2.out',
        })
        // border glow — set via boxShadow
        gsap.to(c, {
          boxShadow: [
            'inset 0 1px 0 hsl(38 90% 65% / 0.18)',
            'inset 0 -1px 0 hsl(0 0% 0% / 0.25)',
            '0 0 0 1.5px hsl(38 85% 58% / 0.5)',
            '0 6px 24px hsl(38 85% 50% / 0.18)',
            '0 12px 36px hsl(0 0% 0% / 0.5)',
          ].join(', '),
          duration: 0.3, ease: 'power2.out',
        })
        // shimmer sweep
        if (shimmer) {
          gsap.fromTo(shimmer,
            { x: '-120%', opacity: 0.7 },
            { x: '220%',  opacity: 0, duration: 0.65, ease: 'power1.inOut' }
          )
        }
      }

      const onLeave = () => {
        gsap.to(c, {
          y: 0, scale: 1,
          duration: 0.4, ease: 'power2.inOut',
        })
        gsap.to(c, {
          boxShadow: [
            'inset 0 1px 0 hsl(0 0% 100% / 0.05)',
            'inset 0 -1px 0 hsl(0 0% 0% / 0.2)',
            '0 0 0 1.5px hsl(0 0% 100% / 0.10)',
            '0 2px 10px hsl(0 0% 0% / 0.4)',
          ].join(', '),
          duration: 0.4, ease: 'power2.inOut',
        })
      }

      c.addEventListener('mouseenter', onEnter)
      c.addEventListener('mouseleave', onLeave)
    })

    return () => { obs.disconnect() }
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 10vw, 10rem) 0' }}
    >
      {/* Soft yellow glow — centred warm orb, screen blend on dark bg */}
      <SoftYellowGlow />

      {/* Grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.028, zIndex: 1 }}>
        <filter id="gdsvs-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.64" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#gdsvs-gr)" fill="white"/>
      </svg>

      {/* Ambient bloom — amber top-center to echo the editorial section above */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 1,
        background: [
          'radial-gradient(ellipse 65% 45% at 50% 0%, hsl(38 90% 58% / 0.055) 0%, transparent 70%)',
          'radial-gradient(ellipse 40% 30% at 50% 110%, hsl(0 0% 0% / 0.5) 0%, transparent 70%)',
        ].join(', '),
      }}/>

      {/* Edge vignette */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 1,
        background: 'radial-gradient(ellipse 110% 85% at 50% 50%, transparent 52%, hsl(0 0% 0% / 0.28) 100%)',
      }}/>

      {/* Top fade — masks amber ambient glow at section boundary */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '240px',
        background: 'linear-gradient(to bottom, #010709 0%, rgba(1,7,9,0.85) 40%, rgba(1,7,9,0) 100%)',
        pointerEvents: 'none',
        zIndex: 5,
      }}/>

      <div className="relative z-10 max-w-[78rem] mx-auto px-6 sm:px-12 flex flex-col items-center text-center">

        {/* Eyebrow */}
        <div className="gdsvs-h flex items-center gap-4 mb-7">
          <div style={{ width: 20, height: 1, background: 'hsl(38 90% 58% / 0.5)' }}/>
          <span className="font-sans uppercase" style={{ fontSize: '0.58rem', letterSpacing: '0.34em', color: 'hsl(38 90% 62%)' }}>
            What We Deliver
          </span>
          <div style={{ width: 20, height: 1, background: 'hsl(38 90% 58% / 0.5)' }}/>
        </div>

        {/* Headline */}
        <h2
          className="gdsvs-h"
          style={{
            fontFamily: 'var(--font-sans, sans-serif)',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 5.8vw, 4.8rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.042em',
            color: 'hsl(0 0% 93%)',
            marginBottom: '1.5rem',
            maxWidth: '46rem',
          }}
        >
          Every format.<br />
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(0 0% 36%)' }}>
            Every screen.
          </em>
        </h2>

        {/* Subtext */}
        <p
          className="gdsvs-h font-sans font-light"
          style={{
            fontSize: 'clamp(0.86rem, 1.3vw, 1rem)',
            lineHeight: 1.88,
            color: '#F2F8FC',
            maxWidth: '36rem',
            marginBottom: 'clamp(3.5rem, 6vw, 5.5rem)',
          }}
        >
          From cinematic motion graphics to social-first brand campaigns — we produce
          premium creative assets that communicate with precision, convert with confidence,
          and elevate every touchpoint your audience encounters.
        </p>

        {/* Hairline divider */}
        <div
          className="gdsvs-h w-full"
          style={{ height: '1px', background: 'hsl(0 0% 100% / 0.06)', marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}
        />

        {/* 4-column pill grid — responsive for mobile/tablet */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GDS_ITEMS.map((item) => (
            <div
              key={item}
              className="w-full min-w-0 flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.03] px-5 py-4 cursor-default select-none relative"
              style={{
                boxShadow: [
                  'inset 0 1px 0 hsl(0 0% 100% / 0.05)',
                  'inset 0 -1px 0 hsl(0 0% 0% / 0.2)',
                  '0 0 0 1.5px hsl(0 0% 100% / 0.10)',
                  '0 2px 10px hsl(0 0% 0% / 0.4)',
                ].join(', '),
              }}
            >
              {/* Shimmer sweep element (visual only) */}
              <div
                className="absolute inset-y-0 left-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  width: '40%',
                  background: 'linear-gradient(90deg, transparent, hsl(38 90% 70% / 0.22), transparent)',
                  transform: 'translateX(-120%)',
                  borderRadius: '100px',
                }}
              />

              <div style={{ flexShrink: 0 }} aria-hidden>
                <GdsCheckIcon />
              </div>

              <span className="text-sm sm:text-base text-white/65 leading-normal whitespace-normal break-words min-w-0 font-sans font-medium">
                {item}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom fade — cleans vignette edge before SplitA */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '220px',
        background: 'linear-gradient(to bottom, rgba(1,7,9,0), #010709)',
        pointerEvents: 'none',
        zIndex: 5,
      }}/>
    </section>
  )
}

// ─── Graphic Design — Split A (Image left · Text right) ──────────────────────

function GraphicDesignSplitA() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const imgWrap = el.querySelector<HTMLElement>('.gdsa-img')
    const textEls = el.querySelectorAll<HTMLElement>('.gdsa-t')
    if (imgWrap) gsap.set(imgWrap, { opacity: 0, x: -36 })
    gsap.set(textEls, { opacity: 0, y: 32 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      if (imgWrap) gsap.to(imgWrap, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' })
      gsap.to(textEls, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.12, delay: 0.15 })
      obs.disconnect()
    }, { threshold: 0.06 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 10vw, 10rem) 0' }}
    >
      {/* Dark sphere grid — 32 px slate lines + centred violet orb */}
      <DarkSphereGridBg />

      {/* Grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.026, zIndex: 1 }}>
        <filter id="gdsa-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.64" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#gdsa-gr)" fill="white"/>
      </svg>

      {/* Top fade — eases grid texture in from Section 3 */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '240px',
        background: 'linear-gradient(to bottom, #010709 0%, rgba(1,7,9,0.85) 40%, rgba(1,7,9,0) 100%)',
        pointerEvents: 'none',
        zIndex: 5,
      }}/>

      {/* Orange ambient bloom from left — echoes Firefly-12 lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 1,
        background: [
          'radial-gradient(ellipse 55% 75% at -5% 50%, hsl(25 95% 55% / 0.07) 0%, transparent 65%)',
          'radial-gradient(ellipse 30% 45% at 8% 18%,  hsl(185 90% 55% / 0.04) 0%, transparent 58%)',
        ].join(', '),
      }}/>

      <div className="relative z-10 max-w-[92rem] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-[clamp(3rem,6vw,6rem)] items-center">

          {/* ── LEFT: Image ── */}
          <div className="gdsa-img" style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: [
                '0 1px 0 1px hsl(0 0% 100% / 0.05)',
                '0 24px 60px -10px hsl(0 0% 0% / 0.75)',
                '0 8px 28px -6px hsl(25 95% 50% / 0.16)',
                '0 0 70px -18px hsl(185 90% 55% / 0.12)',
              ].join(', '),
            }}>
              <img
                loading="lazy"
                decoding="async"
                src="/brand_assets/office-portrait.png"
                alt="Designer at work — cinematic neon studio setup"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'clamp(280px, 68vw, 800px)',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                }}
              />
            </div>
          </div>

          {/* ── RIGHT: Typography ── */}
          <div className="flex flex-col" style={{ paddingLeft: 'clamp(0rem, 3vw, 3rem)' }}>

            {/* Section marker */}
            <div className="gdsa-t flex items-center gap-4 mb-10">
              <div style={{ width: 22, height: 1, background: 'hsl(38 90% 58% / 0.5)' }}/>
              <span className="font-sans uppercase" style={{
                fontSize: '0.57rem', letterSpacing: '0.32em', color: 'hsl(38 85% 62%)',
              }}>
                Craft & Direction
              </span>
            </div>

            {/* Headline */}
            <div
              className="gdsa-t"
              style={{
                marginBottom: 'clamp(2rem, 3.5vw, 3rem)',
                letterSpacing: '-0.046em',
                lineHeight: 0.88,
              }}
            >
              <p style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontWeight: 200,
                fontSize: 'clamp(3.2rem, 6.8vw, 6.4rem)',
                color: 'hsl(0 0% 90%)',
                display: 'block',
              }}>
                Visuals that
              </p>
              <p style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontWeight: 200,
                fontSize: 'clamp(3.2rem, 6.8vw, 6.4rem)',
                color: 'hsl(0 0% 90%)',
                display: 'block',
              }}>
                demand
              </p>
              <p style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(3.2rem, 6.8vw, 6.4rem)',
                color: 'hsl(0 0% 34%)',
                display: 'block',
              }}>
                attention.
              </p>
            </div>

            {/* Divider */}
            <div
              className="gdsa-t"
              style={{
                height: '1px',
                background: 'hsl(0 0% 100% / 0.06)',
                marginBottom: 'clamp(2rem, 3vw, 2.8rem)',
              }}
            />

            {/* Body copy */}
            <p
              className="gdsa-t font-sans font-light"
              style={{
                fontSize: 'clamp(0.86rem, 1.3vw, 1rem)',
                lineHeight: 1.92,
                color: '#F2F8FC',
                maxWidth: '30rem',
                marginBottom: 'clamp(2rem, 3.5vw, 3rem)',
              }}
            >
              Every brand has a story. We translate it into motion graphics, identity systems,
              and campaign visuals that move with precision and land with impact. From the first
              frame to the final export, every creative decision is made in service of one
              outcome — a visual language your audience cannot ignore.
            </p>

            {/* Stat row */}
            <div
              className="gdsa-t flex items-center gap-10"
              style={{ paddingTop: 'clamp(1.5rem, 2.5vw, 2rem)', borderTop: '1px solid hsl(0 0% 100% / 0.05)' }}
            >
              {[
                { value: '100+', label: 'Brands elevated' },
                { value: '4K',   label: 'Motion deliverables' },
                { value: '12',   label: 'Creative formats' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-sans" style={{
                    fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
                    fontWeight: 300,
                    letterSpacing: '-0.04em',
                    color: 'hsl(0 0% 78%)',
                    lineHeight: 1,
                    marginBottom: '5px',
                  }}>
                    {value}
                  </p>
                  <p className="font-sans" style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'hsl(0 0% 26%)',
                  }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Bottom fade — bridges into SplitB */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '220px',
        background: 'linear-gradient(to bottom, rgba(1,7,9,0), #010709)',
        pointerEvents: 'none',
        zIndex: 5,
      }}/>
    </section>
  )
}

// ─── Graphic Design — Split B (Text left · CSS office right) ─────────────────


function GraphicDesignSplitB() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const imgWrap = el.querySelector<HTMLElement>('.gdsb-img')
    const textEls = el.querySelectorAll<HTMLElement>('.gdsb-t')
    if (imgWrap) gsap.set(imgWrap, { opacity: 0, x: 36 })
    gsap.set(textEls, { opacity: 0, y: 32 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.to(textEls, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.12 })
      if (imgWrap) gsap.to(imgWrap, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out', delay: 0.15 })
      obs.disconnect()
    }, { threshold: 0.06 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 10vw, 10rem) 0' }}
    >
      {/* Animated canvas grain + orange spotlight + dot grid */}
      <NoiseCanvasBg />

      {/* Subtle cool ambient from right */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 1,
        background: [
          'radial-gradient(ellipse 50% 65% at 105% 50%, hsl(220 55% 45% / 0.05) 0%, transparent 65%)',
          'radial-gradient(ellipse 35% 40% at 95% 15%,  hsl(200 65% 50% / 0.03) 0%, transparent 55%)',
        ].join(', '),
      }}/>

      {/* Top fade — blends seamlessly from SplitA */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '240px',
        background: 'linear-gradient(to bottom, #010709 0%, rgba(1,7,9,0.85) 40%, rgba(1,7,9,0) 100%)',
        pointerEvents: 'none',
        zIndex: 5,
      }}/>

      <div className="relative z-10 max-w-[92rem] mx-auto px-6 sm:px-12">
        <div
          className="hidden lg:grid lg:grid-cols-[1fr_1.25fr]"
          style={{
            gap: 'clamp(2rem, 6vw, 6rem)',
            alignItems: 'center',
          }}
        >

          {/* ── LEFT: Typography ── */}
          <div className="flex flex-col" style={{ paddingRight: 'clamp(0rem, 2vw, 2rem)' }}>

            {/* Section marker */}
            <div className="gdsb-t flex items-center gap-4 mb-10">
              <div style={{ width: 22, height: 1, background: 'hsl(0 0% 30%)' }}/>
              <span className="font-sans uppercase" style={{
                fontSize: '0.57rem', letterSpacing: '0.32em', color: 'hsl(0 0% 32%)',
              }}>
                The Studio
              </span>
            </div>

            {/* Headline */}
            <div
              className="gdsb-t"
              style={{ marginBottom: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.046em', lineHeight: 0.88 }}
            >
              <p style={{
                fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 700,
                fontSize: 'clamp(3rem, 6.5vw, 6rem)',
                color: 'hsl(0 0% 92%)', display: 'block',
              }}>Where ideas</p>
              <p style={{
                fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 700,
                fontSize: 'clamp(3rem, 6.5vw, 6rem)',
                color: 'hsl(0 0% 92%)', display: 'block',
              }}>become</p>
              <p style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic', fontWeight: 400,
                fontSize: 'clamp(3rem, 6.5vw, 6rem)',
                color: 'hsl(0 0% 32%)', display: 'block',
              }}>culture.</p>
            </div>

            {/* Divider */}
            <div className="gdsb-t" style={{
              height: '1px', background: 'hsl(0 0% 100% / 0.07)',
              marginBottom: 'clamp(2rem, 3vw, 2.8rem)',
            }}/>

            {/* Body */}
            <p className="gdsb-t font-sans font-light" style={{
              fontSize: 'clamp(0.86rem, 1.3vw, 1rem)',
              lineHeight: 1.92, color: '#F2F8FC',
              maxWidth: '28rem',
              marginBottom: 'clamp(2.5rem, 4vw, 3.5rem)',
            }}>
              Our studio is built for precision. A focused environment where brand strategy,
              motion craft, and digital storytelling converge — producing work that earns
              attention and sustains it across every platform your audience calls home.
            </p>

            {/* Process list */}
            <ul className="gdsb-t flex flex-col" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                ['01', 'Brief & Creative Direction'],
                ['02', 'Concept & Visual Development'],
                ['03', 'Design, Motion & Production'],
                ['04', 'Refinement & Final Delivery'],
              ].map(([num, step]) => (
                <li key={num} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.9rem 0',
                  borderBottom: '1px solid hsl(0 0% 100% / 0.05)',
                }}>
                  <span className="font-sans font-light" style={{
                    fontSize: 'clamp(0.88rem, 1.1vw, 0.9rem)',
                    color: '#F2F8FC', letterSpacing: '0.01em',
                  }}>{step}</span>
                  <span className="font-sans" style={{
                    fontSize: '0.58rem', letterSpacing: '0.22em',
                    color: 'hsl(0 0% 20%)', textTransform: 'uppercase',
                  }}>{num}</span>
                </li>
              ))}
            </ul>

          </div>

          {/* ── RIGHT: Image ── */}
          <div className="gdsb-img" style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: [
                '0 1px 0 1px hsl(0 0% 100% / 0.05)',
                '0 24px 60px -10px hsl(0 0% 0% / 0.85)',
                '0 0 70px -18px hsl(220 55% 55% / 0.14)',
              ].join(', '),
            }}>
              <img
                loading="lazy"
                decoding="async"
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85"
                alt="High-end luxurious modern office interior"
                className="block w-full object-cover object-center h-[260px] sm:h-[400px] lg:h-[clamp(500px,65vw,780px)]"
                style={{ objectPosition: 'center center' }}
              />
            </div>
          </div>

        </div>

        {/* ═══ MOBILE / TABLET LAYOUT (< lg) ═══ */}
        <div className="block lg:hidden px-6 sm:px-8" style={{ paddingTop: '0.75rem' }}>

          {/* Text stack: heading -> paragraph */}
          <div style={{ maxWidth: '100%', margin: '0 auto', paddingBottom: '1rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500,
              fontSize: 'clamp(1.8rem, 6.6vw, 2.6rem)',
              lineHeight: 1.08, letterSpacing: '-0.02em',
              color: 'hsl(0 0% 94%)', margin: 0, marginBottom: '0.7rem'
            }}>
              Where Vision Becomes Influence
            </h2>

            <div style={{ height: '1px', background: 'hsl(0 0% 100% / 0.06)', margin: '0.9rem 0' }} />

            <p style={{
              fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 300,
              fontSize: '0.98rem', lineHeight: 1.85,
              color: '#F2F8FC', margin: 0, marginBottom: '1.25rem'
            }}>
              Every project begins with strategy and ends with impact. We combine brand thinking, design excellence, motion craftsmanship, and digital storytelling to create work that captures attention, builds recognition, and delivers lasting value across every platform.
            </p>
          </div>

          {/* 2×2 Process grid — compact, balanced */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px',
              width: '100%',
            }}>
              {([
                ['01', 'Brief & Creative Direction'],
                ['02', 'Concept & Visual Development'],
                ['03', 'Design, Motion & Production'],
                ['04', 'Refinement & Final Delivery'],
              ] as const).map(([num, step]) => (
                <div key={num} style={{
                  background: 'linear-gradient(180deg, hsl(0 0% 6% / 0.96), hsl(0 0% 4% / 0.96))',
                  borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  minHeight: '78px', boxShadow: '0 6px 18px rgba(0,0,0,0.55)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '0.66rem', color: 'hsl(0 0% 76%)', letterSpacing: '0.18em'
                    }}>{num}</span>
                  </div>
                  <div style={{ marginTop: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 300, fontSize: '0.92rem', color: 'hsl(0 0% 78%)', lineHeight: 1.3 }}>
                      {step}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image below content */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ borderRadius: 18, overflow: 'hidden', width: '100%', boxShadow: '0 18px 48px rgba(0,0,0,0.7)' }}>
              <img
                loading="lazy"
                decoding="async"
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85"
                alt="Creative studio workspace"
                style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade — bridges into FinalPresentation */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '120px',
        background: 'linear-gradient(to bottom, rgba(1,7,9,0), #010709)',
        pointerEvents: 'none',
        zIndex: 5,
      }}/>
    </section>
  )
}

// ─── Graphic Design — Final Brand Presentation (Section 6) ──────────────────

function GraphicDesignFinalPresentation() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el.querySelectorAll('.gdfp-label'),    { opacity: 0, y: 18 })
    gsap.set(el.querySelectorAll('.gdfp-heading'),  { opacity: 0, y: 32, filter: 'blur(8px)' })
    gsap.set(el.querySelectorAll('.gdfp-rule'),     { opacity: 0, scaleX: 0, transformOrigin: 'left center' })
    gsap.set(el.querySelectorAll('.gdfp-body'),     { opacity: 0, y: 20 })
    gsap.set(el.querySelectorAll('.gdfp-feat'),     { opacity: 0, x: -16 })
    gsap.set(el.querySelectorAll('.gdfp-close'),    { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.gdfp-main'),     { opacity: 0, y: 44, scale: 0.96, filter: 'blur(4px)' })
    gsap.set(el.querySelectorAll('.gdfp-social'),   { opacity: 0, y: 28, scale: 0.93 })
    gsap.set(el.querySelectorAll('.gdfp-motion'),   { opacity: 0, y: 22, scale: 0.95 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(el.querySelectorAll('.gdfp-label'),   { opacity: 1, y: 0, duration: 0.6 }, 0)
      tl.to(el.querySelectorAll('.gdfp-heading'), { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0 }, 0.1)
      tl.to(el.querySelectorAll('.gdfp-rule'),    { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0.3)
      tl.to(el.querySelectorAll('.gdfp-body'),    { opacity: 1, y: 0, duration: 0.75, stagger: 0.13 }, 0.35)
      tl.to(el.querySelectorAll('.gdfp-feat'),    { opacity: 1, x: 0, duration: 0.55, stagger: 0.09 }, 0.5)
      tl.to(el.querySelectorAll('.gdfp-close'),   { opacity: 1, y: 0, duration: 0.6 }, 0.78)
      tl.to(el.querySelectorAll('.gdfp-main'),    { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.15 }, 0.18)
      tl.to(el.querySelectorAll('.gdfp-social'),  { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'back.out(1.4)' }, 0.52)
      tl.to(el.querySelectorAll('.gdfp-motion'),  { opacity: 1, y: 0, scale: 1, duration: 0.8,  ease: 'back.out(1.4)' }, 0.66)

      tl.add(() => {
        const main   = el.querySelector('.gdfp-main')   as HTMLElement | null
        const social = el.querySelector('.gdfp-social') as HTMLElement | null
        const motion = el.querySelector('.gdfp-motion') as HTMLElement | null
        if (main)   gsap.to(main,   { y: -10, duration: 4.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        if (social) gsap.to(social, { y: -7,  duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 })
        if (motion) gsap.to(motion, { y: -8,  duration: 5.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.9 })
      }, '>')

      obs.disconnect()
    }, { threshold: 0.06 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 10vw, 10rem) 0' }}
    >
      {/* Grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.024, zIndex: 1 }}>
        <filter id="gdfp-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.64" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#gdfp-gr)" fill="white"/>
      </svg>

      {/* Ambient — champagne left + cyan right */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 1,
        background: [
          'radial-gradient(ellipse 55% 65% at -2% 35%,  hsl(38 85% 58% / 0.05)  0%, transparent 65%)',
          'radial-gradient(ellipse 50% 60% at 102% 70%, hsl(195 90% 55% / 0.06) 0%, transparent 60%)',
        ].join(', '),
      }}/>

      <div className="relative z-10 max-w-[92rem] mx-auto px-6 sm:px-12">
        <div
          className="hidden lg:grid"
          style={{
            gridTemplateColumns: '1fr 1.12fr',
            gap: 'clamp(3rem, 6vw, 7rem)',
            alignItems: 'center',
          }}
        >

          {/* ── LEFT: Text ── */}
          <div className="flex flex-col">

            {/* Label */}
            <div className="gdfp-label flex items-center gap-3 mb-8">
              <div style={{ width: 20, height: 1, background: 'hsl(195 90% 55% / 0.55)' }}/>
              <span className="font-sans uppercase" style={{ fontSize: '0.57rem', letterSpacing: '0.34em', color: 'hsl(195 90% 62%)' }}>
                Final Brand Presentation
              </span>
            </div>

            {/* Headline */}
            <h2
              className="gdfp-heading font-sans font-light"
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
                color: 'hsl(0 0% 94%)',
                marginBottom: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                maxWidth: '26rem',
              }}
            >
              Where Vision Becomes{' '}
              <em style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic', fontWeight: 400,
                color: 'hsl(0 0% 48%)',
              }}>
                Influence.
              </em>
            </h2>

            {/* Rule */}
            <div
              className="gdfp-rule"
              style={{ width: '2rem', height: '1px', background: 'hsl(195 90% 55% / 0.3)', marginBottom: 'clamp(1.8rem, 3vw, 2.5rem)' }}
            />

            {/* Para */}
            <p className="gdfp-body font-sans font-light" style={{
              fontSize: 'clamp(0.86rem, 1.3vw, 0.98rem)', lineHeight: 1.92,
              color: '#F2F8FC', marginBottom: 'clamp(2rem, 3.5vw, 3rem)', maxWidth: '30rem',
            }}>
              Every project begins with strategy and ends with impact. We combine brand thinking, design excellence, motion craftsmanship, and digital storytelling to create work that captures attention, builds recognition, and delivers lasting value across every platform.
            </p>

            {/* Feature list */}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.88rem', marginBottom: 'clamp(2rem, 3.5vw, 3rem)' }}>
              {[
                'Final visual refinement',
                'Motion-ready asset delivery',
                'Social-first content formatting',
                'Premium ad presentation',
                'Multi-platform export optimisation',
              ].map(item => (
                <li key={item} className="gdfp-feat" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    background: 'hsl(195 90% 55% / 0.08)',
                    border: '1px solid hsl(195 90% 55% / 0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                      <path d="M1.5 4L3 5.5L6.5 2" stroke="hsl(195 90% 62%)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-sans font-light" style={{ fontSize: 'clamp(0.82rem, 1.2vw, 0.92rem)', color: '#F2F8FC', letterSpacing: '0.01em' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Closing line */}
            <p className="gdfp-close font-sans font-light" style={{
              fontSize: 'clamp(0.78rem, 1.1vw, 0.88rem)', lineHeight: 1.85,
              color: '#F2F8FC', maxWidth: '28rem',
              borderLeft: '2px solid hsl(195 90% 55% / 0.18)',
              paddingLeft: '1rem',
            }}>
              Built to look sharp across websites, campaigns, reels, advertisements, and digital platforms.
            </p>

          </div>

          {/* ── RIGHT: Layered mockup ── */}
          <div style={{ position: 'relative', height: 'clamp(500px, 58vw, 640px)' }}>

            {/* Backlight */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: '-40px', zIndex: 0,
              background: 'radial-gradient(ellipse 70% 60% at 55% 48%, hsl(195 90% 55% / 0.09), transparent 68%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }}/>

            {/* ── Main brand card ── */}
            <div
              className="gdfp-main"
              style={{
                position: 'absolute',
                top: 0, left: 0, right: '14%', bottom: '70px',
                zIndex: 2,
                borderRadius: '22px', overflow: 'hidden',
                border: '1px solid hsl(0 0% 100% / 0.07)',
                boxShadow: '0 32px 80px hsl(0 0% 0% / 0.72), 0 2px 0 hsl(0 0% 100% / 0.05)',
                background: 'linear-gradient(148deg, hsl(215 22% 8%) 0%, hsl(215 14% 5%) 100%)',
              }}
            >
              {/* Top bar */}
              <div style={{
                padding: '12px 16px', borderBottom: '1px solid hsl(0 0% 100% / 0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['#ff5f57','#febc2e','#28c840'].map(c => (
                    <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }}/>
                  ))}
                </div>
                <span style={{ fontSize: '0.54rem', letterSpacing: '0.22em', color: 'hsl(0 0% 26%)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                  Brand Identity System
                </span>
                <span style={{ fontSize: '0.54rem', color: 'hsl(0 0% 22%)', fontFamily: 'monospace' }}>2026</span>
              </div>

              {/* Content */}
              <div style={{ padding: '24px 22px 28px' }}>

                {/* Hero gradient banner */}
                <div style={{
                  height: '100px', borderRadius: '12px', marginBottom: '20px',
                  background: 'linear-gradient(135deg, hsl(215 70% 12%) 0%, hsl(195 80% 16%) 45%, hsl(220 60% 10%) 100%)',
                  border: '1px solid hsl(195 90% 55% / 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 80% at 30% 50%, hsl(195 90% 55% / 0.13), transparent 68%)' }}/>
                  <span style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: 'italic', fontWeight: 400,
                    fontSize: '1.85rem', letterSpacing: '-0.03em',
                    color: 'hsl(0 0% 82%)', position: 'relative', zIndex: 1,
                  }}>
                    Weavy Studio
                  </span>
                </div>

                {/* Colour system */}
                <div style={{ marginBottom: '18px' }}>
                  <span style={{ fontSize: '0.5rem', letterSpacing: '0.24em', color: 'hsl(0 0% 28%)', textTransform: 'uppercase', display: 'block', marginBottom: '9px' }}>Colour System</span>
                  <div style={{ display: 'flex', gap: '7px' }}>
                    {['hsl(195 90% 55%)','hsl(38 85% 58%)','hsl(320 75% 62%)','hsl(215 80% 62%)','hsl(0 0% 88%)','hsl(0 0% 11%)'].map((c, i) => (
                      <div key={i} style={{ width: 26, height: 26, borderRadius: '7px', background: c, border: '1px solid hsl(0 0% 100% / 0.07)', flexShrink: 0 }}/>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'hsl(0 0% 100% / 0.055)', marginBottom: '18px' }}/>

                {/* Typeface */}
                <div style={{ marginBottom: '18px' }}>
                  <span style={{ fontSize: '0.5rem', letterSpacing: '0.24em', color: 'hsl(0 0% 28%)', textTransform: 'uppercase', display: 'block', marginBottom: '7px' }}>Typeface</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: '1.5rem', color: 'hsl(0 0% 68%)', lineHeight: 1 }}>Aa</span>
                    <span style={{ fontFamily: 'sans-serif', fontWeight: 300, fontSize: '0.75rem', color: 'hsl(0 0% 32%)' }}>Brand Sans Light</span>
                  </div>
                </div>

                {/* Export formats */}
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {['.svg','.png','.pdf','.mp4','.webm'].map(fmt => (
                    <span key={fmt} style={{
                      fontSize: '0.5rem', letterSpacing: '0.08em',
                      padding: '3px 8px', borderRadius: '4px',
                      background: 'hsl(0 0% 100% / 0.04)',
                      border: '1px solid hsl(0 0% 100% / 0.07)',
                      color: 'hsl(0 0% 36%)', fontFamily: 'monospace',
                    }}>{fmt}</span>
                  ))}
                </div>

              </div>
            </div>

            {/* ── Social preview card ── */}
            <div
              className="gdfp-social"
              style={{
                position: 'absolute', top: '18px', right: 0,
                width: '156px', zIndex: 4,
                borderRadius: '17px', overflow: 'hidden',
                border: '1px solid hsl(0 0% 100% / 0.09)',
                boxShadow: '0 18px 44px hsl(0 0% 0% / 0.62)',
                background: 'hsl(215 16% 7%)',
              }}
            >
              <div style={{
                padding: '9px 11px 8px', display: 'flex', alignItems: 'center', gap: '7px',
                borderBottom: '1px solid hsl(0 0% 100% / 0.05)',
              }}>
                <div style={{ width: 21, height: 21, borderRadius: '50%', background: 'linear-gradient(135deg, hsl(38 85% 55%), hsl(320 70% 55%))', flexShrink: 0 }}/>
                <div>
                  <p style={{ fontSize: '0.54rem', fontWeight: 600, color: 'hsl(0 0% 80%)', margin: 0, lineHeight: 1.2 }}>@weavy.studio</p>
                  <p style={{ fontSize: '0.49rem', color: 'hsl(0 0% 32%)', margin: 0, lineHeight: 1.2 }}>Brand Visuals</p>
                </div>
              </div>
              <div style={{
                height: '88px',
                background: 'linear-gradient(145deg, hsl(215 40% 10%), hsl(195 60% 13%))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 50%, hsl(195 80% 55% / 0.15), transparent 65%)' }}/>
                <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: '0.88rem', color: 'hsl(0 0% 58%)', position: 'relative', zIndex: 1 }}>campaign</span>
              </div>
              <div style={{ padding: '7px 11px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.49rem', color: 'hsl(0 0% 40%)' }}>♥ 48.2K</span>
                <span style={{ fontSize: '0.49rem', color: 'hsl(0 0% 30%)' }}>💬 1.4K</span>
              </div>
            </div>

            {/* ── Motion badge card ── */}
            <div
              className="gdfp-motion"
              style={{
                position: 'absolute', bottom: 0, left: '6%', right: '6%',
                zIndex: 4,
                borderRadius: '15px',
                border: '1px solid hsl(195 90% 55% / 0.15)',
                boxShadow: '0 12px 36px hsl(0 0% 0% / 0.55), 0 0 0 1px hsl(195 90% 55% / 0.06)',
                background: 'hsl(215 18% 6%)',
                padding: '13px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'hsl(195 90% 55% / 0.12)',
                  border: '1px solid hsl(195 90% 55% / 0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                    <polygon points="3,2 8,4.5 3,7" fill="hsl(195 90% 62%)"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: '0.6rem', fontWeight: 500, color: 'hsl(0 0% 80%)', margin: 0, lineHeight: 1.3 }}>Motion Ready</p>
                  <p style={{ fontSize: '0.5rem', color: 'hsl(0 0% 34%)', margin: 0, lineHeight: 1.3 }}>Final export package</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                {['.mp4', '.gif'].map(f => (
                  <span key={f} style={{
                    fontSize: '0.47rem', padding: '2px 7px', borderRadius: '4px',
                    background: 'hsl(195 90% 55% / 0.08)',
                    border: '1px solid hsl(195 90% 55% / 0.18)',
                    color: 'hsl(195 90% 62%)', fontFamily: 'monospace',
                  }}>{f}</span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ═══ MOBILE / TABLET LAYOUT (< lg) ═══ */}
        <div className="block lg:hidden" style={{ paddingTop: '0.5rem' }}>

          {/* Section marker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: 20, height: 1, background: 'hsl(195 90% 55% / 0.55)' }}/>
            <span style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '0.57rem', letterSpacing: '0.34em',
              color: 'hsl(195 90% 62%)', textTransform: 'uppercase',
            }}>
              Final Brand Presentation
            </span>
          </div>

          {/* Heading */}
          <h2 style={{
            fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 300,
            fontSize: 'clamp(2rem, 7vw, 2.8rem)',
            lineHeight: 1.1, letterSpacing: '-0.038em',
            color: 'hsl(0 0% 94%)',
            marginBottom: '1.5rem',
          }}>
            Where Vision Becomes{' '}
            <em style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic', fontWeight: 400,
              color: 'hsl(0 0% 48%)',
            }}>
              Influence.
            </em>
          </h2>

          {/* Rule */}
          <div style={{ width: '2rem', height: '1px', background: 'hsl(195 90% 55% / 0.3)', marginBottom: '1.5rem' }} />

          {/* Paragraph */}
          <p style={{
            fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 300,
            fontSize: '0.95rem', lineHeight: 1.9,
            color: '#F2F8FC',
            marginBottom: '2.5rem',
          }}>
            Every project begins with strategy and ends with impact. We combine brand thinking,
            design excellence, motion craftsmanship, and digital storytelling to create work that
            captures attention, builds recognition, and delivers lasting value across every platform.
          </p>

          {/* 2×2 Process grid */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              background: 'hsl(0 0% 100% / 0.06)',
              border: '1px solid hsl(0 0% 100% / 0.06)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              {([
                ['01', 'Brief & Creative Direction'],
                ['02', 'Concept & Visual Development'],
                ['03', 'Design, Motion & Production'],
                ['04', 'Refinement & Final Delivery'],
              ] as const).map(([num, step]) => (
                <div key={num} style={{
                  padding: '1.25rem',
                  background: 'hsl(215 18% 5%)',
                  display: 'flex', flexDirection: 'column', gap: '0.55rem',
                }}>
                  <span style={{
                    fontSize: '0.5rem', letterSpacing: '0.28em',
                    color: 'hsl(195 90% 55% / 0.6)', textTransform: 'uppercase',
                    fontFamily: 'monospace',
                  }}>{num}</span>
                  <span style={{
                    fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 300,
                    fontSize: '0.83rem', color: '#F2F8FC', lineHeight: 1.5,
                  }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full-width image */}
          <div style={{
            borderRadius: '20px', overflow: 'hidden',
            boxShadow: '0 20px 50px hsl(0 0% 0% / 0.7), 0 1px 0 hsl(0 0% 100% / 0.05)',
          }}>
            <img
              loading="lazy"
              decoding="async"
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85"
              alt="Creative design studio"
              className="block w-full object-cover object-center h-[260px] sm:h-[360px]"
            />
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 bottom-0" style={{
        height: '100px',
        background: 'linear-gradient(to top, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>
    </section>
  )
}

// ─── Graphic Design — Final CTA (Start Your Visual System) ──────────────────

function GraphicDesignCTA() {
  const ref = useRef<HTMLElement>(null)
  const [primaryHover,   setPrimaryHover]   = useState(false)
  const [secondaryHover, setSecondaryHover] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.set(el.querySelectorAll('.gdcta-el'), { opacity: 0, y: 24 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.to(el.querySelectorAll('.gdcta-el'), {
        opacity: 1, y: 0,
        duration: 0.85, ease: 'power3.out',
        stagger: 0.13,
      })
      obs.disconnect()
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(6rem, 12vw, 10rem) 0' }}
    >
      {/* Grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.022, zIndex: 1 }}>
        <filter id="gdcta-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.64" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#gdcta-gr)" fill="white"/>
      </svg>

      {/* Subtle centered ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        zIndex: 1,
        background: 'radial-gradient(ellipse 70% 55% at 50% 50%, hsl(195 90% 55% / 0.05) 0%, transparent 68%)',
      }}/>

      <div className="relative z-10 max-w-[58rem] mx-auto px-6 sm:px-10 flex flex-col items-center text-center">

        {/* Label */}
        <p
          className="gdcta-el font-sans font-light uppercase mb-7"
          style={{ fontSize: '0.58rem', letterSpacing: '0.38em', color: 'hsl(195 90% 62% / 0.7)' }}
        >
          Ready to build your visual system?
        </p>

        {/* Headline */}
        <h2
          className="gdcta-el font-sans font-light"
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
            lineHeight: 1.06,
            letterSpacing: '-0.04em',
            color: 'hsl(0 0% 95%)',
            marginBottom: 'clamp(1.4rem, 2.5vw, 2rem)',
            maxWidth: '46rem',
          }}
        >
          Let&apos;s create visuals that make your brand{' '}
          <em style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: 'italic', fontWeight: 400,
            color: 'hsl(0 0% 52%)',
          }}>
            impossible to ignore.
          </em>
        </h2>

        {/* Rule */}
        <div
          className="gdcta-el"
          aria-hidden="true"
          style={{
            width: '2rem', height: '1px',
            background: 'hsl(195 90% 55% / 0.28)',
            marginBottom: 'clamp(1.4rem, 2.5vw, 2rem)',
          }}
        />

        {/* Paragraph */}
        <p
          className="gdcta-el font-sans font-light"
          style={{
            fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
            lineHeight: 1.9,
            color: '#F2F8FC',
            maxWidth: '38rem',
            marginBottom: 'clamp(2.8rem, 5vw, 4rem)',
          }}
        >
          From brand assets and campaign graphics to motion design and social-first content, we create polished visuals built to strengthen your presence and help your audience remember you.
        </p>

        {/* Buttons */}
        <div className="gdcta-el" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Primary */}
          <button
            onMouseEnter={() => setPrimaryHover(true)}
            onMouseLeave={() => setPrimaryHover(false)}
            onClick={() => window.location.hash = '#contact'}
            style={{
              padding: '0.95rem 2.4rem',
              borderRadius: '999px',
              border: 'none',
              background: primaryHover ? 'hsl(0 0% 92%)' : '#fff',
              color: '#050e10',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontWeight: 400,
              fontSize: 'clamp(0.85rem, 1.3vw, 0.96rem)',
              letterSpacing: '0.01em',
              cursor: 'pointer',
              boxShadow: primaryHover
                ? '0 0 0 4px hsl(195 80% 55% / 0.16), 0 12px 40px hsl(0 0% 0% / 0.5)'
                : '0 8px 32px hsl(0 0% 0% / 0.4)',
              transform: primaryHover ? 'scale(1.03)' : 'scale(1)',
              transition: 'background 0.3s ease, box-shadow 0.35s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
              whiteSpace: 'nowrap',
            }}
          >
            Start a project
          </button>

          {/* Secondary */}
          <button
            onMouseEnter={() => setSecondaryHover(true)}
            onMouseLeave={() => setSecondaryHover(false)}
            onClick={() => window.location.hash = '#work'}
            style={{
              padding: '0.95rem 2.4rem',
              borderRadius: '999px',
              border: `1px solid ${secondaryHover ? 'hsl(0 0% 100% / 0.28)' : 'hsl(0 0% 100% / 0.13)'}`,
              background: secondaryHover ? 'hsl(0 0% 100% / 0.06)' : 'transparent',
              color: secondaryHover ? 'hsl(0 0% 88%)' : 'hsl(0 0% 52%)',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontWeight: 300,
              fontSize: 'clamp(0.85rem, 1.3vw, 0.96rem)',
              letterSpacing: '0.01em',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease, background 0.3s ease, color 0.3s ease',
              whiteSpace: 'nowrap',
            }}
          >
            View our work
          </button>

        </div>

      </div>

      {/* Bottom fade into contact footer */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 bottom-0" style={{
        height: '100px',
        background: 'linear-gradient(to top, #010709 0%, transparent 100%)',
        zIndex: 3,
      }}/>
    </section>
  )
}

// ─── Graphic Design — Contact / Footer ───────────────────────────────────────

const GCF_MARQUEE_TEXT = 'BUILDING THE FUTURE • '

const GCF_SOCIAL_LINKS = [
  { label: 'Twitter',  href: '#', Icon: BcfIconX        },
  { label: 'LinkedIn', href: '#', Icon: BcfIconLinkedIn  },
  { label: 'Dribbble', href: '#', Icon: BcfIconDribbble  },
  { label: 'GitHub',   href: '#', Icon: BcfIconGitHub    },
]

function GraphicDesignContactFooter() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const { videoRef, containerRef } = useHlsVideo(HLS_FOOTER)
  const [ctaHover, setCtaHover] = useState(false)

  // ── GSAP infinite marquee ─────────────────────────────────────────────────
  useEffect(() => {
    const el = marqueeRef.current
    if (!el) return
    const tween = gsap.to(el, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
    return () => { tween.kill() }
  }, [])

  return (
    <section
      id="graphic-contact"
      className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden"
    >
      {/* ── HLS Video background — flipped vertically ── */}
      <div ref={containerRef} className="absolute inset-0" aria-hidden="true" style={{ zIndex: 0 }}>
        <video
          ref={videoRef}
          muted loop playsInline aria-hidden="true"
          className="scale-y-[-1]"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.88, filter: 'brightness(1.06) contrast(1.38) saturate(1.15)' }}
        />
        <div className="absolute inset-0 bg-black/28 lg:bg-black/52" />
        <div className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: '160px', background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)', zIndex: 2 }} />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '200px', background: 'linear-gradient(to top, #010709 0%, transparent 100%)', zIndex: 2 }} />
      </div>

      {/* ── Content ── */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>

        {/* Eyebrow */}
        <p className="font-sans font-light uppercase mb-10"
          style={{ fontSize: '0.68rem', letterSpacing: '0.28em', color: 'hsl(38 90% 65%)' }}>
          Get in touch
        </p>

        {/* ── Marquee ── */}
        <div
          className="w-full overflow-hidden mb-16"
          style={{ borderTop: '1px solid hsl(0 0% 100% / 0.07)', borderBottom: '1px solid hsl(0 0% 100% / 0.07)', padding: '1rem 0' }}
          aria-hidden="true"
        >
          <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="inline-block" style={{
                fontFamily: "'Instrument Serif', 'Didot', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1.15rem, 2.4vw, 1.75rem)',
                fontWeight: 400,
                letterSpacing: '0.08em',
                color: 'hsl(0 0% 100% / 0.15)',
                padding: '0 2.5rem',
              }}>
                {GCF_MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-sans font-light text-text text-center mb-5 px-6"
          style={{ fontSize: 'clamp(2.4rem, 5.8vw, 4.4rem)', lineHeight: 1.06, letterSpacing: '-0.04em' }}>
          Let&apos;s create something{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(0 0% 72%)' }}>
            amazing
          </em>{' '}
          together
        </h2>

        {/* Subtext */}
        <p className="font-sans font-light text-center mb-14 px-6"
          style={{ fontSize: 'clamp(0.84rem, 1.35vw, 0.96rem)', lineHeight: 1.9, color: '#F2F8FC', maxWidth: '34rem' }}>
          Have a project in mind? We&apos;d love to hear about it. Let&apos;s discuss how we can bring your vision to life.
        </p>

        {/* ── CTA Email button ── */}
        <a
          href="mailto:hello@weavyautomation.com"
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          className="relative mb-24 rounded-full"
          style={{
            padding: '2px',
            display: 'inline-block',
            background: ctaHover
              ? 'linear-gradient(135deg, hsl(38 90% 65%) 0%, hsl(25 95% 58%) 40%, hsl(14 90% 62%) 100%)'
              : 'linear-gradient(135deg, hsl(0 0% 22%) 0%, hsl(0 0% 14%) 100%)',
            boxShadow: ctaHover
              ? ['0 0 0 4px hsl(38 90% 60% / 0.12)', '0 0 40px -6px hsl(38 90% 58% / 0.5)', '0 0 90px -16px hsl(38 90% 58% / 0.22)', '0 8px 32px -8px hsl(0 0% 0% / 0.7)'].join(', ')
              : '0 4px 28px -8px hsl(0 0% 0% / 0.65)',
            transition: 'box-shadow 0.35s ease, background 0.35s ease',
          }}
        >
          <span className="flex items-center gap-3 rounded-full font-sans font-light"
            style={{
              padding: '1rem 2.4rem',
              background: ctaHover ? 'hsl(30 40% 6%)' : 'hsl(0 0% 5%)',
              fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
              letterSpacing: '0.01em',
              color: ctaHover ? 'hsl(38 90% 78%)' : 'hsl(0 0% 80%)',
              transition: 'all 0.35s ease',
              whiteSpace: 'nowrap',
            }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: ctaHover ? 'hsl(38 90% 65%)' : 'hsl(0 0% 32%)',
              boxShadow: ctaHover ? '0 0 8px hsl(38 90% 65% / 0.8)' : 'none',
              transition: 'all 0.35s ease',
            }}/>
            hello@weavyautomation.com
            <span aria-hidden="true" style={{
              fontSize: '1em',
              opacity: ctaHover ? 1 : 0.35,
              transform: ctaHover ? 'translateX(3px)' : 'translateX(0)',
              transition: 'all 0.35s ease',
              display: 'inline-block',
            }}>→</span>
          </span>
        </a>

        {/* ── Footer bar ── */}
        <div className="w-full px-6 sm:px-10" style={{
          maxWidth: '72rem', margin: '0 auto',
          borderTop: '1px solid hsl(0 0% 100% / 0.06)',
          paddingTop: '1.75rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '1rem',
        }}>
          {/* Left — green pulsing dot */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex" style={{ width: 8, height: 8 }}>
              <span className="absolute inline-flex rounded-full animate-ping"
                style={{ width: '100%', height: '100%', background: 'hsl(142 71% 45%)', opacity: 0.7 }}/>
              <span className="relative inline-flex rounded-full"
                style={{ width: 8, height: 8, background: 'hsl(142 71% 52%)', boxShadow: '0 0 8px hsl(142 71% 52% / 0.6)' }}/>
            </span>
            <span className="font-sans font-light"
              style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'hsl(0 0% 48%)' }}>
              Available for projects
            </span>
          </div>

          {/* Centre — copyright */}
          <p className="font-sans font-light text-center"
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: 'hsl(0 0% 28%)' }}>
            © {new Date().getFullYear()} Weavy. All rights reserved.
          </p>

          {/* Right — social links */}
          <div className="flex items-center gap-1 justify-end">
            {GCF_SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a key={label} href={href} aria-label={label}
                className="rounded-full flex items-center justify-center"
                style={{ width: 36, height: 36, color: 'hsl(0 0% 36%)', transition: 'color 0.2s ease, background 0.2s ease' }}
                onMouseEnter={e => { const t = e.currentTarget as HTMLElement; t.style.color = 'hsl(0 0% 84%)'; t.style.background = 'hsl(0 0% 100% / 0.07)' }}
                onMouseLeave={e => { const t = e.currentTarget as HTMLElement; t.style.color = 'hsl(0 0% 36%)';  t.style.background = 'transparent' }}
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

// ─── UGC — Hero + Editorial Introduction ─────────────────────────────────────

const UGC_TICKER = ['TikTok', 'Instagram', 'YouTube', 'Reels', 'Shorts', 'UGC', 'Creators', 'Viral Content', 'Authentic', 'Short-Form']

const UGC_CARDS = [
  { num: '01', title: 'Product Reviews & Unboxings',  desc: 'Authentic first-person reviews that dissolve purchase hesitation and build instant credibility.' },
  { num: '02', title: 'Lifestyle & Tutorial Content', desc: 'Scroll-stopping content that places your brand naturally inside real, relatable moments.' },
  { num: '03', title: 'Brand Story Reels',            desc: 'Cinematic short-form stories that communicate your identity in under 60 seconds — and stay in people\'s heads.' },
]

function UGCHero() {
  const heroRef   = useRef<HTMLElement>(null)
  const editRef   = useRef<HTMLElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const items = el.querySelectorAll('.ugch-r')
    gsap.set(items, { opacity: 0, y: 38 })
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      gsap.to(items, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.13 })
      obs.disconnect()
    }, { threshold: 0.04 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = editRef.current
    if (!el) return
    const items = el.querySelectorAll('.ugce-r')
    gsap.set(items, { opacity: 0, y: 44 })
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      gsap.to(items, { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out', stagger: 0.1 })
      // Count-up each stat — repeats every 3 s indefinitely
      el.querySelectorAll<HTMLElement>('.ugc-stat-num').forEach(statEl => {
        const target   = parseFloat(statEl.dataset.val   ?? '0')
        const suffix   = statEl.dataset.suffix ?? ''
        const decimals = parseInt(statEl.dataset.decimals ?? '0')
        const obj = { val: 0 }
        gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 0.4 })
          .fromTo(obj, { val: 0 }, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate() { statEl.textContent = obj.val.toFixed(decimals) + suffix },
          })
      })
      obs.disconnect()
    }, { threshold: 0.07 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = tickerRef.current
    if (!el) return
    gsap.to(el, { x: '-50%', duration: 24, ease: 'none', repeat: -1 })
  }, [])

  return (
    <>
    {/* ── UGC responsive styles — injected once, applies to all UGC sections ── */}
    <style>{`
      /* Hero: mobile padding + allow taller if content overflows */
      #ugc-hero { min-height: clamp(420px, 64vh, 820px); height: auto !important; }
      .ugch-content { padding-left: 1.25rem; padding-right: 1.25rem; }
      @media (min-width: 640px)  { .ugch-content { padding-left: 3.5rem; padding-right: 3.5rem; } }
      @media (min-width: 1024px) { .ugch-content { padding-left: 5rem;   padding-right: 5rem;   } }

      /* Hero text: full width so it never fights justify-between */
      .ugch-text { width: 100%; max-width: 44rem; }

      /* Step labels: wrap on narrow screens instead of horizontal overflow */
      .ugc-step-label { flex-wrap: wrap !important; row-gap: 4px !important; }

      /* Creator Selection grid: 1-col on mobile, 56/44 on desktop */
      .ugccs-cols { grid-template-columns: 1fr !important; }
      @media (min-width: 1024px) { .ugccs-cols { grid-template-columns: minmax(0,56%) minmax(0,44%) !important; } }

      /* Monitoring grid: 1-col on mobile, 70/30 on desktop */
      .ugcmr-cols { grid-template-columns: 1fr !important; }
      @media (min-width: 1024px) { .ugcmr-cols { grid-template-columns: minmax(0,70%) minmax(0,30%) !important; } }

      /* Tracking URLs: metric cards 2×2 on mobile, 4×1 on wider screens */
      .ugctu-metrics { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; padding: 14px 14px 0 !important; gap: 8px !important; }
      @media (min-width: 520px) { .ugctu-metrics { grid-template-columns: repeat(4, 1fr) !important; } }
      /* Dashboard bar name truncation on very small */
      @media (max-width: 420px) { .ugctu-bar-name { width: 52px !important; } .ugctu-bar-val { width: 44px !important; } }

      /* Stat table rows: reduce padding + top-align on very small screens */
      @media (max-width: 420px) {
        .ugce-stat-row { padding: 1rem 1rem !important; align-items: flex-start !important; gap: 1rem !important; }
        .ugc-stat-num { font-size: clamp(1.5rem, 6vw, 2.7rem) !important; }
      }

      /* TikTok mockup: cap width on mobile so it doesn't dominate the viewport */
      @media (max-width: 767px) { .ugcfc-mockup-inner { max-width: 300px !important; } }

      /* Perfume phone mockup: slightly smaller on mobile */
      @media (max-width: 767px) { .ugcpc-phone { max-width: 320px !important; } }

      /* UGC section padding: tighter on mobile */
      @media (max-width: 639px) {
        .ugc-section-pad { padding-top: 3.5rem !important; padding-bottom: 3.5rem !important; }
      }
    `}</style>

    {/* ══ CINEMATIC HERO ═══════════════════════════════════════════════════════ */}
    <section
      ref={heroRef}
      id="ugc-hero"
      className="relative overflow-hidden"
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: '#020508' }}
    >
      {/* Background video */}
      <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', pointerEvents: 'none' }}>
        <source src="https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/tiktok_grid.mp4" type="video/mp4" />
      </video>

      {/* Layered overlays */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(108deg, hsl(0 0% 2% / 0.94) 0%, hsl(0 0% 2% / 0.62) 50%, hsl(0 0% 2% / 0.1) 100%)' }}/>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 52% 75% at 2% 55%, hsl(0 72% 45% / 0.13) 0%, transparent 65%)' }}/>
      <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.045, pointerEvents: 'none' }}>
        <filter id="ugc-g"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0" in="n"/></filter>
        <rect width="100%" height="100%" filter="url(#ugc-g)" fill="white"/>
      </svg>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, hsl(0 0% 0% / 0.055) 3px, hsl(0 0% 0% / 0.055) 4px)' }}/>

      {/* Content */}
      <div className="ugch-content relative z-10 flex items-center justify-between gap-12" style={{ minHeight: 'inherit', paddingTop: '2.5rem', paddingBottom: '3rem' }}>

        {/* Left: text */}
        <div className="ugch-text">

          {/* Badge */}
          <div className="ugch-r inline-flex items-center gap-2 mb-8" style={{ background: 'hsl(0 72% 48% / 0.1)', border: '1px solid hsl(0 72% 58% / 0.28)', borderRadius: 999, padding: '0.38rem 1rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'hsl(0 72% 62%)', boxShadow: '0 0 9px hsl(0 72% 62% / 0.85)', display: 'inline-block', flexShrink: 0 }}/>
            <span className="font-sans" style={{ fontSize: '0.64rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'hsl(0 72% 74%)' }}>UGC Content Creation</span>
          </div>

          {/* Headline */}
          <h1 className="ugch-r font-sans font-light" style={{ color: '#fff', fontSize: 'clamp(2rem, 5.8vw, 5rem)', lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.6rem' }}>
            Real creators.<br/>
            Real{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(0 72% 70%)' }}>results.</em>
          </h1>

          {/* Rule */}
          <div className="ugch-r" aria-hidden="true" style={{ width: '3.5rem', height: 1, background: 'hsl(0 72% 58% / 0.5)', marginBottom: '1.5rem' }}/>

          {/* Body */}
          <p className="ugch-r font-sans font-light" style={{ fontSize: 'clamp(0.9rem, 1.45vw, 1.06rem)', lineHeight: 1.82, color: '#F2F8FC', maxWidth: '30rem', marginBottom: '2.2rem' }}>
            We match your brand with creators who genuinely connect with your audience —
            producing content that feels native, converts at scale, and makes people stop scrolling.
          </p>

          {/* Platform pills */}
          <div className="ugch-r flex flex-wrap gap-2">
            {['TikTok', 'Instagram Reels', 'YouTube Shorts', 'LinkedIn'].map(p => (
              <span key={p} className="font-sans" style={{ fontSize: '0.68rem', letterSpacing: '0.05em', padding: '0.32rem 0.8rem', borderRadius: 999, border: '1px solid hsl(0 0% 100% / 0.11)', color: '#F2F8FC', background: 'hsl(0 0% 100% / 0.04)', backdropFilter: 'blur(8px)' }}>{p}</span>
            ))}
          </div>
        </div>

        {/* Right: glass metric cards (desktop only) */}
        <div className="hidden lg:flex flex-col gap-4 flex-shrink-0" style={{ width: 220 }}>
          {[
            { value: '10M+', label: 'Views Generated',  sub: 'across all platforms' },
            { value: '4.5×', label: 'Conversion Lift',  sub: 'vs. traditional ads'  },
            { value: '48h',  label: 'Turnaround',       sub: 'brief to delivered'   },
          ].map(({ value, label, sub }) => (
            <div key={label} className="ugch-r" style={{ background: 'hsl(0 0% 100% / 0.038)', backdropFilter: 'blur(22px)', border: '1px solid hsl(0 0% 100% / 0.09)', borderRadius: '1rem', padding: '1.15rem 1.45rem', boxShadow: '0 8px 36px hsl(0 0% 0% / 0.32)' }}>
              <p className="font-sans font-light" style={{ color: '#fff', fontSize: '2.1rem', letterSpacing: '-0.045em', lineHeight: 1, marginBottom: '0.35rem' }}>{value}</p>
              <p className="font-sans" style={{ fontSize: '0.7rem', letterSpacing: '0.06em', color: 'hsl(0 0% 78%)', marginBottom: '0.15rem' }}>{label}</p>
              <p className="font-sans" style={{ fontSize: '0.6rem', color: 'hsl(0 0% 38%)' }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker strip */}
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 38, background: 'hsl(0 72% 45% / 0.07)', backdropFilter: 'blur(12px)', borderTop: '1px solid hsl(0 72% 58% / 0.14)', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div ref={tickerRef} style={{ display: 'flex', gap: '2.8rem', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {[...UGC_TICKER, ...UGC_TICKER].map((t, i) => (
            <span key={i} className="font-sans" style={{ fontSize: '0.82rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'hsl(0 0% 72%)' }}>
              {t}<span style={{ color: 'hsl(0 72% 62%)', marginLeft: '1.4rem' }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </section>

    {/* ══ EDITORIAL INTRO ══════════════════════════════════════════════════════ */}
    <section
      ref={editRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8.5rem) 0' }}
    >
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: ['radial-gradient(ellipse 50% 55% at 18% 62%, hsl(0 72% 48% / 0.055) 0%, transparent 65%)', 'radial-gradient(ellipse 38% 38% at 82% 28%, hsl(0 55% 38% / 0.035) 0%, transparent 60%)'].join(', ') }}/>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.025 }}>
        <filter id="ugce-g"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0" in="n"/></filter>
        <rect width="100%" height="100%" filter="url(#ugce-g)" fill="white"/>
      </svg>

      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">

        {/* ── Manifesto + Stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start mb-24">

          {/* Manifesto */}
          <div>
            <p className="ugce-r font-sans uppercase mb-5" style={{ fontSize: '0.64rem', letterSpacing: '0.34em', color: 'hsl(0 72% 60%)' }}>Why UGC Works</p>
            <h2 className="ugce-r font-sans font-light" style={{ color: '#fff', fontSize: 'clamp(2rem, 3.8vw, 3.1rem)', lineHeight: 1.08, letterSpacing: '-0.033em', marginBottom: '1.5rem' }}>
              People trust{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(0 72% 70%)' }}>people</em>,<br/>not brands.
            </h2>
            <div className="ugce-r" aria-hidden="true" style={{ width: '2.5rem', height: 1, background: 'hsl(0 72% 58% / 0.4)', marginBottom: '1.5rem' }}/>
            <p className="ugce-r font-sans font-light" style={{ fontSize: 'clamp(0.88rem, 1.35vw, 1rem)', lineHeight: 1.92, color: '#F2F8FC', maxWidth: '32rem' }}>
              92% of consumers trust peer recommendations over brand advertising. At Weavy, we close that gap —
              pairing your brand with authentic creators whose content converts because it{' '}
              <span style={{ color: '#F2F8FC' }}>feels real</span>.
            </p>
          </div>

          {/* Stat table */}
          <div className="ugce-r" style={{ border: '1px solid hsl(0 0% 100% / 0.07)', borderRadius: '1.3rem', overflow: 'hidden' }}>
            {[
              { val: '78',  suffix: '%',  decimals: '0', desc: 'higher trust rate vs. branded content' },
              { val: '4.5', suffix: '×',  decimals: '1', desc: 'average conversion lift' },
              { val: '60',  suffix: '%',  decimals: '0', desc: 'lower cost than traditional production' },
            ].map(({ val, suffix, decimals, desc }, i, arr) => (
              <div key={val} className="ugce-stat-row" style={{ padding: '1.65rem 1.9rem', background: 'hsl(0 0% 100% / 0.022)', borderBottom: i < arr.length - 1 ? '1px solid hsl(0 0% 100% / 0.06)' : undefined, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span
                  className="font-sans font-light ugc-stat-num"
                  data-val={val}
                  data-suffix={suffix}
                  data-decimals={decimals}
                  style={{ fontSize: 'clamp(2rem, 3.2vw, 2.7rem)', letterSpacing: '-0.05em', color: 'hsl(0 72% 66%)', lineHeight: 1, minWidth: '4.2rem' }}
                >0{suffix}</span>
                <span className="font-sans font-light" style={{ fontSize: '0.84rem', lineHeight: 1.55, color: '#F2F8FC' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── What We Create ── */}
        <p className="ugce-r font-sans uppercase mb-8" style={{ fontSize: '0.64rem', letterSpacing: '0.34em', color: 'hsl(0 0% 32%)' }}>What We Create</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {UGC_CARDS.map(({ num, title, desc }) => (
            <div key={num} className="ugce-r" style={{ position: 'relative', overflow: 'hidden', background: 'hsl(0 0% 100% / 0.022)', border: '1px solid hsl(0 0% 100% / 0.07)', borderRadius: '1.25rem', padding: '2rem' }}>
              {/* Ghost number */}
              <span aria-hidden="true" className="font-sans font-light" style={{ position: 'absolute', top: '1.1rem', right: '1.3rem', fontSize: '3.8rem', lineHeight: 1, letterSpacing: '-0.06em', color: 'hsl(0 72% 52% / 0.07)', userSelect: 'none' }}>{num}</span>
              <div aria-hidden="true" style={{ width: '1.8rem', height: 2, background: 'hsl(0 72% 58% / 0.55)', borderRadius: 2, marginBottom: '1.25rem' }}/>
              <h3 className="font-sans font-light" style={{ color: '#fff', fontSize: 'clamp(0.95rem, 1.4vw, 1.08rem)', letterSpacing: '-0.01em', lineHeight: 1.28, marginBottom: '0.88rem' }}>{title}</h3>
              <p className="font-sans font-light" style={{ fontSize: '0.81rem', lineHeight: 1.78, color: '#F2F8FC' }}>{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
    </>
  )
}

// (removed unused breakpoint hook `useIsDesktop` — it was causing a TS6133 "declared but its value is never read" error)

// ─── UGC — Step 02: Creator Selection ────────────────────────────────────────

const UGC_INSIGHTS = [
  'Follower count across all platforms',
  'Engagement rate and average views',
  'Audience demographics and location',
  'Content style and brand alignment',
  'Past campaign performance and fees',
]

function UGCCreatorSelection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const textEls = el.querySelectorAll('.ugccs-text')
    const imgEls  = el.querySelectorAll('.ugccs-img')
    gsap.set(textEls, { opacity: 0, y: 40 })
    gsap.set(imgEls,  { opacity: 0, y: 28 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(imgEls,  { opacity: 1, y: 0, duration: 1.05 }, 0)
      tl.to(textEls, { opacity: 1, y: 0, duration: 1.0, stagger: 0.13 }, 0.15)
      obs.disconnect()
    }, { threshold: 0.07 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const stepLabel = (
    <div className="ugccs-text" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
      <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'hsl(195 80% 62%)', flexShrink: 0 }}>01</span>
      <div aria-hidden="true" style={{ width: '2rem', height: 1, background: 'hsl(195 80% 55% / 0.4)', flexShrink: 0 }}/>
      <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'hsl(195 80% 62%)' }}>UGC Creator Selection</span>
    </div>
  )

  const decorative = (
    <>
      <div aria-hidden="true" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 55% at 100% 45%, hsl(195 80% 50% / 0.045) 0%, transparent 65%), radial-gradient(ellipse 35% 40% at 0% 65%, hsl(195 70% 40% / 0.03) 0%, transparent 60%)' }}/>
      <svg aria-hidden="true" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.025 }}>
        <filter id="ugccs-gr"><feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="3" stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0" in="n"/></filter>
        <rect width="100%" height="100%" filter="url(#ugccs-gr)" fill="white"/>
      </svg>
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, hsl(195 80% 55% / 0.12), transparent)' }}/>
    </>
  )

  const imageCard = (extraClass = '') => (
    <div
      className={`ugccs-img ${extraClass}`}
      style={{
        position: 'relative',
        borderRadius: '1.4rem',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px hsl(195 80% 55% / 0.1), 0 32px 72px -16px hsl(0 0% 0% / 0.75), 0 0 48px -12px hsl(195 80% 50% / 0.08)',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2, borderRadius: '1.4rem', pointerEvents: 'none', boxShadow: 'inset 0 0 0 1px hsl(0 0% 100% / 0.07)' }}/>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, hsl(0 0% 0% / 0.32) 100%)' }}/>
      <img
        loading="lazy"
        decoding="async"
        src="/brand_assets/Count.png"
        alt="UGC creator metrics and analytics"
        style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'contain' }}
      />
    </div>
  )

  const bodyText = (
    <>
      <div className="ugccs-text" aria-hidden="true" style={{ width: '2.5rem', height: 1, background: 'hsl(195 80% 55% / 0.38)', marginBottom: '1.6rem' }}/>
      <p className="ugccs-text font-sans font-light w-full max-w-none text-left text-base leading-8 sm:text-lg" style={{ color: '#F2F8FC', marginBottom: '1.2rem' }}>
        Every creator we recommend is validated by their numbers. We look beyond follower count
        and dig into engagement rate, average views, and audience quality — so your budget
        goes to creators who actually perform.
      </p>
      <p className="ugccs-text font-sans font-light w-full max-w-none text-left text-base leading-8 sm:text-lg" style={{ color: '#F2F8FC', marginBottom: '2rem' }}>
        No guessing, no wasted spend. We present the metrics that matter so you can
        select with confidence and brief creators who are built to deliver.
      </p>
      <ul className="ugccs-text" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        {UGC_INSIGHTS.map((item) => (
          <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span aria-hidden="true" style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'hsl(195 80% 58%)', boxShadow: '0 0 6px hsl(195 80% 58% / 0.6)', flexShrink: 0 }}/>
            <span className="font-sans font-light" style={{ fontSize: '0.88rem', color: '#F2F8FC', letterSpacing: '0.01em' }}>{item}</span>
          </li>
        ))}
      </ul>
    </>
  )

  return (
    <div ref={ref}>

      {/* ─── DESKTOP layout (≥1024px): image-left, text-right ─────────────────── */}
      <section className="hidden lg:block" style={{ position: 'relative', background: '#010709', padding: 'clamp(5rem, 10vw, 9rem) 0', width: '100%', overflow: 'hidden' }}>
        {decorative}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '80rem', margin: '0 auto', padding: '0 2.5rem', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', gap: '5rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              {imageCard()}
            </div>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              {stepLabel}
              <h2
                className="ugccs-text font-sans font-light"
                style={{ color: '#fff', fontSize: 'clamp(2rem, 2.8vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.035em', marginBottom: '1.6rem' }}
              >
                Creators chosen by{' '}
                <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(195 80% 72%)' }}>
                  data, not guesswork.
                </em>
              </h2>
              {bodyText}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MOBILE / TABLET layout (<1024px): fully stacked column ───────────── */}
      <section className="block lg:hidden w-full overflow-x-hidden px-6 py-16 sm:px-8" style={{ position: 'relative', background: '#010709' }}>
        {decorative}
        <div className="mx-auto flex w-full max-w-[680px] flex-col items-start gap-8" style={{ position: 'relative', zIndex: 10 }}>

          {/* 1. Section label */}
          <div className="ugccs-text w-full flex items-center gap-3 flex-wrap">
            <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'hsl(195 80% 62%)' }}>01</span>
            <div aria-hidden="true" style={{ width: '2rem', height: 1, background: 'hsl(195 80% 55% / 0.4)' }}/>
            <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'hsl(195 80% 62%)' }}>UGC Creator Selection</span>
          </div>

          {/* 2. Heading */}
          <h2
            className="ugccs-text font-sans font-light w-full text-left text-3xl leading-[1.06] text-white sm:text-4xl md:text-5xl"
            style={{ letterSpacing: '-0.02em', margin: '0 0 0.5rem 0' }}
          >
            Creators chosen by{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(195 80% 72%)' }}>
              data, not guesswork.
            </em>
          </h2>

          {/* 3. Divider (bigger, with breathing room) */}
          <div className="ugccs-text h-px w-28 bg-sky-400/70 mb-3" />

          {/* 4. Paragraphs */}
          <div className="ugccs-text w-full space-y-5">
            <p className="w-full max-w-none text-left text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              Every creator we recommend is validated by their numbers. We look beyond follower count
              and dig into engagement rate, average views, and audience quality — so your budget
              goes to creators who actually perform.
            </p>
            <p className="w-full max-w-none text-left text-base leading-7 sm:text-lg sm:leading-8" style={{ color: '#F2F8FC' }}>
              No guessing, no wasted spend. We present the metrics that matter so you can
              select with confidence and brief creators who are built to deliver.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {UGC_INSIGHTS.map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span aria-hidden="true" style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'hsl(195 80% 58%)', boxShadow: '0 0 6px hsl(195 80% 58% / 0.6)', flexShrink: 0 }}/>
                  <span className="font-sans font-light" style={{ fontSize: '0.88rem', color: '#F2F8FC', letterSpacing: '0.01em' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Image — large, prominent, at the bottom (centered with max width) */}
          <div className="w-full mt-3 flex justify-center">
            <div className="ugccs-img w-full" style={{ maxWidth: '640px', borderRadius: '1.75rem', overflow: 'hidden', boxShadow: '0 0 0 1px hsl(195 80% 55% / 0.12), 0 24px 60px -12px hsl(0 0% 0% / 0.7), 0 0 40px -10px hsl(195 80% 50% / 0.07)' }}>
              <img
                loading="lazy"
                decoding="async"
                src="/brand_assets/Count.png"
                alt="UGC creator metrics and analytics"
                className="w-full h-auto object-cover object-center"
                style={{ display: 'block' }}
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}

// ─── UGC — Step 01: Find Your Creators ───────────────────────────────────────

function UGCFindCreators() {
  const ref      = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const textEls  = el.querySelectorAll('.ugcfc-text')
    const videoEl  = el.querySelector('.ugcfc-video')
    gsap.set(textEls, { opacity: 0, y: 40 })
    gsap.set(videoEl, { opacity: 0, y: 28 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(textEls, { opacity: 1, y: 0, duration: 1.0, stagger: 0.14 }, 0)
      tl.to(videoEl, { opacity: 1, y: 0, duration: 1.1 }, 0.18)
      obs.disconnect()
    }, { threshold: 0.07 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 9rem) 0' }}
    >
      {/* Subtle ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 48% 55% at 0% 50%, hsl(195 80% 50% / 0.045) 0%, transparent 65%)',
          'radial-gradient(ellipse 35% 40% at 100% 60%, hsl(195 70% 40% / 0.03) 0%, transparent 60%)',
        ].join(', '),
      }}/>

      {/* Fine grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.025 }}>
        <filter id="ugcfc-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#ugcfc-gr)" fill="white"/>
      </svg>

      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── LEFT: text ── */}
          <div>

            {/* Step label */}
            <div className="ugcfc-text ugc-step-label flex items-center gap-3 mb-8">
              <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'hsl(195 80% 62%)', flexShrink: 0 }}>02</span>
              <div style={{ width: '2rem', height: 1, background: 'hsl(195 80% 55% / 0.4)', flexShrink: 0 }} aria-hidden="true"/>
              <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'hsl(195 80% 62%)' }}>Find Your UGC Creators</span>
            </div>

            {/* Headline */}
            <h2
              className="ugcfc-text font-sans font-light"
              style={{
                color: '#ffffff',
                fontSize: 'clamp(1.9rem, 3.6vw, 3rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                marginBottom: '1.8rem',
              }}
            >
              We find creators{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(195 80% 72%)' }}>
                built for your brand.
              </em>
            </h2>

            {/* Divider */}
            <div
              className="ugcfc-text"
              aria-hidden="true"
              style={{ width: '2.5rem', height: 1, background: 'hsl(195 80% 55% / 0.38)', marginBottom: '1.8rem' }}
            />

            {/* Paragraph 1 */}
            <p
              className="ugcfc-text font-sans font-light"
              style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1.02rem)', lineHeight: 1.9, color: '#F2F8FC', marginBottom: '1.4rem' }}
            >
              We identify creators who match your brand style, audience, and campaign goals.
              Instead of choosing random influencers, we focus on authentic faces who can naturally
              represent your product, build trust, and create content that feels real to your customers.
            </p>

            {/* Paragraph 2 */}
            <p
              className="ugcfc-text font-sans font-light"
              style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1.02rem)', lineHeight: 1.9, color: '#F2F8FC' }}
            >
              From lifestyle fit to on-camera confidence, every creator is selected with intention —
              so your UGC campaign feels personal, relatable, and built for performance.
            </p>
          </div>

          {/* ── RIGHT: TikTok UI mockup (no phone shell) ── */}
          <div className="ugcfc-video flex justify-center lg:justify-end">
            <div className="ugcfc-mockup-inner" style={{ width: '100%', maxWidth: '380px' }}>

              {/* 9:16 screen */}
              <div style={{
                position: 'relative',
                paddingBottom: '177.78%',
                borderRadius: '1.4rem',
                overflow: 'hidden',
                background: '#000',
                boxShadow: [
                  '0 0 0 1px hsl(0 0% 100% / 0.08)',
                  '0 40px 90px -20px hsl(0 0% 0% / 0.85)',
                  '0 0 60px -15px hsl(195 80% 50% / 0.1)',
                ].join(', '),
              }}>

                {/* Video */}
                <video
                  ref={videoRef}
                  autoPlay muted loop playsInline preload="metadata"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                >
                  <source src="https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/Cream_velvet.mp4" type="video/mp4" />
                </video>

                {/* Sound toggle */}
                <button
                  onClick={toggleMute}
                  aria-label={muted ? 'Unmute video' : 'Mute video'}
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    width: 30, height: 30,
                    borderRadius: '50%',
                    background: 'hsl(0 0% 0% / 0.55)',
                    border: '1px solid hsl(0 0% 100% / 0.18)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'hsl(0 0% 85%)',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'background 0.2s ease, transform 0.15s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'hsl(0 0% 0% / 0.8)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'hsl(0 0% 0% / 0.55)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                >
                  <IgVolume muted={muted} />
                </button>

                {/* Bottom scrim */}
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, hsl(0 0% 0% / 0.75) 0%, transparent 48%)', zIndex: 1 }}/>

                {/* TikTok UI */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '14px 10px 14px 12px' }}>

                  {/* Top bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '18px' }}>
                      {['Following', 'For You'].map((t, i) => (
                        <span key={t} className="font-sans" style={{ fontSize: '13px', fontWeight: i === 1 ? 700 : 400, color: i === 1 ? '#fff' : 'hsl(0 0% 60%)', letterSpacing: '0.01em' }}>{t}</span>
                      ))}
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
                  </div>

                  {/* Bottom row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>

                    {/* Left: user info */}
                    <div style={{ maxWidth: '62%' }}>
                      <p className="font-sans" style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '5px' }}>@weavy.studio</p>
                      <p className="font-sans" style={{ fontSize: '11px', color: 'hsl(0 0% 82%)', lineHeight: 1.45, marginBottom: '10px' }}>
                        Real creators, real results ✨ #UGC #ContentCreation #BrandMarketing
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                        <p className="font-sans" style={{ fontSize: '10px', color: 'hsl(0 0% 72%)' }}>Original Sound — weavy.studio</p>
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>

                      {/* Avatar + follow */}
                      <div style={{ position: 'relative', marginBottom: '6px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(195 80% 50%), hsl(280 65% 60%))', border: '2px solid #fff', overflow: 'hidden' }}>
                          <div style={{ width: '100%', height: '100%', background: 'hsl(195 50% 18%)' }}/>
                        </div>
                        <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: '#fe2c55', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#fff', fontSize: '10px', lineHeight: 1, fontWeight: 700 }}>+</span>
                        </div>
                      </div>

                      {/* Like */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fe2c55" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        <span className="font-sans" style={{ fontSize: '10px', color: '#fff', fontWeight: 600 }}>1M</span>
                      </div>

                      {/* Comment */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span className="font-sans" style={{ fontSize: '10px', color: '#fff', fontWeight: 600 }}>24.8K</span>
                      </div>

                      {/* Bookmark */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        <span className="font-sans" style={{ fontSize: '10px', color: '#fff', fontWeight: 600 }}>18.2K</span>
                      </div>

                      {/* Share */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        <span className="font-sans" style={{ fontSize: '10px', color: '#fff', fontWeight: 600 }}>9.4K</span>
                      </div>

                      {/* Disc */}
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a1a1a, #3a3a3a)', border: '3px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#fff' }}/>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'hsl(0 0% 100% / 0.18)', zIndex: 3 }}>
                  <div style={{ width: '38%', height: '100%', background: '#fff' }}/>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── UGC — Step 03: Content Monitoring & Reporting ───────────────────────────

const UGC_REPORT_POINTS = [
  'Download-ready images and videos',
  'Monthly campaign report',
  'Instagram Stories, TikTok, and YouTube tracking',
  'Performance metrics: impressions, clicks, leads, and sales',
]

function UGCMonitoringReporting() {
  const ref = useRef<HTMLElement>(null)

  // ── Inject bulletproof layout CSS directly into <head> ──────────────────────
  useEffect(() => {
    const id = 'ugcmr-layout-css'
    const existing = document.getElementById(id)
    if (existing) existing.remove()
    const tag = document.createElement('style')
    tag.id = id
    tag.textContent = `
      .ugcmr-layout-section { overflow-x: hidden !important; }
      .ugcmr-layout-inner {
        width: 100% !important;
        max-width: 80rem !important;
        margin-left: auto !important;
        margin-right: auto !important;
        padding-left: 1.5rem !important;
        padding-right: 1.5rem !important;
        box-sizing: border-box !important;
      }
      .ugcmr-layout-flex {
        display: flex !important;
        flex-direction: column !important;
        gap: 2.5rem !important;
        width: 100% !important;
        align-items: stretch !important;
      }
      .ugcmr-layout-text {
        order: 1 !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        box-sizing: border-box !important;
      }
      .ugcmr-layout-text h2,
      .ugcmr-layout-text p,
      .ugcmr-layout-text ul {
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        white-space: normal !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
      }
      .ugcmr-layout-image {
        order: 2 !important;
        width: 100% !important;
        min-width: 0 !important;
        display: flex !important;
        justify-content: center !important;
        box-sizing: border-box !important;
      }
      @media (min-width: 1024px) {
        .ugcmr-layout-flex {
          flex-direction: row !important;
          gap: 5rem !important;
          align-items: center !important;
        }
        .ugcmr-layout-text {
          order: 2 !important;
          flex: 1 1 0 !important;
          max-width: 50% !important;
        }
        .ugcmr-layout-image {
          order: 1 !important;
          flex: 1 1 0 !important;
          max-width: 50% !important;
          justify-content: flex-end !important;
        }
      }
    `
    document.head.appendChild(tag)
    return () => { document.getElementById(id)?.remove() }
  }, [])

  // ── GSAP scroll animation ────────────────────────────────────────────────────
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const textEls = el.querySelectorAll('.ugcmr-text')
    const imgEl   = el.querySelector('.ugcmr-img')
    gsap.set(textEls, { opacity: 0, y: 40 })
    gsap.set(imgEl,   { opacity: 0, y: 28 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(imgEl,   { opacity: 1, y: 0, duration: 1.05 }, 0)
      tl.to(textEls, { opacity: 1, y: 0, duration: 1.0, stagger: 0.13 }, 0.15)
      obs.disconnect()
    }, { threshold: 0.07 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="ugcmr-layout-section"
      style={{ position: 'relative', background: '#010709', padding: 'clamp(5rem, 10vw, 9rem) 0' }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 48% 55% at 0% 50%, hsl(195 80% 50% / 0.042) 0%, transparent 65%), radial-gradient(ellipse 35% 40% at 100% 60%, hsl(195 70% 40% / 0.028) 0%, transparent 60%)' }}/>
      {/* Grain */}
      <svg aria-hidden="true" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.025 }}>
        <filter id="ugcmr-gr"><feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="3" stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0" in="n"/></filter>
        <rect width="100%" height="100%" filter="url(#ugcmr-gr)" fill="white"/>
      </svg>
      {/* Top separator */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, hsl(195 80% 55% / 0.12), transparent)' }}/>

      {/* Content */}
      <div className="ugcmr-layout-inner" style={{ position: 'relative', zIndex: 10 }}>
        <div className="ugcmr-layout-flex">

          {/* TEXT — first in DOM = top on mobile, order-2 on desktop (right) */}
          <div className="ugcmr-layout-text">
            <div className="ugcmr-text" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
              <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'hsl(195 80% 62%)', flexShrink: 0 }}>03</span>
              <div aria-hidden="true" style={{ width: '2rem', height: 1, background: 'hsl(195 80% 55% / 0.4)', flexShrink: 0 }}/>
              <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'hsl(195 80% 62%)' }}>Content Monitoring & Reporting</span>
            </div>
            <h2
              className="ugcmr-text font-sans font-light"
              style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.035em', marginBottom: '1.6rem' }}
            >
              Every result,{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(195 80% 72%)' }}>
                clearly reported.
              </em>
            </h2>
            <div className="ugcmr-text" aria-hidden="true" style={{ width: '2.5rem', height: 1, background: 'hsl(195 80% 55% / 0.38)', marginBottom: '1.6rem' }}/>
            <p className="ugcmr-text font-sans font-light" style={{ fontSize: '1rem', lineHeight: 2, color: '#F2F8FC', marginBottom: '1.2rem' }}>
              During the campaign, we track and collect every piece of published UGC across Instagram,
              including Stories, TikTok, and YouTube, so your content stays organised and easy to review.
            </p>
            <p className="ugcmr-text font-sans font-light" style={{ fontSize: '1rem', lineHeight: 2, color: '#F2F8FC', marginBottom: '2rem' }}>
              At the end of each month, we provide clear reporting with downloadable media assets,
              campaign performance insights, and key results such as impressions, clicks, leads, and sales.
            </p>
            <ul className="ugcmr-text" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {UGC_REPORT_POINTS.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span aria-hidden="true" style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'hsl(195 80% 58%)', boxShadow: '0 0 6px hsl(195 80% 58% / 0.6)', flexShrink: 0 }}/>
                  <span className="font-sans font-light" style={{ fontSize: '0.88rem', color: '#F2F8FC', letterSpacing: '0.01em' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IMAGE — second in DOM = bottom on mobile, order-1 on desktop (left) */}
          <div className="ugcmr-layout-image">
            <div
              className="ugcmr-img"
              style={{
                position: 'relative',
                borderRadius: '1.4rem',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '380px',
                boxShadow: '0 0 0 1px hsl(195 80% 55% / 0.1), 0 32px 72px -16px hsl(0 0% 0% / 0.75), 0 0 48px -12px hsl(195 80% 50% / 0.08)',
              }}
            >
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2, borderRadius: '1.4rem', pointerEvents: 'none', boxShadow: 'inset 0 0 0 1px hsl(0 0% 100% / 0.07)' }}/>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, hsl(0 0% 0% / 0.32) 100%)' }}/>
              <img loading="lazy" decoding="async" src="/brand_assets/tik_youtube_images.png" alt="Content monitoring and reporting" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'contain' }}/>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── UGC — Campaign Tracking & Performance Visibility (Section 04) ─────────

const UGC_TRACKING_FEATURES = [
  'Unique tracking links for each creator',
  'Performance visibility by platform and placement',
  'Track clicks, enquiries, leads, and sales',
  'Compare creator and content performance',
  'Clear campaign reports for smarter decisions',
]

const UGCTU_METRICS = [
  { label: 'Clicks',    num: 24.6, suffix: 'K',  prefix: '',  delta: '+18%' },
  { label: 'Leads',     num: 1840, suffix: '',    prefix: '',  delta: '+22%' },
  { label: 'Enquiries', num: 312,  suffix: '',    prefix: '',  delta: '+9%'  },
  { label: 'Sales',     num: 8.4,  suffix: 'K',  prefix: '£', delta: '+31%' },
]

const UGCTU_BARS = [
  { name: '@creator_a', pct: 82, val: '9.8K clicks' },
  { name: '@creator_b', pct: 64, val: '7.6K clicks' },
  { name: '@creator_c', pct: 45, val: '5.4K clicks' },
]

const UGCTU_ROWS = [
  { platform: 'Instagram Reel', creator: '@creator_a', status: 'Active',   color: 'hsl(160 60% 52%)' },
  { platform: 'TikTok Video',   creator: '@creator_b', status: 'Active',   color: 'hsl(160 60% 52%)' },
  { platform: 'Instagram Story',creator: '@creator_c', status: 'Complete', color: 'hsl(0 0% 38%)'    },
]

function UGCTrackingUrls() {
  const ref       = useRef<HTMLElement>(null)
  const chartRef  = useRef<SVGPathElement>(null)
  const areaRef   = useRef<SVGPathElement>(null)
  const numRefs   = useRef<(HTMLParagraphElement | null)[]>([])
  const barRefs   = useRef<(HTMLDivElement | null)[]>([])
  const rowRefs   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const textEls = el.querySelectorAll('.ugctu-text')
    const featEls = el.querySelectorAll('.ugctu-feat')
    const dashEl  = el.querySelector('.ugctu-dash')
    const dotEl   = el.querySelector<HTMLElement>('.ugctu-dot')
    const cardEls = el.querySelectorAll('.ugctu-card')

    // Initial states
    gsap.set(textEls, { opacity: 0, y: 36 })
    gsap.set(featEls, { opacity: 0, x: -14 })
    gsap.set(dashEl,  { opacity: 0, y: 28 })
    gsap.set(cardEls, { opacity: 0, y: 14 })
    numRefs.current.forEach(n => { if (n) n.textContent = '—' })
    barRefs.current.forEach(b => { if (b) gsap.set(b, { width: '0%' }) })
    rowRefs.current.forEach(r => { if (r) gsap.set(r, { opacity: 0, x: 14 }) })

    // Line chart: measure and hide
    const path = chartRef.current
    if (path) {
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    }
    if (areaRef.current) gsap.set(areaRef.current, { opacity: 0 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // ── Section entry ──
      tl.to(textEls, { opacity: 1, y: 0, duration: 1.0, stagger: 0.13 }, 0)
      tl.to(featEls, { opacity: 1, x: 0, duration: 0.6, stagger: 0.08 }, 0.45)
      tl.to(dashEl,  { opacity: 1, y: 0, duration: 1.1 }, 0.15)
      tl.to(cardEls, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, 0.4)

      // ── Metric counters ──
      UGCTU_METRICS.forEach(({ num, suffix, prefix }, i) => {
        const span = numRefs.current[i]
        if (!span) return
        const proxy = { val: 0 }
        tl.to(proxy, {
          val: num,
          duration: 1.7,
          ease: 'power2.out',
          onUpdate() {
            const v = proxy.val
            span.textContent = suffix === 'K'
              ? prefix + v.toFixed(1) + 'K'
              : num > 999
                ? prefix + Math.round(v).toLocaleString()
                : prefix + Math.round(v).toString()
          },
        }, 0.52 + i * 0.1)
      })

      // ── Line chart path draw ──
      if (path) {
        tl.to(path, { strokeDashoffset: 0, duration: 1.9, ease: 'power2.inOut' }, 0.7)
      }
      if (areaRef.current) {
        tl.to(areaRef.current, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.95)
      }

      // ── Bar fills grow ──
      barRefs.current.forEach((bar, i) => {
        if (!bar) return
        tl.to(bar, { width: UGCTU_BARS[i].pct + '%', duration: 1.3, ease: 'power2.out' }, 1.0 + i * 0.15)
      })

      // ── Placement rows slide in ──
      rowRefs.current.forEach((row, i) => {
        if (!row) return
        tl.to(row, { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' }, 1.25 + i * 0.11)
      })

      // ── Live dot — continuous pulse ──
      if (dotEl) {
        gsap.to(dotEl, {
          scale: 1.6, opacity: 0.4,
          duration: 0.95, repeat: -1, yoyo: true, ease: 'sine.inOut',
        })
      }

      obs.disconnect()
    }, { threshold: 0.07 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 9rem) 0' }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 55% 60% at 90% 50%, hsl(160 70% 45% / 0.045) 0%, transparent 65%)',
          'radial-gradient(ellipse 38% 42% at 10% 55%, hsl(195 80% 50% / 0.03) 0%, transparent 60%)',
        ].join(', '),
      }}/>

      {/* Grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.022 }}>
        <filter id="ugctu-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#ugctu-gr)" fill="white"/>
      </svg>

      {/* Top separator */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, hsl(160 65% 50% / 0.14), transparent)' }}/>

      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── LEFT: text ── */}
          <div>
            <div className="ugctu-text ugc-step-label flex items-center gap-3 mb-6">
              <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'hsl(160 65% 55%)', flexShrink: 0 }}>04</span>
              <div aria-hidden="true" style={{ width: '2rem', height: 1, background: 'hsl(160 65% 50% / 0.4)', flexShrink: 0 }}/>
              <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'hsl(160 65% 55%)' }}>Tracking URLs</span>
            </div>

            <p className="ugctu-text font-sans" style={{ fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'hsl(160 60% 50% / 0.65)', marginBottom: '1.4rem' }}>
              Performance Visibility
            </p>

            <h2
              className="ugctu-text font-sans font-light"
              style={{ color: '#fff', fontSize: 'clamp(1.9rem, 3.6vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.035em', marginBottom: '1.8rem' }}
            >
              Know exactly which creator,{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(160 65% 65%)' }}>
                platform,
              </em>{' '}
              and placement is driving results.
            </h2>

            <div className="ugctu-text" aria-hidden="true" style={{ width: '2.5rem', height: 1, background: 'hsl(160 65% 50% / 0.38)', marginBottom: '1.8rem' }}/>

            <p className="ugctu-text font-sans font-light" style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1.02rem)', lineHeight: 1.9, color: '#F2F8FC', marginBottom: '1.2rem' }}>
              Every campaign can be measured with clear tracking links and structured reporting,
              so you are not relying on guesswork. Each creator, post, story, reel, or video can
              be monitored to understand where the strongest results are coming from.
            </p>

            <p className="ugctu-text font-sans font-light" style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1.02rem)', lineHeight: 1.9, color: '#F2F8FC', marginBottom: '2.4rem' }}>
              From impressions and clicks to leads, enquiries, and sales, the reporting view
              helps you see what is working, what needs improving, and where to focus the next campaign.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {UGC_TRACKING_FEATURES.map(item => (
                <li key={item} className="ugctu-feat" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span aria-hidden="true" style={{ width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0, background: 'hsl(160 65% 52%)', boxShadow: '0 0 6px hsl(160 65% 50% / 0.55)' }}/>
                  <span className="font-sans font-light" style={{ fontSize: '0.88rem', color: '#F2F8FC', letterSpacing: '0.01em' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── RIGHT: animated analytics dashboard ── */}
          <div className="ugctu-dash flex justify-center lg:justify-end">
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                borderRadius: '1.25rem',
                background: 'hsl(210 18% 7%)',
                border: '1px solid hsl(0 0% 100% / 0.08)',
                boxShadow: [
                  '0 0 0 1px hsl(160 65% 50% / 0.06)',
                  '0 40px 90px -20px hsl(0 0% 0% / 0.7)',
                  '0 0 60px -20px hsl(160 65% 45% / 0.08)',
                ].join(', '),
                overflow: 'hidden',
              }}
            >

              {/* Header */}
              <div style={{ padding: '13px 18px 11px', borderBottom: '1px solid hsl(0 0% 100% / 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    className="ugctu-dot"
                    style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(160 65% 52%)', boxShadow: '0 0 6px hsl(160 65% 52% / 0.7)', transformOrigin: 'center' }}
                  />
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'hsl(0 0% 78%)', letterSpacing: '-0.01em' }}>Campaign Analytics</span>
                </div>
                <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.6rem', color: 'hsl(0 0% 32%)', letterSpacing: '0.02em' }}>Last 30 days</span>
              </div>

              {/* Metric cards — numbers count up via ref */}
              <div className="ugctu-metrics">
                {UGCTU_METRICS.map(({ label, delta }, i) => (
                  <div
                    key={label}
                    className="ugctu-card"
                    style={{ background: 'hsl(210 18% 9%)', border: '1px solid hsl(0 0% 100% / 0.07)', borderRadius: '0.6rem', padding: '10px 10px 8px' }}
                  >
                    <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.52rem', color: 'hsl(0 0% 35%)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '5px' }}>{label}</p>
                    <p
                      ref={el => { numRefs.current[i] = el }}
                      style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: '0.85rem', color: 'hsl(0 0% 90%)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '5px' }}
                    >—</p>
                    <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: '0.52rem', color: 'hsl(160 60% 52%)' }}>{delta}</p>
                  </div>
                ))}
              </div>

              {/* Line chart — path draws in via stroke-dashoffset */}
              <div style={{ padding: '14px 18px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: '0.6rem', color: 'hsl(0 0% 38%)', letterSpacing: '0.02em' }}>Click performance</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'].map(w => (
                      <span key={w} style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.52rem', color: 'hsl(0 0% 28%)' }}>{w}</span>
                    ))}
                  </div>
                </div>
                <svg viewBox="0 0 380 72" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden="true">
                  <defs>
                    <linearGradient id="ugctu-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(160 65% 52%)" stopOpacity="0.18"/>
                      <stop offset="100%" stopColor="hsl(160 65% 52%)" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* Area fill — fades in after line draws */}
                  <path
                    ref={areaRef}
                    d="M0,62 C40,58 60,50 95,42 C130,34 140,30 175,22 C210,14 225,24 260,16 C295,8 320,12 355,6 L380,4 L380,72 L0,72 Z"
                    fill="url(#ugctu-area)"
                  />
                  {/* Line — draws left to right */}
                  <path
                    ref={chartRef}
                    d="M0,62 C40,58 60,50 95,42 C130,34 140,30 175,22 C210,14 225,24 260,16 C295,8 320,12 355,6 L380,4"
                    fill="none"
                    stroke="hsl(160 65% 52%)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Dots */}
                  {([[0,62],[95,42],[190,18],[285,14],[380,4]] as [number,number][]).map(([x,y], i) => (
                    <circle key={i} cx={x} cy={y} r="2.8" fill="hsl(160 65% 52%)" stroke="hsl(210 18% 7%)" strokeWidth="1.5"/>
                  ))}
                </svg>
              </div>

              {/* Bar chart — fills grow from left */}
              <div style={{ padding: '12px 18px 0' }}>
                <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: '0.6rem', color: 'hsl(0 0% 38%)', letterSpacing: '0.02em', display: 'block', marginBottom: '10px' }}>Creator performance</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {UGCTU_BARS.map(({ name, val }, i) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="ugctu-bar-name" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.58rem', color: 'hsl(0 0% 40%)', width: '70px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                      <div style={{ flex: 1, height: '4px', background: 'hsl(0 0% 100% / 0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div
                          ref={el => { barRefs.current[i] = el }}
                          style={{ height: '100%', width: '0%', background: 'linear-gradient(to right, hsl(160 65% 38%), hsl(160 65% 56%))', borderRadius: '2px' }}
                        />
                      </div>
                      <span className="ugctu-bar-val" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.54rem', color: 'hsl(0 0% 34%)', width: '56px', textAlign: 'right', flexShrink: 0 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracked placements — rows slide in */}
              <div style={{ padding: '14px 14px 16px' }}>
                <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: '0.6rem', color: 'hsl(0 0% 38%)', letterSpacing: '0.02em', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>Tracked placements</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {UGCTU_ROWS.map(({ platform, creator, status, color }, i) => (
                    <div
                      key={platform + creator}
                      ref={el => { rowRefs.current[i] = el }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'hsl(210 18% 9%)',
                        border: '1px solid hsl(0 0% 100% / 0.05)',
                        borderRadius: '0.5rem',
                      }}
                    >
                      <div>
                        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: '0.64rem', color: 'hsl(0 0% 72%)', letterSpacing: '-0.01em', marginBottom: '2px' }}>{platform}</p>
                        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.56rem', color: 'hsl(0 0% 34%)' }}>{creator}</p>
                      </div>
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: '0.54rem', color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── UGC — Perfume Campaign (Section 5) ──────────────────────────────────────

const UGC_PERFUME_FEATURES = [
  'Creator-led unboxing flow',
  'Natural product reaction and reveal',
  'Premium fragrance presentation',
  'Instagram-style social proof interface',
  'Built for TikTok, Reels, Shorts, and paid ads',
]

// Instagram action icon SVGs
function IgHeart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}
function IgComment() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}
function IgShare() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}
function IgSave() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  )
}
function IgVolume({ muted }: { muted: boolean }) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  )
}

function UGCPerfumeCampaign() {
  const ref      = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  // Toggle sound
  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const textEls    = el.querySelectorAll('.ugcpc-text')
    const mockupEl   = el.querySelector('.ugcpc-mockup')
    const featureEls = el.querySelectorAll('.ugcpc-feat')
    gsap.set(textEls,    { opacity: 0, y: 36 })
    gsap.set(mockupEl,   { opacity: 0, y: 24 })
    gsap.set(featureEls, { opacity: 0, x: -16 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(mockupEl,   { opacity: 1, y: 0, duration: 1.1 }, 0)
      tl.to(textEls,    { opacity: 1, y: 0, duration: 1.0, stagger: 0.13 }, 0.18)
      tl.to(featureEls, { opacity: 1, x: 0, duration: 0.6, stagger: 0.09 }, 0.58)
      obs.disconnect()
    }, { threshold: 0.07 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 9rem) 0' }}
    >
      {/* Warm gold ambient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 55% 60% at 16% 50%, hsl(38 65% 48% / 0.05) 0%, transparent 65%)',
            'radial-gradient(ellipse 38% 42% at 88% 48%, hsl(38 55% 38% / 0.03) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      {/* Fine grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.022 }}>
        <filter id="ugcpc-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#ugcpc-gr)" fill="white"/>
      </svg>

      {/* Top rule */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(to right, transparent, hsl(0 0% 100% / 0.06) 30%, hsl(0 0% 100% / 0.06) 70%, transparent)',
        }}
      />

      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── LEFT: Instagram mockup ── */}
          <div className="ugcpc-mockup flex justify-center lg:justify-start">

            {/* Phone shell */}
            <div
              className="ugcpc-phone"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '40px',
                background: 'hsl(0 0% 4%)',
                border: '1px solid hsl(0 0% 100% / 0.11)',
                boxShadow: [
                  '0 0 0 1px hsl(38 55% 48% / 0.08)',
                  '0 48px 100px hsl(0 0% 0% / 0.65)',
                  '0 12px 32px hsl(0 0% 0% / 0.4)',
                  'inset 0 1px 0 hsl(0 0% 100% / 0.06)',
                ].join(', '),
                overflow: 'hidden',
              }}
            >

              {/* ── Top status bar ── */}
              <div
                style={{
                  padding: '12px 18px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'hsl(0 0% 5%)',
                  borderBottom: '1px solid hsl(0 0% 100% / 0.06)',
                }}
              >
                {/* Left: avatar + name + username */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Avatar ring — larger for bigger mockup */}
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, hsl(38 85% 65%), hsl(30 80% 50%), hsl(20 70% 42%))',
                      padding: '2.5px',
                      boxShadow: '0 0 0 1px hsl(38 70% 55% / 0.35)',
                    }}
                  >
                    <div
                      style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        background: 'hsl(0 0% 7%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <span style={{
                        fontSize: '0.82rem',
                        color: 'hsl(38 75% 65%)',
                        fontWeight: 500,
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontStyle: 'italic',
                        letterSpacing: '-0.02em',
                      }}>A</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {/* Display name — bold brand name */}
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: '0.78rem', color: 'hsl(0 0% 94%)', letterSpacing: '-0.015em' }}>
                      A'llure
                    </span>
                    {/* Username + sponsored */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.6rem', color: 'hsl(0 0% 45%)', letterSpacing: '0.01em' }}>@allure.ugc</span>
                      <span style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'hsl(0 0% 30%)', display: 'inline-block' }} />
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.6rem', color: 'hsl(0 0% 38%)', letterSpacing: '0.02em' }}>Sponsored</span>
                    </div>
                  </div>
                </div>
                {/* Right: Follow + close dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontWeight: 500, fontSize: '0.68rem',
                      color: 'hsl(207 85% 60%)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Follow
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', opacity: 0.4 }}>
                    {[0,1,2].map(i => (
                      <span key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'hsl(0 0% 70%)', display: 'block' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Video + right action column ── */}
              <div style={{ position: 'relative', display: 'flex' }}>

                {/* Video */}
                <div style={{ flex: 1, position: 'relative', background: '#000' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="UGC perfume campaign — creator unboxing and presenting fragrance"
                    style={{
                      display: 'block',
                      width: '100%',
                      aspectRatio: '9 / 16',
                      objectFit: 'cover',
                    }}
                  >
                    <source src="https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/A'llure3..mp4" type="video/mp4" />
                  </video>

                  {/* Sound toggle */}
                  <button
                    onClick={toggleMute}
                    aria-label={muted ? 'Unmute video' : 'Mute video'}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      width: 28, height: 28,
                      borderRadius: '50%',
                      background: 'hsl(0 0% 0% / 0.55)',
                      border: '1px solid hsl(0 0% 100% / 0.18)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'hsl(0 0% 85%)',
                      cursor: 'pointer',
                      zIndex: 10,
                      transition: 'background 0.2s ease, transform 0.15s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'hsl(0 0% 0% / 0.8)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'hsl(0 0% 0% / 0.55)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                  >
                    <IgVolume muted={muted} />
                  </button>
                </div>

                {/* Right action bar */}
                <div
                  style={{
                    width: '50px', flexShrink: 0,
                    background: 'hsl(0 0% 3% / 0.7)',
                    backdropFilter: 'blur(12px)',
                    borderLeft: '1px solid hsl(0 0% 100% / 0.05)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingBottom: '14px',
                    gap: '20px',
                  }}
                >
                  {/* Heart */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <div style={{ color: 'hsl(0 0% 80%)', lineHeight: 0 }}><IgHeart /></div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.5rem', color: '#F2F8FC', letterSpacing: '0.02em' }}>12.8K</span>
                  </div>
                  {/* Comment */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <div style={{ color: 'hsl(0 0% 80%)', lineHeight: 0 }}><IgComment /></div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.5rem', color: '#F2F8FC', letterSpacing: '0.02em' }}>348</span>
                  </div>
                  {/* Share */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <div style={{ color: 'hsl(0 0% 80%)', lineHeight: 0 }}><IgShare /></div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.5rem', color: '#F2F8FC', letterSpacing: '0.02em' }}>Share</span>
                  </div>
                  {/* Save */}
                  <div style={{ color: 'hsl(0 0% 80%)', lineHeight: 0 }}><IgSave /></div>
                </div>
              </div>

              {/* ── Caption bar ── */}
              <div
                style={{
                  padding: '10px 14px 8px',
                  background: 'hsl(0 0% 5%)',
                  borderTop: '1px solid hsl(0 0% 100% / 0.06)',
                }}
              >
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: '0.66rem', color: 'hsl(0 0% 82%)', marginBottom: '3px', letterSpacing: '-0.01em' }}>
                  12.8K likes
                </p>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.64rem', color: '#F2F8FC', lineHeight: 1.55, margin: 0 }}>
                  <span style={{ fontWeight: 500, color: 'hsl(0 0% 82%)' }}>allure.ugc</span>
                  {' '}Unboxing a fragrance made for everyday elegance. Soft, polished, and impossible to ignore.
                </p>
              </div>

              {/* ── Reel progress bar ── */}
              <div style={{ height: '2px', background: 'hsl(0 0% 100% / 0.08)' }}>
                <div
                  style={{
                    height: '100%',
                    width: '38%',
                    background: 'linear-gradient(to right, hsl(38 75% 58%), hsl(38 60% 45%))',
                    borderRadius: '0 1px 1px 0',
                  }}
                />
              </div>

            </div>
          </div>

          {/* ── RIGHT: text ── */}
          <div>

            {/* Label */}
            <div className="ugcpc-text ugc-step-label flex items-center gap-3 mb-8">
              <span aria-hidden="true" style={{ width: '1.8rem', height: 1, background: 'hsl(38 75% 58% / 0.55)', flexShrink: 0 }} />
              <span className="font-sans" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'hsl(38 75% 62%)' }}>
                UGC Perfume Campaign
              </span>
            </div>

            {/* Headline */}
            <h2
              className="ugcpc-text font-sans font-light"
              style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)', lineHeight: 1.1, letterSpacing: '-0.033em', marginBottom: '1.6rem' }}
            >
              Product storytelling that feels{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(38 75% 68%)' }}>
                real, polished,
              </em>{' '}
              and ready to convert.
            </h2>

            {/* Accent rule */}
            <div className="ugcpc-text" aria-hidden="true" style={{ width: '2.5rem', height: 1, background: 'hsl(38 70% 55% / 0.4)', marginBottom: '1.8rem' }} />

            {/* Paragraph 1 */}
            <p className="ugcpc-text font-sans font-light" style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1.02rem)', lineHeight: 1.9, color: '#F2F8FC', marginBottom: '1.2rem' }}>
              This style of creator-led content brings the product into a real lifestyle moment.
              The unboxing, reaction, and close product reveal help the fragrance feel more personal,
              more desirable, and easier for viewers to trust.
            </p>

            {/* Paragraph 2 */}
            <p className="ugcpc-text font-sans font-light" style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1.02rem)', lineHeight: 1.9, color: '#F2F8FC', marginBottom: '2.4rem' }}>
              From the first package reveal to the final product recommendation, the video is designed
              to feel natural while still keeping the brand premium, clear, and visually engaging.
            </p>

            {/* Feature list */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.4rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {UGC_PERFUME_FEATURES.map(item => (
                <li key={item} className="ugcpc-feat" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span aria-hidden="true" style={{ width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0, background: 'hsl(38 75% 58%)', boxShadow: '0 0 6px hsl(38 75% 55% / 0.55)' }} />
                  <span className="font-sans font-light" style={{ fontSize: '0.88rem', color: '#F2F8FC', letterSpacing: '0.01em' }}>{item}</span>
                </li>
              ))}
            </ul>

            {/* Closing line */}
            <p
              className="ugcpc-text font-sans font-light"
              style={{ fontSize: '0.82rem', lineHeight: 1.8, color: '#F2F8FC', borderLeft: '1px solid hsl(38 60% 50% / 0.25)', paddingLeft: '1rem', fontStyle: 'italic' }}
            >
              Perfect for brands that want content that feels authentic without losing a luxury finish.
            </p>

          </div>
        </div>
      </div>
    </section>
  )
}

// ─── UGC — Performance System ────────────────────────────────────────────────

const UGC_PS_ROWS = [
  {
    num: '01',
    title: 'Creative direction',
    body: 'We define the style, message, hook, and content angle before production begins.',
  },
  {
    num: '02',
    title: 'Platform-ready delivery',
    body: 'Assets are formatted for TikTok, Instagram Reels, Shorts, paid ads, stories, and landing pages.',
  },
  {
    num: '03',
    title: 'Brand consistency',
    body: 'Every piece of content stays aligned with your visual identity, tone, and campaign goals.',
  },
  {
    num: '04',
    title: 'Performance review',
    body: 'Content can be reviewed by hook, format, platform, engagement, and conversion potential.',
  },
]

function UGCPerformanceSystem() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const labelEl   = el.querySelector<HTMLElement>('.ugcps-label')
    const headingEl = el.querySelector<HTMLElement>('.ugcps-heading')
    const bodyEls   = el.querySelectorAll<HTMLElement>('.ugcps-body')
    const panelEl   = el.querySelector<HTMLElement>('.ugcps-panel')
    const rowEls    = el.querySelectorAll<HTMLElement>('.ugcps-row')

    gsap.set(labelEl,   { opacity: 0, y: 20 })
    gsap.set(headingEl, { opacity: 0, y: 32, filter: 'blur(8px)' })
    gsap.set(bodyEls,   { opacity: 0, y: 20 })
    gsap.set(panelEl,   { opacity: 0, y: 40, scale: 0.97 })
    gsap.set(rowEls,    { opacity: 0, y: 20 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(labelEl,   { opacity: 1, y: 0, duration: 0.75 }, 0)
      tl.to(headingEl, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0 }, 0.15)
      tl.to(bodyEls,   { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.3)
      tl.to(panelEl,   { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.2)
      tl.to(rowEls,    { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out' }, 0.45)

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
      {/* Subtle grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.016 }}>
        <filter id="ugcps-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#ugcps-gr)" fill="white"/>
      </svg>

      {/* Top hairline */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(to right, transparent, hsl(0 0% 100% / 0.07) 30%, hsl(0 0% 100% / 0.07) 70%, transparent)',
        }}
      />

      <div className="relative z-10 max-w-[80rem] mx-auto px-6 sm:px-10">

        {/* ── Two-column grid ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ gap: 'clamp(3rem, 7vw, 6rem)', alignItems: 'start' }}
        >

          {/* ── LEFT: editorial copy ── */}
          <div style={{ paddingTop: '0.5rem' }}>

            {/* Label */}
            <p
              className="ugcps-label font-sans font-light uppercase"
              style={{
                fontSize: '0.58rem',
                letterSpacing: '0.36em',
                color: 'hsl(38 70% 62% / 0.7)',
                marginBottom: '1.6rem',
              }}
            >
              UGC Performance System
            </p>

            {/* Headline */}
            <h2
              className="ugcps-heading font-sans font-light"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                color: 'hsl(0 0% 95%)',
                marginBottom: 'clamp(1.6rem, 3vw, 2.4rem)',
              }}
            >
              Content that looks real, feels premium,{' '}
              <em style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'hsl(0 0% 60%)',
              }}>
                and works with purpose.
              </em>
            </h2>

            {/* Accent rule */}
            <div
              aria-hidden="true"
              className="ugcps-body"
              style={{
                width: '2rem',
                height: '1px',
                background: 'hsl(38 70% 55% / 0.4)',
                marginBottom: 'clamp(1.6rem, 3vw, 2.4rem)',
              }}
            />

            {/* Paragraph 1 */}
            <p
              className="ugcps-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.85rem, 1.35vw, 0.98rem)',
                lineHeight: 1.9,
                color: '#F2F8FC',
                marginBottom: '1.4rem',
              }}
            >
              We shape every UGC campaign around the audience, offer, platform, and outcome — so
              the content feels natural while still supporting a clear commercial goal.
            </p>

            {/* Paragraph 2 */}
            <p
              className="ugcps-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.85rem, 1.35vw, 0.98rem)',
                lineHeight: 1.9,
                color: '#F2F8FC',
              }}
            >
              From creative direction and creator-style scripting to content delivery and
              reporting, the full process is built to help brands turn attention into trust,
              engagement, and action.
            </p>

          </div>

          {/* ── RIGHT: glass performance panel ── */}
          <div
            className="ugcps-panel"
            style={{
              borderRadius: '32px',
              border: '1px solid hsl(0 0% 100% / 0.08)',
              background: 'linear-gradient(145deg, hsl(0 0% 100% / 0.04) 0%, hsl(0 0% 100% / 0.015) 100%)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 32px 80px hsl(0 0% 0% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: 'clamp(1.6rem, 3vw, 2.4rem) clamp(1.6rem, 3vw, 2.8rem)',
                borderBottom: '1px solid hsl(0 0% 100% / 0.06)',
              }}
            >
              <p
                className="font-sans font-light uppercase"
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.3em',
                  color: 'hsl(195 70% 58% / 0.6)',
                  marginBottom: '0.5rem',
                }}
              >
                Process Overview
              </p>
              <p
                className="font-sans font-light"
                style={{
                  fontSize: 'clamp(0.82rem, 1.3vw, 0.95rem)',
                  lineHeight: 1.5,
                  letterSpacing: '-0.015em',
                  color: '#F2F8FC',
                }}
              >
                Four pillars that shape every campaign.
              </p>
            </div>

            {/* Rows */}
            <div>
              {UGC_PS_ROWS.map(({ num, title, body }, i) => (
                <div
                  key={num}
                  className="ugcps-row"
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.4rem 1fr',
                    gap: '0 1.4rem',
                    padding: 'clamp(1.3rem, 2.2vw, 1.8rem) clamp(1.6rem, 3vw, 2.8rem)',
                    borderBottom: i < UGC_PS_ROWS.length - 1 ? '1px solid hsl(0 0% 100% / 0.05)' : 'none',
                    background: hoveredRow === i
                      ? 'linear-gradient(90deg, hsl(38 60% 55% / 0.05) 0%, hsl(195 70% 55% / 0.04) 100%)'
                      : 'transparent',
                    transition: 'background 0.35s ease',
                    cursor: 'default',
                  }}
                >
                  {/* Row number */}
                  <span
                    className="font-sans font-light"
                    style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.06em',
                      color: hoveredRow === i ? 'hsl(38 70% 60%)' : 'hsl(0 0% 26%)',
                      paddingTop: '0.2rem',
                      transition: 'color 0.3s ease',
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </span>

                  <div>
                    {/* Row title */}
                    <h4
                      className="font-sans font-light"
                      style={{
                        fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
                        lineHeight: 1.3,
                        letterSpacing: '-0.018em',
                        color: hoveredRow === i ? 'hsl(0 0% 96%)' : 'hsl(0 0% 80%)',
                        marginBottom: '0.5rem',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {title}
                    </h4>

                    {/* Row body */}
                    <p
                      className="font-sans font-light"
                      style={{
                        fontSize: 'clamp(0.78rem, 1.15vw, 0.88rem)',
                        lineHeight: 1.78,
                        color: 'hsl(0 0% 32%)',
                        margin: 0,
                      }}
                    >
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

// ─── UGC — Practice Growth Ecosystem ─────────────────────────────────────────

const UGC_ECOSYSTEM_CARDS = [
  {
    Icon: Camera,
    title: 'Practice Immersion',
    body: 'We replace generic visuals with real, trust-building content that reflects your clinic, your team, and the patient experience people can expect.',
  },
  {
    Icon: Target,
    title: 'Conversion Campaigns',
    body: 'We create targeted social campaigns designed to attract the right patients, build confidence, and turn online attention into booked appointments.',
  },
  {
    Icon: Layers,
    title: 'Content Systems',
    body: 'We build a clear content structure your practice can use consistently across social media, ads, website pages, and patient communication.',
  },
]

function UGCPracticeEcosystem() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const headerEl  = el.querySelector<HTMLElement>('.upe-header')
    const cardEls   = el.querySelectorAll<HTMLElement>('.upe-card')
    const iconEls   = el.querySelectorAll<HTMLElement>('.upe-icon')
    const titleEls  = el.querySelectorAll<HTMLElement>('.upe-title')
    const bodyEls   = el.querySelectorAll<HTMLElement>('.upe-body')

    gsap.set(headerEl, { opacity: 0, y: 28 })
    gsap.set(cardEls,  { opacity: 0, y: 36 })
    gsap.set(iconEls,  { opacity: 0, scale: 0.5, filter: 'blur(6px)' })
    gsap.set(titleEls, { opacity: 0, y: 14 })
    gsap.set(bodyEls,  { opacity: 0, y: 10 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Header sweeps in
      tl.to(headerEl, { opacity: 1, y: 0, duration: 0.9 }, 0)

      // Cards lift up, staggered
      tl.to(cardEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.13 }, 0.28)

      // Icons pop in with spring, slightly behind cards
      tl.to(iconEls, {
        opacity: 1, scale: 1, filter: 'blur(0px)',
        duration: 0.65, stagger: 0.14,
        ease: 'back.out(1.9)',
      }, 0.42)

      // Titles slide up
      tl.to(titleEls, { opacity: 1, y: 0, duration: 0.6, stagger: 0.13 }, 0.58)

      // Body copy fades in last
      tl.to(bodyEls, { opacity: 1, y: 0, duration: 0.55, stagger: 0.13 }, 0.72)

      // ── Continuous idle animations per icon SVG internals ──
      tl.add(() => {
        const icons = el.querySelectorAll<HTMLElement>('.upe-icon')

        // ── Icon 0: Camera ──
        // Whole SVG spins continuously
        const icon0 = icons[0]
        if (icon0) {
          const svg0 = icon0.querySelector('svg')
          if (svg0) gsap.to(svg0, { rotation: 360, duration: 6, ease: 'none', repeat: -1, transformOrigin: '50% 50%' })
        }

        // ── Icon 1: Target ──
        // Whole SVG rotates slowly (radar sweep)
        // Each concentric circle pulses outward in sequence (ripple)
        const icon1 = icons[1]
        if (icon1) {
          const svg1 = icon1.querySelector('svg')
          if (svg1) gsap.to(svg1, { rotation: 360, duration: 10, ease: 'none', repeat: -1, transformOrigin: '50% 50%' })

          const circles = icon1.querySelectorAll<SVGCircleElement>('circle')
          circles.forEach((c, i) => {
            gsap.fromTo(c,
              { opacity: 0.35, scale: 0.82, transformOrigin: '50% 50%' },
              {
                opacity: 1, scale: 1,
                duration: 1.1 + i * 0.38,
                ease: 'sine.inOut', yoyo: true, repeat: -1,
                delay: i * 0.42,
                transformOrigin: '50% 50%',
              }
            )
          })
        }

        // ── Icon 2: Layers ──
        // Whole SVG spins continuously
        const icon2 = icons[2]
        if (icon2) {
          const svg2 = icon2.querySelector('svg')
          if (svg2) gsap.to(svg2, { rotation: 360, duration: 6, ease: 'none', repeat: -1, transformOrigin: '50% 50%' })
        }
      }, '-=0.1')

      obs.disconnect()
    }, { threshold: 0.1 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
    >
      {/* Top hairline */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(to right, transparent, hsl(0 0% 100% / 0.06) 30%, hsl(0 0% 100% / 0.06) 70%, transparent)',
        }}
      />

      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">

        {/* ── Dark header banner ── */}
        <div
          className="upe-header rounded-[18px] text-center mb-10 lg:mb-12"
          style={{
            background: 'hsl(218 38% 10%)',
            border: '1px solid hsl(218 30% 18%)',
            padding: 'clamp(2.4rem, 5vw, 3.4rem) clamp(1.5rem, 4vw, 3rem)',
          }}
        >
          <p
            className="font-sans font-normal uppercase mb-3"
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.32em',
              color: 'hsl(42 70% 58%)',
            }}
          >
            The High-Performing
          </p>
          <h2
            className="font-sans font-bold uppercase"
            style={{
              fontSize: 'clamp(1.9rem, 4.5vw, 3rem)',
              letterSpacing: '0.03em',
              color: 'hsl(42 78% 62%)',
              lineHeight: 1.1,
            }}
          >
            Practice Growth Ecosystem
          </h2>
        </div>

        {/* ── 3 cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
          {UGC_ECOSYSTEM_CARDS.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="upe-card rounded-[18px] p-8 lg:p-10 flex flex-col items-center text-center"
              style={{
                background: 'hsl(218 35% 8%)',
                border: '1px solid hsl(218 28% 16%)',
              }}
            >
              <div
                className="upe-icon"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'hsl(218 30% 13%)',
                  border: '1px solid hsl(218 28% 20%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.4rem',
                }}
              >
                <Icon size={21} strokeWidth={1.5} style={{ color: 'hsl(42 75% 60%)' }} />
              </div>

              <h3
                className="upe-title font-sans font-semibold mb-3"
                style={{
                  fontSize: '1.02rem',
                  letterSpacing: '-0.01em',
                  color: 'hsl(42 78% 62%)',
                }}
              >
                {title}
              </h3>

              <p
                className="upe-body font-sans font-light"
                style={{
                  fontSize: 'clamp(0.8rem, 1.1vw, 0.88rem)',
                  lineHeight: 1.82,
                  color: '#F2F8FC',
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── UGC — Contact / Footer (Section 6) ──────────────────────────────────────

function UGCContactFooter() {
  const sectionRef = useRef<HTMLElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const { videoRef, containerRef } = useHlsVideo(HLS_FOOTER)
  const [ctaHover, setCtaHover] = useState(false)

  // ── Scroll-triggered entry animations ────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const eyebrow = el.querySelector<HTMLElement>('.ugccf-eyebrow')
    const heading  = el.querySelector<HTMLElement>('.ugccf-heading')
    const sub      = el.querySelector<HTMLElement>('.ugccf-sub')
    const cta      = el.querySelector<HTMLElement>('.ugccf-cta')

    gsap.set([eyebrow, sub],  { opacity: 0, y: 28 })
    gsap.set(heading,          { opacity: 0, y: 40, filter: 'blur(10px)' })
    gsap.set(cta,              { opacity: 0, y: 20, scale: 0.96 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8 }, 0)
      tl.to(heading, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 }, 0.18)
      tl.to(sub,     { opacity: 1, y: 0, duration: 0.9 }, 0.38)
      tl.to(cta,     { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.4)' }, 0.55)
      obs.disconnect()
    }, { threshold: 0.12 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ── GSAP infinite marquee ─────────────────────────────────────────────────
  useEffect(() => {
    const el = marqueeRef.current
    if (!el) return
    const tween = gsap.to(el, {
      xPercent: -50,
      duration: 40,
      ease: 'none',
      repeat: -1,
    })
    return () => { tween.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="ugc-contact"
      className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden"
    >
      {/* ── HLS Video background — flipped vertically ── */}
      <div ref={containerRef} className="absolute inset-0" aria-hidden="true" style={{ zIndex: 0 }}>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          aria-hidden="true"
          className="scale-y-[-1]"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: 0.88,
            filter: 'brightness(1.06) contrast(1.38) saturate(1.15)',
          }}
        />
        {/* Heavy overlay */}
        <div className="absolute inset-0 bg-black/28 lg:bg-black/52" />
        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: '160px', background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)', zIndex: 2 }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '200px', background: 'linear-gradient(to top, #010709 0%, transparent 100%)', zIndex: 2 }}
        />
      </div>

      {/* ── All content sits above video ── */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>

        {/* Eyebrow */}
        <p
          className="ugccf-eyebrow font-sans font-light uppercase mb-10"
          style={{ fontSize: '0.68rem', letterSpacing: '0.28em', color: 'hsl(199 89% 68%)' }}
        >
          Get in touch
        </p>

        {/* ── GSAP Marquee — 20 DOM nodes (10+10) for seamless xPercent:-50 loop ── */}
        <div
          className="w-full overflow-hidden mb-16"
          style={{
            borderTop: '1px solid hsl(0 0% 100% / 0.07)',
            borderBottom: '1px solid hsl(0 0% 100% / 0.07)',
            padding: '1rem 0',
          }}
          aria-hidden="true"
        >
          <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  fontFamily: "'Instrument Serif', 'Didot', 'GFS Didot', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.75rem)',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  color: 'hsl(0 0% 100% / 0.15)',
                  padding: '0 2.5rem',
                }}
              >
                {BCF_MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>

        {/* Main heading */}
        <h2
          className="ugccf-heading font-sans font-light text-text text-center mb-5 px-6"
          style={{
            fontSize: 'clamp(2.4rem, 5.8vw, 4.4rem)',
            lineHeight: 1.06,
            letterSpacing: '-0.04em',
          }}
        >
          Let&apos;s create something{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(0 0% 72%)' }}>
            amazing
          </em>{' '}
          together
        </h2>

        {/* Subtext */}
        <p
          className="ugccf-sub font-sans font-light text-center mb-14 px-6"
          style={{
            fontSize: 'clamp(0.84rem, 1.35vw, 0.96rem)',
            lineHeight: 1.9,
            color: 'hsl(0 0% 40%)',
            maxWidth: '34rem',
          }}
        >
          Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can work together.
        </p>

        {/* ── CTA Email button — premium gradient hover ring ── */}
        <a
          href="mailto:hello@weavyautomation.com"
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          className="ugccf-cta relative mb-24 rounded-full"
          style={{
            padding: '2px',
            display: 'inline-block',
            background: ctaHover
              ? 'linear-gradient(135deg, hsl(199 89% 65%) 0%, hsl(213 90% 55%) 40%, hsl(240 80% 68%) 100%)'
              : 'linear-gradient(135deg, hsl(0 0% 22%) 0%, hsl(0 0% 14%) 100%)',
            boxShadow: ctaHover
              ? [
                  '0 0 0 4px hsl(199 89% 60% / 0.12)',
                  '0 0 40px -6px hsl(199 89% 60% / 0.5)',
                  '0 0 90px -16px hsl(199 89% 60% / 0.22)',
                  '0 8px 32px -8px hsl(0 0% 0% / 0.7)',
                ].join(', ')
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
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                flexShrink: 0,
                background: ctaHover ? 'hsl(199 89% 65%)' : 'hsl(0 0% 32%)',
                boxShadow: ctaHover ? '0 0 8px hsl(199 89% 65% / 0.8)' : 'none',
                transition: 'all 0.35s ease',
              }}
            />
            hello@weavyautomation.com
            <span
              aria-hidden="true"
              style={{
                fontSize: '1em',
                opacity: ctaHover ? 1 : 0.35,
                transform: ctaHover ? 'translateX(3px)' : 'translateX(0)',
                transition: 'all 0.35s ease',
                display: 'inline-block',
              }}
            >
              →
            </span>
          </span>
        </a>

        {/* ── Footer bar (responsive) ── */}
        <div className="w-full px-6 sm:px-10" style={{ maxWidth: '72rem', margin: '0 auto', borderTop: '1px solid hsl(0 0% 100% / 0.06)', paddingTop: '1.75rem' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Left — green pulsing dot + availability */}
            <div className="flex items-center gap-2.5 order-1">
              <span className="relative flex" style={{ width: 8, height: 8 }}>
                <span
                  className="absolute inline-flex rounded-full animate-ping"
                  style={{ width: '100%', height: '100%', background: 'hsl(142 71% 45%)', opacity: 0.7 }}
                />
                <span
                  className="relative inline-flex rounded-full"
                  style={{ width: 8, height: 8, background: 'hsl(142 71% 52%)', boxShadow: '0 0 8px hsl(142 71% 52% / 0.6)' }}
                />
              </span>
              <span
                className="font-sans font-light"
                style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'hsl(0 0% 48%)' }}
              >
                Available for projects
              </span>
            </div>

            {/* Centre — copyright (centered on mobile) */}
            <p
              className="font-sans font-light text-center order-3 sm:order-2"
              style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: 'hsl(0 0% 28%)' }}
            >
              © {new Date().getFullYear()} Weavy. All rights reserved.
            </p>

            {/* Right — social links */}
            <div className="flex items-center gap-1 justify-end order-2 sm:order-3">
              {BCF_SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    color: 'hsl(0 0% 36%)',
                    transition: 'color 0.2s ease, background 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'hsl(0 0% 84%)'
                    el.style.background = 'hsl(0 0% 100% / 0.07)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'hsl(0 0% 36%)'
                    el.style.background = 'transparent'
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Services section ─────────────────────────────────────────────────────────

export default function Services() {
  const sectionRef       = useRef<HTMLElement>(null)
  const chatbotRef       = useRef<HTMLElement>(null)
  const bwdCinemaRef     = useRef<HTMLElement>(null)
  const bwd1Ref          = useRef<HTMLElement>(null)
  const [activeService, setActiveService] = useState<'website' | 'chatbot' | 'social' | 'graphic' | 'ugc' | null>('website')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.services-eyebrow, .services-heading, .services-body', { opacity: 0, y: 24 })
      gsap.set('.service-card', { opacity: 0, y: 44 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 78%',
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.to('.services-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0)
          tl.to('.services-heading',  { opacity: 1, y: 0, duration: 0.9 }, 0.1)
          tl.to('.services-body',     { opacity: 1, y: 0, duration: 0.8 }, 0.2)
          tl.to('.service-card',      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.3)
        },
        once: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Chatbot section scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.cb-eyebrow, .cb-heading, .cb-intro, .cb-divider', { opacity: 0, y: 22 })
      gsap.set('.cb-feature', { opacity: 0, y: 28 })
      gsap.set('.cb-visual',  { opacity: 0, x: 36 })
      gsap.set('.cb-meta',    { opacity: 0, y: 18 })
      ScrollTrigger.create({
        trigger: chatbotRef.current,
        start: 'top 76%',
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.to('.cb-eyebrow',  { opacity: 1, y: 0, duration: 0.6 }, 0)
          tl.to('.cb-heading',  { opacity: 1, y: 0, duration: 0.8 }, 0.1)
          tl.to('.cb-intro',    { opacity: 1, y: 0, duration: 0.7 }, 0.18)
          tl.to('.cb-divider',  { opacity: 1, y: 0, duration: 0.5 }, 0.24)
          tl.to('.cb-feature',  { opacity: 1, y: 0, duration: 0.55, stagger: 0.07 }, 0.3)
          tl.to('.cb-meta',     { opacity: 1, y: 0, duration: 0.6, stagger: 0.1  }, 0.55)
          tl.to('.cb-visual',   { opacity: 1, x: 0, duration: 0.9 }, 0.15)
        },
        once: true,
      })
    }, chatbotRef)
    return () => ctx.revert()
  }, [])

  // Bespoke Cinema Showcase — fade-up text + floating browser + scroll parallax
  useEffect(() => {
    const el = bwdCinemaRef.current
    if (!el) return

    // Set initial states
    gsap.set(el.querySelectorAll('.bwdc-eyebrow'), { opacity: 0, y: 22 })
    gsap.set(el.querySelectorAll('.bwdc-hword'),   { opacity: 0, y: '110%' })
    gsap.set(el.querySelectorAll('.bwdc-sub'),     { opacity: 0, y: 18 })
    gsap.set(el.querySelectorAll('.bwdc-body'),    { opacity: 0, y: 18 })
    gsap.set(el.querySelectorAll('.bwdc-browser'), { opacity: 0, y: 48, scale: 0.97 })

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 78%',
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.to(el.querySelectorAll('.bwdc-eyebrow'), { opacity: 1, y: 0, duration: 0.65 }, 0)
          tl.to(el.querySelectorAll('.bwdc-hword'),   { opacity: 1, y: '0%', duration: 0.78, stagger: 0.07, ease: 'power3.out' }, 0.12)
          tl.to(el.querySelectorAll('.bwdc-sub'),     { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.28)
          tl.to(el.querySelectorAll('.bwdc-browser'), { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.18)
          tl.to(el.querySelectorAll('.bwdc-body'),    { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, 0.55)

          // Continuous float on browser mockup after reveal
          tl.add(() => {
            const browser = el.querySelector('.bwdc-browser') as HTMLElement | null
            if (browser) {
              gsap.to(browser, {
                y: -12,
                rotation: 0.4,
                duration: 5.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
              })
            }
          }, '-=0.3')
        },
        once: true,
      })

      // Parallax on scroll — browser drifts upward slightly slower than page
      const browser = el.querySelector('.bwdc-browser') as HTMLElement | null
      if (browser) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const progress = self.progress
            gsap.set(browser, { y: `+=${(progress - 0.5) * -28}` })
          },
        })
      }
    })

    return () => ctx.revert()
  }, [activeService])

  // Bespoke Website Design — Section 1 scroll animation
  useEffect(() => {
    const el = bwd1Ref.current
    if (!el) return

    gsap.set(el.querySelectorAll('.bwd1-eyebrow'), { opacity: 0, y: 18 })
    gsap.set(el.querySelectorAll('.bwd1-heading'), { opacity: 0, y: 28 })
    gsap.set(el.querySelectorAll('.bwd1-divider'), { opacity: 0, scaleX: 0, transformOrigin: 'left center' })
    gsap.set(el.querySelectorAll('.bwd1-body'),    { opacity: 0, y: 20 })
    gsap.set(el.querySelectorAll('.bwd1-list'),    { opacity: 0, y: 14 })
    gsap.set(el.querySelectorAll('.bwd1-img'),     { opacity: 0, x: 32, scale: 0.98 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(el.querySelectorAll('.bwd1-eyebrow'), { opacity: 1, y: 0, duration: 0.6 }, 0)
      tl.to(el.querySelectorAll('.bwd1-heading'), { opacity: 1, y: 0, duration: 0.8 }, 0.1)
      tl.to(el.querySelectorAll('.bwd1-divider'), { opacity: 1, scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.25)
      tl.to(el.querySelectorAll('.bwd1-body'),    { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.3)
      tl.to(el.querySelectorAll('.bwd1-list'),    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.45)
      tl.to(el.querySelectorAll('.bwd1-img'),     { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power2.out' }, 0.15)
      obs.disconnect()
    }, { threshold: 0.1 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [activeService])

  // Hover glow on cards via JS (no transition-all)
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.service-card')
    const handlers: Array<[HTMLElement, string, () => void]> = []

    cards.forEach((card, i) => {
      const shell = card.querySelector<HTMLElement>('[data-shell]')
      if (!shell) return
      const s = SERVICES[i]

      const enter = () => {
        gsap.to(shell, {
          boxShadow: `0 0 32px -6px ${s.accentGlow.replace('0.22', '0.55')}, 0 8px 40px -12px hsl(0 0% 0% / 0.7)`,
          y: -4,
          duration: 0.35,
          ease: 'power2.out',
        })
      }
      const leave = () => {
        gsap.to(shell, {
          boxShadow: `0 0 0 0 ${s.accentGlow}`,
          y: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        })
      }

      card.addEventListener('mouseenter', enter)
      card.addEventListener('mouseleave', leave)
      handlers.push([card, 'mouseenter', enter], [card, 'mouseleave', leave])
    })

    return () => handlers.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn))
  }, [])

  return (
    <>
      {/* ── Main services section ── */}
      <section
        ref={sectionRef}
        id="section-9"
        aria-labelledby="services-heading"
        className="relative w-full overflow-hidden"
        style={{ background: '#010709', padding: 'clamp(6rem, 12vw, 10rem) 0 clamp(7rem, 14vw, 12rem)' }}
      >
        {/* Animated beam rays background */}
        <BeamsBackgroundLayer intensity="subtle" />

        {/* Dot-grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.022) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 45% at 50% 0%, hsl(199 89% 60% / 0.05) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-[62rem] mx-auto px-6 sm:px-10">

          {/* Eyebrow */}
          <p
            className="services-eyebrow font-sans uppercase text-muted mb-5"
            style={{ fontSize: '0.7rem', letterSpacing: '0.32em' }}
          >
            What We Do
          </p>

          {/* Heading */}
          <h2
            id="services-heading"
            className="services-heading font-sans font-light text-text mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
            }}
          >
            Our{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              Services
            </em>
          </h2>

          {/* Subheading */}
          <p
            className="services-body font-sans font-light mb-14 max-w-xl"
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
              lineHeight: 1.8,
              color: 'hsl(0 0% 56%)',
            }}
          >
            End-to-end digital solutions crafted to elevate your brand, automate your workflows,
            and scale your presence.
          </p>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, i) => {
              const learnMoreHandler =
                service.id === 'bespoke-website-design'
                  ? () => { setActiveService('website');  setTimeout(() => document.getElementById('bespoke-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60) }
                  : service.id === 'custom-chatbots'
                  ? () => { setActiveService('chatbot');  setTimeout(() => document.getElementById('chatbot-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60) }
                  : service.id === 'social-media-marketing'
                  ? () => { setActiveService('social');   setTimeout(() => document.getElementById('social-media-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60) }
                  : service.id === 'graphic-design-animation'
                  ? () => { setActiveService('graphic');  setTimeout(() => document.getElementById('graphic-design-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60) }
                  : service.id === 'ugc'
                  ? () => { setActiveService('ugc');      setTimeout(() => document.getElementById('ugc-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60) }
                  : undefined
              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={i}
                  onLearnMore={learnMoreHandler}
                />
              )
            })}
          </div>

        </div>
      </section>

      {/* ── Sections 2–6: Bespoke Website Design ── */}
      {activeService === 'website' && <>

      {/* ── Bespoke Website Design — Hero ── */}
      <section
        id="bespoke-hero"
        className="relative w-screen overflow-hidden"
          style={{
            height: 'clamp(420px, 52vw, 720px)',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            background: '#010709',
          }}
      >
        {/* Full-width background image */}
        <img
          src="/brand_assets/HI-D.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />

        {/* Dark gradient overlay — fully opaque left-third to mask video behind text */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: [
            'linear-gradient(to right, hsl(0 0% 0% / 1.0) 0%, hsl(0 0% 0% / 0.88) 38%, hsl(0 0% 0% / 0.32) 65%, hsl(0 0% 0% / 0.08) 100%)',
            'linear-gradient(to top, hsl(0 0% 0% / 0.55) 0%, transparent 60%)',
          ].join(', '),
        }}/>

        {/* Dot grid texture */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.022) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}/>

        {/* Text content */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-20">
          <div style={{ maxWidth: '44rem' }}>

            {/* Eyebrow */}
            <p
              className="font-sans font-light uppercase mb-5"
              style={{
                fontSize: '0.63rem',
                letterSpacing: '0.32em',
                color: 'hsl(205 85% 68%)',
              }}
            >
              Bespoke Website Design
            </p>

            {/* Main heading */}
            <h1
              className="font-sans font-light text-white mb-6"
              style={{
                fontSize: 'clamp(2.6rem, 6vw, 5rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
              }}
            >
              <span style={{ display: 'block' }}>Built for your brand.</span>
              <em style={{
                display: 'block',
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'hsl(205 85% 74%)',
              }}>
                Designed to perform.
              </em>
            </h1>

            {/* Accent rule */}
            <div style={{
              height: 1,
              width: '10rem',
              background: 'linear-gradient(to right, hsl(205 85% 62% / 0.55), transparent)',
              marginBottom: '1.6rem',
            }}/>

            {/* Subtext */}
            <p
              className="font-sans font-light"
              style={{
                fontSize: 'clamp(0.88rem, 1.5vw, 1.05rem)',
                lineHeight: 1.8,
                color: 'hsl(0 0% 62%)',
                maxWidth: '34rem',
              }}
            >
              No templates. No shortcuts. Every pixel is crafted around your
              goals, your audience, and the impression you want to leave.
            </p>

          </div>
        </div>

        {/* Bottom fade into next section */}
        <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 bottom-0" style={{
          height: '100px',
          background: 'linear-gradient(to top, #010709 0%, transparent 100%)',
        }}/>
      </section>

      {/* ── Bespoke Website Design — full detail ── */}
      <section
        ref={bwd1Ref}
        id="bespoke-website-design-detail"
        className="relative w-full overflow-hidden"
        style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
      >
        {/* Cyan-blue tint — center/right biased */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 60% 55% at 68% 50%, hsl(199 89% 60% / 0.055) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 35% at 50% 40%, hsl(205 80% 55% / 0.03) 0%, transparent 65%)',
            ].join(', '),
          }}
        />

        {/* Section boundary fades */}
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

        <div className="relative z-10 max-w-[88rem] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-16 lg:gap-14 items-center">

            {/* ── Left: text (unchanged) ── */}
            <div>
              <p
                className="bwd1-eyebrow font-sans uppercase text-muted mb-5"
                style={{ fontSize: '0.7rem', letterSpacing: '0.32em' }}
              >
                Service
              </p>

              <h2
                className="bwd1-heading font-sans font-light text-text mb-8"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.035em',
                }}
              >
                Bespoke{' '}
                <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
                  Website Design
                </em>
              </h2>

              <div
                className="bwd1-divider w-full h-px mb-10"
                style={{ background: 'linear-gradient(to right, hsl(205 85% 62% / 0.3), transparent)' }}
                aria-hidden="true"
              />

              <p
                className="bwd1-body font-sans font-light mb-12 max-w-xl"
                style={{
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
                  lineHeight: 1.8,
                  color: 'hsl(0 0% 56%)',
                }}
              >
                Custom-built websites designed for clarity, performance, and impact. No templates.
                Every detail is intentional.
              </p>

              <p
                className="bwd1-body font-sans font-light text-text mb-5"
                style={{ fontSize: '0.78rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'hsl(0 0% 40%)' }}
              >
                What you get
              </p>

              <ul className="mb-12 flex flex-col gap-3">
                {[
                  'Tailored design aligned to your brand',
                  'Responsive across all devices',
                  'Fast, optimized performance',
                  'Clean UX focused on conversion',
                  'SEO-ready foundation',
                ].map(item => (
                  <li key={item} className="bwd1-list flex items-start gap-3">
                    <span
                      className="mt-[0.45em] shrink-0 w-1 h-1 rounded-full"
                      style={{ background: 'hsl(205 85% 62%)', boxShadow: '0 0 6px 1px hsl(205 85% 62% / 0.4)' }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-sans font-light"
                      style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', lineHeight: 1.75, color: 'hsl(0 0% 72%)' }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <p
                className="bwd1-body font-sans font-light text-text mb-5"
                style={{ fontSize: '0.78rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'hsl(0 0% 40%)' }}
              >
                Why it matters
              </p>

              <p
                className="bwd1-body font-sans font-light max-w-xl"
                style={{
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
                  lineHeight: 1.8,
                  color: 'hsl(0 0% 56%)',
                }}
              >
                A generic site blends in. A bespoke build positions you to stand out and perform.
              </p>
            </div>

            {/* ── Right: website 3.png ── */}
            <div className="relative flex items-center justify-center lg:justify-end">

              {/* Ambient glow behind image */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: '-20px',
                background: 'radial-gradient(ellipse 70% 60% at 55% 50%, hsl(205 85% 55% / 0.1) 0%, transparent 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }}/>

              {/* Image frame */}
              <div
                className="bwd1-img"
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '820px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: [
                    '0 48px 96px -16px hsl(0 0% 0% / 0.88)',
                    '0 0 0 1px hsl(0 0% 100% / 0.07)',
                    '0 0 64px -18px hsl(205 85% 55% / 0.22)',
                  ].join(', '),
                  background: '#080a0e',
                  transition: 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.65s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px) scale(1.02)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = [
                    '0 64px 120px -14px hsl(0 0% 0% / 0.92)',
                    '0 0 0 1px hsl(0 0% 100% / 0.1)',
                    '0 0 80px -14px hsl(205 85% 55% / 0.32)',
                  ].join(', ')
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'none'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = [
                    '0 48px 96px -16px hsl(0 0% 0% / 0.88)',
                    '0 0 0 1px hsl(0 0% 100% / 0.07)',
                    '0 0 64px -18px hsl(205 85% 55% / 0.22)',
                  ].join(', ')
                }}
              >
                <video
                  src="/brand_assets/chatbott_web.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="Bespoke website design showcase"
                  style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }}
                />
                {/* Bottom vignette */}
                <div aria-hidden="true" style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '32%',
                  background: 'linear-gradient(to top, hsl(210 20% 3% / 0.65) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }}/>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom fade — softens boundary into Cinema Showcase */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(1,7,9,0), #010709)',
          pointerEvents: 'none',
          zIndex: 5,
        }}/>
      </section>

      {/* ── Bespoke Website Design — Cinema Showcase (Section 2) ── */}
      <section
        ref={bwdCinemaRef}
        className="relative w-full overflow-hidden"
        style={{
          background: '#010709',
          padding: 'clamp(6rem, 11vw, 10rem) 0 clamp(5rem, 9vw, 8rem)',
        }}
      >
        {/* Dark 40 px slate grid — structural depth layer */}
        <DarkGridBg />

        {/* Ambient warm glow — upper center */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: [
            'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(36 60% 60% / 0.055) 0%, transparent 65%)',
            'radial-gradient(ellipse 50% 40% at 50% 100%, hsl(28 40% 50% / 0.04) 0%, transparent 60%)',
          ].join(', '),
        }}/>

        {/* Vignette edges */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: [
            'linear-gradient(to right,  hsl(210 20% 3% / 0.55) 0%, transparent 18%, transparent 82%, hsl(210 20% 3% / 0.55) 100%)',
            'linear-gradient(to bottom, hsl(210 20% 3% / 0.35) 0%, transparent 14%, transparent 88%, hsl(210 20% 3% / 0.6) 100%)',
          ].join(', '),
        }}/>

        {/* Fine dot grid */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(hsl(36 40% 70% / 0.028) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}/>

        {/* Top fade — masks warm ambient glow at the section boundary */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, #010709, rgba(1,7,9,0))',
          pointerEvents: 'none',
          zIndex: 5,
        }}/>

        <div className="relative z-10 w-full max-w-[72rem] mx-auto px-6 sm:px-10">

          {/* ── Typography block — centered ── */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5.5rem)' }}>

            {/* Eyebrow */}
            <p
              className="bwdc-eyebrow font-sans uppercase"
              style={{
                fontSize: '0.64rem', letterSpacing: '0.38em',
                color: 'hsl(36 40% 62%)', marginBottom: '1.8rem',
              }}
            >
              Bespoke Digital Experiences
            </p>

            {/* Headline — word-by-word reveal */}
            <h2
              className="font-sans font-light"
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
                lineHeight: 1.08, letterSpacing: '-0.04em',
                color: 'hsl(36 20% 92%)',
                marginBottom: '1.6rem',
              }}
            >
              {[
                ['Designed', 'Like', 'Architecture.'],
                ['Built', 'To', 'Feel'],
              ].map((line, li) => (
                <span key={li} style={{ display: 'block' }}>
                  {line.map((word, wi) => (
                    <span
                      key={wi}
                      style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.22em', paddingBottom: '0.04em' }}
                    >
                      <span
                        className="bwdc-hword"
                        style={{ display: 'inline-block', transform: 'translateY(110%)', opacity: 0 }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
              {/* "Timeless." in warm serif italic */}
              <span style={{ display: 'block' }}>
                <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.04em' }}>
                  <em
                    className="bwdc-hword"
                    style={{
                      display: 'inline-block', transform: 'translateY(110%)', opacity: 0,
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontStyle: 'italic', fontWeight: 400,
                      color: 'hsl(36 50% 74%)',
                    }}
                  >
                    Timeless.
                  </em>
                </span>
              </span>
            </h2>

            {/* Sub-labels */}
            <p
              className="bwdc-sub font-sans font-light"
              style={{
                fontSize: 'clamp(0.75rem, 1.2vw, 0.88rem)', letterSpacing: '0.04em',
                color: 'hsl(0 0% 48%)', lineHeight: 1.7,
              }}
            >
              Minimal systems.&nbsp;&nbsp;Cinematic presentation.&nbsp;&nbsp;Exceptional digital presence.
            </p>
          </div>

          {/* ── Browser mockup — centered, floating ── */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>

            {/* Ambient villa glow behind the frame */}
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: '8%', left: '50%', transform: 'translateX(-50%)',
              width: '90%', height: '80%',
              background: 'radial-gradient(ellipse 80% 70% at 50% 45%, hsl(36 50% 55% / 0.09) 0%, transparent 68%)',
              filter: 'blur(32px)',
              pointerEvents: 'none',
            }}/>

            {/* Browser frame */}
            <div
              className="bwdc-browser"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '920px',
                borderRadius: '12px 12px 0 0',
                overflow: 'hidden',
                boxShadow: [
                  '0 60px 140px -24px hsl(0 0% 0% / 0.9)',
                  '0 20px 60px -12px hsl(0 0% 0% / 0.55)',
                  '0 0 0 1px hsl(36 30% 60% / 0.12)',
                  'inset 0 1px 0 hsl(36 50% 90% / 0.08)',
                ].join(', '),
              }}
            >
              {/* macOS chrome bar */}
              <div style={{
                background: 'hsl(36 12% 88%)',
                padding: '9px 14px',
                display: 'flex', alignItems: 'center', gap: '8px',
                borderBottom: '1px solid hsl(30 10% 74%)',
              }}>
                <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                  {['hsl(4 78% 58%)', 'hsl(38 80% 54%)', 'hsl(133 52% 46%)'].map((c, i) => (
                    <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }}/>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '7px', marginLeft: '5px', flexShrink: 0 }}>
                  {[0, 1].map(i => (
                    <div key={i} style={{ width: 16, height: 10, borderRadius: '2px', background: 'hsl(30 8% 72%)', opacity: 0.65 }}/>
                  ))}
                </div>
                <div style={{
                  flex: 1, background: 'hsl(36 16% 96%)',
                  border: '1px solid hsl(30 10% 76%)', borderRadius: '5px',
                  padding: '3px 12px', fontSize: '0.65rem',
                  fontFamily: "'SF Mono','Fira Code',monospace",
                  color: 'hsl(28 10% 36%)', letterSpacing: '0.01em',
                  textAlign: 'center' as const,
                }}>
                  villa.luna.com
                </div>
                <div style={{ display: 'flex', gap: '7px', flexShrink: 0 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 16, height: 10, borderRadius: '2px', background: 'hsl(30 8% 72%)', opacity: 0.65 }}/>
                  ))}
                </div>
              </div>

              {/* Property image — full bleed inside browser */}
              <div style={{ position: 'relative', width: '100%', lineHeight: 0 }}>
                <img
                  loading="lazy"
                  decoding="async"
                  src="/brand_assets/Property.png"
                  alt="Bespoke luxury real estate website showcase"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
                {/* Soft inner vignette on image edges */}
                <div aria-hidden="true" style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: [
                    'linear-gradient(to right,  hsl(28 20% 8% / 0.18) 0%, transparent 12%, transparent 88%, hsl(28 20% 8% / 0.18) 100%)',
                    'linear-gradient(to bottom, transparent 70%, hsl(210 20% 3% / 0.55) 100%)',
                  ].join(', '),
                }}/>
              </div>
            </div>
          </div>

          {/* ── Bottom text + CTAs ── */}
          <div style={{
            textAlign: 'center',
            paddingTop: 'clamp(3rem, 5vw, 4.5rem)',
            maxWidth: '560px',
            margin: '0 auto',
          }}>
            <p
              className="bwdc-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', lineHeight: 1.82,
                color: 'hsl(0 0% 52%)', marginBottom: '1.4rem',
              }}
            >
              Every interface is carefully crafted with the same precision as luxury interiors and modern architecture — balancing clarity, emotion, performance, and visual sophistication.
            </p>
            <p
              className="bwdc-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', lineHeight: 1.82,
                color: 'hsl(0 0% 40%)', marginBottom: '1.4rem',
              }}
            >
              No templates. No shortcuts. Each project begins with an in-depth understanding of your brand, your audience, and the impression you want to leave — then we build from the ground up.
            </p>
            <p
              className="bwdc-body font-sans font-light"
              style={{
                fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', lineHeight: 1.82,
                color: 'hsl(0 0% 34%)',
              }}
            >
              The result is a digital presence that feels as considered and enduring as the finest architecture — built to perform, designed to last.
            </p>
          </div>

        </div>

        {/* Seamless blend into BespokeFollowUp — masks vignette edge */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(1,7,9,0), #010709)',
          pointerEvents: 'none',
          zIndex: 5,
        }}/>
      </section>

      {/* ── Bespoke Website Design — cinematic follow-up ── */}
      <BespokeFollowUp />

      {/* ── Bespoke Website Design — Care Stories (Section 4) ── */}
      <BespokeCareStories />

      {/* ── Bespoke Website Design — process timeline ── */}
      <BespokeProcessTimeline />

      {/* ── Bespoke Website Design — floating web showcase (Section 6) ── */}
      <BespokeWebShowcase />

      {/* ── Bespoke Website Design — real users performance (Section 7) ── */}
      <BespokeRealUsers />

      {/* ── Bespoke Website Design — design showcase (Section 8) ── */}
      <BespokeWebDesignShowcase />

      {/* ── Bespoke Website Design — client testimonials ── */}
      <BespokeTestimonials />

      {/* ── Bespoke Contact / Footer ── */}
      <BespokeContactFooter />

      </> /* end activeService === 'website' */}

      {/* ── Sections 7–10: Custom Chatbots ── */}
      {activeService === 'chatbot' && <>

      <ChatbotHero />

      {/* ── Custom Chatbots — full detail ── */}
      <section
        ref={chatbotRef}
        id="custom-chatbots-detail"
        className="relative w-full overflow-hidden"
        style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
      >
        {/* Ambient glows */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
          background: [
            'radial-gradient(ellipse 50% 60% at 72% 50%, hsl(195 90% 55% / 0.07) 0%, transparent 65%)',
            'radial-gradient(ellipse 40% 40% at 20% 30%, hsl(215 80% 55% / 0.04) 0%, transparent 60%)',
            'radial-gradient(ellipse 30% 25% at 85% 85%, hsl(270 65% 60% / 0.03) 0%, transparent 55%)',
          ].join(', '),
        }} />
        {/* Dot-grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.018) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Section boundary fades */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

        <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

            {/* ── Left: content ── */}
            <div>
              <p className="cb-eyebrow font-sans uppercase text-muted mb-5" style={{ fontSize: '0.7rem', letterSpacing: '0.32em' }}>
                Service
              </p>

              <h2
                className="cb-heading font-sans font-light text-text mb-8"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.035em' }}
              >
                Custom Chatbot{' '}
                <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
                  for Websites
                </em>
              </h2>

              <div className="cb-divider w-full h-px mb-10" style={{ background: 'linear-gradient(to right, hsl(195 90% 55% / 0.45), transparent)' }} aria-hidden="true" />

              <p className="cb-intro font-sans font-light mb-10" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', lineHeight: 1.8, color: '#F2F8FC' }}>
                AI-powered chatbots built to automate, engage, and scale your operations —
                designed around real workflows, not generic scripts.
              </p>

              {/* Feature blocks grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
                {CHATBOT_FEATURES.map(({ Icon, title, desc }) => (
                  <div
                    key={title}
                    className="cb-feature flex items-start gap-3 rounded-xl p-4"
                    style={{
                      background: 'hsl(215 20% 8% / 0.55)',
                      border: '1px solid hsl(0 0% 100% / 0.06)',
                      backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'hsl(195 90% 55% / 0.28)'
                      el.style.boxShadow   = '0 0 22px -6px hsl(195 90% 55% / 0.16)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'hsl(0 0% 100% / 0.06)'
                      el.style.boxShadow   = 'none'
                    }}
                  >
                    <div
                      className="shrink-0 flex items-center justify-center rounded-lg"
                      style={{
                        width: '32px', height: '32px',
                        background: 'hsl(195 90% 55% / 0.1)',
                        border: '1px solid hsl(195 90% 55% / 0.22)',
                        boxShadow: '0 0 10px -2px hsl(195 90% 55% / 0.2)',
                      }}
                    >
                      <Icon size={14} strokeWidth={1.5} style={{ color: 'hsl(195 88% 60%)' }} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-sans font-light text-text mb-1" style={{ fontSize: '0.84rem', letterSpacing: '-0.01em' }}>
                        {title}
                      </div>
                      <div className="font-sans font-light" style={{ fontSize: '0.76rem', color: '#F2F8FC', lineHeight: 1.65 }}>
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Meta rows */}
              <div className="cb-meta flex flex-col gap-5">
                <div>
                  <p className="font-sans mb-2" style={{ fontSize: '0.68rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'hsl(195 80% 55%)' }}>
                    Who it's for
                  </p>
                  <p className="font-sans font-light" style={{ fontSize: 'clamp(0.85rem, 1.3vw, 0.95rem)', lineHeight: 1.8, color: '#F2F8FC' }}>
                    Real estate, dentists, law firms, accounting firms, fashion brands, and more.
                  </p>
                </div>
                <div>
                  <p className="font-sans mb-2" style={{ fontSize: '0.68rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'hsl(195 80% 55%)' }}>
                    Why it matters
                  </p>
                  <p className="font-sans font-light" style={{ fontSize: 'clamp(0.85rem, 1.3vw, 0.95rem)', lineHeight: 1.8, color: '#F2F8FC' }}>
                    Manual support limits scale. Custom chatbots handle volume instantly,
                    improve response time, and convert more interactions into results.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right: visual ── */}
            <div className="cb-visual" style={{ position: 'relative' }}>

              {/* Main image — wider via negative side margins */}
              <div style={{ position: 'relative', zIndex: 2, marginLeft: '-10%', marginRight: '-10%' }}>
                <img
                  loading="lazy"
                  decoding="async"
                  src="/brand_assets/2w.png.png"
                  alt="AI chatbot — always online"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '1rem',
                    boxShadow: '0 0 0 1px hsl(195 90% 55% / 0.18), 0 24px 64px -12px hsl(195 90% 55% / 0.2), 0 32px 80px -20px hsl(0 0% 0% / 0.72)',
                  }}
                />
                <div aria-hidden="true" style={{
                  position: 'absolute', inset: 0, borderRadius: '1rem', pointerEvents: 'none',
                  background: 'linear-gradient(to bottom, transparent 55%, hsl(215 30% 6% / 0.55) 100%)',
                }}/>
              </div>

              {/* ChatbotMockup — scale(0.96): dead space=580*(1-0.96)=23px → marginBottom corrects */}
              <div style={{
                position: 'relative', zIndex: 3,
                marginTop: '-100px',
                marginBottom: '-35px',
                paddingLeft: '8px',
                paddingRight: '8px',
                transform: 'scale(0.96)',
                transformOrigin: 'top center',
              }}>
                <ChatbotMockup />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── Custom Chatbots — WhatsApp Business (Section 2) ── */}
      <ChatbotWhatsAppBusiness />

      {/* ── Custom Chatbots — Instagram DM (Section 3) ── */}
      <ChatbotInstagramDM />

      {/* ── Custom Chatbots — Facebook Messenger (Section 4) ── */}
      <ChatbotFacebookMessenger />

      {/* ── Custom Chatbots — TikTok Automation (Section 5) ── */}
      <ChatbotTikTokAutomation />

      {/* ── Chatbot manifesto quote ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: '#010709', padding: 'clamp(5rem, 11vw, 9rem) 0' }}
      >
        {/* Radial cyan ambient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 70% 55% at 50% 50%, hsl(199 89% 60% / 0.06) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 30% at 20% 80%, hsl(210 80% 55% / 0.03) 0%, transparent 60%)',
            ].join(', '),
          }}
        />

        {/* Dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(hsl(199 89% 60% / 0.022) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Section boundary fades */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none', zIndex: 2 }} />

        <div className="relative z-10 max-w-[54rem] mx-auto px-6 sm:px-10 flex flex-col items-center text-center">

          {/* Cyan opening mark */}
          <span
            aria-hidden="true"
            className="mb-8 select-none"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              lineHeight: 1,
              color: 'hsl(199 89% 60% / 0.35)',
              letterSpacing: '-0.02em',
            }}
          >
            "
          </span>

          {/* Quote body */}
          <p
            className="font-sans font-light"
            style={{
              fontSize: 'clamp(1.1rem, 2.4vw, 1.75rem)',
              lineHeight: 1.65,
              letterSpacing: '-0.022em',
              color: '#F2F8FC',
            }}
          >
            Automate conversations. Capture more leads. Support customers instantly across your website, WhatsApp, Instagram DM, and Facebook Messenger —
            {' '}
            <span style={{ color: '#F2F8FC' }}>
              all from one intelligent AI-powered system built to scale your business 24/7.
            </span>
          </p>

          {/* Bottom accent line */}
          <div
            aria-hidden="true"
            className="mt-12"
            style={{
              width: '3rem',
              height: '1px',
              background: 'hsl(199 89% 60% / 0.45)',
              boxShadow: '0 0 10px 0 hsl(199 89% 60% / 0.3)',
            }}
          />
        </div>

      </section>

      {/* ── Custom Chatbots — Automation Workflow ── */}
      <ChatbotWorkflowSection />

      {/* ── Custom Chatbots — Connected Channels & Integrations (Section 8) ── */}
      <ChatbotIntegrationsSection />

      {/* ── Custom Chatbots — Contact / Footer (Section 6) ── */}
      <BespokeContactFooter />

      </> /* end activeService === 'chatbot' */}

      {/* ── Social Media Marketing — full premium flow ── */}
      {activeService === 'social' && <SocialMediaMarketing />}

      {activeService === 'social' && <section
        id="social-media-marketing-detail"
        style={{ display: 'none' }}
      >
        {/* Ambient glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 45% at 50% 0%, hsl(199 89% 60% / 0.07) 0%, transparent 70%)',
        }}/>
        {/* Dot-grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'radial-gradient(hsl(199 89% 60% / 0.018) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}/>

        <div className="relative z-10 max-w-[52rem] mx-auto px-6 sm:px-10 flex flex-col items-center text-center">

          {/* Eyebrow */}
          <p className="font-sans uppercase mb-6" style={{ fontSize: '0.7rem', letterSpacing: '0.32em', color: 'hsl(280 65% 65%)' }}>
            Social Media
          </p>

          {/* Heading */}
          <h2
            className="font-sans font-light text-text mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.08, letterSpacing: '-0.035em' }}
          >
            Social Media{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              Marketing
            </em>
          </h2>

          {/* Divider */}
          <div className="mb-10" style={{ width: '3rem', height: '1px', background: 'hsl(280 65% 65% / 0.45)' }} aria-hidden="true"/>

          {/* Lead */}
          <p className="font-sans font-light mb-6" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.75, color: 'hsl(0 0% 78%)', maxWidth: '38rem' }}>
            At Weavy, we turn your social media into a consistent growth engine.
          </p>

          {/* Problem */}
          <p className="font-sans font-light mb-6" style={{ fontSize: 'clamp(0.88rem, 1.5vw, 1rem)', lineHeight: 1.8, color: 'hsl(0 0% 52%)', maxWidth: '36rem' }}>
            Most brands post without strategy — leading to low engagement and missed opportunities.
          </p>

          {/* Extended problem */}
          <p className="font-sans font-light mb-10" style={{ fontSize: 'clamp(0.88rem, 1.5vw, 1rem)', lineHeight: 1.8, color: 'hsl(0 0% 52%)', maxWidth: '36rem' }}>
            Without a clear direction, content fails to connect, reach the right audience, or drive meaningful results.
          </p>

          {/* Image — directly after "drive meaningful results." */}
          <div style={{ width: '85%', minWidth: '300px', maxWidth: '720px', marginBottom: '3.5rem' }}>
            <img
              loading="lazy"
              decoding="async"
              src="/brand_assets/social_lady.png"
              alt="Social media marketing"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '1rem',
                boxShadow: '0 8px 48px -8px hsl(199 89% 60% / 0.18), 0 24px 64px -16px hsl(0 0% 0% / 0.72)',
              }}
            />
          </div>

          {/* Our Solution block */}
          <div className="w-full mb-12" style={{ maxWidth: '36rem', textAlign: 'left', borderLeft: '1px solid hsl(280 65% 65% / 0.3)', paddingLeft: '1.5rem' }}>
            <p className="font-sans uppercase mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.28em', color: 'hsl(280 65% 65%)' }}>
              Our Solution
            </p>
            <p className="font-sans font-light" style={{ fontSize: 'clamp(0.88rem, 1.5vw, 1rem)', lineHeight: 1.8, color: 'hsl(0 0% 68%)' }}>
              We create a structured system built around your brand and audience.
            </p>
          </div>

          {/* What we handle */}
          <div className="w-full mb-12" style={{ maxWidth: '36rem' }}>
            <p className="font-sans uppercase mb-5" style={{ fontSize: '0.65rem', letterSpacing: '0.28em', color: 'hsl(0 0% 45%)' }}>
              What we handle
            </p>
            <ul className="flex flex-col gap-3" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                'Strategy & scheduling',
                'Reels, stories, carousels',
                'Design & captions',
                'Email marketing',
                'High-performing paid ads',
              ].map(item => (
                <li key={item} className="font-sans font-light flex items-center justify-center gap-3" style={{ fontSize: 'clamp(0.88rem, 1.5vw, 1rem)', color: 'hsl(0 0% 72%)' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'hsl(280 65% 65% / 0.6)', flexShrink: 0, display: 'inline-block' }}/>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Closing line */}
          <p className="font-sans font-light mb-16" style={{ fontSize: 'clamp(0.88rem, 1.5vw, 1rem)', lineHeight: 1.8, color: 'hsl(0 0% 52%)', maxWidth: '36rem' }}>
            We focus on the right audience, strong content, and measurable results — while you focus on your business.
          </p>


        </div>
      </section>}

      {/* ── Graphic Design / Animation — cinematic hero + editorial ── */}
      {activeService === 'graphic' && <GraphicDesignHero />}
      {activeService === 'graphic' && <GraphicDesignEditorial />}
      {activeService === 'graphic' && <GraphicDesignServices />}
      {activeService === 'graphic' && <GraphicDesignSplitA />}
      {activeService === 'graphic' && <GraphicDesignSplitB />}
      {activeService === 'graphic' && <GraphicDesignFinalPresentation />}
      {activeService === 'graphic' && <GraphicDesignCTA />}
      {activeService === 'graphic' && <GraphicDesignContactFooter />}

      {/* ── UGC ── */}
      {activeService === 'ugc' && <UGCHero />}
      {activeService === 'ugc' && <UGCCreatorSelection />}
      {activeService === 'ugc' && <UGCFindCreators />}
      {activeService === 'ugc' && <UGCMonitoringReporting />}
      {activeService === 'ugc' && <UGCTrackingUrls />}
      {activeService === 'ugc' && <UGCPerfumeCampaign />}
      {activeService === 'ugc' && <UGCPerformanceSystem />}
      {activeService === 'ugc' && <UGCPracticeEcosystem />}
      {activeService === 'ugc' && <UGCContactFooter />}

      {/* ── Remaining detail placeholder sections ── */}
      {false && SERVICES.slice(4).map(service => (
        <section
          key={service.id}
          id={`${service.id}-detail`}
          className="relative w-full bg-bg"
          style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: '1px solid hsl(0 0% 10%)' }}
        >
          <div className="max-w-[52rem] mx-auto px-6 sm:px-10">
            <p
              className="font-sans uppercase text-muted mb-4"
              style={{ fontSize: '0.7rem', letterSpacing: '0.32em' }}
            >
              Service
            </p>
            <h2
              className="font-sans font-light text-text"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              {service.title}
            </h2>
          </div>
        </section>
      ))}
    </>
  )
}
