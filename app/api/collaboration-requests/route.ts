import { NextRequest, NextResponse } from "next/server";
import { saveCollaborationRequest, validateCollaborationRequest } from "@/lib/collaborationRequestStore";

export const runtime = "nodejs";

const rateLimitWindowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 5;
const requestLog = new Map<string, number[]>();

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recentRequests = (requestLog.get(key) ?? []).filter((timestamp) => now - timestamp < rateLimitWindowMs);

  if (recentRequests.length >= maxRequestsPerWindow) {
    requestLog.set(key, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestLog.set(key, recentRequests);
  return false;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (!request.headers.get("content-type")?.includes("application/json") || !Number.isFinite(contentLength) || contentLength > 8_192) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (isRateLimited(clientKey(request))) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: { "Retry-After": "900" } });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const openedAt = Number(data.openedAt);
  const honeypot = String(data.website ?? "").trim();
  if (honeypot || !Number.isFinite(openedAt) || openedAt > Date.now() || Date.now() - openedAt < 1_500) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const validated = validateCollaborationRequest(data);
  if (!validated) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await saveCollaborationRequest(validated);
  return NextResponse.json({ ok: true }, { status: 201 });
}
