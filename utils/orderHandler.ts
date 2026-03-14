/**
 * Shared order processing logic.
 * Used by both the local Nitro server route (server/api/order.post.ts)
 * and the Cloudflare Worker (cloudflare/worker.ts).
 *
 * Only the DB adapter (2–3 lines) differs between the two — everything else lives here.
 */

export interface OrderItem {
  sku: string
  name: string
  variant: string
  qty: number
  price: number
}

export type PaymentMethod = 'payment_on_delivery'

export interface OrderPayload {
  name: string
  phone: string
  items: OrderItem[]
  total: number
  payment_method: PaymentMethod
}

/** Minimal DB abstraction — implemented differently per runtime (SQLite vs D1). */
export interface OrderDb {
  save(
    id: string,
    name: string,
    phone: string,
    itemsJson: string,
    total: number,
    paymentMethod: string,
    createdAt: string
  ): Promise<void>
}

/** Shared SQL — identical to cloudflare/schema.sql table definition. */
export const INSERT_ORDER_SQL =
  `INSERT INTO orders (id, name, phone, items, total, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`

const PHONE_RE = /^\+?[0-9\s\-().]{8,15}$/

export function generateId(): string {
  return 'DY-' + Math.random().toString(36).slice(2, 10).toUpperCase()
}

export function validate(payload: Partial<OrderPayload>): string | null {
  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 2) {
    return 'Name is required (min 2 characters).'
  }
  const phone = payload.phone ?? ''
  const digits = phone.replace(/\D/g, '')
  if (!PHONE_RE.test(phone.trim()) || digits.length < 8 || digits.length > 15) {
    return 'A valid phone number is required (8–15 digits).'
  }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return 'Order must contain at least one item.'
  }
  if (payload.payment_method !== 'payment_on_delivery') {
    return 'Please select a payment method.'
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

export class OrderValidationError extends Error {
  readonly statusCode = 422
  constructor(message: string) {
    super(message)
    this.name = 'OrderValidationError'
  }
}

/**
 * Core order processing — validates, builds the record, persists via db.save().
 * Throws OrderValidationError (422) on bad input, re-throws DB errors as-is.
 */
export async function processOrder(
  payload: Partial<OrderPayload>,
  db: OrderDb
): Promise<{ orderId: string; total: number }> {
  const validationError = validate(payload)
  if (validationError) throw new OrderValidationError(validationError)

  const orderId = generateId()
  const createdAt = new Date().toISOString()
  const total = payload.items!.reduce((sum, i) => sum + i.price * i.qty, 0)
  const itemsJson = JSON.stringify(payload.items)

  await db.save(orderId, payload.name!.trim(), payload.phone!.trim(), itemsJson, total, payload.payment_method!, createdAt)

  return { orderId, total }
}

// ── Telegram ───────────────────────────────────────────────────────────────
export async function sendTelegram(TELEGRAM_TOKEN: string, TELEGRAM_CHAT_ID: string, orderId: string, payload: OrderPayload): Promise<void> {
  const items = payload.items
    .map(i => `  • ${i.name}${i.variant ? ` (${i.variant})` : ''} × ${i.qty} — DKK ${(i.price * i.qty).toFixed(2)}`)
    .join('\n')
  const text = [
    `🛒 *New Order — ${orderId}*`,
    ``,
    `👤 *Customer:* ${payload.name}`,
    `📞 *Phone:* ${payload.phone}`,
    ``,
    `*Items:*`,
    items,
    ``,
    `💰 *Total: DKK ${payload.total.toFixed(2)}*`,
  ].join('\n')
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text, parse_mode: 'Markdown' }),
  })
}