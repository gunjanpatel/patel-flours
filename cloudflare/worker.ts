/// <reference types="@cloudflare/workers-types" />

import { processOrder, INSERT_ORDER_SQL, OrderValidationError, sendTelegram } from '../utils/orderHandler'
import type { OrderDb, OrderPayload } from '../utils/orderHandler'

export interface Env {
  DB: D1Database
  ALLOWED_ORIGIN: string
  TURNSTILE_SECRET_KEY: string
  TELEGRAM_TOKEN: string
  TELEGRAM_CHAT_ID: string
}

// ── Rate limiting (in-memory per worker instance) ──────────────────────────
// Limits to 3 order attempts per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

// ── Turnstile verification ─────────────────────────────────────────────────
async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  if (!secret) return true // skip if not configured
  if (!token) return false
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  })
  const data = await res.json() as { success: boolean }
  return data.success === true
}

// ── CORS ───────────────────────────────────────────────────────────────────
const DEV_ORIGINS = ['http://localhost:3000', 'http://localhost:3001']

function corsHeaders(origin: string, env: Env): Record<string, string> {
  const allowed = [...DEV_ORIGINS, env.ALLOWED_ORIGIN].filter(Boolean)
  const allowedOrigin = allowed.includes(origin) ? origin : env.ALLOWED_ORIGIN
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

// ── Main handler ───────────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin') ?? ''
    const cors = corsHeaders(origin, env)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    const url = new URL(request.url)

    if (url.pathname === '/health' && request.method === 'GET') {
      return json({ ok: true }, 200, cors)
    }

    if (url.pathname === '/order' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'

      // ── Rate limit ──
      if (isRateLimited(ip)) {
        return json({ success: false, error: 'Too many requests. Please try again later.' }, 429, cors)
      }

      let payload: Partial<OrderPayload> & { turnstile_token?: string }
      try {
        payload = await request.json()
      } catch {
        return json({ success: false, error: 'Invalid JSON body.' }, 400, cors)
      }

      // ── Turnstile verification ──
      const turnstileOk = await verifyTurnstile(
        payload.turnstile_token ?? '',
        env.TURNSTILE_SECRET_KEY,
        ip
      )
      if (!turnstileOk) {
        return json({ success: false, error: 'Human verification failed. Please refresh and try again.' }, 403, cors)
      }

      // Remove turnstile token before passing to order processor
      const { turnstile_token, ...orderPayload } = payload

      const d1Db: OrderDb = {
        async save(id, name, phone, itemsJson, total, paymentMethod, createdAt) {
          await env.DB.prepare(INSERT_ORDER_SQL)
            .bind(id, name, phone, itemsJson, total, paymentMethod, createdAt)
            .run()
        },
      }

      try {
        const { orderId } = await processOrder(orderPayload, d1Db)

        ctx.waitUntil(
          sendTelegram(env.TELEGRAM_TOKEN, env.TELEGRAM_CHAT_ID, orderId, orderPayload as OrderPayload).catch(e =>
            console.error('Telegram failed:', e)
          )
        )

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
