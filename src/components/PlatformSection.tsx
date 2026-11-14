import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { goToPath } from '../lib/navigation'
import ConnectedFlow from './ConnectedFlow'

export default function PlatformSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // Header and CTA fade up once the section enters view (the workflow runs
  // its own entrance and loop — see ConnectedFlow).
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const headerEls = el.querySelectorAll('.ocs-header-el')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.set(headerEls, { opacity: 0, y: 22 })
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.to(headerEls, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' })
      obs.disconnect()
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: [
          'radial-gradient(circle at 50% 18%, rgba(24, 105, 125, 0.034) 0%, rgba(5, 24, 29, 0.019) 36%, rgba(1, 7, 9, 0) 64%)',
          'linear-gradient(to bottom, #010709 0%, #010709 42%, #010709 100%)',
        ].join(', '),
        paddingTop: 'clamp(5rem, 9vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6.5rem)',
      }}
      aria-label="One Connected System"
    >
      {/* Ambient glow + dot grid, consistent with other platform-style sections */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(125,220,255,0.038) 0%, transparent 65%)',
      }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(125,220,255,0.05) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 100%)',
      }} />
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 right-0" style={{
        height: '400px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.225) 0%, transparent 100%)',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">

        {/* ── Header — its own display treatment, not the italic "Our Services" style ── */}
        <div className="text-center max-w-3xl mx-auto" style={{ marginBottom: 'clamp(4rem, 8vw, 6rem)' }}>
          <div className="ocs-header-el inline-flex items-center gap-3" style={{ marginBottom: '1.4rem' }}>
            <span aria-hidden="true" style={{ width: 28, height: 1, background: '#79D4E880' }} />
            <span
              className="font-label font-medium uppercase"
              style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', letterSpacing: '0.16em', color: '#79D4E8' }}
            >
              One Connected System
            </span>
            <span aria-hidden="true" style={{ width: 28, height: 1, background: '#79D4E880' }} />
          </div>

          <h2
            className="ocs-header-el font-heading font-medium"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', lineHeight: 1.14, letterSpacing: '-0.032em', color: 'var(--text-primary)' }}
          >
            From first enquiry to booked customer—everything stays connected.
          </h2>

          <p
            className="ocs-header-el font-body font-medium m-tx-secondary"
            style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)', lineHeight: 1.8, color: 'var(--text-muted)', marginTop: '1.3rem' }}
          >
            Voice, messaging, CRM, follow-ups and bookings working as one managed flow.
          </p>
        </div>

        {/* ── The workflow — an animated lead journey through five steps ── */}
        <ConnectedFlow />

        {/* CTA */}
        <div className="ocs-header-el flex justify-center" style={{ marginTop: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); goToPath('/contact') }}
            className="font-body btn-glow-primary btn-demo inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium active:scale-[0.97]"
            style={{ transition: 'background-color 200ms, box-shadow 200ms, transform 100ms' }}
          >
            Book a Free Demo →
          </a>
        </div>
      </div>
    </section>
  )
}
