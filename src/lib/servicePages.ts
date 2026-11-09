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
      description: 'Bespoke websites from Weavy, custom-built to explain your value clearly, load fast and turn visitors into enquiries.',
      path: '/services/bespoke-website-design',
    },
  },
  {
    key: 'chatbot',
    cardId: 'custom-chatbots',
    path: '/services/custom-chatbots',
    seo: {
      title: 'Custom Chatbots' + SUFFIX,
      description: 'Custom AI chatbots from Weavy for your website, WhatsApp, Instagram, Messenger and TikTok that answer questions, qualify leads and handle bookings.',
      path: '/services/custom-chatbots',
    },
  },
  {
    key: 'social',
    cardId: 'social-media-marketing',
    path: '/services/social-media-marketing',
    seo: {
      title: 'Social Media Marketing' + SUFFIX,
      description: 'Social media marketing from Weavy: planned content, paid campaigns and clear reporting designed to grow your audience and enquiries.',
      path: '/services/social-media-marketing',
    },
  },
  {
    key: 'graphic',
    cardId: 'graphic-design-animation',
    path: '/services/graphic-design-animation',
    seo: {
      title: 'Graphic Design & Animation' + SUFFIX,
      description: 'Brand identities, campaign graphics and motion graphics from Weavy, designed to make your business easier to recognise.',
      path: '/services/graphic-design-animation',
    },
  },
  {
    key: 'ugc',
    cardId: 'ugc',
    path: '/services/ugc-content-creation',
    seo: {
      title: 'UGC & Content Creation' + SUFFIX,
      description: 'Creator-led UGC videos from Weavy that show your product naturally and give customers a reason to trust your brand.',
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
