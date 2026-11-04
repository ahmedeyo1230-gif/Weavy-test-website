export interface PageSeo {
  title: string
  description: string
  path: string
  /** Keeps a page out of search results (used by the not-found view). */
  noindex?: boolean
}

const SITE_URL = 'https://www.weavyautomation.com'

export const PAGE_SEO: Record<'home' | 'about' | 'services' | 'work' | 'blog' | 'contact' | 'privacy' | 'notFound', PageSeo> = {
  home: {
    title: 'Weavy — AI Automation & Creative Agency in London',
    description: 'Weavy answers, qualifies and books new enquiries across voice, WhatsApp, Instagram and Facebook, and builds the websites and creative that bring them in.',
    path: '/',
  },
  about: {
    title: 'About Weavy — London Automation & Creative Agency',
    description: 'Weavy is a London-based automation and creative agency. One team connects the systems behind your enquiries and bookings with the creative that attracts customers.',
    path: '/about',
  },
  services: {
    title: 'Services — Weavy | Websites, AI Chatbots, Social & Creative',
    description: 'Bespoke websites, AI chatbots, social media marketing, graphic design and UGC content, planned and delivered by one team.',
    path: '/services',
  },
  work: {
    title: 'Selected Work — Weavy',
    description: 'A selection of brand campaigns, product visuals and creative systems by Weavy.',
    path: '/work',
  },
  blog: {
    title: 'Blog — Weavy | Automation & Growth Insights',
    description: 'Practical ideas on websites, AI automation, social media and visual identity for growing businesses.',
    path: '/blog',
  },
  contact: {
    title: 'Contact — Weavy | Book a Free Demo',
    description: 'Tell Weavy what you need help with: automation, chatbots, a new website or creative work.',
    path: '/contact',
  },
  privacy: {
    title: 'Privacy Notice — Weavy',
    description: 'How the Weavy website handles your information.',
    path: '/privacy',
  },
  notFound: {
    title: 'Page Not Found — Weavy',
    description: 'This page could not be found.',
    path: '/',
    noindex: true,
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
  setMeta('name', 'robots', page.noindex ? 'noindex, follow' : 'index, follow')
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
