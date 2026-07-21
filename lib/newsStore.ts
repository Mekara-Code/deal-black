import "server-only";

import { query } from "@/lib/database";
import type { LanguageCode } from "@/lib/i18n";

export type NewsTranslation = {
  category: string;
  title: string;
  excerpt: string;
  body: string[];
  imageAlt: string;
};

export type NewsArticle = {
  id: string;
  slug: string;
  imageUrl: string;
  publishedAt: string;
  readingMinutes: number;
  translations: Record<LanguageCode, NewsTranslation>;
};

export type NewsArticlePreview = Pick<NewsArticle, "id" | "slug" | "imageUrl" | "publishedAt" | "readingMinutes"> & Pick<NewsTranslation, "category" | "title" | "excerpt" | "imageAlt">;

export type LocalizedNewsArticle = NewsArticlePreview & Pick<NewsTranslation, "body">;

const newsArticles: NewsArticle[] = [
  {
    id: "energy-transition-projects",
    slug: "energy-transition-projects",
    imageUrl: "/uploads/sectors/energy/featured/energy-investment-iran.png",
    publishedAt: "2026-07-15T08:00:00.000Z",
    readingMinutes: 4,
    translations: {
      en: {
        category: "Energy brief",
        title: "From capacity to bankability: preparing energy projects for international capital",
        excerpt: "A practical look at the technical, contractual and reporting signals that help energy opportunities move from interest to investment review.",
        body: ["Capital follows clarity. For energy projects, that clarity begins with a coherent technical baseline, a credible route to revenue and a decision-ready allocation of risk.", "The strongest project packages combine a disciplined data room with a realistic implementation schedule, measurable operating assumptions and an ownership structure that can be understood quickly by international counterparties.", "For investors, the central question is not only whether demand exists. It is whether the project can demonstrate durable cash-flow logic, governance discipline and a pathway to execution."],
        imageAlt: "Energy infrastructure at sunset",
      },
      fa: {
        category: "گزارش انرژی",
        title: "از ظرفیت تا قابلیت تأمین مالی؛ آماده‌سازی پروژه‌های انرژی برای سرمایه بین‌المللی",
        excerpt: "نگاهی کاربردی به نشانه‌های فنی، قراردادی و گزارش‌دهی که یک فرصت انرژی را از مرحله علاقه‌مندی به بررسی سرمایه‌گذاری می‌رساند.",
        body: ["سرمایه به سمت شفافیت حرکت می‌کند. در پروژه‌های انرژی، این شفافیت با یک مبنای فنی منسجم، مسیر درآمدی قابل اتکا و تقسیم ریسکِ آماده تصمیم‌گیری آغاز می‌شود.", "بسته‌های حرفه‌ای پروژه، اتاق داده منظم را با برنامه اجرایی واقع‌بینانه، فرض‌های عملیاتی قابل سنجش و ساختار مالکیتی قابل فهم برای طرف‌های بین‌المللی همراه می‌کنند.", "برای سرمایه‌گذار، پرسش اصلی تنها وجود تقاضا نیست؛ بلکه توان پروژه در اثبات منطق پایدار جریان نقد، انضباط حاکمیتی و مسیر روشن اجراست."],
        imageAlt: "زیرساخت انرژی در غروب",
      },
      ar: {
        category: "موجز الطاقة",
        title: "من القدرة إلى قابلية التمويل: تجهيز مشاريع الطاقة لرأس المال الدولي",
        excerpt: "نظرة عملية إلى الإشارات الفنية والتعاقدية والتقريرية التي تنقل فرصة الطاقة من الاهتمام الأولي إلى مراجعة الاستثمار.",
        body: ["يتبع رأس المال الوضوح. وفي مشاريع الطاقة يبدأ هذا الوضوح بخط أساس فني متماسك، ومسار إيراد موثوق وتوزيع للمخاطر جاهز لاتخاذ القرار.", "تجمع حزم المشاريع القوية بين غرفة بيانات منظمة وجدول تنفيذ واقعي وافتراضات تشغيل قابلة للقياس وهيكل ملكية يمكن للأطراف الدولية فهمه بسرعة.", "السؤال المحوري للمستثمر لا يقتصر على وجود الطلب، بل على قدرة المشروع على إثبات منطق تدفقات نقدية مستدامة وانضباط حوكمة ومسار واضح للتنفيذ."],
        imageAlt: "بنية تحتية للطاقة عند الغروب",
      },
    },
  },
  {
    id: "healthcare-investment-readiness",
    slug: "healthcare-investment-readiness",
    imageUrl: "/uploads/sectors/medical-investment-in-iran/featured/healthcare-investment-iran.png",
    publishedAt: "2026-07-08T08:00:00.000Z",
    readingMinutes: 5,
    translations: {
      en: {
        category: "Healthcare",
        title: "Healthcare investment readiness starts with operational evidence",
        excerpt: "Why credible demand mapping, clinical governance and phased scale-up matter when evaluating healthcare opportunities.",
        body: ["Healthcare opportunities are evaluated through more than a market-size estimate. Investors need a view of patient pathways, service capacity, clinical quality controls and the operating team behind the plan.", "A phased growth model can make the investment case clearer: establish proof of demand, build repeatable operations, then expand services or geography with evidence rather than assumption.", "The result is a project narrative that speaks to both impact and commercial durability."],
        imageAlt: "Modern healthcare investment environment",
      },
      fa: {
        category: "سلامت و درمان",
        title: "آمادگی سرمایه‌گذاری در سلامت از شواهد عملیاتی آغاز می‌شود",
        excerpt: "چرا نقشه‌برداری معتبر تقاضا، حاکمیت بالینی و توسعه مرحله‌ای در ارزیابی فرصت‌های سلامت اهمیت دارند.",
        body: ["فرصت‌های سلامت تنها با برآورد اندازه بازار ارزیابی نمی‌شوند. سرمایه‌گذار باید مسیر دریافت خدمت، ظرفیت ارائه، کنترل‌های کیفیت بالینی و تیم عملیاتی پشت برنامه را ببیند.", "مدل رشد مرحله‌ای می‌تواند منطق سرمایه‌گذاری را روشن‌تر کند: ابتدا تقاضا اثبات شود، سپس عملیات تکرارپذیر ساخته شود و بعد خدمات یا جغرافیا بر مبنای شواهد توسعه یابد.", "حاصل، روایت پروژه‌ای است که هم از اثرگذاری و هم از پایداری تجاری سخن می‌گوید."],
        imageAlt: "محیط سرمایه‌گذاری سلامت مدرن",
      },
      ar: {
        category: "الرعاية الصحية",
        title: "جاهزية الاستثمار الصحي تبدأ بالأدلة التشغيلية",
        excerpt: "لماذا يهم رسم خريطة الطلب الموثوق والحوكمة السريرية والتوسع المرحلي عند تقييم فرص الرعاية الصحية.",
        body: ["لا تُقيَّم فرص الرعاية الصحية بتقدير حجم السوق وحده. يحتاج المستثمر إلى رؤية لمسارات المرضى وطاقة تقديم الخدمة وضوابط الجودة السريرية والفريق التشغيلي خلف الخطة.", "يمكن لنموذج النمو المرحلي أن يجعل حالة الاستثمار أوضح: إثبات الطلب أولاً، ثم بناء عمليات قابلة للتكرار، وبعدها توسيع الخدمات أو النطاق الجغرافي بالأدلة لا بالافتراضات.", "والنتيجة سردية مشروع تتحدث عن الأثر والقدرة التجارية على الاستمرار معاً."],
        imageAlt: "بيئة استثمار حديثة في الرعاية الصحية",
      },
    },
  },
  {
    id: "infrastructure-corridor-value",
    slug: "infrastructure-corridor-value",
    imageUrl: "/uploads/sectors/infrastructure/featured/infrastructure-investment-iran.png",
    publishedAt: "2026-06-27T08:00:00.000Z",
    readingMinutes: 4,
    translations: {
      en: {
        category: "Infrastructure",
        title: "Infrastructure value is created across the corridor, not only at the asset",
        excerpt: "A project lens that connects logistics demand, service reliability and adjacent commercial activity.",
        body: ["The most compelling infrastructure cases explain the system around the asset. They connect freight flows, user demand, service reliability and the commercial activity that benefits from better access.", "This wider lens helps sponsors define measurable outcomes and enables investors to test assumptions beyond a single construction budget.", "A well-structured corridor story can therefore turn an isolated asset into a platform for long-term economic participation."],
        imageAlt: "Strategic transport infrastructure",
      },
      fa: {
        category: "زیرساخت",
        title: "ارزش زیرساخت در سراسر کریدور ساخته می‌شود، نه فقط در یک دارایی",
        excerpt: "نگاهی به پروژه که تقاضای لجستیکی، قابلیت اتکای خدمت و فعالیت تجاری پیرامونی را به هم متصل می‌کند.",
        body: ["قانع‌کننده‌ترین پرونده‌های زیرساختی، سامانه پیرامون دارایی را توضیح می‌دهند؛ جریان بار، تقاضای استفاده‌کننده، قابلیت اتکای خدمت و فعالیت تجاری منتفع از دسترسی بهتر.", "این نگاه گسترده‌تر به حامیان پروژه کمک می‌کند نتایج قابل سنجش تعریف کنند و به سرمایه‌گذار امکان می‌دهد فرض‌ها را فراتر از بودجه ساخت یک دارایی بیازماید.", "روایت یک کریدورِ ساختاریافته می‌تواند یک دارایی منفرد را به بستری برای مشارکت اقتصادی بلندمدت تبدیل کند."],
        imageAlt: "زیرساخت حمل‌ونقل راهبردی",
      },
      ar: {
        category: "البنية التحتية",
        title: "تتكوّن قيمة البنية التحتية عبر الممر كله لا عند الأصل وحده",
        excerpt: "منظور للمشروع يربط طلب الخدمات اللوجستية وموثوقية الخدمة والنشاط التجاري المجاور.",
        body: ["تشرح حالات البنية التحتية الأكثر إقناعاً المنظومة المحيطة بالأصل: تدفقات الشحن وطلب المستخدمين وموثوقية الخدمة والنشاط التجاري المستفيد من الوصول الأفضل.", "يساعد هذا المنظور الأوسع رعاة المشروع على تحديد نتائج قابلة للقياس، ويتيح للمستثمرين اختبار الافتراضات بما يتجاوز ميزانية إنشاء أصل واحد.", "لذلك يمكن لسردية ممر مصممة جيداً أن تحول أصلاً منفرداً إلى منصة لمشاركة اقتصادية طويلة الأجل."],
        imageAlt: "بنية نقل استراتيجية",
      },
    },
  },
  {
    id: "ai-investment-signal",
    slug: "ai-investment-signal",
    imageUrl: "/uploads/sectors/artificial-intelligence/featured/artificial-intelligence-investment-iran.png",
    publishedAt: "2026-06-18T08:00:00.000Z",
    readingMinutes: 3,
    translations: {
      en: {
        category: "Technology",
        title: "What makes an AI opportunity investable beyond the prototype",
        excerpt: "The commercial signals investors look for when technology moves from capability to a scalable operating model.",
        body: ["A capable prototype is only the beginning. Investment readiness depends on a defined customer problem, a repeatable delivery model, responsible data practices and economics that can improve with scale.", "Teams that articulate these elements early can engage capital partners around a concrete operating thesis rather than a broad technology narrative.", "The opportunity becomes stronger when innovation is paired with measurable adoption and disciplined governance."],
        imageAlt: "Artificial intelligence technology visual",
      },
      fa: {
        category: "فناوری",
        title: "چه چیزی یک فرصت هوش مصنوعی را فراتر از نمونه اولیه سرمایه‌پذیر می‌کند؟",
        excerpt: "نشانه‌های تجاری که سرمایه‌گذار هنگام حرکت فناوری از توانمندی به مدل عملیاتی مقیاس‌پذیر دنبال می‌کند.",
        body: ["نمونه اولیه توانمند تنها نقطه شروع است. آمادگی سرمایه‌گذاری به مسئله مشتریِ مشخص، مدل تحویل تکرارپذیر، شیوه مسئولانه کار با داده و اقتصادی وابسته است که با مقیاس بهتر می‌شود.", "تیم‌هایی که این عناصر را زودتر شفاف می‌کنند، می‌توانند به جای روایت کلی فناوری، با یک فرضیه عملیاتی مشخص با شرکای سرمایه گفتگو کنند.", "فرصت زمانی قوی‌تر می‌شود که نوآوری با پذیرش قابل سنجش و حاکمیت منضبط همراه باشد."],
        imageAlt: "تصویر فناوری هوش مصنوعی",
      },
      ar: {
        category: "التكنولوجيا",
        title: "ما الذي يجعل فرصة الذكاء الاصطناعي قابلة للاستثمار بعد النموذج الأولي؟",
        excerpt: "الإشارات التجارية التي يبحث عنها المستثمرون عندما تنتقل التقنية من القدرة إلى نموذج تشغيلي قابل للتوسع.",
        body: ["النموذج الأولي القادر ليس سوى البداية. تعتمد جاهزية الاستثمار على مشكلة عميل محددة ونموذج تقديم قابل للتكرار وممارسات بيانات مسؤولة واقتصاديات تتحسن مع التوسع.", "تستطيع الفرق التي توضح هذه العناصر مبكراً مخاطبة شركاء رأس المال حول فرضية تشغيلية ملموسة بدلاً من سردية تقنية عامة.", "تصبح الفرصة أقوى عندما تقترن الابتكارات بتبنٍّ قابل للقياس وحوكمة منضبطة."],
        imageAlt: "صورة لتقنية الذكاء الاصطناعي",
      },
    },
  },
];

type NewsArticleRow = {
  [key: string]: unknown;
  id: string;
  slug: string;
  image_url: string;
  published_at: Date | string;
  reading_minutes: number;
  translations: unknown;
};

const columns = "id, slug, image_url, published_at, reading_minutes, translations";
let seedPromise: Promise<void> | undefined;

function normalizeTranslations(value: unknown): Record<LanguageCode, NewsTranslation> {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const translation = (language: LanguageCode): NewsTranslation => {
    const item = source[language] && typeof source[language] === "object" ? source[language] as Record<string, unknown> : {};
    return {
      category: String(item.category ?? ""),
      title: String(item.title ?? ""),
      excerpt: String(item.excerpt ?? ""),
      body: Array.isArray(item.body) ? item.body.filter((paragraph): paragraph is string => typeof paragraph === "string") : [],
      imageAlt: String(item.imageAlt ?? ""),
    };
  };
  return { en: translation("en"), fa: translation("fa"), ar: translation("ar") };
}

function fromRow(row: NewsArticleRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    imageUrl: row.image_url,
    publishedAt: new Date(row.published_at).toISOString(),
    readingMinutes: row.reading_minutes,
    translations: normalizeTranslations(row.translations),
  };
}

/** Seeds the built-in editorial records once; all reads afterwards come from PostgreSQL. */
function ensureNewsSeeded() {
  seedPromise ??= Promise.all(newsArticles.map(async (article) => {
    await query(
      `INSERT INTO news_articles (${columns}) VALUES ($1, $2, $3, $4::timestamptz, $5, $6::jsonb) ON CONFLICT (id) DO NOTHING`,
      [article.id, article.slug, article.imageUrl, article.publishedAt, article.readingMinutes, JSON.stringify(article.translations)],
    );
  })).then(() => undefined);
  return seedPromise;
}

function byPublishedDate(left: NewsArticle, right: NewsArticle) {
  return right.publishedAt.localeCompare(left.publishedAt);
}

function toPreview(article: NewsArticle, language: LanguageCode): NewsArticlePreview {
  const translation = article.translations[language] ?? article.translations.en;

  return {
    id: article.id,
    slug: article.slug,
    imageUrl: article.imageUrl,
    publishedAt: article.publishedAt,
    readingMinutes: article.readingMinutes,
    category: translation.category,
    title: translation.title,
    excerpt: translation.excerpt,
    imageAlt: translation.imageAlt,
  };
}

export async function listNewsPreviews(language: LanguageCode, limit?: number) {
  await ensureNewsSeeded();
  const result = await query<NewsArticleRow>(`SELECT ${columns} FROM news_articles ORDER BY published_at DESC`);
  const articles = result.rows.map(fromRow).sort(byPublishedDate).map((article) => toPreview(article, language));
  return typeof limit === "number" ? articles.slice(0, Math.max(0, limit)) : articles;
}

export async function getNewsArticle(slug: string, language: LanguageCode): Promise<LocalizedNewsArticle | null> {
  await ensureNewsSeeded();
  const result = await query<NewsArticleRow>(`SELECT ${columns} FROM news_articles WHERE slug = $1`, [slug]);
  if (!result.rows[0]) return null;
  const article = fromRow(result.rows[0]);

  const preview = toPreview(article, language);
  const translation = article.translations[language] ?? article.translations.en;

  return { ...preview, body: translation.body };
}
