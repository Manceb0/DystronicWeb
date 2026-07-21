import { plannerCatalogIds } from "@/lib/ai-builder/catalog";
import type { ProjectPlanResult } from "@/lib/ai-builder/contracts";
import type { AIScenario } from "@/lib/mock-data";

export function validateGeneratedScenario(value: unknown): AIScenario {
  if (!value || typeof value !== "object") throw new Error("The planner returned an invalid scenario.");
  const scenario = value as AIScenario;
  if (!Array.isArray(scenario.nodes) || !Array.isArray(scenario.connections) || scenario.nodes.length < 2) {
    throw new Error("The planner returned an incomplete project graph.");
  }

  const nodeIds = new Set<string>();
  for (const node of scenario.nodes) {
    if (!node.id || nodeIds.has(node.id) || !plannerCatalogIds.has(node.partId)) {
      throw new Error("The planner returned an unknown part or duplicate node.");
    }
    nodeIds.add(node.id);
  }
  if (scenario.connections.some((edge) => !nodeIds.has(edge.source) || !nodeIds.has(edge.target))) {
    throw new Error("The planner returned a connection to an unknown node.");
  }
  return scenario;
}

export function validateProviderPayload(value: unknown): Omit<ProjectPlanResult, "mode" | "model" | "notice"> {
  if (!value || typeof value !== "object") throw new Error("The planner returned an invalid payload.");
  const payload = value as Omit<ProjectPlanResult, "mode" | "model" | "notice">;
  if (![payload.intro, payload.partsIntro, payload.completion].every((item) => typeof item === "string")) {
    throw new Error("The planner returned incomplete copy.");
  }
  if (!Array.isArray(payload.safetyNotes)) throw new Error("The planner omitted safety notes.");
  return { ...payload, scenario: validateGeneratedScenario(payload.scenario) };
}
