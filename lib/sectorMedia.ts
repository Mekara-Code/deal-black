import "server-only";

import type { Dirent } from "node:fs";
import { cp, mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SectorBlock } from "@/lib/sectorStore";

const uploadsRoot = path.join(process.cwd(), "public", "uploads", "sectors");
const publicUploadsRoot = "/uploads/sectors";
const maxImageSize = 10 * 1024 * 1024;

type SectorMediaState = {
  blocks: SectorBlock[];
  featuredImage: string;
};

function safeSegment(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9\u0600-\u06ff.-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "media"
  );
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return typeof value === "object" && value !== null && "arrayBuffer" in value && "size" in value && Number(value.size) > 0;
}

function extensionForFile(file: File) {
  const byMime: Record<string, string> = {
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
  };
  const extension = path.extname(file.name).toLowerCase();
  const allowed = new Set(Object.values(byMime));

  if (file.type in byMime) return byMime[file.type];
  if (allowed.has(extension)) return extension;

  return ".jpg";
}

function normalizePossiblyTemporaryUrl(value?: string) {
  const url = String(value ?? "").trim();
  return url.startsWith("blob:") ? "" : url;
}

function sectorDir(slug: string) {
  return path.join(uploadsRoot, safeSegment(slug));
}

function publicUrl(slug: string, bucket: string, fileName: string) {
  return `${publicUploadsRoot}/${safeSegment(slug)}/${bucket}/${fileName}`;
}

async function saveImageFile(file: File, slug: string, bucket: "featured" | "blocks" | "slides", prefix: string) {
  if (!file.type.startsWith("image/") || file.size > maxImageSize) {
    throw new Error("Invalid image upload.");
  }

  const targetDir = path.join(sectorDir(slug), bucket);
  const extension = extensionForFile(file);
  const fileName = `${safeSegment(prefix)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;

  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, fileName), Buffer.from(await file.arrayBuffer()));

  return publicUrl(slug, bucket, fileName);
}

function collectProjectMediaUrls(slug: string, blocks: SectorBlock[], featuredImage: string) {
  const prefix = `${publicUploadsRoot}/${safeSegment(slug)}/`;
  const urls = new Set<string>();

  if (featuredImage.startsWith(prefix)) {
    urls.add(featuredImage);
  }

  for (const block of blocks) {
    if (block.url?.startsWith(prefix)) {
      urls.add(block.url);
    }

    for (const slide of block.slides ?? []) {
      if (slide.url?.startsWith(prefix)) {
        urls.add(slide.url);
      }
    }
  }

  return urls;
}

async function listFilesRecursive(dir: string) {
  const result: string[] = [];

  async function walk(current: string) {
    let entries: Dirent[];

    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        await walk(entryPath);
      } else if (entry.isFile()) {
        result.push(entryPath);
      }
    }
  }

  await walk(dir);
  return result;
}

async function removeEmptyDirs(dir: string) {
  let entries: Dirent[];

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirs(path.join(dir, entry.name));
    }
  }

  try {
    const after = await readdir(dir);
    if (after.length === 0 && dir !== uploadsRoot) {
      await rm(dir, { force: true, recursive: false });
    }
  } catch {
    // Directory may already be gone.
  }
}

export function rewriteSectorMediaSlug(state: SectorMediaState, oldSlug: string, newSlug: string): SectorMediaState {
  const oldPrefix = `${publicUploadsRoot}/${safeSegment(oldSlug)}/`;
  const newPrefix = `${publicUploadsRoot}/${safeSegment(newSlug)}/`;
  const rewrite = (url?: string) => (url?.startsWith(oldPrefix) ? url.replace(oldPrefix, newPrefix) : normalizePossiblyTemporaryUrl(url));

  return {
    featuredImage: rewrite(state.featuredImage),
    blocks: state.blocks.map((block) => ({
      ...block,
      url: rewrite(block.url),
      slides: block.slides?.map((slide) => ({
        ...slide,
        url: rewrite(slide.url),
      })),
    })),
  };
}

export async function moveSectorMediaFolder(oldSlug: string, newSlug: string) {
  if (safeSegment(oldSlug) === safeSegment(newSlug)) return;

  const from = sectorDir(oldSlug);
  const to = sectorDir(newSlug);

  try {
    await stat(from);
  } catch {
    return;
  }

  await mkdir(path.dirname(to), { recursive: true });

  try {
    await rename(from, to);
  } catch {
    await cp(from, to, { force: true, recursive: true });
    await rm(from, { force: true, recursive: true });
  }
}

export async function applyUploadedSectorMedia(formData: FormData, slug: string, blocks: SectorBlock[], featuredImage: string): Promise<SectorMediaState> {
  let nextFeaturedImage = normalizePossiblyTemporaryUrl(featuredImage);
  const featuredFile = formData.get("media:featured");

  if (isUploadFile(featuredFile)) {
    nextFeaturedImage = await saveImageFile(featuredFile, slug, "featured", "featured");
  }

  const nextBlocks: SectorBlock[] = [];

  for (const block of blocks) {
    if (block.type === "image") {
      const file = formData.get(`media:image:${block.id}`);
      nextBlocks.push({
        ...block,
        url: isUploadFile(file) ? await saveImageFile(file, slug, "blocks", `block-${block.id}`) : normalizePossiblyTemporaryUrl(block.url),
      });
      continue;
    }

    if (block.type === "slideshow") {
      const slides = [];

      for (const slide of block.slides ?? []) {
        const file = formData.get(`media:slide:${block.id}:${slide.id}`);

        slides.push({
          ...slide,
          url: isUploadFile(file) ? await saveImageFile(file, slug, "slides", `slide-${block.id}-${slide.id}`) : normalizePossiblyTemporaryUrl(slide.url),
        });
      }

      nextBlocks.push({ ...block, slides });
      continue;
    }

    nextBlocks.push({
      ...block,
      url: normalizePossiblyTemporaryUrl(block.url),
    });
  }

  return {
    blocks: nextBlocks,
    featuredImage: nextFeaturedImage,
  };
}

export async function cleanupUnusedSectorMedia(slug: string, blocks: SectorBlock[], featuredImage: string) {
  const dir = sectorDir(slug);
  const keepUrls = collectProjectMediaUrls(slug, blocks, featuredImage);
  const keepFiles = new Set(
    Array.from(keepUrls).map((url) => {
      const relative = url.slice(`${publicUploadsRoot}/${safeSegment(slug)}/`.length).split("/").join(path.sep);
      return path.join(dir, relative);
    }),
  );
  const files = await listFilesRecursive(dir);

  for (const file of files) {
    const normalized = path.normalize(file);
    if (!keepFiles.has(normalized)) {
      await rm(normalized, { force: true });
    }
  }

  await removeEmptyDirs(dir);
}

export async function removeSectorMediaFolder(slug: string) {
  await rm(sectorDir(slug), { force: true, recursive: true });
}

export async function readPublicUpload(url: string) {
  if (!url.startsWith(publicUploadsRoot)) return null;

  const relative = url.slice(publicUploadsRoot.length).split("/").filter(Boolean).map(safeSegment);
  const filePath = path.join(uploadsRoot, ...relative);

  try {
    return await readFile(filePath);
  } catch {
    return null;
  }
}
