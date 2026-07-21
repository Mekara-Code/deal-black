import "server-only";

import { randomUUID } from "node:crypto";
import { query } from "@/lib/database";

const collaborationRequestStatuses = ["new", "in_progress", "closed"] as const;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type CollaborationRequestStatus = (typeof collaborationRequestStatuses)[number];

export type CollaborationRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: CollaborationRequestStatus;
  createdAt: string;
  updatedAt: string;
};

type CollaborationRequestInput = Omit<CollaborationRequest, "id" | "status" | "createdAt" | "updatedAt">;

type CollaborationRequestRow = {
  [key: string]: unknown;
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
};

const columns = "id, name, email, phone, message, status, created_at, updated_at";

/** Removes unsafe control characters while retaining intentional line breaks in messages. */
function cleanText(value: unknown, preserveNewlines = false) {
  const valueAsText = String(value ?? "").normalize("NFKC");
  const withoutControls = valueAsText.replace(preserveNewlines ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "");
  return (preserveNewlines ? withoutControls.replace(/\r\n?/g, "\n") : withoutControls).trim();
}

function containsMarkup(value: string) {
  return /<[^>]*>/.test(value);
}

/** Validates untrusted public form data before it is ever persisted. */
export function validateCollaborationRequest(input: unknown): CollaborationRequestInput | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const data = input as Record<string, unknown>;
  const name = cleanText(data.name);
  const email = cleanText(data.email);
  const phone = cleanText(data.phone);
  const message = cleanText(data.message, true);
  const nameIsValid = /^[\p{L}\p{M}][\p{L}\p{M}\s.'\u2019-]{1,98}$/u.test(name);
  const emailIsValid = email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,63}$/.test(email);
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneIsValid = phone.length <= 32 && /^[+\d\s().-]+$/.test(phone) && phoneDigits.length >= 7 && phoneDigits.length <= 20;
  const messageIsValid = message.length >= 20 && message.length <= 2000;
  if (!nameIsValid || !emailIsValid || !phoneIsValid || !messageIsValid || [name, email, phone, message].some(containsMarkup)) return null;
  return { name, email, phone, message };
}

/** Narrows a submitted status to the only transitions the admin inbox accepts. */
export function isCollaborationRequestStatus(value: unknown): value is CollaborationRequestStatus {
  return typeof value === "string" && collaborationRequestStatuses.includes(value as CollaborationRequestStatus);
}

function fromRow(row: CollaborationRequestRow): CollaborationRequest {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    status: isCollaborationRequestStatus(row.status) ? row.status : "new",
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

/** Persists a validated public submission as a new request. */
export async function saveCollaborationRequest(input: CollaborationRequestInput) {
  const now = new Date().toISOString();
  const result = await query<CollaborationRequestRow>(
    `INSERT INTO collaboration_requests (${columns}) VALUES ($1::uuid, $2, $3, $4, $5, $6, $7::timestamptz, $8::timestamptz) RETURNING ${columns}`,
    [randomUUID(), input.name, input.email, input.phone, input.message, "new", now, now],
  );
  return fromRow(result.rows[0]);
}

/** Returns newest requests first for the protected admin inbox. */
export async function listCollaborationRequests() {
  const result = await query<CollaborationRequestRow>(`SELECT ${columns} FROM collaboration_requests ORDER BY created_at DESC`);
  return result.rows.map(fromRow);
}

/** Updates only a whitelisted workflow status; request details remain immutable. */
export async function updateCollaborationRequestStatus(id: string, status: CollaborationRequestStatus) {
  if (!uuidPattern.test(id) || !isCollaborationRequestStatus(status)) return null;
  const result = await query<CollaborationRequestRow>(
    `UPDATE collaboration_requests SET status = $2, updated_at = NOW() WHERE id = $1::uuid RETURNING ${columns}`,
    [id, status],
  );
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}
