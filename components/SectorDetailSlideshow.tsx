"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type Slide = {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
};

type SectorDetailSlideshowProps = {
  id: string;
  slides: Slide[];
};

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#edc77f]";

export function SectorDetailSlideshow({ id, slides }: SectorDetailSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const readySlides = slides.filter((slide) => slide.url.trim());

  if (!readySlides.length) {
    return null;
  }

  const prevClass = `sector-slide-prev-${id}`;
  const nextClass = `sector-slide-next-${id}`;

  return (
    <div className="relative overflow-hidden rounded-[22px] shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
      <Swiper
        modules={[Navigation, Pagination, Keyboard, A11y]}
        navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
        pagination={readySlides.length > 1 ? { clickable: true } : false}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-[min(58vw,520px)] min-h-[280px] cursor-pointer [&_.swiper-pagination]:!absolute [&_.swiper-pagination]:!bottom-5 [&_.swiper-pagination]:!left-1/2 [&_.swiper-pagination]:!top-auto [&_.swiper-pagination]:!z-30 [&_.swiper-pagination]:!flex [&_.swiper-pagination]:!w-auto [&_.swiper-pagination]:!-translate-x-1/2 [&_.swiper-pagination]:items-center [&_.swiper-pagination]:justify-center [&_.swiper-pagination]:gap-2.5 [&_.swiper-pagination-bullet-active]:!w-8 [&_.swiper-pagination-bullet-active]:!bg-[#edc77f] [&_.swiper-pagination-bullet-active]:!shadow-[0_0_18px_rgba(237,199,127,0.34)] [&_.swiper-pagination-bullet]:!m-0 [&_.swiper-pagination-bullet]:!block [&_.swiper-pagination-bullet]:!h-2.5 [&_.swiper-pagination-bullet]:!w-2.5 [&_.swiper-pagination-bullet]:!shrink-0 [&_.swiper-pagination-bullet]:!rounded-full [&_.swiper-pagination-bullet]:!border-0 [&_.swiper-pagination-bullet]:!bg-[#edc77f66] [&_.swiper-pagination-bullet]:!opacity-100 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300 [&_.swiper-slide]:shrink-0 [&_.swiper-wrapper]:box-content [&_.swiper-wrapper]:flex"
      >
        {readySlides.map((slide, index) => {
          const title = slide.alt?.trim();
          const caption = slide.caption?.trim();
          const isActive = index === activeIndex;

          return (
            <SwiperSlide key={slide.id}>
              <figure className="relative m-0 h-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={`h-full w-full object-cover brightness-[.84] contrast-[1.08] saturate-[.9] transition duration-[1200ms] ease-out ${isActive ? "scale-100" : "scale-[1.035]"}`} src={slide.url} alt={title ?? ""} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,rgba(2,9,14,0.36)_58%,rgba(2,9,14,0.9)_100%)]" />
                {title || caption ? (
                  <figcaption className="pointer-events-none absolute bottom-14 left-0 right-0 z-20 max-h-[calc(100%-5.5rem)] overflow-hidden px-6 text-white sm:px-9" dir="auto">
                    <div className="grid max-w-[760px] gap-2 overflow-hidden">
                      {title ? (
                        <strong className={`block max-w-full transform-gpu overflow-hidden text-[clamp(18px,2.1vw,34px)] font-semibold uppercase leading-[1.08] tracking-[-0.03em] text-[#f4f4f0] transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(.22,1,.36,1)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] ${isActive ? "translate-y-0 opacity-100 blur-0 delay-100" : "translate-y-7 opacity-0 blur-sm delay-0"}`}>
                          {title}
                        </strong>
                      ) : null}
                      {caption ? (
                        <span className={`block max-w-[620px] transform-gpu overflow-hidden text-sm font-light leading-6 text-[#e2e5e5cc] transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(.22,1,.36,1)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:text-base ${isActive ? "translate-y-0 opacity-100 blur-0 delay-300" : "translate-y-5 opacity-0 blur-sm delay-0"}`}>
                          {caption}
                        </span>
                      ) : null}
                    </div>
                  </figcaption>
                ) : null}
              </figure>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {readySlides.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-5 top-1/2 z-10 flex -translate-y-1/2 justify-between">
          <button className={`${focusRing} ${prevClass} pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-[#d8a75c85] bg-[#02090e99] text-[#edc77f] backdrop-blur transition hover:bg-[#edc77f] hover:text-[#081014]`} type="button" aria-label="Previous slide">
            <ArrowLeft data-swiper-directional-arrow size={18} />
          </button>
          <button className={`${focusRing} ${nextClass} pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-[#d8a75c85] bg-[#02090e99] text-[#edc77f] backdrop-blur transition hover:bg-[#edc77f] hover:text-[#081014]`} type="button" aria-label="Next slide">
            <ArrowRight data-swiper-directional-arrow size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
