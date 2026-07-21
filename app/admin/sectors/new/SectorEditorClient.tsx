"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Columns3,
  Copy,
  Eye,
  GripVertical,
  Heading1,
  Image as ImageIcon,
  Images,
  Info,
  Link2,
  List,
  ListTree,
  Minus,
  MoreVertical,
  MousePointerClick,
  PanelLeft,
  Pilcrow,
  Plus,
  Quote,
  Redo2,
  Save,
  Search,
  Trash2,
  Undo2,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";
import { createElement, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { languages, type LanguageCode } from "@/lib/i18n";
import type { Sector, SectorBlock, SectorBlockType } from "@/lib/sectorStore";
import { createSectorAction } from "./actions";

type Alignment = "right" | "center" | "left";
type EditorBlock = SectorBlock & {
  alignment?: Alignment;
};

type BlockDefinition = {
  type: SectorBlockType;
  label: string;
  description: string;
  shortcut: string;
  icon: LucideIcon;
};

type SectorEditorClientProps = {
  action?: (formData: FormData) => void | Promise<void>;
  error?: string;
  initialSector?: Sector;
};

let hasRegisteredSwiperElement = false;

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2271b1]";
const wpButton = `${focusRing} inline-flex min-h-9 items-center justify-center gap-2 rounded-sm border border-[#8c8f94] bg-[#f6f7f7] px-3 text-xs font-semibold text-[#1d2327] hover:bg-[#f0f0f1]`;
const primaryButton = `${focusRing} inline-flex min-h-9 items-center justify-center gap-2 rounded-sm bg-[#2271b1] px-3 text-xs font-semibold text-white hover:bg-[#135e96]`;
const inputClass = `${focusRing} w-full rounded-sm border border-[#8c8f94] bg-white px-3 py-2 text-sm text-[#1d2327] outline-none transition focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1]`;

const blockDefinitions: BlockDefinition[] = [
  { type: "paragraph", label: "Paragraph", description: "متن ساده و بدنه محتوا", shortcut: "/paragraph", icon: Pilcrow },
  { type: "heading", label: "Heading", description: "تیتر H2/H3 برای بخش‌ها", shortcut: "/heading", icon: Heading1 },
  { type: "image", label: "Image", description: "تصویر با URL و alt", shortcut: "/image", icon: ImageIcon },
  { type: "slideshow", label: "Swiper Slideshow", description: "اسلایدر تصویری با Swiper", shortcut: "/swiper", icon: Images },
  { type: "list", label: "List", description: "لیست چند خطی", shortcut: "/list", icon: List },
  { type: "quote", label: "Quote", description: "نقل‌قول برجسته", shortcut: "/quote", icon: Quote },
  { type: "button", label: "Button", description: "دکمه CTA", shortcut: "/button", icon: MousePointerClick },
  { type: "separator", label: "Separator", description: "خط جداکننده", shortcut: "/separator", icon: Minus },
  { type: "spacer", label: "Spacer", description: "فاصله عمودی قابل تنظیم", shortcut: "/spacer", icon: GripVertical },
  { type: "columns", label: "Columns", description: "دو ستون محتوا", shortcut: "/columns", icon: Columns3 },
];

const defaultCategories = ["Investment sectors", "High growth", "Iran opportunities", "Featured"];

function uid(prefix = "block") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createBlock(type: SectorBlockType, stableId?: string): EditorBlock {
  const id = stableId ?? uid(type);

  switch (type) {
    case "heading":
      return { id, type, content: "", level: 2, alignment: "right" };
    case "image":
      return { id, type, url: "", alt: "", content: "" };
    case "slideshow":
      return {
        id,
        type,
        autoplay: true,
        height: 340,
        slides: [
          { id: `${id}-slide-1`, url: "", alt: "", caption: "" },
          { id: `${id}-slide-2`, url: "", alt: "", caption: "" },
          { id: `${id}-slide-3`, url: "", alt: "", caption: "" },
        ],
      };
    case "list":
      return { id, type, items: [""], ordered: false };
    case "quote":
      return { id, type, content: "", alignment: "right" };
    case "button":
      return { id, type, buttonText: "Explore opportunities", buttonUrl: "#contact" };
    case "separator":
      return { id, type };
    case "spacer":
      return { id, type, height: 48 };
    case "columns":
      return { id, type, columns: ["", ""] };
    default:
      return { id, type: "paragraph", content: "", alignment: "right" };
  }
}

function blockText(block: EditorBlock) {
  if (block.type === "list") return block.items?.join("\n") ?? "";
  if (block.type === "button") return block.buttonText ?? "";
  if (block.type === "columns") return block.columns?.join("\n") ?? "";
  if (block.type === "slideshow") return block.slides?.map((slide) => [slide.alt, slide.caption].filter(Boolean).join(" - ")).join("\n") ?? "";
  return block.content ?? "";
}

function splitBlockText(block: EditorBlock) {
  return blockText(block)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function transformBlock(block: EditorBlock, type: SectorBlockType): EditorBlock {
  if (block.type === type) {
    return block;
  }

  const next = { ...createBlock(type), id: block.id };
  const text = blockText(block).trim();
  const lines = splitBlockText(block);
  const alignment = block.alignment ?? "right";

  switch (type) {
    case "paragraph":
      return { ...next, content: text, alignment };
    case "heading":
      return { ...next, content: lines[0] ?? text, level: 2, alignment };
    case "quote":
      return { ...next, content: text, alignment };
    case "list":
      return { ...next, items: lines.length ? lines : [text], ordered: block.ordered ?? false };
    case "button":
      return { ...next, buttonText: lines[0] || block.buttonText || "Explore opportunities", buttonUrl: block.buttonUrl || "#contact" };
    case "columns":
      return { ...next, columns: block.columns ?? [text, ""] };
    case "image":
      return {
        ...next,
        url: block.url ?? "",
        alt: block.alt ?? lines[0] ?? "",
        content: block.content ?? "",
      };
    case "slideshow":
      return {
        ...next,
        height: block.height && block.height > 180 ? block.height : 340,
        slides: block.url
          ? [{ id: uid(), url: block.url, alt: block.alt ?? "", caption: block.content ?? "" }]
          : next.slides,
      };
    case "spacer":
      return { ...next, height: block.height ?? 48 };
    default:
      return next;
  }
}

function cloneEditorBlock(block: EditorBlock): EditorBlock {
  return {
    ...block,
    id: uid(),
    items: block.items ? [...block.items] : undefined,
    columns: block.columns ? [...block.columns] : undefined,
    slides: block.slides?.map((slide) => ({ ...slide, id: uid() })),
  };
}

function blocksToText(blocks: EditorBlock[]) {
  return blocks
    .map((block) => blockText(block))
    .filter(Boolean)
    .join("\n\n");
}

function selectedLabel(type: SectorBlockType) {
  return blockDefinitions.find((block) => block.type === type)?.label ?? "Block";
}

export function SectorEditorClient({ action = createSectorAction, error, initialSector }: SectorEditorClientProps) {
  const initialBlocks = useMemo<EditorBlock[]>(() => {
    return initialSector?.blocks.length ? initialSector.blocks : [createBlock("paragraph", "initial-sector-paragraph")];
  }, [initialSector]);
  const [title, setTitle] = useState(initialSector?.title ?? "");
  const [language, setLanguage] = useState<LanguageCode>(initialSector?.language ?? "en");
  const [slug, setSlug] = useState(initialSector?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialSector?.slug));
  const [englishName, setEnglishName] = useState(initialSector?.englishName ?? "");
  const [excerpt, setExcerpt] = useState(initialSector?.excerpt ?? "");
  const [cta, setCta] = useState(initialSector?.cta ?? "Explore opportunities");
  const [icon, setIcon] = useState(initialSector?.icon ?? "Wind");
  const [order, setOrder] = useState(String(initialSector?.order ?? 1));
  const [metaDescription, setMetaDescription] = useState(initialSector?.metaDescription ?? "");
  const [featuredImage, setFeaturedImage] = useState(initialSector?.featuredImage ?? "");
  const [categories, setCategories] = useState<string[]>(initialSector?.categories.length ? initialSector.categories : ["Investment sectors"]);
  const [tagDraft, setTagDraft] = useState("");
  const [tags, setTags] = useState<string[]>(initialSector?.tags ?? []);
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState(() => initialBlocks[0]?.id ?? "initial-sector-paragraph");
  const [documentTab, setDocumentTab] = useState<"document" | "block">("document");
  const [showInserter, setShowInserter] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<EditorBlock[][]>([]);
  const [future, setFuture] = useState<EditorBlock[][]>([]);

  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? blocks[0];
  const filteredBlocks = blockDefinitions.filter((block) => {
    const q = query.trim().toLowerCase();
    return !q || block.label.toLowerCase().includes(q) || block.shortcut.includes(q);
  });
  const slashActive = selectedBlock?.type === "paragraph" && (selectedBlock.content ?? "").trim().startsWith("/");
  const serializedBlocks = useMemo(() => JSON.stringify(blocks), [blocks]);
  const plainContent = useMemo(() => blocksToText(blocks), [blocks]);

  function commit(next: EditorBlock[]) {
    setHistory((items) => [...items.slice(-25), blocks]);
    setFuture([]);
    setBlocks(next);
  }

  function updateBlock(id: string, patch: Partial<EditorBlock>) {
    setBlocks((items) => items.map((block) => (block.id === id ? { ...block, ...patch } : block)));
  }

  function insertBlock(type: SectorBlockType, afterId?: string) {
    const newBlock = createBlock(type);
    const index = afterId ? blocks.findIndex((block) => block.id === afterId) + 1 : blocks.length;
    const next = [...blocks.slice(0, index), newBlock, ...blocks.slice(index)];
    commit(next);
    setSelectedBlockId(newBlock.id);
    setDocumentTab("block");
    setShowInserter(false);
    setQuery("");
  }

  function replaceBlock(id: string, type: SectorBlockType) {
    commit(blocks.map((block) => (block.id === id ? transformBlock(block, type) : block)));
    setSelectedBlockId(id);
    setQuery("");
  }

  function removeBlock(id: string) {
    if (blocks.length === 1) return;
    const index = blocks.findIndex((block) => block.id === id);
    const next = blocks.filter((block) => block.id !== id);
    commit(next);
    setSelectedBlockId(next[Math.max(0, index - 1)]?.id ?? next[0].id);
  }

  function duplicateBlock(id: string) {
    const index = blocks.findIndex((block) => block.id === id);
    if (index < 0) return;
    const clone = cloneEditorBlock(blocks[index]);
    commit([...blocks.slice(0, index + 1), clone, ...blocks.slice(index + 1)]);
    setSelectedBlockId(clone.id);
  }

  function moveBlock(id: string, direction: -1 | 1) {
    const index = blocks.findIndex((block) => block.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  }

  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [blocks, ...items]);
    setHistory((items) => items.slice(0, -1));
    setBlocks(previous);
    setSelectedBlockId(previous[0]?.id ?? "");
  }

  function redo() {
    const next = future[0];
    if (!next) return;
    setHistory((items) => [...items, blocks]);
    setFuture((items) => items.slice(1));
    setBlocks(next);
    setSelectedBlockId(next[0]?.id ?? "");
  }

  function setTitleAndMaybeSlug(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function toggleCategory(category: string) {
    setCategories((items) => (items.includes(category) ? items.filter((item) => item !== category) : [...items, category]));
  }

  function addTag() {
    const newTags = tagDraft
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (newTags.length === 0) return;
    setTags((items) => Array.from(new Set([...items, ...newTags])));
    setTagDraft("");
  }

  return (
    <form id="sector-editor-form" action={action} className="pb-24 md:pb-0">
      <input name="blocksJson" type="hidden" value={serializedBlocks} />
      <input name="content" type="hidden" value={plainContent} />
      <input name="featuredImage" type="hidden" value={featuredImage} />
      <input name="tags" type="hidden" value={tags.join(",")} />

      {error === "title" ? (
        <div className="mb-4 rounded-sm border border-[#d63638]/40 bg-[#fcf0f1] px-4 py-3 text-sm text-[#8a2424]">
          عنوان Sector الزامی است.
        </div>
      ) : null}

      <div className="sticky top-14 z-30 -mx-4 mb-4 border-y border-[#c3c4c7] bg-white px-4 py-2 shadow-sm md:top-10 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div className="relative flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button className={`${focusRing} grid h-9 w-9 place-items-center rounded-sm ${showInserter ? "bg-[#2271b1] text-white" : "text-[#1d2327] hover:bg-[#f0f0f1]"}`} type="button" aria-label="افزودن بلاک" onClick={() => setShowInserter((value) => !value)}>
              <Plus size={20} />
            </button>
            <button className={`${focusRing} grid h-9 w-9 place-items-center rounded-sm ${showListView ? "bg-[#f0f6fc] text-[#2271b1]" : "text-[#1d2327] hover:bg-[#f0f0f1]"}`} type="button" aria-label="نمای لیست" onClick={() => setShowListView((value) => !value)}>
              <ListTree size={19} />
            </button>
            <button className={`${focusRing} grid h-9 w-9 place-items-center rounded-sm text-[#1d2327] hover:bg-[#f0f0f1] disabled:opacity-35`} type="button" aria-label="برگشت" onClick={undo} disabled={history.length === 0}>
              <Undo2 size={18} />
            </button>
            <button className={`${focusRing} grid h-9 w-9 place-items-center rounded-sm text-[#1d2327] hover:bg-[#f0f0f1] disabled:opacity-35`} type="button" aria-label="جلو رفتن" onClick={redo} disabled={future.length === 0}>
              <Redo2 size={18} />
            </button>
            <span className="hidden items-center gap-1 px-2 text-xs text-[#646970] sm:inline-flex">
              <Info size={15} />
              {blocks.length} blocks
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className={`${wpButton} hidden sm:inline-flex`} type="button">
              پیش‌نمایش
              <Eye size={15} />
            </button>
            <button className={wpButton} name="status" type="submit" value="draft">
              ذخیره
            </button>
            <button className={primaryButton} name="status" type="submit" value="published">
              انتشار
            </button>
            <button className={`${focusRing} grid h-9 w-9 place-items-center rounded-sm ${documentTab === "block" ? "bg-[#f0f6fc] text-[#2271b1]" : "text-[#1d2327] hover:bg-[#f0f0f1]"}`} type="button" aria-label="تنظیمات بلاک" onClick={() => setDocumentTab((tab) => (tab === "document" ? "block" : "document"))}>
              <PanelLeft size={19} />
            </button>
            <button className={`${focusRing} grid h-9 w-9 place-items-center rounded-sm text-[#1d2327] hover:bg-[#f0f0f1]`} type="button" aria-label="گزینه‌های بیشتر">
              <MoreVertical size={18} />
            </button>
          </div>

          {showInserter ? (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(92vw,390px)] rounded-sm border border-[#c3c4c7] bg-white shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
              <div className="border-b border-[#dcdcde] p-3">
                <label className="relative block">
                  <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#646970]" size={16} />
                  <input className={`${inputClass} pr-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجوی بلاک" />
                </label>
              </div>
              <div className="grid max-h-[420px] gap-1 overflow-y-auto p-2">
                {filteredBlocks.map(({ type, label, description, shortcut, icon: Icon }) => (
                  <button key={type} className={`${focusRing} grid grid-cols-[36px_1fr_auto] items-center gap-3 rounded-sm p-2 text-right hover:bg-[#f6f7f7]`} type="button" onClick={() => insertBlock(type, selectedBlockId)}>
                    <span className="grid h-9 w-9 place-items-center rounded-sm bg-[#f0f0f1] text-[#1d2327]"><Icon size={18} /></span>
                    <span>
                      <strong className="block text-sm text-[#1d2327]">{label}</strong>
                      <span className="block text-xs text-[#646970]">{description}</span>
                    </span>
                    <code className="text-[11px] text-[#8c8f94]">{shortcut}</code>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_360px] lg:items-start">
        {showListView ? (
          <aside className="rounded-sm border border-[#c3c4c7] bg-white shadow-sm lg:sticky lg:top-28">
            <div className="border-b border-[#dcdcde] px-4 py-3 text-sm font-semibold text-[#1d2327]">نمای لیست</div>
            <div className="grid gap-1 p-2">
              {blocks.map((block, index) => (
                <button key={block.id} className={`${focusRing} flex min-h-10 items-center justify-between gap-2 rounded-sm px-3 text-right text-sm ${selectedBlockId === block.id ? "bg-[#f0f6fc] text-[#2271b1]" : "hover:bg-[#f6f7f7]"}`} type="button" onClick={() => setSelectedBlockId(block.id)}>
                  <span>{index + 1}. {selectedLabel(block.type)}</span>
                  <GripVertical size={15} className="text-[#8c8f94]" />
                </button>
              ))}
            </div>
          </aside>
        ) : (
          <div className="hidden lg:block" />
        )}

        <section className="min-w-0">
          <div className="rounded-sm border border-[#c3c4c7] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <label className="sr-only" htmlFor="sector-title">عنوان Sector</label>
            <input
              id="sector-title"
              name="title"
              className={`${focusRing} w-full border-0 bg-transparent p-0 text-3xl font-normal leading-tight text-[#1d2327] outline-none placeholder:text-[#8c8f94] sm:text-4xl`}
              value={title}
              onChange={(event) => setTitleAndMaybeSlug(event.target.value)}
              placeholder="عنوان را وارد کنید"
            />

            <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-[#dcdcde] py-3 text-xs text-[#646970]">
              <Link2 size={15} className="text-[#8c8f94]" />
              <span>پیوند یکتا:</span>
              <code className="rounded bg-[#f6f7f7] px-2 py-1 text-left text-[#2271b1]" dir="ltr">
                /sectors/{slug || "sector-name"}
              </code>
              <button className={`${focusRing} rounded-sm border border-[#2271b1] px-2 py-1 text-[#2271b1] hover:bg-[#f0f6fc]`} type="button" onClick={() => setSlugTouched(true)}>
                ویرایش
              </button>
            </div>

            <div className="mt-7 grid gap-3">
              {blocks.map((block, index) => (
                <BlockEditor
                  block={block}
                  key={block.id}
                  isSelected={selectedBlockId === block.id}
                  isSlashActive={slashActive && selectedBlockId === block.id}
                  canMoveUp={index > 0}
                  canMoveDown={index < blocks.length - 1}
                  onSelect={() => {
                    setSelectedBlockId(block.id);
                    setDocumentTab("block");
                  }}
                  onUpdate={(patch) => updateBlock(block.id, patch)}
                  onInsert={(type) => insertBlock(type, block.id)}
                  onReplace={(type) => replaceBlock(block.id, type)}
                  onDuplicate={() => duplicateBlock(block.id)}
                  onRemove={() => removeBlock(block.id)}
                  onMoveUp={() => moveBlock(block.id, -1)}
                  onMoveDown={() => moveBlock(block.id, 1)}
                />
              ))}
            </div>

            <button className={`${focusRing} mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-sm border border-dashed border-[#8c8f94] bg-[#fbfbfc] text-sm font-semibold text-[#2271b1] hover:bg-[#f0f6fc]`} type="button" onClick={() => insertBlock("paragraph")}>
              <Plus size={18} />
              افزودن بلاک
            </button>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-[#1d2327]">
                خلاصه کوتاه
                <textarea className={`${inputClass} min-h-28 resize-y`} name="excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="یک توضیح کوتاه برای کارت Sector..." />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#1d2327]">
                CTA صفحه
                <input className={inputClass} name="cta" value={cta} onChange={(event) => setCta(event.target.value)} placeholder="Explore opportunities" />
                <span className="text-xs font-normal text-[#646970]">متنی که روی دکمه sector نمایش داده می‌شود.</span>
              </label>
            </div>
          </div>
        </section>

        <aside className="rounded-sm border border-[#c3c4c7] bg-white shadow-sm lg:sticky lg:top-28">
          <div className="grid grid-cols-2 border-b border-[#dcdcde] text-sm font-semibold">
            <button className={`${focusRing} min-h-11 border-l border-[#dcdcde] ${documentTab === "document" ? "bg-white text-[#1d2327]" : "bg-[#f6f7f7] text-[#50575e]"}`} type="button" onClick={() => setDocumentTab("document")}>سند</button>
            <button className={`${focusRing} min-h-11 ${documentTab === "block" ? "bg-white text-[#1d2327]" : "bg-[#f6f7f7] text-[#50575e]"}`} type="button" onClick={() => setDocumentTab("block")}>بلاک</button>
          </div>

          {documentTab === "document" ? (
            <DocumentSettings
              categories={categories}
              cta={cta}
              englishName={englishName}
              featuredImage={featuredImage}
              icon={icon}
              language={language}
              metaDescription={metaDescription}
              order={order}
              slug={slug}
              tagDraft={tagDraft}
              tags={tags}
              toggleCategory={toggleCategory}
              setCta={setCta}
              setEnglishName={(value) => {
                setEnglishName(value);
                if (!slugTouched) setSlug(slugify(value || title));
              }}
              setFeaturedImage={setFeaturedImage}
              setIcon={setIcon}
              setLanguage={setLanguage}
              setMetaDescription={setMetaDescription}
              setOrder={setOrder}
              setSlug={(value) => {
                setSlugTouched(true);
                setSlug(slugify(value));
              }}
              setTagDraft={setTagDraft}
              addTag={addTag}
              removeTag={(tag) => setTags((items) => items.filter((item) => item !== tag))}
            />
          ) : (
            <BlockSettings block={selectedBlock} onReplace={(type) => replaceBlock(selectedBlock.id, type)} onUpdate={(patch) => updateBlock(selectedBlock.id, patch)} />
          )}
        </aside>
      </div>
    </form>
  );
}

function ToolbarButton({ children, label, onClick, disabled = false }: { children: ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button className={`${focusRing} grid h-8 min-w-8 place-items-center rounded-sm px-2 text-xs text-[#1d2327] hover:bg-[#f0f0f1] disabled:opacity-30`} type="button" aria-label={label} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function BlockEditor({
  block,
  isSelected,
  isSlashActive,
  canMoveUp,
  canMoveDown,
  onSelect,
  onUpdate,
  onInsert,
  onReplace,
  onDuplicate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  block: EditorBlock;
  isSelected: boolean;
  isSlashActive: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<EditorBlock>) => void;
  onInsert: (type: SectorBlockType) => void;
  onReplace: (type: SectorBlockType) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className={`group relative rounded-sm border px-2 py-2 transition ${isSelected ? "border-[#2271b1] shadow-[0_0_0_1px_#2271b1]" : "border-transparent hover:border-[#c3c4c7]"}`} onFocus={onSelect} onClick={onSelect}>
      {isSelected ? (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[#dcdcde] bg-white p-1 shadow-sm">
          <div className="flex items-center gap-1">
            <span className="inline-flex h-8 items-center gap-1 rounded-sm bg-[#f6f7f7] px-2 text-xs font-semibold text-[#1d2327]">
              <GripVertical size={14} />
              {selectedLabel(block.type)}
            </span>
            <label className="sr-only" htmlFor={`block-type-${block.id}`}>
              تغییر نوع بلاک
            </label>
            <select
              id={`block-type-${block.id}`}
              className={`${focusRing} h-8 rounded-sm border border-[#c3c4c7] bg-white px-2 text-xs font-semibold text-[#1d2327] outline-none hover:bg-[#f6f7f7]`}
              value={block.type}
              onChange={(event) => onReplace(event.target.value as SectorBlockType)}
            >
              {blockDefinitions.map(({ type, label }) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
            <ToolbarButton label="بالا" onClick={onMoveUp} disabled={!canMoveUp}>↑</ToolbarButton>
            <ToolbarButton label="پایین" onClick={onMoveDown} disabled={!canMoveDown}>↓</ToolbarButton>
            <ToolbarButton label="کپی" onClick={onDuplicate}><Copy size={15} /></ToolbarButton>
            <ToolbarButton label="حذف" onClick={onRemove}><Trash2 size={15} /></ToolbarButton>
          </div>
          <div className="flex items-center gap-1">
            <ToolbarButton label="راست" onClick={() => onUpdate({ alignment: "right" })}><AlignRight size={15} /></ToolbarButton>
            <ToolbarButton label="وسط" onClick={() => onUpdate({ alignment: "center" })}><AlignCenter size={15} /></ToolbarButton>
            <ToolbarButton label="چپ" onClick={() => onUpdate({ alignment: "left" })}><AlignLeft size={15} /></ToolbarButton>
          </div>
        </div>
      ) : null}

      <RenderBlock block={block} onUpdate={onUpdate} />

      {isSlashActive ? (
        <div className="absolute right-4 top-[calc(100%-0.5rem)] z-40 w-[min(88vw,360px)] rounded-sm border border-[#c3c4c7] bg-white p-2 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
          {blockDefinitions.slice(0, 7).map(({ type, label, icon: Icon }) => (
            <button key={type} className={`${focusRing} flex min-h-10 w-full items-center gap-3 rounded-sm px-2 text-right text-sm hover:bg-[#f6f7f7]`} type="button" onClick={() => onReplace(type)}>
              <Icon size={17} className="text-[#2271b1]" />
              {label}
            </button>
          ))}
        </div>
      ) : null}

      <button className={`${focusRing} absolute -bottom-3 left-1/2 hidden h-7 -translate-x-1/2 items-center gap-1 rounded-full border border-[#c3c4c7] bg-white px-2 text-[11px] font-semibold text-[#2271b1] shadow-sm group-hover:inline-flex ${isSelected ? "inline-flex" : ""}`} type="button" onClick={() => onInsert("paragraph")}>
        <Plus size={14} />
        Block
      </button>
    </div>
  );
}

function RenderBlock({ block, onUpdate }: { block: EditorBlock; onUpdate: (patch: Partial<EditorBlock>) => void }) {
  const align = block.alignment === "center" ? "text-center" : block.alignment === "left" ? "text-left" : "text-right";

  switch (block.type) {
    case "heading":
      return (
        <input className={`${focusRing} w-full border-0 bg-transparent p-2 font-semibold text-[#1d2327] outline-none placeholder:text-[#8c8f94] ${align} ${block.level === 3 ? "text-2xl" : block.level === 4 ? "text-xl" : "text-3xl"}`} value={block.content ?? ""} onChange={(event) => onUpdate({ content: event.target.value })} placeholder="تیتر را وارد کنید" />
      );
    case "image":
      return <ImageBlock block={block} onUpdate={onUpdate} />;
    case "slideshow":
      return <SlideshowBlock block={block} onUpdate={onUpdate} />;
    case "list":
      return <ListBlock block={block} onUpdate={onUpdate} />;
    case "quote":
      return (
        <textarea className={`${focusRing} min-h-28 w-full resize-y border-r-4 border-[#d8a75c] bg-[#fbfbfc] p-4 text-xl leading-9 text-[#1d2327] outline-none placeholder:text-[#8c8f94] ${align}`} value={block.content ?? ""} onChange={(event) => onUpdate({ content: event.target.value })} placeholder="نقل‌قول را بنویسید" />
      );
    case "button":
      return (
        <div className="grid gap-3 rounded-sm bg-[#fbfbfc] p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
            متن دکمه
            <input className={inputClass} value={block.buttonText ?? ""} onChange={(event) => onUpdate({ buttonText: event.target.value })} />
          </label>
          <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
            لینک
            <input className={inputClass} value={block.buttonUrl ?? ""} onChange={(event) => onUpdate({ buttonUrl: event.target.value })} dir="ltr" />
          </label>
          <span className="inline-flex min-h-10 items-center justify-center rounded-sm bg-[#2271b1] px-4 text-sm font-semibold text-white">{block.buttonText || "Button"}</span>
        </div>
      );
    case "separator":
      return <div className="px-2 py-8"><hr className="border-[#c3c4c7]" /></div>;
    case "spacer":
      return <div className="rounded-sm border border-dashed border-[#c3c4c7] bg-[#fbfbfc]" style={{ height: block.height ?? 48 }} />;
    case "columns":
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1].map((index) => (
            <textarea key={index} className={`${focusRing} min-h-32 resize-y rounded-sm border border-[#dcdcde] bg-white p-3 text-sm leading-7 outline-none`} value={block.columns?.[index] ?? ""} onChange={(event) => {
              const columns = [...(block.columns ?? ["", ""])];
              columns[index] = event.target.value;
              onUpdate({ columns });
            }} placeholder={`ستون ${index + 1}`} />
          ))}
        </div>
      );
    default:
      return (
        <textarea className={`${focusRing} min-h-24 w-full resize-y border-0 bg-transparent p-2 text-lg leading-9 text-[#1d2327] outline-none placeholder:text-[#8c8f94] ${align}`} value={block.content ?? ""} onChange={(event) => onUpdate({ content: event.target.value })} placeholder="شروع به نوشتن کنید یا / را برای انتخاب بلاک تایپ کنید" />
      );
  }
}

function ImageBlock({ block, onUpdate }: { block: EditorBlock; onUpdate: (patch: Partial<EditorBlock>) => void }) {
  return (
    <div className="grid gap-3 rounded-sm border border-dashed border-[#c3c4c7] bg-[#fbfbfc] p-4">
      {block.url ? (
        <figure className="overflow-hidden rounded-sm border border-[#dcdcde] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="max-h-80 w-full object-cover" src={block.url} alt={block.alt ?? ""} />
          {block.content ? <figcaption className="px-4 py-3 text-center text-sm text-[#50575e]">{block.content}</figcaption> : null}
        </figure>
      ) : (
        <div className="grid min-h-44 place-items-center rounded-sm border border-dashed border-[#8c8f94] bg-white text-center text-sm text-[#646970]">
          <span className="grid place-items-center gap-2">
            <UploadCloud size={26} className="text-[#2271b1]" />
            تصویر را آپلود کنید یا URL مستقیم وارد کنید.
          </span>
        </div>
      )}

      <label className={`${focusRing} flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-sm border border-[#2271b1] bg-white px-3 text-sm font-semibold text-[#2271b1] hover:bg-[#f0f6fc]`}>
        <UploadCloud size={16} />
        آپلود تصویر
        <input
          className="sr-only"
          name={`media:image:${block.id}`}
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpdate({ url: URL.createObjectURL(file), alt: block.alt || file.name.replace(/\.[^.]+$/, "") });
          }}
        />
      </label>

      <div className="grid gap-2 lg:grid-cols-3">
        <input className={inputClass} value={block.url ?? ""} onChange={(event) => onUpdate({ url: event.target.value })} placeholder="Image URL" dir="ltr" />
        <input className={inputClass} value={block.alt ?? ""} onChange={(event) => onUpdate({ alt: event.target.value })} placeholder="Alt text" />
        <input className={inputClass} value={block.content ?? ""} onChange={(event) => onUpdate({ content: event.target.value })} placeholder="Caption" />
      </div>
    </div>
  );
}

function ListBlock({ block, onUpdate }: { block: EditorBlock; onUpdate: (patch: Partial<EditorBlock>) => void }) {
  const items = block.items?.length ? block.items : [""];

  function updateItems(nextItems: string[]) {
    onUpdate({ items: nextItems });
  }

  function updateItem(index: number, value: string) {
    const nextItems = [...items];
    nextItems[index] = value;
    updateItems(nextItems);
  }

  function addItem() {
    updateItems([...items, ""]);
  }

  function removeItem(index: number) {
    const nextItems = items.filter((_, itemIndex) => itemIndex !== index);
    updateItems(nextItems.length ? nextItems : [""]);
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= items.length) return;

    const nextItems = [...items];
    [nextItems[index], nextItems[target]] = [nextItems[target], nextItems[index]];
    updateItems(nextItems);
  }

  return (
    <div className="grid gap-3 rounded-sm bg-[#fbfbfc] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-sm border border-[#c3c4c7] bg-white p-1">
          <button className={`${focusRing} min-h-8 rounded-sm px-3 text-xs font-semibold ${block.ordered ? "text-[#50575e] hover:bg-[#f6f7f7]" : "bg-[#2271b1] text-white"}`} type="button" onClick={() => onUpdate({ ordered: false })}>
            Bullet list
          </button>
          <button className={`${focusRing} min-h-8 rounded-sm px-3 text-xs font-semibold ${block.ordered ? "bg-[#2271b1] text-white" : "text-[#50575e] hover:bg-[#f6f7f7]"}`} type="button" onClick={() => onUpdate({ ordered: true })}>
            Numbered list
          </button>
        </div>
        <button className={wpButton} type="button" onClick={addItem}>
          <Plus size={15} />
          افزودن آیتم
        </button>
      </div>

      <div className="grid gap-2">
        {items.map((item, index) => (
          <div key={`${index}-${items.length}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-sm border border-[#dcdcde] bg-white p-2">
            <span className="grid h-8 min-w-8 place-items-center rounded-sm bg-[#f6f7f7] text-xs font-semibold text-[#50575e]">
              {block.ordered ? `${index + 1}.` : "•"}
            </span>
            <input className={`${inputClass} border-[#dcdcde]`} value={item} onChange={(event) => updateItem(index, event.target.value)} placeholder="متن آیتم فهرست" />
            <div className="flex items-center gap-1">
              <ToolbarButton label="بالا بردن آیتم" onClick={() => moveItem(index, -1)} disabled={index === 0}>
                ↑
              </ToolbarButton>
              <ToolbarButton label="پایین بردن آیتم" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1}>
                ↓
              </ToolbarButton>
              <ToolbarButton label="حذف آیتم" onClick={() => removeItem(index)}>
                <Trash2 size={15} />
              </ToolbarButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SwiperElementPreview({ autoplay, slides }: { autoplay: boolean; slides: NonNullable<EditorBlock["slides"]> }) {
  useEffect(() => {
    if (hasRegisteredSwiperElement) return;

    let mounted = true;

    import("swiper/element/bundle").then(({ register }) => {
      if (!mounted || hasRegisteredSwiperElement) return;
      register();
      hasRegisteredSwiperElement = true;
    });

    return () => {
      mounted = false;
    };
  }, []);

  const hasManySlides = slides.length > 1;
  const containerProps: Record<string, unknown> = {
    class: "block h-full",
    dir: "ltr",
    "slides-per-view": "1",
    "space-between": "16",
  };

  if (hasManySlides) {
    containerProps.loop = "true";
    containerProps.navigation = "true";
    containerProps.pagination = "true";
    containerProps["pagination-clickable"] = "true";
  }

  if (autoplay && hasManySlides) {
    containerProps.autoplay = "true";
    containerProps["autoplay-delay"] = "3200";
    containerProps["autoplay-disable-on-interaction"] = "false";
  }

  return createElement(
    "swiper-container",
    containerProps,
    slides.map((slide) =>
      createElement(
        "swiper-slide",
        { class: "h-full", key: slide.id },
        <figure className="relative h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="h-full w-full object-cover" src={slide.url} alt={slide.alt ?? ""} />
          {slide.caption ? (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-12 text-sm font-semibold text-white">
              {slide.caption}
            </figcaption>
          ) : null}
        </figure>,
      ),
    ),
  );
}

function SlideshowBlock({ block, onUpdate }: { block: EditorBlock; onUpdate: (patch: Partial<EditorBlock>) => void }) {
  const slides = block.slides?.length ? block.slides : [{ id: `${block.id}-slide-1`, url: "", alt: "", caption: "" }];
  const readySlides = slides.filter((slide) => slide.url.trim());
  const height = block.height ?? 340;

  function updateSlides(nextSlides: NonNullable<EditorBlock["slides"]>) {
    onUpdate({ slides: nextSlides });
  }

  function updateSlide(id: string, patch: Partial<NonNullable<EditorBlock["slides"]>[number]>) {
    updateSlides(slides.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)));
  }

  function addSlide() {
    updateSlides([...slides, { id: uid(), url: "", alt: "", caption: "" }]);
  }

  function removeSlide(id: string) {
    const nextSlides = slides.filter((slide) => slide.id !== id);
    updateSlides(nextSlides.length ? nextSlides : [{ id: uid(), url: "", alt: "", caption: "" }]);
  }

  function moveSlide(id: string, direction: -1 | 1) {
    const index = slides.findIndex((slide) => slide.id === id);
    const target = index + direction;

    if (index < 0 || target < 0 || target >= slides.length) return;

    const nextSlides = [...slides];
    [nextSlides[index], nextSlides[target]] = [nextSlides[target], nextSlides[index]];
    updateSlides(nextSlides);
  }

  return (
    <div className="grid gap-4 rounded-sm border border-dashed border-[#c3c4c7] bg-[#fbfbfc] p-4">
      <div className="overflow-hidden rounded-sm border border-[#dcdcde] bg-[#111820]" style={{ height }}>
        {readySlides.length ? (
          <SwiperElementPreview autoplay={block.autoplay ?? true} slides={readySlides} />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center text-sm text-white/70">
            <span className="grid place-items-center gap-2">
              <Images size={28} className="text-[#d8a75c]" />
              برای ساخت اسلایدشو، URL تصاویر را در اسلایدها وارد کنید.
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-3">
        {slides.map((slide, index) => (
          <div key={slide.id} className="grid gap-2 rounded-sm border border-[#dcdcde] bg-white p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-xs text-[#1d2327]">اسلاید {index + 1}</strong>
              <div className="flex items-center gap-1">
                <ToolbarButton label="بالا بردن اسلاید" onClick={() => moveSlide(slide.id, -1)} disabled={index === 0}>
                  ↑
                </ToolbarButton>
                <ToolbarButton label="پایین بردن اسلاید" onClick={() => moveSlide(slide.id, 1)} disabled={index === slides.length - 1}>
                  ↓
                </ToolbarButton>
                <ToolbarButton label="حذف اسلاید" onClick={() => removeSlide(slide.id)}>
                  <Trash2 size={15} />
                </ToolbarButton>
              </div>
            </div>
            <label className={`${focusRing} flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-sm border border-[#2271b1] bg-[#f0f6fc] px-3 text-xs font-semibold text-[#2271b1] hover:bg-white`}>
              <UploadCloud size={15} />
              آپلود تصویر اسلاید
              <input
                className="sr-only"
                name={`media:slide:${block.id}:${slide.id}`}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) updateSlide(slide.id, { url: URL.createObjectURL(file), alt: slide.alt || file.name.replace(/\.[^.]+$/, "") });
                }}
              />
            </label>
            <div className="grid gap-2 md:grid-cols-3">
              <input className={inputClass} value={slide.url} onChange={(event) => updateSlide(slide.id, { url: event.target.value })} placeholder="Image URL" dir="ltr" />
              <input className={inputClass} value={slide.alt ?? ""} onChange={(event) => updateSlide(slide.id, { alt: event.target.value })} placeholder="Alt text" />
              <input className={inputClass} value={slide.caption ?? ""} onChange={(event) => updateSlide(slide.id, { caption: event.target.value })} placeholder="Caption" />
            </div>
          </div>
        ))}
      </div>

      <button className={`${wpButton} w-fit`} type="button" onClick={addSlide}>
        <Plus size={15} />
        افزودن اسلاید
      </button>
    </div>
  );
}

function Panel({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-[#dcdcde] bg-white" open={defaultOpen}>
      <summary className={`${focusRing} flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-[#1d2327] marker:hidden`}>
        {title}
        <ChevronDown className="transition group-open:rotate-180" size={17} />
      </summary>
      <div className="grid gap-4 px-4 pb-4 text-sm text-[#50575e]">{children}</div>
    </details>
  );
}

function DocumentSettings(props: {
  categories: string[];
  cta: string;
  englishName: string;
  featuredImage: string;
  icon: string;
  language: LanguageCode;
  metaDescription: string;
  order: string;
  slug: string;
  tagDraft: string;
  tags: string[];
  toggleCategory: (category: string) => void;
  setCta: (value: string) => void;
  setEnglishName: (value: string) => void;
  setFeaturedImage: (value: string) => void;
  setIcon: (value: string) => void;
  setLanguage: (value: LanguageCode) => void;
  setMetaDescription: (value: string) => void;
  setOrder: (value: string) => void;
  setSlug: (value: string) => void;
  setTagDraft: (value: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
}) {
  return (
    <>
      <Panel title="انتشار">
        <div className="grid gap-2">
          <div className="flex items-center justify-between"><span>وضعیت</span><strong>پیش‌نویس / منتشرشده</strong></div>
          <div className="flex items-center justify-between"><span>نمایش</span><strong>عمومی</strong></div>
          <div className="flex items-center justify-between"><span>انتشار</span><strong>فوراً</strong></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className={wpButton} name="status" type="submit" value="draft"><Save size={14} /> ذخیره</button>
          <button className={primaryButton} name="status" type="submit" value="published">انتشار</button>
        </div>
      </Panel>

      <Panel title="تنظیمات Sector">
        <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
          زبان مطلب
          <select className={inputClass} name="language" value={props.language} onChange={(event) => props.setLanguage(event.target.value as LanguageCode)}>
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
          <span className="text-xs font-normal text-[#646970]">این مطلب فقط وقتی نمایش داده می‌شود که زبان سایت روی همین گزینه باشد.</span>
        </label>
        <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
          نام انگلیسی
          <input className={inputClass} name="englishName" value={props.englishName} onChange={(event) => props.setEnglishName(event.target.value)} placeholder="Energy" dir="ltr" />
        </label>
        <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
          Slug
          <input className={inputClass} name="slug" value={props.slug} onChange={(event) => props.setSlug(event.target.value)} placeholder="energy" dir="ltr" />
        </label>
        <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
          آیکون
          <select className={inputClass} name="icon" value={props.icon} onChange={(event) => props.setIcon(event.target.value)}>
            <option>Wind</option>
            <option>Building</option>
            <option>CPU</option>
            <option>Factory</option>
            <option>Sprout</option>
            <option>Landmark</option>
          </select>
        </label>
        <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
          ترتیب نمایش
          <input className={inputClass} name="order" type="number" min="1" value={props.order} onChange={(event) => props.setOrder(event.target.value)} />
        </label>
      </Panel>

      <Panel title="دسته‌ها">
        {defaultCategories.map((category) => (
          <label key={category} className="flex min-h-8 items-center gap-2 text-sm text-[#1d2327]">
            <input className="h-4 w-4 accent-[#2271b1]" type="checkbox" name="categories" value={category} checked={props.categories.includes(category)} onChange={() => props.toggleCategory(category)} />
            {category}
          </label>
        ))}
      </Panel>

      <Panel title="برچسب‌ها" defaultOpen={false}>
        <div className="flex gap-2">
          <input className={inputClass} value={props.tagDraft} onChange={(event) => props.setTagDraft(event.target.value)} placeholder="capital, energy" onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              props.addTag();
            }
          }} />
          <button className={wpButton} type="button" onClick={props.addTag}>افزودن</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {props.tags.map((tag) => (
            <button key={tag} className={`${focusRing} rounded-full bg-[#f0f6fc] px-2 py-1 text-xs text-[#2271b1]`} type="button" onClick={() => props.removeTag(tag)}>
              {tag} ×
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="تصویر شاخص">
        <label className={`${focusRing} flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-sm border border-[#2271b1] bg-[#f0f6fc] px-3 text-sm font-semibold text-[#2271b1] hover:bg-white`}>
          <UploadCloud size={16} />
          آپلود تصویر شاخص
          <input
            className="sr-only"
            name="media:featured"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) props.setFeaturedImage(URL.createObjectURL(file));
            }}
          />
        </label>
        <input className={inputClass} value={props.featuredImage} onChange={(event) => props.setFeaturedImage(event.target.value)} placeholder="Image URL" dir="ltr" />
        {props.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="max-h-44 w-full rounded-sm object-cover" src={props.featuredImage} alt="" />
        ) : (
          <div className="grid min-h-32 place-items-center rounded-sm border border-dashed border-[#8c8f94] bg-[#f6f7f7] text-center text-sm text-[#2271b1]">
            <span className="grid place-items-center gap-2"><UploadCloud size={24} /> قرار دادن تصویر شاخص</span>
          </div>
        )}
      </Panel>

      <Panel title="SEO و جستجو" defaultOpen={false}>
        <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
          Meta description
          <textarea className={`${inputClass} min-h-24 resize-y`} name="metaDescription" value={props.metaDescription} onChange={(event) => props.setMetaDescription(event.target.value)} placeholder="A short search description..." />
        </label>
      </Panel>
    </>
  );
}

function BlockSettings({
  block,
  onReplace,
  onUpdate,
}: {
  block: EditorBlock;
  onReplace: (type: SectorBlockType) => void;
  onUpdate: (patch: Partial<EditorBlock>) => void;
}) {
  return (
    <>
      <Panel title="تنظیمات بلاک">
        <div className="rounded-sm bg-[#f6f7f7] p-3 text-sm font-semibold text-[#1d2327]">{selectedLabel(block.type)}</div>
        <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
          نوع بلاک
          <select className={inputClass} value={block.type} onChange={(event) => onReplace(event.target.value as SectorBlockType)}>
            {blockDefinitions.map(({ type, label }) => (
              <option key={type} value={type}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {block.type === "heading" ? (
          <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
            سطح تیتر
            <select className={inputClass} value={block.level ?? 2} onChange={(event) => onUpdate({ level: Number(event.target.value) as 1 | 2 | 3 | 4 })}>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
              <option value={4}>H4</option>
            </select>
          </label>
        ) : null}
        {block.type === "spacer" ? (
          <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
            ارتفاع فاصله: {block.height ?? 48}px
            <input type="range" min="20" max="180" value={block.height ?? 48} onChange={(event) => onUpdate({ height: Number(event.target.value) })} />
          </label>
        ) : null}
        {block.type === "slideshow" ? (
          <>
            <label className="grid gap-2 text-xs font-semibold text-[#1d2327]">
              ارتفاع اسلایدشو: {block.height ?? 340}px
              <input type="range" min="220" max="620" value={block.height ?? 340} onChange={(event) => onUpdate({ height: Number(event.target.value) })} />
            </label>
            <label className="flex min-h-9 items-center gap-2 text-xs font-semibold text-[#1d2327]">
              <input className="h-4 w-4 accent-[#2271b1]" type="checkbox" checked={block.autoplay ?? true} onChange={(event) => onUpdate({ autoplay: event.target.checked })} />
              autoplay فعال باشد
            </label>
            <div className="rounded-sm bg-[#f6f7f7] p-3 text-xs text-[#50575e]">
              تعداد اسلایدها: {block.slides?.length ?? 0}
            </div>
          </>
        ) : null}
        {block.type === "list" ? (
          <div className="grid gap-2 text-xs font-semibold text-[#1d2327]">
            نوع فهرست
            <div className="grid grid-cols-2 gap-2">
              <button className={`${focusRing} min-h-9 rounded-sm border ${block.ordered ? "border-[#c3c4c7] bg-white" : "border-[#2271b1] bg-[#f0f6fc] text-[#2271b1]"}`} type="button" onClick={() => onUpdate({ ordered: false })}>
                Bullet
              </button>
              <button className={`${focusRing} min-h-9 rounded-sm border ${block.ordered ? "border-[#2271b1] bg-[#f0f6fc] text-[#2271b1]" : "border-[#c3c4c7] bg-white"}`} type="button" onClick={() => onUpdate({ ordered: true })}>
                Numbered
              </button>
            </div>
          </div>
        ) : null}
        <div className="grid gap-2 text-xs font-semibold text-[#1d2327]">
          تراز
          <div className="grid grid-cols-3 gap-2">
            {(["right", "center", "left"] as Alignment[]).map((item) => (
              <button key={item} className={`${focusRing} min-h-9 rounded-sm border ${block.alignment === item ? "border-[#2271b1] bg-[#f0f6fc] text-[#2271b1]" : "border-[#c3c4c7] bg-white"}`} type="button" onClick={() => onUpdate({ alignment: item })}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="پیشرفته" defaultOpen={false}>
        <input className={inputClass} placeholder="HTML anchor" />
        <input className={inputClass} placeholder="Additional CSS class(es)" />
      </Panel>
    </>
  );
}
