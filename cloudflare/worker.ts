/**
 * Cloudflare Worker — Order Handler
 * POST /order  →  validates, writes to D1, returns { success, orderId }
 */

export interface Env {
  DB: D1Database
  ALLOWED_ORIGIN: string // e.g. https://yourusername.github.io
}

interface OrderItem {
  sku: string
  name: string
  variant: string
  qty: number
  price: number
}

interface OrderPayload {
  name: string
  phone: string
  items: OrderItem[]
  total: number
}

const PHONE_RE = /^\+?[0-9\s\-().]{8,15}$/

function corsHeaders(origin: string, allowed: string): Record<string, string> {
  const allowedOrigin = allowed || '*'
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
}

function generateId(): string {
  return 'GC-' + Math.random().toString(36).slice(2, 10).toUpperCase()
}

function validate(payload: Partial<OrderPayload>): string | null {
  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 2) {
    return 'Name is required (min 2 characters).'
  }
  if (!payload.phone || typeof payload.phone !== 'string' || !PHONE_RE.test(payload.phone.trim())) {
    return 'A valid phone number is required (8–15 digits).'
  }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return 'Order must contain at least one item.'
  }
  for (const item of payload.items) {
    if (!item.sku || !item.name || typeof item.qty !== 'number' || item.qty < 1) {
      return 'One or more items are invalid.'
    }
    if (typeof item.price !== 'number' || item.price < 0) {
      return 'Item price is invalid.'
    }
  }
  return null
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? ''
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN)

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    const url = new URL(request.url)

    // Health check
    if (url.pathname === '/health' && request.method === 'GET') {
      return json({ ok: true }, 200, cors)
    }

    // POST /order
    if (url.pathname === '/order' && request.method === 'POST') {
      let payload: Partial<OrderPayload>

      try {
        payload = await request.json()
      } catch {
        return json({ success: false, error: 'Invalid JSON body.' }, 400, cors)
      }

      const validationError = validate(payload)
      if (validationError) {
        return json({ success: false, error: validationError }, 422, cors)
      }

      const orderId = generateId()
      const createdAt = new Date().toISOString()
      const itemsJson = JSON.stringify(payload.items)
      const total = payload.items!.reduce((sum, i) => sum + i.price * i.qty, 0)

      try {
        await env.DB.prepare(
          `INSERT INTO orders (id, name, phone, items, total, created_at) VALUES (?, ?, ?, ?, ?, ?)`
        )
          .bind(orderId, payload.name!.trim(), payload.phone!.trim(), itemsJson, total, createdAt)
          .run()
      } catch (e: any) {
        console.error('D1 insert error:', e)
        return json({ success: false, error: 'Failed to save order. Please try again.' }, 500, cors)
      }

      return json({ success: true, orderId }, 201, cors)
    }

    return json({ success: false, error: 'Not found.' }, 404, cors)
  },
}
