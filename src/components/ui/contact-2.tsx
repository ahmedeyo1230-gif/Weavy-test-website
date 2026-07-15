import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, Globe, Send } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Footer from "@/components/Footer"

interface Contact2Props {
  title?: string
  description?: string
  phone?: string
  email?: string
  web?: { label: string; url: string }
}

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── Network Visual ────────────────────────────────────────────────────────────

function NetworkVisual() {
  const reduceMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none w-full rounded-2xl overflow-hidden flex items-center justify-center"
      style={{
        minHeight: "320px",
        border: "1px solid rgba(56,189,248,0.14)",
        background: "rgba(56,189,248,0.018)",
        boxShadow:
          "0 0 0 1px rgba(56,189,248,0.04), 0 0 48px -8px rgba(56,189,248,0.14), 0 0 96px -24px rgba(34,211,238,0.08), inset 0 1px 0 rgba(56,189,248,0.07)",
      }}
    >
      <svg
        viewBox="0 0 300 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "88%", maxWidth: "300px" }}
      >
        <defs>
          <filter id="nv-hub-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="nv-node-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="nv-dot-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          <path id="nvp1" d="M150,140 L105,85" />
          <path id="nvp2" d="M150,140 L200,90" />
          <path id="nvp3" d="M150,140 L215,195" />
          <path id="nvp4" d="M105,85 L60,38" />
          <path id="nvp5" d="M200,90 L235,45" />

          <style>{`
            @keyframes nv-breathe{0%,100%{opacity:.72}50%{opacity:1}}
            @keyframes nv-breathe2{0%,100%{opacity:.5}50%{opacity:.92}}
            @keyframes nv-halo{0%,100%{opacity:.1}50%{opacity:.26}}
            @keyframes nv-hub-halo{0%,100%{opacity:.13}50%{opacity:.32}}
            @keyframes nv-la{0%,100%{opacity:.2}50%{opacity:.58}}
            @keyframes nv-lb{0%,100%{opacity:.14}50%{opacity:.48}}
            @keyframes nv-lc{0%,100%{opacity:.22}50%{opacity:.54}}
            @keyframes nv-ld{0%,100%{opacity:.1}50%{opacity:.38}}
            .nv-hub{animation:nv-breathe 4s ease-in-out infinite}
            .nv-hub-h{animation:nv-hub-halo 4s ease-in-out infinite}
            .nv-na{animation:nv-breathe2 3.5s ease-in-out infinite}
            .nv-nb{animation:nv-breathe2 4.5s ease-in-out infinite .8s}
            .nv-nc{animation:nv-breathe2 3.8s ease-in-out infinite 1.4s}
            .nv-nd{animation:nv-breathe2 5s ease-in-out infinite .3s}
            .nv-ha{animation:nv-halo 3.5s ease-in-out infinite .4s}
            .nv-hb{animation:nv-halo 4.5s ease-in-out infinite}
            .nv-hc{animation:nv-halo 3.8s ease-in-out infinite 1.2s}
            .nv-hd{animation:nv-halo 5s ease-in-out infinite .6s}
            .l-a{animation:nv-la 6s ease-in-out infinite}
            .l-b{animation:nv-lb 8s ease-in-out infinite 1s}
            .l-c{animation:nv-lc 7s ease-in-out infinite 2s}
            .l-d{animation:nv-ld 9s ease-in-out infinite .5s}
            .l-e{animation:nv-la 5.5s ease-in-out infinite 3s}
            .l-f{animation:nv-lb 7.5s ease-in-out infinite 1.5s}
            .l-g{animation:nv-lc 8.5s ease-in-out infinite .8s}
            .l-h{animation:nv-ld 6.5s ease-in-out infinite 2.5s}
            .l-i{animation:nv-la 10s ease-in-out infinite 1.2s}
            .l-j{animation:nv-lb 9.5s ease-in-out infinite 3.5s}
            .l-k{animation:nv-lc 11s ease-in-out infinite .3s}
            @media(prefers-reduced-motion:reduce){
              .nv-hub,.nv-hub-h,.nv-na,.nv-nb,.nv-nc,.nv-nd,
              .nv-ha,.nv-hb,.nv-hc,.nv-hd,
              .l-a,.l-b,.l-c,.l-d,.l-e,.l-f,.l-g,.l-h,.l-i,.l-j,.l-k{animation:none}
            }
          `}</style>
        </defs>

        {/* Lines */}
        <g strokeLinecap="round">
          <line x1="150" y1="140" x2="105" y2="85"  stroke="#38BDF8" strokeWidth="0.7" className="l-a" />
          <line x1="150" y1="140" x2="200" y2="90"  stroke="#38BDF8" strokeWidth="0.7" className="l-b" />
          <line x1="150" y1="140" x2="215" y2="195" stroke="#22D3EE" strokeWidth="0.7" className="l-c" />
          <line x1="150" y1="140" x2="80"  y2="200" stroke="#22D3EE" strokeWidth="0.7" className="l-d" />
          <line x1="105" y1="85"  x2="200" y2="90"  stroke="#38BDF8" strokeWidth="0.55" className="l-e" />
          <line x1="200" y1="90"  x2="215" y2="195" stroke="#0EA5E9" strokeWidth="0.55" className="l-f" />
          <line x1="215" y1="195" x2="80"  y2="200" stroke="#22D3EE" strokeWidth="0.55" className="l-g" />
          <line x1="80"  y1="200" x2="105" y2="85"  stroke="#0EA5E9" strokeWidth="0.55" className="l-h" />
          <line x1="105" y1="85"  x2="60"  y2="38"  stroke="#38BDF8" strokeWidth="0.45" className="l-a" />
          <line x1="200" y1="90"  x2="235" y2="45"  stroke="#38BDF8" strokeWidth="0.45" className="l-b" />
          <line x1="215" y1="195" x2="265" y2="165" stroke="#0EA5E9" strokeWidth="0.45" className="l-c" />
          <line x1="215" y1="195" x2="242" y2="258" stroke="#22D3EE" strokeWidth="0.45" className="l-i" />
          <line x1="80"  y1="200" x2="110" y2="260" stroke="#22D3EE" strokeWidth="0.45" className="l-j" />
          <line x1="80"  y1="200" x2="28"  y2="228" stroke="#0EA5E9" strokeWidth="0.45" className="l-k" />
          <line x1="105" y1="85"  x2="35"  y2="115" stroke="#38BDF8" strokeWidth="0.45" className="l-d" />
        </g>

        {/* Traveling particles */}
        {!reduceMotion && (
          <g>
            <circle r="1.6" fill="#38BDF8" filter="url(#nv-dot-glow)" opacity="0.95">
              <animateMotion dur="5s" repeatCount="indefinite" begin="0s"><mpath href="#nvp1" /></animateMotion>
            </circle>
            <circle r="1.6" fill="#22D3EE" filter="url(#nv-dot-glow)" opacity="0.9">
              <animateMotion dur="7s" repeatCount="indefinite" begin="1.5s"><mpath href="#nvp2" /></animateMotion>
            </circle>
            <circle r="1.3" fill="#38BDF8" filter="url(#nv-dot-glow)" opacity="0.82">
              <animateMotion dur="6s" repeatCount="indefinite" begin="3s"><mpath href="#nvp3" /></animateMotion>
            </circle>
            <circle r="1.3" fill="#0EA5E9" filter="url(#nv-dot-glow)" opacity="0.78">
              <animateMotion dur="8s" repeatCount="indefinite" begin="0.8s"><mpath href="#nvp4" /></animateMotion>
            </circle>
            <circle r="1.3" fill="#22D3EE" filter="url(#nv-dot-glow)" opacity="0.78">
              <animateMotion dur="6.5s" repeatCount="indefinite" begin="2.2s"><mpath href="#nvp5" /></animateMotion>
            </circle>
          </g>
        )}

        {/* Node halos */}
        <circle cx="105" cy="85"  r="16" fill="#38BDF8" filter="url(#nv-node-glow)" className="nv-ha" />
        <circle cx="200" cy="90"  r="16" fill="#38BDF8" filter="url(#nv-node-glow)" className="nv-hb" />
        <circle cx="215" cy="195" r="16" fill="#22D3EE" filter="url(#nv-node-glow)" className="nv-hc" />
        <circle cx="80"  cy="200" r="16" fill="#22D3EE" filter="url(#nv-node-glow)" className="nv-hd" />
        <circle cx="150" cy="140" r="26" fill="#38BDF8" filter="url(#nv-hub-glow)"  className="nv-hub-h" />

        {/* Outer nodes */}
        <circle cx="60"  cy="38"  r="2"   fill="#38BDF8" className="nv-na" />
        <circle cx="235" cy="45"  r="1.8" fill="#38BDF8" className="nv-nb" />
        <circle cx="265" cy="165" r="1.8" fill="#0EA5E9" className="nv-nc" />
        <circle cx="242" cy="258" r="2"   fill="#22D3EE" className="nv-na" />
        <circle cx="110" cy="260" r="1.8" fill="#0EA5E9" className="nv-nd" />
        <circle cx="28"  cy="228" r="1.8" fill="#38BDF8" className="nv-nb" />
        <circle cx="35"  cy="115" r="1.8" fill="#22D3EE" className="nv-nc" />

        {/* Inner nodes */}
        <circle cx="105" cy="85"  r="3.5" fill="#38BDF8" className="nv-na" />
        <circle cx="200" cy="90"  r="3.5" fill="#38BDF8" className="nv-nb" />
        <circle cx="215" cy="195" r="3.5" fill="#22D3EE" className="nv-nc" />
        <circle cx="80"  cy="200" r="3.5" fill="#22D3EE" className="nv-nd" />

        {/* Hub */}
        <circle cx="150" cy="140" r="6.5" fill="#38BDF8" className="nv-hub" />
        <circle cx="150" cy="140" r="3"   fill="#E0F7FF" opacity="0.95" className="nv-hub" />
      </svg>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export const Contact2 = ({
  title = "Get in touch",
  description = "Have a project in mind? We'd love to hear about it. Tell us what you're building and let's make it happen.",
  phone = "+44 (0) 20 1234 5678",
  email = "hello@weavyautomation.com",
  web = { label: "weavyautomation.com", url: "https://weavyautomation.com" },
}: Contact2Props) => {
  const [focused, setFocused] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass = (field: string) =>
    cn(
      "w-full bg-white/[0.03] border text-[#F8FAFC] placeholder:text-white/20 rounded-xl px-4 py-3 text-sm transition-all duration-300 outline-none",
      focused === field
        ? "border-[#38BDF8]/50 shadow-[0_0_20px_-6px_rgba(56,189,248,0.25)]"
        : "border-white/[0.08] hover:border-white/[0.14]"
    )

  return (
    <>
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-24 px-5">

        {/* ── Ambient glows ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #38BDF8, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1200px] mx-auto">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: E }}
            className="text-center mb-16"
          >
            <p className="text-[0.65rem] font-light tracking-[0.3em] uppercase text-white/35 mb-4">
              Let's work together
            </p>
            <h1
              className="font-light text-[#F8FAFC] leading-[1.05] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <em
                className="not-italic"
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {title.split(" ").slice(-1)[0]}
              </em>
            </h1>
            <p
              className="mt-5 font-light text-white/50 max-w-[520px] mx-auto leading-relaxed"
              style={{ fontSize: "clamp(0.88rem, 1.4vw, 1rem)" }}
            >
              {description}
            </p>
          </motion.div>

          {/* ── Two-column layout ── */}
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-8 items-start">

            {/* ── Left: contact details ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: E, delay: 0.15 }}
              className="flex flex-col gap-5"
            >
              {[
                { Icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
                { Icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
                { Icon: Globe, label: "Web", value: web.label, href: web.url },
              ].map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label === "Web" ? "_blank" : undefined}
                  rel={label === "Web" ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-[#38BDF8]/30 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/40 group-hover:text-[#38BDF8] group-hover:border-[#38BDF8]/30 transition-all duration-300">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="text-[0.62rem] tracking-[0.22em] uppercase text-white/30 font-light mb-0.5">
                      {label}
                    </p>
                    <p className="text-[0.9rem] text-white/75 font-light group-hover:text-white/90 transition-colors duration-300">
                      {value}
                    </p>
                  </div>
                </a>
              ))}

              {/* Status badge */}
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] mt-1">
                <span
                  className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0"
                  style={{ boxShadow: "0 0 8px rgba(34,197,94,0.7)", animation: "contact-pulse 2.2s ease-in-out infinite" }}
                />
                <p className="text-[0.78rem] font-light text-white/40 tracking-wide">
                  Available for new projects
                </p>
              </div>

              <NetworkVisual />
            </motion.div>

            {/* ── Right: form ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: E, delay: 0.22 }}
            >
              <div
                className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-8 md:p-10 backdrop-blur-sm"
                style={{ boxShadow: "0 32px 80px -20px rgba(0,0,0,0.5)" }}
              >
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: E }}
                    className="flex flex-col items-center justify-center text-center py-16 gap-5"
                  >
                    <span className="w-14 h-14 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
                      <Send size={22} />
                    </span>
                    <h3 className="text-xl font-light text-[#F8FAFC] tracking-tight">Message sent</h3>
                    <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                      Thank you for reaching out. We'll be in touch within one business day.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Name row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {["firstname", "lastname"].map((id) => (
                        <div key={id} className="flex flex-col gap-2">
                          <Label
                            htmlFor={id}
                            className="text-[0.7rem] tracking-[0.18em] uppercase text-white/35 font-light"
                          >
                            {id === "firstname" ? "First Name" : "Last Name"}
                          </Label>
                          <input
                            id={id}
                            type="text"
                            placeholder=""
                            required
                            onFocus={() => setFocused(id)}
                            onBlur={() => setFocused(null)}
                            className={inputClass(id)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="text-[0.7rem] tracking-[0.18em] uppercase text-white/35 font-light">
                        Email
                      </Label>
                      <input
                        id="email"
                        type="email"
                        placeholder=""
                        required
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        className={inputClass("email")}
                      />
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="subject" className="text-[0.7rem] tracking-[0.18em] uppercase text-white/35 font-light">
                        Subject
                      </Label>
                      <input
                        id="subject"
                        type="text"
                        placeholder=""
                        required
                        onFocus={() => setFocused("subject")}
                        onBlur={() => setFocused(null)}
                        className={inputClass("subject")}
                      />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="message" className="text-[0.7rem] tracking-[0.18em] uppercase text-white/35 font-light">
                        Message
                      </Label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder=""
                        required
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        className={cn(inputClass("message"), "resize-none leading-relaxed")}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="group mt-1 w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-light text-sm tracking-wide transition-all duration-300 text-[#010709] bg-[#F8FAFC] hover:bg-white"
                      style={{ boxShadow: "0 8px 32px -8px rgba(248,250,252,0.18)" }}
                    >
                      Send Message
                      <Send
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                      />
                    </button>

                  </form>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── Closing statement ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: E, delay: 0.5 }}
            className="text-center mt-20"
          >
            <p
              className="font-light tracking-[-0.01em] text-white/50"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.15 }}
            >
              Built with intention.
            </p>
            <p
              className="font-light tracking-[-0.01em] text-white/35 mt-2"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.15 }}
            >
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>
                Designed to scale.
              </em>
            </p>
          </motion.div>

        </div>

        <style>{`
          @keyframes contact-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>
      </section>

      {/* ── Contact footer ── */}
      <Footer
        id="site-footer"
        heading={<>
          Let's create something{' '}
          <em style={{
            fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400,
            background: 'linear-gradient(90deg, #FFFFFF 0%, #7DDCFF 45%, #B7AEFF 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 24px rgba(125, 220, 255, 0.16)',
          }}>
            amazing
          </em>{' '}
          together
        </>}
        subtext={<>
          Have a project in mind? I'd love to hear about it.{' '}
          <br />
          Let's discuss how we can work together.
        </>}
        ctaLabel={email}
        ctaHref={`mailto:${email}`}
      />
    </>
  )
}
