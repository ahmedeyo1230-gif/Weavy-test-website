import { useEffect, useRef } from 'react'
import { Star } from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import gsap from 'gsap'

export interface Testimonial {
  name: string
  role: string
  text: string
  avatar: string
  rating?: number
}

interface TestimonialsSectionProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials: Testimonial[]
}

export function TestimonialsSection({
  title = 'Trusted by founders who move fast',
  subtitle = 'Real results from real businesses — not templated outcomes.',
  badgeText = 'Client Stories',
  testimonials,
}: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const heading  = el.querySelector('.ts-heading')
    const sub      = el.querySelector('.ts-sub')
    const badge    = el.querySelector('.ts-badge')
    const cards    = el.querySelectorAll('.ts-card')

    gsap.set([badge, heading, sub], { opacity: 0, y: 24 })
    gsap.set(cards, { opacity: 0, y: 36 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(badge,   { opacity: 1, y: 0, duration: 0.6 }, 0)
      tl.to(heading, { opacity: 1, y: 0, duration: 0.75 }, 0.1)
      tl.to(sub,     { opacity: 1, y: 0, duration: 0.65 }, 0.2)
      tl.to(cards,   { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 0.35)
      obs.disconnect()
    }, { threshold: 0.12 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
    >
      {/* Ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 0%, hsl(199 89% 60% / 0.05) 0%, transparent 70%)',
        }}
      />

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(hsl(210 40% 60% / 0.025) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-[44rem] mx-auto mb-16 sm:mb-20">
          {/* Badge */}
          <span
            className="ts-badge inline-block mb-5 font-sans font-light uppercase"
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.22em',
              color: 'hsl(199 89% 68%)',
              border: '1px solid hsl(199 89% 60% / 0.3)',
              borderRadius: '999px',
              padding: '0.3rem 0.9rem',
              background: 'hsl(199 89% 60% / 0.06)',
            }}
          >
            {badgeText}
          </span>

          <h2
            className="ts-heading font-sans font-light text-text mb-5"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.033em',
            }}
          >
            {title}
          </h2>

          <p
            className="ts-sub font-sans font-light"
            style={{
              fontSize: 'clamp(0.88rem, 1.5vw, 1.02rem)',
              lineHeight: 1.85,
              color: 'hsl(0 0% 50%)',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => {
            const stars = typeof t.rating === 'number' ? t.rating : 5
            return (
              <Card
                key={i}
                className="ts-card flex flex-col h-full group transition-all duration-300"
                style={{
                  background: 'hsl(0 0% 100% / 0.03)',
                  border: '1px solid hsl(0 0% 100% / 0.07)',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 32px -8px hsl(0 0% 0% / 0.5)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'hsl(199 89% 60% / 0.2)'
                  ;(e.currentTarget as HTMLElement).style.background = 'hsl(199 89% 60% / 0.04)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'hsl(0 0% 100% / 0.07)'
                  ;(e.currentTarget as HTMLElement).style.background = 'hsl(0 0% 100% / 0.03)'
                }}
              >
                <CardHeader style={{ padding: '1.5rem 1.5rem 0.75rem' }}>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-3.5 w-3.5"
                        style={{
                          fill: idx < stars ? 'hsl(199 89% 60%)' : 'hsl(0 0% 20%)',
                          color: idx < stars ? 'hsl(199 89% 60%)' : 'hsl(0 0% 20%)',
                        }}
                      />
                    ))}
                  </div>
                </CardHeader>

                <CardContent style={{ padding: '0.5rem 1.5rem 1.25rem', flex: 1 }}>
                  <p
                    className="font-sans font-light"
                    style={{
                      fontSize: 'clamp(0.88rem, 1.35vw, 0.97rem)',
                      lineHeight: 1.8,
                      color: 'hsl(0 0% 62%)',
                    }}
                  >
                    "{t.text}"
                  </p>
                </CardContent>

                <CardFooter style={{ padding: '0 1.5rem 1.5rem', marginTop: 'auto' }}>
                  <div
                    style={{
                      width: '1px',
                      height: '2rem',
                      background: 'hsl(0 0% 100% / 0.08)',
                      marginRight: '1.25rem',
                    }}
                    aria-hidden="true"
                  />
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="rounded-full object-cover shrink-0"
                      style={{ width: 36, height: 36, border: '1px solid hsl(0 0% 100% / 0.1)' }}
                    />
                    <div>
                      <p
                        className="font-sans"
                        style={{ fontSize: '0.85rem', fontWeight: 400, color: 'hsl(0 0% 88%)' }}
                      >
                        {t.name}
                      </p>
                      <p
                        className="font-sans font-light"
                        style={{ fontSize: '0.75rem', color: 'hsl(0 0% 44%)' }}
                      >
                        {t.role}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}
