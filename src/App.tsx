import { useState, useEffect, lazy, Suspense } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Hero, { Navbar } from './components/Hero'
import VideoShowcase from './components/VideoShowcase'
import About from './components/About'
import Stats from './components/Stats'
import WhyWeavyWorks from './components/WhyWeavyWorks'
import SystemsShowcase from './components/SystemsShowcase'
import TestimonialsSection from './components/Testimonials'
import Footer from './components/Footer'
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton'

// Heavy pages — loaded only when navigated to
const Services     = lazy(() => import('./components/Services'))
const ImageShowcase = lazy(() => import('./components/ImageShowcase'))
const Blog         = lazy(() => import('./components/Blog'))
const Contact      = lazy(() => import('./components/Contact'))

const MARQUEE_ITEMS = [
  'FASTER RESPONSE', 'MORE ENQUIRIES', 'LESS MANUAL WORK',
  'PREMIUM BRAND PRESENCE', 'SMARTER CUSTOMER JOURNEYS',
  'SCALABLE GROWTH', 'BUILT TO PERFORM', 'DESIGNED TO CONVERT',
]

function OutcomeMarquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(1,7,9,0.45)',
        borderTop: '1px solid rgba(125,220,255,0.07)',
        borderBottom: '1px solid rgba(125,220,255,0.07)',
        padding: '14px 0',
      }}
    >
      {/* Left fade mask */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '100px',
        background: 'linear-gradient(to right, #010709, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      {/* Right fade mask */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '100px',
        background: 'linear-gradient(to left, #010709, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <div className="outcome-marquee-track">
        {items.map((text, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0',
              whiteSpace: 'nowrap',
              fontSize: 'clamp(0.6rem, 1.1vw, 0.72rem)',
              letterSpacing: '0.28em',
              fontWeight: 500,
              color: 'rgba(191,239,255,0.72)',
              fontFamily: 'var(--font-sans)',
              paddingRight: '3rem',
            }}
          >
            {text}
            <span style={{ marginLeft: '3rem', color: 'rgba(125,220,255,0.40)', fontSize: '0.6em' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const MAIN_HASHES = ['#home', '#about', '#showcase', '']

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [showServices, setShowServices] = useState(false)
  const [showWork, setShowWork] = useState(false)
  const [showBlog, setShowBlog] = useState(false)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    const check = () => {
      const hash = window.location.hash
      if (hash === '#section-9') {
        setShowServices(true)
        setShowWork(false)
        setShowBlog(false)
        setShowContact(false)
      } else if (hash === '#work') {
        setShowWork(true)
        setShowServices(false)
        setShowBlog(false)
        setShowContact(false)
      } else if (hash === '#blog') {
        setShowBlog(true)
        setShowServices(false)
        setShowWork(false)
        setShowContact(false)
      } else if (hash === '#contact') {
        setShowContact(true)
        setShowServices(false)
        setShowWork(false)
        setShowBlog(false)
      } else if (MAIN_HASHES.includes(hash)) {
        setShowServices(false)
        setShowWork(false)
        setShowBlog(false)
        setShowContact(false)
      }
    }
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  // Snap to top whenever the view switches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [showServices, showWork, showBlog, showContact])

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && <WhatsAppFloatingButton />}
      {loaded && (
        <>
          {showServices ? (
            <>
              <Navbar />
              <Suspense fallback={null}><Services /></Suspense>
            </>
          ) : showWork ? (
            <>
              <Navbar />
              <Suspense fallback={null}><ImageShowcase /></Suspense>
            </>
          ) : showBlog ? (
            <>
              <Navbar />
              <Suspense fallback={null}><Blog /></Suspense>
            </>
          ) : showContact ? (
            <>
              <Navbar />
              <Suspense fallback={null}><Contact /></Suspense>
            </>
          ) : (
            <>
              <Hero />
              <VideoShowcase />
              <OutcomeMarquee />
              <About />
              <Stats />
              <SystemsShowcase />
              <WhyWeavyWorks />
              <TestimonialsSection />
              <Footer />
            </>
          )}
        </>
      )}
    </>
  )
}
