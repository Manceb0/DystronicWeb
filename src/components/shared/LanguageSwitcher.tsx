"use client";

import { Globe } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { Locale } from "@/i18n/types";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();
  const activeIndex = LOCALES.findIndex((l) => l.value === locale);

  return (
    <div
      role="group"
      aria-label={t("common.language")}
      className="group/lang relative flex items-center gap-0 bg-[#0a0a0d]/80 border border-white/[0.08] rounded-full p-0.5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_24px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] duration-300 hover:border-[#00f0ff]/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_rgba(0,240,255,0.08)]"
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 ml-0.5">
        <Globe
          size={13}
          className="text-[#00f0ff]/50 transition-colors duration-300 group-hover/lang:text-[#00f0ff]/80"
          aria-hidden
        />
      </div>

      <div className="relative grid grid-cols-2 min-w-[4.5rem] mr-0.5">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/2 rounded-full border border-[#00f0ff]/30 bg-gradient-to-b from-[#00f0ff]/20 to-[#00f0ff]/5 shadow-[0_0_14px_rgba(0,240,255,0.2)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)]"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />

        {LOCALES.map((opt) => {
          const isActive = locale === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLocale(opt.value)}
              aria-pressed={isActive}
              className={`relative z-10 px-3 py-1.5 text-[10px] font-mono font-bold tracking-[0.2em] uppercase transition-colors duration-200 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00f0ff]/50 ${
                isActive ? "text-[#00f0ff]" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
