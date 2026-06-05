export type Locale = "es" | "en";

export interface TranslationDict {
  [key: string]: string | TranslationDict;
}
