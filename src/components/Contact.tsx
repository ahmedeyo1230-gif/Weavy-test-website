import { Contact2 } from "@/components/ui/contact-2"

export default function Contact() {
  return (
    <main
      id="contact"
      style={{ minHeight: "100vh", background: "#010709" }}
    >
      <Contact2
        title="Get in touch"
        description="Have a project in mind? We'd love to hear about it. Tell us what you're building and let's make it happen."
        phone="+44 208 522 1210"
        email="hello@weavyautomation.com"
        web={{ label: "weavyautomation.com", url: "https://weavyautomation.com" }}
      />
    </main>
  )
}
