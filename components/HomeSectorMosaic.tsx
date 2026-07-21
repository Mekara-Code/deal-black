"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { A11y, Autoplay, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { languageDirection, withLanguage, type LanguageCode } from "@/lib/i18n";

export type HomeSector = {
  name: string;
  description: string;
  iconName: string;
  imageUrl: string;
  mediaClass: string;
  slug: string;
  cta: string;
  categories?: string[];
  contentBlocks?: number;
};

type HomeSectorMosaicProps = {
  sectors: HomeSector[];
  language: LanguageCode;
};

type SectorCardProps = {
  sector: HomeSector;
  language: LanguageCode;
  isRtl: boolean;
};

function sectorCategory(sector: HomeSector) {
  return sector.categories?.find((category) => category.trim()) ?? "";
}

function SectorMedia({ sector }: { sector: HomeSector }) {
  if (sector.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="absolute inset-0 h-full w-full object-cover brightness-[.73] contrast-[1.08] saturate-[.82] transition duration-700 ease-out group-hover:scale-[1.08] group-hover:brightness-[.88] group-hover:saturate-100 group-focus-visible:scale-[1.08] group-focus-visible:brightness-[.88]"
        src={sector.imageUrl}
        alt=""
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={[
        "absolute inset-0 bg-[image:url('/assets/img/deal-reference-v2.png')] bg-[length:100vw_auto] bg-no-repeat brightness-[.73] contrast-[1.08] saturate-[.82] transition duration-700 ease-out group-hover:scale-[1.08] group-hover:brightness-[.88] group-hover:saturate-100 group-focus-visible:scale-[1.08] group-focus-visible:brightness-[.88] max-[760px]:bg-[length:1728px_auto]",
        sector.mediaClass,
      ].join(" ")}
      aria-hidden="true"
    />
  );
}

function DiamondSectorCard({ sector, language, isRtl }: SectorCardProps) {
  const DirectionArrow = isRtl ? ArrowLeft : ArrowRight;
  const category = sectorCategory(sector);
  const alignment = isRtl ? "items-end text-right" : "items-start text-left";

  return (
    <a
      className="sector-diamond-card group relative block shrink-0 overflow-hidden bg-[#071015] transition-[z-index,border-color] duration-300 ease-out hover:z-20 hover:border-[#f0ca7c] focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[#f0ca7c]"
      href={withLanguage("/sectors/" + encodeURIComponent(sector.slug), language)}
      aria-label={sector.cta || sector.name}
    >
      <div className="sector-diamond-card-inner">
        <SectorMedia sector={sector} />
        <div className="absolute inset-0 bg-[#02090e]/50 transition-colors duration-500 group-hover:bg-[#02090e]/38 group-focus-visible:bg-[#02090e]/38" />

        <div className={["absolute inset-0 flex flex-col justify-center px-[18%] py-[16%] transition-transform duration-500 ease-in-out group-hover:-translate-x-full group-focus-visible:-translate-x-full", alignment].join(" ")}>
          {category ? <span className="max-w-[54%] mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#edc77f]">{category}</span> : null}
          <h3 className="max-w-[54%] line-clamp-2 text-[24px] font-semibold uppercase leading-[1.08] tracking-[-0.025em] text-[#f4f4f0] min-[1440px]:text-[27px]">
            {sector.name}
          </h3>
          <p className="mt-3 max-w-[54%] line-clamp-2 text-[14px] font-light leading-[1.55] text-[#e6e9e5df] min-[1440px]:text-[16px]">
            {sector.description}
          </p>
        </div>

        <div className={["absolute inset-0 flex translate-x-full flex-col justify-center bg-[#071015f8] px-[18%] py-[16%] opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100", alignment].join(" ")}>
          <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#edc77f]">
            {sector.cta || sector.name}
            <DirectionArrow size={17} strokeWidth={1.7} />
          </span>
        </div>
      </div>
    </a>
  );
}

function SquareSectorCard({ sector, language, isRtl }: SectorCardProps) {
  const DirectionArrow = isRtl ? ArrowLeft : ArrowRight;
  const category = sectorCategory(sector);
  const alignment = isRtl ? "items-end text-right" : "items-start text-left";

  return (
    <a
      className="group relative isolate flex aspect-square overflow-hidden rounded-[28px] border border-[#d8a75c70] bg-[#071015] p-[clamp(18px,2vw,28px)] transition duration-300 hover:border-[#edc77f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[4px] focus-visible:outline-[#edc77f]"
      href={withLanguage("/sectors/" + encodeURIComponent(sector.slug), language)}
      aria-label={sector.cta || sector.name}
    >
      <SectorMedia sector={sector} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,11,16,0.08)_4%,rgba(3,11,16,0.58)_43%,#030a0f_100%)]" />
      <div className={["relative z-10 mt-auto flex w-full flex-col", alignment].join(" ")}>
        {category ? <span className="mb-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#edc77f]">{category}</span> : null}
        <h3 className="text-[clamp(17px,1.55vw,23px)] font-semibold uppercase leading-[1.04] tracking-[-0.025em] text-[#f4f4f0]">{sector.name}</h3>
        <p className="mt-3 line-clamp-3 text-[clamp(11px,0.92vw,14px)] font-light leading-[1.55] text-[#dce2e1c9]">{sector.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#edc77f]">
          {sector.cta || sector.name}
          <DirectionArrow size={15} strokeWidth={1.7} />
        </span>
      </div>
    </a>
  );
}

function SquareSectorSlideshow({ sectors, language, isRtl }: { sectors: HomeSector[]; language: LanguageCode; isRtl: boolean }) {
  const shouldLoop = sectors.length > 4;

  return (
    <Swiper
      key={`${language}-${sectors.length}`}
      modules={[A11y, Autoplay, Keyboard, Pagination]}
      dir={isRtl ? "rtl" : "ltr"}
      slidesPerView={1.08}
      spaceBetween={12}
      slidesPerGroup={1}
      loop={shouldLoop}
      autoplay={shouldLoop ? { delay: 6200, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
      keyboard={{ enabled: true }}
      pagination={{ clickable: true }}
      breakpoints={{
        520: { slidesPerView: 2.08, spaceBetween: 14 },
        760: { slidesPerView: 3, spaceBetween: 16 },
        1024: { slidesPerView: 4, spaceBetween: 18 },
      }}
      className="sector-square-slideshow !overflow-hidden pb-9 [&_.swiper-pagination]:!bottom-0 [&_.swiper-pagination]:!top-auto [&_.swiper-pagination]:!flex [&_.swiper-pagination]:!items-center [&_.swiper-pagination]:!justify-center [&_.swiper-pagination]:!gap-2 [&_.swiper-pagination-bullet-active]:!w-6 [&_.swiper-pagination-bullet-active]:!rounded-full [&_.swiper-pagination-bullet-active]:!bg-[#edc77f] [&_.swiper-pagination-bullet-active]:!opacity-100 [&_.swiper-pagination-bullet]:!m-0 [&_.swiper-pagination-bullet]:!h-[5px] [&_.swiper-pagination-bullet]:!w-[5px] [&_.swiper-pagination-bullet]:!border [&_.swiper-pagination-bullet]:!border-[#d8a75c80] [&_.swiper-pagination-bullet]:!bg-[#d8a75c33] [&_.swiper-pagination-bullet]:!opacity-100 [&_.swiper-slide]:h-auto [&_.swiper-slide]:shrink-0 [&_.swiper-wrapper]:box-content [&_.swiper-wrapper]:flex"
      aria-label="Investment sectors slideshow"
    >
      {sectors.map((sector) => (
        <SwiperSlide key={sector.slug}>
          <div data-sector-square-tile className="sector-square-slide-reveal">
            <SquareSectorCard sector={sector} language={language} isRtl={isRtl} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function buildMosaicColumns(sectors: HomeSector[]) {
  const columns = [[], [], []] as HomeSector[][];

  sectors.forEach((sector, index) => {
    columns[index % columns.length].push(sector);
  });

  if (columns[2].length < columns[1].length) {
    const centeredSector = columns[1].pop();

    if (centeredSector) {
      columns[2].unshift(centeredSector);
    }
  }

  return columns;
}

export function HomeSectorMosaic({ sectors, language }: HomeSectorMosaicProps) {
  const isRtl = languageDirection(language) === "rtl";
  const orderedSectors = isRtl ? [...sectors].reverse() : sectors;
  const canUseDiamondMosaic = orderedSectors.length <= 9;
  const mosaicColumns = buildMosaicColumns(orderedSectors);

  return (
    <div data-story-visual className="relative mt-[clamp(18px,2vw,30px)]">
      {canUseDiamondMosaic ? (
        <div data-sector-mosaic className="sector-diamond-matrix" dir={isRtl ? "rtl" : "ltr"}>
          <div className="sector-diamond-matrix-aura" aria-hidden="true" />
          <div className="sector-diamond-matrix-track">
            {mosaicColumns.map((column, columnIndex) => (
              <div className="sector-diamond-matrix-column" key={columnIndex}>
                {column.map((sector) => (
                  <div data-sector-diamond-tile className="sector-diamond-card-reveal" key={sector.slug}>
                    <div className="sector-diamond-card-shell">
                      <DiamondSectorCard sector={sector} language={language} isRtl={isRtl} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className={canUseDiamondMosaic ? "sector-square-slideshow-fallback" : ""}>
        <SquareSectorSlideshow sectors={orderedSectors} language={language} isRtl={isRtl} />
      </div>
    </div>
  );
}
