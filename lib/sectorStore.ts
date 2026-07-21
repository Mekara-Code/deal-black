import "server-only";

import { query } from "@/lib/database";
import { normalizeLanguage, type LanguageCode } from "@/lib/i18n";

export type SectorStatus = "draft" | "published";
export type SectorBlockType = "paragraph" | "heading" | "image" | "list" | "quote" | "button" | "separator" | "spacer" | "columns" | "slideshow";
export type SectorLanguage = LanguageCode;

export type SectorSlide = {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
};

export type SectorBlock = {
  id: string;
  type: SectorBlockType;
  content?: string;
  level?: 1 | 2 | 3 | 4;
  url?: string;
  alt?: string;
  items?: string[];
  ordered?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  height?: number;
  alignment?: "right" | "center" | "left";
  columns?: string[];
  slides?: SectorSlide[];
  autoplay?: boolean;
};

export type Sector = {
  id: string;
  language: SectorLanguage;
  title: string;
  englishName: string;
  slug: string;
  excerpt: string;
  content: string;
  blocks: SectorBlock[];
  featuredImage: string;
  cta: string;
  icon: string;
  order: number;
  categories: string[];
  tags: string[];
  status: SectorStatus;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
};

export type SectorInput = Omit<Sector, "id" | "createdAt" | "updatedAt">;

type SectorRow = {
  [key: string]: unknown;
  id: string;
  language: string;
  title: string;
  english_name: string;
  slug: string;
  excerpt: string;
  content: string;
  blocks: unknown;
  featured_image: string;
  cta: string;
  icon: string;
  display_order: number;
  categories: unknown;
  tags: unknown;
  status: string;
  meta_description: string;
  created_at: Date | string;
  updated_at: Date | string;
};

const sectorColumns = `id, language, title, english_name, slug, excerpt, content, blocks, featured_image, cta, icon, display_order, categories, tags, status, meta_description, created_at, updated_at`;

function normalizeSlug(value: string, fallback: string) {
  const source = value || fallback || "sector";
  const slug = source.trim().toLowerCase().replace(/['"]/g, "").replace(/[^a-z0-9\u0600-\u06ff]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "sector";
}

function normalizeTags(value: string[]) {
  return value.flatMap((tag) => tag.split(",")).map((tag) => tag.trim()).filter(Boolean);
}

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function blocks(value: unknown) {
  return Array.isArray(value) ? value as SectorBlock[] : [];
}

function toIso(value: Date | string) {
  return new Date(value).toISOString();
}

function fromRow(row: SectorRow): Sector {
  return {
    id: row.id,
    language: normalizeLanguage(row.language),
    title: row.title,
    englishName: row.english_name,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    blocks: blocks(row.blocks),
    featuredImage: row.featured_image,
    cta: row.cta,
    icon: row.icon,
    order: row.display_order,
    categories: strings(row.categories),
    tags: strings(row.tags),
    status: row.status === "draft" ? "draft" : "published",
    metaDescription: row.meta_description,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function values(input: SectorInput, id: string, createdAt: string, updatedAt: string, order: number, slug: string) {
  const content = input.content.trim();
  return [
    id, normalizeLanguage(input.language), input.title.trim(), input.englishName.trim() || input.title.trim(), slug, input.excerpt.trim(), content,
    JSON.stringify(input.blocks.length ? input.blocks : [{ id: `${slug}-paragraph`, type: "paragraph", content }]), input.featuredImage.trim(), input.cta.trim() || "Explore opportunities", input.icon || "Wind", order,
    JSON.stringify(input.categories.length ? input.categories : ["Investment sectors"]), JSON.stringify(normalizeTags(input.tags)), input.status, input.metaDescription.trim() || input.excerpt.trim(), createdAt, updatedAt,
  ];
}

export async function listSectors() {
  const result = await query<SectorRow>(`SELECT ${sectorColumns} FROM sectors ORDER BY display_order ASC, updated_at DESC`);
  return result.rows.map(fromRow);
}

export async function getSectorById(id: string) {
  const result = await query<SectorRow>(`SELECT ${sectorColumns} FROM sectors WHERE id = $1`, [id]);
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function getSectorBySlug(slug: string, language?: LanguageCode) {
  const result = language
    ? await query<SectorRow>(`SELECT ${sectorColumns} FROM sectors WHERE slug = $1 AND language = $2`, [slug, normalizeLanguage(language)])
    : await query<SectorRow>(`SELECT ${sectorColumns} FROM sectors WHERE slug = $1 ORDER BY updated_at DESC LIMIT 1`, [slug]);
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function createSector(input: SectorInput) {
  const current = await listSectors();
  const language = normalizeLanguage(input.language);
  const slugBase = normalizeSlug(input.slug, input.englishName || input.title);
  const existingSlugs = new Set(current.filter((sector) => sector.language === language).map((sector) => sector.slug));
  let slug = slugBase;
  let suffix = 2;
  while (existingSlugs.has(slug)) slug = `${slugBase}-${suffix++}`;

  const now = new Date().toISOString();
  const id = `${slug}-${Date.now()}`;
  const result = await query<SectorRow>(
    `INSERT INTO sectors (${sectorColumns}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, $12, $13::jsonb, $14::jsonb, $15, $16, $17::timestamptz, $18::timestamptz) RETURNING ${sectorColumns}`,
    values(input, id, now, now, Number.isFinite(input.order) && input.order > 0 ? input.order : current.length + 1, slug),
  );
  return fromRow(result.rows[0]);
}

export async function updateSector(id: string, input: SectorInput) {
  const existing = await getSectorById(id);
  if (!existing) return null;

  const current = await listSectors();
  const language = normalizeLanguage(input.language);
  const slugBase = normalizeSlug(input.slug, input.englishName || input.title);
  const existingSlugs = new Set(current.filter((sector) => sector.id !== id && sector.language === language).map((sector) => sector.slug));
  let slug = slugBase;
  let suffix = 2;
  while (existingSlugs.has(slug)) slug = `${slugBase}-${suffix++}`;

  const now = new Date().toISOString();
  const result = await query<SectorRow>(
    `UPDATE sectors SET language = $2, title = $3, english_name = $4, slug = $5, excerpt = $6, content = $7, blocks = $8::jsonb, featured_image = $9, cta = $10, icon = $11, display_order = $12, categories = $13::jsonb, tags = $14::jsonb, status = $15, meta_description = $16, updated_at = $18::timestamptz WHERE id = $1 RETURNING ${sectorColumns}`,
    values(input, id, existing.createdAt, now, Number.isFinite(input.order) && input.order > 0 ? input.order : existing.order, slug),
  );
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function deleteSector(id: string) {
  const result = await query<SectorRow>(`DELETE FROM sectors WHERE id = $1 RETURNING ${sectorColumns}`, [id]);
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export function sectorStatusLabel(status: SectorStatus) {
  return status === "published" ? "Published" : "Draft";
}
