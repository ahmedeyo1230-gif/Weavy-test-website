import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const WORDS         = ['Design', 'Create', 'Automate', 'Inspire']
const DURATION      = 2700
const WORD_INTERVAL = 900


interface LoadingScreenProps {
  onComplete?: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count,       setCount]       = useState(0)
  const [rawProgress, setRawProgress] = useState(0)
  const [wordIndex,   setWordIndex]   = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef   = useRef<number | null>(null)
  // Skip expensive filter:blur animation on mobile to reduce GPU load on first paint
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024

  // RAF counter — eased, 0 → 100 over 2700ms
  useEffect(() => {
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const t      = Math.min((ts - startRef.current) / DURATION, 1)
      setCount(Math.floor(t * 100))
      setRawProgress(t)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCount(100)
        setTimeout(() => onComplete?.(), 400)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  }, [onComplete])

  // Word rotation — plays through once, stops on last word
  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = []
    WORDS.slice(1).forEach((_, i) => {
      ids.push(setTimeout(() => setWordIndex(i + 1), WORD_INTERVAL * (i + 1)))
    })
    return () => ids.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: '#000000' }}>

      {/* ── Center: rotating word ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span
          className="font-sans font-light select-none"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'hsl(0 0% 100%)',
          }}
        >
          Weavy
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={isMobile ? { opacity: 0, y: 8 } : { opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={isMobile ? { opacity: 0, y: -6 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display italic select-none"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: 'hsl(0 0% 100%)',
            }}
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Bottom: counter + progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0">

        {/* Counter — clean horizontal number, bottom-right */}
        <div
          aria-label={`${count}%`}
          style={{
            position: 'absolute',
            bottom: '1.6rem',
            right: '1.75rem',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.2rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-label)',
              fontWeight: 300,
              fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
              lineHeight: 1,
              letterSpacing: '-0.05em',
              color: 'hsl(0 0% 100%)',
              userSelect: 'none',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {count}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-label)',
              fontWeight: 300,
              fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'hsl(0 0% 100%)',
              userSelect: 'none',
            }}
          >
            %
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[2px]" style={{ background: 'hsl(0 0% 100% / 0.07)' }}>
          <motion.div
            className="h-full"
            style={{
              scaleX: rawProgress,
              transformOrigin: 'left center',
              background: 'linear-gradient(to right, hsl(0 0% 28%), hsl(0 0% 52%))',
            }}
          />
        </div>

      </div>
    </div>
  )
}
