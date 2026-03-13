-- Run this once to initialize your D1 database:
-- wrangler d1 execute organic-shop-db --file=schema.sql

CREATE TABLE IF NOT EXISTS orders (
  id         TEXT    PRIMARY KEY,
  name       TEXT    NOT NULL,
  phone      TEXT    NOT NULL,
  items      TEXT    NOT NULL,  -- JSON array
  total      REAL    NOT NULL,
  created_at TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
