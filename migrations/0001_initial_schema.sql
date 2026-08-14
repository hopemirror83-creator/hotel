CREATE TABLE IF NOT EXISTS hotels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  agoda_hotel_id TEXT,
  hotel_name TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT,
  latitude REAL,
  longitude REAL,
  star_rating REAL,
  review_score REAL,
  review_count INTEGER,
  daily_rate INTEGER,
  crossed_out_rate INTEGER,
  discount_percentage INTEGER,
  image_url TEXT,
  landing_url TEXT,
  include_breakfast INTEGER NOT NULL DEFAULT 0,
  free_wifi INTEGER NOT NULL DEFAULT 0,
  map_match_status TEXT NOT NULL DEFAULT 'pending',
  manual_address TEXT,
  manual_latitude REAL,
  manual_longitude REAL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotel_search_signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hotel_id INTEGER NOT NULL,
  provider TEXT NOT NULL,
  query TEXT NOT NULL,
  result_count INTEGER NOT NULL DEFAULT 0,
  signal_titles_json TEXT NOT NULL DEFAULT '[]',
  signal_summaries_json TEXT NOT NULL DEFAULT '[]',
  collected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hotel_ai_contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hotel_id INTEGER NOT NULL,
  summary TEXT NOT NULL,
  pros_json TEXT NOT NULL DEFAULT '[]',
  cons_json TEXT NOT NULL DEFAULT '[]',
  recommended_for_json TEXT NOT NULL DEFAULT '[]',
  not_recommended_for_json TEXT NOT NULL DEFAULT '[]',
  check_points_json TEXT NOT NULL DEFAULT '[]',
  seo_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  quality_status TEXT NOT NULL DEFAULT 'pending',
  quality_notes TEXT,
  source_result_count INTEGER NOT NULL DEFAULT 0,
  generated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  published_at TEXT,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hotel_id INTEGER,
  action TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_hotels_region_status ON hotels(region, status);
CREATE INDEX IF NOT EXISTS idx_hotel_search_signals_hotel ON hotel_search_signals(hotel_id, collected_at);
CREATE INDEX IF NOT EXISTS idx_hotel_ai_contents_hotel ON hotel_ai_contents(hotel_id, generated_at);
