"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import { isCollaborationRequestStatus, updateCollaborationRequestStatus, type CollaborationRequestStatus } from "@/lib/collaborationRequestStore";

const maxPageNumber = 100_000;

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

/** Normalizes an untrusted page field so it cannot affect routing outside the inbox. */
function pageNumber(value: string) {
  if (!/^[1-9]\d*$/.test(value)) return 1;

  const page = Number(value);
  return Number.isSafeInteger(page) ? Math.min(page, maxPageNumber) : 1;
}

function inboxUrl(status: CollaborationRequestStatus, page: number, notice?: "updated" | "status" | "request") {
  const query = new URLSearchParams({ status, page: String(page) });

  if (notice === "updated") query.set("updated", "1");
  if (notice && notice !== "updated") query.set("error", notice);

  return `/admin/collaboration-requests?${query.toString()}`;
}

/** Applies an admin-only, allow-listed workflow change to a collaboration request. */
export async function updateCollaborationRequestStatusAction(formData: FormData) {
  await requireAdmin();

  const returnStatusField = field(formData, "returnStatus");
  const returnStatus = isCollaborationRequestStatus(returnStatusField) ? returnStatusField : "new";
  const returnPage = pageNumber(field(formData, "returnPage"));
  const id = field(formData, "id");
  const status = field(formData, "status");

  if (!isCollaborationRequestStatus(status)) {
    redirect(inboxUrl(returnStatus, returnPage, "status"));
  }

  const updated = await updateCollaborationRequestStatus(id, status);

  revalidatePath("/admin");
  revalidatePath("/admin/collaboration-requests");
  redirect(inboxUrl(returnStatus, returnPage, updated ? "updated" : "request"));
}
