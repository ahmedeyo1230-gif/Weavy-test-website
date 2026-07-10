import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import weavyLogo from '../assets/weavy-logo-new.png'
import { goToPath } from '../lib/navigation'

const HLS_SRC = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'
const HERO_POSTER = 'https://image.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g/thumbnail.jpg?width=1200&time=1'

const ROLES = ['Creatives', 'Developers', 'Founders', 'Designers']

// Every top-level nav item is a real, always-clickable path — works the same
// from any page, in both directions.
const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Home',     href: '/'         },
  { label: 'About',    href: '/about'    },
  { label: 'Services', href: '/services' },
  { label: 'Work',     href: '/work'     },
  { label: 'Blog',     href: '/blog'     },
  { label: 'Contact',  href: '/contact'  },
]

const LABEL_BY_PATH: Record<string, string> = {
  '/': 'Home', '/about': 'About', '/services': 'Services',
  '/work': 'Work', '/blog': 'Blog', '/contact': 'Contact',
}
function labelFromPath() {
  return LABEL_BY_PATH[window.location.pathname] ?? 'Home'
}

// ─── HLS Video Background ─────────────────────────────────────────────────────

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Respect reduced-motion users: keep the static poster frame, skip streaming + playback.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Belt-and-braces: some mobile browsers (particularly iOS Safari) only honour
    // muted autoplay — and skip the native play-button overlay — when `muted` /
    // `defaultMuted` are forced on the element before any src is attached and
    // again once media data is available, not just via the JSX attribute.
    const forceMuted = () => { video.muted = true; video.defaultMuted = true }
    const attemptPlay = () => { forceMuted(); video.play().catch(() => {}) }

    forceMuted()
    video.addEventListener('loadedmetadata', attemptPlay)
    video.addEventListener('canplay', attemptPlay)

    // Mobile browsers frequently pause/stall a playing video without resuming it
    // themselves — backgrounding the tab/app, a brief memory-pressure hiccup, or
    // scrolling the hero out of view and back — which is what a "frozen wave"
    // report on a phone usually is (the stream already started once, then stopped).
    // Re-attempt playback whenever that happens or the page becomes visible again.
    video.addEventListener('pause', attemptPlay)
    video.addEventListener('stalled', attemptPlay)
    video.addEventListener('suspend', attemptPlay)
    const onVisibilityChange = () => { if (!document.hidden) attemptPlay() }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) attemptPlay()
    }, { threshold: 0.1 })
    io.observe(video)

    let cleanup: (() => void) | undefined

    import('hls.js').then(({ default: Hls }) => {
      if (!videoRef.current) return
      if (Hls.isSupported()) {
        const hls = new Hls({ startLevel: -1, maxBufferLength: 20, maxMaxBufferLength: 40 })
        hls.loadSource(HLS_SRC)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, attemptPlay)
        cleanup = () => hls.destroy()
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (Safari) — last-resort fallback if hls.js somehow reports
        // unsupported: still assign the source directly rather than leaving
        // the poster frame up permanently.
        video.src = HLS_SRC
        attemptPlay()
      } else {
        video.src = HLS_SRC
        attemptPlay()
      }
    })

    return () => {
      video.removeEventListener('loadedmetadata', attemptPlay)
      video.removeEventListener('canplay', attemptPlay)
      video.removeEventListener('pause', attemptPlay)
      video.removeEventListener('stalled', attemptPlay)
      video.removeEventListener('suspend', attemptPlay)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      io.disconnect()
      cleanup?.()
    }
  }, [])

  // Same video on every viewport — no `controls`, so there is never a native
  // play button; if autoplay is blocked or playback errors out, the `poster`
  // frame simply stays on screen as a fallback.
  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      controls={false}
      preload="auto"
      poster={HERO_POSTER}
      aria-hidden="true"
      // eslint-disable-next-line react/no-unknown-property -- legacy iOS Safari (<10) attribute
      webkit-playsinline="true"
      className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover pointer-events-none"
      style={{
        transform: 'translate(-50%, -50%)',
        opacity: 0.94,
        filter: 'brightness(0.78) contrast(1.05) saturate(0.88)',
      }}
    />
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const [active,   setActive]   = useState<string>(() => (typeof window !== 'undefined' ? labelFromPath() : 'Home'))
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep the active highlight in sync with the real route — covers back/forward
  // navigation and any navigation that didn't originate from clicking a nav link.
  useEffect(() => {
    const onNav = () => setActive(labelFromPath())
    window.addEventListener('popstate', onNav)
    return () => window.removeEventListener('popstate', onNav)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl navbar-pos${scrolled ? ' is-scrolled' : ''}`}
    >
      <nav
        aria-label="Main navigation"
        className="glass-panel rounded-full px-3 py-0 flex items-center justify-between gap-2"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Logo */}
        <a
          href="/"
          aria-label="Weavy"
          className="flex items-center shrink-0 -my-3 ml-4"
          onClick={(e) => { e.preventDefault(); setActive('Home'); goToPath('/') }}
        >
          <img src={weavyLogo} alt="Weavy" className="w-[4.75rem] h-[4.75rem] md:w-24 md:h-24 object-contain" decoding="async" draggable={false} />
        </a>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-0.5" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = active === label
            return (
              <li key={label}>
                <a
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    setActive(label)
                    goToPath(href)
                  }}
                  className={`relative block text-xs sm:text-sm px-3 py-1.5 rounded-full transition-colors duration-150 active:scale-[0.97] ${
                    isActive ? 'text-primary bg-white/10' : 'text-muted hover:text-primary hover:bg-white/5'
                  }`}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* CTA */}
        <a
          href="/contact"
          onClick={(e) => { e.preventDefault(); setActive('Contact'); goToPath('/contact') }}
          className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-background text-xs sm:text-sm px-4 py-2 rounded-full font-medium transition-colors duration-150 hover:bg-white hover:shadow-[0_0_20px_rgba(245,245,245,0.25)] active:scale-[0.97] shrink-0"
          style={{ transition: 'color 150ms, background-color 150ms, box-shadow 150ms, transform 100ms' }}
        >
          Say hi →
        </a>

        {/* Hamburger – mobile/tablet. Brighter ice-white (vs. the dim --color-muted
            used elsewhere) so the three lines stay clearly visible against the
            dark navbar glass, not just on hover. */}
        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full hover:text-primary hover:bg-white/5 transition-colors"
          style={{ color: 'rgba(235, 245, 255, 0.88)' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className="flex flex-col gap-[5px] w-[14px]" aria-hidden="true">
            <span className={`block h-[1.5px] bg-current transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-[1.5px] bg-current transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-[1.5px] bg-current transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </span>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden mt-2 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(1, 7, 9, 0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            <ul role="list">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault()
                      setActive(label)
                      setMenuOpen(false)
                      goToPath(href)
                    }}
                    className="block px-6 py-4 last:border-0 transition-all duration-150"
                    style={{
                      color: 'rgba(248, 250, 252, 0.92)',
                      fontSize: '0.92rem',
                      letterSpacing: '0.015em',
                      fontWeight: 400,
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                    }}
                    onTouchStart={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.06)' }}
                    onTouchEnd={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(248,250,252,0.92)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '' }}
                  >
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 3000)
    return () => clearInterval(id)
  }, [])

  // On mobile/tablet remove expensive filter:blur animation — just opacity + y
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: isMobile ? 0.08 : 0.15, delayChildren: isMobile ? 0.1 : 0.3 },
    },
  }
  const itemVariants = isMobile
    ? {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1, y: 0,
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
        },
      }
    : {
        hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
        visible: {
          opacity: 1, y: 0, filter: 'blur(0px)',
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
        },
      }

  return (
    <>
      <Navbar />

      <section
        id="home"
        aria-labelledby="hero-heading"
        className="relative min-h-screen flex items-center justify-center overflow-hidden max-sm:pb-20"
        style={{
          background:
            'radial-gradient(circle at 80% 10%, rgba(80,180,180,0.07), transparent 30%),' +
            '#071011',
        }}
      >
        <HeroVideo />

        {/* Cinematic background glows */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-[520px] h-[520px] bg-accent-cyan/[0.09] rounded-full blur-[130px]" />
          <div className="absolute top-[60%] left-[30%] w-[400px] h-[400px] rounded-full blur-[110px]" style={{ background: 'hsl(270 50% 20% / 0.06)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(1,7,9,0.30) 62%, rgba(1,7,9,0.58) 90%)' }} />
        </div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center"
        >
          {/* Styling lives in the `.hero-eyebrow` rule in index.css (not Tailwind
              text-[…]/tracking-[…] utilities) because the global "p { font-size:
              16px }" mobile-readability rule there is un-layered and otherwise
              overrides any Tailwind utility below the 1024px breakpoint. */}
          <motion.p
            variants={itemVariants}
            className="hero-eyebrow mb-6 mt-6 font-medium"
          >
            <span className="uppercase">Managed AI Platform</span>
          </motion.p>

          <div className="relative">
            {/* Water shimmer layer around heading */}
            <div className="hero-water-layer" aria-hidden="true">
              {/* top shimmer line removed */}
              <div className="water-shimmer-line" style={{ top: '52%',  animationDelay: '3.8s',  animationDuration: '13s' }} />
              <div className="water-shimmer-line" style={{ top: '82%',  animationDelay: '7.2s',  animationDuration: '9.5s' }} />
              <div className="water-drop" style={{ left: '4%',  top: '40%', animationDelay: '0s',   animationDuration: '7s'   }} />
              <div className="water-drop" style={{ left: '96%', top: '25%', animationDelay: '2.4s', animationDuration: '8.5s' }} />
              <div className="water-drop" style={{ left: '18%', top: '8%',  animationDelay: '4.8s', animationDuration: '6.8s' }} />
              <div className="water-drop" style={{ left: '82%', top: '70%', animationDelay: '1.2s', animationDuration: '9.2s' }} />
              <div className="water-drop" style={{ left: '48%', top: '3%',  animationDelay: '3.3s', animationDuration: '7.8s' }} />
              <div className="water-drop" style={{ left: '10%', top: '85%', animationDelay: '6.1s', animationDuration: '8s'   }} />
              <div className="water-drop" style={{ left: '88%', top: '15%', animationDelay: '0.7s', animationDuration: '7.2s' }} />
              <div className="water-drop" style={{ left: '62%', top: '92%', animationDelay: '5.5s', animationDuration: '6.5s' }} />
            </div>

            <motion.h1
              id="hero-heading"
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[1.1] mb-8 max-w-4xl relative z-10"
            >
              <span style={{ color: '#F4F8FA' }}>AI Automation</span>{' '}
              <em
                className="font-serif italic"
                style={{
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #7DDCFF 48%, #B7AEFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 0 24px rgba(125, 220, 255, 0.16)',
                }}
              >
                Platform
              </em>
              <br className="hidden sm:block" />
              <span style={{ color: 'rgba(235, 245, 255, 0.88)' }}>
                {' '}for growing businesses
              </span>
            </motion.h1>
          </div>

          <motion.div
            variants={itemVariants}
            className="text-lg sm:text-xl mb-8 flex items-center justify-center gap-[6px] flex-wrap font-light"
            style={{ color: '#94A3B8' }}
          >
            <span>We</span>
            {/* inline-grid spacer: invisible widest word sets exact container width, no dead space */}
            <span className="relative inline-grid">
              <span className="invisible font-serif italic font-medium text-primary select-none" aria-hidden="true">Developers</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROLES[roleIndex]}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center text-primary font-medium font-serif italic whitespace-nowrap"
                >
                  {ROLES[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>live in London.</span>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="max-w-xl mx-auto mb-12 leading-relaxed text-sm sm:text-base font-medium"
            style={{ color: '#CBD5E1', lineHeight: 1.75 }}
          >
            Weavy helps SMEs capture leads, respond instantly, automate bookings, and manage
            customer conversations across voice, WhatsApp, Instagram, Facebook, and CRM —
            all from one intelligent platform.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); goToPath('/contact') }}
              className="btn-glow-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium bg-primary text-background hover:bg-white hover:shadow-[0_0_28px_rgba(245,245,245,0.28)] active:scale-[0.97]"
              style={{ transition: 'background-color 200ms, box-shadow 200ms, transform 100ms' }}
            >
              Book a Platform Demo →
            </a>
            <a
              href="/services"
              onClick={(e) => { e.preventDefault(); goToPath('/services') }}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium border border-border text-primary hover:border-white/25 hover:bg-white/[0.04] hover:shadow-[0_0_16px_hsl(199_89%_60%_/_0.08)] active:scale-[0.97]"
              style={{ transition: 'border-color 200ms, background-color 200ms, box-shadow 200ms, transform 100ms' }}
            >
              Explore the Platform
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator — sits above the bottom fade/blend layers (which
            paint later in the DOM at the same auto z-level) so it stays visible. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <span
            className="text-[10px] uppercase tracking-widest"
            style={{ color: 'rgba(125,220,255,0.55)', letterSpacing: '0.26em' }}
          >Scroll</span>
          <div
            className="relative"
            style={{ width: '1px', height: '56px', background: 'rgba(125,220,255,0.22)' }}
          >
            {/* Small glowing dot travelling down the line — CSS-driven so it keeps
                animating smoothly regardless of JS timing; static (centred) when
                reduced motion is preferred (see .hero-scroll-dot in index.css). */}
            <span
              className="hero-scroll-dot"
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                width: '5px',
                height: '5px',
                borderRadius: '9999px',
                background: 'rgba(125,220,255,0.85)',
                boxShadow: '0 0 12px rgba(125,220,255,0.45)',
                transform: 'translateX(-50%)',
              }}
            />
          </div>
        </motion.div>

        {/* Bottom fade into VideoShowcase */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          aria-hidden="true"
          style={{
            height: '340px',
            background: 'linear-gradient(to top, #010709 0%, #010709 10%, rgba(1,7,9,0.92) 28%, rgba(1,7,9,0.60) 50%, rgba(1,7,9,0.18) 75%, transparent 100%)',
          }}
        />

        {/* Mobile-only extra blend — the wave reads brighter/more exposed at the
            very bottom on narrow portrait viewports, so darken that strip a bit
            more on top of the fade above; untouched at md+ (tablet/desktop). */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 md:hidden"
          aria-hidden="true"
          style={{
            height: '220px',
            background: 'linear-gradient(to bottom, rgba(1,7,9,0) 0%, rgba(1,7,9,0.65) 55%, #010709 100%)',
          }}
        />
      </section>
    </>
  )
}
