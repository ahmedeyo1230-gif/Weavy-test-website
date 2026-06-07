import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, Globe, Send } from "lucide-react"
import gsap from "gsap"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Contact2Props {
  title?: string
  description?: string
  phone?: string
  email?: string
  web?: { label: string; url: string }
}

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const HLS_SRC = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8"
const MARQUEE_TEXT = "BUILDING THE FUTURE • "

const SOCIALS = [
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.629 0 12-5.372 12-12 0-6.627-5.371-12-12-12zm7.923 5.555a10.27 10.27 0 0 1 2.186 5.984c-.32-.063-3.521-.713-6.74-.308-.07-.175-.136-.354-.208-.529-.192-.479-.4-.956-.617-1.42 3.484-1.419 5.075-3.463 5.379-3.727zM12 1.777a10.217 10.217 0 0 1 6.964 2.728c-.264.233-1.67 2.138-5.044 3.392-1.577-2.895-3.326-5.277-3.598-5.654A10.37 10.37 0 0 1 12 1.777zM8.5 2.888c.261.36 1.98 2.752 3.577 5.585-4.514 1.2-8.5 1.177-8.922 1.166A10.26 10.26 0 0 1 8.5 2.888zM1.761 12.016v-.26c.41.01 5.063.083 9.888-1.37.277.54.538 1.088.78 1.638-.124.034-.25.072-.373.112-4.989 1.609-7.638 6.003-7.868 6.399A10.22 10.22 0 0 1 1.76 12.016zm10.24 10.213a10.21 10.21 0 0 1-6.158-2.063c.19-.386 2.356-4.565 7.856-6.477.021-.007.042-.016.062-.022a36.8 36.8 0 0 1 1.906 6.777 10.19 10.19 0 0 1-3.666.785zm5.389-1.83a38.33 38.33 0 0 0-1.773-6.324c2.924-.466 5.49.3 5.813.4a10.24 10.24 0 0 1-4.04 5.924z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
]

// ── Background video ──────────────────────────────────────────────────────────

function FooterVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    const isMobile = window.innerWidth < 768 || navigator.maxTouchPoints > 0
    if (isMobile) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cleanup: (() => void) | undefined
    let initialized = false

    const init = () => {
      if (initialized) return
      initialized = true
      import("hls.js").then(({ default: Hls }) => {
        if (!videoRef.current) return
        if (Hls.isSupported()) {
          const hls = new Hls({ startLevel: -1, maxBufferLength: 20, maxMaxBufferLength: 40 })
          hls.loadSource(HLS_SRC)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {})
          })
          cleanup = () => hls.destroy()
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = HLS_SRC
          video.play().catch(() => {})
        }
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          init()
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )
    observer.observe(container)

    return () => {
      observer.disconnect()
      cleanup?.()
    }
  }, [])

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          minWidth: "100%",
          minHeight: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%) scaleY(-1)",
        }}
      />
    </div>
  )
}

// ── GSAP Marquee ─────────────────────────────────────────────────────────────

function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const tween = gsap.to(el, {
      xPercent: -50,
      duration: 180,
      ease: "none",
      repeat: -1,
    })
    return () => { tween.kill() }
  }, [])

  const repeated = MARQUEE_TEXT.repeat(10)

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        borderTop: "1px solid hsl(0 0% 100% / 0.06)",
        borderBottom: "1px solid hsl(0 0% 100% / 0.06)",
        padding: "1.3rem 0",
      }}
    >
      <div ref={trackRef} style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
        {[0, 1].map((i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Didot', 'GFS Didot', 'Didot LT STD', 'Bodoni MT', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase" as const,
              color: "hsl(0 0% 100% / 0.28)",
              paddingRight: "2rem",
            }}
          >
            {repeated}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Contact footer section ────────────────────────────────────────────────────

function ContactFooter({ email }: { email: string }) {
  const [ctaHover, setCtaHover] = useState(false)

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ paddingTop: "clamp(4rem, 8vw, 5rem)" }}
    >
      {/* Top fade */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, #010709, transparent)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Background video */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <FooterVideo />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.62)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Marquee */}
        <Marquee />

        {/* CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            textAlign: "center" as const,
            padding: "clamp(3.5rem, 7vw, 5.5rem) 1.5rem",
          }}
        >
          <p
            className="font-sans font-light"
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase" as const,
              color: "hsl(0 0% 36%)",
              marginBottom: "2rem",
            }}
          >
            Get in touch
          </p>

          <h2
            className="font-sans font-light text-[#F8FAFC]"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap" as const,
              marginBottom: "1.25rem",
            }}
          >
            Let's create something{" "}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>
              amazing
            </em>{" "}
            together
          </h2>

          <p
            className="font-sans font-light"
            style={{
              fontSize: "clamp(0.88rem, 1.4vw, 1rem)",
              lineHeight: 1.8,
              color: "hsl(0 0% 44%)",
              maxWidth: "34rem",
              marginBottom: "2.5rem",
            }}
          >
            Have a project in mind? I'd love to hear about it.{" "}
            <br />
            Let's discuss how we can work together.
          </p>

          <a
            href={`mailto:${email}`}
            className="font-sans font-light"
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.45rem)",
              letterSpacing: "-0.01em",
              color: "hsl(0 0% 88%)",
              textDecoration: "none",
              padding: "0.8rem 2.2rem",
              borderRadius: "999px",
              border: ctaHover ? "1px solid hsl(199 89% 60% / 0.5)" : "1px solid hsl(0 0% 100% / 0.13)",
              background: ctaHover ? "hsl(0 0% 100% / 0.05)" : "hsl(0 0% 100% / 0.03)",
              backdropFilter: "blur(12px)",
              display: "inline-block",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
              boxShadow: ctaHover
                ? "0 0 32px -6px hsl(199 89% 60% / 0.22), inset 0 0 16px -8px hsl(199 89% 60% / 0.07)"
                : "none",
            }}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
          >
            {email}
          </a>
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap" as const,
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.25rem",
            padding: "1.2rem clamp(1.5rem, 5vw, 3.5rem) 2rem",
            borderTop: "1px solid hsl(0 0% 100% / 0.06)",
          }}
        >
          {/* Status dot */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span
              aria-hidden="true"
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "hsl(142 65% 50%)",
                boxShadow: "0 0 8px hsl(142 65% 50% / 0.7)",
                display: "inline-block",
                animation: "cf-dot-pulse 2.2s ease-in-out infinite",
              }}
            />
            <span
              className="font-sans font-light"
              style={{ fontSize: "0.73rem", letterSpacing: "0.1em", color: "hsl(0 0% 38%)" }}
            >
              Available for projects
            </span>
          </div>

          {/* Social links */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  color: "hsl(0 0% 34%)",
                  display: "flex",
                  transition: "color 0.25s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "hsl(0 0% 78%)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "hsl(0 0% 34%)" }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes cf-dot-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </footer>
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
                { Icon: Phone, label: "Phone", value: phone, href: `tel:${phone}` },
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
      <ContactFooter email={email} />
    </>
  )
}
