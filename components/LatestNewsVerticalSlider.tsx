"use client";

import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { withLanguage, type LanguageCode } from "@/lib/i18n";

export type NewsArticlePreview = {
  id: string;
  slug: string;
  imageUrl: string;
  publishedAt: string;
  readingMinutes: number;
  category: string;
  title: string;
  excerpt: string;
  imageAlt: string;
};

type LatestNewsVerticalSliderProps = {
  articles: NewsArticlePreview[];
  language: LanguageCode;
};

const copy: Record<LanguageCode, { kicker: string; title: string; description: string; all: string; read: string; minutes: string; label: string }> = {
  en: { kicker: "Market intelligence", title: "The latest from DEAL.", description: "Focused reading for investors following Iran’s strategic sectors.", all: "All news", read: "Read article", minutes: "min read", label: "Latest DEAL news" },
  fa: { kicker: "رصد بازار", title: "تازه‌ترین مطالب DEAL.", description: "خواندنی‌های متمرکز برای سرمایه‌گذارانی که بخش‌های راهبردی ایران را دنبال می‌کنند.", all: "همه اخبار", read: "مطالعه خبر", minutes: "دقیقه مطالعه", label: "آخرین اخبار DEAL" },
  ar: { kicker: "رصد السوق", title: "أحدث ما لدى DEAL.", description: "قراءة مركزة للمستثمرين الذين يتابعون القطاعات الاستراتيجية في إيران.", all: "كل الأخبار", read: "قراءة الخبر", minutes: "دقائق للقراءة", label: "أحدث أخبار DEAL" },
};

function dateLabel(value: string, language: LanguageCode) {
  const locale = language === "fa" ? "fa-IR" : language === "ar" ? "ar" : "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

/** Displays latest stories in a compact vertical autoplay feed that pauses on hover. */
export function LatestNewsVerticalSlider({ articles, language }: LatestNewsVerticalSliderProps) {
  if (!articles.length) return null;

  const text = copy[language];
  const isRtl = language !== "en";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section id="news" data-story-section className="relative overflow-hidden border-b border-[#d8a75c52] bg-[radial-gradient(circle_at_88%_12%,rgba(216,167,92,0.13),transparent_28rem),linear-gradient(116deg,#07151a,#030b10_64%,#02090e)] px-[6.25vw] py-[clamp(60px,6vw,96px)] max-[760px]:px-5 max-[760px]:py-14" aria-labelledby="latest-news-title">
      <div className="pointer-events-none absolute inset-y-0 right-[7%] w-px bg-[linear-gradient(180deg,transparent,rgba(216,167,92,0.35),transparent)] max-[760px]:hidden" />
      <div className="grid items-center gap-[clamp(40px,5vw,80px)] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div data-story-copy>
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d8a75c]">{text.kicker}</p>
          <h2 id="latest-news-title" className="mt-4 max-w-[480px] text-[clamp(35px,4vw,66px)] font-semibold uppercase leading-[0.92] tracking-[-0.055em] text-[#f4f4f0]">{text.title}</h2>
          <p className="mt-5 max-w-[390px] text-[15px] leading-7 text-[#d4d9d8ab]">{text.description}</p>
          <a className="group mt-8 inline-flex items-center gap-3 border-b border-[#d8a75c80] pb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#edc77f] transition hover:border-[#edc77f] hover:text-[#fff1c9]" href={withLanguage("/news", language)}>
            {text.all}<Arrow className="transition-transform duration-200 group-hover:translate-x-1" size={17} />
          </a>
        </div>

        <div data-story-copy className="relative min-w-0">
          <Swiper
            a11y={{ enabled: true }}
            autoplay={articles.length > 1 ? { delay: 4800, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
            className="h-[clamp(275px,25vw,360px)] overflow-hidden rounded-[24px] border border-[#d8a75c45] bg-[#02090e] shadow-[0_30px_80px_rgba(0,0,0,0.35)] max-[760px]:h-[350px]"
            direction="vertical"
            keyboard={{ enabled: true }}
            loop={articles.length > 1}
            modules={[Autoplay, A11y, Keyboard]}
            speed={780}
            slidesPerView={1}
            aria-label={text.label}
          >
            {articles.map((article) => (
              <SwiperSlide key={article.id}>
                <a className="group relative grid h-full overflow-hidden p-5 sm:grid-cols-[36%_1fr] sm:p-6" href={withLanguage(`/news/${article.slug}`, language)} dir={isRtl ? "rtl" : "ltr"}>
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,9,14,0.1),rgba(2,9,14,0.85)_62%,#02090e)]" />
                  <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(216,167,92,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(216,167,92,0.08)_1px,transparent_1px)] [background-size:38px_38px]" />
                  <div className="relative h-[116px] overflow-hidden rounded-[16px] border border-white/10 sm:h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={article.imageUrl} alt={article.imageAlt} />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,9,14,0.5))]" />
                  </div>
                  <div className={`relative flex min-w-0 flex-col py-4 sm:py-1 ${isRtl ? "sm:pr-6" : "sm:pl-6"}`}>
                    <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#edc77f]">
                      <span>{article.category}</span><i className="h-1 w-1 rounded-full bg-[#edc77f80]" /><span>{dateLabel(article.publishedAt, language)}</span>
                    </div>
                    <h3 className="mt-4 line-clamp-3 text-[clamp(20px,1.85vw,29px)] font-semibold leading-[1.05] tracking-[-0.035em] text-[#f4f4f0]">{article.title}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#d4d9d8ae]">{article.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between pt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#d8a75c]">
                      <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {article.readingMinutes} {text.minutes}</span>
                      <span className="inline-flex items-center gap-2">{text.read}<Arrow size={16} className="transition-transform duration-200 group-hover:translate-x-1" /></span>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
