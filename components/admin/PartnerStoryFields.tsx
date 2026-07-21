"use client";

import { ImagePlus, Languages, SlidersHorizontal } from "lucide-react";
import { useId, useState } from "react";
import type { PartnerStory } from "@/lib/partnerStoryStore";

type LanguageCode = "fa" | "ar" | "en";

type PartnerStoryFieldsProps = {
  story?: PartnerStory;
};

const fieldClass = "min-h-10 w-full rounded-sm border border-[#8c8f94] bg-white px-3 text-sm text-[#1d2327] outline-none transition placeholder:text-[#8c8f94] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]";

const languageFields: Record<LanguageCode, {
  label: string;
  direction: "rtl" | "ltr";
  nameLabel: string;
  namePlaceholder: string;
  taglineLabel: string;
  taglinePlaceholder: string;
  quoteLabel: string;
  quotePlaceholder: string;
}> = {
  fa: {
    label: "فارسی",
    direction: "rtl",
    nameLabel: "نام شریک یا شخصیت",
    namePlaceholder: "مثلاً شریک جهانی زیرساخت",
    taglineLabel: "شعار کوتاه",
    taglinePlaceholder: "مثلاً شفافیت در هر گام",
    quoteLabel: "نقل‌قول",
    quotePlaceholder: "نقل‌قول شریک یا شخصیت را بنویسید…",
  },
  ar: {
    label: "العربية",
    direction: "rtl",
    nameLabel: "اسم الشريك أو الشخصية",
    namePlaceholder: "مثال: شريك البنية التحتية العالمي",
    taglineLabel: "العبارة التعريفية",
    taglinePlaceholder: "مثال: وضوح في كل مرحلة",
    quoteLabel: "الاقتباس",
    quotePlaceholder: "اكتب اقتباس الشريك أو الشخصية…",
  },
  en: {
    label: "English",
    direction: "ltr",
    nameLabel: "Partner or profile name",
    namePlaceholder: "Global Infrastructure Partner",
    taglineLabel: "Short tagline",
    taglinePlaceholder: "Clarity at every stage",
    quoteLabel: "Quote",
    quotePlaceholder: "Write the partner or profile quote…",
  },
};

const tabs = Object.keys(languageFields) as LanguageCode[];

function fieldName(kind: "name" | "tagline" | "quote", language: LanguageCode) {
  return `${kind}${language[0].toUpperCase()}${language.slice(1)}`;
}

/**
 * Provides one translated partner story per card. Each language panel remains
 * mounted while hidden, so changing tabs never drops text that has been entered.
 */
export function PartnerStoryFields({ story }: PartnerStoryFieldsProps) {
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>("fa");
  const idPrefix = useId();

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-sm border border-[#dcdcde] bg-[#f6f7f7]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dcdcde] bg-white px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1d2327]">
            <Languages className="text-[#2271b1]" size={18} />
            داستان شریک به زبان‌های مختلف
          </div>
          <div className="inline-flex rounded-sm border border-[#c3c4c7] bg-[#f6f7f7] p-1" role="tablist" aria-label="زبان داستان شریک">
            {tabs.map((language) => {
              const isActive = activeLanguage === language;
              const tabId = `${idPrefix}-${language}-tab`;
              const panelId = `${idPrefix}-${language}-panel`;

              return (
                <button
                  aria-controls={panelId}
                  aria-selected={isActive}
                  className={`min-h-8 rounded-sm px-3 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2271b1] ${isActive ? "bg-[#2271b1] text-white" : "text-[#50575e] hover:bg-white hover:text-[#1d2327]"}`}
                  id={tabId}
                  key={language}
                  onClick={() => setActiveLanguage(language)}
                  role="tab"
                  type="button"
                >
                  {languageFields[language].label}
                </button>
              );
            })}
          </div>
        </div>

        {tabs.map((language) => {
          const fields = languageFields[language];
          const translation = story?.translations[language];
          const isActive = activeLanguage === language;
          const tabId = `${idPrefix}-${language}-tab`;
          const panelId = `${idPrefix}-${language}-panel`;

          return (
            <div
              aria-labelledby={tabId}
              className="grid gap-3 p-4 sm:grid-cols-2"
              dir={fields.direction}
              hidden={!isActive}
              id={panelId}
              key={language}
              role="tabpanel"
            >
              <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
                {fields.nameLabel}
                <input
                  className={fieldClass}
                  defaultValue={translation?.name}
                  maxLength={160}
                  name={fieldName("name", language)}
                  onInvalid={() => setActiveLanguage(language)}
                  placeholder={fields.namePlaceholder}
                  required
                  type="text"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
                {fields.taglineLabel}
                <input
                  className={fieldClass}
                  defaultValue={translation?.tagline}
                  maxLength={180}
                  name={fieldName("tagline", language)}
                  placeholder={fields.taglinePlaceholder}
                  type="text"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-[#50575e] sm:col-span-2">
                {fields.quoteLabel}
                <textarea
                  className={`${fieldClass} min-h-28 resize-y py-2`}
                  defaultValue={translation?.quote}
                  maxLength={3_000}
                  name={fieldName("quote", language)}
                  onInvalid={() => setActiveLanguage(language)}
                  placeholder={fields.quotePlaceholder}
                  required
                />
              </label>
            </div>
          );
        })}
      </section>

      <section className="rounded-sm border border-[#dcdcde] bg-white p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#1d2327]">
          <SlidersHorizontal className="text-[#2271b1]" size={18} />
          تنظیمات نمایش و تصویر
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
            ترتیب نمایش
            <input className={fieldClass} defaultValue={story?.order ?? 1} min="0" name="order" type="number" />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
            وضعیت
            <select className={fieldClass} defaultValue={story?.status ?? "published"} name="status">
              <option value="published">منتشرشده</option>
              <option value="draft">پیش‌نویس</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]" dir="ltr">
            Image URL (optional)
            <input className={fieldClass} defaultValue={story?.imageUrl} name="imageUrl" placeholder="https://..." type="url" />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-[#50575e] lg:col-span-3">
            <span className="flex items-center gap-2"><ImagePlus size={16} /> تصویر شخصیت (JPG، PNG، WebP یا AVIF)</span>
            <input className={`${fieldClass} cursor-pointer py-2`} accept="image/avif,image/jpeg,image/png,image/webp" name="image" type="file" />
          </label>
        </div>
      </section>
    </div>
  );
}
