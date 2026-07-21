"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import { normalizeLanguage } from "@/lib/i18n";
import { applyUploadedSectorMedia, cleanupUnusedSectorMedia } from "@/lib/sectorMedia";
import { createSector, listSectors, updateSector, type Sector, type SectorBlock, type SectorInput, type SectorStatus } from "@/lib/sectorStore";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getStringList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function getBlocks(formData: FormData) {
  const raw = getString(formData, "blocksJson");

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as SectorBlock[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sectorToInput(sector: Sector, overrides: Partial<SectorInput> = {}): SectorInput {
  return {
    language: sector.language,
    title: sector.title,
    englishName: sector.englishName,
    slug: sector.slug,
    excerpt: sector.excerpt,
    content: sector.content,
    blocks: sector.blocks,
    featuredImage: sector.featuredImage,
    cta: sector.cta,
    icon: sector.icon,
    order: sector.order,
    categories: sector.categories,
    tags: sector.tags,
    status: sector.status,
    metaDescription: sector.metaDescription,
    ...overrides,
  };
}

export async function createSectorAction(formData: FormData) {
  await requireAdmin();

  const title = getString(formData, "title");

  if (!title) {
    redirect("/admin/sectors/new?error=title");
  }

  const status: SectorStatus = formData.get("status") === "published" ? "published" : "draft";
  const order = Number(getString(formData, "order"));

  const input: SectorInput = {
    language: normalizeLanguage(getString(formData, "language")),
    title,
    englishName: getString(formData, "englishName"),
    slug: getString(formData, "slug"),
    excerpt: getString(formData, "excerpt"),
    content: getString(formData, "content"),
    blocks: getBlocks(formData),
    featuredImage: getString(formData, "featuredImage"),
    cta: getString(formData, "cta"),
    icon: getString(formData, "icon"),
    order: Number.isFinite(order) ? order : 0,
    categories: getStringList(formData, "categories"),
    tags: getStringList(formData, "tags"),
    status,
    metaDescription: getString(formData, "metaDescription"),
  };

  let sector = await createSector(input);
  const media = await applyUploadedSectorMedia(formData, sector.slug, sector.blocks, sector.featuredImage);

  if (media.blocks !== sector.blocks || media.featuredImage !== sector.featuredImage) {
    const updated = await updateSector(sector.id, sectorToInput(sector, media));
    if (updated) {
      sector = updated;
    }
  }

  const hasTranslations = (await listSectors()).some((item) => item.id !== sector.id && item.slug === sector.slug);

  if (!hasTranslations) {
    await cleanupUnusedSectorMedia(sector.slug, sector.blocks, sector.featuredImage);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/sectors/new");
  redirect(`/admin?created=${encodeURIComponent(sector.slug)}`);
}
