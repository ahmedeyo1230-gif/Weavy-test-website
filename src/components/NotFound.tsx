import Footer from './Footer'
import { goToPath } from '../lib/navigation'

export default function NotFound() {
  return (
    <>
      <main className="relative min-h-[70vh] flex items-center justify-center px-6" style={{ background: '#010709', paddingTop: '8rem', paddingBottom: '5rem' }}>
        <div className="text-center max-w-xl">
          <p className="section-label mb-4">Page not found</p>
          <h1 className="font-heading font-medium text-primary" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.12, letterSpacing: '-0.03em' }}>
            We couldn&rsquo;t find that page.
          </h1>
          <p className="font-body mt-5 mb-9" style={{ color: 'var(--text-body)', lineHeight: 1.75 }}>
            It may have moved, or the link may be out of date.
          </p>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); goToPath('/') }}
            className="font-body btn-glow-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium"
          >
            Back to Home
          </a>
        </div>
      </main>
      <Footer id="site-footer" showCta={false} />
    </>
  )
}
