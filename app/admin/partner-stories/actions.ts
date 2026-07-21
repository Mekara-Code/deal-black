"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import {
  createPartnerStory,
  deletePartnerStory,
  getPartnerStory,
  removePartnerStoryImage,
  savePartnerStoryImage,
  updatePartnerStory,
  type PartnerStoryInput,
} from "@/lib/partnerStoryStore";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function imageFile(formData: FormData) {
  const value = formData.get("image");
  return typeof value === "object" && value !== null && "arrayBuffer" in value && "size" in value && value.size > 0 ? value : null;
}

function storyInput(formData: FormData, imageUrl: string): PartnerStoryInput {
  const order = Number(text(formData, "order"));

  return {
    translations: {
      fa: { name: text(formData, "nameFa"), tagline: text(formData, "taglineFa"), quote: text(formData, "quoteFa") },
      ar: { name: text(formData, "nameAr"), tagline: text(formData, "taglineAr"), quote: text(formData, "quoteAr") },
      en: { name: text(formData, "nameEn"), tagline: text(formData, "taglineEn"), quote: text(formData, "quoteEn") },
    },
    imageUrl,
    order: Number.isFinite(order) ? order : 0,
    status: formData.get("status") === "draft" ? "draft" : "published",
  };
}

function valid(formData: FormData) {
  return ["Fa", "Ar", "En"].every((suffix) => Boolean(text(formData, `name${suffix}`)) && Boolean(text(formData, `quote${suffix}`)));
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/partner-stories");
}

export async function createPartnerStoryAction(formData: FormData) {
  await requireAdmin();

  if (!valid(formData)) {
    redirect("/admin/partner-stories?error=required");
  }

  const upload = imageFile(formData);
  const imageUrl = upload ? await savePartnerStoryImage(upload) : text(formData, "imageUrl");
  await createPartnerStory(storyInput(formData, imageUrl));
  refresh();
  redirect("/admin/partner-stories?created=1");
}

export async function updatePartnerStoryAction(formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  const existing = await getPartnerStory(id);

  if (!existing || !valid(formData)) {
    redirect("/admin/partner-stories?error=required");
  }

  const upload = imageFile(formData);
  const imageUrl = upload ? await savePartnerStoryImage(upload) : text(formData, "imageUrl");
  const updated = await updatePartnerStory(id, storyInput(formData, imageUrl));

  if (updated && existing.imageUrl && existing.imageUrl !== updated.imageUrl) {
    await removePartnerStoryImage(existing.imageUrl);
  }

  refresh();
  redirect("/admin/partner-stories?updated=1");
}

export async function deletePartnerStoryAction(formData: FormData) {
  await requireAdmin();

  const deleted = await deletePartnerStory(text(formData, "id"));

  if (deleted) {
    await removePartnerStoryImage(deleted.imageUrl);
  }

  refresh();
  redirect("/admin/partner-stories?deleted=1");
}
