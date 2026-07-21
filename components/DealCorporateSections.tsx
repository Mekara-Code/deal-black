"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  Compass,
  Landmark,
  MapPin,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { PartnerTestimonialSwiper, type PartnerStoryView } from "@/components/PartnerTestimonialSwiper";
import { TeamMemberSwiper, type TeamMemberView } from "@/components/TeamMemberSwiper";
import { openCollaborationRequest } from "@/lib/collaborationRequest";
import { corporateCopy, languageDirection, withLanguage, type LanguageCode } from "@/lib/i18n";

type Benefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const benefits: Benefit[] = [
  {
    title: "Strategic Location",
    description: "Gateway between global markets across Asia, Europe & Middle East.",
    icon: MapPin,
  },
  {
    title: "Strong Government Support",
    description: "Pro-investment policies and incentives for foreign investors.",
    icon: Landmark,
  },
  {
    title: "Skilled Workforce",
    description: "Highly educated and dynamic human capital.",
    icon: UsersRound,
  },
  {
    title: "Growing Economy",
    description: "Resilient growth and expanding opportunities across sectors.",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    title: "Competitive Advantage",
    description: "Resource-rich economy with a favorable investment climate.",
    icon: Compass,
  },
  {
    title: "Proven Track Record",
    description: "A legacy of successful partnerships and long-term value creation.",
    icon: ShieldCheck,
  },
];

const benefitIcons = [MapPin, Landmark, UsersRound, ChartNoAxesColumnIncreasing, Compass, ShieldCheck];

export type PartnerLogoView = {
  id: string;
  name: string;
  imageUrl: string;
  websiteUrl: string;
};

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#edc77f]";
const sprite = "bg-[image:url('/assets/img/deal-reference-v2.png')] bg-no-repeat bg-[length:100vw_auto]";

function Kicker({ children }: { children: string }) {
  return (
    <p className="m-0 text-[clamp(9px,0.72vw,11px)] font-semibold uppercase leading-[1.2] tracking-[0.1em] text-[#d8a75c]">
      {children}
    </p>
  );
}

function CorporateArrow({ direction = "right" }: { direction?: "left" | "right" }) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  const hoverMovement = direction === "left" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5";

  return (
    <span className={`inline-grid h-[clamp(28px,2.35vw,37px)] w-[clamp(28px,2.35vw,37px)] shrink-0 place-items-center rounded-full border border-[#d8a75c8a] text-[#edc77f] transition duration-200 ${hoverMovement} group-hover:bg-[#edc77f] group-hover:text-[#081014]`}>
      <Icon size={17} strokeWidth={1.7} />
    </span>
  );
}

function OutlineLink({ href, children, direction = "right" }: { href: string; children: string; direction?: "left" | "right" }) {
  return (
    <a className={`${focusRing} group inline-flex items-center gap-[clamp(12px,1.25vw,20px)] text-[clamp(9px,0.72vw,11px)] font-semibold uppercase leading-none tracking-[0.06em] text-[#edc77f]`} href={href}>
      {children} <CorporateArrow direction={direction} />
    </a>
  );
}

export function DealCorporateSections({ language, partnerStories, teamMembers, partnerLogos }: { language: LanguageCode; partnerStories: PartnerStoryView[]; teamMembers: TeamMemberView[]; partnerLogos: PartnerLogoView[] }) {
  const copy = corporateCopy[language];
  const dir = languageDirection(language);
  const isRtl = dir === "rtl";
  const arrowDirection = dir === "rtl" ? "left" : "right";
  const previousLeadershipLabel = language === "fa" ? "پروفایل قبلی رهبری" : language === "ar" ? "الملف القيادي السابق" : "Previous leadership profile";
  const partnersBackground = isRtl
    ? "bg-[radial-gradient(circle_at_82%_36%,rgba(17,29,32,0.22),transparent_31rem),linear-gradient(260deg,#020a0f,#030b10_72%,#041016)]"
    : "bg-[radial-gradient(circle_at_18%_36%,rgba(17,29,32,0.22),transparent_31rem),linear-gradient(100deg,#020a0f,#030b10_72%,#041016)]";
  const benefitItems: Benefit[] = copy.benefits.map(([title, description], index) => ({
    title,
    description,
    icon: benefitIcons[index] ?? ShieldCheck,
  }));

  return (
    <>
      <section id="opportunities" data-story-section className="relative grid h-[clamp(360px,31.1vw,500px)] grid-cols-[48%_52%] overflow-hidden border-b border-[#d8a75c52] bg-[#030b10] max-[1100px]:grid-cols-[46%_54%] max-[760px]:h-auto max-[760px]:grid-cols-1" aria-labelledby="corporate-why-title">
        <div
          data-story-visual
          className={`${sprite} relative h-full w-full bg-[position:-1.1vw_-91.37vw] brightness-[.84] contrast-[1.08] saturate-[.9] after:block after:h-full after:w-full after:bg-[linear-gradient(90deg,transparent_0%,rgba(3,11,16,0.08)_72%,rgba(3,11,16,0.42)_100%),linear-gradient(180deg,transparent_0%,rgba(3,11,16,0.18)_100%)] after:content-[''] max-[760px]:h-[min(66vw,360px)] max-[760px]:bg-[length:214vw_auto] max-[760px]:bg-[position:-2.4vw_-195.3vw]`}
          role="img"
          aria-label="Business leaders meeting in a Tehran office at sunset"
        />

        <div data-story-copy className="px-[5.45vw] py-[clamp(38px,3.45vw,55px)] pr-[6.15vw] max-[1100px]:px-[4vw] max-[760px]:px-5 max-[760px]:py-[42px] max-[760px]:pb-10">
          <Kicker>{copy.why.kicker}</Kicker>
          <h2 id="corporate-why-title" className="mt-[clamp(14px,1.1vw,18px)] text-[clamp(26px,2.08vw,33px)] font-medium uppercase leading-[1.12] text-[#f2f1ed] max-[760px]:text-[26px]">
            {copy.why.titleLine1}<br />
            {copy.why.titleLine2}
          </h2>

          <div className="mt-[clamp(24px,2.25vw,36px)] grid grid-cols-2 gap-x-[clamp(28px,3.15vw,50px)] gap-y-[clamp(20px,1.75vw,28px)] max-[1100px]:gap-x-[22px] max-[1100px]:gap-y-[18px] max-[760px]:mt-7 max-[760px]:gap-x-[18px] max-[760px]:gap-y-[22px] max-[480px]:grid-cols-1">
            {benefitItems.map(({ title, description, icon: Icon }) => (
              <article data-story-item className="grid grid-cols-[clamp(30px,2.55vw,40px)_1fr] items-start gap-[clamp(11px,1vw,16px)] max-[760px]:grid-cols-[31px_1fr]" key={title}>
                <span className="grid place-items-start text-[#edc77f]" aria-hidden="true">
                  <Icon size={29} strokeWidth={1.45} />
                </span>
                <div>
                  <h3 className="m-0 text-[clamp(11px,0.93vw,14px)] font-semibold leading-[1.2] text-[#f0f0ec]">{title}</h3>
                  <p className="mt-1.5 max-w-60 text-[clamp(9px,0.72vw,11px)] font-light leading-[1.45] text-[#d1d4d494] max-[760px]:max-w-none max-[760px]:text-[10px]">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about-us" data-story-section className="relative grid min-h-[clamp(360px,29vw,470px)] grid-cols-[32%_minmax(0,1fr)] items-center gap-[clamp(28px,3.5vw,56px)] overflow-hidden border-b border-[#d8a75c52] bg-[radial-gradient(circle_at_72%_36%,rgba(22,36,39,0.18),transparent_30rem),linear-gradient(100deg,#020a0f,#030b10_78%,#041016)] px-[6.25vw] py-[clamp(40px,3.6vw,58px)] max-[1100px]:grid-cols-[31%_minmax(0,1fr)] max-[760px]:block max-[760px]:min-h-0 max-[760px]:px-5 max-[760px]:py-11 max-[760px]:pb-[38px]" aria-labelledby="corporate-leadership-title">
        <div data-story-copy>
          <Kicker>{copy.leadership.kicker}</Kicker>
          <h2 id="corporate-leadership-title" className="mt-[clamp(14px,1.1vw,18px)] text-[clamp(26px,2.08vw,33px)] font-medium uppercase leading-[1.12] text-[#f2f1ed] max-[760px]:text-[26px]">
            {copy.leadership.titleLine1}<br />
            {copy.leadership.titleLine2}
          </h2>
          <p className="mt-[clamp(16px,1.25vw,20px)] w-[min(24vw,360px)] text-[clamp(10px,0.78vw,12px)] font-light leading-[1.55] text-[#d4d7d794] max-[760px]:w-[min(100%,390px)] max-[760px]:text-[11px]">
            {copy.leadership.description}
          </p>
          <a className={`${focusRing} group mt-[clamp(22px,2.05vw,33px)] inline-flex min-h-[clamp(34px,2.8vw,44px)] items-center gap-[clamp(12px,1.25vw,20px)] rounded-full border border-[#d8a75c85] ps-[clamp(14px,1.15vw,18px)] text-[clamp(9px,0.72vw,11px)] font-semibold uppercase leading-none tracking-[0.06em] text-[#f4f4f0c7]`} href={withLanguage("/team", language)}>
            {copy.leadership.cta} <CorporateArrow direction={arrowDirection} />
          </a>
        </div>

        {teamMembers.length ? (
          <div className="min-w-0 max-[760px]:mt-8">
            <TeamMemberSwiper members={teamMembers} dir={dir} previousLabel={previousLeadershipLabel} nextLabel={copy.leadership.next} />
          </div>
        ) : null}
      </section>

      <section id="insights" data-story-section className={`relative grid h-[clamp(280px,21.9vw,350px)] grid-cols-[52%_48%] gap-[3.2vw] overflow-hidden border-b border-[#d8a75c52] ${partnersBackground} px-[6.25vw] pt-[clamp(32px,2.45vw,40px)] max-[1100px]:grid-cols-[49%_51%] max-[1100px]:gap-[2vw] max-[760px]:block max-[760px]:h-auto max-[760px]:px-5 max-[760px]:py-[42px] max-[760px]:pb-9`} aria-labelledby="corporate-partners-title">
        <div data-story-copy className="min-w-0">
          <Kicker>{copy.partners.kicker}</Kicker>
          <h2 id="corporate-partners-title" className="mt-[clamp(14px,1.1vw,18px)] text-[clamp(26px,2.08vw,33px)] font-medium uppercase leading-[1.12] text-[#f2f1ed] max-[760px]:text-[26px]">
            {copy.partners.titleLine1}<br />
            {copy.partners.titleLine2}
          </h2>

          {partnerLogos.length ? (
            <Swiper
              dir={dir}
              modules={[A11y, Keyboard]}
              keyboard={{ enabled: true }}
              a11y={{ enabled: true }}
              slidesPerView="auto"
              spaceBetween={28}
              className="mt-[clamp(36px,3.45vw,55px)] max-[760px]:mt-7 [&_.swiper-slide]:!w-auto [&_.swiper-slide]:shrink-0 [&_.swiper-wrapper]:box-content [&_.swiper-wrapper]:flex [&_.swiper-wrapper]:items-center"
              aria-label={copy.partners.carouselLabel}
            >
              {partnerLogos.map((logo) => (
                <SwiperSlide key={logo.id}>
                  {logo.websiteUrl ? (
                    <a className={`${focusRing} grid h-[clamp(24px,2.35vw,36px)] w-[clamp(74px,7.4vw,118px)] place-items-center`} href={logo.websiteUrl} target="_blank" rel="noreferrer" aria-label={logo.name}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="max-h-full max-w-full object-contain grayscale brightness-0 invert opacity-65 transition duration-200 hover:opacity-100" src={logo.imageUrl} alt={logo.name} />
                    </a>
                  ) : (
                    <span className="grid h-[clamp(24px,2.35vw,36px)] w-[clamp(74px,7.4vw,118px)] place-items-center" aria-label={logo.name}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="max-h-full max-w-full object-contain grayscale brightness-0 invert opacity-65" src={logo.imageUrl} alt={logo.name} />
                    </span>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
        </div>

        {partnerStories.length ? (
          <div className="relative pt-[clamp(14px,1.45vw,23px)] max-[760px]:pt-8">
            <PartnerTestimonialSwiper stories={partnerStories} dir={dir} label={copy.partners.carouselLabel} />
          </div>
        ) : null}
      </section>

      <section data-story-section className="grid h-[clamp(140px,11.3vw,180px)] grid-cols-[35.4%_64.6%] overflow-hidden border-b border-[#d8a75c52] bg-[#030b10] max-[760px]:h-auto max-[760px]:grid-cols-1" aria-labelledby="corporate-cta-title">
        <div
          data-story-visual
          className={`${sprite} relative h-full bg-[position:0_-166.92vw] brightness-[.8] contrast-[1.08] saturate-[.88] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent_0%,rgba(3,11,16,0.12)_70%,#030b10_100%)] after:content-[''] max-[760px]:h-28 max-[760px]:bg-[length:282.5vw_auto] max-[760px]:bg-[position:0_-471.6vw]`}
          role="img"
          aria-label="Business partners shaking hands"
        />
        <div data-story-copy className="flex min-w-0 items-center justify-between gap-8 bg-[radial-gradient(circle_at_28%_52%,rgba(216,167,92,0.08),transparent_19rem),linear-gradient(90deg,#030b10,#040c11)] pr-[6.25vw] max-[760px]:grid max-[760px]:gap-6 max-[760px]:px-5 max-[760px]:py-[34px] max-[760px]:pb-9">
          <div>
            <p className="m-0 text-[clamp(9px,0.72vw,11px)] font-semibold uppercase leading-[1.2] tracking-[0.1em] text-[#edc77f]">{copy.cta.kicker}</p>
            <h2 id="corporate-cta-title" className="mt-[clamp(14px,1.1vw,18px)] text-[clamp(26px,2.08vw,33px)] font-medium uppercase leading-[1.12] text-[#f2f1ed] max-[760px]:text-[26px]">
              {copy.cta.titleLine1}<br />
              {copy.cta.titleLine2}
            </h2>
          </div>
          <button className={`${focusRing} group inline-flex min-h-[clamp(38px,3.15vw,50px)] items-center gap-[clamp(12px,1.25vw,20px)] whitespace-nowrap rounded-full border border-[#d8a75c8c] ps-[clamp(18px,1.55vw,25px)] text-[clamp(9px,0.72vw,11px)] font-semibold uppercase leading-none tracking-[0.06em] text-[#f1f1ed] max-[760px]:w-fit`} type="button" onClick={openCollaborationRequest}>
            {copy.cta.action} <CorporateArrow direction={arrowDirection} />
          </button>
        </div>
      </section>
    </>
  );
}
