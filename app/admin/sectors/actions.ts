"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import { removeSectorMediaFolder } from "@/lib/sectorMedia";
import { deleteSector, listSectors } from "@/lib/sectorStore";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function deleteSectorAction(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const deleted = await deleteSector(id);

  if (deleted) {
    const hasTranslations = (await listSectors()).some((item) => item.slug === deleted.slug);

    if (!hasTranslations) {
      await removeSectorMediaFolder(deleted.slug);
    }
  }

  revalidatePath("/admin");
  redirect("/admin?deleted=1");
}
