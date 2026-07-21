export const languages = [
  { code: "fa", short: "FA", label: "فارسی", flag: "/flag/fa.svg", dir: "rtl" },
  { code: "en", short: "EN", label: "English", flag: "/flag/en.svg", dir: "ltr" },
  { code: "ar", short: "AR", label: "العربية", flag: "/flag/ar.svg", dir: "rtl" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];
export type LanguageDirection = (typeof languages)[number]["dir"];

export const defaultLanguage: LanguageCode = "en";
export const languageParamName = "lang";

const languageCodes = new Set<string>(languages.map((language) => language.code));

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === "string" && languageCodes.has(value);
}

export function normalizeLanguage(value: unknown): LanguageCode {
  return isLanguageCode(value) ? value : defaultLanguage;
}

export function languageDirection(language: LanguageCode): LanguageDirection {
  return languages.find((item) => item.code === language)?.dir ?? "ltr";
}

export function languageLabel(language: LanguageCode) {
  return languages.find((item) => item.code === language)?.label ?? "English";
}

export function withLanguage(path: string, language: LanguageCode) {
  const [pathAndQuery, hash] = path.split("#");
  const [pathname, queryString] = pathAndQuery.split("?");
  const params = new URLSearchParams(queryString);

  params.set(languageParamName, language);

  return `${pathname}?${params.toString()}${hash ? `#${hash}` : ""}`;
}

export const languageSwitcherCopy: Record<LanguageCode, { changeLanguage: string; websiteLanguage: string }> = {
  en: {
    changeLanguage: "Change language",
    websiteLanguage: "Website language",
  },
  fa: {
    changeLanguage: "تغییر زبان",
    websiteLanguage: "زبان سایت",
  },
  ar: {
    changeLanguage: "تغيير اللغة",
    websiteLanguage: "لغة الموقع",
  },
};

export const homeCopy = {
  en: {
    navigation: [
      { label: "Home", target: "home" },
      { label: "Opportunities", target: "opportunities" },
      { label: "Sectors", target: "sectors" },
      { label: "About Us", target: "about-us" },
      { label: "Insights", target: "insights" },
      { label: "Contact", target: "contact" },
    ],
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    scroll: "Scroll to discover",
    hero: {
      kicker: "Invest in opportunity",
      line1: "Connecting",
      line2: "global capital",
      line3: "with",
      emphasis1: "Iran's",
      emphasis2: "strategic future",
      description: "DEAL is your trusted partner for accessing high-potential investment opportunities across Iran's most dynamic sectors.",
    },
    stats: ["Capital Facilitated", "Active Projects", "Countries Connected", "Years of Excellence"],
    sectors: {
      kicker: "Investment sectors",
      titleLine1: "Diverse sectors.",
      titleLine2: "Limitless opportunities.",
      description: "From energy and infrastructure to technology and agriculture, discover high-growth sectors driving Iran's economic future.",
      previous: "Previous investment sector",
      next: "Next investment sector",
      emptyTitle: "No published content in this language yet",
      emptyText: "Choose another language or publish a sector for this language from the admin panel.",
    },
    footer: {
      groups: [
        { title: "Company", links: ["About Us", "Our Team", "Careers", "News"] },
        { title: "Opportunities", links: ["All Projects", "For Investors", "For Partners", "How It Works"] },
        { title: "Resources", links: ["Reports", "Insights", "Media Center", "FAQs"] },
      ],
      contact: "Contact",
      location: "Tehran, Iran",
      stayUpdated: "Stay updated",
      subscribe: "Subscribe to our newsletter",
      emailPlaceholder: "Your email address",
      subscribeLabel: "Subscribe",
      copyright: "© 2026 DEAL. All Rights Reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
    },
  },
  fa: {
    navigation: [
      { label: "خانه", target: "home" },
      { label: "فرصت‌ها", target: "opportunities" },
      { label: "بخش‌ها", target: "sectors" },
      { label: "درباره ما", target: "about-us" },
      { label: "بینش‌ها", target: "insights" },
      { label: "تماس", target: "contact" },
    ],
    menu: "منو",
    openMenu: "باز کردن منو",
    closeMenu: "بستن منو",
    scroll: "برای ادامه اسکرول کنید",
    hero: {
      kicker: "سرمایه‌گذاری در فرصت",
      line1: "پیوند",
      line2: "سرمایه جهانی",
      line3: "با",
      emphasis1: "ایران",
      emphasis2: "و آینده راهبردی آن",
      description: "DEAL شریک قابل اعتماد شما برای دسترسی به فرصت‌های سرمایه‌گذاری پرظرفیت در پویاترین بخش‌های ایران است.",
    },
    stats: ["سرمایه تسهیل‌شده", "پروژه فعال", "کشور متصل", "سال تجربه"],
    sectors: {
      kicker: "بخش‌های سرمایه‌گذاری",
      titleLine1: "بخش‌های متنوع.",
      titleLine2: "فرصت‌های نامحدود.",
      description: "از انرژی و زیرساخت تا فناوری و کشاورزی، بخش‌های پربازده شکل‌دهنده آینده اقتصادی ایران را کشف کنید.",
      previous: "بخش قبلی سرمایه‌گذاری",
      next: "بخش بعدی سرمایه‌گذاری",
      emptyTitle: "هنوز محتوای منتشرشده‌ای برای این زبان وجود ندارد",
      emptyText: "زبان دیگری را انتخاب کنید یا از پنل مدیریت برای این زبان مطلب منتشر کنید.",
    },
    footer: {
      groups: [
        { title: "شرکت", links: ["درباره ما", "تیم ما", "فرصت‌های شغلی", "اخبار"] },
        { title: "فرصت‌ها", links: ["همه پروژه‌ها", "برای سرمایه‌گذاران", "برای شرکا", "نحوه همکاری"] },
        { title: "منابع", links: ["گزارش‌ها", "بینش‌ها", "مرکز رسانه", "پرسش‌ها"] },
      ],
      contact: "تماس",
      location: "تهران، ایران",
      stayUpdated: "دریافت خبرها",
      subscribe: "عضویت در خبرنامه",
      emailPlaceholder: "نشانی ایمیل",
      subscribeLabel: "عضویت",
      copyright: "© 2026 DEAL. همه حقوق محفوظ است.",
      privacy: "حریم خصوصی",
      terms: "شرایط استفاده",
    },
  },
  ar: {
    navigation: [
      { label: "الرئيسية", target: "home" },
      { label: "الفرص", target: "opportunities" },
      { label: "القطاعات", target: "sectors" },
      { label: "من نحن", target: "about-us" },
      { label: "الرؤى", target: "insights" },
      { label: "اتصال", target: "contact" },
    ],
    menu: "القائمة",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    scroll: "مرر للاستكشاف",
    hero: {
      kicker: "استثمر في الفرص",
      line1: "نصل",
      line2: "رأس المال العالمي",
      line3: "بـ",
      emphasis1: "إيران",
      emphasis2: "ومستقبلها الاستراتيجي",
      description: "DEAL شريكك الموثوق للوصول إلى فرص استثمارية واعدة في أكثر قطاعات إيران ديناميكية.",
    },
    stats: ["رأس مال ميسر", "مشروع نشط", "دولة متصلة", "عاما من الخبرة"],
    sectors: {
      kicker: "قطاعات الاستثمار",
      titleLine1: "قطاعات متنوعة.",
      titleLine2: "فرص بلا حدود.",
      description: "من الطاقة والبنية التحتية إلى التكنولوجيا والزراعة، اكتشف القطاعات عالية النمو التي تقود مستقبل إيران الاقتصادي.",
      previous: "قطاع الاستثمار السابق",
      next: "قطاع الاستثمار التالي",
      emptyTitle: "لا يوجد محتوى منشور بهذه اللغة بعد",
      emptyText: "اختر لغة أخرى أو انشر قطاعا لهذه اللغة من لوحة الإدارة.",
    },
    footer: {
      groups: [
        { title: "الشركة", links: ["من نحن", "فريقنا", "الوظائف", "الأخبار"] },
        { title: "الفرص", links: ["كل المشاريع", "للمستثمرين", "للشركاء", "آلية العمل"] },
        { title: "الموارد", links: ["التقارير", "الرؤى", "المركز الإعلامي", "الأسئلة"] },
      ],
      contact: "اتصال",
      location: "طهران، إيران",
      stayUpdated: "ابق على اطلاع",
      subscribe: "اشترك في النشرة",
      emailPlaceholder: "البريد الإلكتروني",
      subscribeLabel: "اشتراك",
      copyright: "© 2026 DEAL. جميع الحقوق محفوظة.",
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام",
    },
  },
} satisfies Record<LanguageCode, unknown>;

export const corporateCopy = {
  en: {
    why: {
      kicker: "Why invest in Iran",
      titleLine1: "A land of potential.",
      titleLine2: "A partner you can trust.",
    },
    benefits: [
      ["Strategic Location", "Gateway between global markets across Asia, Europe & Middle East."],
      ["Strong Government Support", "Pro-investment policies and incentives for foreign investors."],
      ["Skilled Workforce", "Highly educated and dynamic human capital."],
      ["Growing Economy", "Resilient growth and expanding opportunities across sectors."],
      ["Competitive Advantage", "Resource-rich economy with a favorable investment climate."],
      ["Proven Track Record", "A legacy of successful partnerships and long-term value creation."],
    ],
    leadership: {
      kicker: "Leadership",
      titleLine1: "Experienced leaders.",
      titleLine2: "Committed to your success.",
      description: "Our leadership team brings decades of expertise in investment, finance, and international business to guide your journey with confidence.",
      cta: "Meet the team",
      next: "Next leadership profile",
      labels: ["DEAL senior executive", "DEAL investment executive", "DEAL strategy executive", "DEAL partnerships executive"],
    },
    partners: {
      kicker: "Partnering for impact",
      titleLine1: "Trusted by global partners.",
      titleLine2: "Driven by shared vision.",
      carouselLabel: "Selected global partners",
    },
    testimonials: [
      ["DEAL has been an exceptional partner in navigating the Iranian market. Their insights, network, and commitment to excellence are unmatched.", "Global Infrastructure Partner"],
      ["Their sector knowledge and disciplined investment process helped us identify opportunities with real long-term value.", "International Growth Partner"],
      ["The team connected us with the right decision makers and kept every stage clear, focused, and commercially grounded.", "Strategic Capital Partner"],
    ],
    cta: {
      kicker: "Let's build together",
      titleLine1: "Ready to unlock",
      titleLine2: "extraordinary opportunities?",
      action: "Start your journey",
    },
  },
  fa: {
    why: {
      kicker: "چرا سرمایه‌گذاری در ایران",
      titleLine1: "سرزمینی پرظرفیت.",
      titleLine2: "شریکی قابل اعتماد.",
    },
    benefits: [
      ["موقعیت راهبردی", "دروازه ارتباطی میان بازارهای آسیا، اروپا و خاورمیانه."],
      ["حمایت جدی دولت", "سیاست‌ها و مشوق‌های سرمایه‌گذاری برای سرمایه‌گذاران خارجی."],
      ["نیروی انسانی متخصص", "سرمایه انسانی تحصیل‌کرده، پویا و آماده رشد."],
      ["اقتصاد رو به رشد", "رشد پایدار و فرصت‌های رو به گسترش در بخش‌های مختلف."],
      ["مزیت رقابتی", "اقتصادی غنی از منابع با فضای مناسب برای سرمایه‌گذاری."],
      ["سابقه قابل اتکا", "تجربه همکاری‌های موفق و خلق ارزش بلندمدت."],
    ],
    leadership: {
      kicker: "رهبری",
      titleLine1: "رهبران باتجربه.",
      titleLine2: "متعهد به موفقیت شما.",
      description: "تیم رهبری ما با دهه‌ها تجربه در سرمایه‌گذاری، مالی و تجارت بین‌الملل، مسیر شما را با اطمینان هدایت می‌کند.",
      cta: "آشنایی با تیم",
      next: "پروفایل بعدی رهبری",
      labels: ["مدیر ارشد DEAL", "مدیر سرمایه‌گذاری DEAL", "مدیر راهبرد DEAL", "مدیر مشارکت‌های DEAL"],
    },
    partners: {
      kicker: "همکاری برای اثرگذاری",
      titleLine1: "مورد اعتماد شرکای جهانی.",
      titleLine2: "پیش‌ران با چشم‌انداز مشترک.",
      carouselLabel: "شرکای منتخب جهانی",
    },
    testimonials: [
      ["DEAL در شناخت بازار ایران شریکی ممتاز بوده است؛ بینش، شبکه و تعهد تیم آن کم‌نظیر است.", "شریک جهانی زیرساخت"],
      ["شناخت بخشی و فرآیند سرمایه‌گذاری منظم آنها به ما کمک کرد فرصت‌هایی با ارزش بلندمدت واقعی پیدا کنیم.", "شریک رشد بین‌المللی"],
      ["تیم DEAL ما را به تصمیم‌گیران درست وصل کرد و هر مرحله را شفاف، متمرکز و تجاری پیش برد.", "شریک سرمایه راهبردی"],
    ],
    cta: {
      kicker: "با هم بسازیم",
      titleLine1: "آماده کشف",
      titleLine2: "فرصت‌های بزرگ هستید؟",
      action: "شروع مسیر",
    },
  },
  ar: {
    why: {
      kicker: "لماذا الاستثمار في إيران",
      titleLine1: "أرض مليئة بالإمكانات.",
      titleLine2: "وشريك يمكنك الوثوق به.",
    },
    benefits: [
      ["موقع استراتيجي", "بوابة بين الأسواق العالمية في آسيا وأوروبا والشرق الأوسط."],
      ["دعم حكومي قوي", "سياسات وحوافز داعمة للاستثمار الأجنبي."],
      ["قوى عاملة ماهرة", "رأس مال بشري متعلم وديناميكي."],
      ["اقتصاد نام", "نمو مرن وفرص متوسعة عبر القطاعات."],
      ["ميزة تنافسية", "اقتصاد غني بالموارد وبيئة مواتية للاستثمار."],
      ["سجل مثبت", "إرث من الشراكات الناجحة وخلق القيمة طويلة الأجل."],
    ],
    leadership: {
      kicker: "القيادة",
      titleLine1: "قادة ذوو خبرة.",
      titleLine2: "ملتزمون بنجاحك.",
      description: "يجمع فريق القيادة لدينا عقودا من الخبرة في الاستثمار والتمويل والأعمال الدولية لقيادة رحلتك بثقة.",
      cta: "تعرف على الفريق",
      next: "الملف القيادي التالي",
      labels: ["تنفيذي أول في DEAL", "تنفيذي استثمار في DEAL", "تنفيذي استراتيجية في DEAL", "تنفيذي شراكات في DEAL"],
    },
    partners: {
      kicker: "شراكة من أجل الأثر",
      titleLine1: "موثوقون لدى شركاء عالميين.",
      titleLine2: "مدفوعون برؤية مشتركة.",
      carouselLabel: "شركاء عالميون مختارون",
    },
    testimonials: [
      ["كانت DEAL شريكا استثنائيا في فهم السوق الإيرانية؛ رؤاهم وشبكتهم والتزامهم بالتميز لا يضاهى.", "شريك بنية تحتية عالمي"],
      ["ساعدتنا معرفتهم القطاعية وعملية الاستثمار المنضبطة على تحديد فرص ذات قيمة طويلة الأجل.", "شريك نمو دولي"],
      ["وصلنا الفريق بصناع القرار المناسبين وحافظ على وضوح كل مرحلة وتركيزها التجاري.", "شريك رأس مال استراتيجي"],
    ],
    cta: {
      kicker: "لنبن معا",
      titleLine1: "هل أنت مستعد لفتح",
      titleLine2: "فرص استثنائية؟",
      action: "ابدأ رحلتك",
    },
  },
} satisfies Record<LanguageCode, unknown>;

export const sectorsPageCopy = {
  en: {
    title: "Investment Sectors | DEAL",
    description: "Explore DEAL investment sectors across energy, infrastructure, technology, industry, agriculture, tourism, and strategic opportunities in Iran.",
    nav: { home: "Home", sectors: "Sectors", opportunities: "Opportunities", contact: "Contact" },
    breadcrumb: { home: "Home", sectors: "Sectors" },
    hero: {
      kicker: "Investment sectors",
      titleLine1: "Diverse sectors.",
      titleLine2: "Limitless opportunities.",
      description: "Discover high-growth sectors driving Iran's strategic future. Each sector page is dynamically managed from the admin dashboard and optimized for search, clarity, and investor confidence.",
    },
    stats: ["Published sectors", "Countries connected", "Active projects"],
    list: {
      kicker: "Explore all opportunities",
      title: "Built for investors who need clear, focused entry points.",
      description: "Every card below is connected to the sector editor. Update title, SEO description, featured image, content blocks, categories, language, and status from admin, and this page refreshes automatically.",
      fallbackCategory: "Investment sector",
      emptyTitle: "No published sectors in this language yet",
      emptyText: "Publish a sector for this language from the admin dashboard and it will appear here automatically.",
    },
    cta: {
      kicker: "Let's build together",
      title: "Ready to unlock extraordinary opportunities?",
      action: "Start your journey",
    },
    footer: { backHome: "Back to homepage" },
  },
  fa: {
    title: "بخش‌های سرمایه‌گذاری | DEAL",
    description: "بخش‌های سرمایه‌گذاری DEAL در انرژی، زیرساخت، فناوری، صنعت، کشاورزی، گردشگری و فرصت‌های راهبردی ایران را بررسی کنید.",
    nav: { home: "خانه", sectors: "بخش‌ها", opportunities: "فرصت‌ها", contact: "تماس" },
    breadcrumb: { home: "خانه", sectors: "بخش‌ها" },
    hero: {
      kicker: "بخش‌های سرمایه‌گذاری",
      titleLine1: "بخش‌های متنوع.",
      titleLine2: "فرصت‌های نامحدود.",
      description: "بخش‌های پربازده و شکل‌دهنده آینده راهبردی ایران را کشف کنید. هر صفحه از داشبورد مدیریت کنترل می‌شود و برای وضوح، جستجو و اعتماد سرمایه‌گذار آماده است.",
    },
    stats: ["بخش منتشرشده", "کشور متصل", "پروژه فعال"],
    list: {
      kicker: "همه فرصت‌ها",
      title: "طراحی‌شده برای سرمایه‌گذارانی که نقطه ورود روشن و متمرکز می‌خواهند.",
      description: "هر کارت به ادیتور بخش متصل است. عنوان، توضیح سئو، تصویر شاخص، بلوک‌های محتوا، دسته‌ها، زبان و وضعیت را از ادمین تغییر دهید.",
      fallbackCategory: "بخش سرمایه‌گذاری",
      emptyTitle: "هنوز بخشی برای این زبان منتشر نشده است",
      emptyText: "از داشبورد مدیریت برای این زبان بخش منتشر کنید تا اینجا نمایش داده شود.",
    },
    cta: {
      kicker: "با هم بسازیم",
      title: "آماده کشف فرصت‌های بزرگ هستید؟",
      action: "شروع مسیر",
    },
    footer: { backHome: "بازگشت به خانه" },
  },
  ar: {
    title: "قطاعات الاستثمار | DEAL",
    description: "استكشف قطاعات الاستثمار لدى DEAL في الطاقة والبنية التحتية والتكنولوجيا والصناعة والزراعة والسياحة والفرص الاستراتيجية في إيران.",
    nav: { home: "الرئيسية", sectors: "القطاعات", opportunities: "الفرص", contact: "اتصال" },
    breadcrumb: { home: "الرئيسية", sectors: "القطاعات" },
    hero: {
      kicker: "قطاعات الاستثمار",
      titleLine1: "قطاعات متنوعة.",
      titleLine2: "فرص بلا حدود.",
      description: "اكتشف القطاعات عالية النمو التي تقود مستقبل إيران الاستراتيجي. كل صفحة تدار ديناميكيا من لوحة الإدارة وتجهز للوضوح والبحث وثقة المستثمر.",
    },
    stats: ["قطاعات منشورة", "دولة متصلة", "مشاريع نشطة"],
    list: {
      kicker: "استكشف كل الفرص",
      title: "مصممة للمستثمرين الذين يحتاجون إلى نقاط دخول واضحة ومركزة.",
      description: "كل بطاقة متصلة بمحرر القطاع. يمكنك تحديث العنوان ووصف البحث والصورة والكتل والفئات واللغة والحالة من لوحة الإدارة.",
      fallbackCategory: "قطاع استثماري",
      emptyTitle: "لا توجد قطاعات منشورة بهذه اللغة بعد",
      emptyText: "انشر قطاعا لهذه اللغة من لوحة الإدارة ليظهر هنا تلقائيا.",
    },
    cta: {
      kicker: "لنبن معا",
      title: "هل أنت مستعد لفتح فرص استثنائية؟",
      action: "ابدأ رحلتك",
    },
    footer: { backHome: "العودة إلى الرئيسية" },
  },
} satisfies Record<LanguageCode, unknown>;

export const sectorDetailCopy = {
  en: {
    notFoundTitle: "Sector not found | DEAL",
    nav: { home: "Home", sectors: "Sectors", contact: "Contact" },
    breadcrumb: { home: "Home", sectors: "Sectors" },
    kicker: "Investment sector",
    cards: { sector: "Sector", market: "Market", marketValue: "Iran", status: "Status", statusValue: "Open for partners" },
    brief: "Opportunity brief",
    fallbackCta: "Start your journey",
    related: {
      kicker: "More sectors",
      title: "Explore related opportunities",
      all: "All sectors",
      view: "View sector",
    },
    footer: { backHome: "Back to homepage" },
    metadataSuffix: "Investment Opportunities",
  },
  fa: {
    notFoundTitle: "بخش پیدا نشد | DEAL",
    nav: { home: "خانه", sectors: "بخش‌ها", contact: "تماس" },
    breadcrumb: { home: "خانه", sectors: "بخش‌ها" },
    kicker: "بخش سرمایه‌گذاری",
    cards: { sector: "بخش", market: "بازار", marketValue: "ایران", status: "وضعیت", statusValue: "آماده همکاری" },
    brief: "خلاصه فرصت",
    fallbackCta: "شروع مسیر",
    related: {
      kicker: "بخش‌های بیشتر",
      title: "فرصت‌های مرتبط را ببینید",
      all: "همه بخش‌ها",
      view: "مشاهده بخش",
    },
    footer: { backHome: "بازگشت به خانه" },
    metadataSuffix: "فرصت‌های سرمایه‌گذاری",
  },
  ar: {
    notFoundTitle: "القطاع غير موجود | DEAL",
    nav: { home: "الرئيسية", sectors: "القطاعات", contact: "اتصال" },
    breadcrumb: { home: "الرئيسية", sectors: "القطاعات" },
    kicker: "قطاع استثماري",
    cards: { sector: "القطاع", market: "السوق", marketValue: "إيران", status: "الحالة", statusValue: "مفتوح للشركاء" },
    brief: "ملخص الفرصة",
    fallbackCta: "ابدأ رحلتك",
    related: {
      kicker: "قطاعات أخرى",
      title: "استكشف فرصا مرتبطة",
      all: "كل القطاعات",
      view: "عرض القطاع",
    },
    footer: { backHome: "العودة إلى الرئيسية" },
    metadataSuffix: "فرص استثمارية",
  },
} satisfies Record<LanguageCode, unknown>;
