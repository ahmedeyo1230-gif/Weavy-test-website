import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import weavyLogo from '../assets/weavy-logo-new.png'

const HLS_SRC = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

const ROLES = ['Creatives', 'Developers', 'Founders', 'Designers']

const NAV_LINKS = [
  { label: 'Home',     href: '#home'      },
  { label: 'About',    href: '#about'     },
  { label: 'Services', href: '#section-9' },
  { label: 'Work',     href: '#work'      },
  { label: 'Blog',     href: '#blog'      },
  { label: 'Contact',  href: '#contact'   },
]

// ─── HLS Video Background ─────────────────────────────────────────────────────

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let cleanup: (() => void) | undefined

    import('hls.js').then(({ default: Hls }) => {
      if (!videoRef.current) return
      if (Hls.isSupported()) {
        const hls = new Hls({ startLevel: -1, maxBufferLength: 20, maxMaxBufferLength: 40 })
        hls.loadSource(HLS_SRC)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}) })
        cleanup = () => hls.destroy()
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = HLS_SRC
        video.play().catch(() => {})
      }
    })

    return () => cleanup?.()
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay muted loop playsInline preload="none"
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover"
      style={{
        transform: 'translate(-50%, -50%)',
        opacity: 0.88,
        filter: 'brightness(1.10) contrast(1.50) saturate(1.25)',
      }}
    />
  )
}

// ─── Sea layer — two rising wave bodies + ambient glow ───────────────────────

function SeaEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="hero-sea-ambient" />
      <div className="hero-sea-wave-1" />
      <div className="hero-sea-wave-2" />
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const [active,   setActive]   = useState('Home')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl transition-all duration-500 ${scrolled ? 'top-0.5' : 'top-1 md:top-1.5'}`}
    >
      <nav
        aria-label="Main navigation"
        className="glass-panel rounded-full px-3 py-0 flex items-center justify-between gap-2"
      >
        {/* Logo */}
        <a href="#home" aria-label="Weavy" className="flex items-center shrink-0 -my-3 ml-4">
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
                  onClick={() => setActive(label)}
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
          href="#contact"
          className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-background text-xs sm:text-sm px-4 py-2 rounded-full font-medium transition-colors duration-150 hover:bg-white hover:shadow-[0_0_20px_rgba(245,245,245,0.25)] active:scale-[0.97] shrink-0"
          style={{ transition: 'color 150ms, background-color 150ms, box-shadow 150ms, transform 100ms' }}
        >
          Say hi →
        </a>

        {/* Hamburger – mobile */}
        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-primary hover:bg-white/5 transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className="flex flex-col gap-[5px] w-[14px]" aria-hidden="true">
            <span className={`block h-px bg-current transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
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
            className="sm:hidden mt-2 rounded-2xl glass-panel overflow-hidden"
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
                    onClick={() => { setActive(label); setMenuOpen(false) }}
                    className="block text-sm px-5 py-3.5 text-muted hover:text-primary border-b border-border/40 last:border-0 transition-colors duration-150 active:bg-white/5"
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
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.38)_62%,#0a0a0a_90%)]" />
        </div>

        {/* Cinematic sea layer — wave rises from bottom toward heading */}
        <SeaEffects />

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center"
        >
          <motion.p
            variants={itemVariants}
            className="text-[10px] sm:text-xs uppercase tracking-widest mb-6 mt-6 font-medium"
            style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
          >
            Automation Agency
          </motion.p>

          <div className="relative">
            {/* Glow bloom + sweep shimmers fired when wave crests at heading level */}
            <div className="hero-heading-sea-glow" aria-hidden="true" />
            <div className="hero-heading-wave-shimmer" aria-hidden="true" />
            <div className="hero-heading-wave-shimmer" aria-hidden="true" style={{ top: '28%', animationDelay: '-0.65s', opacity: 0.72 }} />
            {/* Water shimmer layer around heading */}
            <div className="hero-water-layer" aria-hidden="true">
              <div className="water-shimmer-line" style={{ top: '18%',  animationDelay: '0s',    animationDuration: '10s' }} />
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
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[1.1] mb-8 max-w-4xl text-primary relative z-10"
            >
              We build{' '}
              <em className="font-serif italic">systems</em>
              {' '}that{' '}
              <em className="font-serif italic">scale</em>
              <br className="hidden sm:block" />
              {' '}your business
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
            Automating growth, content, and communication so your brand runs smarter — not harder.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <a
              href="#contact"
              className="btn-glow-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium bg-primary text-background hover:bg-white hover:shadow-[0_0_28px_rgba(245,245,245,0.28)] active:scale-[0.97]"
              style={{ transition: 'background-color 200ms, box-shadow 200ms, transform 100ms' }}
            >
              Book a call →
            </a>
            <a
              href="#section-9"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium border border-border text-primary hover:border-white/25 hover:bg-white/[0.04] hover:shadow-[0_0_16px_hsl(199_89%_60%_/_0.08)] active:scale-[0.97]"
              style={{ transition: 'border-color 200ms, background-color 200ms, box-shadow 200ms, transform 100ms' }}
            >
              View systems
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-widest text-muted">Scroll</span>
          <div className="w-px h-14 bg-border relative overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-accent-cyan to-transparent"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Bottom fade into VideoShowcase */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          aria-hidden="true"
          style={{
            height: '340px',
            background: 'linear-gradient(to top, #010709 0%, #020A0B 14%, rgba(2,10,11,0.85) 36%, rgba(2,10,11,0.42) 58%, rgba(2,10,11,0.1) 80%, transparent 100%)',
          }}
        />
      </section>
    </>
  )
}
