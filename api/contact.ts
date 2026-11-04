// Contact form endpoint (Vercel Function). Delivers each enquiry by email through
// Resend. It only reports success once the email provider has accepted the
// message, so a failure can never look like a sent enquiry.
//
// Required environment variables (see .env.example):
//   RESEND_API_KEY      API key from resend.com
//   CONTACT_TO_EMAIL    the inbox that receives enquiries
//   CONTACT_FROM_EMAIL  a sender on a domain verified with Resend

const RESEND_URL = 'https://api.resend.com/emails'
const LIMITS = { name: 80, email: 254, service: 80, message: 5000 }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best-effort abuse limit, held per server instance.
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const attempts = new Map<string, number[]>()

function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (attempts.get(key) ?? []).filter(time => now - time < RATE_WINDOW_MS)
  recent.push(now)
  attempts.set(key, recent)
  return recent.length > RATE_MAX
}

function reply(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')
// Subjects and sender names must stay on one line.
const singleLine = (value: string): string => value.replace(/[\r\n]+/g, ' ')

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return reply(403, { ok: false, code: 'forbidden' })

  const client = (request.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  if (isRateLimited(client)) return reply(429, { ok: false, code: 'rate_limited' })

  let data: Record<string, unknown>
  try {
    const parsed: unknown = await request.json()
    if (typeof parsed !== 'object' || parsed === null) throw new Error('Not an object')
    data = parsed as Record<string, unknown>
  } catch {
    return reply(400, { ok: false, code: 'invalid', fields: [] })
  }

  // A hidden field only automated submissions fill in: accept without sending.
  if (text(data.confirm_fax)) return reply(200, { ok: true })

  const name = singleLine(`${text(data.firstname)} ${text(data.lastname)}`.trim())
  const email = singleLine(text(data.email))
  const service = singleLine(text(data.service))
  const message = text(data.message)

  const fields: string[] = []
  if (!text(data.firstname) || !text(data.lastname) || name.length > LIMITS.name) fields.push('name')
  if (!EMAIL_PATTERN.test(email) || email.length > LIMITS.email) fields.push('email')
  if (!service || service.length > LIMITS.service) fields.push('service')
  if (!message || message.length > LIMITS.message) fields.push('message')
  if (fields.length > 0) return reply(400, { ok: false, code: 'invalid', fields })

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('Contact form is not configured: missing email environment variables.')
    return reply(503, { ok: false, code: 'not_configured' })
  }

  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Website enquiry: ${service} (${name})`,
        text: [`Name: ${name}`, `Email: ${email}`, `Interested in: ${service}`, '', message].join('\n'),
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) {
      console.error(`Contact form email was rejected with status ${response.status}.`)
      return reply(502, { ok: false, code: 'send_failed' })
    }
  } catch {
    console.error('Contact form email could not reach the provider.')
    return reply(502, { ok: false, code: 'send_failed' })
  }

  return reply(200, { ok: true })
}
