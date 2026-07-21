"use client";

import { CheckCircle2, Handshake, LoaderCircle, Mail, MessageSquareText, Phone, Send, UserRound, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { ButtonElastic } from "@/components/ButtonElastic";
import { COLLABORATION_REQUEST_OPEN_EVENT } from "@/lib/collaborationRequest";
import { languageDirection, type LanguageCode } from "@/lib/i18n";

type FormStatus = "idle" | "sending" | "success" | "error";

type CollaborationCopy = {
  trigger: string;
  compactTrigger: string;
  openLabel: string;
  close: string;
  eyebrow: string;
  title: string;
  description: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  message: string;
  messagePlaceholder: string;
  privacy: string;
  submit: string;
  sending: string;
  validation: string;
  successTitle: string;
  successDescription: string;
  sendAnother: string;
  requestError: string;
};

const copy: Record<LanguageCode, CollaborationCopy> = {
  en: {
    trigger: "Send a collaboration request",
    compactTrigger: "Send request",
    openLabel: "Open collaboration request form",
    close: "Close collaboration request form",
    eyebrow: "Partnerships",
    title: "Let’s build something meaningful.",
    description: "Tell us a little about your idea. Our partnerships team will review your request and get back to you.",
    name: "Full name",
    namePlaceholder: "Your full name",
    email: "Email address",
    emailPlaceholder: "you@company.com",
    phone: "Phone number",
    phonePlaceholder: "+1 555 000 0000",
    message: "Your request",
    messagePlaceholder: "Share the opportunity, your organisation, and how you would like to collaborate…",
    privacy: "Your details are used only to respond to this request.",
    submit: "Send request",
    sending: "Sending securely…",
    validation: "Please review the highlighted fields and try again.",
    successTitle: "Request received",
    successDescription: "Thank you. Our partnerships team will be in touch soon.",
    sendAnother: "Send another request",
    requestError: "We could not send your request. Please try again in a moment.",
  },
  fa: {
    compactTrigger: "ارسال درخواست",
    trigger: "ارسال درخواست همکاری",
    openLabel: "باز کردن فرم درخواست همکاری",
    close: "بستن فرم درخواست همکاری",
    eyebrow: "همکاری و مشارکت",
    title: "با هم چیزی ارزشمند بسازیم.",
    description: "کمی از ایده‌تان بگویید. تیم مشارکت ما درخواست شما را بررسی می‌کند و با شما در تماس خواهد بود.",
    name: "نام و نام خانوادگی",
    namePlaceholder: "نام کامل شما",
    email: "آدرس ایمیل",
    emailPlaceholder: "you@company.com",
    phone: "شماره تماس",
    phonePlaceholder: "۰۹۱۲ ۱۲۳ ۴۵۶۷",
    message: "درخواست شما",
    messagePlaceholder: "فرصت همکاری، مجموعه‌تان و شکل همکاری موردنظرتان را بنویسید…",
    privacy: "اطلاعات شما فقط برای پاسخ‌گویی به این درخواست استفاده می‌شود.",
    submit: "ارسال درخواست",
    sending: "ارسال امن درخواست…",
    validation: "لطفاً فیلدهای مشخص‌شده را بررسی کنید.",
    successTitle: "درخواست دریافت شد",
    successDescription: "سپاسگزاریم. تیم مشارکت ما به‌زودی با شما تماس می‌گیرد.",
    sendAnother: "ارسال درخواست جدید",
    requestError: "ارسال درخواست ممکن نشد. لطفاً چند لحظه دیگر دوباره امتحان کنید.",
  },
  ar: {
    compactTrigger: "إرسال الطلب",
    trigger: "إرسال طلب تعاون",
    openLabel: "فتح نموذج طلب التعاون",
    close: "إغلاق نموذج طلب التعاون",
    eyebrow: "الشراكات",
    title: "لنبنِ شيئاً ذا قيمة معاً.",
    description: "أخبرنا قليلاً عن فكرتك. سيراجع فريق الشراكات طلبك ويتواصل معك.",
    name: "الاسم الكامل",
    namePlaceholder: "اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    phone: "رقم الهاتف",
    phonePlaceholder: "+971 50 000 0000",
    message: "طلبك",
    messagePlaceholder: "شارك الفرصة ومؤسستك وطريقة التعاون التي تتطلع إليها…",
    privacy: "تُستخدم بياناتك فقط للرد على هذا الطلب.",
    submit: "إرسال الطلب",
    sending: "يتم إرسال الطلب بأمان…",
    validation: "يرجى مراجعة الحقول المحددة ثم المحاولة مجدداً.",
    successTitle: "تم استلام الطلب",
    successDescription: "شكراً لك. سيتواصل معك فريق الشراكات قريباً.",
    sendAnother: "إرسال طلب آخر",
    requestError: "تعذر إرسال طلبك. يرجى المحاولة مرة أخرى بعد قليل.",
  },
};

function cleanValue(value: FormDataEntryValue | null, preserveNewlines = false) {
  const text = String(value ?? "").normalize("NFKC");
  const withoutControls = text.replace(preserveNewlines ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "");

  return (preserveNewlines ? withoutControls.replace(/\r\n?/g, "\n") : withoutControls).trim();
}

function hasUnsafeMarkup(value: string) {
  return /<[^>]*>/.test(value);
}

function isValidName(value: string) {
  return /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]{1,98}$/u.test(value);
}

function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,63}$/.test(value);
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return value.length <= 32 && /^[+\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 20;
}

const SCROLL_COMPACT_START = 36;
const SCROLL_COMPACT_DISTANCE = 260;
const SCROLL_EASING = 0.16;
const COMPACT_SCALE_X = 0.72;
const COMPACT_SCALE_Y = 0.86;

/** Keeps the floating trigger present while progressively condensing it as the page scrolls. */
function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Keeps joining scripts intact while preserving character-level motion for Latin copy. */
function getAnimatedTextSegments(value: string, language: LanguageCode) {
  if (language === "en") return Array.from(value);

  return value.split(/(\s+)/).filter(Boolean);
}

export function CollaborationRequestButton({ language, showTrigger = true }: { language: LanguageCode; showTrigger?: boolean }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState("");
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const floatingTriggerRef = useRef<HTMLDivElement>(null);
  const triggerTextRef = useRef<HTMLSpanElement>(null);
  const compactTriggerRef = useRef<HTMLSpanElement>(null);
  const triggerIconRef = useRef<HTMLSpanElement>(null);
  const openedAt = useRef(0);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const dialogId = useId();
  const text = copy[language];
  const isRtl = languageDirection(language) === "rtl";

  useEffect(() => {
    const floatingTrigger = floatingTriggerRef.current;
    const triggerText = triggerTextRef.current;
    const compactTrigger = compactTriggerRef.current;
    const triggerIcon = triggerIconRef.current;

    if (!floatingTrigger || !triggerText || !compactTrigger || !triggerIcon) return;

    const button = floatingTrigger.querySelector("button");
    const characters = Array.from(triggerText.querySelectorAll<HTMLElement>("[data-scroll-segment]"));
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let animationFrame = 0;
    let targetProgress = clampProgress((window.scrollY - SCROLL_COMPACT_START) / SCROLL_COMPACT_DISTANCE);
    let currentProgress = targetProgress;
    let iconCenterOffset = 0;
    let compactLabelCenterOffset = 0;

    const measureCompactLayout = () => {
      if (!button) return;

      const buttonBounds = button.getBoundingClientRect();
      const iconBounds = triggerIcon.getBoundingClientRect();
      const compactLabelBounds = compactTrigger.getBoundingClientRect();
      const iconWidth = iconBounds.width;
      const compactLabelWidth = compactLabelBounds.width;
      const groupGap = 8;
      const groupWidth = iconWidth + groupGap + compactLabelWidth;
      const buttonCenter = buttonBounds.left + buttonBounds.width / 2;
      const compactIconCenter = buttonCenter - groupWidth / 2 + iconWidth / 2;
      const compactLabelCenter = buttonCenter + groupWidth / 2 - compactLabelWidth / 2;

      iconCenterOffset = compactIconCenter - (iconBounds.left + iconWidth / 2);
      compactLabelCenterOffset = compactLabelCenter - (compactLabelBounds.left + compactLabelWidth / 2);
    };
    const applyScrollState = (progress: number) => {
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const scaleX = 1 - (1 - COMPACT_SCALE_X) * easedProgress;
      const scaleY = 1 - (1 - COMPACT_SCALE_Y) * easedProgress;
      const compactLabelProgress = clampProgress((progress - 0.32) / 0.42);
      const compactLabelEase = 1 - Math.pow(1 - compactLabelProgress, 3);

      floatingTrigger.style.transform = `translate3d(0, ${easedProgress * 3}px, 0) scale(${scaleX}, ${scaleY})`;
      compactTrigger.style.opacity = `${compactLabelEase}`;
      compactTrigger.style.transform = `translate3d(${compactLabelCenterOffset * compactLabelEase}px, ${6 * (1 - compactLabelEase)}px, 0) scale(${0.9 + 0.1 * compactLabelEase})`;
      triggerIcon.style.transform = `translate3d(${iconCenterOffset * easedProgress}px, 0, 0) scale(${1 + 0.38 * easedProgress}, ${1 + 0.22 * easedProgress})`;

      const middle = (characters.length - 1) / 2;
      const furthestCharacter = Math.max(middle, 1);

      characters.forEach((character, index) => {
        // The center of the label dissolves first, then the effect travels toward its edges.
        const delay = Math.abs(index - middle) / furthestCharacter * 0.34;
        const characterProgress = clampProgress((progress - delay) / 0.5);
        const characterEase = 1 - Math.pow(1 - characterProgress, 3);

        character.style.opacity = `${1 - characterEase}`;
        character.style.transform = `translate3d(0, ${-7 * characterEase}px, 0) scale(${1 - 0.16 * characterEase})`;
      });
    };

    const render = () => {
      const difference = targetProgress - currentProgress;
      currentProgress = reducedMotion ? targetProgress : currentProgress + difference * SCROLL_EASING;
      if (Math.abs(targetProgress - currentProgress) < 0.001) currentProgress = targetProgress;

      applyScrollState(currentProgress);

      if (currentProgress !== targetProgress) {
        animationFrame = window.requestAnimationFrame(render);
      } else {
        animationFrame = 0;
      }
    };

    const requestRender = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(render);
    };

    const handleScroll = () => {
      targetProgress = clampProgress((window.scrollY - SCROLL_COMPACT_START) / SCROLL_COMPACT_DISTANCE);
      requestRender();
    };

    const handleMotionChange = () => {
      reducedMotion = motionQuery.matches;
      requestRender();
    };

    measureCompactLayout();
    applyScrollState(currentProgress);
    window.addEventListener("scroll", handleScroll, { passive: true });
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      motionQuery.removeEventListener("change", handleMotionChange);
      floatingTrigger.style.transform = "";
      triggerIcon.style.transform = "";
      compactTrigger.style.opacity = "";
      compactTrigger.style.transform = "";
      characters.forEach((character) => {
        character.style.opacity = "";
        character.style.transform = "";
      });
    };
  }, [text.trigger]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && status !== "sending") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    window.requestAnimationFrame(() => firstFieldRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, status]);

  const openDialog = useCallback(() => {
    openedAt.current = Date.now();
    setStatus("idle");
    setFormError("");
    setInvalidFields([]);
    setOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener(COLLABORATION_REQUEST_OPEN_EVENT, openDialog);
    return () => window.removeEventListener(COLLABORATION_REQUEST_OPEN_EVENT, openDialog);
  }, [openDialog]);

  const closeDialog = () => {
    if (status !== "sending") setOpen(false);
  };

  const resetForm = () => {
    formRef.current?.reset();
    openedAt.current = Date.now();
    setStatus("idle");
    setFormError("");
    setInvalidFields([]);
    window.requestAnimationFrame(() => firstFieldRef.current?.focus());
  };

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const formData = new FormData(event.currentTarget);
    const name = cleanValue(formData.get("name"));
    const email = cleanValue(formData.get("email"));
    const phone = cleanValue(formData.get("phone"));
    const message = cleanValue(formData.get("message"), true);
    const website = cleanValue(formData.get("website"));
    const invalid = [
      !isValidName(name) || hasUnsafeMarkup(name) ? "name" : "",
      !isValidEmail(email) || hasUnsafeMarkup(email) ? "email" : "",
      !isValidPhone(phone) ? "phone" : "",
      message.length < 20 || message.length > 2000 || hasUnsafeMarkup(message) ? "message" : "",
    ].filter(Boolean);

    if (invalid.length || website) {
      setInvalidFields(invalid);
      setFormError(text.validation);
      return;
    }

    setInvalidFields([]);
    setFormError("");
    setStatus("sending");

    try {
      const response = await fetch("/api/collaboration-requests", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, phone, message, website, openedAt: openedAt.current }),
      });

      if (!response.ok) throw new Error("Collaboration request failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setFormError(text.requestError);
    }
  };

  const fieldClass = (field: string) => `peer w-full rounded-2xl border bg-[#061218b8] px-11 py-3.5 text-sm leading-6 text-[#f7f2e7] outline-none transition duration-300 placeholder:text-[#c8cfcf62] hover:border-[#d8a75c8c] focus:border-[#edc77f] focus:bg-[#08141acc] focus:shadow-[0_0_0_4px_rgba(237,199,127,0.11),0_14px_30px_rgba(0,0,0,0.18)] ${invalidFields.includes(field) ? "border-[#ef8d80] shadow-[0_0_0_4px_rgba(239,141,128,0.1)]" : "border-[#d8a75c48]"}`;

  return (
    <>
      {showTrigger ? (
        <div
          ref={floatingTriggerRef}
          className={`fixed bottom-14 z-[90] will-change-transform ${isRtl ? "left-5 max-[760px]:left-3" : "right-5 max-[760px]:right-3"}`}
          style={{ transformOrigin: isRtl ? "left bottom" : "right bottom" }}
        >
          <ButtonElastic
            onClick={openDialog}
            size={{ width: 244, height: 56 }}
            aria-label={text.openLabel}
            aria-expanded={open}
            aria-controls={dialogId}
          >
            <span ref={triggerIconRef} className="inline-flex shrink-0 will-change-transform">
              <Handshake aria-hidden="true" size={17} strokeWidth={1.8} />
            </span>
            <span className="relative inline-flex max-[420px]:hidden" aria-hidden="true">
              <span ref={triggerTextRef} className="inline-flex">
                {getAnimatedTextSegments(text.trigger, language).map((segment, index) => (
                  <span key={`${segment}-${index}`} data-scroll-segment className="inline-block will-change-transform">
                    {segment.trim() ? segment : "\u00a0"}
                  </span>
                ))}
              </span>
              <span className="pointer-events-none absolute inset-0 inline-flex items-center justify-center">
                <span ref={compactTriggerRef} className="whitespace-nowrap opacity-0 will-change-transform">
                  {text.compactTrigger}
                </span>
              </span>
            </span>
          </ButtonElastic>
        </div>
      ) : null}

      <div id={dialogId} className={`fixed inset-0 z-[140] grid place-items-center px-4 py-5 transition duration-300 ${open ? "visible pointer-events-auto" : "invisible pointer-events-none"}`} aria-hidden={!open}>
        <button type="button" className={`absolute inset-0 z-0 cursor-default border-0 bg-[#010609d9] backdrop-blur-md transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} onClick={closeDialog} tabIndex={-1} aria-label={text.close} />
        <section
          className={`relative z-10 max-h-[calc(100dvh-40px)] w-[min(100%,680px)] overflow-x-hidden overflow-y-auto rounded-[30px] border border-[#d8a75c7a] bg-[radial-gradient(circle_at_90%_2%,rgba(237,199,127,0.23),transparent_18rem),radial-gradient(circle_at_8%_100%,rgba(78,128,126,0.16),transparent_20rem),linear-gradient(145deg,#0a1b21,#030b10_62%,#071116)] p-[clamp(20px,4vw,38px)] shadow-[0_32px_100px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          aria-describedby={dialogDescriptionId}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full border border-[#edc77f55] bg-[#edc77f0a] blur-[1px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 h-56 w-56 rounded-full border border-[#6fa5a050] bg-[#6fa5a008]" />
          <button type="button" onClick={closeDialog} disabled={status === "sending"} className={`absolute top-3 z-30 grid h-11 w-11 touch-manipulation place-items-center rounded-full border border-[#d8a75c68] bg-[#061218e8] text-[#edc77f] transition hover:rotate-90 hover:border-[#edc77f] hover:bg-[#edc77f] hover:text-[#071016] disabled:cursor-not-allowed disabled:opacity-50 ${isRtl ? "left-3" : "right-3"}`} aria-label={text.close}>
            <X size={18} />
          </button>

          {status === "success" ? (
            <div className="relative grid min-h-96 place-items-center py-10 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full border border-[#edc77f9e] bg-[#edc77f1c] text-[#f5d992] shadow-[0_0_0_10px_rgba(237,199,127,0.06),0_0_35px_rgba(237,199,127,0.18)]">
                <CheckCircle2 size={40} strokeWidth={1.5} />
              </span>
              <div className="mt-7 max-w-sm">
                <h2 id={dialogTitleId} className="m-0 text-2xl font-semibold text-[#f6f2e9]">{text.successTitle}</h2>
                <p id={dialogDescriptionId} className="mt-3 text-sm leading-7 text-[#d8deddb3]">{text.successDescription}</p>
              </div>
              <button type="button" onClick={resetForm} className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#d8a75c8c] bg-[#d8a75c16] px-5 py-3 text-sm font-semibold text-[#f4d99d] transition hover:-translate-y-0.5 hover:bg-[#edc77f] hover:text-[#071016]">
                <Send size={15} /> {text.sendAnother}
              </button>
            </div>
          ) : (
            <>
              <div className="relative pe-12">
                <p className="m-0 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#d8a75c]"><Handshake size={13} /> {text.eyebrow}</p>
                <h2 id={dialogTitleId} className="mt-3 max-w-lg text-[clamp(23px,3vw,32px)] font-semibold leading-[1.16] text-[#f6f2e9]">{text.title}</h2>
                <p id={dialogDescriptionId} className="mt-3 max-w-xl text-sm leading-7 text-[#d8deddb3]">{text.description}</p>
              </div>

              <form ref={formRef} className="relative mt-6 grid gap-4" onSubmit={submitRequest} noValidate>
                <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
                  <label htmlFor="collaboration-website">Website</label>
                  <input id="collaboration-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-xs font-semibold text-[#e7e7df]" htmlFor="collaboration-name">
                    <span>{text.name}</span>
                    <span className="relative block">
                      <UserRound aria-hidden="true" className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#d8a75c] ${isRtl ? "right-4" : "left-4"}`} />
                      <input ref={firstFieldRef} id="collaboration-name" name="name" className={`${fieldClass("name")} ${isRtl ? "pr-11" : "pl-11"}`} type="text" autoComplete="name" maxLength={100} placeholder={text.namePlaceholder} aria-invalid={invalidFields.includes("name")} required />
                    </span>
                  </label>
                  <label className="grid gap-2 text-xs font-semibold text-[#e7e7df]" htmlFor="collaboration-email">
                    <span>{text.email}</span>
                    <span className="relative block">
                      <Mail aria-hidden="true" className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#d8a75c] ${isRtl ? "right-4" : "left-4"}`} />
                      <input id="collaboration-email" name="email" className={`${fieldClass("email")} ${isRtl ? "pr-11" : "pl-11"}`} type="email" dir="ltr" autoComplete="email" maxLength={254} placeholder={text.emailPlaceholder} aria-invalid={invalidFields.includes("email")} required />
                    </span>
                  </label>
                </div>
                <label className="grid gap-2 text-xs font-semibold text-[#e7e7df]" htmlFor="collaboration-phone">
                  <span>{text.phone}</span>
                  <span className="relative block">
                    <Phone aria-hidden="true" className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#d8a75c] ${isRtl ? "right-4" : "left-4"}`} />
                    <input id="collaboration-phone" name="phone" className={`${fieldClass("phone")} ${isRtl ? "pr-11" : "pl-11"}`} type="tel" dir="ltr" autoComplete="tel" inputMode="tel" maxLength={32} placeholder={text.phonePlaceholder} aria-invalid={invalidFields.includes("phone")} required />
                  </span>
                </label>
                <label className="grid gap-2 text-xs font-semibold text-[#e7e7df]" htmlFor="collaboration-message">
                  <span>{text.message}</span>
                  <span className="relative block">
                    <MessageSquareText aria-hidden="true" className={`pointer-events-none absolute top-4 h-4 w-4 text-[#d8a75c] ${isRtl ? "right-4" : "left-4"}`} />
                    <textarea id="collaboration-message" name="message" className={`${fieldClass("message")} min-h-32 resize-y ${isRtl ? "pr-11" : "pl-11"}`} rows={5} maxLength={2000} placeholder={text.messagePlaceholder} aria-invalid={invalidFields.includes("message")} required />
                  </span>
                </label>
                {formError ? <p className="m-0 rounded-xl border border-[#d98c7a75] bg-[#d98c7a12] px-3 py-2.5 text-xs leading-5 text-[#ffc3b8]" role="alert">{formError}</p> : null}
                <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
                  <p className="m-0 max-w-sm text-[11px] leading-5 text-[#cbd2d28f]">{text.privacy}</p>
                  <button type="submit" disabled={status === "sending"} className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#f6d795a8] bg-[linear-gradient(125deg,#bd8134,#e7b35e_52%,#ffe9a9)] px-5 text-sm font-bold text-[#071016] shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_27px_rgba(0,0,0,0.32)] disabled:cursor-wait disabled:opacity-70">
                    {status === "sending" ? <LoaderCircle className="animate-spin" size={17} /> : <Send className="transition-transform group-hover:translate-x-0.5" size={17} />}
                    {status === "sending" ? text.sending : text.submit}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </>
  );
}
