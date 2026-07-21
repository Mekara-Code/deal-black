import type { LanguageCode } from "@/lib/i18n";

/** Localized labels used by the structured-content details on sector cards. */
export const portfolioSignalCopy: Record<
  LanguageCode,
  {
    sectorMeta: {
      modules: string;
      structuredBrief: string;
    };
    sectorPage: {
      publishedContent: string;
      lastUpdated: string;
      noUpdate: string;
    };
  }
> = {
  en: {
    sectorMeta: { modules: "content modules", structuredBrief: "Structured brief" },
    sectorPage: {
      publishedContent: "Published-content view",
      lastUpdated: "Last update",
      noUpdate: "No update date",
    },
  },
  fa: {
    sectorMeta: { modules: "ماژول محتوایی", structuredBrief: "پرونده ساختاریافته" },
    sectorPage: {
      publishedContent: "نمای محتوای منتشرشده",
      lastUpdated: "آخرین به‌روزرسانی",
      noUpdate: "بدون تاریخ به‌روزرسانی",
    },
  },
  ar: {
    sectorMeta: { modules: "وحدات محتوى", structuredBrief: "ملف منظم" },
    sectorPage: {
      publishedContent: "عرض المحتوى المنشور",
      lastUpdated: "آخر تحديث",
      noUpdate: "لا يوجد تاريخ للتحديث",
    },
  },
};
