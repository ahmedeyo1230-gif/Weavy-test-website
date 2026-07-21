// ─── Video Showcase — Matrix Sky full-screen scroll-scrub ───────────────────

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

const videoSrc = "/videos/matrix-sky-scroll.mp4"
const posterSrc = "/images/matrix-sky-poster.webp"

// Desktop/tablet get the pinned scroll-scrub; below this width, mobile uses
// the autoplay-on-view fallback instead — matches the project's existing
// mobile breakpoint.
const DESKTOP_MQ = '(min-width: 640px)'
const REDUCED_MOTION_MQ = '(prefers-reduced-motion: reduce)'

// Subtle cinematic corner brackets, inset from the viewport edges. Purely a
// decorative overlay on top of the full-screen video — not a frame/card.
function CornerMarkers() {
  const inset = 'clamp(16px, 3vw, 32px)'
  const size = 'clamp(22px, 2.6vw, 34px)'
  const border = '1.5px solid rgba(125,220,255,0.35)'
  const common: CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
    zIndex: 3,
  }
  return (
    <>
      <div aria-hidden="true" style={{ ...common, top: inset, left: inset, borderTop: border, borderLeft: border }} />
      <div aria-hidden="true" style={{ ...common, top: inset, right: inset, borderTop: border, borderRight: border }} />
      <div aria-hidden="true" style={{ ...common, bottom: inset, left: inset, borderBottom: border, borderLeft: border }} />
      <div aria-hidden="true" style={{ ...common, bottom: inset, right: inset, borderBottom: border, borderRight: border }} />
    </>
  )
}

const videoStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover',
  objectPosition: 'center',
  pointerEvents: 'none',
  filter: 'brightness(0.86) contrast(1.06) saturate(0.94)',
}

export default function VideoShowcase() {
  const sectionRef      = useRef<HTMLElement>(null)
  const scrollTrackRef  = useRef<HTMLDivElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef  = useRef<HTMLVideoElement>(null)
  const [srcReady, setSrcReady] = useState(false)
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_MQ).matches
  )

  // Lazy-mount the <source> once the section is getting close to the viewport.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSrcReady(true); observer.disconnect() } },
      { rootMargin: '400px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Desktop/tablet — pinned scroll-scrub: map the outer track's scroll
  // progress (0→1) onto video.currentTime, eased via rAF. Refs only — no
  // React state changes on scroll, so no extra re-renders.
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

    // Only run the rAF loop while the track is near/in the viewport.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { onScroll(); startLoop() } else { stopLoop() }
    }, { rootMargin: '200px 0px' })
    io.observe(track)

    onScroll()
    if (track.getBoundingClientRect().top < window.innerHeight) startLoop()

    return () => {
      window.removeEventListener('scroll', onScroll)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      io.disconnect()
      stopLoop()
    }
  }, [reducedMotion, srcReady])

  // Mobile — autoplay-on-view fallback instead of scroll-scrub (no pinning,
  // no scroll hijacking).
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
      aria-label="Matrix Sky system visual"
      className="relative"
      style={{ background: '#010709' }}
    >
      {reducedMotion ? (
        /* ── Reduced motion: static full-bleed poster, no scrub, no autoplay ── */
        <div className="relative w-full" style={{ height: '100vh' }}>
          <img
            src={posterSrc}
            alt="Matrix Sky — system visual"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              display: 'block', objectFit: 'cover', objectPosition: 'center',
            }}
          />
          <CornerMarkers />
        </div>
      ) : (
        <>
          {/* ── Desktop / tablet — pinned full-screen scroll-scrub ── */}
          <div
            ref={scrollTrackRef}
            className="hidden sm:block relative"
            style={{ minHeight: '400vh' }}
          >
            <div style={{ position: 'sticky', top: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
              <video
                ref={desktopVideoRef}
                muted
                playsInline
                preload={srcReady ? 'auto' : 'none'}
                poster={posterSrc}
                style={videoStyle}
              >
                {srcReady && <source src={videoSrc} type="video/mp4" />}
              </video>
              <CornerMarkers />
            </div>
          </div>

          {/* ── Mobile — full-bleed autoplay-on-view (no pinning) ── */}
          <div className="sm:hidden relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
            <video
              ref={mobileVideoRef}
              muted
              playsInline
              loop
              preload={srcReady ? 'auto' : 'none'}
              poster={posterSrc}
              style={videoStyle}
            >
              {srcReady && <source src={videoSrc} type="video/mp4" />}
            </video>
            <CornerMarkers />
          </div>
        </>
      )}
    </section>
  )
}
