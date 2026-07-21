import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { DealStagedLogo } from "@/components/DealBrandVisuals";
import { languageDirection, normalizeLanguage, withLanguage, type LanguageCode } from "@/lib/i18n";
import { listNewsPreviews } from "@/lib/newsStore";

export const dynamic = "force-dynamic";

type NewsPageProps = {
  searchParams?: Promise<{ lang?: string }>;
};

const copy: Record<LanguageCode, { kicker: string; title: string; description: string; back: string; read: string; minutes: string; label: string }> = {
  en: { kicker: "DEAL intelligence", title: "News & perspectives for decisive capital.", description: "Timely perspective on the sectors, project signals and investment conversations shaping Iran’s strategic future.", back: "Back to home", read: "Read article", minutes: "min read", label: "DEAL news articles" },
  fa: { kicker: "بینش DEAL", title: "خبر و تحلیل برای تصمیم‌های سرمایه‌ای مطمئن.", description: "نگاهی به‌روز به بخش‌ها، نشانه‌های پروژه و گفتگوهای سرمایه‌گذاری که آینده راهبردی ایران را شکل می‌دهند.", back: "بازگشت به خانه", read: "مطالعه خبر", minutes: "دقیقه مطالعه", label: "مقالات خبری DEAL" },
  ar: { kicker: "رؤى DEAL", title: "أخبار ورؤى لرأس مال يتخذ القرار بثقة.", description: "منظور محدث للقطاعات وإشارات المشاريع وحوارات الاستثمار التي ترسم مستقبل إيران الاستراتيجي.", back: "العودة إلى الرئيسية", read: "قراءة الخبر", minutes: "دقائق للقراءة", label: "مقالات أخبار DEAL" },
};

function dateLabel(value: string, language: LanguageCode) {
  const locale = language === "fa" ? "fa-IR" : language === "ar" ? "ar" : "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const language = normalizeLanguage(params?.lang);
  const dir = languageDirection(language);
  const text = copy[language];
  const articles = await listNewsPreviews(language);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <main dir={dir} lang={language} className="min-h-screen overflow-hidden bg-[#02090e] text-[#f4f4f0] [font-family:var(--font-persian)]">
      <header className="relative z-10 flex items-center justify-between border-b border-[#d8a75c3d] px-5 py-5 sm:px-[6.25vw] sm:py-7">
        <a className="block w-[118px] transition hover:scale-[1.015]" href={withLanguage("/#home", language)} aria-label="DEAL home"><DealStagedLogo className="h-auto w-full" /></a>
        <a className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#edc77f]" href={withLanguage("/#home", language)}><Arrow size={16} /> {text.back}</a>
      </header>

      <section className="relative isolate overflow-hidden border-b border-[#d8a75c34] px-5 pb-14 pt-16 sm:px-[6.25vw] sm:pb-20 sm:pt-24">
        <div className="pointer-events-none absolute -right-[12%] top-[-90px] h-[450px] w-[450px] rounded-full border border-[#d8a75c22]" />
        <div className="pointer-events-none absolute -right-[5%] top-[-40px] h-[350px] w-[350px] rounded-full border border-[#d8a75c1a]" />
        <p className="relative m-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d8a75c]">{text.kicker}</p>
        <h1 className="relative mt-5 max-w-[900px] text-[clamp(43px,6.2vw,104px)] font-semibold uppercase leading-[0.88] tracking-[-0.065em] text-[#f4f4f0]">{text.title}</h1>
        <p className="relative mt-7 max-w-[600px] text-[16px] leading-8 text-[#d4d9d8ae]">{text.description}</p>
      </section>

      <section className="px-5 py-14 sm:px-[6.25vw] sm:py-20" aria-label={text.label}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article, index) => (
            <article className={`group relative overflow-hidden rounded-[24px] border border-[#d8a75c32] bg-[#061218] transition duration-500 hover:-translate-y-1 hover:border-[#edc77f86] ${index === 0 ? "md:col-span-2 xl:col-span-2 xl:grid xl:grid-cols-[1.08fr_0.92fr]" : ""}`} key={article.id}>
              <div className={`relative overflow-hidden ${index === 0 ? "min-h-[290px] xl:min-h-[410px]" : "h-[230px]"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" src={article.imageUrl} alt={article.imageAlt} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(2,9,14,0.8)_100%)]" />
              </div>
              <div className={`flex flex-col p-6 ${index === 0 ? "xl:py-10" : ""}`}>
                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#edc77f]"><span>{article.category}</span><i className="h-1 w-1 rounded-full bg-[#edc77f80]" /><span>{dateLabel(article.publishedAt, language)}</span></div>
                <h2 className={`mt-5 font-semibold leading-[1.01] tracking-[-0.04em] text-[#f4f4f0] ${index === 0 ? "text-[clamp(30px,3.1vw,52px)]" : "text-[25px]"}`}>{article.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#d4d9d8ad]">{article.excerpt}</p>
                <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#d8a75c24] pt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#d8a75c]">
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={14} />{article.readingMinutes} {text.minutes}</span>
                  <a className="inline-flex items-center gap-2 hover:text-[#fff1c9]" href={withLanguage(`/news/${article.slug}`, language)}>{text.read}<Arrow size={16} /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
