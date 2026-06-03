import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, Globe, Send } from "lucide-react"
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
            <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-8 md:p-10 backdrop-blur-sm"
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

                  {/* Closing statement */}
                  <p className="text-center font-light tracking-wide text-white/40 pt-1" style={{ fontSize: "0.72rem" }}>
                    Built with intention.{" "}
                    <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.55)" }}>
                      Designed to scale.
                    </em>
                  </p>

                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

<style>{`
        @keyframes contact-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </section>
  )
}
