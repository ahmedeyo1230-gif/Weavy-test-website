import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import weavyLogo from '../assets/weavy-logo.png'
import gsap from 'gsap'

const HLS_SRC =
  'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

const NAV_LINKS = [
  { label: 'Home',     href: '#home'     },
  { label: 'About',    href: '#about'    },
  { label: 'Services', href: '#section-9' },
  { label: 'Work',     href: '#work'     },
  { label: 'Blog',     href: '#blog'     },
  { label: 'Contact',  href: '#contact'  },
]

// ─── Logo (outside pill, left panel) ─────────────────────────────────────────

function NavLogo() {
  return (
    <a
      href="#home"
      aria-label="Weavy"
      className="self-stretch inline-flex items-center justify-center shrink-0
                 px-2.5 mr-2 bg-[#181818]
                 transition-opacity duration-200 hover:opacity-80"
    >
      <img
        src={weavyLogo}
        alt="Weavy"
        className="w-14 h-14 md:w-16 md:h-16 object-contain"
        draggable={false}
      />
    </a>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <span
      className="hidden sm:block w-px h-5 bg-stroke mx-1 shrink-0"
      aria-hidden="true"
    />
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function NavCta() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="#contact"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative shrink-0 rounded-full mx-1 p-[2px] transition-all duration-200"
      style={{
        background: hovered
          ? 'linear-gradient(135deg, hsl(199 89% 55% / 0.6), hsl(215 80% 45% / 0.4))'
          : 'transparent',
      }}
    >
      <span className="flex items-center gap-1.5 bg-surface rounded-full backdrop-blur-md text-text whitespace-nowrap text-xs sm:text-sm px-3 sm:px-3.5 py-1 sm:py-1.5">
        Say hi <span aria-hidden="true">→</span>
      </span>
    </a>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState('Home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 md:pt-6 px-4">

      <div className="flex justify-center">
        <nav
          aria-label="Main navigation"
          className={[
            'inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 overflow-hidden transition-shadow duration-300',
            scrolled ? 'shadow-md shadow-black/10' : '',
          ].join(' ')}
        >
          <NavLogo />

          <Divider />

          {/* Links — desktop */}
          <ul className="hidden sm:flex items-center gap-0.5" role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = active === label
              return (
                <li key={label}>
                  <a
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setActive(label)}
                    className={[
                      'block text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-colors duration-150',
                      isActive
                        ? 'text-text bg-stroke/50'
                        : 'text-muted hover:text-text hover:bg-stroke/50',
                    ].join(' ')}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>

          <Divider />

          <NavCta />

          {/* Hamburger — mobile only */}
          <button
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full mx-1 text-muted hover:text-text hover:bg-stroke/50 transition-colors duration-150"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(v => !v)}
          >
            <span className="flex flex-col gap-[5px] w-[14px]" aria-hidden="true">
              <span className={`block h-px bg-current transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </span>
          </button>
        </nav>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="sm:hidden mt-2 rounded-2xl border border-white/10 bg-surface/95 backdrop-blur-md overflow-hidden"
        >
          <ul role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = active === label
              return (
                <li key={label}>
                  <a
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => { setActive(label); setMenuOpen(false) }}
                    className={[
                      'block text-sm px-5 py-3.5 transition-colors duration-150 border-b border-stroke/40 last:border-0',
                      isActive ? 'text-text' : 'text-muted hover:text-text',
                    ].join(' ')}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </header>
  )
}

// ─── HLS Video ────────────────────────────────────────────────────────────────

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let cleanup: (() => void) | undefined

    import('hls.js').then(({ default: Hls }) => {
      if (!videoRef.current) return

      if (Hls.isSupported()) {
        const hls = new Hls({
          startLevel: -1,
          maxBufferLength: 20,
          maxMaxBufferLength: 40,
          lowLatencyMode: false,
        })
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

    return () => cleanup?.()
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover"
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const ROLES = ['Creatives', 'Developers', 'Founders', 'Designers']

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 2000)
    return () => clearInterval(id)
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Force initial states before paint
      gsap.set('.name-reveal', { opacity: 0, y: 50 })
      gsap.set('.blur-in', { opacity: 0, filter: 'blur(18px)', y: 24 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.to(
        '.name-reveal',
        { opacity: 1, y: 0, duration: 1.2 },
        0.1,
      )
      tl.to(
        '.blur-in',
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 },
        0.3,
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Navbar />

      <section
        ref={sectionRef}
        id="home"
        aria-labelledby="hero-heading"
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-bg"
      >
        <HeroVideo />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" aria-hidden="true" />

        {/* Bottom fade — matches VideoShowcase background */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
          aria-hidden="true"
          style={{ background: 'linear-gradient(to top, #02080A, transparent)' }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[60rem] mx-auto px-6 sm:px-10 flex flex-col items-center text-center">

          <p
            className="blur-in font-sans font-light uppercase mb-8"
            style={{ fontSize: '0.8rem', letterSpacing: '0.36em', color: 'hsl(0 0% 40%)' }}
          >
            Automation Agency
          </p>

          <h1
            id="hero-heading"
            className="name-reveal mb-5 font-sans font-light text-text"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.75rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
            }}
          >
            We build <Serif>systems</Serif> that{' '}
            <Serif>scale</Serif>
            <br className="hidden sm:block" />
            {' '}your business
          </h1>

          <p className="blur-in mb-6 font-sans font-light text-muted inline-flex items-baseline gap-[0.55em]"
             style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.55rem)' }}>
            <span className="inline-block">We</span>
            <span
              key={roleIndex}
              className="font-display italic text-text-primary animate-role-fade-in inline-block"
            >
              {ROLES[roleIndex]}
            </span>
            <span className="inline-block">live in London.</span>
          </p>

          <p
            className="blur-in mb-12 max-w-[38rem] font-sans font-light"
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
              lineHeight: 1.85,
              color: 'hsl(0 0% 52%)',
            }}
          >
            Automating growth, content, and communication
            so your brand runs smarter — not harder.
          </p>

          <div className="blur-in flex flex-col sm:flex-row items-center gap-3.5">
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full font-sans focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{
                fontWeight: 400,
                fontSize: 'clamp(0.85rem, 1.3vw, 0.93rem)',
                letterSpacing: '0.01em',
                background: 'hsl(0 0% 97%)',
                color: 'hsl(0 0% 4%)',
                padding: '0.85rem 2rem',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.82'; (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.98)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)' }}
            >
              Book a call <span aria-hidden="true">→</span>
            </a>

            <a
              href="#section-9"
              className="inline-flex items-center gap-2.5 rounded-full font-sans focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              style={{
                fontWeight: 400,
                fontSize: 'clamp(0.85rem, 1.3vw, 0.93rem)',
                letterSpacing: '0.01em',
                color: 'hsl(0 0% 60%)',
                border: '1px solid hsl(0 0% 16%)',
                padding: '0.85rem 2rem',
                transition: 'color 0.2s ease, border-color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = 'hsl(0 0% 92%)'; el.style.borderColor = 'hsl(0 0% 28%)'; el.style.background = 'hsl(0 0% 7%)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = 'hsl(0 0% 60%)'; el.style.borderColor = 'hsl(0 0% 16%)'; el.style.background = 'transparent' }}
            >
              View systems
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <span
            className="font-sans uppercase"
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.22em',
              color: 'hsl(0 0% 48%)',
              textShadow: '0 0 12px hsl(210 60% 70% / 0.3)',
            }}
          >
            Scroll
          </span>

          {/* Line track */}
          <div
            className="relative overflow-hidden"
            style={{
              width: '1.5px',
              height: '56px',
              background: 'hsl(0 0% 100% / 0.07)',
              borderRadius: '999px',
              boxShadow: '0 0 6px hsl(210 60% 65% / 0.15)',
            }}
          >
            {/* Animated highlight */}
            <span
              className="absolute left-0 rounded-full animate-scroll-down"
              style={{
                top: 0,
                width: '100%',
                height: '18px',
                background:
                  'linear-gradient(to bottom, hsl(210 80% 85% / 0.9), hsl(215 70% 65% / 0.4))',
                boxShadow:
                  '0 0 8px 2px hsl(210 80% 75% / 0.55), 0 0 18px 4px hsl(215 70% 65% / 0.25)',
              }}
            />
          </div>
        </div>

      </section>
    </>
  )
}

// ─── Serif helper ─────────────────────────────────────────────────────────────

function Serif({ children }: { children: React.ReactNode }) {
  return (
    <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
      {children}
    </em>
  )
}
