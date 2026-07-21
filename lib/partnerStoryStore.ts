import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { query } from "@/lib/database";
import type { LanguageCode } from "@/lib/i18n";

export type PartnerStoryStatus = "draft" | "published";

export type PartnerStoryTranslation = {
  name: string;
  tagline: string;
  quote: string;
};

export type PartnerStory = {
  id: string;
  translations: Record<LanguageCode, PartnerStoryTranslation>;
  imageUrl: string;
  order: number;
  status: PartnerStoryStatus;
  createdAt: string;
  updatedAt: string;
};

export type PartnerStoryInput = Pick<PartnerStory, "translations" | "imageUrl" | "order" | "status">;

export type LocalizedPartnerStory = {
  id: string;
  name: string;
  tagline: string;
  quote: string;
  imageUrl: string;
};

type PartnerStoryRow = {
  [key: string]: unknown;
  id: string;
  translations: unknown;
  image_url: string;
  display_order: number;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
};

const columns = "id, translations, image_url, display_order, status, created_at, updated_at";
const uploadsDirectory = path.join(process.cwd(), "public", "uploads", "partner-stories");
const publicUploadsPath = "/uploads/partner-stories";
const maxImageSize = 10 * 1024 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function finiteNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeTranslation(value: unknown): PartnerStoryTranslation {
  const source = isRecord(value) ? value : {};
  return { name: String(source.name ?? "").trim(), tagline: String(source.tagline ?? "").trim(), quote: String(source.quote ?? "").trim() };
}

function normalizeTranslations(value: unknown): Record<LanguageCode, PartnerStoryTranslation> {
  const source = isRecord(value) ? value : {};
  return { en: normalizeTranslation(source.en), fa: normalizeTranslation(source.fa), ar: normalizeTranslation(source.ar) };
}

function fromRow(row: PartnerStoryRow): PartnerStory {
  return {
    id: row.id,
    translations: normalizeTranslations(row.translations),
    imageUrl: row.image_url,
    order: row.display_order,
    status: row.status === "draft" ? "draft" : "published",
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function localizedStory(story: PartnerStory, language: LanguageCode): LocalizedPartnerStory {
  const translation = story.translations[language];
  const fallback = story.translations.en;
  return {
    id: story.id,
    name: translation.name || fallback.name,
    tagline: translation.tagline || fallback.tagline,
    quote: translation.quote || fallback.quote,
    imageUrl: story.imageUrl,
  };
}

export async function listPartnerStories() {
  const result = await query<PartnerStoryRow>(`SELECT ${columns} FROM partner_stories ORDER BY display_order ASC, updated_at ASC`);
  return result.rows.map(fromRow);
}

export async function listPublishedPartnerStories(language: LanguageCode) {
  const result = await query<PartnerStoryRow>(`SELECT ${columns} FROM partner_stories WHERE status = 'published' ORDER BY display_order ASC, updated_at ASC`);
  return result.rows.map(fromRow).map((story) => localizedStory(story, language));
}

export async function getPartnerStory(id: string) {
  const result = await query<PartnerStoryRow>(`SELECT ${columns} FROM partner_stories WHERE id = $1`, [id]);
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function createPartnerStory(input: PartnerStoryInput) {
  const stories = await listPartnerStories();
  const now = new Date().toISOString();
  const result = await query<PartnerStoryRow>(
    `INSERT INTO partner_stories (${columns}) VALUES ($1, $2::jsonb, $3, $4, $5, $6::timestamptz, $7::timestamptz) RETURNING ${columns}`,
    [`partner-story-${randomUUID()}`, JSON.stringify(normalizeTranslations(input.translations)), input.imageUrl.trim(), Number.isFinite(input.order) ? input.order : stories.length + 1, input.status, now, now],
  );
  return fromRow(result.rows[0]);
}

export async function updatePartnerStory(id: string, input: PartnerStoryInput) {
  const existing = await getPartnerStory(id);
  if (!existing) return null;
  const result = await query<PartnerStoryRow>(
    `UPDATE partner_stories SET translations = $2::jsonb, image_url = $3, display_order = $4, status = $5, updated_at = $7::timestamptz WHERE id = $1 RETURNING ${columns}`,
    [id, JSON.stringify(normalizeTranslations(input.translations)), input.imageUrl.trim(), Number.isFinite(input.order) ? input.order : existing.order, input.status, existing.createdAt, new Date().toISOString()],
  );
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function deletePartnerStory(id: string) {
  const result = await query<PartnerStoryRow>(`DELETE FROM partner_stories WHERE id = $1 RETURNING ${columns}`, [id]);
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

function imageExtension(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  return new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]).has(extension) ? extension : ".jpg";
}

export async function savePartnerStoryImage(file: File) {
  if (!file.type.startsWith("image/") || file.size > maxImageSize) throw new Error("Invalid partner-story image.");
  await mkdir(uploadsDirectory, { recursive: true });
  const fileName = `partner-${Date.now()}-${randomUUID()}${imageExtension(file)}`;
  await writeFile(path.join(uploadsDirectory, fileName), Buffer.from(await file.arrayBuffer()));
  return `${publicUploadsPath}/${fileName}`;
}

export async function removePartnerStoryImage(imageUrl: string) {
  if (!imageUrl.startsWith(`${publicUploadsPath}/`)) return;
  await rm(path.join(uploadsDirectory, path.basename(imageUrl)), { force: true });
}
