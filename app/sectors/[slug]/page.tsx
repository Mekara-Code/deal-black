import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Cpu,
  Factory,
  Globe2,
  Landmark,
  Mail,
  Quote,
  Sprout,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { CollaborationRequestButton } from "@/components/CollaborationRequestButton";
import { CollaborationRequestLauncher } from "@/components/CollaborationRequestLauncher";
import { DealLogo } from "@/components/DealBrandVisuals";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectorDetailSlideshow } from "@/components/SectorDetailSlideshow";
import { languageDirection, normalizeLanguage, sectorDetailCopy, withLanguage, type LanguageCode } from "@/lib/i18n";
import { getSectorBySlug, listSectors, type Sector, type SectorBlock } from "@/lib/sectorStore";

export const dynamic = "force-dynamic";

type SectorPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    lang?: string;
  }>;
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

function sectorIcon(iconName: string) {
  return sectorIcons[iconName] ?? Landmark;
}

function sectorTitle(sector: Sector, language: LanguageCode) {
  return language === "en" ? sector.englishName || sector.title : sector.title || sector.englishName;
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
  return (sector.metaDescription || sector.excerpt || textFromBlocks(sector.blocks) || sector.content).slice(0, 160);
}

function imageForSector(sector: Sector) {
  return sector.featuredImage || "/assets/img/azadi-clean.png";
}

function publicUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}

export async function generateMetadata({ params, searchParams }: SectorPageProps): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const language = normalizeLanguage(query?.lang);
  const sector = await getSectorBySlug(decodeURIComponent(slug), language);
  const copy = sectorDetailCopy[language];

  if (!sector || sector.status !== "published") {
    return {
      title: copy.notFoundTitle,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const displayTitle = sectorTitle(sector, language);
  const title = `${displayTitle} ${copy.metadataSuffix} | DEAL`;
  const description = descriptionForSector(sector);
  const url = withLanguage(`/sectors/${sector.slug}`, language);
  const image = imageForSector(sector);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "DEAL",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
      modifiedTime: sector.updatedAt,
      publishedTime: sector.createdAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    keywords: [
      displayTitle,
      "Iran investment",
      "DEAL",
      "strategic investment",
      ...sector.categories,
      ...sector.tags,
    ].filter(Boolean),
  };
}

function Kicker({ children }: { children: string }) {
  return (
    <p className="m-0 flex items-center gap-3 text-[clamp(9px,0.72vw,11px)] font-semibold uppercase leading-none tracking-[0.12em] text-[#d8a75c]">
      <span className="h-px w-10 bg-gradient-to-r from-[#d8a75c0f] to-[#d8a75c]" />
      {children}
    </p>
  );
}

function alignmentClass(alignment?: SectorBlock["alignment"]) {
  if (alignment === "center") return "text-center";
  if (alignment === "right") return "text-right";
  return "text-left";
}

function contentDirection(alignment?: SectorBlock["alignment"]) {
  if (alignment === "right") return "rtl";
  if (alignment === "left") return "ltr";
  return "auto";
}

function renderHeading(block: SectorBlock) {
  const align = alignmentClass(block.alignment);
  const className = `mt-12 whitespace-pre-line text-[clamp(28px,3vw,48px)] font-semibold leading-[1.08] text-[#f4f4f0] ${align}`;

  if (block.level === 4) {
    return (
      <h4 className={`mt-9 whitespace-pre-line text-2xl font-semibold leading-tight text-[#f4f4f0] ${align}`} dir={contentDirection(block.alignment)}>
        {block.content}
      </h4>
    );
  }

  if (block.level === 3) {
    return (
      <h3 className={`mt-10 whitespace-pre-line text-[clamp(24px,2.2vw,36px)] font-semibold leading-tight text-[#f4f4f0] ${align}`} dir={contentDirection(block.alignment)}>
        {block.content}
      </h3>
    );
  }

  return (
    <h2 className={className} dir={contentDirection(block.alignment)}>
      {block.content}
    </h2>
  );
}

function renderBlock(block: SectorBlock) {
  const align = alignmentClass(block.alignment);
  const dir = contentDirection(block.alignment);

  switch (block.type) {
    case "heading":
      return renderHeading(block);
    case "image":
      if (!block.url) return null;
      return (
        <figure className="my-10 overflow-hidden rounded-[22px] border border-[#d8a75c45] bg-[#050d12] shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="max-h-[620px] w-full object-cover brightness-[.88] contrast-[1.08] saturate-[.92]" src={block.url} alt={block.alt ?? ""} />
          {block.content ? <figcaption className="whitespace-pre-line border-t border-[#d8a75c24] px-6 py-4 text-center text-sm leading-7 text-[#d4d7d794]">{block.content}</figcaption> : null}
        </figure>
      );
    case "list": {
      const items = block.items?.filter(Boolean) ?? [];
      if (!items.length) return null;
      const ListTag = block.ordered ? "ol" : "ul";

      return (
        <ListTag className={`my-8 grid gap-3 rounded-[22px] p-6 text-[clamp(15px,1.05vw,18px)] leading-8 text-[#e2e5e5cc] ${block.ordered ? "list-decimal" : "list-disc"} list-inside ${align}`} dir={dir}>
          {items.map((item) => (
            <li className="whitespace-pre-line" key={item}>
              {item}
            </li>
          ))}
        </ListTag>
      );
    }
    case "quote":
      return (
        <blockquote className={`my-10 whitespace-pre-line border-[#edc77f] bg-[linear-gradient(110deg,rgba(216,167,92,0.1),rgba(4,12,17,0.88))] px-6 py-6 text-[clamp(20px,1.7vw,30px)] font-light leading-[1.55] text-[#f4f4f0] ${align} ${block.alignment === "left" ? "border-l-2" : "border-r-2"}`} dir={dir}>
          <Quote className="mb-4 fill-current text-[#edc77f]" size={30} />
          {block.content}
        </blockquote>
      );
    case "button":
      if (block.buttonUrl && block.buttonUrl !== "#contact") {
        return (
          <a className={`${focusRing} group my-8 inline-flex min-h-12 items-center gap-4 rounded-full border border-[#d8a75c8c] bg-[#edc77f] px-6 text-sm font-bold uppercase tracking-[0.06em] text-[#081014] transition hover:bg-[#f4d99d]`} href={block.buttonUrl}>
            {block.buttonText || "Explore opportunity"}
            <ArrowRight size={18} />
          </a>
        );
      }

      return (
        <CollaborationRequestLauncher className={`${focusRing} group my-8 inline-flex min-h-12 items-center gap-4 rounded-full border border-[#d8a75c8c] bg-[#edc77f] px-6 text-sm font-bold uppercase tracking-[0.06em] text-[#081014] transition hover:bg-[#f4d99d]`}>
          {block.buttonText || "Explore opportunity"}
          <ArrowRight size={18} />
        </CollaborationRequestLauncher>
      );
    case "separator":
      return <hr className="my-12 border-[#d8a75c33]" />;
    case "spacer":
      return <div aria-hidden="true" style={{ height: block.height ?? 48 }} />;
    case "columns":
      return (
        <div className="my-10 grid gap-5 md:grid-cols-2">
          {(block.columns ?? []).map((column, index) => (
            <div key={`${block.id}-${index}`} className="whitespace-pre-line rounded-[22px] border border-[#d8a75c26] bg-[#071015] p-6 text-[clamp(15px,1.05vw,18px)] leading-8 text-[#d4d7d7bf]" dir="auto">
              {column}
            </div>
          ))}
        </div>
      );
    case "slideshow":
      return <SectorDetailSlideshow id={block.id} slides={block.slides ?? []} />;
    case "paragraph":
    default:
      if (!block.content) return null;
      return (
        <p className={`my-6 whitespace-pre-line text-[clamp(16px,1.12vw,19px)] font-light leading-[1.9] text-[#d4d7d7bf] ${align}`} dir={dir}>
          {block.content}
        </p>
      );
  }
}

function Footer({ language }: { language: LanguageCode }) {
  const copy = sectorDetailCopy[language];

  return (
    <footer id="contact" className="border-t border-[#d8a75c33] bg-[#02090e] px-[6.25vw] py-10 text-[#cdd1d194] max-[760px]:px-5">
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

export default async function SectorPage({ params, searchParams }: SectorPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const language = normalizeLanguage(query?.lang);
  const copy = sectorDetailCopy[language];
  const dir = languageDirection(language);
  const sector = await getSectorBySlug(decodeURIComponent(slug), language);

  if (!sector || sector.status !== "published") {
    notFound();
  }

  const allSectors = await listSectors();
  const related = allSectors.filter((item) => item.status === "published" && item.language === language && item.id !== sector.id).slice(0, 3);
  const Icon = sectorIcon(sector.icon);
  const title = sectorTitle(sector, language);
  const description = descriptionForSector(sector);
  const image = imageForSector(sector);
  const blocks = sector.blocks.length ? sector.blocks : [{ id: "fallback-content", type: "paragraph" as const, content: sector.content }];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${title} ${copy.metadataSuffix}`,
      description,
      url: publicUrl(withLanguage(`/sectors/${sector.slug}`, language)),
      datePublished: sector.createdAt,
      dateModified: sector.updatedAt,
      image: publicUrl(image),
      publisher: {
        "@type": "Organization",
        name: "DEAL",
        url: publicUrl("/"),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: copy.breadcrumb.home, item: publicUrl(withLanguage("/", language)) },
        { "@type": "ListItem", position: 2, name: copy.breadcrumb.sectors, item: publicUrl(withLanguage("/sectors", language)) },
        { "@type": "ListItem", position: 3, name: title, item: publicUrl(withLanguage(`/sectors/${sector.slug}`, language)) },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${title} ${copy.metadataSuffix}`,
      serviceType: `${title} ${copy.metadataSuffix}`,
      areaServed: "Iran",
      provider: {
        "@type": "Organization",
        name: "DEAL",
      },
    },
  ];

  return (
    <div className="min-w-80 overflow-x-clip bg-[#02090e] text-[#f4f4f0] [font-family:var(--font-persian)]" lang={language} dir={dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="absolute inset-x-0 top-0 z-40 flex min-h-[92px] items-start justify-between px-[clamp(20px,4vw,72px)] pt-[clamp(18px,2vw,32px)]">
        <a className={`${focusRing} block w-[clamp(118px,11vw,178px)] text-[#d8a75c]`} href={withLanguage("/", language)} aria-label="DEAL home">
          <DealLogo className="h-auto w-full" />
        </a>
        <div className="flex items-start gap-4">
        <nav className="hidden items-center gap-8 pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#f4f4f0b8] md:flex">
          <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/", language)}>
            {copy.nav.home}
          </a>
          <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/sectors", language)}>
            {copy.nav.sectors}
          </a>
          <a className={`${focusRing} hover:text-[#edc77f]`} href="#contact">
            {copy.nav.contact}
          </a>
        </nav>
        <LanguageSwitcher language={language} />
        </div>
      </header>

      <main>
        <section className="relative isolate min-h-[720px] overflow-hidden border-b border-[#d8a75c52] bg-[#020a0f] px-[6.25vw] pb-16 pt-[150px] max-[760px]:min-h-[760px] max-[760px]:px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="absolute inset-y-0 right-0 -z-20 h-full w-[62%] object-cover brightness-[.62] contrast-[1.15] saturate-[.8] max-[760px]:w-full" src={image} alt="" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#020a0f_0%,rgba(2,10,15,0.98)_31%,rgba(2,10,15,0.68)_58%,rgba(2,10,15,0.2)_100%),linear-gradient(180deg,rgba(2,9,14,0.15)_0%,#02090e_100%)]" />
          <div className="absolute right-[10%] top-[20%] -z-10 h-[420px] w-[420px] rounded-full bg-[#d8a75c18] blur-[120px]" />

          <div className="max-w-[850px]">
            <div className="mb-10 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.09em] text-[#d4d7d794]">
              <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/", language)}>
                {copy.breadcrumb.home}
              </a>
              <span>/</span>
              <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/sectors", language)}>
                {copy.breadcrumb.sectors}
              </a>
              <span>/</span>
              <span className="text-[#edc77f]">{title}</span>
            </div>

            <Kicker>{copy.kicker}</Kicker>
            <h1 className="mt-7 max-w-[880px] text-[clamp(46px,6.2vw,104px)] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-[#f5f5f1]">
              {title}
            </h1>
            <p className="mt-8 max-w-[640px] whitespace-pre-line text-[clamp(16px,1.28vw,22px)] font-light leading-[1.7] text-[#e2e5e5b8]" dir="auto">
              {sector.excerpt || description}
            </p>

            <div className="mt-10 grid max-w-[780px] gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#d8a75c38] bg-[#041015cc] p-4 backdrop-blur">
                <Icon className="mb-4 text-[#edc77f]" size={30} strokeWidth={1.5} />
                <span className="block text-xs uppercase tracking-[0.1em] text-[#d4d7d794]">{copy.cards.sector}</span>
                <strong className="mt-1 block text-lg text-[#f4f4f0]">{title}</strong>
              </div>
              <div className="rounded-2xl border border-[#d8a75c38] bg-[#041015cc] p-4 backdrop-blur">
                <Globe2 className="mb-4 text-[#edc77f]" size={30} strokeWidth={1.5} />
                <span className="block text-xs uppercase tracking-[0.1em] text-[#d4d7d794]">{copy.cards.market}</span>
                <strong className="mt-1 block text-lg text-[#f4f4f0]">{copy.cards.marketValue}</strong>
              </div>
              <div className="rounded-2xl border border-[#d8a75c38] bg-[#041015cc] p-4 backdrop-blur">
                <Landmark className="mb-4 text-[#edc77f]" size={30} strokeWidth={1.5} />
                <span className="block text-xs uppercase tracking-[0.1em] text-[#d4d7d794]">{copy.cards.status}</span>
                <strong className="mt-1 block text-lg text-[#f4f4f0]">{copy.cards.statusValue}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="grid items-start gap-10 border-b border-[#d8a75c33] bg-[radial-gradient(circle_at_72%_12%,rgba(216,167,92,0.08),transparent_26rem),linear-gradient(105deg,#02090e,#030b10_74%,#041016)] px-[6.25vw] py-[clamp(54px,6vw,110px)] lg:grid-cols-[minmax(0,1fr)_330px] max-[760px]:px-5">
          <article className="min-w-0">
            {blocks.map((block) => (
              <div key={block.id}>{renderBlock(block)}</div>
            ))}
          </article>

          <aside className="sticky top-8 z-10 h-fit self-start rounded-[26px] border border-[#d8a75c38] bg-[#071015cc] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#edc77f]">{copy.brief}</p>
            <h2 className="mt-4 text-2xl font-semibold uppercase leading-tight text-[#f4f4f0]">{title}</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#d4d7d794]" dir="auto">{description}</p>

            {sector.categories.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {sector.categories.map((category) => (
                  <span className="rounded-full border border-[#d8a75c45] px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-[#edc77f]" key={category}>
                    {category}
                  </span>
                ))}
              </div>
            ) : null}

            <CollaborationRequestLauncher className={`${focusRing} group mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#edc77f] px-5 text-sm font-bold uppercase tracking-[0.06em] text-[#081014] transition hover:bg-[#f4d99d]`}>
              {sector.cta || copy.fallbackCta}
              <ArrowRight size={18} />
            </CollaborationRequestLauncher>
          </aside>
        </section>

        {related.length ? (
          <section className="bg-[#02090e] px-[6.25vw] py-[clamp(50px,5vw,88px)] max-[760px]:px-5">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <Kicker>{copy.related.kicker}</Kicker>
                <h2 className="mt-4 text-[clamp(28px,3vw,48px)] font-semibold uppercase leading-tight text-[#f4f4f0]">{copy.related.title}</h2>
              </div>
              <a className={`${focusRing} hidden items-center gap-2 text-sm font-semibold uppercase tracking-[0.06em] text-[#edc77f] md:inline-flex`} href={withLanguage("/sectors", language)}>
                {copy.related.all} <ArrowRight size={17} />
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((item) => {
                const RelatedIcon = sectorIcon(item.icon);

                return (
                  <a className={`${focusRing} group rounded-[22px] border border-[#d8a75c38] bg-[#071015] p-5 transition hover:-translate-y-1 hover:border-[#edc77f] hover:bg-[#0a151b]`} href={withLanguage(`/sectors/${item.slug}`, language)} key={item.id}>
                    <RelatedIcon className="text-[#edc77f]" size={30} strokeWidth={1.5} />
                    <h3 className="mt-5 text-xl font-semibold uppercase text-[#f4f4f0]">{sectorTitle(item, language)}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#d4d7d794]">{item.excerpt || item.metaDescription}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#edc77f]">
                      {copy.related.view} <ArrowRight className="transition group-hover:translate-x-1" size={15} />
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        ) : null}
      </main>

      <CollaborationRequestButton language={language} showTrigger={false} />

      <Footer language={language} />
    </div>
  );
}
