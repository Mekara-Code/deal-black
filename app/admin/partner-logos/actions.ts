"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import {
  createPartnerLogo,
  deletePartnerLogo,
  getPartnerLogo,
  removePartnerLogoImage,
  savePartnerLogoImage,
  updatePartnerLogo,
  type PartnerLogoInput,
} from "@/lib/partnerLogoStore";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function imageFile(formData: FormData) {
  const value = formData.get("image");
  return typeof value === "object" && value !== null && "arrayBuffer" in value && "size" in value && value.size > 0 ? value : null;
}

function safeWebsiteUrl(value: string) {
  if (!value) return "";

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function logoInput(formData: FormData, imageUrl: string): PartnerLogoInput {
  const order = Number(text(formData, "order"));

  return {
    name: text(formData, "name"),
    websiteUrl: safeWebsiteUrl(text(formData, "websiteUrl")),
    imageUrl,
    order: Number.isFinite(order) ? order : 0,
    status: formData.get("status") === "draft" ? "draft" : "published",
  };
}

function valid(formData: FormData) {
  const name = text(formData, "name");
  const websiteUrl = text(formData, "websiteUrl");

  return name.length > 0 && name.length <= 160 && (!websiteUrl || Boolean(safeWebsiteUrl(websiteUrl)));
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/partner-logos");
}

export async function createPartnerLogoAction(formData: FormData) {
  await requireAdmin();

  const upload = imageFile(formData);

  if (!valid(formData) || !upload) {
    redirect("/admin/partner-logos?error=required");
  }

  try {
    const imageUrl = await savePartnerLogoImage(upload);
    await createPartnerLogo(logoInput(formData, imageUrl));
  } catch {
    redirect("/admin/partner-logos?error=image");
  }

  refresh();
  redirect("/admin/partner-logos?created=1");
}

export async function updatePartnerLogoAction(formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  const existing = await getPartnerLogo(id);

  if (!existing || !valid(formData)) {
    redirect("/admin/partner-logos?error=required");
  }

  const upload = imageFile(formData);
  let imageUrl = existing.imageUrl;

  if (upload) {
    try {
      imageUrl = await savePartnerLogoImage(upload);
    } catch {
      redirect("/admin/partner-logos?error=image");
    }
  }

  const updated = await updatePartnerLogo(id, logoInput(formData, imageUrl));

  if (updated && upload && existing.imageUrl !== updated.imageUrl) {
    await removePartnerLogoImage(existing.imageUrl);
  }

  refresh();
  redirect("/admin/partner-logos?updated=1");
}

export async function deletePartnerLogoAction(formData: FormData) {
  await requireAdmin();

  const deleted = await deletePartnerLogo(text(formData, "id"));
  if (deleted) await removePartnerLogoImage(deleted.imageUrl);

  refresh();
  redirect("/admin/partner-logos?deleted=1");
}
