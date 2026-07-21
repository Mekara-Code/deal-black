import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { query } from "@/lib/database";

export type PartnerLogoStatus = "draft" | "published";

export type PartnerLogo = {
  id: string;
  name: string;
  websiteUrl: string;
  imageUrl: string;
  order: number;
  status: PartnerLogoStatus;
  createdAt: string;
  updatedAt: string;
};

export type PartnerLogoInput = Pick<PartnerLogo, "name" | "websiteUrl" | "imageUrl" | "order" | "status">;

type PartnerLogoRow = {
  [key: string]: unknown;
  id: string;
  name: string;
  website_url: string;
  image_url: string;
  display_order: number;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
};

const columns = "id, name, website_url, image_url, display_order, status, created_at, updated_at";
const uploadsDirectory = path.join(process.cwd(), "public", "uploads", "partner-logos");
const publicUploadsPath = "/uploads/partner-logos";
const maxImageSize = 3 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/avif", "image/jpeg", "image/png", "image/webp"]);

function fromRow(row: PartnerLogoRow): PartnerLogo {
  return {
    id: row.id,
    name: row.name,
    websiteUrl: row.website_url,
    imageUrl: row.image_url,
    order: row.display_order,
    status: row.status === "draft" ? "draft" : "published",
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function values(input: PartnerLogoInput, id: string, createdAt: string, updatedAt: string, order: number) {
  return [id, input.name.trim(), input.websiteUrl.trim(), input.imageUrl.trim(), order, input.status, createdAt, updatedAt];
}

export async function listPartnerLogos() {
  const result = await query<PartnerLogoRow>(`SELECT ${columns} FROM partner_logos ORDER BY display_order ASC, updated_at ASC`);
  return result.rows.map(fromRow);
}

/** Returns only logos explicitly approved for public display. */
export async function listPublishedPartnerLogos() {
  const result = await query<PartnerLogoRow>(`SELECT ${columns} FROM partner_logos WHERE status = 'published' ORDER BY display_order ASC, updated_at ASC`);
  return result.rows.map(fromRow);
}

export async function getPartnerLogo(id: string) {
  const result = await query<PartnerLogoRow>(`SELECT ${columns} FROM partner_logos WHERE id = $1`, [id]);
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function createPartnerLogo(input: PartnerLogoInput) {
  const logos = await listPartnerLogos();
  const now = new Date().toISOString();
  const result = await query<PartnerLogoRow>(
    `INSERT INTO partner_logos (${columns}) VALUES ($1, $2, $3, $4, $5, $6, $7::timestamptz, $8::timestamptz) RETURNING ${columns}`,
    values(input, `partner-logo-${randomUUID()}`, now, now, Number.isFinite(input.order) ? input.order : logos.length + 1),
  );
  return fromRow(result.rows[0]);
}

export async function updatePartnerLogo(id: string, input: PartnerLogoInput) {
  const existing = await getPartnerLogo(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  const result = await query<PartnerLogoRow>(
    `UPDATE partner_logos SET name = $2, website_url = $3, image_url = $4, display_order = $5, status = $6, updated_at = $8::timestamptz WHERE id = $1 RETURNING ${columns}`,
    values(input, id, existing.createdAt, now, Number.isFinite(input.order) ? input.order : existing.order),
  );
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function deletePartnerLogo(id: string) {
  const result = await query<PartnerLogoRow>(`DELETE FROM partner_logos WHERE id = $1 RETURNING ${columns}`, [id]);
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

function detectImageExtension(bytes: Buffer) {
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return ".png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return ".jpg";
  if (bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return ".webp";
  if (bytes.subarray(4, 8).toString("ascii") === "ftyp" && ["avif", "avis"].includes(bytes.subarray(8, 12).toString("ascii"))) return ".avif";
  return null;
}

/** Saves only verified raster logo files; SVG is excluded to prevent script-bearing uploads. */
export async function savePartnerLogoImage(file: File) {
  if (!allowedMimeTypes.has(file.type) || file.size <= 0 || file.size > maxImageSize) throw new Error("Invalid partner logo image.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = detectImageExtension(bytes);
  if (!extension) throw new Error("Invalid partner logo image.");
  await mkdir(uploadsDirectory, { recursive: true });
  const fileName = `partner-logo-${randomUUID()}${extension}`;
  await writeFile(path.join(uploadsDirectory, fileName), bytes);
  return `${publicUploadsPath}/${fileName}`;
}

export async function removePartnerLogoImage(imageUrl: string) {
  if (!imageUrl.startsWith(`${publicUploadsPath}/`)) return;
  await rm(path.join(uploadsDirectory, path.basename(imageUrl)), { force: true });
}
