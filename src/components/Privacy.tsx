import type { ReactNode } from 'react'
import Footer from './Footer'

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-heading font-medium text-primary" style={{ fontSize: '1.25rem', lineHeight: 1.3, letterSpacing: '-0.01em' }}>{title}</h2>
      <div className="font-body mt-3 space-y-4" style={{ color: 'var(--text-body)', lineHeight: 1.8 }}>{children}</div>
    </section>
  )
}

export default function Privacy() {
  return (
    <>
      <main className="relative px-6" style={{ background: '#010709', paddingTop: '9rem', paddingBottom: '5rem' }}>
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-4">Legal</p>
          <h1 className="font-heading font-medium text-primary" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.12, letterSpacing: '-0.03em' }}>
            Privacy notice
          </h1>
          <p className="font-body mt-5" style={{ color: 'var(--text-body)', lineHeight: 1.8 }}>
            This notice explains what happens to your information when you use this website or contact Weavy. For any privacy question, email{' '}
            <a className="text-gold underline underline-offset-4" href="mailto:hello@weavyautomation.com">hello@weavyautomation.com</a>.
          </p>

          <Block title="When you contact us">
            <p>
              When you submit the contact form, your name, email address, the service you chose and your message are sent to us by email. We use them to reply to your enquiry and to discuss the work you asked about. This website does not keep its own copy.
            </p>
            <p>
              If you email, call or message us on WhatsApp, we receive your contact details and whatever you include in your message. We use this to reply and to discuss the work you asked about.
            </p>
          </Block>

          <Block title="Services that power this website">
            <p>Like most websites, this site relies on outside services that receive basic technical data, such as your IP address and browser type, when they deliver content to you:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Vercel hosts the website and provides privacy-friendly visit statistics, without cookies.</li>
              <li>An email delivery provider sends contact form messages to us.</li>
              <li>Google Fonts delivers the typefaces.</li>
              <li>Mux and Cloudflare R2 deliver the videos.</li>
              <li>Unsplash delivers some blog images.</li>
              <li>WhatsApp, operated by Meta, handles your conversation if you choose to message us there.</li>
            </ul>
          </Block>

          <Block title="Cookies">
            <p>This website does not set cookies. It stores one small note in your browser for the current session, so the opening logo animation only plays once.</p>
          </Block>

          <Block title="Your rights">
            <p>
              Under UK data protection law, you can ask to access, correct or delete the personal information we hold about you, or object to how we use it. Email us and we&rsquo;ll respond. You can also complain to the UK Information Commissioner&rsquo;s Office at{' '}
              <a className="text-gold underline underline-offset-4" href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.
            </p>
          </Block>
        </div>
      </main>
      <Footer id="site-footer" showCta={false} />
    </>
  )
}
