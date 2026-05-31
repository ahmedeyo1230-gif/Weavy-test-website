import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WavePath } from './ui/wave-path'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  { num: '1', title: 'Websites',    desc: 'Bespoke digital experiences built for performance and conversion.' },
  { num: '2', title: 'Automation',  desc: 'AI-powered workflows that run your business around the clock.' },
  { num: '3', title: 'Chatbots',    desc: '24/7 intelligent engagement that qualifies and converts leads.' },
  { num: '4', title: 'Content',     desc: 'Social media and UGC at scale — without lifting a finger.' },
]

export default function WaveTransition() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef    = useRef<SVGLineElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.wt-eyebrow, .wt-heading', { opacity: 0, y: 28 })
      gsap.set('.wt-num', { opacity: 0, scale: 0.6 })
      lineRef.current.forEach(l => {
        if (!l) return
        const len = l.getTotalLength?.() ?? 60
        gsap.set(l, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.set('.wt-title, .wt-desc', { opacity: 0, x: -18 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 72%',
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

          tl.to('.wt-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0)
          tl.to('.wt-heading',  { opacity: 1, y: 0, duration: 0.9 }, 0.1)

          ITEMS.forEach((_, i) => {
            const delay = 0.35 + i * 0.18
            tl.to(`.wt-num-${i}`,  { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, delay)
            tl.to(`.wt-line-${i}`, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, delay + 0.12)
            tl.to(`.wt-text-${i}`, { opacity: 1, x: 0, duration: 0.55 }, delay + 0.22)
          })
        },
        once: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
    >
      {/* Radial ambient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(199 89% 60% / 0.07) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Top fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
          background: 'linear-gradient(to bottom, #02080A, transparent)',
          pointerEvents: 'none', zIndex: 2,
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full">

        <div className="flex w-[70vw] flex-col items-end">

          {/* Wave */}
          <WavePath className="mb-10 text-[hsl(199_89%_60%/0.5)]" />

          {/* Eyebrow + heading */}
          <div className="flex w-full flex-col items-end mb-16">
            <div className="flex justify-end gap-10 items-start w-full">
              <p
                className="wt-eyebrow font-sans font-light mt-2 shrink-0"
                style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'hsl(0 0% 38%)' }}
              >
                What we do
              </p>
              <p
                className="wt-heading font-sans font-light"
                style={{ width: '72%', fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', lineHeight: 1.45, letterSpacing: '-0.025em', color: 'hsl(0 0% 82%)' }}
              >
                Intelligent systems that make your brand grow — automatically, consistently, and at scale.
              </p>
            </div>
          </div>

          {/* Numbered items */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
            {ITEMS.map(({ num, title, desc }, i) => (
              <div key={num} className="flex flex-col gap-0">

                {/* Number + connector line */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`wt-num wt-num-${i} shrink-0`}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      border: '1px solid hsl(199 89% 60% / 0.4)',
                      background: 'hsl(199 89% 60% / 0.07)',
                      boxShadow: '0 0 16px -4px hsl(199 89% 60% / 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="font-sans"
                      style={{ fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.05em', color: 'hsl(199 89% 68%)' }}
                    >
                      {num}
                    </span>
                  </div>

                  <svg aria-hidden="true" className="flex-1" height="2" style={{ overflow: 'visible' }}>
                    <line
                      ref={el => { if (el) lineRef.current[i] = el }}
                      className={`wt-line-${i}`}
                      x1="0" y1="1" x2="100%" y2="1"
                      stroke="hsl(199 89% 60% / 0.35)"
                      strokeWidth="1"
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 3px hsl(199 89% 60% / 0.4))' }}
                    />
                  </svg>
                </div>

                {/* Text */}
                <div className={`wt-text-${i}`} style={{ paddingLeft: '0.25rem' }}>
                  <p
                    className="wt-title font-sans font-light text-text mb-2"
                    style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', letterSpacing: '-0.015em' }}
                  >
                    {title}
                  </p>
                  <p
                    className="wt-desc font-sans font-light"
                    style={{ fontSize: '0.83rem', lineHeight: 1.75, color: 'hsl(0 0% 44%)' }}
                  >
                    {desc}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
