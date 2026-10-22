import type { PageSeo } from './seo'

// Each service has its own dedicated page under /services/<slug>. The overview
// at /services lists the cards; every "Learn More" links to one of these paths.
// `key` is the internal identifier the Services component uses to pick which
// service-detail sections to render; `cardId` matches the SERVICES card data.

export type ServiceKey = 'website' | 'chatbot' | 'social' | 'graphic' | 'ugc'

export interface ServicePage {
  key: ServiceKey
  cardId: string
  path: string
  seo: PageSeo
}

const SUFFIX = ' — Weavy Automation'

export const SERVICE_PAGES: ServicePage[] = [
  {
    key: 'website',
    cardId: 'bespoke-website-design',
    path: '/services/bespoke-website-design',
    seo: {
      title: 'Bespoke Website Design' + SUFFIX,
      description: 'Tailored, high-performance websites designed around your brand identity and user experience — built by Weavy to stand out and convert.',
      path: '/services/bespoke-website-design',
    },
  },
  {
    key: 'chatbot',
    cardId: 'custom-chatbots',
    path: '/services/custom-chatbots',
    seo: {
      title: 'Custom Chatbots' + SUFFIX,
      description: 'Intelligent chatbots for WhatsApp, Instagram, Facebook Messenger and TikTok that automate support, bookings and customer engagement.',
      path: '/services/custom-chatbots',
    },
  },
  {
    key: 'social',
    cardId: 'social-media-marketing',
    path: '/services/social-media-marketing',
    seo: {
      title: 'Social Media Marketing' + SUFFIX,
      description: 'Data-driven social media systems that grow your audience, reach and conversions across every platform.',
      path: '/services/social-media-marketing',
    },
  },
  {
    key: 'graphic',
    cardId: 'graphic-design-animation',
    path: '/services/graphic-design-animation',
    seo: {
      title: 'Graphic Design & Animation' + SUFFIX,
      description: 'High-quality visuals, branding assets and engaging motion graphics designed to elevate your brand.',
      path: '/services/graphic-design-animation',
    },
  },
  {
    key: 'ugc',
    cardId: 'ugc',
    path: '/services/ugc-content-creation',
    seo: {
      title: 'UGC & Content Creation' + SUFFIX,
      description: 'Authentic user-generated content and creator campaigns that build trust and connect your brand with its audience.',
      path: '/services/ugc-content-creation',
    },
  },
]

export const SERVICES_OVERVIEW_PATH = '/services'

/** Strips a trailing slash so "/services/custom-chatbots/" resolves the same page. */
export function normalisePath(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

/** True for the overview and for every path beneath it. */
export function isServicesPath(pathname: string): boolean {
  const path = normalisePath(pathname)
  return path === SERVICES_OVERVIEW_PATH || path.startsWith(SERVICES_OVERVIEW_PATH + '/')
}

/** The dedicated service page for a path, or null for the overview / unknown paths. */
export function servicePageFromPath(pathname: string): ServicePage | null {
  const path = normalisePath(pathname)
  return SERVICE_PAGES.find(page => page.path === path) ?? null
}

export function servicePageByCardId(cardId: string): ServicePage | null {
  return SERVICE_PAGES.find(page => page.cardId === cardId) ?? null
}
