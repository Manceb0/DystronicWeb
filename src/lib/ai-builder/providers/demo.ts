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
        ? `Analicé tu idea: **${request.prompt}**. En el modo sin clave te mostraré el proyecto educativo más cercano disponible.`
        : `I analyzed your idea: **${request.prompt}**. In keyless mode, I will show the closest available educational project.`,
      partsIntro: spanish
        ? "Estos componentes pertenecen al catálogo local y forman el proyecto de demostración:"
        : "These parts come from the local catalog and form the demonstration project:",
      completion: spanish
        ? "El board está listo. Es una demostración local claramente identificada; la misma interfaz acepta planes estructurados del proveedor OpenAI."
        : "The board is ready. This is a clearly labeled local demo; the same interface accepts structured plans from the OpenAI provider.",
      safetyNotes: spanish
        ? ["Verifica voltajes y pinout en las hojas de datos antes de conectar hardware."]
        : ["Verify voltages and pinouts in the datasheets before connecting hardware."],
      scenario,
    };
  }
}
