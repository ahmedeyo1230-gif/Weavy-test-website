import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, ChevronDown, Mail, Phone, Send } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Footer from "@/components/Footer"
import { goToPath } from "@/lib/navigation"
import { WHATSAPP_HREF } from "@/lib/contactLinks"

interface Contact2Props {
  title?: string
  description?: string
  phone?: string
  email?: string
}

const SERVICE_OPTIONS = [
  "Book a free demo",
  "AI chatbots or voice agents",
  "CRM, bookings and automation",
  "Website design",
  "Social media marketing",
  "Graphic design or animation",
  "UGC and content creation",
  "Not sure yet",
]

type FormStatus = "idle" | "sending" | "sent" | "error"
type FormError = "invalid" | "rate_limited" | "unavailable"

const FORM_ERRORS: Record<FormError, string> = {
  invalid: "Please check your details and try again.",
  rate_limited: "We've received several attempts from this connection. Please wait a few minutes or contact us directly.",
  unavailable: "We couldn't send your message. Your details are still in the form, so you can try again or contact us directly.",
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
        border: "1px solid rgba(255,216,107,0.14)",
        background: "rgba(255,216,107,0.018)",
        boxShadow:
          "0 0 0 1px rgba(255,216,107,0.04), 0 0 48px -8px rgba(255,216,107,0.14), 0 0 96px -24px rgba(255,216,107,0.08), inset 0 1px 0 rgba(255,216,107,0.07)",
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
          <line x1="150" y1="140" x2="105" y2="85"  stroke="#FFD86B" strokeWidth="0.7" className="l-a" />
          <line x1="150" y1="140" x2="200" y2="90"  stroke="#FFD86B" strokeWidth="0.7" className="l-b" />
          <line x1="150" y1="140" x2="215" y2="195" stroke="#FFD86B" strokeWidth="0.7" className="l-c" />
          <line x1="150" y1="140" x2="80"  y2="200" stroke="#FFD86B" strokeWidth="0.7" className="l-d" />
          <line x1="105" y1="85"  x2="200" y2="90"  stroke="#FFD86B" strokeWidth="0.55" className="l-e" />
          <line x1="200" y1="90"  x2="215" y2="195" stroke="#FFD86B" strokeWidth="0.55" className="l-f" />
          <line x1="215" y1="195" x2="80"  y2="200" stroke="#FFD86B" strokeWidth="0.55" className="l-g" />
          <line x1="80"  y1="200" x2="105" y2="85"  stroke="#FFD86B" strokeWidth="0.55" className="l-h" />
          <line x1="105" y1="85"  x2="60"  y2="38"  stroke="#FFD86B" strokeWidth="0.45" className="l-a" />
          <line x1="200" y1="90"  x2="235" y2="45"  stroke="#FFD86B" strokeWidth="0.45" className="l-b" />
          <line x1="215" y1="195" x2="265" y2="165" stroke="#FFD86B" strokeWidth="0.45" className="l-c" />
          <line x1="215" y1="195" x2="242" y2="258" stroke="#FFD86B" strokeWidth="0.45" className="l-i" />
          <line x1="80"  y1="200" x2="110" y2="260" stroke="#FFD86B" strokeWidth="0.45" className="l-j" />
          <line x1="80"  y1="200" x2="28"  y2="228" stroke="#FFD86B" strokeWidth="0.45" className="l-k" />
          <line x1="105" y1="85"  x2="35"  y2="115" stroke="#FFD86B" strokeWidth="0.45" className="l-d" />
        </g>

        {/* Traveling particles */}
        {!reduceMotion && (
          <g>
            <circle r="1.6" fill="#FFD86B" filter="url(#nv-dot-glow)" opacity="0.95">
              <animateMotion dur="5s" repeatCount="indefinite" begin="0s"><mpath href="#nvp1" /></animateMotion>
            </circle>
            <circle r="1.6" fill="#FFD86B" filter="url(#nv-dot-glow)" opacity="0.9">
              <animateMotion dur="7s" repeatCount="indefinite" begin="1.5s"><mpath href="#nvp2" /></animateMotion>
            </circle>
            <circle r="1.3" fill="#FFD86B" filter="url(#nv-dot-glow)" opacity="0.82">
              <animateMotion dur="6s" repeatCount="indefinite" begin="3s"><mpath href="#nvp3" /></animateMotion>
            </circle>
            <circle r="1.3" fill="#FFD86B" filter="url(#nv-dot-glow)" opacity="0.78">
              <animateMotion dur="8s" repeatCount="indefinite" begin="0.8s"><mpath href="#nvp4" /></animateMotion>
            </circle>
            <circle r="1.3" fill="#FFD86B" filter="url(#nv-dot-glow)" opacity="0.78">
              <animateMotion dur="6.5s" repeatCount="indefinite" begin="2.2s"><mpath href="#nvp5" /></animateMotion>
            </circle>
          </g>
        )}

        {/* Node halos */}
        <circle cx="105" cy="85"  r="16" fill="#FFD86B" filter="url(#nv-node-glow)" className="nv-ha" />
        <circle cx="200" cy="90"  r="16" fill="#FFD86B" filter="url(#nv-node-glow)" className="nv-hb" />
        <circle cx="215" cy="195" r="16" fill="#FFD86B" filter="url(#nv-node-glow)" className="nv-hc" />
        <circle cx="80"  cy="200" r="16" fill="#FFD86B" filter="url(#nv-node-glow)" className="nv-hd" />
        <circle cx="150" cy="140" r="26" fill="#FFD86B" filter="url(#nv-hub-glow)"  className="nv-hub-h" />

        {/* Outer nodes */}
        <circle cx="60"  cy="38"  r="2"   fill="#FFD86B" className="nv-na" />
        <circle cx="235" cy="45"  r="1.8" fill="#FFD86B" className="nv-nb" />
        <circle cx="265" cy="165" r="1.8" fill="#FFD86B" className="nv-nc" />
        <circle cx="242" cy="258" r="2"   fill="#FFD86B" className="nv-na" />
        <circle cx="110" cy="260" r="1.8" fill="#FFD86B" className="nv-nd" />
        <circle cx="28"  cy="228" r="1.8" fill="#FFD86B" className="nv-nb" />
        <circle cx="35"  cy="115" r="1.8" fill="#FFD86B" className="nv-nc" />

        {/* Inner nodes */}
        <circle cx="105" cy="85"  r="3.5" fill="#FFD86B" className="nv-na" />
        <circle cx="200" cy="90"  r="3.5" fill="#FFD86B" className="nv-nb" />
        <circle cx="215" cy="195" r="3.5" fill="#FFD86B" className="nv-nc" />
        <circle cx="80"  cy="200" r="3.5" fill="#FFD86B" className="nv-nd" />

        {/* Hub */}
        <circle cx="150" cy="140" r="6.5" fill="#FFD86B" className="nv-hub" />
        <circle cx="150" cy="140" r="3"   fill="#E0F7FF" opacity="0.95" className="nv-hub" />
      </svg>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export const Contact2 = ({
  title = "Tell us what you need",
  description = "Share a few details and we'll recommend the right next step, whether that's a free demo of an automation system or a new creative project.",
  phone = "+44 (0) 20 1234 5678",
  email = "hello@weavyautomation.com",
}: Contact2Props) => {
  const [focused, setFocused] = useState<string | null>(null)
  const [status, setStatus] = useState<FormStatus>("idle")
  const [formError, setFormError] = useState<FormError | null>(null)

  // A ref rather than state, so a rapid second tap can't slip through before re-render.
  const submitting = useRef(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setStatus("sending")
    setFormError(null)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
        signal: AbortSignal.timeout(15000),
      })
      const result = (await response.json().catch(() => null)) as { ok?: boolean; code?: string } | null
      if (response.ok && result?.ok) {
        setStatus("sent")
        submitting.current = false
        return
      }
      setFormError(result?.code === "invalid" || result?.code === "rate_limited" ? result.code : "unavailable")
    } catch {
      setFormError("unavailable")
    }
    submitting.current = false
    setStatus("error")
  }

  const inputClass = (field: string) =>
    cn(
      "w-full bg-white/[0.03] border text-[#F8FAFC] placeholder:text-white/20 rounded-xl px-4 py-3 text-base transition-all duration-300 outline-none",
      focused === field
        ? "border-[#FFD86B]/50 shadow-[0_0_20px_-6px_rgba(255,216,107,0.25)]"
        : "border-white/[0.08] hover:border-white/[0.14]"
    )

  return (
    <>
      <section className="relative w-full min-h-screen-safe flex items-center justify-center overflow-hidden py-24 px-6 sm:px-5">

        {/* ── Ambient glows ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #FFD86B, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #FFD86B, transparent 70%)" }}
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
            <p className="section-label mb-4">
              Book a free demo or start a project
            </p>
            <h1
              className="font-heading font-medium leading-[1.05] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", color: 'var(--text-primary)' }}
            >
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <em
                className="not-italic"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                {title.split(" ").slice(-1)[0]}
              </em>
            </h1>
            <p
              className="font-body mt-5 font-medium max-w-[520px] mx-auto leading-relaxed"
              style={{ fontSize: "clamp(0.88rem, 1.4vw, 1rem)", color: 'var(--text-body)' }}
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
              className="flex flex-col gap-5 min-w-0 order-2 lg:order-none"
            >
              {[
                { Icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
                { Icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
              ].map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-[#FFD86B]/30 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/75 group-hover:text-[#FFD86B] group-hover:border-[#FFD86B]/30 transition-all duration-300">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-label text-xs lg:text-xs tracking-[0.14em] uppercase font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>
                      {label}
                    </p>
                    <p className="font-body text-[0.95rem]  font-medium group-hover:text-white transition-colors duration-300 [overflow-wrap:anywhere]" style={{ color: 'var(--text-body)' }}>
                      {value}
                    </p>
                  </div>
                </a>
              ))}

              <NetworkVisual />
            </motion.div>

            {/* ── Right: form ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: E, delay: 0.22 }}
              className="order-1 lg:order-none min-w-0"
            >
              <div
                className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-8 md:p-10 backdrop-blur-sm"
                style={{ boxShadow: "0 32px 80px -20px rgba(0,0,0,0.5)" }}
              >
                {status === "sent" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: E }}
                    role="status"
                    className="flex flex-col items-center justify-center text-center py-16 gap-5"
                  >
                    <span className="w-14 h-14 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center text-gold">
                      <CheckCircle2 size={24} />
                    </span>
                    <h2 className="font-heading text-xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>Your enquiry has been sent</h2>
                    <p className="font-body text-sm max-w-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
                      Thank you. We&apos;ll reply to the email address you gave us.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="font-body text-sm underline underline-offset-4 min-h-[44px]"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Send another enquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Hidden from people; only automated submissions fill this in. */}
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                      <label htmlFor="confirm_fax">Leave this field empty</label>
                      <input id="confirm_fax" name="confirm_fax" type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    {/* Name row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {["firstname", "lastname"].map((id) => (
                        <div key={id} className="flex flex-col gap-2">
                          <Label
                            htmlFor={id}
                            className="font-label text-xs tracking-[0.14em] uppercase font-medium" style={{ color: 'var(--text-muted)' }}
                          >
                            {id === "firstname" ? "First Name" : "Last Name"}
                          </Label>
                          <input
                            id={id}
                            name={id}
                            type="text"
                            autoComplete={id === "firstname" ? "given-name" : "family-name"}
                            required
                            maxLength={40}
                            onFocus={() => setFocused(id)}
                            onBlur={() => setFocused(null)}
                            className={inputClass(id)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="font-label text-xs tracking-[0.14em] uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                        Email
                      </Label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        className={inputClass("email")}
                      />
                    </div>

                    {/* Service */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="service" className="font-label text-xs tracking-[0.14em] uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                        What do you need help with?
                      </Label>
                      <div className="relative">
                      <select
                        id="service"
                        name="service"
                        required
                        defaultValue=""
                        onFocus={() => setFocused("service")}
                        onBlur={() => setFocused(null)}
                        className={cn(inputClass("service"), "appearance-none pr-11")}
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="" disabled>Choose an option</option>
                        {SERVICE_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden="true" size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gold" />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="message" className="font-label text-xs tracking-[0.14em] uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                        Message
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        maxLength={5000}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        className={cn(inputClass("message"), "resize-none leading-relaxed")}
                      />
                    </div>

                    {/* Error: the visitor's details stay in the form */}
                    {status === "error" && formError && (
                      <div role="alert" className="rounded-xl border border-gold/40 bg-gold/10 p-4 font-body text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                        <p>{FORM_ERRORS[formError]}</p>
                        {formError !== "invalid" && (
                          <p className="mt-2 [overflow-wrap:anywhere]">
                            <a className="text-gold underline underline-offset-4" href={`mailto:${email}`}>{email}</a>
                            {' · '}
                            <a className="text-gold underline underline-offset-4" href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                            {' · '}
                            <a className="text-gold underline underline-offset-4" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="font-body btn-glow-primary group mt-1 w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-medium text-sm tracking-wide transition-all duration-300 disabled:opacity-70 disabled:cursor-wait"
                    >
                      {status === "sending" ? "Sending…" : "Send Enquiry"}
                      <Send
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                      />
                    </button>

                    <p className="font-body text-sm text-center" style={{ color: 'var(--text-description)', lineHeight: 1.6 }}>
                      We&apos;ll use your details to reply to your enquiry. See our{' '}
                      <a
                        href="/privacy"
                        className="text-gold underline underline-offset-4"
                        onClick={(e) => { e.preventDefault(); goToPath('/privacy') }}
                      >
                        privacy notice
                      </a>.
                    </p>

                  </form>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* The form above is this page's call to action, so the footer is bar-only. */}
      <Footer id="site-footer" showCta={false} />
    </>
  )
}
