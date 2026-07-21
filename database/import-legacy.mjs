import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";

async function loadLocalEnvironment() {
  try {
    const file = await readFile(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of file.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]] !== undefined) continue;
      process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

async function readJson(fileName, fallback) {
  try {
    return JSON.parse(await readFile(path.join(process.cwd(), "data", fileName), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

function text(value) {
  return String(value ?? "").trim();
}

function timestamp(value) {
  const parsed = new Date(String(value ?? ""));
  return Number.isNaN(parsed.valueOf()) ? new Date().toISOString() : parsed.toISOString();
}

function status(value) {
  return value === "draft" ? "draft" : "published";
}

function requestStatus(value) {
  return ["new", "in_progress", "closed"].includes(value) ? value : "new";
}

function language(value) {
  return ["en", "fa", "ar"].includes(value) ? value : "en";
}

function translations(value) {
  const source = value && typeof value === "object" ? value : {};
  const entry = (locale) => {
    const item = source[locale] && typeof source[locale] === "object" ? source[locale] : {};
    return { name: text(item.name), tagline: text(item.tagline), quote: text(item.quote) };
  };
  return { en: entry("en"), fa: entry("fa"), ar: entry("ar") };
}

function groupPartnerStories(values) {
  const groups = new Map();

  for (const value of Array.isArray(values) ? values : []) {
    if (!value || typeof value !== "object") continue;
    if (value.translations) {
      groups.set(text(value.id), {
        id: text(value.id),
        translations: translations(value.translations),
        imageUrl: text(value.imageUrl),
        order: Number.isFinite(value.order) ? value.order : 0,
        status: status(value.status),
        createdAt: timestamp(value.createdAt),
        updatedAt: timestamp(value.updatedAt),
      });
      continue;
    }

    const suffix = text(value.id).replace(/^(?:en|fa|ar)-/, "") || text(value.id);
    const id = `partner-story-${suffix}`;
    const locale = language(value.language);
    const current = groups.get(id) ?? {
      id,
      translations: translations({}),
      imageUrl: "",
      order: Number.isFinite(value.order) ? value.order : 0,
      status: status(value.status),
      createdAt: timestamp(value.createdAt),
      updatedAt: timestamp(value.updatedAt),
    };

    current.translations[locale] = { name: text(value.name), tagline: text(value.tagline), quote: text(value.quote) };
    current.imageUrl ||= text(value.imageUrl);
    current.order = Math.min(current.order, Number.isFinite(value.order) ? value.order : current.order);
    current.status = current.status === "published" || status(value.status) === "published" ? "published" : "draft";
    current.createdAt = current.createdAt < timestamp(value.createdAt) ? current.createdAt : timestamp(value.createdAt);
    current.updatedAt = current.updatedAt > timestamp(value.updatedAt) ? current.updatedAt : timestamp(value.updatedAt);
    groups.set(id, current);
  }

  return [...groups.values()];
}

await loadLocalEnvironment();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to import legacy data.");

const pool = new pg.Pool({ connectionString, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined });

try {
  const [sectors, members, logos, stories, requests, contact] = await Promise.all([
    readJson("sectors.json", []),
    readJson("team-members.json", []),
    readJson("partner-logos.json", []),
    readJson("partner-stories.json", []),
    readJson("collaboration-requests.json", []),
    readJson("contact-settings.json", null),
  ]);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const item of Array.isArray(sectors) ? sectors : []) {
      await client.query(
        `INSERT INTO sectors (id, language, title, english_name, slug, excerpt, content, blocks, featured_image, cta, icon, display_order, categories, tags, status, meta_description, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, $12, $13::jsonb, $14::jsonb, $15, $16, $17::timestamptz, $18::timestamptz)
         ON CONFLICT (id) DO UPDATE SET language = EXCLUDED.language, title = EXCLUDED.title, english_name = EXCLUDED.english_name, slug = EXCLUDED.slug, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content, blocks = EXCLUDED.blocks, featured_image = EXCLUDED.featured_image, cta = EXCLUDED.cta, icon = EXCLUDED.icon, display_order = EXCLUDED.display_order, categories = EXCLUDED.categories, tags = EXCLUDED.tags, status = EXCLUDED.status, meta_description = EXCLUDED.meta_description, updated_at = EXCLUDED.updated_at`,
        [text(item.id), language(item.language), text(item.title), text(item.englishName) || text(item.title), text(item.slug), text(item.excerpt), text(item.content), JSON.stringify(Array.isArray(item.blocks) ? item.blocks : []), text(item.featuredImage), text(item.cta), text(item.icon), Number.isFinite(item.order) ? item.order : 0, JSON.stringify(Array.isArray(item.categories) ? item.categories : []), JSON.stringify(Array.isArray(item.tags) ? item.tags : []), status(item.status), text(item.metaDescription), timestamp(item.createdAt), timestamp(item.updatedAt)],
      );
    }

    for (const item of Array.isArray(members) ? members : []) {
      await client.query(
        `INSERT INTO team_members (id, name_en, name_fa, name_ar, role_en, role_fa, role_ar, image_url, display_order, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::timestamptz, $12::timestamptz)
         ON CONFLICT (id) DO UPDATE SET name_en = EXCLUDED.name_en, name_fa = EXCLUDED.name_fa, name_ar = EXCLUDED.name_ar, role_en = EXCLUDED.role_en, role_fa = EXCLUDED.role_fa, role_ar = EXCLUDED.role_ar, image_url = EXCLUDED.image_url, display_order = EXCLUDED.display_order, status = EXCLUDED.status, updated_at = EXCLUDED.updated_at`,
        [text(item.id), text(item.nameEn), text(item.nameFa), text(item.nameAr), text(item.roleEn), text(item.roleFa), text(item.roleAr), text(item.imageUrl), Number.isFinite(item.order) ? item.order : 0, status(item.status), timestamp(item.createdAt), timestamp(item.updatedAt)],
      );
    }

    for (const item of Array.isArray(logos) ? logos : []) {
      await client.query(
        `INSERT INTO partner_logos (id, name, website_url, image_url, display_order, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7::timestamptz, $8::timestamptz)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, website_url = EXCLUDED.website_url, image_url = EXCLUDED.image_url, display_order = EXCLUDED.display_order, status = EXCLUDED.status, updated_at = EXCLUDED.updated_at`,
        [text(item.id), text(item.name), text(item.websiteUrl), text(item.imageUrl), Number.isFinite(item.order) ? item.order : 0, status(item.status), timestamp(item.createdAt), timestamp(item.updatedAt)],
      );
    }

    for (const item of groupPartnerStories(stories)) {
      await client.query(
        `INSERT INTO partner_stories (id, translations, image_url, display_order, status, created_at, updated_at)
         VALUES ($1, $2::jsonb, $3, $4, $5, $6::timestamptz, $7::timestamptz)
         ON CONFLICT (id) DO UPDATE SET translations = EXCLUDED.translations, image_url = EXCLUDED.image_url, display_order = EXCLUDED.display_order, status = EXCLUDED.status, updated_at = EXCLUDED.updated_at`,
        [item.id, JSON.stringify(item.translations), item.imageUrl, item.order, item.status, item.createdAt, item.updatedAt],
      );
    }

    for (const item of Array.isArray(requests) ? requests : []) {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text(item.id))) continue;
      await client.query(
        `INSERT INTO collaboration_requests (id, name, email, phone, message, status, created_at, updated_at)
         VALUES ($1::uuid, $2, $3, $4, $5, $6, $7::timestamptz, $8::timestamptz)
         ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, updated_at = EXCLUDED.updated_at`,
        [item.id, text(item.name), text(item.email), text(item.phone), text(item.message), requestStatus(item.status), timestamp(item.createdAt), timestamp(item.updatedAt ?? item.createdAt)],
      );
    }

    if (contact && typeof contact === "object") {
      await client.query(
        `INSERT INTO contact_settings (singleton, email, phone_primary, phone_secondary, whatsapp, telegram, instagram, linkedin, address_fa, address_en, address_ar, updated_at)
         VALUES (TRUE, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::timestamptz)
         ON CONFLICT (singleton) DO UPDATE SET email = EXCLUDED.email, phone_primary = EXCLUDED.phone_primary, phone_secondary = EXCLUDED.phone_secondary, whatsapp = EXCLUDED.whatsapp, telegram = EXCLUDED.telegram, instagram = EXCLUDED.instagram, linkedin = EXCLUDED.linkedin, address_fa = EXCLUDED.address_fa, address_en = EXCLUDED.address_en, address_ar = EXCLUDED.address_ar, updated_at = EXCLUDED.updated_at`,
        [text(contact.email), text(contact.phonePrimary), text(contact.phoneSecondary), text(contact.whatsapp), text(contact.telegram), text(contact.instagram), text(contact.linkedin), text(contact.addressFa), text(contact.addressEn), text(contact.addressAr), timestamp(contact.updatedAt)],
      );
    }

    await client.query("COMMIT");
    console.log("Legacy JSON data imported into PostgreSQL. The JSON files were left untouched as a backup.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}
