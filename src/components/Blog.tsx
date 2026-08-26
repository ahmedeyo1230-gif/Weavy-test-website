import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from './Footer'

// ─── Data ──────────────────────────────────────────────────────────────────────

interface Article {
  num: string
  category: string
  title: string
  excerpt: string
  readTime: string
  body: string[]
  image: string
  imageAlt: string
}

const ALL_ARTICLES: Article[] = [
  {
    num: '01',
    category: 'Website Strategy',
    title: 'Why Your Website Should Work Like a Sales System',
    excerpt:
      'A polished website is not enough. The best websites guide visitors, build trust, answer objections, and turn attention into clear action.',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Laptop showing website analytics and conversion data',
    body: [
      'A strong website is not just a digital brochure. It should guide visitors through a clear journey, explain your value quickly, remove doubt, and make the next step feel obvious.',
      'When a visitor lands on your website, they are usually asking three things: what do you offer, can I trust you, and what should I do next? A sales-focused website answers those questions with strong messaging, clear structure, proof, and simple calls to action.',
      'The goal is not to fill the page with more content. The goal is to organise the right content in the right order. Your homepage, service pages, contact flow, and calls to action should work together like one connected system.',
      'A website that works like a sales system helps turn attention into enquiries, bookings, leads, and long-term customers.',
    ],
  },
  {
    num: '02',
    category: 'Business Automation',
    title: 'How AI Chatbots Improve Customer Response Time',
    excerpt:
      'AI chatbots help businesses answer questions, capture leads, manage bookings, and support customers instantly across websites, WhatsApp, Instagram DM, and Messenger.',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'AI robot representing automated chatbot customer communication',
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
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Social media platform icons on a smartphone screen',
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
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Designer working on brand identity and digital visual systems',
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
          fontFamily: 'var(--font-label)',
          fontWeight: 500,
          fontSize: '0.78rem',
          letterSpacing: '0.04em',
          color: backHover ? '#fff' : 'hsl(0 0% 60%)',
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
            fontFamily: 'var(--font-label)',
            fontWeight: 500,
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
            fontFamily: 'var(--font-label)',
            fontWeight: 500,
            fontSize: '0.66rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          {article.readTime}
        </span>
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 500,
          fontSize: 'clamp(1.9rem, 4.5vw, 3.6rem)',
          lineHeight: 1.08,
          letterSpacing: '-0.04em',
          color: 'var(--text-primary)',
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
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)',
              lineHeight: 1.95,
              color: 'var(--text-body)',
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
          fontFamily: 'var(--font-label)',
          fontWeight: 500,
          fontSize: '0.78rem',
          letterSpacing: '0.04em',
          color: 'var(--text-muted)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'hsl(0 0% 58%)' }}
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
          fontFamily: 'var(--font-label)',
          fontWeight: 500,
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
          fontFamily: 'var(--font-heading)',
          fontWeight: 500,
          fontSize: 'clamp(2.2rem, 5.2vw, 4.4rem)',
          lineHeight: 1.08,
          letterSpacing: '-0.04em',
          color: 'var(--text-primary)',
          maxWidth: '52rem',
          marginBottom: '1.8rem',
        }}
      >
        Ideas for brands building{' '}
        <em
          style={{
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'hsl(0 0% 68%)',
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
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
          lineHeight: 1.9,
          color: 'hsl(0 0% 64%)',
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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top accent line */}
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
          zIndex: 1,
        }}
      />

      {/* Hero image banner */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '21 / 8', overflow: 'hidden' }}>
        <img
          src={FEATURED.image}
          alt={FEATURED.imageAlt}
          decoding="async"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.82,
            filter: 'brightness(0.52) contrast(1.22) saturate(0.6)',
            transition: 'opacity 0.45s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,15,14,0.18) 0%, rgba(6,15,14,0.55) 60%, #060f0e 100%)' }} />
      </div>

      {/* Content */}
      <div style={{ padding: 'clamp(2rem, 4.5vw, 3.5rem)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'end' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: '0.56rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(125, 220, 255, 0.82)' }}>
            {FEATURED.category}
          </span>
          <span style={{ display: 'inline-block', width: 1, height: 10, background: 'hsl(0 0% 100% / 0.12)' }} />
          <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            {FEATURED.readTime}
          </span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(1.8rem, 4.2vw, 3.6rem)', lineHeight: 1.08, letterSpacing: '-0.04em', color: '#fff', maxWidth: '44rem', margin: 0 }}>
          {FEATURED.title}
        </h2>

        <div style={{ width: hovered ? '3.5rem' : '2.2rem', height: '1px', background: 'hsl(195 70% 55% / 0.45)', transition: 'width 0.45s ease' }} />

        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 'clamp(0.88rem, 1.45vw, 1.02rem)', lineHeight: 1.88, color: 'var(--text-body)', maxWidth: '42rem', margin: 0 }}>
          {FEATURED.excerpt}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: '0.76rem', letterSpacing: '0.05em', color: hovered ? 'hsl(195 80% 68%)' : 'rgba(235, 245, 255, 0.76)', borderBottom: `1px solid ${hovered ? 'hsl(195 70% 55% / 0.5)' : 'hsl(0 0% 100% / 0.1)'}`, paddingBottom: '2px', textShadow: '0 0 10px rgba(125, 220, 255, 0.10)', transition: 'color 0.32s ease, border-color 0.32s ease' }}>
            Read article
          </span>
          <span style={{ fontSize: '0.82rem', color: hovered ? 'hsl(195 80% 68%)' : 'hsl(0 0% 30%)', display: 'inline-block', transition: 'color 0.32s ease, transform 0.32s ease', transform: hovered ? 'translateX(5px)' : 'translateX(0)' }}>
            →
          </span>
        </div>
      </div>

      <span aria-hidden="true" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 'clamp(6rem, 14vw, 14rem)', lineHeight: 1, letterSpacing: '-0.06em', color: hovered ? 'rgba(125, 220, 255, 0.14)' : 'rgba(125, 220, 255, 0.10)', userSelect: 'none', transition: 'color 0.4s ease', alignSelf: 'center' }}>
        {FEATURED.num}
      </span>
      </div>{/* close content wrapper */}
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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top accent line */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: hovered ? 'linear-gradient(to right, hsl(195 70% 55% / 0.7) 0%, transparent 70%)' : 'linear-gradient(to right, hsl(195 70% 55% / 0.18) 0%, transparent 60%)', transition: 'background 0.45s ease', zIndex: 1 }} />

      {/* Card image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
        <img
          src={article.image}
          alt={article.imageAlt}
          loading="lazy"
          decoding="async"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.85,
            filter: 'brightness(0.52) contrast(1.22) saturate(0.6)',
            transition: 'opacity 0.45s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, #060f0e 100%)' }} />
      </div>

      {/* Text content */}
      <div style={{ padding: 'clamp(1.4rem, 2.5vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '1.1rem', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: '0.54rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(125, 220, 255, 0.82)' }}>
          {article.category}
        </span>
        <span aria-hidden="true" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', lineHeight: 1, letterSpacing: '-0.05em', color: hovered ? 'rgba(125, 220, 255, 0.14)' : 'rgba(125, 220, 255, 0.10)', userSelect: 'none', transition: 'color 0.4s ease' }}>
          {article.num}
        </span>
      </div>

      <div style={{ height: '1px', background: 'hsl(0 0% 100% / 0.06)' }} />

      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(1.05rem, 1.85vw, 1.25rem)', lineHeight: 1.24, letterSpacing: '-0.028em', color: hovered ? '#fff' : 'hsl(0 0% 88%)', transition: 'color 0.32s ease', margin: 0 }}>
        {article.title}
      </h3>

      <div style={{ width: hovered ? '2.4rem' : '1.2rem', height: '1px', background: hovered ? 'hsl(195 70% 55% / 0.72)' : 'hsl(195 70% 55% / 0.2)', transition: 'width 0.42s ease, background 0.35s ease' }} />

      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 'clamp(0.8rem, 1.2vw, 0.88rem)', lineHeight: 1.82, color: 'var(--text-description)', margin: 0, flex: 1 }}>
        {article.excerpt}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem', paddingTop: '1rem', borderTop: '1px solid hsl(0 0% 100% / 0.05)' }}>
        <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: '0.63rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          {article.readTime}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: '0.72rem', letterSpacing: '0.04em', color: hovered ? 'hsl(195 80% 66%)' : 'rgba(235, 245, 255, 0.76)', borderBottom: `1px solid ${hovered ? 'hsl(195 70% 55% / 0.45)' : 'hsl(0 0% 100% / 0.09)'}`, paddingBottom: '1px', textShadow: '0 0 10px rgba(125, 220, 255, 0.10)', transition: 'color 0.32s ease, border-color 0.32s ease' }}>
            Read article
          </span>
          <span style={{ fontSize: '0.78rem', color: hovered ? 'hsl(195 80% 66%)' : 'hsl(0 0% 28%)', display: 'inline-block', transition: 'color 0.32s ease, transform 0.32s ease', transform: hovered ? 'translateX(4px)' : 'translateX(0)' }}>
            →
          </span>
        </div>
      </div>
      </div>{/* close text content wrapper */}
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
              fontFamily: 'var(--font-label)',
              fontWeight: 500,
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
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              fontSize: 'clamp(1.9rem, 4.5vw, 3.8rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              maxWidth: '38rem',
              marginBottom: 'clamp(1.4rem, 3vw, 2rem)',
            }}
          >
            Keep building{' '}
            <em
              style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--text-muted)',
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
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
              lineHeight: 1.9,
              color: 'var(--text-muted)',
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
                fontFamily: 'var(--font-body)',
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
                fontFamily: 'var(--font-label)',
                fontWeight: 500,
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
  'Business Automation',
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
            fontFamily: 'var(--font-label)',
            fontWeight: 500,
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
            fontFamily: 'var(--font-heading)',
            fontWeight: 500,
            fontSize: 'clamp(1.3rem, 3vw, 2.4rem)',
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            color: 'var(--text-primary)',
            maxWidth: '36rem',
            marginBottom: 'clamp(2rem, 4vw, 3.2rem)',
          }}
        >
          Sharp ideas across growth,{' '}
          <em
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--text-muted)',
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
  const base = {
    border: '1px solid rgba(30, 111, 130, 0.45)',
    background: 'rgba(6, 17, 20, 0.70)',
    color: 'rgba(191, 239, 255, 0.80)',
    boxShadow: 'none',
  }

  const hover = {
    border: '1px solid rgba(125, 220, 255, 0.70)',
    background: 'rgba(9, 32, 39, 0.80)',
    color: '#fff',
    boxShadow: '0 0 24px rgba(125, 220, 255, 0.16)',
  }

  const current = hovered ? hover : base

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
        border: current.border,
        background: current.background,
        boxShadow: current.boxShadow,
        fontFamily: 'var(--font-label)',
        fontWeight: 500,
        fontSize: 'clamp(0.72rem, 1.1vw, 0.82rem)',
        letterSpacing: '0.04em',
        color: current.color,
        cursor: 'default',
        transition: 'border 0.3s ease, background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </motion.span>
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
          decoding="async"
          fetchPriority="high"
          src="/brand_assets/Blog_1.webp"
          alt="Blog hero"
          width={1400}
          height={747}
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
            <Footer
              eyebrow="Get in touch"
              heading={<>
                Ready to put the right{' '}
                <em style={{
                  fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400,
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #7DDCFF 45%, #B7AEFF 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 0 24px rgba(125, 220, 255, 0.16)',
                }}>
                  ideas
                </em>{' '}
                to work?
              </>}
              subtext="If something here sparked an idea, let's turn it into a clearer website, smarter workflow or stronger creative direction for your business."
              ctaLabel="Start a Conversation"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
