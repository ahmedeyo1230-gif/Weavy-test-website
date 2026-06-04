import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const ROWS = [
  {
    num: '01',
    title: 'Strategy before design',
    body: 'We define the audience, message, and conversion path before building the visual experience.',
  },
  {
    num: '02',
    title: 'Premium execution',
    body: 'Every layout, animation, border, spacing decision, and interaction is refined to feel polished and intentional.',
  },
  {
    num: '03',
    title: 'Automation with purpose',
    body: 'We create systems that save time, improve response speed, and help businesses capture opportunities faster.',
  },
  {
    num: '04',
    title: 'Built to scale',
    body: 'From launch to growth, every section is designed to stay consistent, responsive, and easy to improve.',
  },
]

export default function WhyWeavyWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const textEls = el.querySelectorAll('.wyw-text')
    const rowEls  = el.querySelectorAll('.wyw-row')

    gsap.set(textEls, { opacity: 0, y: 34 })
    gsap.set(rowEls,  { opacity: 0, y: 22 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(textEls, { opacity: 1, y: 0, duration: 1.0, stagger: 0.14 }, 0)
      tl.to(rowEls,  { opacity: 1, y: 0, duration: 0.75, stagger: 0.13 }, 0.22)
      obs.disconnect()
    }, { threshold: 0.1 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 9rem) 0' }}
    >
      {/* Grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.02 }}>
        <filter id="wyw-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#wyw-gr)" fill="white"/>
      </svg>

      {/* Ambient glow — right side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 55% 60% at 100% 50%, hsl(199 89% 60% / 0.032) 0%, transparent 70%)',
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

      <style>{`
        .wyw-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2.5rem, 4vw, 4rem);
          align-items: center;
        }
        @media (min-width: 1024px) {
          .wyw-grid {
            grid-template-columns: 0.9fr 0.7fr 1fr;
          }
        }
      `}</style>
      <div className="relative z-10 max-w-[88rem] mx-auto px-6 sm:px-10">
        <div className="wyw-grid">

          {/* ── LEFT: copy ── */}
          <div className="lg:self-start lg:sticky lg:top-32" style={{ order: 1 }}>

            {/* Label */}
            <p
              className="wyw-text font-sans font-light uppercase mb-6"
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.32em',
                color: 'hsl(199 89% 60% / 0.7)',
              }}
            >
              Why Weavy Works
            </p>

            {/* Headline */}
            <h2
              className="wyw-text font-sans font-light mb-8"
              style={{
                fontSize: 'clamp(1.9rem, 3.8vw, 3.1rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.035em',
                color: 'hsl(0 0% 96%)',
              }}
            >
              Built with strategy,{' '}
              <em style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'hsl(0 0% 76%)',
              }}>
                polished
              </em>{' '}
              with design, powered by automation.
            </h2>

            {/* Accent rule */}
            <div
              className="wyw-text"
              aria-hidden="true"
              style={{
                width: '2rem',
                height: '1px',
                background: 'hsl(199 89% 60% / 0.35)',
                marginBottom: '1.8rem',
              }}
            />

            {/* Supporting paragraph */}
            <p
              className="wyw-text font-sans font-light"
              style={{
                fontSize: 'clamp(0.88rem, 1.4vw, 1.02rem)',
                lineHeight: 1.9,
                color: 'hsl(0 0% 40%)',
                maxWidth: '36rem',
              }}
            >
              Weavy combines premium digital design with practical AI automation,
              so every section, system, and interaction is created with a clear purpose:
              attract attention, build trust, reduce manual work, and move visitors toward action.
            </p>

          </div>

          {/* ── MIDDLE: image ── */}
          <div
            className="flex items-center justify-center"
            style={{ order: 2 }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              {/* Ambient glow */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse 80% 80% at 50% 50%, hsl(199 89% 60% / 0.14) 0%, transparent 70%)',
                  filter: 'blur(32px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              <img
                src="/brand_assets/New_now.png"
                alt="Weavy platform visual"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'block',
                  width: '100%',
                  maxHeight: '540px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 30px 90px rgba(56,189,248,0.22))',
                  margin: '0 auto',
                }}
              />
            </div>
          </div>

          {/* ── RIGHT: numbered rows ── */}
          <div style={{ order: 3 }}>
            {ROWS.map(({ num, title, body }, i) => (
              <div
                key={num}
                className="wyw-row"
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  position: 'relative',
                  borderTop: `1px solid ${hoveredRow === i ? 'hsl(199 89% 60% / 0.16)' : 'hsl(0 0% 100% / 0.06)'}`,
                  padding: '1.9rem 0 1.9rem 1.6rem',
                  cursor: 'default',
                  transition: 'border-color 0.3s ease',
                }}
              >
                {/* Left accent bar — visible on hover */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '1px',
                    left: 0,
                    bottom: 0,
                    width: '1.5px',
                    borderRadius: '1px',
                    background: 'linear-gradient(to bottom, hsl(199 89% 60% / 0.7), hsl(199 89% 60% / 0.05))',
                    opacity: hoveredRow === i ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />

                {/* Row content — slides right on hover */}
                <div
                  style={{
                    transform: hoveredRow === i ? 'translateX(5px)' : 'translateX(0)',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Number */}
                  <span
                    className="font-sans"
                    style={{
                      display: 'block',
                      fontSize: '0.58rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: hoveredRow === i
                        ? 'hsl(199 89% 60%)'
                        : 'hsl(199 89% 60% / 0.4)',
                      marginBottom: '0.65rem',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {num}
                  </span>

                  {/* Title */}
                  <p
                    className="font-sans font-light"
                    style={{
                      fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                      lineHeight: 1.3,
                      letterSpacing: '-0.02em',
                      color: hoveredRow === i ? 'hsl(0 0% 94%)' : 'hsl(0 0% 76%)',
                      marginBottom: '0.6rem',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {title}
                  </p>

                  {/* Body */}
                  <p
                    className="font-sans font-light"
                    style={{
                      fontSize: 'clamp(0.82rem, 1.2vw, 0.9rem)',
                      lineHeight: 1.85,
                      color: 'hsl(0 0% 34%)',
                    }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            ))}

            {/* Closing bottom rule */}
            <div
              aria-hidden="true"
              style={{ height: '1px', background: 'hsl(0 0% 100% / 0.06)' }}
            />
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
