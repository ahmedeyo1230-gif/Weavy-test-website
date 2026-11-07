import { useEffect, useRef, type VideoHTMLAttributes } from 'react'

const PHONE_QUERY = '(max-width: 767px)'
// How far ahead of the viewport a below-the-fold video starts loading.
const LOAD_AHEAD = '600px 0px'

interface LazyVideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'autoPlay' | 'preload' | 'muted' | 'loop' | 'playsInline'> {
  src: string
  /** Lighter encode for phones, chosen once when the video mounts. */
  mobileSrc?: string
  /** Above the fold: load straight away. Otherwise loading waits until it is near the viewport. */
  eager?: boolean
  /** False keeps the poster on screen and never loads the video (reduced motion). */
  play?: boolean
}

/**
 * A muted, looping background video. A plain `autoPlay` attribute downloads the
 * whole file on page load wherever the video sits, and `preload` can't prevent
 * that, so playback is started from here instead. It also pauses off screen so
 * hidden videos aren't decoded while the page scrolls.
 */
export default function LazyVideo({ src, mobileSrc, eager = false, play = true, poster, ...rest }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video || !play) return

    // iOS only honours muted autoplay when these are set before the source is.
    video.muted = true
    video.defaultMuted = true

    let attached = false
    const attach = () => {
      if (attached) return
      attached = true
      if (poster) video.poster = poster
      video.preload = 'auto'
      video.src = mobileSrc && window.matchMedia(PHONE_QUERY).matches ? mobileSrc : src
      video.load()
    }
    const tryPlay = () => { video.play().catch(() => {}) }

    let visible = false
    const onReady = () => { if (visible) tryPlay() }
    video.addEventListener('loadeddata', onReady)

    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      attach()
      near.disconnect()
    }, { rootMargin: LOAD_AHEAD })

    const inView = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) { attach(); tryPlay() } else video.pause()
    })

    if (eager) attach(); else near.observe(video)
    inView.observe(video)

    return () => {
      near.disconnect()
      inView.disconnect()
      video.removeEventListener('loadeddata', onReady)
    }
  }, [src, mobileSrc, eager, play, poster])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      // An eager video needs its poster at once. A paused one (play={false})
      // shows only its poster. Otherwise it arrives with the video, so
      // off-screen videos cost nothing until they are close.
      poster={eager || !play ? poster : undefined}
      {...rest}
    />
  )
}
