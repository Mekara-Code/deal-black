"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMember,
  removeTeamMemberImage,
  saveTeamMemberImage,
  updateTeamMember,
  type TeamMemberInput,
} from "@/lib/teamMemberStore";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function imageFile(formData: FormData) {
  const value = formData.get("image");
  return typeof value === "object" && value !== null && "arrayBuffer" in value && "size" in value && value.size > 0 ? value : null;
}

function memberInput(formData: FormData, imageUrl: string): TeamMemberInput {
  const order = Number(text(formData, "order"));

  return {
    nameEn: text(formData, "nameEn"),
    nameFa: text(formData, "nameFa"),
    nameAr: text(formData, "nameAr"),
    roleEn: text(formData, "roleEn"),
    roleFa: text(formData, "roleFa"),
    roleAr: text(formData, "roleAr"),
    imageUrl,
    order: Number.isFinite(order) ? order : 0,
    status: formData.get("status") === "draft" ? "draft" : "published",
  };
}

function valid(formData: FormData) {
  return ["nameEn", "nameFa", "nameAr", "roleEn", "roleFa", "roleAr"].every((key) => Boolean(text(formData, key)));
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/team");
}

export async function createTeamMemberAction(formData: FormData) {
  await requireAdmin();

  if (!valid(formData)) redirect("/admin/team?error=required");

  const upload = imageFile(formData);
  const imageUrl = upload ? await saveTeamMemberImage(upload) : text(formData, "imageUrl");
  await createTeamMember(memberInput(formData, imageUrl));
  refresh();
  redirect("/admin/team?created=1");
}

export async function updateTeamMemberAction(formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  const existing = await getTeamMember(id);

  if (!existing || !valid(formData)) redirect("/admin/team?error=required");

  const upload = imageFile(formData);
  const imageUrl = upload ? await saveTeamMemberImage(upload) : text(formData, "imageUrl");
  const updated = await updateTeamMember(id, memberInput(formData, imageUrl));

  if (updated && existing.imageUrl && existing.imageUrl !== updated.imageUrl) {
    await removeTeamMemberImage(existing.imageUrl);
  }

  refresh();
  redirect("/admin/team?updated=1");
}

export async function deleteTeamMemberAction(formData: FormData) {
  await requireAdmin();

  const deleted = await deleteTeamMember(text(formData, "id"));
  if (deleted) await removeTeamMemberImage(deleted.imageUrl);

  refresh();
  redirect("/admin/team?deleted=1");
}
