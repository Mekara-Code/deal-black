"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  ChartPie,
  Globe2,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PhoneCall,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DealLogo, DealStagedLogo } from "@/components/DealBrandVisuals";
import { CollaborationRequestButton } from "@/components/CollaborationRequestButton";
import { DealCorporateSections } from "@/components/DealCorporateSections";
import { HomeSectorMosaic, type HomeSector } from "@/components/HomeSectorMosaic";
import { IranProvinceExplorer } from "@/components/IranProvinceExplorer";
import { LatestNewsVerticalSlider, type NewsArticlePreview } from "@/components/LatestNewsVerticalSlider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SocialBrandIcon } from "@/components/SocialBrandIcon";
import type { PartnerStoryView } from "@/components/PartnerTestimonialSwiper";
import type { PartnerLogoView } from "@/components/DealCorporateSections";
import type { TeamMemberView } from "@/components/TeamMemberSwiper";
import { useHomeAnimations } from "@/components/useHomeAnimations";
import type { ContactSettings, MessengerKey } from "@/lib/contactSettingsStore";
import { homeCopy, languageDirection, withLanguage, type LanguageCode } from "@/lib/i18n";

type Stat = {
  value: string;
  counter: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon: LucideIcon;
};

type StatValue = {
  value: string;
  counter: number;
  prefix?: string;
  suffix?: string;
};

type HomeClientProps = {
  language: LanguageCode;
  sectors: HomeSector[];
  partnerStories: PartnerStoryView[];
  partnerLogos: PartnerLogoView[];
  latestNews: NewsArticlePreview[];
  teamMembers: TeamMemberView[];
  contactSettings: ContactSettings;
};

const statValues: StatValue[] = [
  { value: "$12B+", counter: 12, prefix: "$", suffix: "B+" },
  { value: "68+", counter: 68, suffix: "+" },
  { value: "31", counter: 31 },
  { value: "18", counter: 18 },
];
const statIcons = [ChartPie, ChartNoAxesColumnIncreasing, Globe2, Landmark];

const fallbackSectors: HomeSector[] = [
  {
    name: "Energy",
    description: "Powering a Sustainable Future",
    iconName: "Wind",
    imageUrl: "",
    mediaClass: "bg-[position:-6.2vw_-66.92vw] max-[760px]:bg-[position:-107px_-1157px]",
    slug: "energy",
    cta: "Explore opportunities",
  },
  {
    name: "Infrastructure",
    description: "Building Tomorrow's Connectivity",
    iconName: "Building",
    imageUrl: "",
    mediaClass: "bg-[position:-20.9vw_-66.92vw] max-[760px]:bg-[position:-361px_-1157px]",
    slug: "infrastructure",
    cta: "Explore opportunities",
  },
  {
    name: "Technology",
    description: "Innovating for Global Impact",
    iconName: "CPU",
    imageUrl: "",
    mediaClass: "bg-[position:-35.7vw_-66.92vw] max-[760px]:bg-[position:-618px_-1157px]",
    slug: "technology",
    cta: "Explore opportunities",
  },
  {
    name: "Industry",
    description: "Advanced Manufacturing & Production",
    iconName: "Factory",
    imageUrl: "",
    mediaClass: "bg-[position:-50.55vw_-66.92vw] max-[760px]:bg-[position:-874px_-1157px]",
    slug: "industry",
    cta: "Explore opportunities",
  },
  {
    name: "Agriculture",
    description: "Feeding Growth, Creating Value",
    iconName: "Sprout",
    imageUrl: "",
    mediaClass: "bg-[position:-65.38vw_-66.92vw] max-[760px]:bg-[position:-1130px_-1157px]",
    slug: "agriculture",
    cta: "Explore opportunities",
  },
  {
    name: "Tourism",
    description: "Discover Timeless Persian Hospitality",
    iconName: "Landmark",
    imageUrl: "",
    mediaClass: "bg-[position:-80.09vw_-66.92vw] max-[760px]:bg-[position:-1384px_-1157px]",
    slug: "tourism",
    cta: "Explore opportunities",
  },
];

const footerGroups = [
  { title: "Company", links: ["About Us", "Our Team", "Careers", "News"] },
  { title: "Opportunities", links: ["All Projects", "For Investors", "For Partners", "How It Works"] },
  { title: "Resources", links: ["Reports", "Insights", "Media Center", "FAQs"] },
];

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#edc77f]";

const messengerItems: Array<{ key: MessengerKey; label: string }> = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "telegram", label: "Telegram" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
];

const contactModalCopy: Record<LanguageCode, { eyebrow: string; title: string; description: string; close: string; call: string; primary: string; direct: string }> = {
  en: { eyebrow: "Direct contact", title: "Let’s start a conversation.", description: "Choose a number and our team will be ready to help.", close: "Close contact options", call: "Call now", primary: "Primary line", direct: "Direct line" },
  fa: { eyebrow: "ارتباط مستقیم", title: "گفت‌وگو را شروع کنیم.", description: "شماره دلخواه را انتخاب کنید؛ تیم ما آماده پاسخ‌گویی است.", close: "بستن گزینه‌های تماس", call: "تماس اکنون", primary: "خط اصلی", direct: "خط مستقیم" },
  ar: { eyebrow: "اتصال مباشر", title: "لنبدأ المحادثة.", description: "اختر الرقم المناسب وسيكون فريقنا جاهزاً لمساعدتك.", close: "إغلاق خيارات الاتصال", call: "اتصل الآن", primary: "الخط الرئيسي", direct: "خط مباشر" },
};

const contactDetailsCopy: Record<LanguageCode, { email: string; phone: string; whatsapp: string; address: string }> = {
  en: { email: "Email", phone: "Company phone", whatsapp: "WhatsApp", address: "Office address" },
  fa: { email: "ایمیل", phone: "شماره تماس شرکت", whatsapp: "واتساپ", address: "نشانی دفتر" },
  ar: { email: "البريد الإلكتروني", phone: "هاتف الشركة", whatsapp: "واتساب", address: "عنوان المكتب" },
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

function homeNavigationHref(target: string, language: LanguageCode) {
  return target === "about-us" ? withLanguage("/about", language) : withLanguage(`/#${target}`, language);
}

function Kicker({ children, withLine = false }: { children: string; withLine?: boolean }) {
  return (
    <p className="m-0 flex items-center gap-[9px] text-[clamp(9px,0.72vw,11px)] font-semibold uppercase leading-[1.2] tracking-[0.1em] text-[#d8a75c]">
      {withLine ? (
        <span className="relative h-px w-[clamp(27px,2.65vw,41px)] bg-gradient-to-r from-[#d8a75c0f] to-[#d8a75c] after:absolute after:-right-px after:-top-px after:h-[3px] after:w-[3px] after:rounded-full after:bg-[#edc77f] after:content-['']" />
      ) : null}
      {children}
    </p>
  );
}

export function HomeClient({ language, sectors, partnerStories, teamMembers, partnerLogos, latestNews, contactSettings }: HomeClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [headerCondensed, setHeaderCondensed] = useState(false);
  const [heroVideoVisible, setHeroVideoVisible] = useState(false);
  const homeRef = useRef<HTMLDivElement>(null);
  const heroVideoSwapScheduled = useRef(false);
  const heroVideoSwapTimer = useRef<number | null>(null);
  const heroAzadiCycleTimer = useRef<number | null>(null);
  useHomeAnimations(homeRef);
  const copy = homeCopy[language];
  const dir = languageDirection(language);
  const isRtl = dir === "rtl";
  const DirectionArrow = isRtl ? ArrowLeft : ArrowRight;
  const heroMediaPlacement = isRtl
    ? "left-0 top-[9.7vw] max-[760px]:bottom-[18%] max-[760px]:left-[-28%] max-[760px]:top-auto"
    : "right-0 top-[9.7vw] max-[760px]:bottom-[18%] max-[760px]:right-[-28%] max-[760px]:top-auto";
  const heroMediaObjectPlacement = isRtl ? "max-[760px]:object-[48%_center]" : "max-[760px]:object-[52%_center]";
  const heroOverlay = isRtl
    ? "bg-[linear-gradient(270deg,#020a0f_0%,rgba(2,10,15,0.98)_22%,rgba(2,10,15,0.83)_38%,rgba(2,10,15,0.22)_63%,transparent_81%),linear-gradient(180deg,rgba(2,9,14,0.42)_0%,transparent_28%,transparent_64%,rgba(1,7,10,0.9)_100%),radial-gradient(ellipse_at_22%_46%,transparent_22%,rgba(0,5,8,0.24)_75%)]"
    : "bg-[linear-gradient(90deg,#020a0f_0%,rgba(2,10,15,0.98)_22%,rgba(2,10,15,0.83)_38%,rgba(2,10,15,0.22)_63%,transparent_81%),linear-gradient(180deg,rgba(2,9,14,0.42)_0%,transparent_28%,transparent_64%,rgba(1,7,10,0.9)_100%),radial-gradient(ellipse_at_78%_46%,transparent_22%,rgba(0,5,8,0.24)_75%)]";
  const heroContentPlacement = isRtl
    ? "right-[12.2vw] max-[1100px]:right-[10vw] max-[760px]:inset-x-5"
    : "left-[12.2vw] max-[1100px]:left-[10vw] max-[760px]:inset-x-5";
  const heroScrollPlacement = isRtl ? "right-[2.35vw]" : "left-[2.35vw]";
  const heroStatsPlacement = isRtl
    ? "right-[12.2%] max-[1100px]:right-[10%] max-[760px]:inset-x-4"
    : "left-[12.2%] max-[1100px]:left-[10%] max-[760px]:inset-x-4";
  const statItems: Stat[] = copy.stats.map((label, index) => ({
    ...(statValues[index] ?? { value: "", counter: 0 }),
    label,
    icon: statIcons[index] ?? Landmark,
  }));
  const navigation = [...copy.navigation];
  const opportunitiesIndex = navigation.findIndex((item) => item.target === "opportunities");
  const sectorsIndex = navigation.findIndex((item) => item.target === "sectors");

  if (opportunitiesIndex >= 0 && sectorsIndex >= 0) {
    [navigation[opportunitiesIndex], navigation[sectorsIndex]] = [navigation[sectorsIndex], navigation[opportunitiesIndex]];
  }

  const displaySectors = sectors;
  const contactCopy = contactModalCopy[language];
  const contactDetails = contactDetailsCopy[language];
  const companyAddress = language === "fa" ? contactSettings.addressFa : language === "ar" ? contactSettings.addressAr : contactSettings.addressEn;
  const phoneNumbers = [contactSettings.phonePrimary, contactSettings.phoneSecondary].filter(Boolean);
  const activeMessengers = messengerItems.filter((item) => Boolean(contactSettings[item.key]));

  useEffect(() => {
    if (!contactOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [contactOpen]);

  useEffect(() => {
    let frame = 0;
    let previousState = false;

    const updateHeader = () => {
      frame = 0;
      const nextState = window.scrollY > 36;

      if (nextState !== previousState) {
        previousState = nextState;
        setHeaderCondensed(nextState);
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    };

    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (heroVideoSwapTimer.current !== null) {
        window.clearTimeout(heroVideoSwapTimer.current);
      }
      if (heroAzadiCycleTimer.current !== null) {
        window.clearTimeout(heroAzadiCycleTimer.current);
      }
    };
  }, []);

  const startHeroAzadiCycle = () => {
    setHeroVideoVisible(true);
    heroAzadiCycleTimer.current = window.setTimeout(() => {
      heroAzadiCycleTimer.current = null;
      setHeroVideoVisible(false);
      heroAzadiCycleTimer.current = window.setTimeout(() => {
        heroAzadiCycleTimer.current = null;
        startHeroAzadiCycle();
      }, 20000);
    }, 8000);
  };

  const revealHeroVideo = () => {
    if (heroVideoSwapScheduled.current) return;

    heroVideoSwapScheduled.current = true;
    heroVideoSwapTimer.current = window.setTimeout(() => {
      heroVideoSwapTimer.current = null;
      startHeroAzadiCycle();
    }, 2000);
  };

  return (
    <div ref={homeRef} data-home-root className="relative min-w-80 overflow-clip bg-[#02090e] text-[#f4f4f0] [font-family:var(--font-persian)]" lang={language} dir={dir}>
      <div data-home-topbar className={`fixed inset-x-0 top-0 z-[70] flex min-h-11 items-center gap-4 border-b border-[#d8a75c2b] bg-[#02090ee8] px-[clamp(18px,2.25vw,38px)] text-[#edc77f] backdrop-blur-xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none max-[760px]:gap-3 max-[760px]:px-4 ${headerCondensed ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
        <div className="flex items-center gap-3 max-[760px]:gap-2" aria-label="Contact channels">
          {activeMessengers.map(({ key, label }) => (
            <a
              className={`${focusRing} grid h-8 w-8 place-items-center rounded-full text-[#d8a75c] transition duration-200 hover:-translate-y-0.5 hover:bg-[#d8a75c1c] hover:text-[#f4d99d]`}
              href={contactSettings[key]}
              target="_blank"
              rel="noreferrer"
              key={key}
              aria-label={label}
            >
              <SocialBrandIcon network={key} className="h-[17px] w-[17px] text-[#d8a75c]" aria-hidden="true" />
            </a>
          ))}
          {contactSettings.email ? (
            <a className={`${focusRing} hidden items-center gap-2 border-s border-[#d8a75c35] ps-4 text-xs font-semibold tracking-[0.04em] text-[#f7edcf] transition hover:text-[#edc77f] sm:inline-flex`} href={`mailto:${contactSettings.email}`} dir="ltr">
              <Mail size={14} /> {contactSettings.email}
            </a>
          ) : null}
        </div>
        <div className="ms-auto">
          <LanguageSwitcher language={language} dropdownClassName={isRtl ? "max-[760px]:left-0" : "max-[760px]:right-0"} />
        </div>
      </div>

      <header data-home-header className={`fixed z-[60] grid grid-cols-[minmax(160px,1fr)_auto_minmax(210px,1fr)] gap-8 transition-[top,left,right,min-height,padding,background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none max-[1100px]:grid-cols-[1fr_auto] ${headerCondensed ? "inset-x-0 top-0 min-h-[68px] items-center rounded-b-[22px] border border-t-0 border-[#d8a75c48] bg-[#061218d9] px-[clamp(18px,2vw,30px)] py-2 shadow-[0_14px_45px_rgba(0,0,0,0.34)] backdrop-blur-2xl max-[760px]:min-h-[64px] max-[760px]:gap-4 max-[760px]:px-3" : "inset-x-0 top-11 min-h-[clamp(78px,6.25vw,100px)] items-start border border-transparent px-[clamp(23px,2.25vw,38px)] pt-[clamp(17px,1.9vw,31px)] max-[760px]:min-h-[76px] max-[760px]:p-4"}`}>
        <span data-header-progress aria-hidden="true" className={`pointer-events-none absolute bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#edc77f] to-transparent opacity-90 ${isRtl ? "right-[12%] origin-right" : "left-[12%] origin-left"} ${headerCondensed ? "w-[76%]" : "w-[56%] opacity-0"}`} />
        <a data-home-logo className={`${focusRing} group relative z-10 block shrink-0 transition-[width,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${headerCondensed ? "w-[clamp(88px,6.8vw,110px)] max-[760px]:w-[82px]" : "w-[clamp(98px,8.5vw,132px)] max-[760px]:w-[94px]"}`} href={withLanguage("/#home", language)} aria-label="DEAL home">
          <DealStagedLogo className="block h-auto w-full transition-transform duration-300 ease-out group-hover:scale-[1.018]" />
        </a>

        <nav className={`flex items-center justify-center gap-[clamp(24px,3vw,48px)] transition-[gap,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none max-[1100px]:hidden ${headerCondensed ? "gap-[clamp(20px,2.4vw,38px)] pt-0" : "pt-[clamp(9px,0.8vw,13px)]"}`} aria-label="Primary navigation">
          {navigation.map((item, index) => (
            <a
              key={item.target}
              className={`${focusRing} relative text-[clamp(9px,0.77vw,12px)] font-medium uppercase leading-none tracking-[0.02em] transition-[padding,color] duration-500 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:scale-x-20 after:bg-[#d8a75c] after:opacity-0 after:transition ${headerCondensed ? "pb-3" : "pb-[clamp(20px,1.75vw,28px)]"} ${index === 0 ? "text-[#edc77f] after:scale-x-100 after:opacity-100" : "text-[#f4f4f0b8] hover:text-[#edc77f] hover:after:scale-x-100 hover:after:opacity-100"}`}
              href={homeNavigationHref(item.target, language)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={`relative z-10 flex shrink-0 items-center justify-self-end transition-[gap] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] max-[1100px]:col-start-2 ${headerCondensed ? "gap-3" : "gap-[clamp(15px,1.7vw,27px)]"}`}>
          <button
            className={`${focusRing} relative grid h-[clamp(40px,3.5vw,55px)] w-[clamp(40px,3.5vw,55px)] place-items-center rounded-full border border-[#d8a75c85] bg-[#02090e80] text-[#edc77f] shadow-[0_0_0_6px_rgba(216,167,92,0.05)] transition duration-200 hover:scale-105 hover:bg-[#edc77f] hover:text-[#071016]`}
            type="button"
            onClick={() => setContactOpen(true)}
            aria-label={contactCopy.title}
          >
            <span aria-hidden="true" className="absolute inset-1 rounded-full border border-[#edc77f80] animate-ping [animation-duration:2.4s] motion-reduce:animate-none" />
            <PhoneCall className="relative" size={19} strokeWidth={1.75} />
          </button>
          <button
            className={`${focusRing} relative z-10 cursor-pointer inline-flex h-[clamp(40px,3.5vw,55px)] min-w-[clamp(88px,8.7vw,136px)] items-center justify-center gap-[clamp(12px,1.4vw,22px)] rounded-full border border-[#d8a75c85] bg-[#061218b8] text-[clamp(10px,0.75vw,12px)] uppercase text-[#f5f5f0e6] transition hover:bg-[#edc77f] hover:text-[#071016] max-[760px]:h-12 max-[760px]:w-12 max-[760px]:min-w-12 max-[760px]:p-0`}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={copy.openMenu}
          >
            <span className="max-[760px]:hidden">{copy.menu}</span>
            <Menu size={20} strokeWidth={1.45} />
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-[130] grid place-items-center px-4 py-6 transition ${contactOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"}`} aria-hidden={!contactOpen}>
        <button className={`${focusRing} absolute inset-0 border-0 bg-[#010609cc] opacity-0 backdrop-blur-md transition-opacity duration-300 ${contactOpen ? "opacity-100" : ""}`} type="button" onClick={() => setContactOpen(false)} aria-label={contactCopy.close} />
        <section className={`relative max-h-[calc(100dvh-48px)] w-[min(100%,580px)] overflow-x-hidden overflow-y-auto rounded-[28px] border border-[#d8a75c70] bg-[radial-gradient(circle_at_50%_0%,rgba(237,199,127,0.18),transparent_16rem),linear-gradient(145deg,#071218,#02090e)] p-[clamp(22px,5vw,46px)] shadow-[0_28px_100px_rgba(0,0,0,0.62)] transition-[opacity,transform] duration-500 ease-out ${contactOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-7 scale-95 opacity-0"}`} role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-[#edc77f38] shadow-[0_0_0_2rem_rgba(216,167,92,0.035),0_0_0_4rem_rgba(216,167,92,0.02)]" />
          <div className="relative flex items-start justify-between gap-5">
            <div>
              <p className="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-[#edc77f]">{contactCopy.eyebrow}</p>
              <h2 id="contact-modal-title" className="mt-3 max-w-[430px] font-['Times_New_Roman'] text-[clamp(2rem,6vw,3.7rem)] font-normal leading-[0.95] text-[#fff4cf]">{contactCopy.title}</h2>
              <p className="mt-4 max-w-[410px] text-sm leading-7 text-[#f4f4f0a8]">{contactCopy.description}</p>
            </div>
            <button className={`${focusRing} grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d8a75c61] text-[#edc77f] transition hover:rotate-90 hover:bg-[#edc77f] hover:text-[#071016]`} type="button" onClick={() => setContactOpen(false)} aria-label={contactCopy.close}>
              <X size={18} />
            </button>
          </div>

          <div className="relative mt-8 grid gap-3">
            {contactSettings.email ? (
              <a className={`${focusRing} group grid min-h-[74px] grid-cols-[48px_1fr_auto] items-center gap-4 rounded-2xl border border-[#d8a75c4d] bg-[#061116a8] px-4 transition duration-300 hover:-translate-y-1 hover:border-[#edc77f] hover:bg-[#d8a75c18]`} href={`mailto:${contactSettings.email}`} dir="ltr" onClick={() => setContactOpen(false)}>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d8a75c1c] text-[#edc77f] transition group-hover:bg-[#edc77f] group-hover:text-[#071016]"><Mail size={18} /></span>
                <span className="min-w-0 text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-[#edc77faa]">{contactDetails.email}</span>
                  <span className="mt-1 block truncate text-lg font-semibold text-[#f7f3e9]">{contactSettings.email}</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#edc77f] group-hover:text-[#fff4cf]">{contactDetails.email}</span>
              </a>
            ) : null}
            {phoneNumbers.map((phone, index) => (
              <a className={`${focusRing} group grid min-h-[74px] grid-cols-[48px_1fr_auto] items-center gap-4 rounded-2xl border border-[#d8a75c4d] bg-[#061116a8] px-4 transition duration-300 hover:-translate-y-1 hover:border-[#edc77f] hover:bg-[#d8a75c18]`} href={telHref(phone)} key={phone} dir="ltr" onClick={() => setContactOpen(false)}>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d8a75c1c] text-[#edc77f] transition group-hover:bg-[#edc77f] group-hover:text-[#071016]"><PhoneCall size={18} /></span>
                <span className="text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-[#edc77faa]">{index === 0 ? contactDetails.phone : contactCopy.direct}</span>
                  <span className="mt-1 block text-lg font-semibold text-[#f7f3e9]">{phone}</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#edc77f] group-hover:text-[#fff4cf]">{contactCopy.call}</span>
              </a>
            ))}
            {contactSettings.whatsapp ? (
              <a className={`${focusRing} group grid min-h-[74px] grid-cols-[48px_1fr_auto] items-center gap-4 rounded-2xl border border-[#d8a75c4d] bg-[#061116a8] px-4 transition duration-300 hover:-translate-y-1 hover:border-[#edc77f] hover:bg-[#d8a75c18]`} href={contactSettings.whatsapp} target="_blank" rel="noreferrer" dir="ltr" onClick={() => setContactOpen(false)}>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d8a75c1c] text-[#edc77f] transition group-hover:bg-[#edc77f] group-hover:text-[#071016]"><MessageCircle size={18} /></span>
                <span className="text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-[#edc77faa]">{contactDetails.whatsapp}</span>
                  <span className="mt-1 block text-lg font-semibold text-[#f7f3e9]">{contactSettings.phonePrimary}</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#edc77f] group-hover:text-[#fff4cf]">{contactDetails.whatsapp}</span>
              </a>
            ) : null}
            {companyAddress ? (
              <div className="grid min-h-[88px] grid-cols-[48px_1fr] items-start gap-4 rounded-2xl border border-[#d8a75c4d] bg-[#061116a8] px-4 py-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d8a75c1c] text-[#edc77f]"><MapPin size={18} /></span>
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-[#edc77faa]">{contactDetails.address}</span>
                  <span className="mt-1.5 block text-sm leading-6 text-[#f7f3e9]">{companyAddress}</span>
                </span>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div className={`fixed inset-0 z-[100] ${menuOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"}`} aria-hidden={!menuOpen}>
        <button
          className={`${focusRing} absolute inset-0 border-0 bg-black/70 opacity-0 backdrop-blur-lg transition-opacity duration-[250ms] ${menuOpen ? "opacity-100" : ""}`}
          onClick={() => setMenuOpen(false)}
          aria-label={copy.closeMenu}
        />
        <div className={`absolute inset-y-0 right-0 w-[min(90vw,430px)] border-l border-[#d8a75c52] bg-[#030b10] p-6 transition-transform duration-[350ms] ease-out ${menuOpen ? "translate-x-0" : "translate-x-[102%]"}`}>
          <div className="flex items-center justify-between">
            <DealLogo className="block h-auto w-[132px] text-[#d8a75c]" />
            <button className={`${focusRing} grid h-11 w-11 place-items-center rounded-full border border-[#d8a75c52] bg-transparent text-[#d8a75c]`} type="button" onClick={() => setMenuOpen(false)} aria-label={copy.closeMenu}>
              <X />
            </button>
          </div>
          <nav className="grid h-[calc(100%-70px)] content-center">
            {navigation.map((item, index) => (
              <a
                key={item.target}
                className={`${focusRing} grid min-h-16 grid-cols-[2rem_1fr_auto] items-center border-b border-[#d8a75c26] px-2.5 text-base uppercase`}
                href={homeNavigationHref(item.target, language)}
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-[0.65rem] text-[#d8a75c]">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
                <DirectionArrow size={17} />
              </a>
            ))}
          </nav>
        </div>
      </div>

      <main>
        <section id="home" data-hero className="relative isolate h-[clamp(600px,55vw,850px)] overflow-hidden border-b border-[#d8a75c52] bg-[#020a0f] max-[760px]:h-[820px]" aria-labelledby="hero-title">
          <div
            data-hero-media
            className={`absolute ${heroMediaPlacement} -z-[3] block aspect-[1672/941] w-[68%] scale-[1.015] overflow-hidden brightness-[.74] contrast-[1.14] saturate-[.72] sepia-[.1] [mask-image:linear-gradient(180deg,transparent_0%,#000_9%,#000_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,#000_9%,#000_88%,transparent_100%)] max-[760px]:h-[67%] max-[760px]:w-[115%] max-[760px]:opacity-80`}
          >
            <img
              className={`absolute inset-0 h-full w-full object-contain ${heroMediaObjectPlacement} transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${heroVideoVisible ? "scale-[1.025] opacity-0" : "scale-100 opacity-100"}`}
              src="/assets/img/azadi-clean.png"
              alt="Azadi Tower illuminated by the golden Tehran sunset"
            />
            <video
              className={`absolute inset-0 h-full w-full object-cover ${heroMediaObjectPlacement} transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${heroVideoVisible ? "scale-100 opacity-100" : "scale-[1.045] opacity-0"}`}
              src="/assets/iran-investment-campaign.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              onCanPlayThrough={revealHeroVideo}
            />
          </div>
          <div className={`pointer-events-none absolute inset-0 -z-[1] ${heroOverlay} max-[760px]:bg-[linear-gradient(180deg,#020a0f_0%,rgba(2,10,15,0.94)_22%,rgba(2,10,15,0.45)_52%,#02090e_78%,#02090e_100%)]`} />

          <div data-hero-scroll className={`absolute ${heroScrollPlacement} top-[38%] z-20 flex w-8 flex-col items-center text-[#f4f4f0c2] max-[1100px]:hidden`}>
            <span className={`w-[124px] whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.08em] ${isRtl ? "rotate-90" : "-rotate-90"}`}>{copy.scroll}</span>
            <i data-scroll-pulse className="mt-[58px] h-[75px] w-px bg-gradient-to-b from-[#d8a75c] to-[#d8a75c0f]" />
            <b className="relative mt-0 h-5 w-5 rounded-full border border-[#d8a75c8c] after:absolute after:left-1/2 after:top-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-[#edc77f] after:content-['']" />
          </div>

          <div data-hero-content className={`absolute ${heroContentPlacement} top-[clamp(132px,12.8vw,196px)] z-20 w-[min(43vw,670px)] max-[760px]:top-[130px] max-[760px]:w-[calc(100%-40px)]`}>
            <div data-hero-kicker><Kicker withLine>{copy.hero.kicker}</Kicker></div>
            <h1 id="hero-title" className="mt-[clamp(19px,1.7vw,27px)] max-w-[720px] overflow-hidden whitespace-nowrap text-[clamp(39px,3.92vw,62px)] font-bold uppercase leading-[0.995] text-[#f5f5f1] max-[760px]:whitespace-normal max-[760px]:text-[clamp(34px,10vw,46px)] max-[760px]:leading-[1.02]">
              <span data-hero-line className="block">{copy.hero.line1}</span>
              <span data-hero-line className="block">{copy.hero.line2}</span>
              <span data-hero-line className="block">{copy.hero.line3} <em className="not-italic text-[#d8a75c]">{copy.hero.emphasis1}</em></span>
              <span data-hero-line className="block"><em className="not-italic text-[#d8a75c]">{copy.hero.emphasis2}</em></span>
            </h1>
            <p data-hero-description className="mt-[clamp(24px,2.1vw,34px)] w-[min(27vw,420px)] text-[clamp(11px,1.02vw,16px)] font-light leading-[1.55] text-[#e2e5e5b3] max-[760px]:w-[min(88%,390px)] max-[760px]:text-xs">
              {copy.hero.description}
            </p>
          </div>

          <div data-hero-stats className={`absolute ${heroStatsPlacement} isolate bottom-[clamp(18px,1.7vw,28px)] z-30 grid h-[clamp(88px,8vw,124px)] w-[79%] grid-cols-4 items-center overflow-hidden rounded-[clamp(9px,0.8vw,13px)] border border-[#000000d9] bg-[linear-gradient(110deg,rgba(0,0,0,0.88),rgba(4,10,13,0.7)_48%,rgba(0,0,0,0.9))] shadow-[0_18px_58px_rgba(0,0,0,0.72),0_0_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.055),inset_0_0_38px_rgba(0,0,0,0.68)] backdrop-blur-[24px] before:pointer-events-none before:absolute before:-inset-12 before:z-0 before:bg-[radial-gradient(ellipse_at_15%_50%,rgba(0,0,0,0.98),transparent_48%),radial-gradient(ellipse_at_88%_42%,rgba(0,0,0,0.85),transparent_55%)] before:blur-2xl max-[1100px]:w-[82%] max-[760px]:bottom-4 max-[760px]:h-[184px] max-[760px]:w-[calc(100%-32px)] max-[760px]:grid-cols-2`} aria-label="DEAL at a glance">
            {statItems.map(({ value, counter, prefix, suffix, label, icon: Icon }, index) => (
              <article data-hero-stat key={label} className={`relative z-10 flex min-w-0 items-center gap-[clamp(15px,1.55vw,25px)] px-[clamp(24px,2.45vw,39px)] max-[1100px]:px-6 max-[760px]:gap-3 max-[760px]:px-3.5 ${index !== statItems.length - 1 ? "after:absolute after:right-0 after:top-1/2 after:h-[58px] after:w-px after:-translate-y-1/2 after:bg-gradient-to-b after:from-transparent after:via-[#000000e6] after:to-transparent after:shadow-[0_0_12px_rgba(0,0,0,0.95)] max-[760px]:after:h-[46px]" : ""} ${index === 1 ? "max-[760px]:after:hidden" : ""} ${index < 2 ? "max-[760px]:before:absolute max-[760px]:before:inset-x-3 max-[760px]:before:bottom-0 max-[760px]:before:h-px max-[760px]:before:bg-gradient-to-r max-[760px]:before:from-transparent max-[760px]:before:via-[#000000e6] max-[760px]:before:to-transparent" : ""}`}>
                <Icon className="h-[clamp(28px,2.45vw,39px)] w-[clamp(28px,2.45vw,39px)] shrink-0 text-[#edc77f] stroke-[1.6] max-[760px]:h-[25px] max-[760px]:w-[25px]" aria-hidden="true" />
                <div className="grid min-w-0 gap-[7px]">
                  <strong data-hero-stat-value data-counter-target={counter} data-counter-prefix={prefix ?? ""} data-counter-suffix={suffix ?? ""} className="whitespace-nowrap tabular-nums text-[clamp(18px,1.72vw,27px)] font-semibold leading-none text-[#f3f3ef] max-[760px]:text-lg">{value}</strong>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(8px,0.68vw,11px)] leading-[1.1] text-[#d2d5d594] max-[760px]:text-[8px]">{label}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="sectors" data-story-section className="relative overflow-hidden border-b border-[#d8a75c52] px-[6.25vw] pb-[clamp(48px,4.2vw,68px)] pt-[clamp(46px,4vw,64px)] max-[760px]:px-5 max-[760px]:pb-[42px] max-[760px]:pt-[46px]" aria-labelledby="sectors-title">
          <div className="grid min-h-[clamp(92px,8.1vw,128px)] grid-cols-[1.08fr_0.92fr] items-start gap-8 max-[760px]:min-h-[185px] max-[760px]:grid-cols-1 max-[760px]:gap-[15px]">
            <div data-story-copy>
              <Kicker>{copy.sectors.kicker}</Kicker>
              <h2 id="sectors-title" className="mt-[clamp(14px,1.2vw,19px)] text-[clamp(24px,2.08vw,33px)] font-semibold uppercase leading-[1.12] text-[#eeeeeb] max-[760px]:text-[27px]">
                {copy.sectors.titleLine1}<br />{copy.sectors.titleLine2}
              </h2>
            </div>
            <p data-story-copy className="mt-[clamp(23px,2.35vw,37px)] w-[min(29vw,450px)] text-[clamp(10px,0.88vw,14px)] font-light leading-[1.55] text-[#d4d7d794] max-[760px]:m-0 max-[760px]:w-full max-[760px]:text-[11px]">
              {copy.sectors.description}
            </p>
          </div>

          {displaySectors.length ? (
            <HomeSectorMosaic sectors={displaySectors} language={language} />
          ) : (
            <div className="rounded-[14px] border border-[#d8a75c3d] bg-[#050d12] p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
              <h3 className="m-0 text-base font-semibold text-[#f4f4f0]">{copy.sectors.emptyTitle}</h3>
              <p className="mx-auto mt-2 max-w-[520px] text-sm leading-7 text-[#d4d7d794]">{copy.sectors.emptyText}</p>
            </div>
          )}
        </section>

        <LatestNewsVerticalSlider articles={latestNews} language={language} />
        <IranProvinceExplorer language={language} />
        <DealCorporateSections language={language} partnerStories={partnerStories} teamMembers={teamMembers} partnerLogos={partnerLogos} />
      </main>

      <CollaborationRequestButton language={language} />

      <footer id="contact" data-story-section className="relative min-h-[clamp(190px,14.2vw,230px)] bg-[linear-gradient(105deg,#02090e,#030b10_72%,#041016)] px-[6.25vw] pt-[clamp(28px,2.2vw,36px)] max-[760px]:px-5 max-[760px]:pt-[42px]">
        <div data-story-copy className="grid min-h-[clamp(120px,9.35vw,150px)] grid-cols-[1.45fr_repeat(3,0.82fr)_1.05fr_1.55fr] gap-[clamp(22px,2.3vw,37px)] max-[1100px]:grid-cols-[1.2fr_repeat(3,0.75fr)_1.15fr] max-[760px]:grid-cols-2 max-[760px]:gap-x-[22px] max-[760px]:gap-y-8">
          <div data-story-item className="group max-[760px]:col-span-full">
            <DealStagedLogo data-footer-logo="true" className="block h-auto w-[clamp(105px,10.5vw,165px)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.018]" />
          </div>
          {copy.footer.groups.map((group, groupIndex) => (
            <div data-story-item className="flex flex-col items-start" key={group.title}>
              <h3 className="mb-[clamp(11px,0.95vw,15px)] mt-0 text-[clamp(8px,0.68vw,11px)] font-semibold uppercase tracking-[0.05em] text-[#e8e9e5] max-[760px]:text-[9px]">{group.title}</h3>
              {group.links.map((link, linkIndex) => (
                <a className={`${focusRing} mb-[clamp(6px,0.5vw,8px)] text-[clamp(8px,0.69vw,11px)] font-light leading-[1.15] text-[#cdd1d194] hover:text-[#edc77f] max-[760px]:text-[10px]`} key={link} href={groupIndex === 0 && linkIndex === 0 ? withLanguage("/about", language) : groupIndex === 0 && linkIndex === 3 ? withLanguage("/news", language) : withLanguage("/#home", language)}>
                  {link}
                </a>
              ))}
            </div>
          ))}
          <div data-story-item className="flex flex-col items-start max-[760px]:col-start-1">
            <h3 className="mb-[clamp(11px,0.95vw,15px)] mt-0 text-[clamp(8px,0.68vw,11px)] font-semibold uppercase tracking-[0.05em] text-[#e8e9e5] max-[760px]:text-[9px]">{copy.footer.contact}</h3>
            <p className="mb-[clamp(6px,0.5vw,8px)] mt-0 text-[clamp(8px,0.69vw,11px)] font-light leading-[1.35] text-[#cdd1d194] max-[760px]:text-[10px]">{companyAddress}</p>
            <a className={`${focusRing} mb-[clamp(6px,0.5vw,8px)] inline-flex items-center gap-1 text-[clamp(8px,0.69vw,11px)] font-light leading-[1.15] text-[#cdd1d194] hover:text-[#edc77f] max-[760px]:text-[10px]`} href={`mailto:${contactSettings.email}`} dir="ltr">
              <Mail size={12} /> {contactSettings.email}
            </a>
            <a className={`${focusRing} mb-[clamp(6px,0.5vw,8px)] text-[clamp(8px,0.69vw,11px)] font-light leading-[1.15] text-[#cdd1d194] hover:text-[#edc77f] max-[760px]:text-[10px]`} href={telHref(contactSettings.phonePrimary)} dir="ltr">{contactSettings.phonePrimary}</a>
            <div className="mt-0.5 flex gap-3 text-[#edc77f]">
              <a className={`${focusRing} grid min-w-[15px] place-items-center text-[11px] font-bold leading-none`} href="#" aria-label="LinkedIn">in</a>
              <a className={`${focusRing} grid min-w-[15px] place-items-center text-[11px] font-bold leading-none`} href="#" aria-label="X">X</a>
              <a className={`${focusRing} grid min-w-[15px] place-items-center text-[11px] font-bold leading-none`} href="#" aria-label="Instagram">ig</a>
              <a className={`${focusRing} grid min-w-[15px] place-items-center text-[11px] font-bold leading-none`} href="#" aria-label="YouTube">yt</a>
            </div>
          </div>
          <div data-story-item className="max-[1100px]:col-[2/-1] max-[1100px]:grid max-[1100px]:grid-cols-[0.7fr_1.3fr] max-[1100px]:items-center max-[1100px]:gap-4 max-[760px]:col-span-full max-[760px]:block">
            <h3 className="mb-[clamp(11px,0.95vw,15px)] mt-0 text-[clamp(8px,0.68vw,11px)] font-semibold uppercase tracking-[0.05em] text-[#e8e9e5] max-[1100px]:m-0 max-[760px]:mb-[9px] max-[760px]:text-[9px]">{copy.footer.stayUpdated}</h3>
            <p className="mb-[clamp(10px,0.9vw,14px)] mt-0 text-[clamp(8px,0.69vw,11px)] font-light leading-[1.15] text-[#cdd1d194] max-[1100px]:hidden max-[760px]:mb-[clamp(6px,0.5vw,8px)] max-[760px]:block max-[760px]:text-[10px]">{copy.footer.subscribe}</p>
            <form className="grid h-[clamp(36px,3vw,47px)] w-full grid-cols-[1fr_clamp(38px,3.05vw,48px)] overflow-hidden rounded-md border border-[#d8a75c4d] max-[760px]:h-11 max-[760px]:w-[min(100%,390px)]" onSubmit={(event) => event.preventDefault()}>
              <label className="sr-only" htmlFor="newsletter-email">{copy.footer.emailPlaceholder}</label>
              <input className={`${focusRing} min-w-0 border-0 bg-[#02090e80] px-3.5 text-[clamp(8px,0.7vw,11px)] text-[#e8e9e5] outline-0 placeholder:text-[#cdd1d16e]`} id="newsletter-email" type="email" placeholder={copy.footer.emailPlaceholder} />
              <button className={`${focusRing} grid place-items-center border-0 bg-[linear-gradient(110deg,#d29c4c,#efc77d)] text-[#091014]`} type="submit" aria-label={copy.footer.subscribeLabel}>
                <DirectionArrow className="w-[17px]" />
              </button>
            </form>
          </div>
        </div>
        <div className="flex min-h-[clamp(48px,4vw,64px)] items-center justify-between border-t border-[#d8a75c33] text-[clamp(8px,0.65vw,10px)] text-[#cdd1d173] max-[760px]:min-h-20 max-[760px]:flex-col max-[760px]:items-start max-[760px]:justify-center max-[760px]:gap-[13px] max-[760px]:py-5">
          <span>{copy.footer.copyright}</span>
          <div className="flex items-center gap-[clamp(15px,1.5vw,24px)]">
            <a className={focusRing} href="#">{copy.footer.privacy}</a>
            <i className="h-[13px] w-px bg-[#d8a75c40]" />
            <a className={focusRing} href="#">{copy.footer.terms}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
