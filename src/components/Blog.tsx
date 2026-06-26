import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

// ─── Data ──────────────────────────────────────────────────────────────────────

interface Article {
  num: string
  category: string
  title: string
  excerpt: string
  readTime: string
  body: string[]
}

const ALL_ARTICLES: Article[] = [
  {
    num: '01',
    category: 'Website Strategy',
    title: 'Why Your Website Should Work Like a Sales System',
    excerpt:
      'A polished website is not enough. The best websites guide visitors, build trust, answer objections, and turn attention into clear action.',
    readTime: '5 min read',
    body: [
      'A strong website is not just a digital brochure. It should guide visitors through a clear journey, explain your value quickly, remove doubt, and make the next step feel obvious.',
      'When a visitor lands on your website, they are usually asking three things: what do you offer, can I trust you, and what should I do next? A sales-focused website answers those questions with strong messaging, clear structure, proof, and simple calls to action.',
      'The goal is not to fill the page with more content. The goal is to organise the right content in the right order. Your homepage, service pages, contact flow, and calls to action should work together like one connected system.',
      'A website that works like a sales system helps turn attention into enquiries, bookings, leads, and long-term customers.',
    ],
  },
  {
    num: '02',
    category: 'AI Automation',
    title: 'How AI Chatbots Improve Customer Response Time',
    excerpt:
      'AI chatbots help businesses answer questions, capture leads, manage bookings, and support customers instantly across websites, WhatsApp, Instagram DM, and Messenger.',
    readTime: '4 min read',
    body: [
      'Customers expect fast answers. If they have to wait too long, they often leave, forget, or choose another business. AI chatbots help reduce that gap by giving people instant support when they need it.',
      'A well-built chatbot can answer common questions, explain services, collect lead details, handle bookings, and guide visitors to the right next step. It can work across websites, WhatsApp, Instagram DM, and Messenger, giving customers a smoother experience.',
      'The value is not just speed. A chatbot also creates consistency. Every customer receives clear information, even outside normal working hours.',
      'When used properly, AI chatbots help businesses save time, improve response quality, and capture more opportunities before they are missed.',
    ],
  },
  {
    num: '03',
    category: 'Social Media Marketing',
    title: 'The Power of Consistent Social Media Systems',
    excerpt:
      'Growth becomes easier when content is planned, designed, scheduled, and measured with a clear strategy instead of random posting.',
    readTime: '6 min read',
    body: [
      'Social media growth becomes difficult when content is created randomly. A consistent system makes it easier to plan, design, publish, and measure content with purpose.',
      'A strong social media system includes content pillars, posting structure, creative direction, scheduling, reporting, and performance review. This helps every post support a wider brand goal instead of existing on its own.',
      'Consistency also builds recognition. When your audience repeatedly sees clear visuals, strong messaging, and useful content, your brand becomes easier to remember and trust.',
      'The best social media strategies are not built around posting more. They are built around posting with clarity, rhythm, and intention.',
    ],
  },
  {
    num: '04',
    category: 'Brand Design',
    title: 'Why Visual Identity Still Matters Online',
    excerpt:
      'Strong visuals help people recognise, remember, and trust your brand across websites, social platforms, campaigns, and content.',
    readTime: '5 min read',
    body: [
      'People often judge a brand before reading a single sentence. Colours, typography, layout, imagery, and motion all shape how trustworthy and professional a business feels.',
      'A strong visual identity creates recognition across every platform. It helps your website, social media, campaigns, presentations, and content feel connected instead of scattered.',
      'Good design is not only about looking attractive. It helps people understand your brand faster, remember it more clearly, and feel more confident engaging with it.',
      'In a digital-first world, visual identity still matters because attention is limited. Brands that look clear, consistent, and intentional are easier to trust.',
    ],
  },
]

const FEATURED = ALL_ARTICLES[0]
const CARDS    = ALL_ARTICLES.slice(1)

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ─── Article detail view ───────────────────────────────────────────────────────

function ArticleDetail({
  article,
  onBack,
}: {
  article: Article
  onBack: () => void
}) {
  const [backHover, setBackHover] = useState(false)

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: E }}
      style={{
        maxWidth: '56rem',
        margin: '0 auto',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3.5rem) clamp(5rem, 9vw, 8rem)',
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: '0.78rem',
          letterSpacing: '0.04em',
          color: backHover ? '#fff' : 'hsl(0 0% 38%)',
          transition: 'color 0.28s ease',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            transition: 'transform 0.28s ease',
            transform: backHover ? 'translateX(-4px)' : 'translateX(0)',
          }}
        >
          ←
        </span>
        Back to articles
      </button>

      {/* Category + read time */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.8rem',
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.56rem',
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'hsl(195 65% 62%)',
          }}
        >
          {article.category}
        </span>
        <span
          style={{
            display: 'inline-block',
            width: 1,
            height: 10,
            background: 'hsl(0 0% 100% / 0.12)',
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.66rem',
            color: 'hsl(0 0% 28%)',
            letterSpacing: '0.05em',
          }}
        >
          {article.readTime}
        </span>
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(1.9rem, 4.5vw, 3.6rem)',
          lineHeight: 1.08,
          letterSpacing: '-0.04em',
          color: '#fff',
          marginBottom: '2rem',
        }}
      >
        {article.title}
      </h1>

      {/* Cyan accent line */}
      <div
        style={{
          width: '3rem',
          height: '2px',
          background: 'linear-gradient(to right, hsl(195 70% 55%), hsl(215 80% 60%))',
          marginBottom: '2.8rem',
          borderRadius: '1px',
        }}
      />

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'hsl(0 0% 100% / 0.07)',
          marginBottom: '2.8rem',
        }}
      />

      {/* Body paragraphs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
        {article.body.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: E }}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)',
              lineHeight: 1.95,
              color: 'hsl(0 0% 52%)',
              margin: 0,
            }}
          >
            {para}
          </motion.p>
        ))}
      </div>

      {/* Bottom divider */}
      <div
        style={{
          height: '1px',
          background: 'hsl(0 0% 100% / 0.06)',
          marginTop: 'clamp(3rem, 6vw, 5rem)',
        }}
      />

      {/* Back link bottom */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginTop: '2rem',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: '0.78rem',
          letterSpacing: '0.04em',
          color: 'hsl(0 0% 34%)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'hsl(0 0% 34%)' }}
      >
        ← Back to articles
      </button>
    </motion.div>
  )
}

// ─── Blog header ───────────────────────────────────────────────────────────────

function BlogHeader() {
  return (
    <header
      style={{
        maxWidth: '1480px',
        margin: '0 auto',
        padding:
          'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 4vw, 3.5rem) clamp(3.5rem, 6vw, 5rem)',
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: E }}
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: '0.65rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'hsl(195 70% 55% / 0.8)',
          marginBottom: '1.6rem',
        }}
      >
        Insights
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, delay: 0.07, ease: E }}
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(2.2rem, 5.2vw, 4.4rem)',
          lineHeight: 1.08,
          letterSpacing: '-0.04em',
          color: '#fff',
          maxWidth: '52rem',
          marginBottom: '1.8rem',
        }}
      >
        Ideas for brands building{' '}
        <em
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'hsl(0 0% 52%)',
          }}
        >
          smarter digital systems.
        </em>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay: 0.17, ease: E }}
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
          lineHeight: 1.9,
          color: 'hsl(0 0% 38%)',
          maxWidth: '44rem',
          marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
        }}
      >
        Practical thinking on websites, AI automation, social media, content,
        and visual identity — written for businesses that want sharper execution
        and stronger digital growth.
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.1, delay: 0.26, ease: E }}
        style={{
          height: '1px',
          background: 'hsl(0 0% 100% / 0.07)',
          transformOrigin: 'left',
        }}
      />
    </header>
  )
}

// ─── Featured article card ─────────────────────────────────────────────────────

function FeaturedArticle({ onRead }: { onRead: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.95, ease: E }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onRead}
      style={{
        position: 'relative',
        borderRadius: '32px',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'hsl(195 70% 52% / 0.26)' : 'hsl(0 0% 100% / 0.08)'}`,
        boxShadow: hovered
          ? '0 0 0 1px hsl(195 70% 52% / 0.07), 0 48px 120px rgba(0,0,0,0.55)'
          : '0 28px 80px rgba(0,0,0,0.38)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition:
          'transform 0.55s cubic-bezier(0.16,1,0.3,1), border-color 0.4s ease, box-shadow 0.45s ease',
        cursor: 'pointer',
        marginBottom: '1.25rem',
        background: '#060f0e',
        padding: 'clamp(2.2rem, 5vw, 4rem)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '2rem',
        alignItems: 'end',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: hovered
            ? 'linear-gradient(to right, hsl(195 70% 55%) 0%, hsl(215 80% 60%) 60%, transparent 100%)'
            : 'linear-gradient(to right, hsl(195 70% 55% / 0.3) 0%, transparent 60%)',
          transition: 'background 0.5s ease',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.56rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'hsl(195 65% 62%)' }}>
            {FEATURED.category}
          </span>
          <span style={{ display: 'inline-block', width: 1, height: 10, background: 'hsl(0 0% 100% / 0.12)' }} />
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.66rem', color: 'hsl(0 0% 28%)', letterSpacing: '0.05em' }}>
            {FEATURED.readTime}
          </span>
        </div>

        <h2 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: 'clamp(1.8rem, 4.2vw, 3.6rem)', lineHeight: 1.08, letterSpacing: '-0.04em', color: '#fff', maxWidth: '44rem', margin: 0 }}>
          {FEATURED.title}
        </h2>

        <div style={{ width: hovered ? '3.5rem' : '2.2rem', height: '1px', background: 'hsl(195 70% 55% / 0.45)', transition: 'width 0.45s ease' }} />

        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: 'clamp(0.88rem, 1.45vw, 1.02rem)', lineHeight: 1.88, color: 'hsl(0 0% 38%)', maxWidth: '42rem', margin: 0 }}>
          {FEATURED.excerpt}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.76rem', letterSpacing: '0.05em', color: hovered ? 'hsl(195 80% 68%)' : 'hsl(0 0% 38%)', borderBottom: `1px solid ${hovered ? 'hsl(195 70% 55% / 0.5)' : 'hsl(0 0% 100% / 0.1)'}`, paddingBottom: '2px', transition: 'color 0.32s ease, border-color 0.32s ease' }}>
            Read article
          </span>
          <span style={{ fontSize: '0.82rem', color: hovered ? 'hsl(195 80% 68%)' : 'hsl(0 0% 30%)', display: 'inline-block', transition: 'color 0.32s ease, transform 0.32s ease', transform: hovered ? 'translateX(5px)' : 'translateX(0)' }}>
            →
          </span>
        </div>
      </div>

      <span aria-hidden="true" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(6rem, 14vw, 14rem)', lineHeight: 1, letterSpacing: '-0.06em', color: hovered ? 'hsl(0 0% 100% / 0.04)' : 'hsl(0 0% 100% / 0.03)', userSelect: 'none', transition: 'color 0.4s ease', alignSelf: 'center' }}>
        {FEATURED.num}
      </span>
    </motion.article>
  )
}

// ─── Supporting article card ───────────────────────────────────────────────────

function ArticleCard({
  article,
  index,
  onRead,
}: {
  article: Article
  index: number
  onRead: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.13, ease: E }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onRead}
      style={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'hsl(195 70% 52% / 0.22)' : 'hsl(0 0% 100% / 0.07)'}`,
        boxShadow: hovered
          ? '0 0 0 1px hsl(195 70% 52% / 0.06), 0 32px 88px rgba(0,0,0,0.5)'
          : '0 18px 52px rgba(0,0,0,0.36)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.4s ease, box-shadow 0.45s ease',
        cursor: 'pointer',
        background: '#060f0e',
        padding: 'clamp(1.6rem, 3vw, 2.4rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.1rem',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: hovered ? 'linear-gradient(to right, hsl(195 70% 55% / 0.7) 0%, transparent 70%)' : 'linear-gradient(to right, hsl(195 70% 55% / 0.18) 0%, transparent 60%)', transition: 'background 0.45s ease' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.54rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'hsl(195 65% 60%)' }}>
          {article.category}
        </span>
        <span aria-hidden="true" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', lineHeight: 1, letterSpacing: '-0.05em', color: hovered ? 'hsl(0 0% 100% / 0.05)' : 'hsl(0 0% 100% / 0.03)', userSelect: 'none', transition: 'color 0.4s ease' }}>
          {article.num}
        </span>
      </div>

      <div style={{ height: '1px', background: 'hsl(0 0% 100% / 0.06)' }} />

      <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: 'clamp(1.05rem, 1.85vw, 1.25rem)', lineHeight: 1.24, letterSpacing: '-0.028em', color: hovered ? '#fff' : 'hsl(0 0% 88%)', transition: 'color 0.32s ease', margin: 0 }}>
        {article.title}
      </h3>

      <div style={{ width: hovered ? '2.4rem' : '1.2rem', height: '1px', background: hovered ? 'hsl(195 70% 55% / 0.72)' : 'hsl(195 70% 55% / 0.2)', transition: 'width 0.42s ease, background 0.35s ease' }} />

      <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: 'clamp(0.8rem, 1.2vw, 0.88rem)', lineHeight: 1.82, color: 'hsl(0 0% 33%)', margin: 0, flex: 1 }}>
        {article.excerpt}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem', paddingTop: '1rem', borderTop: '1px solid hsl(0 0% 100% / 0.05)' }}>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.63rem', color: 'hsl(0 0% 24%)', letterSpacing: '0.04em' }}>
          {article.readTime}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.72rem', letterSpacing: '0.04em', color: hovered ? 'hsl(195 80% 66%)' : 'hsl(0 0% 34%)', borderBottom: `1px solid ${hovered ? 'hsl(195 70% 55% / 0.45)' : 'hsl(0 0% 100% / 0.09)'}`, paddingBottom: '1px', transition: 'color 0.32s ease, border-color 0.32s ease' }}>
            Read article
          </span>
          <span style={{ fontSize: '0.78rem', color: hovered ? 'hsl(195 80% 66%)' : 'hsl(0 0% 28%)', display: 'inline-block', transition: 'color 0.32s ease, transform 0.32s ease', transform: hovered ? 'translateX(4px)' : 'translateX(0)' }}>
            →
          </span>
        </div>
      </div>
    </motion.article>
  )
}

// ─── Blog CTA ──────────────────────────────────────────────────────────────────

function BlogCTA() {
  const [btnHover,   setBtnHover]   = useState(false)
  const [emailHover, setEmailHover] = useState(false)

  return (
    <section
      style={{
        background: '#010709',
        borderTop: '1px solid hsl(0 0% 100% / 0.07)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 4vw, 3.5rem)',
      }}
    >
      <div
        style={{
          maxWidth: '1480px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Glass container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: E }}
          style={{
            width: '100%',
            maxWidth: '52rem',
            background: 'hsl(195 30% 6% / 0.6)',
            border: '1px solid hsl(0 0% 100% / 0.08)',
            borderRadius: '32px',
            padding: 'clamp(2.5rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)',
            boxShadow: '0 32px 88px rgba(0,0,0,0.45)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: E }}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: '0.57rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'hsl(195 70% 58%)',
              marginBottom: 'clamp(1.4rem, 3vw, 2rem)',
            }}
          >
            Next Step
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.08, ease: E }}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(1.9rem, 4.5vw, 3.8rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: '#fff',
              maxWidth: '38rem',
              marginBottom: 'clamp(1.4rem, 3vw, 2rem)',
            }}
          >
            Keep building{' '}
            <em
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'hsl(0 0% 52%)',
              }}
            >
              smarter digital systems.
            </em>
          </motion.h2>

          {/* Thin cyan accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.18, ease: E }}
            style={{
              width: '2.5rem',
              height: '1px',
              background: 'linear-gradient(to right, hsl(195 70% 55%), hsl(215 80% 60%))',
              marginBottom: 'clamp(1.4rem, 3vw, 2rem)',
              transformOrigin: 'center',
            }}
          />

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.22, ease: E }}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
              lineHeight: 1.9,
              color: 'hsl(0 0% 36%)',
              maxWidth: '36rem',
              marginBottom: 'clamp(2.5rem, 5vw, 3.8rem)',
            }}
          >
            If these ideas speak to where your brand is heading, we can help turn
            strategy, automation, content, and design into a cleaner system that
            works across every touchpoint.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, delay: 0.34, ease: E }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.2rem',
            }}
          >
            {/* Primary button */}
            <button
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{
                display: 'inline-block',
                padding: '1rem 2.8rem',
                borderRadius: '999px',
                background: btnHover ? 'hsl(0 0% 92%)' : '#fff',
                color: '#050e10',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: 'clamp(0.85rem, 1.3vw, 0.96rem)',
                letterSpacing: '0.01em',
                border: 'none',
                cursor: 'pointer',
                boxShadow: btnHover
                  ? '0 0 0 4px hsl(195 80% 55% / 0.18), 0 12px 40px rgba(0,0,0,0.5)'
                  : '0 8px 32px rgba(0,0,0,0.4)',
                transform: btnHover ? 'scale(1.03)' : 'scale(1)',
                transition:
                  'background 0.3s ease, box-shadow 0.35s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
                whiteSpace: 'nowrap',
              }}
            >
              Start a project
            </button>

            {/* Email link */}
            <a
              href="mailto:hello@weavyautomation.com"
              onMouseEnter={() => setEmailHover(true)}
              onMouseLeave={() => setEmailHover(false)}
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.8rem, 1.2vw, 0.88rem)',
                letterSpacing: '0.02em',
                color: emailHover ? 'hsl(0 0% 72%)' : 'hsl(0 0% 34%)',
                textDecoration: 'none',
                borderBottom: `1px solid ${emailHover ? 'hsl(0 0% 72% / 0.45)' : 'hsl(0 0% 100% / 0.1)'}`,
                paddingBottom: '2px',
                transition: 'color 0.3s ease, border-color 0.3s ease',
              }}
            >
              hello@weavyautomation.com
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Topics strip ──────────────────────────────────────────────────────────────

const TOPICS = [
  'Website Strategy',
  'AI Automation',
  'Social Media Systems',
  'Brand Identity',
  'Content Planning',
  'Conversion Design',
]

function TopicsStrip() {
  return (
    <section
      style={{
        background: '#010709',
        borderTop: '1px solid hsl(0 0% 100% / 0.06)',
        padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 4vw, 3.5rem)',
      }}
    >
      <div
        style={{
          maxWidth: '1480px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: E }}
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.57rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'hsl(195 70% 58%)',
            marginBottom: '1.4rem',
          }}
        >
          Topics
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, delay: 0.07, ease: E }}
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(1.3rem, 3vw, 2.4rem)',
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            color: '#fff',
            maxWidth: '36rem',
            marginBottom: 'clamp(2rem, 4vw, 3.2rem)',
          }}
        >
          Sharp ideas across growth,{' '}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'hsl(0 0% 48%)',
            }}
          >
            systems, and creative execution.
          </em>
        </motion.h2>

        {/* Pills */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.18, ease: E }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
          }}
        >
          {TOPICS.map((topic, i) => (
            <TopicPill key={topic} label={topic} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TopicPill({ label, index }: { label: string; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: 0.22 + index * 0.07, ease: E }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.55rem 1.2rem',
        borderRadius: '999px',
        border: `1px solid ${hovered ? 'hsl(195 70% 55% / 0.4)' : 'hsl(0 0% 100% / 0.1)'}`,
        background: hovered ? 'hsl(195 40% 8% / 0.7)' : 'hsl(0 0% 100% / 0.03)',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 300,
        fontSize: 'clamp(0.72rem, 1.1vw, 0.82rem)',
        letterSpacing: '0.04em',
        color: hovered ? 'hsl(195 70% 72%)' : 'hsl(0 0% 46%)',
        cursor: 'default',
        transition: 'border-color 0.3s ease, background 0.3s ease, color 0.3s ease',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </motion.span>
  )
}

// ─── Contact / Footer ─────────────────────────────────────────────────────────

const BCF_HLS     = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'
const BCF_MARQUEE = 'BUILDING THE FUTURE \u2022 '

function BIconX() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
}
function BIconLinkedIn() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
}
function BIconDribbble() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm7.369 5.633a10.004 10.004 0 012.187 5.946c-.32-.066-3.52-.712-6.742-.308-.075-.187-.148-.376-.228-.565-.208-.499-.434-1-.669-1.495 3.578-1.458 5.21-3.554 5.452-3.578zM12 2.056a9.955 9.955 0 016.546 2.44c-.196.197-1.673 2.148-5.133 3.444-1.603-2.945-3.381-5.368-3.654-5.752A10.028 10.028 0 0112 2.056zm-4.057.862c.263.369 2.01 2.801 3.633 5.686-4.584 1.218-8.632 1.196-9.056 1.187A10.015 10.015 0 017.943 2.918zM2.048 12.037l.014-.344c.408.01 5.146.041 10.063-1.395.28.547.545 1.104.793 1.664l-.35.097c-5.087 1.647-7.783 6.146-7.99 6.494A9.96 9.96 0 012.048 12.037zm9.952 9.914a9.975 9.975 0 01-6.054-2.043c.165-.318 2.039-3.95 7.625-5.912l.053-.019c1.362 3.534 1.921 6.499 2.066 7.352a9.963 9.963 0 01-3.69.622zm5.624-1.508c-.098-.585-.614-3.414-1.879-6.895 3.024-.484 5.669.311 5.993.416a10.02 10.02 0 01-4.114 6.479z"/></svg>
}
function BIconGitHub() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
}

const BCF_SOCIALS = [
  { label: 'Twitter',  href: '#', Icon: BIconX        },
  { label: 'LinkedIn', href: '#', Icon: BIconLinkedIn  },
  { label: 'Dribbble', href: '#', Icon: BIconDribbble  },
  { label: 'GitHub',   href: '#', Icon: BIconGitHub    },
]

function BlogContactFooter() {
  const marqueeRef   = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const [ctaHover, setCtaHover] = useState(false)

  // HLS video — only initialise when the footer scrolls into view
  useEffect(() => {
    const video     = videoRef.current
    const container = containerRef.current
    if (!video || !container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined
    let initialized = false

    const init = () => {
      if (initialized) return
      initialized = true
      import('hls.js').then(({ default: Hls }) => {
        if (!videoRef.current) return
        if (Hls.isSupported()) {
          const hls = new Hls({ startLevel: -1, maxBufferLength: 20, maxMaxBufferLength: 40 })
          hls.loadSource(BCF_HLS)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}) })
          cleanup = () => hls.destroy()
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = BCF_HLS
          video.play().catch(() => {})
        }
      })
    }

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { init(); observer.disconnect() } },
      { rootMargin: '200px' }
    )
    observer.observe(container)
    return () => { observer.disconnect(); cleanup?.() }
  }, [])

  // GSAP marquee
  useEffect(() => {
    const el = marqueeRef.current
    if (!el) return
    const tween = gsap.to(el, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
    return () => { tween.kill() }
  }, [])

  return (
    <section ref={containerRef} className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">

      {/* Video background */}
      <div className="absolute inset-0" aria-hidden="true" style={{ zIndex: 0 }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline preload="none" aria-hidden="true"
          className="scale-y-[-1]"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div className="absolute inset-0 bg-black/35 lg:bg-black/60" />
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '160px', background: 'linear-gradient(to bottom, #010709 0%, transparent 100%)', zIndex: 2 }} />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '200px', background: 'linear-gradient(to top, #010709 0%, transparent 100%)', zIndex: 2 }} />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>

        {/* Eyebrow */}
        <p className="font-sans font-light uppercase mb-10" style={{ fontSize: '0.68rem', letterSpacing: '0.28em', color: 'hsl(199 89% 68%)' }}>
          Get in touch
        </p>

        {/* Marquee */}
        <div
          className="w-full overflow-hidden mb-16"
          aria-hidden="true"
          style={{ borderTop: '1px solid hsl(0 0% 100% / 0.07)', borderBottom: '1px solid hsl(0 0% 100% / 0.07)', padding: '1rem 0' }}
        >
          <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  fontFamily: "'Instrument Serif', 'Didot', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.75rem)',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  color: 'hsl(0 0% 100% / 0.15)',
                  padding: '0 2.5rem',
                }}
              >
                {BCF_MARQUEE}
              </span>
            ))}
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-sans font-light text-white text-center mb-5 px-6" style={{ fontSize: 'clamp(2.4rem, 5.8vw, 4.4rem)', lineHeight: 1.06, letterSpacing: '-0.04em' }}>
          Let&apos;s create something{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(0 0% 72%)' }}>amazing</em>{' '}
          together
        </h2>

        {/* Subtext */}
        <p className="font-sans font-light text-center mb-14 px-6" style={{ fontSize: 'clamp(0.84rem, 1.35vw, 0.96rem)', lineHeight: 1.9, color: 'hsl(0 0% 40%)', maxWidth: '34rem' }}>
          Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can work together.
        </p>

        {/* CTA button */}
        <a
          href="mailto:hello@weavyautomation.com"
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          className="relative mb-24 rounded-full"
          style={{
            padding: '2px',
            display: 'inline-block',
            background: ctaHover
              ? 'linear-gradient(135deg, hsl(199 89% 65%) 0%, hsl(213 90% 55%) 40%, hsl(240 80% 68%) 100%)'
              : 'linear-gradient(135deg, hsl(0 0% 22%) 0%, hsl(0 0% 14%) 100%)',
            boxShadow: ctaHover
              ? '0 0 0 4px hsl(199 89% 60% / 0.12), 0 0 40px -6px hsl(199 89% 60% / 0.5), 0 8px 32px -8px hsl(0 0% 0% / 0.7)'
              : '0 4px 28px -8px hsl(0 0% 0% / 0.65)',
            transition: 'box-shadow 0.35s ease, background 0.35s ease',
          }}
        >
          <span
            className="flex items-center gap-3 rounded-full font-sans font-light"
            style={{
              padding: '1rem 2.4rem',
              background: ctaHover ? 'hsl(205 80% 7%)' : 'hsl(0 0% 5%)',
              fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
              letterSpacing: '0.01em',
              color: ctaHover ? 'hsl(199 89% 80%)' : 'hsl(0 0% 80%)',
              transition: 'color 0.35s ease, background 0.35s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: ctaHover ? 'hsl(199 89% 65%)' : 'hsl(0 0% 32%)', boxShadow: ctaHover ? '0 0 8px hsl(199 89% 65% / 0.8)' : 'none', transition: 'all 0.35s ease' }} />
            hello@weavyautomation.com
            <span aria-hidden="true" style={{ fontSize: '1em', opacity: ctaHover ? 1 : 0.35, transform: ctaHover ? 'translateX(3px)' : 'translateX(0)', transition: 'all 0.35s ease', display: 'inline-block' }}>→</span>
          </span>
        </a>

        {/* Footer bar */}
        <div
          className="w-full px-6 sm:px-10"
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            borderTop: '1px solid hsl(0 0% 100% / 0.06)',
            paddingTop: '1.75rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex" style={{ width: 8, height: 8 }}>
              <span className="absolute inline-flex rounded-full animate-ping" style={{ width: '100%', height: '100%', background: 'hsl(142 71% 45%)', opacity: 0.7 }} />
              <span className="relative inline-flex rounded-full" style={{ width: 8, height: 8, background: 'hsl(142 71% 52%)', boxShadow: '0 0 8px hsl(142 71% 52% / 0.6)' }} />
            </span>
            <span className="font-sans font-light" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'hsl(0 0% 48%)' }}>
              Available for projects
            </span>
          </div>
          <p className="font-sans font-light text-center" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: 'hsl(0 0% 28%)' }}>
            © {new Date().getFullYear()} Weavy. All rights reserved.
          </p>
          <div className="flex items-center gap-1 justify-end">
            {BCF_SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label} href={href} aria-label={label}
                className="rounded-full flex items-center justify-center"
                style={{ width: 36, height: 36, color: 'hsl(0 0% 36%)', transition: 'color 0.2s ease, background 0.2s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'hsl(0 0% 84%)'; el.style.background = 'hsl(0 0% 100% / 0.07)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'hsl(0 0% 36%)'; el.style.background = 'transparent' }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Blog hero ─────────────────────────────────────────────────────────────────

function BlogHero() {
  return (
    <section style={{ background: '#010709', padding: 'clamp(2rem, 4vw, 3rem) 0 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}
      >
        <img
          loading="lazy"
          decoding="async"
          src="/brand_assets/Blog_1.png"
          alt="Blog hero"
          style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover', objectPosition: 'center top' }}
        />
      </motion.div>
    </section>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function Blog() {
  const [selected, setSelected] = useState<Article | null>(null)

  const handleBack = () => {
    setSelected(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main style={{ background: '#010709', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        {selected ? (
          <ArticleDetail key="detail" article={selected} onBack={handleBack} />
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: E }}
          >
            <BlogHero />
            <BlogHeader />
            <section
              style={{
                maxWidth: '1480px',
                margin: '0 auto',
                padding: '0 clamp(1.5rem, 4vw, 3.5rem) clamp(5rem, 9vw, 8rem)',
              }}
            >
              <FeaturedArticle onRead={() => setSelected(FEATURED)} />
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                style={{ gap: '1.25rem' }}
              >
                {CARDS.map((article, i) => (
                  <ArticleCard
                    key={article.num}
                    article={article}
                    index={i}
                    onRead={() => setSelected(article)}
                  />
                ))}
              </div>
            </section>

            {/* ── CTA after all 4 cards ── */}
            <BlogCTA />

            {/* ── Topics strip ── */}
            <TopicsStrip />

            {/* ── Contact / Footer ── */}
            <BlogContactFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
