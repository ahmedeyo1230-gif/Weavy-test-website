import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const LARGE_OUTCOME = {
  num: '01',
  title: 'More enquiries captured',
  body: 'Clear journeys and stronger calls to action help turn visitors into qualified leads — without increasing ad spend.',
}

const SMALL_OUTCOMES = [
  {
    num: '02',
    title: 'Faster customer response',
    body: 'AI chatbots reduce waiting time across website, WhatsApp, Instagram, and Messenger.',
  },
  {
    num: '03',
    title: 'Stronger brand trust',
    body: 'Premium design and consistent visuals make your business feel more credible.',
  },
  {
    num: '04',
    title: 'Less manual work',
    body: 'Automation removes repetitive tasks so your team can focus on service, sales, and growth.',
  },
]

function StatusDot({ dotRef }: { dotRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
      <div
        ref={dotRef}
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'hsl(199 89% 60%)',
          boxShadow: '0 0 6px hsl(199 89% 60% / 0.6)',
          flexShrink: 0,
          transformOrigin: 'center',
        }}
      />
      <span
        className="font-sans"
        style={{
          fontSize: '0.52rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'hsl(199 89% 60% / 0.45)',
        }}
      >
        Active
      </span>
    </div>
  )
}

export default function SelectedOutcomes() {
  const sectionRef  = useRef<HTMLElement>(null)
  const dotRefs     = useRef<(HTMLDivElement | null)[]>([])
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const headerEls = el.querySelectorAll('.so-header-el')
    const blockEls  = el.querySelectorAll('.so-block')
    const dots      = dotRefs.current.filter(Boolean) as HTMLDivElement[]

    gsap.set(headerEls, { opacity: 0, y: 32 })
    gsap.set(blockEls,  { opacity: 0, y: 28 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(headerEls, { opacity: 1, y: 0, duration: 1.0, stagger: 0.12 }, 0)
      tl.to(blockEls,  { opacity: 1, y: 0, duration: 0.85, stagger: 0.1 }, 0.28)

      // Continuous pulse on all dots
      dots.forEach((dot, i) => {
        gsap.to(dot, {
          opacity: 0.25,
          scale: 0.65,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.35,
        })
      })

      obs.disconnect()
    }, { threshold: 0.08 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Block style helpers
  const blockBase = (isLarge = false): React.CSSProperties => ({
    position: 'relative',
    borderRadius: '32px',
    border: '1px solid hsl(0 0% 100% / 0.07)',
    background: isLarge
      ? 'linear-gradient(145deg, hsl(0 0% 100% / 0.04) 0%, hsl(199 89% 60% / 0.025) 100%)'
      : 'hsl(0 0% 100% / 0.025)',
    padding: isLarge ? 'clamp(2rem, 4vw, 2.8rem)' : 'clamp(1.5rem, 3vw, 2rem)',
    overflow: 'hidden',
    cursor: 'default',
    transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  })

  const blockHover: React.CSSProperties = {
    borderColor: 'hsl(199 89% 60% / 0.22)',
    boxShadow: '0 0 40px hsl(199 89% 60% / 0.055), 0 12px 40px hsl(0 0% 0% / 0.35)',
    transform: 'translateY(-3px)',
  }

  const blockIdle: React.CSSProperties = {
    borderColor: 'hsl(0 0% 100% / 0.07)',
    boxShadow: '0 4px 24px hsl(0 0% 0% / 0.2)',
    transform: 'translateY(0px)',
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 9rem) 0' }}
    >
      {/* Grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.018 }}>
        <filter id="so-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#so-gr)" fill="white"/>
      </svg>

      {/* Ambient top-center glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, hsl(199 89% 60% / 0.04) 0%, transparent 70%)',
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
        <div className="text-center mb-14 lg:mb-16">
          <p
            className="so-header-el font-sans font-light uppercase mb-5"
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.34em',
              color: 'hsl(199 89% 60% / 0.65)',
            }}
          >
            Selected Outcomes
          </p>

          <h2
            className="so-header-el font-sans font-light mx-auto"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: 'hsl(0 0% 96%)',
              maxWidth: '38rem',
              marginBottom: '1.5rem',
            }}
          >
            Built to turn attention into{' '}
            <em style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'hsl(0 0% 70%)',
            }}>
              measurable growth.
            </em>
          </h2>

          <p
            className="so-header-el font-sans font-light mx-auto"
            style={{
              fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
              lineHeight: 1.9,
              color: 'hsl(0 0% 38%)',
              maxWidth: '34rem',
            }}
          >
            Every Weavy system is designed to help your business respond faster,
            communicate clearer, and convert more opportunities with less manual effort.
          </p>
        </div>

        {/* ── Bento grid ── */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-5 items-stretch">

          {/* ─── Large featured block ─── */}
          <div
            className="so-block"
            onMouseEnter={() => setHovered(0)}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...blockBase(true),
              ...(hovered === 0 ? blockHover : blockIdle),
              flex: '1.25',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 'clamp(300px, 36vw, 420px)',
            }}
          >
            {/* Top row: number + dot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <span
                className="font-sans"
                style={{
                  fontSize: '0.56rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'hsl(199 89% 60% / 0.5)',
                }}
              >
                {LARGE_OUTCOME.num}
              </span>
              <StatusDot dotRef={el => { dotRefs.current[0] = el }} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {/* Subtle watermark number */}
              <div
                aria-hidden="true"
                className="font-sans"
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '2rem',
                  fontSize: 'clamp(6rem, 12vw, 10rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.06em',
                  color: 'hsl(0 0% 100% / 0.025)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                01
              </div>

              <h3
                className="font-sans font-light"
                style={{
                  fontSize: 'clamp(1.4rem, 2.8vw, 2rem)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.03em',
                  color: 'hsl(0 0% 94%)',
                  marginBottom: '1rem',
                }}
              >
                {LARGE_OUTCOME.title}
              </h3>

              <p
                className="font-sans font-light"
                style={{
                  fontSize: 'clamp(0.85rem, 1.3vw, 0.95rem)',
                  lineHeight: 1.85,
                  color: 'hsl(0 0% 38%)',
                  maxWidth: '28rem',
                }}
              >
                {LARGE_OUTCOME.body}
              </p>
            </div>

            {/* Bottom accent line */}
            <div
              aria-hidden="true"
              style={{
                marginTop: '2rem',
                height: '1px',
                background: `linear-gradient(to right, hsl(199 89% 60% / ${hovered === 0 ? '0.3' : '0.08'}), transparent)`,
                transition: 'background 0.4s ease',
              }}
            />
          </div>

          {/* ─── Subtle vertical divider (desktop only) ─── */}
          <div
            aria-hidden="true"
            className="hidden lg:block self-stretch"
            style={{
              width: '1px',
              background: 'linear-gradient(to bottom, transparent 5%, hsl(199 89% 60% / 0.1) 40%, hsl(199 89% 60% / 0.1) 60%, transparent 95%)',
              flexShrink: 0,
            }}
          />

          {/* ─── 3 small blocks ─── */}
          <div
            className="flex flex-col gap-4 lg:gap-5"
            style={{ flex: '0.85' }}
          >
            {SMALL_OUTCOMES.map(({ num, title, body }, i) => {
              const idx = i + 1
              return (
                <div
                  key={num}
                  className="so-block"
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    ...blockBase(false),
                    ...(hovered === idx ? blockHover : blockIdle),
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span
                      className="font-sans"
                      style={{
                        fontSize: '0.54rem',
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase',
                        color: 'hsl(199 89% 60% / 0.45)',
                      }}
                    >
                      {num}
                    </span>
                    <StatusDot dotRef={el => { dotRefs.current[idx] = el }} />
                  </div>

                  <h3
                    className="font-sans font-light"
                    style={{
                      fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)',
                      lineHeight: 1.3,
                      letterSpacing: '-0.02em',
                      color: 'hsl(0 0% 88%)',
                      marginBottom: '0.55rem',
                    }}
                  >
                    {title}
                  </h3>

                  <p
                    className="font-sans font-light"
                    style={{
                      fontSize: 'clamp(0.78rem, 1.1vw, 0.86rem)',
                      lineHeight: 1.85,
                      color: 'hsl(0 0% 34%)',
                    }}
                  >
                    {body}
                  </p>
                </div>
              )
            })}
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
