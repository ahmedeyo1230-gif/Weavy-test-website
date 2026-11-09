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
    description: 'Weavy is a London AI automation and creative agency. We answer, qualify and book new enquiries, and deliver paid social, digital marketing and creative work.',
    path: '/',
  },
  about: {
    title: 'About Weavy — London Automation & Creative Agency',
    description: 'Weavy is a London-based automation and creative agency: one team connecting your enquiries, bookings and follow-ups with creative work that builds trust.',
    path: '/about',
  },
  services: {
    title: 'Services — Weavy | Websites, AI Chatbots, Social & Creative',
    description: 'Explore Weavy\'s services: bespoke websites, AI chatbots, social media marketing, graphic design and animation, and UGC content, delivered by one team.',
    path: '/services',
  },
  work: {
    title: 'Selected Work — Weavy',
    description: 'Selected brand campaigns, product visuals and creative systems by Weavy, the London automation and creative agency.',
    path: '/work',
  },
  blog: {
    title: 'Blog — Weavy | Automation & Growth Insights',
    description: 'Practical insights from Weavy on websites, AI automation, social media and visual identity for growing businesses.',
    path: '/blog',
  },
  contact: {
    title: 'Contact — Weavy | Book a Free Demo',
    description: 'Book a free demo with Weavy. Tell us what you need help with, from automation and chatbots to a new website or creative work.',
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
