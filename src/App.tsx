import { useState, useEffect, lazy, Suspense } from 'react'
import { applyPageSeo, PAGE_SEO } from './lib/seo'
import { isServicesPath, servicePageFromPath, normalisePath, SERVICES_OVERVIEW_PATH, type ServiceKey } from './lib/servicePages'
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
import Footer, { Marquee as BuildingTheFutureMarquee } from './components/Footer'
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
  // /services and every dedicated service page beneath it (/services/<slug>)
  if (isServicesPath(window.location.pathname)) return 'services'
  return ROUTE_BY_PATH[window.location.pathname] ?? 'home'
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [route, setRoute] = useState<Route>('home')
  // Which dedicated service page is open under /services/<slug>; null = the overview.
  const [serviceKey, setServiceKey] = useState<ServiceKey | null>(null)

  useEffect(() => {
    // Every top-level page lives at a real path now. "popstate" fires for
    // back/forward AND for the pushState navigations dispatched by goToPath(),
    // so this is the single source of truth for what's on screen.
    let lastPath = ''
    const check = () => {
      const next = routeFromPath()
      let service = null
      if (next === 'services') {
        service = servicePageFromPath(window.location.pathname)
        // Unknown /services/<slug> → fall back to the overview at its canonical URL.
        if (!service && normalisePath(window.location.pathname) !== SERVICES_OVERVIEW_PATH) {
          window.history.replaceState({}, '', SERVICES_OVERVIEW_PATH)
        }
      }
      const path = normalisePath(window.location.pathname)
      // Clicking "Services" while already on the overview doesn't change the
      // route, so nothing below would scroll — glide back to the top instead.
      if (next === 'services' && path === lastPath) window.scrollTo({ top: 0, behavior: 'smooth' })
      lastPath = path
      setRoute(next)
      setServiceKey(service?.key ?? null)
      applyPageSeo(service ? service.seo : PAGE_SEO[next])
    }
    check() // resolve whatever path is already in the URL on first load (deep link / refresh)
    window.addEventListener('popstate', check)
    return () => window.removeEventListener('popstate', check)
  }, [])

  // Scroll appropriately whenever the route changes: to the About section for
  // "/about" (it lives inside the Home page), to the top for everything else —
  // including moving between the Services overview and a dedicated service page.
  useEffect(() => {
    if (route === 'about') {
      requestAnimationFrame(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [route, serviceKey])

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
              {/* Keyed per page so each service page mounts fresh, like a
                  separate page: its entrance animations and scroll triggers
                  initialise against its own sections. */}
              <Suspense fallback={null}><Services key={serviceKey ?? 'overview'} serviceKey={serviceKey} /></Suspense>
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
              <BuildingTheFutureMarquee />
              <Footer
                eyebrow="Get in touch"
                heading={<>
                  Ready to build a stronger digital{' '}
                  <em style={{
                    fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400,
                    background: 'linear-gradient(90deg, #FFFFFF 0%, #7DDCFF 45%, #B7AEFF 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    color: 'transparent',
                    textShadow: '0 0 24px rgba(125, 220, 255, 0.16)',
                  }}>
                    presence
                  </em>?
                </>}
                subtext="From intelligent automation and connected CRM systems to bespoke websites, UGC, reels, social media and creative design—we bring everything together to help your business attract, engage and convert more customers."
                ctaLabel="Start a Project"
                ctaHref="/contact"
                ctaVariant="primary"
              />
            </>
          )}
        </>
      )}
    </>
  )
}
