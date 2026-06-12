import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const HLS_SRC = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'
const MARQUEE_TEXT = 'BUILDING THE FUTURE • '

const SOCIALS = [
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Dribbble',
    href: 'https://dribbble.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.629 0 12-5.372 12-12 0-6.627-5.371-12-12-12zm7.923 5.555a10.27 10.27 0 0 1 2.186 5.984c-.32-.063-3.521-.713-6.74-.308-.07-.175-.136-.354-.208-.529-.192-.479-.4-.956-.617-1.42 3.484-1.419 5.075-3.463 5.379-3.727zM12 1.777a10.217 10.217 0 0 1 6.964 2.728c-.264.233-1.67 2.138-5.044 3.392-1.577-2.895-3.326-5.277-3.598-5.654A10.37 10.37 0 0 1 12 1.777zM8.5 2.888c.261.36 1.98 2.752 3.577 5.585-4.514 1.2-8.5 1.177-8.922 1.166A10.26 10.26 0 0 1 8.5 2.888zM1.761 12.016v-.26c.41.01 5.063.083 9.888-1.37.277.54.538 1.088.78 1.638-.124.034-.25.072-.373.112-4.989 1.609-7.638 6.003-7.868 6.399A10.22 10.22 0 0 1 1.76 12.016zm10.24 10.213a10.21 10.21 0 0 1-6.158-2.063c.19-.386 2.356-4.565 7.856-6.477.021-.007.042-.016.062-.022a36.8 36.8 0 0 1 1.906 6.777 10.19 10.19 0 0 1-3.666.785zm5.389-1.83a38.33 38.33 0 0 0-1.773-6.324c2.924-.466 5.49.3 5.813.4a10.24 10.24 0 0 1-4.04 5.924z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
]

function FooterVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    // Skip if user prefers reduced motion
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
          hls.loadSource(HLS_SRC)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {})
          })
          cleanup = () => hls.destroy()
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = HLS_SRC
          video.play().catch(() => {})
        }
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          init()
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(container)

    return () => {
      observer.disconnect()
      cleanup?.()
    }
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          minWidth: '100%', minHeight: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%) scaleY(-1)',
        }}
      />
    </div>
  )
}

function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const tween = gsap.to(el, {
      xPercent: -50,
      duration: 500,
      ease: 'none',
      repeat: -1,
    })
    return () => { tween.kill() }
  }, [])

  const repeated = MARQUEE_TEXT.repeat(10)

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        borderTop: '1px solid hsl(0 0% 100% / 0.06)',
        borderBottom: '1px solid hsl(0 0% 100% / 0.06)',
        padding: '1.3rem 0',
      }}
    >
      <div ref={trackRef} style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
        {[0, 1].map(i => (
          <span
            key={i}
            style={{
              fontFamily: "'Didot', 'GFS Didot', 'Didot LT STD', 'Bodoni MT', Georgia, serif",
              fontWeight: 400,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'hsl(0 0% 100% / 0.28)',
              paddingRight: '2rem',
            }}
          >
            {repeated}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative w-full bg-bg overflow-hidden"
      style={{ paddingTop: 'clamp(4rem, 8vw, 5rem)' }}
    >
      {/* Top fade — blends from Testimonials background (#010709) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, #0a0a0a, transparent)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Background video */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <FooterVideo />
        <div className="absolute inset-0 pointer-events-none bg-black/35 lg:bg-black/60" />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Marquee */}
        <Marquee />

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'clamp(3.5rem, 7vw, 5.5rem) 1.5rem',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-light"
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'hsl(0 0% 36%)',
              marginBottom: '2rem',
            }}
          >
            Get in touch
          </motion.p>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-light text-text"
            style={{
              fontSize: 'clamp(1.9rem, 4vw, 3rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              whiteSpace: 'nowrap',
              maxWidth: 'none',
              marginBottom: '1.25rem',
            }}
          >
            Let's create something{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              amazing
            </em>{' '}
            together
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-light"
            style={{
              fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
              lineHeight: 1.8,
              color: 'hsl(0 0% 44%)',
              maxWidth: '34rem',
              marginBottom: '2.5rem',
            }}
          >
            Have a project in mind? I'd love to hear about it.{' '}
            <br />
            Let's discuss how we can work together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
          <a
            href="mailto:hello@weavyautomation.com"
            className="font-sans font-light"
            style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.45rem)',
              letterSpacing: '-0.01em',
              color: 'hsl(0 0% 88%)',
              textDecoration: 'none',
              padding: '0.8rem 2.2rem',
              borderRadius: '999px',
              border: '1px solid hsl(0 0% 100% / 0.13)',
              background: 'hsl(0 0% 100% / 0.03)',
              backdropFilter: 'blur(12px)',
              display: 'inline-block',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'hsl(199 89% 60% / 0.5)'
              el.style.boxShadow   = '0 0 32px -6px hsl(199 89% 60% / 0.22), inset 0 0 16px -8px hsl(199 89% 60% / 0.07)'
              el.style.background  = 'hsl(0 0% 100% / 0.05)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'hsl(0 0% 100% / 0.13)'
              el.style.boxShadow   = 'none'
              el.style.background  = 'hsl(0 0% 100% / 0.03)'
            }}
          >
            hello@weavyautomation.com
          </a>
          </motion.div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            padding: '1.2rem clamp(1.5rem, 5vw, 3.5rem) 2rem',
            borderTop: '1px solid hsl(0 0% 100% / 0.06)',
          }}
        >
          {/* Status dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              aria-hidden="true"
              style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: 'hsl(142 65% 50%)',
                boxShadow: '0 0 8px hsl(142 65% 50% / 0.7)',
                display: 'inline-block',
                animation: 'footer-dot-pulse 2.2s ease-in-out infinite',
              }}
            />
            <span
              className="font-sans font-light"
              style={{ fontSize: '0.73rem', letterSpacing: '0.1em', color: 'hsl(0 0% 38%)' }}
            >
              Available for projects
            </span>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  color: 'hsl(0 0% 34%)',
                  display: 'flex',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'hsl(0 0% 78%)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'hsl(0 0% 34%)' }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes footer-dot-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </footer>
  )
}
