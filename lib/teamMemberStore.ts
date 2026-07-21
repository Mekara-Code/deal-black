import "server-only";

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { query } from "@/lib/database";

export type TeamMemberStatus = "draft" | "published";

export type TeamMember = {
  id: string;
  nameEn: string;
  nameFa: string;
  nameAr: string;
  roleEn: string;
  roleFa: string;
  roleAr: string;
  imageUrl: string;
  order: number;
  status: TeamMemberStatus;
  createdAt: string;
  updatedAt: string;
};

export type TeamMemberInput = Pick<TeamMember, "nameEn" | "nameFa" | "nameAr" | "roleEn" | "roleFa" | "roleAr" | "imageUrl" | "order" | "status">;

type TeamMemberRow = {
  [key: string]: unknown;
  id: string;
  name_en: string;
  name_fa: string;
  name_ar: string;
  role_en: string;
  role_fa: string;
  role_ar: string;
  image_url: string;
  display_order: number;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
};

const columns = "id, name_en, name_fa, name_ar, role_en, role_fa, role_ar, image_url, display_order, status, created_at, updated_at";
const uploadsDirectory = path.join(process.cwd(), "public", "uploads", "team-members");
const publicUploadsPath = "/uploads/team-members";
const maxImageSize = 10 * 1024 * 1024;

function fromRow(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    nameEn: row.name_en,
    nameFa: row.name_fa,
    nameAr: row.name_ar,
    roleEn: row.role_en,
    roleFa: row.role_fa,
    roleAr: row.role_ar,
    imageUrl: row.image_url,
    order: row.display_order,
    status: row.status === "draft" ? "draft" : "published",
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function values(input: TeamMemberInput, id: string, createdAt: string, updatedAt: string, order: number) {
  return [id, input.nameEn.trim(), input.nameFa.trim(), input.nameAr.trim(), input.roleEn.trim(), input.roleFa.trim(), input.roleAr.trim(), input.imageUrl.trim(), order, input.status, createdAt, updatedAt];
}

export async function listTeamMembers() {
  const result = await query<TeamMemberRow>(`SELECT ${columns} FROM team_members ORDER BY display_order ASC, updated_at ASC`);
  return result.rows.map(fromRow);
}

export async function listPublishedTeamMembers() {
  const result = await query<TeamMemberRow>(`SELECT ${columns} FROM team_members WHERE status = 'published' ORDER BY display_order ASC, updated_at ASC`);
  return result.rows.map(fromRow);
}

export async function getTeamMember(id: string) {
  const result = await query<TeamMemberRow>(`SELECT ${columns} FROM team_members WHERE id = $1`, [id]);
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function createTeamMember(input: TeamMemberInput) {
  const members = await listTeamMembers();
  const now = new Date().toISOString();
  const id = `team-member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const result = await query<TeamMemberRow>(
    `INSERT INTO team_members (${columns}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::timestamptz, $12::timestamptz) RETURNING ${columns}`,
    values(input, id, now, now, Number.isFinite(input.order) ? input.order : members.length + 1),
  );
  return fromRow(result.rows[0]);
}

export async function updateTeamMember(id: string, input: TeamMemberInput) {
  const existing = await getTeamMember(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  const result = await query<TeamMemberRow>(
    `UPDATE team_members SET name_en = $2, name_fa = $3, name_ar = $4, role_en = $5, role_fa = $6, role_ar = $7, image_url = $8, display_order = $9, status = $10, updated_at = $12::timestamptz WHERE id = $1 RETURNING ${columns}`,
    values(input, id, existing.createdAt, now, Number.isFinite(input.order) ? input.order : existing.order),
  );
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function deleteTeamMember(id: string) {
  const result = await query<TeamMemberRow>(`DELETE FROM team_members WHERE id = $1 RETURNING ${columns}`, [id]);
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

function imageExtension(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  return new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]).has(extension) ? extension : ".jpg";
}

export async function saveTeamMemberImage(file: File) {
  if (!file.type.startsWith("image/") || file.size > maxImageSize) throw new Error("Invalid team-member image.");
  await mkdir(uploadsDirectory, { recursive: true });
  const fileName = `team-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${imageExtension(file)}`;
  await writeFile(path.join(uploadsDirectory, fileName), Buffer.from(await file.arrayBuffer()));
  return `${publicUploadsPath}/${fileName}`;
}

export async function removeTeamMemberImage(imageUrl: string) {
  if (!imageUrl.startsWith(`${publicUploadsPath}/`)) return;
  await rm(path.join(uploadsDirectory, path.basename(imageUrl)), { force: true });
}
