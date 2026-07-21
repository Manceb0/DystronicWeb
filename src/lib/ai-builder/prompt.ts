import { plannerCatalog } from "@/lib/ai-builder/catalog";
import type { ProjectPlanRequest } from "@/lib/ai-builder/contracts";

export const PROJECT_PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["intro", "partsIntro", "completion", "safetyNotes", "scenario"],
  properties: {
    intro: { type: "string" },
    partsIntro: { type: "string" },
    completion: { type: "string" },
    safetyNotes: { type: "array", items: { type: "string" }, maxItems: 5 },
    scenario: {
      type: "object",
      additionalProperties: false,
      required: ["id", "prompt", "projectName", "systemPlan", "nodes", "connections", "overview", "learningSteps"],
      properties: {
        id: { type: "string" },
        prompt: { type: "string" },
        projectName: { type: "string" },
        systemPlan: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
        nodes: {
          type: "array",
          minItems: 2,
          maxItems: 8,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["id", "type", "label", "partId", "x", "y"],
            properties: {
              id: { type: "string" },
              type: { type: "string", enum: ["MCU", "SENSOR", "ACTUATOR", "POWER", "MODULE", "DISPLAY"] },
              label: { type: "string" },
              partId: { type: "string", enum: plannerCatalog.map((part) => part.id) },
              x: { type: "number", minimum: 0, maximum: 980 },
              y: { type: "number", minimum: 0, maximum: 560 },
            },
          },
        },
        connections: {
          type: "array",
          maxItems: 16,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["source", "target", "type"],
            properties: {
              source: { type: "string" },
              target: { type: "string" },
              type: { type: "string", enum: ["DATA", "POWER"] },
            },
          },
        },
        overview: {
          type: "object",
          additionalProperties: false,
          required: ["level", "time", "cost", "description"],
          properties: {
            level: { type: "string" },
            time: { type: "string" },
            cost: { type: "number", minimum: 0 },
            description: { type: "string" },
          },
        },
        learningSteps: {
          type: "array",
          minItems: 3,
          maxItems: 6,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["title", "desc"],
            properties: { title: { type: "string" }, desc: { type: "string" } },
          },
        },
      },
    },
  },
} as const;

export function buildPlannerInput(request: ProjectPlanRequest) {
  const language = request.locale === "es" ? "Spanish" : "English";
  return [
    {
      role: "developer",
      content: [
        `You are Dystronic's educational electronics planner. Respond in ${language}.`,
        "Create a safe, beginner-readable project plan grounded only in the supplied catalog.",
        "Use only catalog part IDs. Never invent stock, prices, certifications, or electrical guarantees.",
        "Connections are conceptual learning guidance, not a substitute for datasheets or qualified supervision.",
        "Keep node IDs unique and make every connection source/target reference an existing node ID.",
        "Place nodes on the 980x560 canvas without stacking them all at the same coordinates.",
      ].join("\n"),
    },
    {
      role: "user",
      content: JSON.stringify({ idea: request.prompt, catalog: plannerCatalog }),
    },
  ];
}
