import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Hero, { Navbar } from './components/Hero'
import VideoShowcase from './components/VideoShowcase'
import About from './components/About'
import Stats from './components/Stats'
import WhyWeavyWorks from './components/WhyWeavyWorks'
import SystemsShowcase from './components/SystemsShowcase'
import ExceedingExpectations from './components/ExceedingExpectations'
import LiveBrandSignals from './components/LiveBrandSignals'
import ImageShowcase from './components/ImageShowcase'
import TestimonialsSection from './components/Testimonials'
import Services from './components/Services'
import Footer from './components/Footer'
import Blog from './components/Blog'
import Contact from './components/Contact'

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
      {loaded && (
        <>
          {showServices ? (
            <>
              <Navbar />
              <Services />
            </>
          ) : showWork ? (
            <>
              <Navbar />
              <ImageShowcase />
            </>
          ) : showBlog ? (
            <>
              <Navbar />
              <Blog />
            </>
          ) : showContact ? (
            <>
              <Navbar />
              <Contact />
            </>
          ) : (
            <>
              <Hero />
              <VideoShowcase />
              <About />
              <Stats />
              <WhyWeavyWorks />
              <SystemsShowcase />
              <ExceedingExpectations />
              <LiveBrandSignals />
              <TestimonialsSection />
              <Footer />
            </>
          )}
        </>
      )}
    </>
  )
}
