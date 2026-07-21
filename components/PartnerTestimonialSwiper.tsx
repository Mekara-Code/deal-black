"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { A11y, Autoplay, EffectCreative, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export type PartnerStoryView = {
  id: string;
  name: string;
  tagline: string;
  quote: string;
  imageUrl: string;
};

type PartnerTestimonialSwiperProps = {
  stories: PartnerStoryView[];
  dir: "ltr" | "rtl";
  label: string;
};

const autoplayDelay = 5600;

export function PartnerTestimonialSwiper({ stories, dir, label }: PartnerTestimonialSwiperProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoplayProgressRef = useRef<HTMLSpanElement>(null);
  const autoplayTimeRef = useRef<HTMLTimeElement>(null);
  const isRtl = dir === "rtl";
  const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const curveDirection = isRtl ? -1 : 1;

  function updateAutoplayProgress(_swiper: SwiperType, timeLeft: number, progress: number) {
    const elapsedProgress = Math.max(0, Math.min(1, 1 - progress));
    const secondsLeft = Math.max(0, Math.ceil(timeLeft / 1000));

    if (autoplayProgressRef.current) {
      autoplayProgressRef.current.style.transform = `scaleX(${elapsedProgress})`;
    }

    if (autoplayTimeRef.current) {
      autoplayTimeRef.current.textContent = `00:${String(secondsLeft).padStart(2, "0")}`;
    }
  }

  function animateActiveStory(swiper = swiperRef.current) {
    const root = rootRef.current;

    if (!root || !swiper) return;

    const activeSlide = root.querySelector<HTMLElement>(".swiper-slide-active");

    if (!activeSlide) return;

    const curve = activeSlide.querySelector<SVGElement>("[data-story-curve]");
    const person = activeSlide.querySelector<HTMLElement>("[data-story-person]");
    const quoteMark = activeSlide.querySelector<SVGElement>("[data-story-quote-mark]");
    const quote = activeSlide.querySelector<HTMLElement>("[data-story-quote]");
    const identity = activeSlide.querySelector<HTMLElement>("[data-story-identity]");
    const targets = [curve, person, quoteMark, quote, identity].filter((target): target is HTMLElement | SVGElement => Boolean(target));

    if (!targets.length) return;

    timelineRef.current?.kill();
    gsap.killTweensOf(targets);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { clearProps: "all" });
      return;
    }

    gsap.set(curve, { autoAlpha: 0, scaleX: 0.76, y: 12, transformOrigin: isRtl ? "right center" : "left center" });
    gsap.set(person, { autoAlpha: 0, y: 44, scale: 0.88, rotation: isRtl ? 5 : -5, transformOrigin: "center bottom" });
    gsap.set(quoteMark, { autoAlpha: 0, scale: 0.5, rotation: isRtl ? -18 : 18, transformOrigin: "center" });
    gsap.set(quote, { autoAlpha: 0, y: 20 });
    gsap.set(identity, { autoAlpha: 0, y: 14 });

    timelineRef.current = gsap.timeline({ defaults: { ease: "power3.out" } })
      .to(curve, { autoAlpha: 1, scaleX: 1, y: 0, duration: 0.48 })
      .to(person, { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.64, ease: "back.out(1.45)" }, "<0.08")
      .to(quoteMark, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.34, ease: "back.out(1.7)" }, "<0.14")
      .to(quote, { autoAlpha: 1, y: 0, duration: 0.46 }, "<0.08")
      .to(identity, { autoAlpha: 1, y: 0, duration: 0.36 }, "<0.1");
  }

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          animateActiveStory();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      timelineRef.current?.kill();
    };
  }, [stories]);

  return (
    <div ref={rootRef} className="relative mx-auto w-[min(43vw,640px)] px-[clamp(28px,3vw,48px)] max-[760px]:w-full max-[760px]:px-0">
      <div data-partner-arc-viewport className="relative min-h-[clamp(175px,16.2vw,250px)] overflow-hidden [clip-path:ellipse(96%_91%_at_50%_50%)] max-[760px]:min-h-[205px] max-[760px]:[clip-path:ellipse(100%_96%_at_50%_50%)]">
        <Swiper
          // EffectCreative calculates slide offsets incorrectly when Swiper itself is RTL.
          // Keep the motion engine LTR and mirror only the story content and controls below.
          key={`partner-story-${dir}`}
          dir="ltr"
          modules={[Autoplay, EffectCreative, Keyboard, A11y]}
          effect="creative"
          loop={stories.length > 1}
          autoplay={stories.length > 1 ? { delay: autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
          creativeEffect={{
            limitProgress: 2,
            prev: {
              translate: [`${-112 * curveDirection}%`, "14%", -180],
              rotate: [0, 0, -8 * curveDirection],
              scale: 0.8,
              opacity: 0,
            },
            next: {
              translate: [`${112 * curveDirection}%`, "14%", -180],
              rotate: [0, 0, 8 * curveDirection],
              scale: 0.8,
              opacity: 0,
            },
          }}
          speed={720}
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          slidesPerView={1}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            requestAnimationFrame(() => animateActiveStory(swiper));
          }}
          onSlideChangeTransitionStart={(swiper) => {
            requestAnimationFrame(() => animateActiveStory(swiper));
          }}
          onAutoplayTimeLeft={updateAutoplayProgress}
          className="h-full w-full overflow-visible [&_.swiper-slide]:h-auto [&_.swiper-slide]:shrink-0 [&_.swiper-wrapper]:box-content [&_.swiper-wrapper]:flex"
          aria-label={label}
        >
        {stories.map((story) => (
          <SwiperSlide key={story.id}>
            <figure dir={dir} className="relative m-0 min-h-[clamp(175px,16.2vw,250px)] overflow-visible pb-[clamp(18px,1.55vw,25px)] pt-[clamp(16px,1.3vw,21px)] max-[760px]:min-h-[205px]">
              <svg data-story-curve className="pointer-events-none absolute inset-x-0 bottom-[6px] z-0 h-[86%] w-full overflow-visible" viewBox="0 0 640 180" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d={isRtl ? "M624 129C493 43 353 20 205 43C114 58 59 96 16 141" : "M16 129C147 43 287 20 435 43C526 58 581 96 624 141"} stroke="#edc77f" strokeOpacity=".56" strokeWidth="1.15" />
                <path d={isRtl ? "M606 154C484 93 371 81 257 96C157 109 91 130 37 165" : "M34 154C156 93 269 81 383 96C483 109 549 130 603 165"} stroke="#d8a75c" strokeOpacity=".24" strokeWidth=".75" />
              </svg>

              <div
                data-story-person
                className={`absolute ${isRtl ? "left-[2%]" : "right-[2%]"} bottom-[clamp(4px,0.45vw,7px)] z-10 h-[clamp(154px,13.6vw,210px)] w-[35%] overflow-hidden rounded-[46%_54%_52%_48%/42%_44%_56%_58%] [clip-path:ellipse(48%_50%_at_50%_50%)] max-[760px]:h-[174px] max-[760px]:w-[37%]`}
                aria-hidden="true"
              >
                {story.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="h-full w-full object-cover object-top brightness-95 contrast-[1.04] saturate-[.9]" src={story.imageUrl} alt="" />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(244,244,240,0.18)_0_11%,transparent_11.7%),radial-gradient(ellipse_at_50%_64%,rgba(216,167,92,0.28)_0_28%,transparent_28.7%)]" />
                )}
                <div className={`absolute inset-0 ${isRtl ? "bg-[linear-gradient(90deg,rgba(3,11,16,0.9)_0%,transparent_60%)]" : "bg-[linear-gradient(270deg,rgba(3,11,16,0.9)_0%,transparent_60%)]"}`} />
              </div>

              <Quote data-story-quote-mark className={`absolute ${isRtl ? "right-[clamp(14px,1.1vw,18px)]" : "left-[clamp(14px,1.1vw,18px)]"} top-[clamp(18px,1.4vw,23px)] z-10 fill-current text-[#edc77f]`} size={28} strokeWidth={1.5} aria-hidden="true" />
              <blockquote data-story-quote className={`relative z-10 m-0 w-[61%] pt-[clamp(50px,4vw,64px)] text-[clamp(10px,0.86vw,13px)] font-light leading-[1.6] text-[#e0e2e0d6] max-[760px]:w-[64%] max-[760px]:pt-[54px] max-[760px]:text-[11px] ${isRtl ? "ml-auto pr-[clamp(14px,1.1vw,18px)] text-right" : "mr-auto pl-[clamp(14px,1.1vw,18px)] text-left"}`}>
                {story.quote}
              </blockquote>
              <figcaption data-story-identity className={`relative z-10 mt-[clamp(14px,1.2vw,19px)] grid w-[61%] gap-1 max-[760px]:w-[64%] ${isRtl ? "ml-auto pr-[clamp(14px,1.1vw,18px)] text-right" : "mr-auto pl-[clamp(14px,1.1vw,18px)] text-left"}`}>
                <strong className="text-[clamp(9px,0.72vw,11px)] font-medium text-[#edc77f]">{story.name}</strong>
                {story.tagline ? <span className="text-[clamp(8px,0.66vw,10px)] text-[#e0e2e083]">{story.tagline}</span> : null}
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
        </Swiper>
      </div>

      {stories.length > 1 ? (
        <div className="mt-2 flex items-center gap-3 px-[clamp(10px,1.1vw,18px)] text-[#edc77f] max-[760px]:px-5" aria-hidden="true">
          <span className="h-px min-w-0 flex-1 overflow-hidden bg-[#d8a75c26]">
            <span ref={autoplayProgressRef} className={`block h-full w-full scale-x-0 bg-[#edc77f] ${isRtl ? "origin-right" : "origin-left"}`} />
          </span>
          <time ref={autoplayTimeRef} className="w-9 shrink-0 text-right text-[9px] font-medium tabular-nums tracking-[0.08em] text-[#edc77fba]">00:06</time>
        </div>
      ) : null}

      {stories.length > 1 ? (
        <>
          <button className={`absolute top-[calc(50%-16px)] z-20 grid h-11 w-11 place-items-center rounded-full text-[#d8a75c] transition duration-200 hover:scale-105 hover:bg-[#d8a75c1c] hover:text-[#f4d99d] focus-visible:bg-[#d8a75c1c] max-[760px]:top-[calc(50%-10px)] ${isRtl ? "right-0" : "left-0"}`} type="button" onClick={() => swiperRef.current?.slidePrev()} aria-label={`${label} previous`}>
            <PreviousIcon size={23} strokeWidth={1.35} />
          </button>
          <button className={`absolute top-[calc(50%-16px)] z-20 grid h-11 w-11 place-items-center rounded-full text-[#d8a75c] transition duration-200 hover:scale-105 hover:bg-[#d8a75c1c] hover:text-[#f4d99d] focus-visible:bg-[#d8a75c1c] max-[760px]:top-[calc(50%-10px)] ${isRtl ? "left-0" : "right-0"}`} type="button" onClick={() => swiperRef.current?.slideNext()} aria-label={`${label} next`}>
            <NextIcon size={23} strokeWidth={1.35} />
          </button>
        </>
      ) : null}
    </div>
  );
}
