"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { iranProvinces } from "@/components/data/iranProvincePaths";
import { provinceLocalizedDescriptions } from "@/components/data/provinceLocalizedDescriptions";
import { provinceSourceProfiles } from "@/components/data/provinceSourceProfiles";
import type { LanguageCode } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

type ProvinceMeta = {
  sourceName: string;
  capital: string;
  names: Record<LanguageCode, string>;
};

type ProvinceCenter = { x: number; y: number };

// Some provinces have concave outlines, where the center of the bounding box
// can fall outside the actual shape. These validated interior points take
// precedence for their capital pulse markers.
const markerCenterOverrides: Partial<Record<string, ProvinceCenter>> = {
  "azerbaijan-west": { x: 118.0, y: 116.6 },
};

const provinceMeta: Record<string, ProvinceMeta> = {
  alborz: { sourceName: "Alborz", capital: "Karaj", names: { en: "Alborz", fa: "البرز", ar: "البرز" } },
  ardabil: { sourceName: "Ardabil", capital: "Ardabil", names: { en: "Ardabil", fa: "اردبیل", ar: "أردبيل" } },
  "azerbaijan-east": { sourceName: "East Azerbaijan", capital: "Tabriz", names: { en: "East Azerbaijan", fa: "آذربایجان شرقی", ar: "أذربيجان الشرقية" } },
  "azerbaijan-west": { sourceName: "West Azerbaijan", capital: "Urmia", names: { en: "West Azerbaijan", fa: "آذربایجان غربی", ar: "أذربيجان الغربية" } },
  bushehr: { sourceName: "Bushehr", capital: "Bushehr", names: { en: "Bushehr", fa: "بوشهر", ar: "بوشهر" } },
  "chahar-mahaal-bakhtiari": { sourceName: "Chaharmahal and Bakhtiari", capital: "Shahrekord", names: { en: "Chaharmahal & Bakhtiari", fa: "چهارمحال و بختیاری", ar: "تشهارمحال وبختياري" } },
  fars: { sourceName: "Fars", capital: "Shiraz", names: { en: "Fars", fa: "فارس", ar: "فارس" } },
  gilan: { sourceName: "Gilan", capital: "Rasht", names: { en: "Gilan", fa: "گیلان", ar: "غيلان" } },
  golestan: { sourceName: "Golestan", capital: "Gorgan", names: { en: "Golestan", fa: "گلستان", ar: "كلستان" } },
  hamadan: { sourceName: "Hamedan", capital: "Hamedan", names: { en: "Hamedan", fa: "همدان", ar: "همدان" } },
  hormozgan: { sourceName: "Hormozgan", capital: "Bandar Abbas", names: { en: "Hormozgan", fa: "هرمزگان", ar: "هرمزغان" } },
  ilam: { sourceName: "Ilam", capital: "Ilam", names: { en: "Ilam", fa: "ایلام", ar: "إيلام" } },
  isfahan: { sourceName: "Isfahan", capital: "Isfahan", names: { en: "Isfahan", fa: "اصفهان", ar: "أصفهان" } },
  kerman: { sourceName: "Kerman", capital: "Kerman", names: { en: "Kerman", fa: "کرمان", ar: "كرمان" } },
  kermanshah: { sourceName: "Kermanshah", capital: "Kermanshah", names: { en: "Kermanshah", fa: "کرمانشاه", ar: "كرمانشاه" } },
  "khorasan-north": { sourceName: "North Khorasan", capital: "Bojnord", names: { en: "North Khorasan", fa: "خراسان شمالی", ar: "خراسان الشمالية" } },
  "khorasan-razavi": { sourceName: "Khorasan Razavi", capital: "Mashhad", names: { en: "Khorasan Razavi", fa: "خراسان رضوی", ar: "خراسان الرضوية" } },
  "khorasan-south": { sourceName: "South Khorasan", capital: "Birjand", names: { en: "South Khorasan", fa: "خراسان جنوبی", ar: "خراسان الجنوبية" } },
  khuzestan: { sourceName: "Khuzestan", capital: "Ahvaz", names: { en: "Khuzestan", fa: "خوزستان", ar: "خوزستان" } },
  "kohgiluyeh-boyer-ahmad": { sourceName: "Kohgiluyeh and Boyer-Ahmad", capital: "Yasuj", names: { en: "Kohgiluyeh & Boyer-Ahmad", fa: "کهگیلویه و بویراحمد", ar: "كهكيلويه وبوير أحمد" } },
  kurdistan: { sourceName: "Kurdistan", capital: "Sanandaj", names: { en: "Kurdistan", fa: "کردستان", ar: "كردستان" } },
  lorestan: { sourceName: "Lorestan", capital: "Khorramabad", names: { en: "Lorestan", fa: "لرستان", ar: "لرستان" } },
  markazi: { sourceName: "Markazi", capital: "Arak", names: { en: "Markazi", fa: "مرکزی", ar: "المركزية" } },
  mazandaran: { sourceName: "Mazandaran", capital: "Sari", names: { en: "Mazandaran", fa: "مازندران", ar: "مازندران" } },
  qazvin: { sourceName: "Qazvin", capital: "Qazvin", names: { en: "Qazvin", fa: "قزوین", ar: "قزوین" } },
  qom: { sourceName: "Qom", capital: "Qom", names: { en: "Qom", fa: "قم", ar: "قم" } },
  semnan: { sourceName: "Semnan", capital: "Semnan", names: { en: "Semnan", fa: "سمنان", ar: "سمنان" } },
  "sistan-baluchestan": { sourceName: "Sistan and Baluchestan", capital: "Zahedan", names: { en: "Sistan & Baluchestan", fa: "سیستان و بلوچستان", ar: "سيستان وبلوشستان" } },
  tehran: { sourceName: "Tehran", capital: "Tehran", names: { en: "Tehran", fa: "تهران", ar: "طهران" } },
  yazd: { sourceName: "Yazd", capital: "Yazd", names: { en: "Yazd", fa: "یزد", ar: "يزد" } },
  zanjan: { sourceName: "Zanjan", capital: "Zanjan", names: { en: "Zanjan", fa: "زنجان", ar: "زنجان" } },
};

const explorerCopy: Record<LanguageCode, {
  eyebrow: string;
  heading: string;
  prompt: string;
  capital: string;
  investment: string;
  provinceInfo: string;
  noData: string;
  mapLabel: string;
  introEyebrow: string;
  introTitle: string;
  intro: [string, string];
  readMore: string;
  showLess: string;
  clickHint: string;
  mapHint: string;
}> = {
  en: {
    eyebrow: "Investment intelligence · 31 provinces",
    heading: "Explore the opportunity in every province",
    prompt: "Move across the map or choose a province to see its investment profile.",
    capital: "Capital",
    investment: "Investment focus",
    provinceInfo: "Province profile",
    noData: "A concise investment profile for this province is being prepared.",
    mapLabel: "Interactive map of Iran provinces",
    introEyebrow: "Why Iran",
    introTitle: "A brief look at investment opportunities in Iran's provinces",
    intro: [
      "Iran is one of the largest and least known investment markets in the region. The unique combination of skilled human capital, a large domestic market and a strategic geoeconomic location has made Iran an attractive destination for long-term investors, especially for companies seeking sustainable returns at competitive costs.",
      "For this reason, Iran offers a unique combination of low costs, a large market and a prime regional location for investors who take a long-term, strategic and realistic view. With the right structure and a professional local partner, Iran can become one of the most profitable investment destinations in the region.",
    ],
    readMore: "Read more",
    showLess: "Show less",
    clickHint: "Click to explore",
    mapHint: "Each pulse marks a provincial capital",
  },
  fa: {
    eyebrow: "هوش سرمایه‌گذاری · ۳۱ استان",
    heading: "فرصت‌های هر استان را کشف کنید",
    prompt: "روی نقشه حرکت کنید یا یک استان را انتخاب کنید تا نمایه سرمایه‌گذاری آن را ببینید.",
    capital: "مرکز استان",
    investment: "محور سرمایه‌گذاری",
    provinceInfo: "نمایه استان",
    noData: "نمایه کوتاه سرمایه‌گذاری این استان در حال آماده‌سازی است.",
    mapLabel: "نقشه تعاملی استان‌های ایران",
    introEyebrow: "چرا ایران",
    introTitle: "نگاهی کوتاه به فرصت‌های سرمایه‌گذاری در استان‌های ایران",
    intro: [
      "ایران یکی از بزرگ‌ترین و کمترشناخته‌شده‌ترین بازارهای سرمایه‌گذاری منطقه است. ترکیب منحصربه‌فرد نیروی انسانی ماهر، بازار داخلی بزرگ و موقعیت ژئواکونومیک راهبردی، ایران را به مقصدی جذاب برای سرمایه‌گذاران بلندمدت، به‌ویژه شرکت‌هایی که به‌دنبال بازده پایدار با هزینه‌های رقابتی هستند، تبدیل کرده است.",
      "به همین دلیل، ایران برای سرمایه‌گذارانی که دیدگاهی بلندمدت، راهبردی و واقع‌بینانه دارند، ترکیبی منحصربه‌فرد از هزینه‌های پایین، بازار بزرگ و موقعیت منطقه‌ای ممتاز ارائه می‌دهد. با ساختار مناسب و یک شریک محلی حرفه‌ای، ایران می‌تواند به یکی از سودآورترین مقاصد سرمایه‌گذاری منطقه تبدیل شود.",
    ],
    readMore: "بیشتر بخوانید",
    showLess: "نمایش کمتر",
    clickHint: "برای مشاهده جزئیات کلیک کنید",
    mapHint: "هر پالس، مرکز یک استان را نشان می‌دهد",
  },
  ar: {
    eyebrow: "ذكاء استثماري · ٣١ محافظة",
    heading: "اكتشف الفرص في كل محافظة",
    prompt: "حرّك المؤشر فوق الخريطة أو اختر محافظة للاطّلاع على ملفها الاستثماري.",
    capital: "العاصمة",
    investment: "محور الاستثمار",
    provinceInfo: "ملف المحافظة",
    noData: "يجري إعداد ملخص استثماري لهذه المحافظة.",
    mapLabel: "خريطة تفاعلية لمحافظات إيران",
    introEyebrow: "لماذا إيران",
    introTitle: "نظرة موجزة إلى فرص الاستثمار في محافظات إيران",
    intro: [
      "إيران واحدة من أكبر أسواق الاستثمار وأقلّها معرفة في المنطقة. وقد جعل المزيج الفريد من رأس المال البشري الماهر، والسوق المحلي الكبير، والموقع الجيو-اقتصادي الاستراتيجي، إيران وجهة جذابة للمستثمرين على المدى الطويل، ولا سيما للشركات التي تسعى إلى عوائد مستدامة بتكاليف تنافسية.",
      "ولهذا تقدم إيران للمستثمرين ذوي الرؤية الطويلة المدى والاستراتيجية والواقعية مزيجاً فريداً من التكاليف المنخفضة والسوق الكبيرة والموقع الإقليمي المتميز. ومع الهيكل المناسب وشريك محلي محترف، يمكن أن تصبح إيران واحدة من أكثر وجهات الاستثمار ربحية في المنطقة.",
    ],
    readMore: "اقرأ المزيد",
    showLess: "عرض أقل",
    clickHint: "انقر لاستكشاف التفاصيل",
    mapHint: "تشير كل نبضة إلى عاصمة محافظة",
  },
};

function provinceName(provinceClass: string, language: LanguageCode) {
  return provinceMeta[provinceClass]?.names[language] ?? provinceMeta[provinceClass]?.names.en ?? provinceClass;
}

function fallbackDescription(language: LanguageCode, name: string) {
  const descriptions = {
    en: `${name} offers a distinctive regional setting and a range of investment pathways shaped by its people, location and productive capacity.`,
    fa: `${name} با موقعیت منطقه‌ای، ظرفیت‌های انسانی و توان تولیدی خود، مسیرهای متنوعی برای سرمایه‌گذاری فراهم می‌کند.`,
    ar: `تقدم ${name} بيئة إقليمية متميزة ومسارات استثمار متنوعة ترتكز على مواردها البشرية وموقعها وقدراتها الإنتاجية.`,
  };

  return descriptions[language];
}

function provinceExcerpt(text: string, limit = 220) {
  if (text.length <= limit) return text;

  const partial = text.slice(0, limit);
  const boundary = Math.max(partial.lastIndexOf(" "), partial.lastIndexOf("،"), partial.lastIndexOf(","));
  return `${partial.slice(0, boundary > limit * 0.65 ? boundary : limit).trimEnd()}…`;
}

export function IranProvinceExplorer({ language }: { language: LanguageCode }) {
  const copy = explorerCopy[language];
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [displayedProvince, setDisplayedProvince] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [introExpanded, setIntroExpanded] = useState(false);
  const [provinceDescriptionExpanded, setProvinceDescriptionExpanded] = useState(false);
  const [centers, setCenters] = useState<Record<string, ProvinceCenter>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const hoverLabelRef = useRef<HTMLDivElement>(null);
  const hoverLabelPositionRef = useRef<HTMLDivElement>(null);
  const hoverPositionFrameRef = useRef<number | null>(null);
  const hoverPointerRef = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const id = useId().replace(/:/g, "");
  const dir = language === "fa" || language === "ar" ? "rtl" : "ltr";
  const explorerGridColumns = dir === "rtl"
    ? "grid-cols-[minmax(0,1.34fr)_minmax(320px,0.66fr)]"
    : "grid-cols-[minmax(320px,0.66fr)_minmax(0,1.34fr)]";

  const detail = useMemo(() => {
    if (!displayedProvince) return null;

    const meta = provinceMeta[displayedProvince];
    const name = provinceName(displayedProvince, language);
    const profile = meta ? provinceSourceProfiles[meta.sourceName] : undefined;
    const localizedDescription = meta ? provinceLocalizedDescriptions[meta.sourceName]?.[language] : undefined;

    return {
      title: name,
      body: localizedDescription || profile?.description || fallbackDescription(language, name),
    };
  }, [displayedProvince, language]);

  const displayedDescription = detail
    ? provinceDescriptionExpanded ? detail.body : provinceExcerpt(detail.body)
    : "";
  const hoveredName = hoveredProvince ? provinceName(hoveredProvince, language) : null;

  useEffect(() => {
    if (selectedProvince) {
      setDisplayedProvince(selectedProvince);
      setProvinceDescriptionExpanded(false);
      return;
    }

    const timer = window.setTimeout(() => setDisplayedProvince(null), 280);
    return () => window.clearTimeout(timer);
  }, [selectedProvince]);

  useEffect(() => () => {
    if (hoverPositionFrameRef.current) window.cancelAnimationFrame(hoverPositionFrameRef.current);
  }, []);

  useEffect(() => {
    if (!selectedProvince) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!mapRef.current?.contains(event.target as Node)) setSelectedProvince(null);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [selectedProvince]);

  useLayoutEffect(() => {
    const panel = detailPanelRef.current;
    if (!panel || !selectedProvince || selectedProvince !== displayedProvince) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const label = panel.querySelector("[data-province-stage='label']");
      const title = panel.querySelector("[data-province-stage='title']");
      const description = panel.querySelector("[data-province-stage='description']");
      const action = panel.querySelector("[data-province-stage='action']");

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(label, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.22 })
        .fromTo(title, { autoAlpha: 0, y: 26, scale: 0.94, filter: "blur(7px)" }, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.56 }, 0.1)
        .fromTo(description, { autoAlpha: 0, y: 18, filter: "blur(6px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.46 }, 0.42)
        .fromTo(action, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.62);
    }, panel);

    return () => context.revert();
  }, [displayedProvince, language, selectedProvince]);

  useLayoutEffect(() => {
    const label = hoverLabelRef.current;
    if (!label || !hoveredProvince || selectedProvince) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(label, { autoAlpha: 0, y: 18, scale: 0.94, filter: "blur(7px)" }, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.38, ease: "power3.out" });
      gsap.fromTo(label.querySelector("[data-hover-line]"), { scaleX: 0, transformOrigin: "center" }, { scaleX: 1, duration: 0.46, ease: "power3.out", delay: 0.12 });
    }, label);

    return () => context.revert();
  }, [hoveredProvince, selectedProvince]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const measureCenters = () => {
      const nextCenters: Record<string, ProvinceCenter> = {};

      iranProvinces.forEach((province) => {
        const path = pathRefs.current[province.className];
        if (!path) return;
        const bounds = path.getBBox();
        nextCenters[province.className] = markerCenterOverrides[province.className] ?? {
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height / 2,
        };
      });

      setCenters(nextCenters);
    };

    const frame = window.requestAnimationFrame(measureCenters);
    const observer = new ResizeObserver(measureCenters);
    observer.observe(svg);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const map = mapRef.current;
    const copyNode = copyRef.current;
    if (!section || !map || !copyNode) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set([map, copyNode], { clearProps: "all" });
      return;
    }

    const context = gsap.context(() => {
      const provinceShapes = map.querySelectorAll<SVGGElement>("[data-province-shape]");
      const provincePaths = map.querySelectorAll<SVGPathElement>("[data-province-path]");
      const markers = map.querySelectorAll<SVGGElement>("[data-province-marker]");
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 92%",
          end: "bottom 8%",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onLeave: () => setSelectedProvince(null),
          onLeaveBack: () => setSelectedProvince(null),
        },
      });

      timeline
        .fromTo(copyNode, { autoAlpha: 0, y: 54 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power3.out" }, 0)
        .fromTo(map, { autoAlpha: 0, y: 90, scale: 0.3, rotation: -10, transformOrigin: "50% 55%" }, { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.32, ease: "back.out(1.5)" }, 0.02)
        .fromTo(provinceShapes, { autoAlpha: 0, scale: 0.68, rotation: -3, transformOrigin: "center center" }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.24, stagger: { each: 0.006, from: "random" }, ease: "back.out(1.7)" }, 0.07)
        .fromTo(provincePaths, {
          strokeDasharray: (_, path) => {
            const length = (path as SVGPathElement).getTotalLength();
            return `${length} ${length}`;
          },
          strokeDashoffset: (_, path) => (path as SVGPathElement).getTotalLength(),
        }, { strokeDashoffset: 0, duration: 0.28, stagger: { each: 0.004, from: "center" }, ease: "power2.out" }, 0.09)
        .set(provincePaths, { clearProps: "strokeDasharray,strokeDashoffset" }, 0.39)
        .fromTo(markers, { autoAlpha: 0, scale: 0, transformOrigin: "center center" }, { autoAlpha: 1, scale: 1, duration: 0.18, stagger: { each: 0.004, from: "random" }, ease: "back.out(2.6)" }, 0.19)
        .to([map, copyNode], { duration: 0.42 })
        .to(copyNode, { autoAlpha: 0, y: -44, duration: 0.2, ease: "power2.in" }, 0.8)
        .to(map, { autoAlpha: 0, y: -70, scale: 0.12, rotation: 8, duration: 0.2, ease: "power3.in", transformOrigin: "50% 45%" }, 0.8);
    }, section);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, []);

  const isRtlLanguage = language === "fa" || language === "ar";
  const activeTitleClass = isRtlLanguage
    ? "[font-family:var(--font-persian)] text-[clamp(1.85rem,4.15vw,4.15rem)] font-bold leading-[1.12] tracking-normal max-[760px]:text-[clamp(1.75rem,9vw,2.8rem)]"
    : "font-['Times_New_Roman'] text-[clamp(2rem,4.8vw,4.8rem)] font-normal leading-[0.94] max-[760px]:text-[clamp(2rem,12vw,3.5rem)]";
  const hoverTitleClass = isRtlLanguage
    ? "[font-family:var(--font-persian)] text-[clamp(1.45rem,2.65vw,2.75rem)] font-bold leading-[1.15]"
    : "font-['Times_New_Roman'] text-[clamp(1.75rem,3.1vw,3.3rem)] font-normal leading-none";
  const chooseProvince = (provinceClass: string) => {
    setSelectedProvince((selected) => selected ? null : provinceClass);
  };
  const queueHoverLabelPosition = (clientX: number, clientY: number) => {
    hoverPointerRef.current = { x: clientX, y: clientY };
    if (hoverPositionFrameRef.current) return;

    hoverPositionFrameRef.current = window.requestAnimationFrame(() => {
      hoverPositionFrameRef.current = null;
      const map = mapRef.current;
      const label = hoverLabelPositionRef.current;
      if (!map || !label) return;

      const bounds = map.getBoundingClientRect();
      const padding = 12;
      const gap = 18;
      const labelWidth = label.offsetWidth;
      const labelHeight = label.offsetHeight;
      const localX = hoverPointerRef.current.x - bounds.left;
      const localY = hoverPointerRef.current.y - bounds.top;
      const maxX = Math.max(padding, bounds.width - labelWidth - padding);
      const maxY = Math.max(padding, bounds.height - labelHeight - padding);
      const x = Math.min(Math.max(padding, localX + gap), maxX);
      const y = Math.min(Math.max(padding, localY - labelHeight / 2), maxY);

      label.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    });
  };

  return (
    <section
      ref={sectionRef}
      id="province-explorer"
      className={`relative isolate mx-auto my-[clamp(3.5rem,9vw,8rem)] grid w-[min(1480px,calc(100%-clamp(2rem,6vw,7rem)))] ${explorerGridColumns} items-center gap-[clamp(2rem,4.5vw,5rem)] overflow-hidden rounded-[10px] p-[clamp(2rem,5vw,4.5rem)] max-[940px]:my-14 max-[940px]:w-[min(calc(100%-2rem),20rem)] max-[940px]:grid-cols-1 max-[940px]:gap-10 max-[940px]:p-6 max-[760px]:w-[calc(100%-1rem)] max-[760px]:gap-8 max-[760px]:p-4`}
      aria-labelledby="province-explorer-title"
      dir={dir}
      lang={language}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-[#d8a75c14] shadow-[0_0_0_5rem_rgba(216,167,92,0.018),0_0_0_10rem_rgba(216,167,92,0.012)]" />
      <div ref={copyRef} className={`relative z-10 text-left ${dir === "rtl" ? "col-[2] row-[1] text-right max-[760px]:col-auto max-[760px]:row-auto" : ""}`}>
        <p className="m-0 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#edc77f]"><MapPin aria-hidden="true" size={16} /> {copy.eyebrow}</p>
        <h2 id="province-explorer-title" className="mt-[1.15rem] max-w-[560px] font-['Times_New_Roman'] text-[clamp(2.5rem,5vw,5.2rem)] font-normal leading-[0.98] text-[#fff8e7] [text-wrap:balance]">{copy.heading}</h2>
        <p className="mt-[1.4rem] max-w-[540px] text-[clamp(0.98rem,1.2vw,1.1rem)] leading-[1.75] text-[#fff9eaae]">{copy.prompt}</p>
        <div className="mt-[1.35rem] max-w-[540px]">
          <p className="m-0 text-[clamp(0.79rem,0.94vw,0.91rem)] leading-[1.72] text-[#fff9ea85]">{copy.intro[0]}</p>
          <div id="province-explorer-more" className={`grid transition-[grid-template-rows,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${introExpanded ? "mt-3 grid-rows-[1fr] translate-y-0 opacity-100" : "mt-0 grid-rows-[0fr] -translate-y-1 opacity-0"}`}>
            <div className="overflow-hidden">
              <p className="m-0 text-[clamp(0.79rem,0.94vw,0.91rem)] leading-[1.72] text-[#fff9ea85]">{copy.intro[1]}</p>
            </div>
          </div>
        </div>
        <button className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d8a75c75] bg-[#d8a75c0d] px-4 text-xs font-bold text-[#f4d99d] transition duration-300 hover:-translate-y-0.5 hover:border-[#edc77f] hover:bg-[#d8a75c22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#edc77f]" type="button" onClick={() => setIntroExpanded((expanded) => !expanded)} aria-expanded={introExpanded} aria-controls="province-explorer-more">
          {introExpanded ? copy.showLess : copy.readMore}
          <ChevronDown className={`transition-transform duration-300 ${introExpanded ? "rotate-180" : ""}`} size={16} strokeWidth={2} aria-hidden="true" />
        </button>
        <div className="mt-7 flex flex-wrap gap-x-[1.4rem] gap-y-3 text-xs text-[#fff9ea80]" aria-hidden="true">
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#edc77f] shadow-[0_0_0.8rem_rgba(237,199,127,0.8)]" /> {copy.mapHint}</span>
          <span className="inline-flex items-center gap-2">{iranProvinces.length} {language === "fa" ? "استانِ متصل" : language === "ar" ? "محافظة مترابطة" : "connected provinces"}</span>
        </div>
      </div>

      <div ref={mapRef} className={`relative w-full min-h-[360px] origin-center max-[760px]:min-h-0 ${dir === "rtl" ? "col-[1] row-[1] max-[760px]:col-auto max-[760px]:row-auto" : ""}`} onMouseLeave={() => setHoveredProvince(null)} onClick={() => setSelectedProvince(null)}>
        {!selectedProvince && hoveredName ? (
          <div ref={hoverLabelPositionRef} key={hoveredProvince} className="pointer-events-none absolute left-0 top-0 z-20 w-[min(18rem,calc(100%-1.5rem))] text-center will-change-transform">
            <div ref={hoverLabelRef} className="relative grid justify-items-center rounded-[18px] border border-[#edc77f5c] bg-[linear-gradient(145deg,rgba(30,25,15,0.76),rgba(3,8,11,0.66))] px-[clamp(1.2rem,2.5vw,2.4rem)] py-3 shadow-[0_1rem_3.5rem_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
              <div aria-hidden="true" className="absolute -inset-x-8 -inset-y-5 -z-10 rounded-full bg-[#d8a75c1f] blur-2xl" />
              <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.2em] text-[#ffe08ab8]">{copy.provinceInfo}</span>
              <strong className={`mt-1 text-[#fff4cf] [text-shadow:0_0_1.4rem_rgba(225,178,74,0.36)] ${hoverTitleClass}`}>{hoveredName}</strong>
              <i data-hover-line aria-hidden="true" className="mt-2 h-px w-[min(9rem,66%)] bg-gradient-to-r from-transparent via-[#edc77f] to-transparent" />
              <span className="mt-2 text-[0.62rem] font-semibold tracking-[0.07em] text-[#fff5d8a8]">{copy.clickHint}</span>
            </div>
          </div>
        ) : null}
        <div className={`absolute inset-x-0 top-[clamp(-1.5rem,-2vw,-0.5rem)] z-10 grid min-h-[clamp(8rem,15vw,12rem)] content-start justify-items-center px-4 text-center transition-[opacity,transform,filter] duration-[280ms] ease-out motion-reduce:transition-none ${selectedProvince ? "pointer-events-auto translate-y-0 scale-100 opacity-100 blur-0" : "pointer-events-none -translate-y-2.5 scale-[0.98] opacity-0 blur-[5px]"}`} aria-live="polite" aria-atomic="true">
          {detail && (
            <div ref={detailPanelRef} key={detail.title} className="relative grid w-[min(680px,94%)] justify-items-center" onClick={(event) => event.stopPropagation()}>
              <div aria-hidden="true" className="absolute top-5 h-28 w-[min(34rem,88vw)] rounded-full bg-[#d8a75c29] blur-[42px]" />
              <span data-province-stage="label" className="relative text-[clamp(0.58rem,0.8vw,0.72rem)] font-extrabold uppercase leading-[1.4] tracking-[0.2em] text-[#ffe08ab8]">{copy.provinceInfo}</span>
              <strong data-province-stage="title" className={`relative mt-1 block max-w-full break-words text-[#fff4cf] [text-shadow:0_0_1.4rem_rgba(225,178,74,0.34),0_0.7rem_2rem_rgba(0,0,0,0.58)] [text-wrap:balance] ${activeTitleClass}`}>{detail.title}</strong>
              <div data-province-stage="description" className="relative mt-[clamp(0.55rem,1vw,0.85rem)] w-full max-w-[580px] overflow-hidden rounded-[10px] border border-[#ffde8c47] bg-[radial-gradient(circle_at_50%_0%,rgba(255,221,136,0.13),transparent_58%),linear-gradient(145deg,rgba(30,25,15,0.78),rgba(9,8,6,0.72))] px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.3vw,1rem)] text-[clamp(0.78rem,1.05vw,0.96rem)] leading-[1.65] text-[#fff9eac2] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1.2rem_2.8rem_rgba(0,0,0,0.32),0_0_2rem_rgba(216,167,92,0.07)] backdrop-blur-xl [text-wrap:balance]">
                <p id={`${id}-province-description`} className="m-0">{displayedDescription}</p>
                <button data-province-stage="action" className="group mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#edc77f70] bg-[#d8a75c12] px-3.5 text-xs font-bold text-[#ffe7ad] transition duration-300 hover:-translate-y-0.5 hover:border-[#ffe2a0] hover:bg-[#d8a75c2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#edc77f]" type="button" onClick={() => setProvinceDescriptionExpanded((expanded) => !expanded)} aria-expanded={provinceDescriptionExpanded} aria-controls={`${id}-province-description`}>
                  {provinceDescriptionExpanded ? copy.showLess : copy.readMore}
                  <ChevronDown className={`transition-transform duration-300 ${provinceDescriptionExpanded ? "rotate-180" : ""}`} size={15} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
        <svg ref={svgRef} className="block h-auto w-full overflow-visible" viewBox="0 0 900 650" role="img" aria-label={copy.mapLabel}>
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(216, 167, 92, 0.28)" />
              <stop offset="1" stopColor="rgba(216, 167, 92, 0.06)" />
            </linearGradient>
            <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g>
            {iranProvinces.map((province) => {
              const name = provinceName(province.className, language);
              const center = centers[province.className];

              return (
                <g
                  key={province.className}
                  data-province-shape
                  className="group cursor-pointer outline-none [touch-action:manipulation]"
                  role="button"
                  tabIndex={0}
                  aria-label={name}
                  aria-pressed={selectedProvince === province.className}
                  onMouseEnter={(event) => {
                    setHoveredProvince(province.className);
                    queueHoverLabelPosition(event.clientX, event.clientY);
                  }}
                  onMouseMove={(event) => queueHoverLabelPosition(event.clientX, event.clientY)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  onFocus={() => {
                    setHoveredProvince(province.className);
                    const bounds = mapRef.current?.getBoundingClientRect();
                    if (bounds) queueHoverLabelPosition(bounds.left + bounds.width / 2, bounds.top + bounds.height * 0.35);
                  }}
                  onBlur={() => setHoveredProvince(null)}
                  onClick={(event) => {
                    event.stopPropagation();
                    chooseProvince(province.className);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      chooseProvince(province.className);
                    }
                  }}
                >
                  <path
                    ref={(node) => { pathRefs.current[province.className] = node; }}
                    data-province-path
                    d={province.d}
                    fill={`url(#${id}-fill)`}
                    className={`[stroke-width:1.35] [vector-effect:non-scaling-stroke] transition-[fill,stroke,filter] duration-200 ease-out group-hover:fill-[#8e6827] group-hover:stroke-[#ffe6a3] group-hover:[filter:drop-shadow(0_0_10px_rgba(244,196,91,0.42))] group-focus-visible:fill-[#8e6827] group-focus-visible:stroke-[#fff8df] group-focus-visible:[stroke-width:3] ${selectedProvince === province.className ? "fill-[#8e6827] stroke-[#ffe6a3] [filter:drop-shadow(0_0_10px_rgba(244,196,91,0.42))]" : "stroke-[rgba(232,198,117,0.56)]"}`}
                  />
                  {center && (
                    <g data-province-marker className="pointer-events-none" transform={`translate(${center.x} ${center.y})`} pointerEvents="none">
                      <circle className="animate-ping fill-none stroke-[rgba(255,218,125,0.62)] [animation-duration:2.8s] [stroke-width:1.8] [transform-box:fill-box] [transform-origin:center] motion-reduce:animate-none" r="8" />
                      <circle className="animate-ping fill-none stroke-[rgba(255,218,125,0.62)] [animation-delay:1.4s] [animation-duration:2.8s] [stroke-width:1.8] [transform-box:fill-box] [transform-origin:center] motion-reduce:animate-none" r="8" />
                      <circle className="fill-[rgba(255,210,106,0.55)]" r="7" filter={`url(#${id}-glow)`} />
                      <circle className="fill-[#fff0b8] stroke-[#8d5d0d] [stroke-width:1.5]" r="4" />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </section>
  );
}
