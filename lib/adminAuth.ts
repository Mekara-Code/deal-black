import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "deal_admin_session";
const ONE_DAY_SECONDS = 60 * 60 * 24;
const THIRTY_DAYS_SECONDS = ONE_DAY_SECONDS * 30;
const MAX_SESSION_TOKEN_LENGTH = 2_048;
const MAX_USERNAME_LENGTH = 128;
const MAX_PASSWORD_LENGTH = 256;
const MIN_PASSWORD_LENGTH = 12;
const MIN_SECRET_LENGTH = 32;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1_000;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1_000;
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const MAX_TRACKED_LOGIN_ATTEMPTS = 5_000;

type AdminAuthConfiguration = {
  username: string;
  password: string;
  secret: string;
};

type SessionPayload = {
  sub: string;
  iat: number;
  exp: number;
  v: 1;
};

type LoginAttempt = {
  failures: number;
  windowStartedAt: number;
  blockedUntil: number;
};

const loginAttempts = new Map<string, LoginAttempt>();

/** Reads the admin secrets without ever providing insecure source-code defaults. */
function getAdminAuthConfiguration(): AdminAuthConfiguration | null {
  const username = process.env.DEAL_ADMIN_USERNAME?.trim();
  const password = process.env.DEAL_ADMIN_PASSWORD;
  const secret = process.env.DEAL_ADMIN_SECRET;

  if (!username || !password || !secret) {
    return null;
  }

  if (
    username.length > MAX_USERNAME_LENGTH ||
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH ||
    Buffer.byteLength(secret, "utf8") < MIN_SECRET_LENGTH
  ) {
    return null;
  }

  return { username, password, secret };
}

/** Lets the login action fail closed when deployment secrets are missing or weak. */
export function isAdminAuthConfigured() {
  return getAdminAuthConfiguration() !== null;
}

/** Keeps redirects after authentication inside the admin area. */
export function getSafeAdminRedirectPath(value: unknown) {
  if (
    typeof value !== "string" ||
    value.length > 2_048 ||
    value.includes("\\") ||
    /%2f|%5c|%0d|%0a/i.test(value) ||
    /[\r\n]/.test(value)
  ) {
    return "/admin";
  }

  return /^\/admin(?:[/?#]|$)/.test(value) ? value : "/admin";
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

/** Performs a constant-time comparison for values that may be sensitive. */
function safelyEquals(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function isValidSignature(value: string, signature: string, secret: string) {
  return safelyEquals(signature, sign(value, secret));
}

function createSessionToken(username: string, secret: string, maxAgeSeconds: number) {
  const issuedAt = Date.now();
  const payload = toBase64Url(
    JSON.stringify({
      sub: username,
      iat: issuedAt,
      exp: issuedAt + maxAgeSeconds * 1_000,
      v: 1,
    } satisfies SessionPayload),
  );

  return `${payload}.${sign(payload, secret)}`;
}

function getActiveAttempt(key: string, now: number) {
  const attempt = loginAttempts.get(key);

  if (!attempt) {
    return null;
  }

  if (attempt.blockedUntil > now) {
    return attempt;
  }

  if (now - attempt.windowStartedAt >= LOGIN_ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(key);
    return null;
  }

  return attempt;
}

function pruneLoginAttempts(now: number) {
  for (const [key, attempt] of loginAttempts) {
    if (attempt.blockedUntil <= now && now - attempt.windowStartedAt >= LOGIN_ATTEMPT_WINDOW_MS) {
      loginAttempts.delete(key);
    }
  }

  while (loginAttempts.size > MAX_TRACKED_LOGIN_ATTEMPTS) {
    const oldestKey = loginAttempts.keys().next().value;

    if (!oldestKey) {
      break;
    }

    loginAttempts.delete(oldestKey);
  }
}

/** Creates a bounded, per-client login-attempt key without storing passwords. */
export function createLoginAttemptKey(clientAddress: string, username: string) {
  return `${clientAddress.slice(0, 128)}:${username.trim().toLocaleLowerCase().slice(0, MAX_USERNAME_LENGTH)}`;
}

/** Returns the remaining lock time when too many failed attempts were received. */
export function getLoginLockSeconds(key: string) {
  const now = Date.now();
  const attempt = getActiveAttempt(key, now);

  return attempt && attempt.blockedUntil > now ? Math.ceil((attempt.blockedUntil - now) / 1_000) : 0;
}

/** Records one unsuccessful login and starts a temporary lock after repeated failures. */
export function recordFailedLoginAttempt(key: string) {
  const now = Date.now();
  const attempt = getActiveAttempt(key, now) ?? {
    failures: 0,
    windowStartedAt: now,
    blockedUntil: 0,
  };

  attempt.failures += 1;

  if (attempt.failures >= MAX_FAILED_LOGIN_ATTEMPTS) {
    attempt.blockedUntil = now + LOGIN_LOCKOUT_MS;
  }

  loginAttempts.set(key, attempt);
  pruneLoginAttempts(now);
}

/** Clears the failed-attempt record after a successful authentication. */
export function clearFailedLoginAttempts(key: string) {
  loginAttempts.delete(key);
}

/** Checks configured credentials without exposing timing differences for valid-length values. */
export function verifyAdminCredentials(username: string, password: string) {
  const configuration = getAdminAuthConfiguration();

  if (!configuration || username.length > MAX_USERNAME_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    return false;
  }

  const usernameMatches = safelyEquals(username, configuration.username);
  const passwordMatches = safelyEquals(password, configuration.password);

  return usernameMatches && passwordMatches;
}

export async function setAdminSession(remember: boolean) {
  const configuration = getAdminAuthConfiguration();

  if (!configuration) {
    throw new Error("Admin authentication is not configured.");
  }

  const maxAge = remember ? THIRTY_DAYS_SECONDS : ONE_DAY_SECONDS;
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, createSessionToken(configuration.username, configuration.secret, maxAge), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function getAdminSession() {
  const configuration = getAdminAuthConfiguration();
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!configuration || !token || token.length > MAX_SESSION_TOKEN_LENGTH) {
    return null;
  }

  const tokenParts = token.split(".");

  if (tokenParts.length !== 2) {
    return null;
  }

  const [payload, signature] = tokenParts;

  if (!payload || !signature || !isValidSignature(payload, signature, configuration.secret)) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as Partial<SessionPayload>;
    const now = Date.now();
    const maximumSessionLifetime = THIRTY_DAYS_SECONDS * 1_000;

    if (
      parsed.sub !== configuration.username ||
      parsed.v !== 1 ||
      typeof parsed.iat !== "number" ||
      typeof parsed.exp !== "number" ||
      parsed.iat > now ||
      parsed.exp <= now ||
      parsed.exp - parsed.iat > maximumSessionLifetime
    ) {
      return null;
    }

    return { username: parsed.sub };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
