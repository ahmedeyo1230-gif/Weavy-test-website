import { useState, useEffect, lazy, Suspense } from 'react'
import { applyPageSeo, PAGE_SEO } from './lib/seo'
import LoadingScreen from './components/LoadingScreen'
import Hero, { Navbar } from './components/Hero'
import { PremiumMarquee } from './components/ui/premium-marquee'
import SystemsServicesScroll from './components/SystemsServicesScroll'
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
              <PremiumMarquee />
              <SystemsServicesScroll />
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
