// ─── Video Showcase ───────────────────────────────────────────────────────────

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]
const videoSrc = "/videos/matrix-sky-scroll.mp4"
const posterSrc = "/images/matrix-sky-poster.webp"

// Desktop/tablet scroll-scrub lives at sm (640px) and up; below that, mobile
// uses the autoplay-on-view fallback instead — matches the project's
// existing mobile breakpoint.
const DESKTOP_MQ = '(min-width: 640px)'
const REDUCED_MOTION_MQ = '(prefers-reduced-motion: reduce)'

// Shared corner-marker + screen-frame chrome, identical across the
// reduced-motion / scroll-scrub / autoplay variants below so the frame never
// visually diverges between them.
function CornerMediaFrame({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Strong close glow behind video */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-60px',
          background:
            'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(125,220,255,0.16) 0%, rgba(43,168,217,0.08) 45%, transparent 68%)',
          filter: 'blur(32px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Outer ring glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-120px',
          background:
            'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(43,168,217,0.06) 0%, transparent 60%)',
          filter: 'blur(50px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Side accent lines — hidden on small screens */}
      <div
        aria-hidden="true"
        className="hidden lg:block"
        style={{ position: 'absolute', right: 'calc(100% + 12px)', top: '50%', width: '72px', height: '1px', background: 'linear-gradient(to left, rgba(125,220,255,0.35), transparent)', zIndex: 3, pointerEvents: 'none' }}
      />
      <div
        aria-hidden="true"
        className="hidden lg:block"
        style={{ position: 'absolute', left: 'calc(100% + 12px)', top: '50%', width: '72px', height: '1px', background: 'linear-gradient(to right, rgba(125,220,255,0.35), transparent)', zIndex: 3, pointerEvents: 'none' }}
      />

      {/* Corner decorations + screen frame */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Top-left */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '-7px', left: '-7px', width: '28px', height: '28px', borderTop: '1.5px solid rgba(125,220,255,0.5)', borderLeft: '1.5px solid rgba(125,220,255,0.5)', pointerEvents: 'none', zIndex: 3 }} />
        {/* Top-right */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '-7px', right: '-7px', width: '28px', height: '28px', borderTop: '1.5px solid rgba(125,220,255,0.5)', borderRight: '1.5px solid rgba(125,220,255,0.5)', pointerEvents: 'none', zIndex: 3 }} />
        {/* Bottom-left */}
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-7px', left: '-7px', width: '28px', height: '28px', borderBottom: '1.5px solid rgba(125,220,255,0.5)', borderLeft: '1.5px solid rgba(125,220,255,0.5)', pointerEvents: 'none', zIndex: 3 }} />
        {/* Bottom-right */}
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-7px', right: '-7px', width: '28px', height: '28px', borderBottom: '1.5px solid rgba(125,220,255,0.5)', borderRight: '1.5px solid rgba(125,220,255,0.5)', pointerEvents: 'none', zIndex: 3 }} />

        {/* Screen frame */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            backgroundColor: 'hsl(0 0% 4%)',
            border: '1px solid rgba(125,220,255,0.18)',
            boxShadow:
              '0 2px 4px rgba(0,0,0,0.6),' +
              '0 32px 80px rgba(0,0,0,0.75),' +
              '0 0 0 1px rgba(125,220,255,0.08),' +
              '0 0 70px rgba(43,168,217,0.14)',
          }}
        >
          {/* Top accent line */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '1px',
              background: 'linear-gradient(to right, transparent 5%, rgba(125,220,255,0.6) 30%, rgba(125,220,255,0.8) 50%, rgba(125,220,255,0.6) 70%, transparent 95%)',
              zIndex: 6,
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
            {children}
            {/* Cinematic dark overlay */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'rgba(1, 7, 9, 0.20)',
            }} />
          </div>
        </div>
      </div>
    </>
  )
}

const PARTICLES = [
  { top: '12%', left: '6%',  delay: 0    },
  { top: '20%', left: '88%', delay: 1.4  },
  { top: '60%', left: '3%',  delay: 2.2  },
  { top: '70%', left: '94%', delay: 0.8  },
  { top: '36%', left: '10%', delay: 3.1  },
  { top: '76%', left: '80%', delay: 1.9  },
  { top: '16%', left: '75%', delay: 2.7  },
  { top: '50%', left: '87%', delay: 0.5  },
  { top: '85%', left: '30%', delay: 3.6  },
  { top: '8%',  left: '50%', delay: 1.1  },
  { top: '44%', left: '2%',  delay: 2.9  },
  { top: '28%', left: '96%', delay: 0.3  },
]

export default function VideoShowcase() {
  const sectionRef       = useRef<HTMLElement>(null)
  const scrollTrackRef   = useRef<HTMLDivElement>(null)
  const desktopVideoRef  = useRef<HTMLVideoElement>(null)
  const mobileVideoRef   = useRef<HTMLVideoElement>(null)
  const [srcReady, setSrcReady] = useState(false)
  const [reducedMotion]  = useState(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_MQ).matches
  )

  // Lazy-mount the <source> once the section is getting close to the viewport.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSrcReady(true); observer.disconnect() } },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Desktop/tablet — scroll-scrub: map section scroll progress (0→1) onto
  // video.currentTime, eased via rAF so it never jitters or re-renders React.
  useEffect(() => {
    if (reducedMotion) return
    if (!window.matchMedia(DESKTOP_MQ).matches) return

    const video = desktopVideoRef.current
    const track = scrollTrackRef.current
    if (!video || !track) return

    let duration = 0
    let currentTime = 0
    let targetProgress = 0
    let rafId: number | null = null
    let isInView = false

    const onLoadedMetadata = () => { duration = video.duration || 0 }
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    const computeProgress = () => {
      const rect = track.getBoundingClientRect()
      const scrollable = track.offsetHeight - window.innerHeight
      if (scrollable <= 0) return 0
      return Math.min(1, Math.max(0, -rect.top / scrollable))
    }

    const tick = () => {
      if (duration > 0) {
        const targetTime = targetProgress * duration
        currentTime += (targetTime - currentTime) * 0.12
        if (Math.abs(video.currentTime - currentTime) > 0.02) {
          video.currentTime = currentTime
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    const startLoop = () => { if (rafId == null) rafId = requestAnimationFrame(tick) }
    const stopLoop  = () => { if (rafId != null) { cancelAnimationFrame(rafId); rafId = null } }

    const onScroll = () => { targetProgress = computeProgress() }
    window.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting
      if (isInView) { onScroll(); startLoop() } else { stopLoop() }
    }, { rootMargin: '200px 0px' })
    io.observe(track)

    onScroll()
    if (isInView) startLoop()

    return () => {
      window.removeEventListener('scroll', onScroll)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      io.disconnect()
      stopLoop()
    }
  }, [reducedMotion, srcReady])

  // Mobile — autoplay-on-view fallback instead of scroll-scrub.
  useEffect(() => {
    if (reducedMotion) return
    if (window.matchMedia(DESKTOP_MQ).matches) return

    const video = mobileVideoRef.current
    if (!video) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: [0, 0.35, 0.4, 1] }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [reducedMotion, srcReady])

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-label="Video showcase"
      className="relative px-4 sm:px-8 lg:px-12 pt-10 pb-28 md:pb-36 overflow-hidden"
      style={{ background: '#010709' }}
    >

      {/* Top fade — blends from Hero */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(to bottom, #010709 0%, rgba(1,7,9,0.75) 30%, rgba(1,7,9,0.22) 62%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* ── Primary dot grid ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(125,220,255,0.09) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Secondary coarser dot grid for layered depth ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(125,220,255,0.04) 1.5px, transparent 1.5px)',
          backgroundSize: '80px 80px',
          backgroundPosition: '14px 14px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Wide outer glow ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1100px',
          height: '700px',
          background: 'radial-gradient(ellipse at center, rgba(43,168,217,0.13) 0%, rgba(43,168,217,0.06) 40%, transparent 68%)',
          filter: 'blur(56px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="vs-particle"
          style={{ top: p.top, left: p.left, animationDelay: `${p.delay}s` }}
        />
      ))}

      {reducedMotion ? (
        /* ── Reduced motion: static poster, no scrub, no autoplay ── */
        <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto" style={{ zIndex: 5 }}>
          <CornerMediaFrame>
            <img
              src={posterSrc}
              alt="Matrix Sky — system visual"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </CornerMediaFrame>
        </div>
      ) : (
        <>
          {/* ── Desktop / tablet — sticky scroll-scrub ── */}
          <div
            ref={scrollTrackRef}
            className="hidden sm:block relative w-full"
            style={{ minHeight: '170vh', zIndex: 5 }}
          >
            <div style={{ position: 'sticky', top: 'clamp(80px, 10vh, 120px)' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, ease: E }}
                className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto"
              >
                <CornerMediaFrame>
                  <video
                    ref={desktopVideoRef}
                    muted
                    playsInline
                    preload={srcReady ? 'auto' : 'none'}
                    poster={posterSrc}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      pointerEvents: 'none',
                      filter: 'brightness(0.84) contrast(1.08) saturate(0.92)',
                    }}
                  >
                    {srcReady && <source src={videoSrc} type="video/mp4" />}
                  </video>
                </CornerMediaFrame>
              </motion.div>
            </div>
          </div>

          {/* ── Mobile — autoplay-on-view fallback ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: E }}
            className="sm:hidden relative w-full max-w-xl mx-auto"
            style={{ zIndex: 5 }}
          >
            <CornerMediaFrame>
              <video
                ref={mobileVideoRef}
                muted
                playsInline
                loop
                preload={srcReady ? 'auto' : 'none'}
                poster={posterSrc}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  pointerEvents: 'none',
                  filter: 'brightness(0.84) contrast(1.08) saturate(0.92)',
                }}
              >
                {srcReady && <source src={videoSrc} type="video/mp4" />}
              </video>
            </CornerMediaFrame>
          </motion.div>
        </>
      )}

      {/* Seamless blend into next section */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '320px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(11,17,20,0.12) 30%, rgba(11,17,20,0.35) 58%, rgba(11,17,20,0.62) 80%, rgba(11,17,20,0.78) 100%)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />

    </section>
  )
}
