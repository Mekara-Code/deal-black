"use client";

import { ImagePlus, Languages, SlidersHorizontal } from "lucide-react";
import { useId, useState } from "react";
import type { TeamMember } from "@/lib/teamMemberStore";

type LanguageCode = "fa" | "ar" | "en";

type TeamMemberFieldsProps = {
  member?: TeamMember;
};

const fieldClass = "min-h-10 w-full rounded-sm border border-[#8c8f94] bg-white px-3 text-sm text-[#1d2327] outline-none transition placeholder:text-[#8c8f94] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]";

const languageFields: Record<LanguageCode, {
  label: string;
  direction: "rtl" | "ltr";
  nameKey: "nameFa" | "nameAr" | "nameEn";
  roleKey: "roleFa" | "roleAr" | "roleEn";
  nameLabel: string;
  roleLabel: string;
  namePlaceholder: string;
  rolePlaceholder: string;
}> = {
  fa: {
    label: "فارسی",
    direction: "rtl",
    nameKey: "nameFa",
    roleKey: "roleFa",
    nameLabel: "نام و نام خانوادگی",
    roleLabel: "سمت و عنوان شغلی",
    namePlaceholder: "نام و نام خانوادگی",
    rolePlaceholder: "مدیر ارشد سرمایه‌گذاری",
  },
  ar: {
    label: "العربية",
    direction: "rtl",
    nameKey: "nameAr",
    roleKey: "roleAr",
    nameLabel: "الاسم الكامل",
    roleLabel: "المنصب والمسمى الوظيفي",
    namePlaceholder: "الاسم الكامل",
    rolePlaceholder: "المدير التنفيذي للاستثمار",
  },
  en: {
    label: "English",
    direction: "ltr",
    nameKey: "nameEn",
    roleKey: "roleEn",
    nameLabel: "Full name",
    roleLabel: "Role and title",
    namePlaceholder: "Full name",
    rolePlaceholder: "Chief Investment Officer",
  },
};

const tabs = Object.keys(languageFields) as LanguageCode[];

/**
 * Keeps each member's three localized profiles in one form while exposing one
 * language at a time. Hidden panels remain mounted so entered values are never
 * discarded when switching tabs.
 */
export function TeamMemberFields({ member }: TeamMemberFieldsProps) {
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>("fa");
  const idPrefix = useId();

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-sm border border-[#dcdcde] bg-[#f6f7f7]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dcdcde] bg-white px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1d2327]">
            <Languages className="text-[#2271b1]" size={18} />
            معرفی عضو به زبان‌های مختلف
          </div>
          <div className="inline-flex rounded-sm border border-[#c3c4c7] bg-[#f6f7f7] p-1" role="tablist" aria-label="زبان معرفی عضو">
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
                  defaultValue={member?.[fields.nameKey]}
                  maxLength={160}
                  name={fields.nameKey}
                  onInvalid={() => setActiveLanguage(language)}
                  placeholder={fields.namePlaceholder}
                  required
                  type="text"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
                {fields.roleLabel}
                <input
                  className={fieldClass}
                  defaultValue={member?.[fields.roleKey]}
                  maxLength={180}
                  name={fields.roleKey}
                  onInvalid={() => setActiveLanguage(language)}
                  placeholder={fields.rolePlaceholder}
                  required
                  type="text"
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
            <input className={fieldClass} defaultValue={member?.order ?? 1} min="0" name="order" type="number" />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]">
            وضعیت
            <select className={fieldClass} defaultValue={member?.status ?? "published"} name="status">
              <option value="published">منتشرشده</option>
              <option value="draft">پیش‌نویس</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-[#50575e]" dir="ltr">
            Image URL (optional)
            <input className={fieldClass} defaultValue={member?.imageUrl} name="imageUrl" placeholder="https://..." type="url" />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-[#50575e] lg:col-span-3">
            <span className="flex items-center gap-2"><ImagePlus size={16} /> عکس عضو تیم (JPG، PNG، WebP یا AVIF)</span>
            <input className={`${fieldClass} cursor-pointer py-2`} accept="image/avif,image/jpeg,image/png,image/webp" name="image" type="file" />
          </label>
        </div>
      </section>
    </div>
  );
}
