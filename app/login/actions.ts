"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearFailedLoginAttempts,
  createLoginAttemptKey,
  getLoginLockSeconds,
  getSafeAdminRedirectPath,
  isAdminAuthConfigured,
  recordFailedLoginAttempt,
  setAdminSession,
  verifyAdminCredentials,
} from "@/lib/adminAuth";

function getFormText(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

function getClientAddress(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",", 1)[0]?.trim() || "unknown";
  }

  return requestHeaders.get("x-real-ip")?.trim() || "unknown";
}

export async function loginAction(formData: FormData) {
  const username = getFormText(formData, "username").trim();
  const password = getFormText(formData, "password");
  const remember = formData.get("remember") === "on";
  const next = getSafeAdminRedirectPath(formData.get("next"));

  if (!isAdminAuthConfigured()) {
    redirect(`/login?error=unavailable&next=${encodeURIComponent(next)}`);
  }

  const requestHeaders = await headers();
  const attemptKey = createLoginAttemptKey(getClientAddress(requestHeaders), username);

  if (getLoginLockSeconds(attemptKey) > 0) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  if (!verifyAdminCredentials(username, password)) {
    recordFailedLoginAttempt(attemptKey);
    redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  clearFailedLoginAttempts(attemptKey);
  await setAdminSession(remember);
  redirect(next);
}
