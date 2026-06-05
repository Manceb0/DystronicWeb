"use client";

import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/i18n/LanguageProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AppProvider>{children}</AppProvider>
    </LanguageProvider>
  );
}
