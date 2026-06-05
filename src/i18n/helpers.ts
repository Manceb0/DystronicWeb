import type { Locale } from "./types";
import { getMessage } from "./getMessage";
import { en } from "./locales/en";
import { es } from "./locales/es";

const dicts = { es, en };

export function translateCategory(locale: Locale, category: string): string {
  return getMessage(dicts[locale], `categories.${category}`) || category;
}

export function translateLevel(locale: Locale, level: string): string {
  return getMessage(dicts[locale], `levels.${level}`) || level;
}

export function translateCondition(locale: Locale, condition: string): string {
  return getMessage(dicts[locale], `community.condition.${condition}`) || condition;
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}
