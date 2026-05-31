import { motion } from 'motion/react'
import { TestimonialsColumn, type Testimonial } from './ui/testimonials-columns-1'

const testimonials: Testimonial[] = [
  {
    text: "Weavy transformed our online presence entirely. The chatbot handles 80% of inquiries automatically — our team now focuses on closing deals.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "The automation systems they built save us hours every day. Implementation was smooth and the results were immediate.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "Our Instagram and WhatsApp bots now respond to leads 24/7. Engagement is up 3× since we started with Weavy.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "The bespoke website they delivered is stunning. Clean, fast, and exactly on brand. Clients constantly compliment it.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Social media went from a burden to a growth engine. The content strategy and scheduling system is exceptional.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "Weavy's paid ad strategy doubled our lead volume within the first month. ROI has been consistently strong.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "The AI chatbot on our website has become our best sales tool. It qualifies leads and books appointments automatically.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "Onboarding was fast and the team genuinely understood our business. The results exceeded everything we expected.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Our conversion rate improved significantly after the website redesign and chatbot integration. Highly recommend.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
]

const firstColumn  = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn  = testimonials.slice(6, 9)

export default function TestimonialsSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#010709', padding: 'clamp(5rem, 10vw, 7rem) 0' }}
    >
      {/* Top fade from Stats (#02080A) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
          background: 'linear-gradient(to bottom, #02080A, transparent)',
          pointerEvents: 'none', zIndex: 2,
        }}
      />

      {/* Subtle top radial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, hsl(199 89% 60% / 0.05) 0%, transparent 70%)',
        }}
      />

      {/* Bottom fade — blends into Footer background (#0a0a0a) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />

      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '40rem', margin: '0 auto 4rem' }}
        >
          <p
            className="font-sans font-light uppercase"
            style={{ fontSize: '0.65rem', letterSpacing: '0.32em', color: 'hsl(199 89% 60% / 0.7)', marginBottom: '1.4rem' }}
          >
            Testimonials
          </p>
          <h2
            className="font-sans font-light text-text"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.038em', marginBottom: '1rem' }}
          >
            What our{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              clients say
            </em>
          </h2>
          <p
            className="font-sans font-light"
            style={{ fontSize: 'clamp(0.85rem, 1.3vw, 0.95rem)', lineHeight: 1.8, color: 'hsl(0 0% 44%)', marginBottom: '2rem' }}
          >
            Real results from businesses we've helped grow — faster, smarter, and at scale.
          </p>
          <div
            aria-hidden="true"
            style={{
              width: '3rem',
              height: '1px',
              background: 'linear-gradient(to right, transparent, hsl(0 0% 100% / 0.1), transparent)',
            }}
          />
        </motion.div>

        {/* Columns */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.25rem',
            maxHeight: '680px',
            overflow: 'hidden',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          }}
        >
          <TestimonialsColumn testimonials={firstColumn}  duration={18} />
          <TestimonialsColumn testimonials={secondColumn} duration={22} className="hidden md:block" />
          <TestimonialsColumn testimonials={thirdColumn}  duration={20} className="hidden lg:block" />
        </div>

      </div>
    </section>
  )
}
