"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import { normalizeLanguage } from "@/lib/i18n";
import { applyUploadedSectorMedia, cleanupUnusedSectorMedia, moveSectorMediaFolder, rewriteSectorMediaSlug } from "@/lib/sectorMedia";
import { getSectorById, listSectors, updateSector, type Sector, type SectorBlock, type SectorInput, type SectorStatus } from "@/lib/sectorStore";

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

export async function updateSectorAction(id: string, formData: FormData) {
  await requireAdmin();

  const current = await getSectorById(id);

  if (!current) {
    redirect("/admin");
  }

  const title = getString(formData, "title");

  if (!title) {
    redirect(`/admin/sectors/${encodeURIComponent(id)}/edit?error=title`);
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
    order: Number.isFinite(order) ? order : current.order,
    categories: getStringList(formData, "categories"),
    tags: getStringList(formData, "tags"),
    status,
    metaDescription: getString(formData, "metaDescription"),
  };

  const persistedSector = await updateSector(id, input);

  if (!persistedSector) {
    redirect("/admin");
  }

  let updated: Sector = persistedSector;

  if (current.slug !== updated.slug) {
    const hasSharedSourceMedia = (await listSectors()).some((item) => item.id !== updated.id && item.slug === current.slug);

    if (!hasSharedSourceMedia) {
      await moveSectorMediaFolder(current.slug, updated.slug);
      const rewritten = rewriteSectorMediaSlug({ blocks: updated.blocks, featuredImage: updated.featuredImage }, current.slug, updated.slug);
      const rewrittenSector = await updateSector(id, sectorToInput(updated, rewritten));

      if (rewrittenSector) {
        updated = rewrittenSector;
      }
    }
  }

  const media = await applyUploadedSectorMedia(formData, updated.slug, updated.blocks, updated.featuredImage);
  const finalSector = await updateSector(id, sectorToInput(updated, media));

  if (finalSector) {
    updated = finalSector;
  }

  const hasTranslations = (await listSectors()).some((item) => item.id !== updated.id && item.slug === updated.slug);

  if (!hasTranslations) {
    await cleanupUnusedSectorMedia(updated.slug, updated.blocks, updated.featuredImage);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/sectors/${encodeURIComponent(id)}/edit`);
  redirect(`/admin?updated=${encodeURIComponent(updated.slug)}`);
}
