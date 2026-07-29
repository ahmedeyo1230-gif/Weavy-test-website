import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'

const WORDS = ['PERFORM', 'CONVERT', 'RESPOND', 'ATTRACT', 'AUTOMATE']

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const ENTER_MS = 900
const HOLD_MS = 2600
const EXIT_MS = 700
// Perceived time between one word's appearance and the next's:
// ENTER_MS + HOLD_MS (this component's own timer) + EXIT_MS (AnimatePresence's
// exit, which runs before the next child mounts under mode="wait") ≈ 4.2s.

const wordVariants: Variants = {
  initial: { opacity: 0, filter: 'blur(10px)', y: 12, scale: 0.985, letterSpacing: '0.04em' },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    scale: 1,
    letterSpacing: '-0.025em',
    transition: { duration: ENTER_MS / 1000, ease: EASE },
  },
  exit: {
    opacity: 0,
    filter: 'blur(7px)',
    y: -10,
    transition: { duration: EXIT_MS / 1000, ease: EASE },
  },
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

// Premium kinetic editorial word carousel — one centred word at a time,
// cross-fading with a soft blur/rise/scale and a single champagne light
// sweep across the lettering while held. Replaces the old sideways-
// scrolling perspective marquee.
export function EditorialStatementCarousel() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    let cancelled = false
    let timeoutId: number
    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        setIndex(i => (i + 1) % WORDS.length)
        schedule()
      }, ENTER_MS + HOLD_MS)
    }
    schedule()
    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [reduced])

  const word = WORDS[reduced ? 0 : index]

  return (
    <section
      aria-label="What we do"
      style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#010709' }}
    >
      <style>{`
        .esc-stage {
          position: relative;
          width: 100%;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 700px) {
          .esc-stage { height: 200px; }
        }
        @media (min-width: 1024px) {
          .esc-stage { height: 260px; }
        }

        .esc-word { font-size: clamp(38px, 12vw, 64px); }
        @media (min-width: 700px) {
          .esc-word { font-size: clamp(58px, 8vw, 120px); }
        }

        /* Restrained champagne highlight across part of the lettering, plus
           one subtle sweep across it while the word is held visible. */
        .esc-word-fill {
          background-image: linear-gradient(100deg, #F5F2EE 0%, #F5F2EE 40%, #DAB76A 50%, #F5F2EE 60%, #F5F2EE 100%);
          background-size: 300% 100%;
          background-position: 160% 0;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .esc-word-fill--sweep {
          animation: esc-sweep 1.4s ease-in-out 0.85s 1 both;
        }
        @keyframes esc-sweep {
          from { background-position: 160% 0; }
          to   { background-position: -60% 0; }
        }
        .esc-word-fill--static {
          background-image: none;
          -webkit-text-fill-color: currentColor;
          color: #F5F2EE;
        }
      `}</style>

      <div className="esc-stage">
        <AnimatePresence mode="wait">
          <motion.p
            key={reduced ? 'static' : index}
            variants={wordVariants}
            initial={reduced ? 'animate' : 'initial'}
            animate="animate"
            exit={reduced ? undefined : 'exit'}
            className="esc-word"
            style={{
              position: 'absolute',
              inset: 0,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontWeight: 500,
              textShadow:
                '0 0 36px rgba(125,220,255,0.10), 0 0 70px rgba(24,105,125,0.06), 0 0 30px rgba(218,183,106,0.16), 0 0 60px rgba(218,183,106,0.08)',
              willChange: 'transform, opacity, filter',
            }}
          >
            <span className={reduced ? 'esc-word-fill esc-word-fill--static' : 'esc-word-fill esc-word-fill--sweep'}>
              {word}
            </span>
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  )
}
