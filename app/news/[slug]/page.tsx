import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { DealStagedLogo } from "@/components/DealBrandVisuals";
import { languageDirection, normalizeLanguage, withLanguage, type LanguageCode } from "@/lib/i18n";
import { getNewsArticle } from "@/lib/newsStore";

export const dynamic = "force-dynamic";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
};

const copy: Record<LanguageCode, { back: string; all: string; minutes: string }> = {
  en: { back: "Back to news", all: "All news", minutes: "min read" },
  fa: { back: "بازگشت به اخبار", all: "همه اخبار", minutes: "دقیقه مطالعه" },
  ar: { back: "العودة إلى الأخبار", all: "كل الأخبار", minutes: "دقائق للقراءة" },
};

function dateLabel(value: string, language: LanguageCode) {
  const locale = language === "fa" ? "fa-IR" : language === "ar" ? "ar" : "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

export default async function NewsArticlePage({ params, searchParams }: NewsArticlePageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const language = normalizeLanguage(query?.lang);
  const dir = languageDirection(language);
  const article = await getNewsArticle(slug, language);
  if (!article) notFound();

  const text = copy[language];
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <main dir={dir} lang={language} className="min-h-screen overflow-hidden bg-[#02090e] text-[#f4f4f0] [font-family:var(--font-persian)]">
      <header className="relative z-10 flex items-center justify-between border-b border-[#d8a75c3d] px-5 py-5 sm:px-[6.25vw] sm:py-7">
        <a className="block w-[118px] transition hover:scale-[1.015]" href={withLanguage("/#home", language)} aria-label="DEAL home"><DealStagedLogo className="h-auto w-full" /></a>
        <a className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#edc77f]" href={withLanguage("/news", language)}><Arrow size={16} /> {text.back}</a>
      </header>

      <article>
        <section className="relative isolate overflow-hidden px-5 pb-10 pt-16 sm:px-[13vw] sm:pb-14 sm:pt-24">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d8a75c]">{article.category}</p>
          <h1 className="mt-5 max-w-[1000px] text-[clamp(42px,6vw,96px)] font-semibold leading-[0.91] tracking-[-0.065em] text-[#f4f4f0]">{article.title}</h1>
          <p className="mt-7 max-w-[680px] text-[17px] leading-8 text-[#d4d9d8b8]">{article.excerpt}</p>
          <div className="mt-8 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#d8a75c]"><span>{dateLabel(article.publishedAt, language)}</span><i className="h-1 w-1 rounded-full bg-[#edc77f]" /><span className="inline-flex items-center gap-1.5"><Clock3 size={15} />{article.readingMinutes} {text.minutes}</span></div>
        </section>

        <section className="px-5 sm:px-[6.25vw]">
          <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[28px] border border-[#d8a75c42] bg-[#061218] shadow-[0_35px_100px_rgba(0,0,0,0.4)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="aspect-[16/7] w-full object-cover" src={article.imageUrl} alt={article.imageAlt} />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(2,9,14,0.34))]" />
          </div>
        </section>

        <section className="px-5 py-14 sm:px-[13vw] sm:py-20">
          <div className="mx-auto max-w-[760px] text-[17px] leading-9 text-[#dfe3e1d0] sm:text-[19px] sm:leading-10">
            {article.body.map((paragraph) => <p className="mb-7" key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="mx-auto mt-12 max-w-[760px] border-t border-[#d8a75c3d] pt-7"><a className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#edc77f]" href={withLanguage("/news", language)}><Arrow size={16} /> {text.all}</a></div>
        </section>
      </article>
    </main>
  );
}
