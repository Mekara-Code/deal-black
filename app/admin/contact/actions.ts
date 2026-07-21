"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import { updateContactSettings } from "@/lib/contactSettingsStore";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateContactSettingsAction(formData: FormData) {
  await requireAdmin();
  await updateContactSettings({
    email: text(formData, "email"),
    phonePrimary: text(formData, "phonePrimary"),
    phoneSecondary: text(formData, "phoneSecondary"),
    whatsapp: text(formData, "whatsapp"),
    telegram: text(formData, "telegram"),
    instagram: text(formData, "instagram"),
    linkedin: text(formData, "linkedin"),
    addressFa: text(formData, "addressFa"),
    addressEn: text(formData, "addressEn"),
    addressAr: text(formData, "addressAr"),
  });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/sectors");
  revalidatePath("/team");
  revalidatePath("/admin");
  revalidatePath("/admin/contact");
  redirect("/admin/contact?updated=1");
}
