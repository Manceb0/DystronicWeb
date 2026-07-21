import type { AIScenario } from "@/lib/mock-data";

export type AIProviderMode = "demo" | "openai";
export type SupportedLocale = "es" | "en";

export type ProjectPlanRequest = {
  prompt: string;
  locale: SupportedLocale;
};

export type ProjectPlanResult = {
  mode: AIProviderMode;
  model: string | null;
  notice: string;
  intro: string;
  partsIntro: string;
  completion: string;
  safetyNotes: string[];
  scenario: AIScenario;
};

export interface ProjectPlannerProvider {
  readonly mode: AIProviderMode;
  generatePlan(request: ProjectPlanRequest): Promise<ProjectPlanResult>;
}

export function isProjectPlanRequest(value: unknown): value is ProjectPlanRequest {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ProjectPlanRequest>;
  return (
    typeof candidate.prompt === "string" &&
    candidate.prompt.trim().length >= 3 &&
    candidate.prompt.length <= 800 &&
    (candidate.locale === "es" || candidate.locale === "en")
  );
}
