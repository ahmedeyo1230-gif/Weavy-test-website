import { useState, useEffect, lazy, Suspense } from 'react'
import { applyPageSeo, PAGE_SEO } from './lib/seo'
import LoadingScreen from './components/LoadingScreen'
import Hero, { Navbar } from './components/Hero'
import WeaveSection from './components/WeaveSection'
import { Marquee } from './components/ui/marquee'
import PlatformSection from './components/PlatformSection'
import PricingSection from './components/PricingSection'
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

      <Marquee duration={36} fade={false} style={{ position: 'relative', zIndex: 1 }}>
        {MARQUEE_ITEMS.map((text) => (
          <span
            key={text}
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
      </Marquee>
    </div>
  )
}

type Route = 'home' | 'about' | 'services' | 'work' | 'blog' | 'contact'

const ROUTE_BY_PATH: Record<string, Route> = {
  '/about':    'about',
  '/services': 'services',
  '/work':     'work',
  '/blog':     'blog',
  '/contact':  'contact',
}

function routeFromPath(): Route {
  return ROUTE_BY_PATH[window.location.pathname] ?? 'home'
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [route, setRoute] = useState<Route>('home')

  useEffect(() => {
    // Every top-level page lives at a real path now. "popstate" fires for
    // back/forward AND for the pushState navigations dispatched by goToPath(),
    // so this is the single source of truth for what's on screen.
    const check = () => {
      const next = routeFromPath()
      setRoute(next)
      applyPageSeo(PAGE_SEO[next])
    }
    check() // resolve whatever path is already in the URL on first load (deep link / refresh)
    window.addEventListener('popstate', check)
    return () => window.removeEventListener('popstate', check)
  }, [])

  // Scroll appropriately whenever the route changes: to the About section for
  // "/about" (it lives inside the Home page), to the top for everything else.
  useEffect(() => {
    if (route === 'about') {
      requestAnimationFrame(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [route])

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {loaded && <CursorGlow />}
      {loaded && <WhatsAppFloatingButton />}
      {loaded && (
        <>
          {route === 'services' ? (
            <>
              <Navbar />
              <Suspense fallback={null}><Services /></Suspense>
            </>
          ) : route === 'work' ? (
            <>
              <Navbar />
              <Suspense fallback={null}><ImageShowcase /></Suspense>
            </>
          ) : route === 'blog' ? (
            <>
              <Navbar />
              <Suspense fallback={null}><Blog /></Suspense>
            </>
          ) : route === 'contact' ? (
            <>
              <Navbar />
              <Suspense fallback={null}><Contact /></Suspense>
            </>
          ) : (
            <>
              <Hero />
              <WeaveSection />
              <OutcomeMarquee />
              <PlatformSection />
              <ConnectedSystems />
              <About />
              <Stats />
              <SystemsShowcase />
              <WhyWeavyWorks />
              <PricingSection />
              <TestimonialsSection />
              <Footer />
            </>
          )}
        </>
      )}
    </>
  )
}
