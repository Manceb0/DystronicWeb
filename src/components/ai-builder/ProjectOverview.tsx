import { Activity, Check, Clock3, Cpu, DollarSign, Package, Radio, Route, ShieldCheck, Zap } from "lucide-react";
import type { AIScenario, Part } from "@/lib/mock-data";
import type { Locale } from "@/i18n/types";

type Props = { scenario: AIScenario; parts: Part[]; locale: Locale };

export default function ProjectOverview({ scenario, parts, locale }: Props) {
  const isEs = locale === "es";
  const copy = isEs
    ? {
        project: "Proyecto de robótica",
        purpose: "Qué vas a construir",
        capabilities: "Capacidades principales",
        architecture: "Arquitectura del sistema",
        composition: "Composición",
        parts: "piezas",
        links: "conexiones",
        stages: "etapas guiadas",
        difficulty: "Dificultad",
        time: "Tiempo estimado",
        cost: "Costo estimado",
        inventory: "Componentes",
        ready: "Diseño listo para prototipar",
        control: "Control central programable",
        sensing: "Detección frontal de obstáculos",
        motion: "Tracción y dirección independientes",
        power: "Distribución de energía regulada",
        expected: "Resultado esperado",
        result: "Un rover funcional que integra energía, percepción y movimiento en un sistema verificable por etapas.",
      }
    : {
        project: "Robotics project",
        purpose: "What you will build",
        capabilities: "Core capabilities",
        architecture: "System architecture",
        composition: "Composition",
        parts: "parts",
        links: "connections",
        stages: "guided stages",
        difficulty: "Difficulty",
        time: "Estimated time",
        cost: "Estimated cost",
        inventory: "Components",
        ready: "Design ready for prototyping",
        control: "Programmable central control",
        sensing: "Front obstacle detection",
        motion: "Independent drive and steering",
        power: "Regulated power distribution",
        expected: "Expected result",
        result: "A functional rover integrating power, perception, and motion in a system that can be verified stage by stage.",
      };

  const capabilities = [
    { icon: Cpu, label: copy.control, color: "#00f0ff" },
    { icon: Radio, label: copy.sensing, color: "#39ff14" },
    { icon: Activity, label: copy.motion, color: "#ff5e00" },
    { icon: Zap, label: copy.power, color: "#ffcc00" },
  ];
  const typeCounts = scenario.nodes.reduce<Record<string, number>>((counts, node) => {
    counts[node.type] = (counts[node.type] ?? 0) + 1;
    return counts;
  }, {});
  const typeColors: Record<string, string> = { MCU: "#00f0ff", SENSOR: "#39ff14", ACTUATOR: "#ff5e00", POWER: "#ffcc00", MODULE: "#a855f7", DISPLAY: "#ec4899" };

  return (
    <div className="h-full overflow-y-auto bg-[#09090c] custom-scrollbar">
      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#00f0ff]">{copy.project}</p>
            <h2 className="text-3xl font-bold tracking-[0.08em] text-white sm:text-4xl">{scenario.projectName}</h2>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#39ff14]">
            <ShieldCheck size={14} />
            <span>{copy.ready}</span>
          </div>
        </header>

        <section className="grid border-b border-white/10 sm:grid-cols-4">
          {[
            { icon: Activity, label: copy.difficulty, value: scenario.overview.level, color: "#00f0ff" },
            { icon: Clock3, label: copy.time, value: scenario.overview.time, color: "#ff5e00" },
            { icon: DollarSign, label: copy.cost, value: `$${scenario.overview.cost.toFixed(2)}`, color: "#39ff14" },
            { icon: Package, label: copy.inventory, value: String(parts.length), color: "#a855f7" },
          ].map((metric, index) => (
            <div key={metric.label} className={`py-5 sm:px-5 ${index > 0 ? "border-t border-white/10 sm:border-l sm:border-t-0" : ""}`}>
              <div className="mb-2 flex items-center gap-2" style={{ color: metric.color }}>
                <metric.icon size={12} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{metric.label}</span>
              </div>
              <p className="text-lg font-bold text-white">{metric.value}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-8 py-7 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <section className="mb-8">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-white">{copy.purpose}</h3>
              <p className="max-w-[68ch] text-sm leading-7 text-gray-300">{scenario.overview.description}</p>
            </section>

            <section>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white">{copy.capabilities}</h3>
              <div className="divide-y divide-white/[0.07] border-y border-white/10">
                {capabilities.map((capability) => (
                  <div key={capability.label} className="flex items-center gap-3 py-3 text-xs text-gray-300">
                    <capability.icon size={14} style={{ color: capability.color }} />
                    <span>{capability.label}</span>
                    <Check size={12} className="ml-auto text-gray-600" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Route size={14} className="text-[#00f0ff]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">{copy.architecture}</h3>
              </div>
              <ol className="space-y-3 border-l border-white/10 pl-4">
                {scenario.systemPlan.slice(0, 5).map((step, index) => (
                  <li key={index} className="relative text-[11px] leading-5 text-gray-400">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 border border-[#00f0ff] bg-[#09090c]" />
                    <span className="mr-2 text-[#00f0ff]">{String(index + 1).padStart(2, "0")}</span>{step}
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-white">{copy.composition}</h3>
              <div className="mb-3 flex h-2 overflow-hidden bg-white/5">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <span key={type} style={{ width: `${(count / Math.max(1, scenario.nodes.length)) * 100}%`, backgroundColor: typeColors[type] ?? "#64748b" }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <span key={type} className="flex items-center gap-1 text-[8px]" style={{ color: typeColors[type] ?? "#94a3b8" }}>
                    <span className="h-1.5 w-1.5" style={{ backgroundColor: typeColors[type] ?? "#94a3b8" }} />{type} ({count})
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[10px] text-gray-500">{parts.length} {copy.parts} · {scenario.connections.length} {copy.links} · {scenario.learningSteps.length} {copy.stages}</p>
            </section>
          </div>
        </div>

        <footer className="flex items-start gap-3 border-t border-[#00f0ff]/20 bg-[#00f0ff]/[0.035] px-4 py-4">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#00f0ff]" />
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-[#00f0ff]">{copy.expected}</p>
            <p className="text-xs leading-5 text-gray-300">{copy.result}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
