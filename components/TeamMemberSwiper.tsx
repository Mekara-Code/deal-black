"use client";

import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { TeamMemberPortrait } from "@/components/TeamMemberPortrait";

export type TeamMemberView = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
};

type TeamMemberSwiperProps = {
  members: TeamMemberView[];
  dir: "ltr" | "rtl";
  previousLabel: string;
  nextLabel: string;
};

export function TeamMemberSwiper({ members, dir, previousLabel, nextLabel }: TeamMemberSwiperProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isRtl = dir === "rtl";
  const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const animateMembers = () => {
      const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-team-card]"));

      if (!cards.length) return;

      timelineRef.current?.kill();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }

      gsap.set(cards, { autoAlpha: 0, y: 68, rotationX: -14, scale: 0.96, transformOrigin: "center bottom" });
      timelineRef.current = gsap.timeline({ defaults: { ease: "power3.out" } }).to(cards, {
        autoAlpha: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.8,
        stagger: { each: 0.12, from: "start" },
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          animateMembers();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      timelineRef.current?.kill();
    };
  }, [members]);

  return (
    <div ref={rootRef} className="relative min-w-0 pb-14 max-[760px]:pb-14">
      <Swiper
        dir={dir}
        modules={[Pagination, Keyboard, A11y]}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        slidesPerView={1.5}
        spaceBetween={14}
        breakpoints={{
          520: { slidesPerView: 2.5, spaceBetween: 14 },
          760: { slidesPerView: 3.5, spaceBetween: 14 },
          1100: { slidesPerView: 3.5, spaceBetween: 16 },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="overflow-visible [&_.swiper-pagination]:!bottom-[-1.25rem] [&_.swiper-pagination]:!top-auto [&_.swiper-pagination]:flex [&_.swiper-pagination]:items-center [&_.swiper-pagination]:justify-center [&_.swiper-pagination]:gap-2 [&_.swiper-pagination-bullet-active]:!w-6 [&_.swiper-pagination-bullet-active]:!rounded-full [&_.swiper-pagination-bullet-active]:!border-[#edc77f] [&_.swiper-pagination-bullet-active]:!bg-[#edc77f] [&_.swiper-pagination-bullet-active]:!shadow-[0_0_18px_rgba(237,199,127,0.38)] [&_.swiper-pagination-bullet]:!m-0 [&_.swiper-pagination-bullet]:!h-[5px] [&_.swiper-pagination-bullet]:!w-[5px] [&_.swiper-pagination-bullet]:!border [&_.swiper-pagination-bullet]:!border-[#d8a75c80] [&_.swiper-pagination-bullet]:!bg-[#d8a75c33] [&_.swiper-pagination-bullet]:!opacity-100 [&_.swiper-pagination-bullet]:!transition-all [&_.swiper-pagination-bullet]:!duration-300 [&_.swiper-slide]:h-auto [&_.swiper-slide]:shrink-0 [&_.swiper-wrapper]:box-content [&_.swiper-wrapper]:flex"
        aria-label="DEAL leadership team"
      >
        {members.map((member) => (
          <SwiperSlide key={member.id}>
            <article data-team-card className="group relative h-[clamp(225px,20vw,304px)] overflow-hidden rounded-[clamp(7px,0.7vw,11px)] bg-[#071015] shadow-[0_22px_50px_rgba(0,0,0,0.25)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_65px_rgba(0,0,0,0.42)] max-[760px]:h-[286px]">
              <TeamMemberPortrait
                src={member.imageUrl}
                alt={member.name}
                className="absolute inset-0 h-full w-full object-cover object-top brightness-[.78] contrast-[1.06] saturate-[.86] transition duration-700 group-hover:scale-[1.06] group-hover:brightness-95 group-hover:saturate-100"
                fallbackClassName="absolute inset-0"
                iconSize={34}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,rgba(3,11,16,0.28)_44%,rgba(3,11,16,0.96)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 z-10 px-[clamp(14px,1.25vw,20px)] pb-[clamp(15px,1.3vw,21px)]">
                <p className="m-0 text-[clamp(9px,0.7vw,11px)] font-medium uppercase tracking-[0.08em] text-[#edc77f]">{member.role}</p>
                <h3 className="mt-2 text-[clamp(15px,1.25vw,20px)] font-semibold leading-[1.1] text-[#f4f4f0]">{member.name}</h3>
                <span className={`mt-3 inline-flex items-center gap-1.5 text-[9px] text-[#f0f0e0a6] transition duration-300 ${isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
                  {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                  DEAL
                </span>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      {members.length > 1 ? (
        <div className={`pointer-events-none absolute bottom-0 ${isRtl ? "left-0" : "right-0"} z-20 flex gap-2 max-[760px]:hidden`}>
          <button className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-[#d8a75c62] bg-[#02090e99] text-[#edc77f] transition hover:bg-[#edc77f] hover:text-[#071016]" type="button" onClick={() => swiperRef.current?.slidePrev()} aria-label={previousLabel}>
            <PreviousIcon size={16} />
          </button>
          <button className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-[#d8a75c62] bg-[#02090e99] text-[#edc77f] transition hover:bg-[#edc77f] hover:text-[#071016]" type="button" onClick={() => swiperRef.current?.slideNext()} aria-label={nextLabel}>
            <NextIcon size={16} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
