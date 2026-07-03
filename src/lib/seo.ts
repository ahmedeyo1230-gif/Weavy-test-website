export interface PageSeo {
  title: string
  description: string
  path: string
}

const SITE_URL = 'https://weavyautomation.com'

export const PAGE_SEO: Record<'home' | 'services' | 'work' | 'blog' | 'contact', PageSeo> = {
  home: {
    title: 'Weavy Automation — AI Automation, Web Design & Creative Systems',
    description: 'Weavy helps businesses grow with premium websites, AI automation, chatbots, social media systems, UGC content, graphic design, and video editing.',
    path: '/',
  },
  services: {
    title: 'Services — Weavy Automation | Websites, AI Chatbots & Social Systems',
    description: 'Explore Weavy\'s services: bespoke website design, AI chatbot automation, social media marketing, graphic design, and UGC content — built to scale your business.',
    path: '/#section-9',
  },
  work: {
    title: 'Our Work — Weavy Automation | Client Case Studies',
    description: 'See how Weavy has helped brands grow with premium websites, automation systems, and content campaigns — real projects, real results.',
    path: '/#work',
  },
  blog: {
    title: 'Blog — Weavy Automation | Automation & Growth Insights',
    description: 'Ideas and insights on AI automation, web design, and content systems for brands building smarter, more scalable operations.',
    path: '/#blog',
  },
  contact: {
    title: 'Contact — Weavy Automation | Book a Call',
    description: 'Get in touch with Weavy to discuss AI automation, web design, chatbots, or content systems for your business.',
    path: '/#contact',
  },
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function applyPageSeo(page: PageSeo) {
  document.title = page.title
  setMeta('name', 'description', page.description)
  setMeta('property', 'og:title', page.title)
  setMeta('property', 'og:description', page.description)
  setMeta('property', 'og:url', `${SITE_URL}${page.path}`)
  setMeta('name', 'twitter:title', page.title)
  setMeta('name', 'twitter:description', page.description)

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = `${SITE_URL}${page.path}`
}
