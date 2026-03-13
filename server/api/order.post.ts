/**
 * Local dev order handler — mirrors the Cloudflare Worker + D1 interface.
 * POST /api/order  →  writes to .data/orders.db, returns { success, orderId }
 *
 * Only active during `nuxt dev` — the static build has no server runtime.
 */

import { defineEventHandler, readBody, createError, setResponseStatus } from 'h3'
import type { H3Event } from 'h3'
import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { processOrder, INSERT_ORDER_SQL, OrderValidationError } from '../../utils/orderHandler'
import type { OrderDb, OrderPayload } from '../../utils/orderHandler'

// Lazy-singleton: one DB connection per worker process.
let _db: ReturnType<typeof Database> | null = null

function getDb(): ReturnType<typeof Database> {
  if (_db) return _db
  const dataDir = join(process.cwd(), '.data')
  mkdirSync(dataDir, { recursive: true })
  const db = new Database(join(dataDir, 'orders.db'))
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id             TEXT PRIMARY KEY,
      name           TEXT NOT NULL,
      phone          TEXT NOT NULL,
      items          TEXT NOT NULL,
      total          REAL NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
      created_at     TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
  `)
  // Migration: add payment_method to databases created before this column existed.
  const cols = db.prepare(`PRAGMA table_info(orders)`).all() as { name: string }[]
  if (!cols.some((c) => c.name === 'payment_method')) {
    db.exec(`ALTER TABLE orders ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery'`)
  }
  _db = db
  return db
}

// SQLite adapter — same interface as the D1 adapter in cloudflare/worker.ts
const sqliteDb: OrderDb = {
  async save(id: string, name: string, phone: string, itemsJson: string, total: number, paymentMethod: string, createdAt: string) {
    getDb().prepare(INSERT_ORDER_SQL).run(id, name, phone, itemsJson, total, paymentMethod, createdAt)
  },
}

export default defineEventHandler(async (event: H3Event) => {
  const payload = await readBody<Partial<OrderPayload>>(event)
  try {
    const { orderId, total } = await processOrder(payload, sqliteDb)
    console.info(`[local-db] Order saved: ${orderId} — ${payload.name} — $${total.toFixed(2)}`)
    setResponseStatus(event, 201)
    return { success: true, orderId }
  } catch (e: any) {
    console.error('[local-db] error:', e)
    throw createError({
      statusCode: e instanceof OrderValidationError ? 422 : 500,
      data: { success: false, error: e.message ?? 'Failed to save order.' },
    })
  }
})
