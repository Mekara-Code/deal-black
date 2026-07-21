import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Globe2,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  Target,
} from "lucide-react";
import { CollaborationRequestButton } from "@/components/CollaborationRequestButton";
import { CollaborationRequestLauncher } from "@/components/CollaborationRequestLauncher";
import { DealStagedLogo } from "@/components/DealBrandVisuals";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { languageDirection, normalizeLanguage, withLanguage, type LanguageCode } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About DEAL | Foreign Investment & Financing Agency",
  description: "Learn how DEAL connects international capital, financial institutions and Iranian projects through a disciplined, data-led investment process.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About DEAL | Foreign Investment & Financing Agency",
    description: "A specialist bridge between international capital and investable opportunities in Iran.",
    url: "/about",
    siteName: "DEAL",
    type: "website",
    images: [{ url: "/assets/img/azadi-clean.png", width: 1200, height: 630, alt: "DEAL — Foreign Investment & Financing Agency" }],
  },
};

type AboutPageProps = {
  searchParams?: Promise<{ lang?: string }>;
};

type AboutCopy = {
  nav: {
    home: string;
    opportunities: string;
    sectors: string;
    about: string;
    team: string;
    contact: string;
  };
  breadcrumb: {
    home: string;
    current: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    explore: string;
    contact: string;
    panelLabel: string;
    panelTitle: string;
    panelDescription: string;
  };
  introduction: {
    eyebrow: string;
    title: string;
    paragraphs: [string, string];
    distinction: string;
    distinctionText: string;
  };
  decisionFramework: {
    eyebrow: string;
    signal: string;
    title: string;
    description: string;
    perspectiveLabel: string;
    perspectives: [string, string, string][];
    workflowLabel: string;
    workflow: [string, string][];
  };
  focus: {
    eyebrow: string;
    title: string;
    description: string;
    items: [string, string][];
  };
  network: {
    eyebrow: string;
    title: string;
    description: string;
    commitments: [string, string, string];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    emailLabel: string;
    phoneLabel: string;
    whatsappLabel: string;
    addressLabel: string;
    address: string;
    directions: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    action: string;
  };
  footer: {
    backHome: string;
  };
};

const aboutCopy: Record<LanguageCode, AboutCopy> = {
  en: {
    nav: {
      home: "Home",
      opportunities: "Opportunities",
      sectors: "Sectors",
      about: "About",
      team: "Team",
      contact: "Contact",
    },
    breadcrumb: { home: "Home", current: "About DEAL" },
    hero: {
      eyebrow: "Foreign Investment & Financing Agency",
      titleLine1: "Capital, guided",
      titleLine2: "by conviction.",
      description: "A specialist agency creating a disciplined path from international capital to economically viable projects in Iran.",
      explore: "Discover our mandate",
      contact: "Contact the agency",
      panelLabel: "Our mandate",
      panelTitle: "A reliable bridge for informed investment decisions.",
      panelDescription: "We bring investors, financial institutions and project owners into one clear, professionally managed process.",
    },
    introduction: {
      eyebrow: "Who we are",
      title: "Introduction to the Foreign Investment Attraction and Financing Agency",
      paragraphs: [
        "The Foreign Investment Attraction and Financing Agency was established to facilitate the entry of international investment and financial resources into economically viable projects in Iran. As a specialist institution, the Agency serves as a professional intermediary between foreign investors, financial institutions, and Iranian project owners.",
        "The Agency is committed to a professional, non-promotional, data-driven approach that provides investors with a reliable foundation for decision-making and plays an effective role in sustainable development and the attraction of productive capital.",
      ],
      distinction: "Professional, evidence-led, investor-ready.",
      distinctionText: "Each engagement is designed to make complex opportunities easier to evaluate, compare and move forward with confidence.",
    },
    decisionFramework: {
      eyebrow: "A clearer decision frame",
      signal: "Structured review inputs",
      title: "Three perspectives for a more legible opportunity.",
      description: "Information is organized across the technical, financial and legal dimensions relevant to investor evaluation—creating a clearer basis for review and discussion.",
      perspectiveLabel: "Evaluation perspectives",
      perspectives: [
        ["01", "Technical", "Project inputs are organized for a grounded review of the opportunity."],
        ["02", "Financial", "Financial considerations are arranged to support a clearer assessment."],
        ["03", "Legal", "Legal dimensions are considered alongside the wider project context."],
      ],
      workflowLabel: "Decision pathway",
      workflow: [
        ["Opportunity screening", "Initial review"],
        ["Project structuring", "Technical, financial & legal"],
        ["Investor alignment", "Appropriate fit"],
      ],
    },
    focus: {
      eyebrow: "How we create clarity",
      title: "Structured for global investment decisions.",
      description: "The Agency’s primary focus is attracting foreign direct investment (FDI), arranging foreign financing, and structuring projects from technical, financial, and legal perspectives so that international investors can assess them and make informed decisions. To achieve this, the Agency identifies investment opportunities, professionally packages projects, and matches them with suitable investors—making the investment process transparent, reliable, and efficient.",
      items: [
        ["Foreign direct investment", "Identifying and advancing opportunities suited to long-term international capital."],
        ["Foreign financing", "Connecting viable projects with the right financial structures and institutional pathways."],
        ["Project structuring", "Preparing technical, financial and legal foundations for clear investor evaluation."],
      ],
    },
    network: {
      eyebrow: "A connected practice",
      title: "Support that continues from first review to execution.",
      description: "Through a network of specialist advisers, financial institutions, banks, consulting firms, and domestic and international partners, the Agency supports investors through every phase—from the initial review of opportunities to finalizing cooperation and project implementation. Providing up-to-date information, sector analysis, and structured access to investment opportunities is also central to the Agency’s services.",
      commitments: ["Current market intelligence", "Sector-level analysis", "Structured opportunity access"],
    },
    contact: {
      eyebrow: "Contact DEAL",
      title: "Open a direct line to the agency.",
      description: "Connect with our team for investment, financing and project-structuring conversations.",
      emailLabel: "Email",
      phoneLabel: "Company phone",
      whatsappLabel: "WhatsApp",
      addressLabel: "Office address",
      address: "Unit 401, Fourth Floor, Peydayesh Building, No. 28, next to Jami-e Sharghi, Pesian Street, Zafaranieh, Tehran, Iran",
      directions: "Get directions",
    },
    cta: {
      eyebrow: "Build with confidence",
      title: "Bring the right capital and the right project into the same conversation.",
      action: "Send a collaboration request",
    },
    footer: { backHome: "Back to home" },
  },
  fa: {
    nav: {
      home: "خانه",
      opportunities: "فرصت‌ها",
      sectors: "بخش‌ها",
      about: "درباره ما",
      team: "تیم",
      contact: "تماس",
    },
    breadcrumb: { home: "خانه", current: "درباره DEAL" },
    hero: {
      eyebrow: "آژانس جذب سرمایه‌گذاری و تامین مالی خارجی",
      titleLine1: "سرمایه، با مسیر",
      titleLine2: "روشن و مطمئن.",
      description: "نهادی تخصصی برای پیوند دادن سرمایه و منابع مالی بین‌المللی با پروژه‌های دارای توجیه اقتصادی در ایران.",
      explore: "آشنایی با ماموریت ما",
      contact: "تماس با آژانس",
      panelLabel: "ماموریت ما",
      panelTitle: "پلی قابل اتکا برای تصمیم‌گیری آگاهانه در سرمایه‌گذاری.",
      panelDescription: "سرمایه‌گذاران، نهادهای مالی و صاحبان پروژه را در یک فرآیند حرفه‌ای، روشن و مدیریت‌شده کنار هم قرار می‌دهیم.",
    },
    introduction: {
      eyebrow: "ما که هستیم",
      title: "معرفی آژانس جذب سرمایه گذاری و تامین مالی خارجی",
      paragraphs: [
        "آژانس جذب سرمایه گذاری و تامین مالی خارجی با هدف تسهیل ورود سرمایه و منابع مالی بین المللی به پروژه های دارای توجیه اقتصادی در ایران تاسیس شده است. این آژانس به عنوان یک نهاد تخصصی ، نقش واسط حرفه ای میان سرمایه گذاران خارجی ، نهادهای مالی و صاحبان پروژه های ایرانی را ایفا می کند.",
        "آژانس جذب سرمایه گذاری و تامین مالی خارجی متعهد است با رویکردی حرفه ای ، غیرتبلیغاتی و مبتنی بر داده ، بستری قابل اتکا برای تصمیم سازی سرمایه گذاران فراهم کرده نقش موثری در توسعه پایدار و جذب سرمایه های مولد ایفا نماید.",
      ],
      distinction: "حرفه‌ای، مبتنی بر داده و آماده برای ارزیابی سرمایه‌گذار.",
      distinctionText: "هر تعامل با هدف ساده‌تر کردن ارزیابی، مقایسه و پیشبرد فرصت‌های پیچیده با اطمینان طراحی می‌شود.",
    },
    decisionFramework: {
      eyebrow: "چارچوبی روشن‌تر برای تصمیم‌گیری",
      signal: "داده‌های ساختاریافته برای ارزیابی",
      title: "سه منظر برای تصویری روشن‌تر از فرصت سرمایه‌گذاری.",
      description: "اطلاعات هر فرصت در ابعاد فنی، مالی و حقوقی سامان‌دهی می‌شود تا مبنای ارزیابی و گفت‌وگو برای سرمایه‌گذار روشن‌تر باشد.",
      perspectiveLabel: "منظرهای ارزیابی",
      perspectives: [
        ["۰۱", "فنی", "اجزای پروژه برای بررسی منسجم فرصت سامان‌دهی می‌شوند."],
        ["۰۲", "مالی", "ملاحظات مالی برای ارزیابی روشن‌تر در کنار هم قرار می‌گیرند."],
        ["۰۳", "حقوقی", "ابعاد حقوقی پروژه در کنار سایر زمینه‌های آن بررسی می‌شوند."],
      ],
      workflowLabel: "مسیر تصمیم‌سازی",
      workflow: [
        ["بررسی اولیه فرصت", "گام نخست"],
        ["ساختاربندی پروژه", "فنی، مالی و حقوقی"],
        ["تطبیق با سرمایه‌گذار", "یافتن تناسب مناسب"],
      ],
    },
    focus: {
      eyebrow: "چگونه شفافیت ایجاد می‌کنیم",
      title: "ساختاریافته برای تصمیم‌های سرمایه‌گذاری بین‌المللی.",
      description: "تمرکز اصلی آژانس بر جذب سرمایه گذاری مستقیم خارجی (FDI) ، تامین مالی خارجی و ساختاربندی پروژه ها از نظر فنی ، مالی و حقوقی برای سرمایه گذاران ین المللی قابل ارزیابی و تصمیم گیری باشند. در این راستا ، آژانس با شناسایی فرصت های سرمایه گذاری ، بسته بندی حرفه ای پروژه ها و تطبیق آن ها با سرمایه گذاران مناسب ، فرآیند سرمایه گذاری را شفاف ، قابل اعتماد و کارآمد می سازد.",
      items: [
        ["سرمایه‌گذاری مستقیم خارجی", "شناسایی و پیشبرد فرصت‌هایی که با سرمایه بلندمدت بین‌المللی هم‌خوان هستند."],
        ["تامین مالی خارجی", "پیوند پروژه‌های قابل توجیه با ساختارهای مالی و مسیرهای نهادی مناسب."],
        ["ساختاربندی پروژه", "آماده‌سازی مبانی فنی، مالی و حقوقی برای ارزیابی شفاف سرمایه‌گذار."],
      ],
    },
    network: {
      eyebrow: "یک شبکه هم‌افزا",
      title: "همراهی از ارزیابی اولیه تا اجرای پروژه.",
      description: "این آژانس با بهره گیری از شبکه ای از مشاوران تخصصی ، نهاد های مالی ، بانک ها، شرکت های مشاوره ای و شرکای داخلی و خارجی ، سرمایه گذاران را در تمامی مراحل از بررسی اولیه فرصت ها تا نهایی سازی همکاری و اجرای پروژه همراهی میکند. همچنین ارائه اطلاعات به روز ، تحلیل های بخشی و دسترسی ساختارمند به فرصت های سرمایه گذاری ، از ارکان اصلی خدمات آژانس محسوب میشود.",
      commitments: ["اطلاعات به‌روز بازار", "تحلیل‌های بخشی", "دسترسی ساختارمند به فرصت‌ها"],
    },
    contact: {
      eyebrow: "تماس با DEAL",
      title: "یک مسیر مستقیم برای گفت‌وگو با آژانس.",
      description: "برای گفت‌وگو درباره سرمایه‌گذاری، تامین مالی و ساختاربندی پروژه با تیم ما در ارتباط باشید.",
      emailLabel: "ایمیل",
      phoneLabel: "شماره تماس شرکت",
      whatsappLabel: "واتساپ",
      addressLabel: "آدرس دفتر",
      address: "تهران، زعفرانیه، خیابان پسیان، جنب جامی شرقی، پلاک ۲۸، ساختمان پیدایش، طبقه چهار، واحد ۴۰۱",
      directions: "دریافت مسیر",
    },
    cta: {
      eyebrow: "با اطمینان پیش برویم",
      title: "سرمایه مناسب و پروژه مناسب را در یک گفت‌وگوی روشن گرد هم آوریم.",
      action: "ارسال درخواست همکاری",
    },
    footer: { backHome: "بازگشت به خانه" },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      opportunities: "الفرص",
      sectors: "القطاعات",
      about: "من نحن",
      team: "الفريق",
      contact: "اتصال",
    },
    breadcrumb: { home: "الرئيسية", current: "عن DEAL" },
    hero: {
      eyebrow: "وكالة جذب الاستثمار والتمويل الأجنبي",
      titleLine1: "رأس المال، عبر مسار",
      titleLine2: "واضح وموثوق.",
      description: "جهة متخصصة تصل الاستثمارات والموارد المالية الدولية بالمشاريع ذات الجدوى الاقتصادية في إيران.",
      explore: "اكتشف مهمتنا",
      contact: "اتصل بالوكالة",
      panelLabel: "مهمتنا",
      panelTitle: "جسر موثوق لاتخاذ قرارات استثمارية مستنيرة.",
      panelDescription: "نجمع المستثمرين والمؤسسات المالية وأصحاب المشاريع ضمن عملية واحدة واضحة ومُدارة باحتراف.",
    },
    introduction: {
      eyebrow: "من نحن",
      title: "نبذة عن وكالة جذب الاستثمار والتمويل الأجنبي",
      paragraphs: [
        "تأسست وكالة جذب الاستثمار والتمويل الأجنبي بهدف تسهيل دخول الاستثمارات والموارد المالية الدولية إلى المشاريع ذات الجدوى الاقتصادية في إيران. وتؤدي الوكالة، بوصفها جهة متخصصة، دور الوسيط المهني بين المستثمرين الأجانب والمؤسسات المالية وأصحاب المشاريع الإيرانيين.",
        "تلتزم وكالة جذب الاستثمار والتمويل الأجنبي باتباع نهج مهني غير ترويجي قائم على البيانات، لتوفير بيئة موثوقة تدعم اتخاذ قرارات المستثمرين، وتسهم بفاعلية في التنمية المستدامة وجذب رؤوس الأموال الإنتاجية.",
      ],
      distinction: "احترافي، قائم على الأدلة، وجاهز لتقييم المستثمرين.",
      distinctionText: "يُصمَّم كل تفاعل لتسهيل تقييم الفرص المعقدة ومقارنتها والمضي بها بثقة.",
    },
    decisionFramework: {
      eyebrow: "إطار أوضح لاتخاذ القرار",
      signal: "مدخلات مراجعة منظَّمة",
      title: "ثلاثة أبعاد لرؤية أوضح للفرصة الاستثمارية.",
      description: "تُنظَّم معلومات كل فرصة عبر الأبعاد الفنية والمالية والقانونية ذات الصلة بتقييم المستثمر، لتوفير أساس أوضح للمراجعة والنقاش.",
      perspectiveLabel: "أبعاد التقييم",
      perspectives: [
        ["٠١", "فني", "تُنظَّم عناصر المشروع لمراجعة متسقة للفرصة."],
        ["٠٢", "مالي", "تُرتَّب الاعتبارات المالية لدعم تقييم أكثر وضوحًا."],
        ["٠٣", "قانوني", "تُؤخذ الأبعاد القانونية للمشروع في الحسبان ضمن سياقه الأوسع."],
      ],
      workflowLabel: "مسار اتخاذ القرار",
      workflow: [
        ["الفحص الأولي للفرصة", "المراجعة الأولى"],
        ["هيكلة المشروع", "فني ومالي وقانوني"],
        ["مواءمة المستثمر", "الملاءمة المناسبة"],
      ],
    },
    focus: {
      eyebrow: "كيف نُنشئ الوضوح",
      title: "مهيكل لاتخاذ قرارات استثمارية عالمية.",
      description: "يركز عمل الوكالة بصورة رئيسية على جذب الاستثمار الأجنبي المباشر (FDI) والتمويل الخارجي وهيكلة المشاريع من النواحي الفنية والمالية والقانونية، حتى تكون قابلة للتقييم واتخاذ القرار من قبل المستثمرين الدوليين. وفي هذا الإطار، تحدد الوكالة فرص الاستثمار، وتعدّ حزم المشاريع باحتراف، وتطابقها مع المستثمرين المناسبين، بما يجعل عملية الاستثمار شفافة وموثوقة وفعّالة.",
      items: [
        ["الاستثمار الأجنبي المباشر", "تحديد الفرص ودفعها بما يناسب رأس المال الدولي طويل الأجل."],
        ["التمويل الخارجي", "ربط المشاريع المجدية بهياكل التمويل والمسارات المؤسسية المناسبة."],
        ["هيكلة المشاريع", "إعداد الأسس الفنية والمالية والقانونية لتقييم المستثمر بوضوح."],
      ],
    },
    network: {
      eyebrow: "ممارسة مترابطة",
      title: "مرافقة مستمرة من المراجعة الأولى إلى التنفيذ.",
      description: "تستند الوكالة إلى شبكة من الاستشاريين المتخصصين والمؤسسات المالية والبنوك وشركات الاستشارات والشركاء المحليين والدوليين، لمرافقة المستثمرين في جميع المراحل، من التقييم الأولي للفرص إلى إتمام التعاون وتنفيذ المشاريع. كما أن توفير المعلومات المحدّثة، والتحليلات القطاعية، والوصول المنظّم إلى الفرص الاستثمارية، تمثل ركائز أساسية لخدمات الوكالة.",
      commitments: ["معلومات سوق محدّثة", "تحليلات قطاعية", "وصول منظّم إلى الفرص"],
    },
    contact: {
      eyebrow: "تواصل مع DEAL",
      title: "خط مباشر للتواصل مع الوكالة.",
      description: "تواصل مع فريقنا للحديث عن الاستثمار والتمويل وهيكلة المشاريع.",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "هاتف الشركة",
      whatsappLabel: "واتساب",
      addressLabel: "عنوان المكتب",
      address: "طهران، زعفرانية، شارع بيسيان، بجوار جامي الشرقي، رقم ٢٨، مبنى بيدايش، الطابق الرابع، الوحدة ٤٠١، إيران",
      directions: "الحصول على الاتجاهات",
    },
    cta: {
      eyebrow: "لنبنِ بثقة",
      title: "لنجمع رأس المال المناسب والمشروع المناسب في حوار واحد واضح.",
      action: "إرسال طلب تعاون",
    },
    footer: { backHome: "العودة إلى الرئيسية" },
  },
};

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#edc77f]";
const email = "info@dealfdi.com";
const telephone = "+989101114844";
const displayTelephone = "+989101114844";
const whatsappUrl = "https://wa.me/989101114844";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="m-0 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#edc77f]">
      <span className="h-px w-9 bg-[#edc77f]" aria-hidden="true" />
      {children}
    </p>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      className={`${focusRing} group flex min-h-[132px] flex-col justify-between rounded-[22px] border border-[#d8a75c42] bg-[#061218a8] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#edc77f] hover:bg-[#d8a75c14]`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d8a75c52] bg-[#02090e7a] text-[#edc77f] transition duration-300 group-hover:bg-[#edc77f] group-hover:text-[#071016]">
        <Icon size={18} strokeWidth={1.55} aria-hidden="true" />
      </span>
      <span className="mt-5">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#d4d9d899]">{label}</span>
        <span className="mt-2 block break-words text-[15px] font-semibold text-[#f5f3ed]" dir="ltr">{value}</span>
      </span>
    </a>
  );
}

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const params = await searchParams;
  const language = normalizeLanguage(params?.lang);
  const dir = languageDirection(language);
  const isRtl = dir === "rtl";
  const copy = aboutCopy[language];
  const DirectionArrow = isRtl ? ArrowLeft : ArrowRight;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(copy.contact.address)}`;
  const focusIcons = [Target, Landmark, Scale] as const;

  return (
    <div className="min-w-80 overflow-hidden bg-[#02090e] text-[#f4f4f0] [font-family:var(--font-persian)]" lang={language} dir={dir}>
      <header className="absolute inset-x-0 top-0 z-30 flex min-h-[88px] items-start justify-between px-5 pt-5 md:px-[6.25vw] md:pt-7">
        <a className={`${focusRing} block w-[clamp(118px,11vw,174px)] text-[#d8a75c]`} href={withLanguage("/", language)} aria-label="DEAL home">
          <DealStagedLogo className="h-auto w-full" />
        </a>
        <div className="flex items-start gap-5">
          <nav className="hidden items-center gap-7 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d8dcdcb0] xl:flex" aria-label="Primary navigation">
            <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/", language)}>{copy.nav.home}</a>
            <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/#opportunities", language)}>{copy.nav.opportunities}</a>
            <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/sectors", language)}>{copy.nav.sectors}</a>
            <a className={`${focusRing} text-[#edc77f]`} href={withLanguage("/about", language)} aria-current="page">{copy.nav.about}</a>
            <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/team", language)}>{copy.nav.team}</a>
            <a className={`${focusRing} hover:text-[#edc77f]`} href="#contact">{copy.nav.contact}</a>
          </nav>
          <LanguageSwitcher language={language} />
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-[#d8a75c45] bg-[#02090e] px-5 pb-14 pt-[132px] md:min-h-[755px] md:px-[6.25vw] md:pb-20 md:pt-[154px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="absolute inset-y-0 end-0 -z-30 h-full w-full object-cover object-[70%_center] opacity-[.42] brightness-[.52] contrast-[1.14] saturate-[.72] md:w-[65%]" src="/assets/img/azadi-clean.png" alt="" />
          <div className={`absolute inset-0 -z-20 ${isRtl ? "bg-[linear-gradient(270deg,#02090e_0%,rgba(2,9,14,0.98)_38%,rgba(2,9,14,0.7)_62%,rgba(2,9,14,0.18)_100%)]" : "bg-[linear-gradient(90deg,#02090e_0%,rgba(2,9,14,0.98)_38%,rgba(2,9,14,0.7)_62%,rgba(2,9,14,0.18)_100%)]"}`} />
          <div className="pointer-events-none absolute -end-28 top-[19%] -z-10 h-[420px] w-[420px] rounded-full border border-[#edc77f23] shadow-[0_0_0_60px_rgba(216,167,92,0.025),0_0_0_120px_rgba(216,167,92,0.015)]" />
          <div className="pointer-events-none absolute bottom-0 start-[10%] -z-10 h-px w-[min(70vw,900px)] bg-[#d8a75c4a]" />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.93fr)_minmax(320px,0.5fr)] lg:items-end lg:gap-[clamp(48px,7vw,124px)]">
            <div className="max-w-[790px]">
              <div className="mb-9 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#cdd5d39a]">
                <a className={`${focusRing} hover:text-[#edc77f]`} href={withLanguage("/", language)}>{copy.breadcrumb.home}</a>
                <span className="text-[#d8a75c]">/</span>
                <span className="text-[#edc77f]">{copy.breadcrumb.current}</span>
              </div>
              <Eyebrow>{copy.hero.eyebrow}</Eyebrow>
              <h1 className="mt-6 max-w-[780px] text-[clamp(47px,6.2vw,102px)] font-semibold uppercase leading-[0.9] tracking-[-0.065em] text-[#f5f5f1] [text-wrap:balance]">
                {copy.hero.titleLine1}
                <span className="block text-[#edc77f]">{copy.hero.titleLine2}</span>
              </h1>
              <p className="mt-7 max-w-[610px] text-[clamp(15px,1.12vw,19px)] font-light leading-8 text-[#dce1dfb8]">{copy.hero.description}</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a className={`${focusRing} group inline-flex min-h-12 items-center gap-3 rounded-full border border-[#d8a75c82] px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#f5f5f1] transition hover:border-[#edc77f] hover:bg-[#edc77f] hover:text-[#071016]`} href="#about-mandate">
                  {copy.hero.explore}
                  <DirectionArrow className={isRtl ? "transition group-hover:-translate-x-1" : "transition group-hover:translate-x-1"} size={17} />
                </a>
                <a className={`${focusRing} text-[11px] font-semibold uppercase tracking-[0.1em] text-[#edc77f] transition hover:text-[#fff1c8]`} href="#contact">{copy.hero.contact}</a>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-[24px] border border-[#d8a75c5e] bg-[#061116c7] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur-md lg:mb-3">
              <div className="absolute -end-9 -top-9 h-28 w-28 rounded-full border border-[#edc77f3a]" aria-hidden="true" />
              <ShieldCheck className="relative text-[#edc77f]" size={29} strokeWidth={1.35} aria-hidden="true" />
              <p className="relative mt-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#edc77f]">{copy.hero.panelLabel}</p>
              <h2 className="relative mt-3 text-[clamp(25px,2.1vw,35px)] font-semibold leading-[1.03] tracking-[-0.04em] text-[#f4f4f0]">{copy.hero.panelTitle}</h2>
              <p className="relative mt-5 text-sm leading-7 text-[#d4dcdbab]">{copy.hero.panelDescription}</p>
              <span className="relative mt-7 block h-px w-16 bg-[#edc77f]" aria-hidden="true" />
            </aside>
          </div>
        </section>

        <section id="about-mandate" className="relative border-b border-[#d8a75c33] bg-[radial-gradient(circle_at_88%_16%,rgba(216,167,92,0.1),transparent_26rem),#02090e] px-5 py-[clamp(66px,7vw,118px)] md:px-[6.25vw]">
          <div className="grid gap-12 lg:grid-cols-[minmax(260px,0.62fr)_minmax(0,1fr)] lg:gap-[clamp(52px,8vw,150px)]">
            <aside className="lg:pt-2">
              <Eyebrow>{copy.introduction.eyebrow}</Eyebrow>
              <div className="mt-7 rounded-[24px] border border-[#d8a75c42] bg-[#071218] p-6 md:p-8">
                <Globe2 className="text-[#edc77f]" size={32} strokeWidth={1.35} aria-hidden="true" />
                <p className="mt-7 text-[clamp(22px,2vw,33px)] font-semibold leading-[1.14] tracking-[-0.035em] text-[#f4f4f0]">{copy.introduction.distinction}</p>
                <p className="mt-5 text-sm leading-7 text-[#d4dcdbad]">{copy.introduction.distinctionText}</p>
              </div>
            </aside>

            <div>
              <h2 className="max-w-[820px] text-[clamp(34px,4.35vw,70px)] font-semibold leading-[0.96] tracking-[-0.058em] text-[#f4f4f0] [text-wrap:balance]">{copy.introduction.title}</h2>
              <div className="mt-9 grid gap-6 text-[clamp(15px,1.07vw,18px)] font-light leading-8 text-[#d9deddb8]">
                {copy.introduction.paragraphs.map((paragraph) => <p className="m-0" key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="decision-framework-heading" className="relative isolate overflow-hidden border-b border-[#6fa5a03a] bg-[#041116] px-5 py-[clamp(66px,7vw,118px)] md:px-[6.25vw]">
          <div className="pointer-events-none absolute inset-0 -z-20 opacity-70 [background-image:linear-gradient(rgba(111,165,160,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(111,165,160,0.075)_1px,transparent_1px)] [background-size:34px_34px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -end-24 top-10 -z-10 h-72 w-72 rounded-full border border-[#6fa5a032] shadow-[0_0_0_42px_rgba(111,165,160,0.025),0_0_0_84px_rgba(111,165,160,0.015)]" aria-hidden="true" />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.87fr)_minmax(340px,0.55fr)] lg:items-end lg:gap-[clamp(54px,8vw,140px)]">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <Eyebrow>{copy.decisionFramework.eyebrow}</Eyebrow>
                <span className="inline-flex items-center gap-2 border-s border-[#6fa5a065] ps-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9ac8c2]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#91c5bf] shadow-[0_0_0_4px_rgba(111,165,160,0.12)]" aria-hidden="true" />
                  {copy.decisionFramework.signal}
                </span>
              </div>
              <h2 id="decision-framework-heading" className="mt-5 max-w-[790px] text-[clamp(36px,4.45vw,72px)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#f4f4f0] [text-wrap:balance]">{copy.decisionFramework.title}</h2>
              <p className="mt-7 max-w-[760px] text-[clamp(15px,1.08vw,18px)] font-light leading-8 text-[#d5dcdbb4]">{copy.decisionFramework.description}</p>
            </div>

            <div className="rounded-[22px] border border-[#6fa5a04d] bg-[#020b10a8] p-5 md:p-6">
              <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9ac8c2]">{copy.decisionFramework.workflowLabel}</p>
              <div className="relative mt-6">
                <span className="pointer-events-none absolute start-[12%] end-[12%] top-[7px] hidden h-px bg-[#6fa5a040] md:block" aria-hidden="true" />
                <ol className="grid gap-5 p-0 md:grid-cols-3 md:gap-4">
                  {copy.decisionFramework.workflow.map(([title, detail]) => (
                    <li className="relative min-w-0 list-none" key={title}>
                      <span className="mb-4 block h-3 w-3 rounded-full border border-[#91c5bf] bg-[#041116] shadow-[0_0_0_4px_rgba(111,165,160,0.1)]" aria-hidden="true" />
                      <span className="block text-sm font-semibold leading-5 text-[#eef2ed]">{title}</span>
                      <span className="mt-1.5 block text-[11px] leading-5 text-[#b7cbc7]">{detail}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="relative mt-10 grid gap-4 md:grid-cols-3">
            {copy.decisionFramework.perspectives.map(([index, title, description], position) => {
              const Icon = focusIcons[position] ?? Target;

              return (
                <article className="group relative min-h-[220px] overflow-hidden rounded-[22px] border border-[#6fa5a048] bg-[#041016d9] p-6 pb-11 transition duration-500 hover:-translate-y-1 hover:border-[#91c5bf8c] hover:bg-[#07171b]" key={title}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-[#91c5bf]">{index}</span>
                    <span className="relative h-px flex-1 bg-[#6fa5a03d]" aria-hidden="true">
                      <span className="absolute start-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#91c5bf]" />
                    </span>
                  </div>
                  <Icon className="mt-7 text-[#91c5bf]" size={28} strokeWidth={1.35} aria-hidden="true" />
                  <h3 className="mt-6 text-[clamp(20px,1.65vw,27px)] font-semibold leading-[1.08] text-[#f4f4f0]">{title}</h3>
                  <p className="mt-3 max-w-[310px] text-sm leading-7 text-[#c6d6d2a8]">{description}</p>
                  <span className="absolute bottom-5 start-6 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9ac8c2a8]">{copy.decisionFramework.perspectiveLabel}</span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-[#d8a75c33] bg-[#061116] px-5 py-[clamp(66px,7vw,118px)] md:px-[6.25vw]">
          <div className="pointer-events-none absolute -start-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#d8a75c0c] blur-[90px]" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(340px,0.58fr)] lg:items-end">
            <div>
              <Eyebrow>{copy.focus.eyebrow}</Eyebrow>
              <h2 className="mt-5 max-w-[760px] text-[clamp(36px,4.5vw,72px)] font-semibold uppercase leading-[0.94] tracking-[-0.06em] text-[#f4f4f0]">{copy.focus.title}</h2>
            </div>
            <p className="max-w-[620px] text-[clamp(15px,1.06vw,18px)] font-light leading-8 text-[#d5dcdbb0]">{copy.focus.description}</p>
          </div>

          <div className="relative mt-12 grid gap-4 md:grid-cols-3">
            {copy.focus.items.map(([title, description], index) => {
              const Icon = focusIcons[index] ?? Target;

              return (
                <article className="group relative min-h-[260px] overflow-hidden rounded-[24px] border border-[#d8a75c41] bg-[#030c11] p-6 transition duration-500 hover:-translate-y-1 hover:border-[#edc77f7d] hover:bg-[#07151a]" key={title}>
                  <span className="absolute -end-7 -top-7 h-24 w-24 rounded-full border border-[#d8a75c24] transition duration-500 group-hover:scale-125 group-hover:border-[#edc77f52]" aria-hidden="true" />
                  <Icon className="relative text-[#edc77f]" size={31} strokeWidth={1.35} aria-hidden="true" />
                  <p className="relative mt-12 text-[clamp(20px,1.65vw,27px)] font-semibold leading-[1.08] text-[#f4f4f0]">{title}</p>
                  <p className="relative mt-4 text-sm leading-7 text-[#d4dcdb9f]">{description}</p>
                  <span className="absolute bottom-0 start-6 h-px w-0 bg-[#edc77f] transition-[width] duration-500 group-hover:w-16" aria-hidden="true" />
                </article>
              );
            })}
          </div>
        </section>

        <section className="relative border-b border-[#d8a75c33] bg-[radial-gradient(circle_at_76%_24%,rgba(216,167,92,0.12),transparent_25rem),linear-gradient(112deg,#02090e,#071116)] px-5 py-[clamp(66px,7vw,118px)] md:px-[6.25vw]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(300px,0.45fr)] lg:items-center lg:gap-[clamp(52px,8vw,150px)]">
            <div>
              <Eyebrow>{copy.network.eyebrow}</Eyebrow>
              <h2 className="mt-5 max-w-[820px] text-[clamp(36px,4.45vw,72px)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#f4f4f0] [text-wrap:balance]">{copy.network.title}</h2>
              <p className="mt-8 max-w-[800px] text-[clamp(15px,1.08vw,18px)] font-light leading-8 text-[#d8deddb6]">{copy.network.description}</p>
            </div>
            <div className="rounded-[24px] border border-[#d8a75c4b] bg-[#020a0ebd] p-6 md:p-8">
              <Building2 className="text-[#edc77f]" size={31} strokeWidth={1.35} aria-hidden="true" />
              <ul className="mt-8 grid gap-5 p-0">
                {copy.network.commitments.map((commitment) => (
                  <li className="flex items-center gap-3 text-sm font-semibold text-[#edf0ea]" key={commitment}>
                    <CheckCircle2 className="shrink-0 text-[#edc77f]" size={18} strokeWidth={1.5} aria-hidden="true" />
                    {commitment}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="relative isolate overflow-hidden border-b border-[#d8a75c38] bg-[#02090e] px-5 py-[clamp(66px,7vw,118px)] md:px-[6.25vw]">
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_22%_8%,rgba(216,167,92,0.12),transparent_22rem),linear-gradient(145deg,#02090e,#061117)]" />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(420px,0.9fr)] lg:items-end lg:gap-[clamp(48px,7vw,120px)]">
            <div>
              <Eyebrow>{copy.contact.eyebrow}</Eyebrow>
              <h2 className="mt-5 max-w-[650px] text-[clamp(38px,4.7vw,76px)] font-semibold leading-[0.93] tracking-[-0.06em] text-[#f4f4f0] [text-wrap:balance]">{copy.contact.title}</h2>
              <p className="mt-7 max-w-[580px] text-[clamp(15px,1.08vw,18px)] font-light leading-8 text-[#d6dddbb4]">{copy.contact.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ContactCard icon={Mail} label={copy.contact.emailLabel} value={email} href={`mailto:${email}`} />
              <ContactCard icon={Phone} label={copy.contact.phoneLabel} value={displayTelephone} href={`tel:${telephone}`} />
              <ContactCard icon={MessageCircle} label={copy.contact.whatsappLabel} value={displayTelephone} href={whatsappUrl} external />
              <a className={`${focusRing} group flex min-h-[132px] flex-col justify-between rounded-[22px] border border-[#d8a75c42] bg-[#061218a8] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#edc77f] hover:bg-[#d8a75c14]`} href={mapUrl} target="_blank" rel="noreferrer">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d8a75c52] bg-[#02090e7a] text-[#edc77f] transition duration-300 group-hover:bg-[#edc77f] group-hover:text-[#071016]"><MapPin size={18} strokeWidth={1.55} aria-hidden="true" /></span>
                <span className="mt-5">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#d4d9d899]">{copy.contact.addressLabel}</span>
                  <span className="mt-2 block text-sm font-semibold text-[#f5f3ed]">{copy.contact.directions}</span>
                </span>
              </a>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-[#d8a75c42] bg-[#0612188a] p-6 md:flex md:items-center md:justify-between md:gap-10 md:p-8">
            <div className="flex gap-4">
              <MapPin className="mt-1 shrink-0 text-[#edc77f]" size={22} strokeWidth={1.45} aria-hidden="true" />
              <div>
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#edc77f]">{copy.contact.addressLabel}</p>
                <address className="mt-3 max-w-3xl not-italic text-[clamp(14px,1vw,17px)] leading-8 text-[#e2e6e1c4]">{copy.contact.address}</address>
              </div>
            </div>
            <a className={`${focusRing} group mt-6 inline-flex min-h-11 shrink-0 items-center gap-3 rounded-full border border-[#d8a75c78] px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#edc77f] transition hover:bg-[#edc77f] hover:text-[#071016] md:mt-0`} href={mapUrl} target="_blank" rel="noreferrer">
              {copy.contact.directions}
              <ArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={16} />
            </a>
          </div>
        </section>

        <section className="border-b border-[#d8a75c38] bg-[#071419] px-5 py-[clamp(58px,6vw,96px)] md:px-[6.25vw]">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <Eyebrow>{copy.cta.eyebrow}</Eyebrow>
              <h2 className="mt-5 max-w-[850px] text-[clamp(35px,4.5vw,72px)] font-semibold leading-[0.94] tracking-[-0.06em] text-[#f4f4f0] [text-wrap:balance]">{copy.cta.title}</h2>
            </div>
            <CollaborationRequestLauncher className={`${focusRing} group inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-[#edc77f] px-7 text-sm font-bold uppercase tracking-[0.07em] text-[#071016] transition hover:-translate-y-1 hover:bg-[#f4d99d]`}>
              {copy.cta.action}
              <DirectionArrow className={isRtl ? "transition group-hover:-translate-x-1" : "transition group-hover:translate-x-1"} size={18} />
            </CollaborationRequestLauncher>
          </div>
        </section>
      </main>

      <CollaborationRequestButton language={language} showTrigger={false} />

      <footer className="flex flex-wrap items-center justify-between gap-5 bg-[#02090e] px-5 py-9 md:px-[6.25vw]">
        <DealStagedLogo className="h-auto w-[clamp(118px,10vw,165px)] text-[#d8a75c]" />
        <a className={`${focusRing} inline-flex items-center gap-2 text-sm text-[#cdd1d194] transition hover:text-[#edc77f]`} href={withLanguage("/", language)}>
          <ArrowLeft className={isRtl ? "rotate-180" : ""} size={16} />
          {copy.footer.backHome}
        </a>
      </footer>
    </div>
  );
}
