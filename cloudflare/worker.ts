/// <reference types="@cloudflare/workers-types" />
/**
 * Cloudflare Worker — Order Handler
 * POST /order  →  validates, writes to D1, returns { success, orderId }
 */

import { processOrder, INSERT_ORDER_SQL, OrderValidationError } from '../utils/orderHandler'
import type { OrderDb, OrderPayload } from '../utils/orderHandler'

export interface Env {
  DB: D1Database
  ALLOWED_ORIGIN: string
}

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

      // D1 adapter — same interface as the SQLite adapter in server/api/order.post.ts
      const d1Db: OrderDb = {
        async save(id, name, phone, itemsJson, total, paymentMethod, createdAt) {
          await env.DB.prepare(INSERT_ORDER_SQL)
            .bind(id, name, phone, itemsJson, total, paymentMethod, createdAt)
            .run()
        },
      }

      try {
        const { orderId } = await processOrder(payload, d1Db)
        return json({ success: true, orderId }, 201, cors)
      } catch (e: any) {
        if (e instanceof OrderValidationError) {
          return json({ success: false, error: e.message }, 422, cors)
        }
        console.error('D1 insert error:', e)
        return json({ success: false, error: 'Failed to save order. Please try again.' }, 500, cors)
      }
    }

    return json({ success: false, error: 'Not found.' }, 404, cors)
  },
}
