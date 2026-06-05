import type { TranslationDict } from "./types";

export function getMessage(dict: TranslationDict, key: string): string {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as TranslationDict)[part];
    }
    return undefined;
  }, dict);

  return typeof value === "string" ? value : key;
}
