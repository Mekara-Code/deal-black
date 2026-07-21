import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, ChevronDown, Globe2, UsersRound } from "lucide-react";
import { DealLogo } from "@/components/DealBrandVisuals";
import { CollaborationRequestButton } from "@/components/CollaborationRequestButton";
import { CollaborationRequestLauncher } from "@/components/CollaborationRequestLauncher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TeamMemberPortrait } from "@/components/TeamMemberPortrait";
import { languageDirection, normalizeLanguage, withLanguage, type LanguageCode } from "@/lib/i18n";
import { listPublishedTeamMembers, type TeamMember } from "@/lib/teamMemberStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Team | DEAL",
  description: "Meet the leadership team guiding DEAL's strategic investment partnerships.",
  alternates: { canonical: "/team" },
  openGraph: {
    title: "Our Team | DEAL",
    description: "Meet the leadership team guiding DEAL's strategic investment partnerships.",
    url: "/team",
    siteName: "DEAL",
    type: "website",
    images: [{ url: "/assets/img/azadi-clean.png", width: 1200, height: 630, alt: "DEAL team" }],
  },
};

type TeamPageProps = { searchParams?: Promise<{ lang?: string }> };

type TeamCopy = {
  home: string;
  opportunities: string;
  sectors: string;
  contact: string;
  page: string;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  explore: string;
  leaderLabel: string;
  teamKicker: string;
  teamTitle: string;
  teamDescription: string;
  profiles: string;
  expertise: string;
  emptyTitle: string;
  emptyDescription: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaAction: string;
  backHome: string;
};

const copy: Record<LanguageCode, TeamCopy> = {
  en: {
    home: "Home",
    opportunities: "Opportunities",
    sectors: "Sectors",
    contact: "Contact",
    page: "Team",
    eyebrow: "Leadership at DEAL",
    titleLine1: "The people",
    titleLine2: "behind the conviction.",
    description: "A focused leadership team combining local intelligence, investment discipline and a shared responsibility for lasting outcomes.",
    explore: "Explore the team",
    leaderLabel: "Featured leadership profile",
    teamKicker: "Our people",
    teamTitle: "Built around experience. United by intent.",
    teamDescription: "Every profile below is managed from the DEAL team directory, so the page always reflects your current published leadership team.",
    profiles: "Published profiles",
    expertise: "Strategic disciplines",
    emptyTitle: "The team directory is ready.",
    emptyDescription: "Published leadership profiles will appear here automatically.",
    ctaKicker: "Let’s make progress together",
    ctaTitle: "Bring the right people into the room.",
    ctaAction: "Start a conversation",
    backHome: "Back to home",
  },
  fa: {
    home: "خانه",
    opportunities: "فرصت‌ها",
    sectors: "بخش‌ها",
    contact: "تماس",
    page: "تیم",
    eyebrow: "رهبری در DEAL",
    titleLine1: "آدم‌های پشت",
    titleLine2: "هر تصمیم مطمئن.",
    description: "تیمی متمرکز از رهبران که شناخت بومی، انضباط سرمایه‌گذاری و مسئولیت‌پذیری مشترک را برای ساختن نتایج ماندگار کنار هم می‌آورند.",
    explore: "مشاهده تیم",
    leaderLabel: "پروفایل منتخب رهبری",
    teamKicker: "آدم‌های ما",
    teamTitle: "بر پایه تجربه. هم‌مسیر با یک هدف.",
    teamDescription: "هر پروفایل از فهرست تیم DEAL خوانده می‌شود؛ بنابراین این صفحه همیشه اعضای منتشرشده و فعلی شما را نمایش می‌دهد.",
    profiles: "پروفایل منتشرشده",
    expertise: "حوزه راهبردی",
    emptyTitle: "فهرست تیم آماده است.",
    emptyDescription: "پروفایل‌های رهبری پس از انتشار به‌صورت خودکار اینجا ظاهر می‌شوند.",
    ctaKicker: "با هم پیش برویم",
    ctaTitle: "آدم‌های درست را دور یک فرصت جمع کنیم.",
    ctaAction: "شروع گفت‌وگو",
    backHome: "بازگشت به خانه",
  },
  ar: {
    home: "الرئيسية",
    opportunities: "الفرص",
    sectors: "القطاعات",
    contact: "اتصال",
    page: "الفريق",
    eyebrow: "القيادة في DEAL",
    titleLine1: "الأشخاص وراء",
    titleLine2: "كل قرار واثق.",
    description: "فريق قيادي مركز يجمع بين المعرفة المحلية وانضباط الاستثمار والمسؤولية المشتركة لصناعة نتائج مستدامة.",
    explore: "استكشف الفريق",
    leaderLabel: "ملف قيادي مختار",
    teamKicker: "أفرادنا",
    teamTitle: "مبني على الخبرة. موحّد بالهدف.",
    teamDescription: "يُقرأ كل ملف من دليل فريق DEAL، لذا تعكس هذه الصفحة دائماً أعضاء القيادة المنشورين والحاليين.",
    profiles: "ملفات منشورة",
    expertise: "تخصصات استراتيجية",
    emptyTitle: "دليل الفريق جاهز.",
    emptyDescription: "ستظهر ملفات القيادة هنا تلقائياً عند نشرها.",
    ctaKicker: "لنحرز تقدماً معاً",
    ctaTitle: "لنجمع الأشخاص المناسبين حول الفرصة المناسبة.",
    ctaAction: "ابدأ محادثة",
    backHome: "العودة إلى الرئيسية",
  },
};

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#edc77f]";

function localizedMember(member: TeamMember, language: LanguageCode) {
  if (language === "fa") return { name: member.nameFa || member.nameEn, role: member.roleFa || member.roleEn };
  if (language === "ar") return { name: member.nameAr || member.nameEn, role: member.roleAr || member.roleEn };
  return { name: member.nameEn, role: member.roleEn };
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="m-0 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#edc77f]">
      <span className="h-px w-9 bg-[#edc77f]" aria-hidden="true" />
      {children}
    </p>
  );
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const params = await searchParams;
  const language = normalizeLanguage(params?.lang);
  const dir = languageDirection(language);
  const isRtl = dir === "rtl";
  const text = copy[language];
  const members = await listPublishedTeamMembers();
  const featuredMember = members[0] ?? null;
  const DirectionArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-w-80 overflow-hidden bg-[#02090e] text-[#f4f4f0] [font-family:var(--font-persian)]" lang={language} dir={dir}>
      <header className="absolute inset-x-0 top-0 z-30 flex min-h-[88px] items-start justify-between px-5 pt-5 md:px-[6.25vw] md:pt-7">
        <a className={`${focusRing} block w-[clamp(118px,11vw,174px)] text-[#d8a75c]`} href={withLanguage("/", language)} aria-label="DEAL home">
          <DealLogo className="h-auto w-full" />
        </a>
        <div className="flex items-start gap-5">
          <nav className="hidden items-center gap-7 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d8dcdcb0] xl:flex">
            <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/", language)}>{text.home}</a>
            <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/#opportunities", language)}>{text.opportunities}</a>
            <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/sectors", language)}>{text.sectors}</a>
            <a className={`${focusRing} text-[#edc77f]`} href={withLanguage("/team", language)} aria-current="page">{text.page}</a>
            <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/#contact", language)}>{text.contact}</a>
          </nav>
          <LanguageSwitcher language={language} />
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-[#d8a75c40] bg-[#02090e] px-5 pb-12 pt-[132px] md:px-[6.25vw] md:pb-16 md:pt-[146px]">
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_25%,rgba(216,167,92,0.16),transparent_24rem),linear-gradient(112deg,#02090e_0%,#051218_55%,#02090e_100%)]" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-px bg-[#d8a75c4d]" />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(380px,0.72fr)] lg:items-center lg:gap-[clamp(48px,7vw,118px)]">
            <div className="max-w-[710px] pb-5 lg:pb-10">
              <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#aeb7b6]">
                <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/", language)}>{text.home}</a>
                <span className="text-[#d8a75c]">/</span>
                <span className="text-[#edc77f]">{text.page}</span>
              </div>
              <Eyebrow>{text.eyebrow}</Eyebrow>
              <h1 className="mt-6 text-[clamp(48px,6.35vw,100px)] font-semibold uppercase leading-[0.9] tracking-[-0.065em] text-[#f5f5f1]">
                {text.titleLine1}
                <span className="block text-[#edc77f]">{text.titleLine2}</span>
              </h1>
              <p className="mt-7 max-w-[610px] text-[clamp(15px,1.14vw,19px)] font-light leading-8 text-[#d8deddb8]">{text.description}</p>
              <a className={`${focusRing} group mt-9 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f4f4f0]`} href="#team-members">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d8a75c7e] text-[#edc77f] transition duration-300 group-hover:bg-[#edc77f] group-hover:text-[#071016]"><ChevronDown size={18} /></span>
                {text.explore}
              </a>
            </div>

            <article className="relative isolate mx-auto w-full max-w-[560px] overflow-hidden rounded-[28px] border border-[#d8a75c67] bg-[#071015] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5 text-[#edc77f]">
                <span className="rounded-full border border-[#edc77f5b] bg-[#02090e8a] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] backdrop-blur">{text.leaderLabel}</span>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-[#edc77f5b] bg-[#02090e8a] backdrop-blur"><BriefcaseBusiness size={15} strokeWidth={1.4} /></span>
              </div>
              <div className="relative h-[clamp(430px,45vw,610px)]">
                <TeamMemberPortrait
                  src={featuredMember?.imageUrl ?? ""}
                  alt={featuredMember ? localizedMember(featuredMember, language).name : text.page}
                  className="h-full w-full object-cover object-top brightness-[.94] contrast-[1.04] saturate-[.9]"
                  fallbackClassName="h-full w-full"
                  iconSize={62}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,14,0.04)_18%,rgba(2,9,14,0.08)_48%,rgba(2,9,14,0.94)_100%)]" />
                <div className="absolute inset-x-6 bottom-6 z-10 flex items-end justify-between gap-5">
                  <div>
                    <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#edc77f]">{featuredMember ? localizedMember(featuredMember, language).role : text.eyebrow}</p>
                    <h2 className="mt-3 text-[clamp(28px,2.8vw,45px)] font-semibold leading-none text-[#f4f4f0]">{featuredMember ? localizedMember(featuredMember, language).name : "DEAL"}</h2>
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#edc77f] text-[#071016]"><ArrowUpRight size={20} strokeWidth={1.5} /></span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="border-b border-[#d8a75c35] bg-[#061116] px-5 py-6 md:px-[6.25vw]">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex items-center gap-4 sm:border-e sm:border-[#d8a75c35] sm:pe-8">
              <UsersRound className="text-[#edc77f]" size={25} strokeWidth={1.4} />
              <div><strong className="block text-xl font-semibold text-[#f4f4f0]">{members.length}</strong><span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#cfd6d598]">{text.profiles}</span></div>
            </div>
            <div className="flex items-center gap-4">
              <Globe2 className="text-[#edc77f]" size={25} strokeWidth={1.4} />
              <div><strong className="block text-xl font-semibold text-[#f4f4f0]">{members.length}</strong><span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#cfd6d598]">{text.expertise}</span></div>
            </div>
          </div>
        </section>

        <section id="team-members" className="relative bg-[radial-gradient(circle_at_88%_8%,rgba(216,167,92,0.1),transparent_25rem),#02090e] px-5 py-[clamp(64px,7vw,116px)] md:px-[6.25vw]">
          <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.52fr)] lg:items-end">
            <div><Eyebrow>{text.teamKicker}</Eyebrow><h2 className="mt-5 max-w-[790px] text-[clamp(38px,4.85vw,76px)] font-semibold uppercase leading-[0.93] tracking-[-0.06em] text-[#f4f4f0]">{text.teamTitle}</h2></div>
            <p className="max-w-[520px] text-[15px] leading-7 text-[#d4d9d8ab]">{text.teamDescription}</p>
          </div>

          {members.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {members.map((member) => {
                const display = localizedMember(member, language);

                return (
                  <article className="group relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#071015] shadow-[0_22px_65px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_34px_80px_rgba(0,0,0,0.45)]" key={member.id}>
                    <TeamMemberPortrait
                      src={member.imageUrl}
                      alt={display.name}
                      className="h-full w-full object-cover object-top brightness-[.83] contrast-[1.06] saturate-[.88] transition duration-700 group-hover:scale-[1.055] group-hover:brightness-100 group-hover:saturate-100"
                      fallbackClassName="h-full w-full"
                      iconSize={44}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,14,0.02)_24%,rgba(2,9,14,0.12)_48%,rgba(2,9,14,0.96)_100%)]" />
                    <div className="absolute inset-x-5 bottom-5 z-10">
                      <p className="m-0 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#edc77f]">{display.role}</p>
                      <h3 className="mt-2 text-[clamp(22px,1.8vw,30px)] font-semibold leading-[1.04] text-[#f4f4f0]">{display.name}</h3>
                      <span className="mt-4 block h-px w-7 bg-[#edc77f] transition-[width] duration-500 group-hover:w-16" />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="grid min-h-80 place-items-center rounded-[24px] border border-[#d8a75c35] bg-[#071015] p-8 text-center"><div><UsersRound className="mx-auto text-[#edc77f]" size={46} strokeWidth={1.35} /><h3 className="mt-5 text-2xl font-semibold text-[#f4f4f0]">{text.emptyTitle}</h3><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#d4d7d794]">{text.emptyDescription}</p></div></div>
          )}
        </section>

        <section className="border-t border-[#d8a75c35] bg-[#071419] px-5 py-[clamp(58px,6vw,96px)] md:px-[6.25vw]">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div><Eyebrow>{text.ctaKicker}</Eyebrow><h2 className="mt-5 max-w-[760px] text-[clamp(36px,4.5vw,70px)] font-semibold uppercase leading-[0.95] tracking-[-0.055em] text-[#f4f4f0]">{text.ctaTitle}</h2></div>
            <CollaborationRequestLauncher className={`${focusRing} group inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-[#edc77f] px-7 text-sm font-bold uppercase tracking-[0.07em] text-[#071016] transition hover:-translate-y-1 hover:bg-[#f4d99d]`}>
              {text.ctaAction}<DirectionArrow className={isRtl ? "transition group-hover:-translate-x-1" : "transition group-hover:translate-x-1"} size={18} />
            </CollaborationRequestLauncher>
          </div>
        </section>
      </main>

      <CollaborationRequestButton language={language} showTrigger={false} />

      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-[#d8a75c29] bg-[#02090e] px-5 py-9 md:px-[6.25vw]"><DealLogo className="h-auto w-[clamp(118px,10vw,160px)] text-[#d8a75c]" /><a className={`${focusRing} inline-flex items-center gap-2 text-sm text-[#cdd1d194] transition hover:text-[#edc77f]`} href={withLanguage("/", language)}><ArrowLeft className={isRtl ? "rotate-180" : ""} size={16} />{text.backHome}</a></footer>
    </div>
  );
}
