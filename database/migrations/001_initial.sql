CREATE TABLE IF NOT EXISTS sectors (
  id TEXT PRIMARY KEY,
  language TEXT NOT NULL CHECK (language IN ('en', 'fa', 'ar')),
  title TEXT NOT NULL,
  english_name TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured_image TEXT NOT NULL DEFAULT '',
  cta TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  meta_description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT sectors_language_slug_key UNIQUE (language, slug)
);

CREATE INDEX IF NOT EXISTS sectors_display_order_idx ON sectors (display_order, updated_at DESC);

CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_fa TEXT NOT NULL,
  role_ar TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS team_members_public_idx ON team_members (status, display_order, updated_at);

CREATE TABLE IF NOT EXISTS partner_logos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS partner_logos_public_idx ON partner_logos (status, display_order, updated_at);

CREATE TABLE IF NOT EXISTS partner_stories (
  id TEXT PRIMARY KEY,
  translations JSONB NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS partner_stories_public_idx ON partner_stories (status, display_order, updated_at);

CREATE TABLE IF NOT EXISTS collaboration_requests (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('new', 'in_progress', 'closed')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS collaboration_requests_inbox_idx ON collaboration_requests (created_at DESC);

CREATE TABLE IF NOT EXISTS contact_settings (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  email TEXT NOT NULL,
  phone_primary TEXT NOT NULL,
  phone_secondary TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL,
  telegram TEXT NOT NULL,
  instagram TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  address_fa TEXT NOT NULL,
  address_en TEXT NOT NULL,
  address_ar TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  reading_minutes INTEGER NOT NULL CHECK (reading_minutes > 0),
  translations JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS news_articles_published_idx ON news_articles (published_at DESC);
