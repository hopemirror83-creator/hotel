CREATE TABLE IF NOT EXISTS rendered_hotel_pages (
  slug TEXT PRIMARY KEY,
  html TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rendered_hotel_pages_updated_at
  ON rendered_hotel_pages(updated_at);
