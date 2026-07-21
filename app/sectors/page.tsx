import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  Cpu,
  Factory,
  Globe2,
  Landmark,
  Layers3,
  Mail,
  Sprout,
  TrendingUp,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { CollaborationRequestButton } from "@/components/CollaborationRequestButton";
import { CollaborationRequestLauncher } from "@/components/CollaborationRequestLauncher";
import { DealLogo } from "@/components/DealBrandVisuals";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { languageDirection, normalizeLanguage, sectorsPageCopy, withLanguage, type LanguageCode } from "@/lib/i18n";
import { portfolioSignalCopy } from "@/lib/portfolioSignals";
import { listSectors, type Sector, type SectorBlock } from "@/lib/sectorStore";

export const dynamic = "force-dynamic";

const pageTitle = "Investment Sectors | DEAL";
const pageDescription =
  "Explore DEAL investment sectors across energy, infrastructure, technology, industry, agriculture, tourism, and strategic opportunities in Iran.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/sectors",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/sectors",
    siteName: "DEAL",
    type: "website",
    images: [
      {
        url: "/assets/img/azadi-clean.png",
        width: 1200,
        height: 630,
        alt: "DEAL investment sectors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/assets/img/azadi-clean.png"],
  },
  keywords: [
    "DEAL sectors",
    "Iran investment sectors",
    "Iran energy investment",
    "Iran infrastructure investment",
    "Iran technology investment",
    "strategic investment opportunities",
  ],
};

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#edc77f]";

const sectorIcons: Record<string, LucideIcon> = {
  Building: Building2,
  CPU: Cpu,
  Factory,
  Landmark,
  Sprout,
  Wind,
};

const fallbackMediaClasses = [
  "bg-[position:-6.2vw_-66.92vw] max-[760px]:bg-[position:-107px_-1157px]",
  "bg-[position:-20.9vw_-66.92vw] max-[760px]:bg-[position:-361px_-1157px]",
  "bg-[position:-35.7vw_-66.92vw] max-[760px]:bg-[position:-618px_-1157px]",
  "bg-[position:-50.55vw_-66.92vw] max-[760px]:bg-[position:-874px_-1157px]",
  "bg-[position:-65.38vw_-66.92vw] max-[760px]:bg-[position:-1130px_-1157px]",
  "bg-[position:-80.09vw_-66.92vw] max-[760px]:bg-[position:-1384px_-1157px]",
];

type SectorsPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

function sectorTitle(sector: Sector, language: LanguageCode) {
  return language === "en" ? sector.englishName || sector.title : sector.title || sector.englishName;
}

function sectorIcon(iconName: string) {
  return sectorIcons[iconName] ?? Landmark;
}

function publicUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}

function textFromBlocks(blocks: SectorBlock[]) {
  return blocks
    .flatMap((block) => {
      if (block.type === "list") return block.items ?? [];
      if (block.type === "columns") return block.columns ?? [];
      if (block.type === "button") return block.buttonText ?? "";
      if (block.type === "slideshow") return block.slides?.map((slide) => [slide.alt, slide.caption].filter(Boolean).join(" ")) ?? [];
      return block.content ?? "";
    })
    .filter(Boolean)
    .join(" ");
}

function descriptionForSector(sector: Sector) {
  return (sector.metaDescription || sector.excerpt || textFromBlocks(sector.blocks) || sector.content || "Strategic investment opportunity in Iran.").slice(0, 170);
}

/** Formats CMS timestamps in the visitor's selected language and calendar. */
function formatSectorDate(value: string, language: LanguageCode) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  const locale = language === "fa" ? "fa-IR-u-ca-gregory" : language === "ar" ? "ar-EG-u-ca-gregory" : "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function Kicker({ children, withLine = false }: { children: string; withLine?: boolean }) {
  return (
    <p className="m-0 flex items-center gap-3 text-[clamp(9px,0.72vw,11px)] font-semibold uppercase leading-none tracking-[0.12em] text-[#d8a75c]">
      {withLine ? (
        <span className="relative h-px w-[clamp(27px,2.65vw,41px)] bg-gradient-to-r from-[#d8a75c0f] to-[#d8a75c] after:absolute after:-right-px after:-top-px after:h-[3px] after:w-[3px] after:rounded-full after:bg-[#edc77f] after:content-['']" />
      ) : null}
      {children}
    </p>
  );
}

function Footer({ language }: { language: LanguageCode }) {
  const copy = sectorsPageCopy[language];

  return (
    <footer id="contact" className="border-t border-[#d8a75c33] bg-[#02090e] px-5 py-10 text-[#cdd1d194] md:px-[6.25vw]">
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <DealLogo className="h-auto w-[clamp(120px,10vw,165px)] text-[#d8a75c]" />
        <div className="flex flex-wrap gap-4 text-sm">
          <a className={`${focusRing} inline-flex items-center gap-2 hover:text-[#edc77f]`} href="mailto:info@dealfdi.com">
            <Mail size={15} /> info@dealfdi.com
          </a>
          <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/", language)}>
            {copy.footer.backHome}
          </a>
        </div>
      </div>
    </footer>
  );
}

function SectorCard({ fallbackCategory, index, language, sector }: { fallbackCategory: string; index: number; language: LanguageCode; sector: Sector }) {
  const Icon = sectorIcon(sector.icon);
  const title = sectorTitle(sector, language);
  const description = descriptionForSector(sector);
  const fallbackClass = fallbackMediaClasses[index % fallbackMediaClasses.length];
  const signalCopy = portfolioSignalCopy[language];
  const formattedUpdate = formatSectorDate(sector.updatedAt, language);

  return (
    <a
      className={`${focusRing} group relative isolate flex min-h-[430px] overflow-hidden rounded-[26px] border border-[#d8a75c35] bg-[#071015] shadow-[0_30px_90px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1.5 hover:border-[#edc77f] hover:shadow-[0_38px_110px_rgba(216,167,92,0.12)]`}
      href={withLanguage(`/sectors/${encodeURIComponent(sector.slug)}`, language)}
    >
      <div className="absolute inset-0 -z-20">
        {sector.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="h-full w-full object-cover brightness-[.58] contrast-[1.12] saturate-[.85] transition duration-500 group-hover:scale-105 group-hover:brightness-[.72]" src={sector.featuredImage} alt="" />
        ) : (
          <div className={`h-full w-full bg-[url('/assets/img/homepage-sprite.png')] bg-[length:96.3vw_auto] bg-no-repeat brightness-[.56] contrast-[1.1] saturate-[.82] transition duration-500 group-hover:scale-105 group-hover:brightness-[.7] max-[760px]:bg-[length:1665px_auto] ${fallbackClass}`} />
        )}
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,9,14,0.06)_0%,rgba(2,9,14,0.72)_48%,#02090e_100%),linear-gradient(90deg,rgba(2,9,14,0.86),rgba(2,9,14,0.18))]" />
      <div className="absolute inset-x-5 top-5 flex items-center justify-between">
        <span className="rounded-full border border-[#d8a75c45] bg-[#02090e99] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#edc77f] backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d8a75c52] bg-[#02090ebf] text-[#edc77f] backdrop-blur transition group-hover:bg-[#edc77f] group-hover:text-[#081014]">
          <ArrowRight size={18} />
        </span>
      </div>

      <div className="mt-auto w-full p-6">
        <Icon className="text-[#edc77f]" size={34} strokeWidth={1.5} />
        <h2 className="mt-5 text-[clamp(26px,2.6vw,42px)] font-semibold uppercase leading-[1.02] tracking-[-0.03em] text-[#f4f4f0]">{title}</h2>
        <p className="mt-4 max-w-[470px] whitespace-pre-line text-[15px] leading-7 text-[#d4d7d7bf]" dir="auto">{description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(sector.categories.length ? sector.categories : [fallbackCategory]).slice(0, 3).map((category) => (
            <span className="rounded-full border border-[#d8a75c38] bg-[#02090e7a] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d8a75c] backdrop-blur" key={category}>
              {category}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#6fa5a035] pt-3 text-[10px] font-semibold uppercase tracking-[0.07em] text-[#c9d5d1a8]">
          <span className="inline-flex items-center gap-2">
            <Layers3 className="text-[#6fa5a0]" size={13} strokeWidth={1.65} aria-hidden="true" />
            <span className="tabular-nums text-[#e8eeeb]">{sector.blocks.length}</span> {signalCopy.sectorMeta.modules}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarClock className="text-[#6fa5a0]" size={13} strokeWidth={1.65} aria-hidden="true" />
            {formattedUpdate ? `${signalCopy.sectorPage.lastUpdated}: ${formattedUpdate}` : signalCopy.sectorPage.noUpdate}
          </span>
        </div>
      </div>
    </a>
  );
}

export default async function SectorsPage({ searchParams }: SectorsPageProps) {
  const params = await searchParams;
  const language = normalizeLanguage(params?.lang);
  const copy = sectorsPageCopy[language];
  const dir = languageDirection(language);
  const allSectors = await listSectors();
  const sectors = allSectors.filter((sector) => sector.status === "published" && sector.language === language);
  const signalCopy = portfolioSignalCopy[language];
  const latestSectorUpdate = sectors.reduce<string | null>((latest, sector) => {
    if (Number.isNaN(new Date(sector.updatedAt).getTime())) return latest;
    if (!latest || new Date(sector.updatedAt).getTime() > new Date(latest).getTime()) return sector.updatedAt;
    return latest;
  }, null);
  const formattedLatestSectorUpdate = latestSectorUpdate ? formatSectorDate(latestSectorUpdate, language) : null;
  const featured = sectors[0] ?? null;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: copy.title,
      description: copy.description,
      url: publicUrl(withLanguage("/sectors", language)),
      publisher: {
        "@type": "Organization",
        name: "DEAL",
        url: publicUrl("/"),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: copy.hero.kicker,
      itemListElement: sectors.map((sector, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: sectorTitle(sector, language),
        url: publicUrl(withLanguage(`/sectors/${sector.slug}`, language)),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: copy.breadcrumb.home, item: publicUrl(withLanguage("/", language)) },
        { "@type": "ListItem", position: 2, name: copy.breadcrumb.sectors, item: publicUrl(withLanguage("/sectors", language)) },
      ],
    },
  ];

  return (
    <div className="min-w-80 overflow-hidden bg-[#02090e] text-[#f4f4f0] [font-family:var(--font-persian)]" lang={language} dir={dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="absolute inset-x-0 top-0 z-40 flex min-h-[92px] items-start justify-between px-5 pt-5 md:px-[clamp(28px,4vw,72px)] md:pt-[clamp(20px,2vw,32px)]">
        <a className={`${focusRing} block w-[clamp(118px,11vw,178px)] text-[#d8a75c]`} href={withLanguage("/", language)} aria-label="DEAL home">
          <DealLogo className="h-auto w-full" />
        </a>
        <div className="flex items-start gap-4">
        <nav className="hidden items-center gap-8 pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#f4f4f0b8] md:flex">
          <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/", language)}>
            {copy.nav.home}
          </a>
          <a className={`${focusRing} text-[#edc77f]`} href={withLanguage("/sectors", language)} aria-current="page">
            {copy.nav.sectors}
          </a>
          <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/#opportunities", language)}>
            {copy.nav.opportunities}
          </a>
          <a className={`${focusRing} hover:text-[#edc77f]`} href="#contact">
            {copy.nav.contact}
          </a>
        </nav>
        <LanguageSwitcher language={language} />
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-[#d8a75c52] bg-[#020a0f] px-5 pb-14 pt-[138px] md:min-h-[760px] md:px-[6.25vw] md:pb-20 md:pt-[170px]">
          <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_78%_18%,rgba(237,199,127,0.22),transparent_24rem),linear-gradient(112deg,#02090e_0%,#031017_55%,#0b1112_100%)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute inset-y-0 right-0 -z-20 h-full w-full object-cover object-center opacity-[.42] brightness-[.52] contrast-[1.18] saturate-[.82] md:w-[62%]"
            src={featured?.featuredImage || "/assets/img/azadi-clean.png"}
            alt=""
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#02090e_0%,rgba(2,9,14,0.96)_40%,rgba(2,9,14,0.48)_73%,rgba(2,9,14,0.18)_100%),linear-gradient(180deg,rgba(2,9,14,0.02)_0%,#02090e_100%)]" />
          <div className="absolute left-[8%] top-[21%] -z-10 h-[300px] w-[300px] rounded-full bg-[#d8a75c0f] blur-[100px]" />

          <div className="max-w-[960px]">
            <div className="mb-9 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.09em] text-[#d4d7d794]">
              <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/", language)}>
                {copy.breadcrumb.home}
              </a>
              <span>/</span>
              <span className="text-[#edc77f]">{copy.breadcrumb.sectors}</span>
            </div>
            <Kicker withLine>{copy.hero.kicker}</Kicker>
            <h1 className="mt-7 max-w-[930px] text-[clamp(48px,7vw,116px)] font-bold uppercase leading-[0.92] tracking-[-0.05em] text-[#f5f5f1]">
              {copy.hero.titleLine1}
              <span className="block text-[#edc77f]">{copy.hero.titleLine2}</span>
            </h1>
            <p className="mt-8 max-w-[650px] text-[clamp(16px,1.28vw,22px)] font-light leading-[1.75] text-[#e2e5e5bd]">
              {copy.hero.description}
            </p>

            <div className="mt-10 grid max-w-[780px] gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#d8a75c38] bg-[#041015cc] p-4 backdrop-blur">
                <Landmark className="mb-4 text-[#edc77f]" size={30} strokeWidth={1.5} />
                <span className="block text-xs uppercase tracking-[0.1em] text-[#d4d7d794]">{copy.stats[0]}</span>
                <strong className="mt-1 block text-2xl text-[#f4f4f0]">{sectors.length}</strong>
              </div>
              <div className="rounded-2xl border border-[#d8a75c38] bg-[#041015cc] p-4 backdrop-blur">
                <Globe2 className="mb-4 text-[#edc77f]" size={30} strokeWidth={1.5} />
                <span className="block text-xs uppercase tracking-[0.1em] text-[#d4d7d794]">{copy.stats[1]}</span>
                <strong className="mt-1 block text-2xl text-[#f4f4f0]">34</strong>
              </div>
              <div className="rounded-2xl border border-[#d8a75c38] bg-[#041015cc] p-4 backdrop-blur">
                <TrendingUp className="mb-4 text-[#edc77f]" size={30} strokeWidth={1.5} />
                <span className="block text-xs uppercase tracking-[0.1em] text-[#d4d7d794]">{copy.stats[2]}</span>
                <strong className="mt-1 block text-2xl text-[#f4f4f0]">68+</strong>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#bdd0cba8]">
              <span className="inline-flex items-center gap-2 text-[#9ebcb5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6fa5a0] shadow-[0_0_9px_rgba(111,165,160,0.7)]" aria-hidden="true" />
                {signalCopy.sectorPage.publishedContent}
              </span>
              <span className="text-[#d8a75c7a]" aria-hidden="true">/</span>
              <span>{formattedLatestSectorUpdate ? `${signalCopy.sectorPage.lastUpdated}: ${formattedLatestSectorUpdate}` : signalCopy.sectorPage.noUpdate}</span>
            </div>
          </div>
        </section>

        <section className="relative border-b border-[#d8a75c33] bg-[radial-gradient(circle_at_80%_0%,rgba(216,167,92,0.08),transparent_28rem),linear-gradient(105deg,#02090e,#030b10_74%,#041016)] px-5 py-[clamp(56px,6vw,112px)] md:px-[6.25vw]">
          <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.65fr)] lg:items-end">
            <div>
              <Kicker>{copy.list.kicker}</Kicker>
              <h2 className="mt-5 max-w-[760px] text-[clamp(34px,4vw,68px)] font-semibold uppercase leading-[0.98] tracking-[-0.04em] text-[#f4f4f0]">
                {copy.list.title}
              </h2>
            </div>
            <p className="max-w-[620px] text-[clamp(15px,1.05vw,18px)] font-light leading-8 text-[#d4d7d7ad]">
              {copy.list.description}
            </p>
          </div>

          {sectors.length ? (
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {sectors.map((sector, index) => (
                <SectorCard fallbackCategory={copy.list.fallbackCategory} language={language} sector={sector} index={index} key={sector.id} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-[#d8a75c38] bg-[#071015] p-8 text-center">
              <Landmark className="mx-auto text-[#edc77f]" size={42} strokeWidth={1.4} />
              <h2 className="mt-5 text-2xl font-semibold uppercase text-[#f4f4f0]">{copy.list.emptyTitle}</h2>
              <p className="mx-auto mt-3 max-w-[520px] text-sm leading-7 text-[#d4d7d794]">{copy.list.emptyText}</p>
            </div>
          )}
        </section>

        <section className="grid gap-8 border-b border-[#d8a75c33] bg-[#050b0e] px-5 py-[clamp(44px,5vw,78px)] md:grid-cols-[minmax(0,0.85fr)_auto] md:items-center md:px-[6.25vw]">
          <div>
            <Kicker>{copy.cta.kicker}</Kicker>
            <h2 className="mt-5 max-w-[720px] text-[clamp(32px,4vw,64px)] font-semibold uppercase leading-[1] tracking-[-0.04em] text-[#f4f4f0]">
              {copy.cta.title}
            </h2>
          </div>
          <CollaborationRequestLauncher className={`${focusRing} group inline-flex min-h-14 items-center justify-center gap-4 rounded-full border border-[#d8a75c8c] bg-[#edc77f] px-6 text-sm font-bold uppercase tracking-[0.06em] text-[#081014] transition hover:bg-[#f4d99d]`}>
            {copy.cta.action}
            <ArrowRight className="transition group-hover:translate-x-1" size={18} />
          </CollaborationRequestLauncher>
        </section>
      </main>

      <CollaborationRequestButton language={language} showTrigger={false} />

      <Footer language={language} />
    </div>
  );
}
