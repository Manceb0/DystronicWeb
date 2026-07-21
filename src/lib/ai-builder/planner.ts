import type { ProjectPlannerProvider } from "@/lib/ai-builder/contracts";
import { DemoProjectPlanner } from "@/lib/ai-builder/providers/demo";
import { OpenAIProjectPlanner } from "@/lib/ai-builder/providers/openai";

export type PlannerSelection = {
  provider: ProjectPlannerProvider;
  configurationNotice?: string;
};

export function selectProjectPlanner(): PlannerSelection {
  const requestedProvider = process.env.DYSTRONIC_AI_PROVIDER?.toLowerCase();
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (requestedProvider === "openai" && apiKey) {
    return { provider: new OpenAIProjectPlanner(apiKey) };
  }

  return {
    provider: new DemoProjectPlanner(),
    configurationNotice:
      requestedProvider === "openai" && !apiKey
        ? "OpenAI mode was requested without OPENAI_API_KEY; safely using the local demo provider."
        : undefined,
  };
}
