import { runnableDemoScenarios } from "@/lib/ai-builder/catalog";
import type { ProjectPlannerProvider, ProjectPlanRequest, ProjectPlanResult } from "@/lib/ai-builder/contracts";

export class DemoProjectPlanner implements ProjectPlannerProvider {
  readonly mode = "demo" as const;

  async generatePlan(request: ProjectPlanRequest): Promise<ProjectPlanResult> {
    const base = runnableDemoScenarios[0];
    if (!base) throw new Error("No validated offline project is available.");

    const spanish = request.locale === "es";
    const scenario = {
      ...base,
      id: `demo-${base.id}`,
      prompt: request.prompt,
      nodes: base.nodes.map((node) => ({ ...node })),
      connections: base.connections.map((edge) => ({ ...edge })),
      systemPlan: [...base.systemPlan],
      learningSteps: base.learningSteps.map((step) => ({ ...step })),
      overview: { ...base.overview },
    };

    return {
      mode: this.mode,
      model: null,
      notice: spanish
        ? "Modo demo local: usa un proyecto educativo validado y no realiza llamadas pagadas."
        : "Local demo mode: uses a validated educational project and makes no paid API calls.",
      intro: spanish
        ? `Analicé tu idea: **${request.prompt}**. Preparé el proyecto educativo más cercano disponible.`
        : `I analyzed your idea: **${request.prompt}**. I prepared the closest available educational project.`,
      partsIntro: spanish
        ? "Estos componentes forman la lista inicial del proyecto:"
        : "These components form the project's initial parts list:",
      completion: spanish
        ? "Ya puedes abrir el diagrama y revisar cada componente."
        : "You can now open the diagram and review each component.",
      safetyNotes: spanish
        ? ["Verifica voltajes y pinout en las hojas de datos antes de conectar hardware."]
        : ["Verify voltages and pinouts in the datasheets before connecting hardware."],
      scenario,
    };
  }
}
