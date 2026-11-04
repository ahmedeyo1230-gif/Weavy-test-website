import { useEffect, useState } from 'react'
import weavyLogo from '../assets/weavy-logo-new.png'

const HOLD_MS = 520
const FADE_MS = 280

interface LoadingScreenProps {
  onComplete?: () => void
}

/** A brief logo fade that overlays the page, which is already rendering
 *  underneath, so it never delays the real content. */
export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const hold = window.setTimeout(() => setLeaving(true), HOLD_MS)
    const done = window.setTimeout(() => onComplete?.(), HOLD_MS + FADE_MS)
    return () => {
      window.clearTimeout(hold)
      window.clearTimeout(done)
    }
  }, [onComplete])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none"
      style={{
        background: '#010709',
        opacity: leaving ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      <img src={weavyLogo} alt="" width={160} height={160} className="w-32 h-32 md:w-40 md:h-40 object-contain" draggable={false} />
    </div>
  )
}
