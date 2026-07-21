"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  languageDirection,
  languageParamName,
  languageSwitcherCopy,
  languages,
  type LanguageCode,
} from "@/lib/i18n";

type LanguageOption = (typeof languages)[number];

type LanguageSwitcherProps = {
  language: LanguageCode;
  className?: string;
  dropdownClassName?: string;
};

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#edc77f]";

function FlagBadge({ language, sizeClass = "h-6 w-6" }: { language: LanguageOption; sizeClass?: string }) {
  return (
    <span className={`${sizeClass} inline-grid shrink-0 overflow-hidden rounded-full border border-[#edc77f52] bg-[#02090e] shadow-[0_0_0_2px_rgba(216,167,92,0.08)]`}>
      <img className="h-full w-full object-cover" src={language.flag} alt={`${language.label} flag`} />
    </span>
  );
}

export function LanguageSwitcher({ language, className = "", dropdownClassName = "" }: LanguageSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const selectedLanguage = languages.find((item) => item.code === language) ?? languages[1];
  const copy = languageSwitcherCopy[language];
  const dropdownAlignment = languageDirection(language) === "rtl" ? "left-0" : "right-0";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languageDirection(language);
  }, [language]);

  function selectLanguage(nextLanguage: LanguageCode) {
    setOpen(false);

    if (nextLanguage === language) return;

    startTransition(() => {
      const url = new URL(window.location.href);
      url.searchParams.set(languageParamName, nextLanguage);
      router.push(`${url.pathname}${url.search}${url.hash}`);
      router.refresh();
    });
  }

  return (
    <div className={`relative z-[75] ${className}`}>
      <button
        className={`${focusRing} inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#02090e42] px-3 text-[11px] font-semibold uppercase text-[#f5f5f0e6] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur transition hover:border-[#edc77f] hover:bg-[#edc77f12] max-[760px]:min-h-11 max-[760px]:px-2`}
        type="button"
        aria-label={copy.changeLanguage}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <FlagBadge language={selectedLanguage} sizeClass="h-[22px] w-[22px]" />
        <span>{selectedLanguage.short}</span>
        <ChevronDown className={`text-[#999da0] transition ${open ? "rotate-180 text-[#edc77f]" : ""}`} size={13} />
      </button>

      <div
        className={`absolute ${dropdownAlignment} top-[calc(100%+10px)] grid w-[190px] overflow-hidden rounded-[18px] border border-[#d8a75c45] bg-[#030b10f2] p-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl transition duration-200 ${dropdownClassName} ${open ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-2 opacity-0"}`}
        role="listbox"
        aria-label={copy.websiteLanguage}
      >
        {languages.map((item) => {
          const selected = item.code === language;

          return (
            <button
              className={`${focusRing} grid min-h-11 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[14px] px-3 text-left text-sm transition ${selected ? "bg-[#edc77f] text-[#071016]" : "text-[#f4f4f0d9] hover:bg-[#edc77f14] hover:text-[#edc77f]"}`}
              type="button"
              role="option"
              aria-selected={selected}
              key={item.code}
              onClick={() => selectLanguage(item.code)}
            >
              <FlagBadge language={item} sizeClass="h-7 w-7" />
              <span className="font-semibold" dir={item.dir}>
                {item.label}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-[0.08em] ${selected ? "text-[#071016a3]" : "text-[#d8a75c]"}`}>{item.short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
