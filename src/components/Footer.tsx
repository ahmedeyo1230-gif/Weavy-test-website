import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const HLS_SRC = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'
const MARQUEE_TEXT = 'BUILDING THE FUTURE • '

// Placeholder profile links — swap for the real Weavy handles once available.
const INSTAGRAM_URL = 'https://instagram.com'
const FACEBOOK_URL = 'https://facebook.com'
const TIKTOK_URL = 'https://tiktok.com'

const SOCIALS = [
  {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.259 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.36-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.06-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162s2.757 6.162 6.162 6.162 6.162-2.76 6.162-6.162c0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.645-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: FACEBOOK_URL,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.732-.009c-.229 0-.473.004-.729.011-.257.006-.437.011-.539.011-.376 0-.696.024-.956.079-.259.055-.474.145-.646.278-.171.132-.308.312-.412.541-.104.229-.156.516-.156.867v1.313h2.965l-.386 3.667h-2.579v7.98H9.101z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: TIKTOK_URL,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.43 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
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
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          minWidth: '100%', minHeight: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%) scaleY(-1)',
          opacity: 0.75,
          filter: 'brightness(0.95) saturate(1) contrast(1)',
          pointerEvents: 'none',
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
              fontSize: 'clamp(1.55rem, 3.2vw, 2.6rem)',
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

interface FooterProps {
  /** Anchor id on the <footer> element. Pass undefined on pages that already own #contact elsewhere. */
  id?: string
  eyebrow?: string
  heading?: ReactNode
  /** Pass null to omit the supporting paragraph entirely (e.g. Social Media Marketing tab). */
  subtext?: ReactNode | null
  ctaLabel?: string
  ctaHref?: string
}

const DEFAULT_HEADING = (
  <>
    Ready to turn your business into an{' '}
    <em style={{
      fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400,
      background: 'linear-gradient(90deg, #FFFFFF 0%, #7DDCFF 45%, #B7AEFF 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      color: 'transparent',
      textShadow: '0 0 24px rgba(125, 220, 255, 0.16)',
    }}>
      AI-powered operating system?
    </em>
  </>
)

const DEFAULT_SUBTEXT = (
  <>
    Start with one channel or build a full AI platform for customer{' '}
    <br />
    communication, bookings, leads, and growth.
  </>
)

export default function Footer({
  id = 'contact',
  eyebrow = 'Get in touch',
  heading = DEFAULT_HEADING,
  subtext = DEFAULT_SUBTEXT,
  ctaLabel = 'Book a Platform Demo',
  ctaHref = 'mailto:hello@weavyautomation.com',
}: FooterProps = {}) {
  return (
    <footer
      id={id}
      className="relative w-full overflow-hidden"
      style={{ background: '#06080A', paddingTop: 'clamp(4rem, 8vw, 5rem)' }}
    >
      {/* Background video — sits above the plain section background, below the
          overlay and footer content (see z-index stack: video 0 < blend/overlay 1 < content 2) */}
      <FooterVideo />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'rgba(1,7,9,0.28)',
          pointerEvents: 'none',
        }}
      />

      {/* Top blend — continues from Testimonials boundary; subtle, does not fully hide the video */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '220px',
          background: 'linear-gradient(to bottom, rgba(6,8,10,0.35) 0%, rgba(6,8,10,0.24) 40%, rgba(6,8,10,0.10) 72%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* Marquee */}
        <Marquee />

        {/* CTA */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'clamp(3.5rem, 7vw, 5.5rem) 1.5rem',
          }}
        >
          {/* Mobile/tablet readability overlay — behind heading & sentences only, not over marquee */}
          <div
            aria-hidden="true"
            className="lg:hidden"
            style={{
              position: 'absolute',
              inset: '-2rem -100vw',
              background: 'radial-gradient(ellipse 80% 90% at 50% 50%, rgba(1,7,9,0.32) 0%, rgba(1,7,9,0.24) 55%, rgba(1,7,9,0.10) 80%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-light"
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: '0.68rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(191, 239, 255, 0.72)',
              marginBottom: '2rem',
            }}
          >
            {eyebrow}
          </motion.p>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-light"
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 'clamp(1.55rem, 5.5vw, 3rem)',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              whiteSpace: 'normal',
              maxWidth: '100%',
              marginBottom: '1.25rem',
              color: '#F4F8FA',
              textShadow: '0 2px 24px rgba(0,0,0,0.85)',
            }}
          >
            {heading}
          </motion.h2>

          {/* Subtext */}
          {subtext !== null && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-light"
              style={{
                position: 'relative',
                zIndex: 1,
                fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
                lineHeight: 1.8,
                color: 'rgba(220, 232, 240, 0.78)',
                fontWeight: 500,
                maxWidth: '34rem',
                marginBottom: '2.5rem',
                textShadow: '0 1px 16px rgba(0,0,0,0.75)',
              }}
            >
              {subtext}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
          <a
            href={ctaHref}
            className="font-sans font-light footer-email-cta"
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
              transition: 'border-color 280ms, box-shadow 280ms, background 280ms, transform 100ms',
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
              el.style.transform   = ''
            }}
            onMouseDown={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.97)' }}
            onMouseUp={e => { (e.currentTarget as HTMLAnchorElement).style.transform = '' }}
          >
            {ctaLabel}
          </a>
          </motion.div>
        </div>

        {/* Footer bar */}
        <div
          className="footer-bottom-bar"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
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
              className="font-sans font-light footer-availability-text"
              style={{ fontSize: '0.73rem', letterSpacing: '0.1em', color: 'rgba(220, 232, 240, 0.76)' }}
            >
              Available for projects
            </span>
          </div>

          {/* Copyright */}
          <p
            className="font-sans font-light text-center footer-copyright-text"
            style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: 'rgba(210, 224, 232, 0.72)' }}
          >
            © {new Date().getFullYear()} Weavy. All rights reserved.
          </p>

          {/* Social links — kept well clear of the fixed WhatsApp button (see
              marginRight below: ~165px gap from the WhatsApp circle at desktop). */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifySelf: 'end',
              marginRight: 'clamp(24px, 10vw, 190px)',
            }}
          >
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="footer-social-icon"
                style={{
                  color: 'rgba(225, 236, 242, 0.78)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  filter: 'drop-shadow(0 0 8px rgba(125, 220, 255, 0.10))',
                  transition: 'opacity 0.25s ease, transform 0.25s ease, color 0.25s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.color = 'rgba(250, 253, 255, 0.96)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.color = 'rgba(225, 236, 242, 0.78)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>

    </footer>
  )
}
