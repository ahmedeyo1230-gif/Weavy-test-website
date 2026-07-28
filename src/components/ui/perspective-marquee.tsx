import { useEffect, useState } from 'react'

const PHRASES = [
  'PREMIUM BRAND PRESENCE',
  'SMARTER CUSTOMER JOURNEYS',
  'SCALABLE GROWTH',
  'BUILT TO PERFORM',
  'DESIGNED TO CONVERT',
  'FASTER RESPONSE',
  'MORE ENQUIRIES',
  'LESS MANUAL WORK',
]

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

function PhraseRun({ keyPrefix }: { keyPrefix: string }) {
  return (
    <div className="pm-run">
      {PHRASES.map((phrase, i) => (
        <span className="pm-item" key={`${keyPrefix}-${i}`}>
          <span className="pm-phrase">{phrase}</span>
          <span className="pm-dot">·</span>
        </span>
      ))}
    </div>
  )
}

export function PerspectiveMarquee() {
  const reduced = useReducedMotion()

  return (
    <div className="pm-root">
      <style>{CSS}</style>

      {/* One static sentence for assistive tech; the animated strip below is purely decorative. */}
      <span className="sr-only">
        Premium brand presence. Smarter customer journeys. Scalable growth. Built to perform.
        Designed to convert. Faster response. More enquiries. Less manual work.
      </span>

      <div className="pm-stage" aria-hidden="true">
        <div className="pm-tilt">
          <div className={reduced ? 'pm-track pm-track--static' : 'pm-track'}>
            <PhraseRun keyPrefix="a" />
            {!reduced && <PhraseRun keyPrefix="b" />}
          </div>
        </div>
        <div className="pm-fade pm-fade--left" />
        <div className="pm-fade pm-fade--right" />
      </div>
    </div>
  )
}

/* Slim perspective-tilted marquee strip. Two duplicated phrase runs slide
   left via translateX(0 -> -50%) for a seamless loop (no jump on restart);
   the 3D tilt lives on a separate parent (.pm-tilt) so it never interferes
   with that translation math. Reduced-motion drops the tilt and the
   animation entirely, rendering one static, wrapped, fully-legible line. */
const CSS = `
.pm-root {
  position: relative;
  width: 100%;
  background: #020202;
  overflow: hidden;
  pointer-events: none;
}

.pm-stage {
  position: relative;
  width: 100%;
  height: 90px;
  overflow: hidden;
  perspective: 1200px;
}

.pm-tilt {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  transform: rotateX(1.5deg) rotateY(-6deg);
  transform-style: preserve-3d;
}

.pm-track {
  display: flex;
  width: max-content;
  animation: pm-scroll 34s linear infinite;
}

.pm-track--static {
  animation: none;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0.75rem 1.5rem;
}

@keyframes pm-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.pm-run {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.pm-item {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 0 0.55rem;
}

.pm-phrase {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.19em;
  font-size: 15px;
  color: #A9DCEC;
  opacity: 0.82;
}

.pm-dot {
  margin-left: 0.55rem;
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 15px;
  color: #A9DCEC;
  opacity: 0.42;
}

.pm-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 90px;
  pointer-events: none;
  z-index: 2;
}
.pm-fade--left  { left: 0;  background: linear-gradient(to right, #020202 35%, transparent); }
.pm-fade--right { right: 0; background: linear-gradient(to left,  #020202 35%, transparent); }

@media (min-width: 700px) {
  .pm-stage { height: 108px; }
  .pm-tilt { transform: rotateX(2.5deg) rotateY(-9deg); }
  .pm-phrase, .pm-dot { font-size: 19px; }
  .pm-phrase { letter-spacing: 0.18em; }
  .pm-fade { width: 110px; }
}

@media (min-width: 1024px) {
  .pm-stage { height: 132px; }
  .pm-tilt { transform: rotateX(3deg) rotateY(-10deg); }
  .pm-phrase, .pm-dot { font-size: 24px; }
  .pm-phrase { letter-spacing: 0.19em; }
  .pm-fade { width: 140px; }
}

@media (prefers-reduced-motion: reduce) {
  .pm-tilt { transform: none; }
  .pm-track { animation: none; }
}
`
