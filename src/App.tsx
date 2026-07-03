import { useState, useEffect, lazy, Suspense } from 'react'
import { applyPageSeo, PAGE_SEO } from './lib/seo'
import LoadingScreen from './components/LoadingScreen'
import Hero, { Navbar } from './components/Hero'
import VideoShowcase from './components/VideoShowcase'
import About from './components/About'
import Stats from './components/Stats'
import WhyWeavyWorks from './components/WhyWeavyWorks'
import SystemsShowcase from './components/SystemsShowcase'
import ConnectedSystems from './components/ConnectedSystems'
import TestimonialsSection from './components/Testimonials'
import Footer from './components/Footer'
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton'
import CursorGlow from './components/CursorGlow'

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
        background: 'rgba(1,7,9,0.72)',
        borderTop: '1px solid rgba(125,220,255,0.13)',
        borderBottom: '1px solid rgba(125,220,255,0.13)',
        padding: 'clamp(18px, 2.2vw, 26px) 0',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 0 60px rgba(125,220,255,0.05) inset',
      }}
    >
      {/* Ambient cyan glow centre */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 70% 100% at 50% 50%, rgba(125,220,255,0.04) 0%, transparent 70%)',
      }} />

      {/* Left fade mask */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '140px',
        background: 'linear-gradient(to right, #010709 30%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      {/* Right fade mask */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '140px',
        background: 'linear-gradient(to left, #010709 30%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <div className="outcome-marquee-track" style={{ position: 'relative', zIndex: 1 }}>
        {items.map((text, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              fontSize: 'clamp(0.88rem, 1.72vw, 1.14rem)',
              letterSpacing: '0.20em',
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              paddingRight: '3.5rem',
              color: 'rgba(191,239,255,0.78)',
            }}
          >
            {text}
            <span style={{
              marginLeft: '3.5rem',
              color: 'rgba(125,220,255,0.45)',
              fontSize: '0.65em',
            }}>·</span>
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
        applyPageSeo(PAGE_SEO.services)
      } else if (hash === '#work') {
        setShowWork(true)
        setShowServices(false)
        setShowBlog(false)
        setShowContact(false)
        applyPageSeo(PAGE_SEO.work)
      } else if (hash === '#blog') {
        setShowBlog(true)
        setShowServices(false)
        setShowWork(false)
        setShowContact(false)
        applyPageSeo(PAGE_SEO.blog)
      } else if (hash === '#contact') {
        setShowContact(true)
        setShowServices(false)
        setShowWork(false)
        setShowBlog(false)
        applyPageSeo(PAGE_SEO.contact)
      } else if (MAIN_HASHES.includes(hash)) {
        setShowServices(false)
        setShowWork(false)
        setShowBlog(false)
        setShowContact(false)
        applyPageSeo(PAGE_SEO.home)
      }
    }
    check() // resolve whatever hash is already in the URL on first load (deep link / refresh)
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
      {loaded && <CursorGlow />}
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
              <ConnectedSystems />
              <TestimonialsSection />
              <Footer />
            </>
          )}
        </>
      )}
    </>
  )
}
