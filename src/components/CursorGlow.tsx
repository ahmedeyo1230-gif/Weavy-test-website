import { useEffect, useRef } from 'react'

const SIZE = 520 // px — matches the 420–620px suggested range
const EASE = 0.09 // lower = more lag/smoothing

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const el = glowRef.current
    if (!el) return

    let raf = 0
    let active = false
    // Start off-screen until the first real pointer position arrives.
    let targetX = -SIZE
    let targetY = -SIZE
    let currentX = targetX
    let currentY = targetY

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const tick = () => {
      currentX += (targetX - currentX) * EASE
      currentY += (targetY - currentY) * EASE
      el.style.transform = `translate3d(${currentX - SIZE / 2}px, ${currentY - SIZE / 2}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (active) return
      active = true
      el.style.opacity = '1'
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      raf = requestAnimationFrame(tick)
    }

    const stop = () => {
      if (!active) return
      active = false
      el.style.opacity = '0'
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
    }

    const evaluate = () => {
      if (desktopQuery.matches && !motionQuery.matches) start()
      else stop()
    }

    evaluate()
    desktopQuery.addEventListener('change', evaluate)
    motionQuery.addEventListener('change', evaluate)

    return () => {
      stop()
      desktopQuery.removeEventListener('change', evaluate)
      motionQuery.removeEventListener('change', evaluate)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="hidden lg:block"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(125,220,255,0.12), rgba(43,168,217,0.06), transparent 65%)',
        filter: 'blur(150px)',
        opacity: 0,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        zIndex: 2,
        willChange: 'transform, opacity',
        transition: 'opacity 0.4s ease',
      }}
    />
  )
}
