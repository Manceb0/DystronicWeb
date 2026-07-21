"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronRight, Circle, ShieldCheck, Wrench } from "lucide-react";
import type { AIScenario, Part } from "@/lib/mock-data";
import type { Locale } from "@/i18n/types";

type Props = {
  scenario: AIScenario;
  parts: Part[];
  locale: Locale;
};

const phaseIcons = [Wrench, ShieldCheck, Wrench, Check];

export default function InstructionsView({ scenario, parts, locale }: Props) {
  const isEs = locale === "es";
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<number | null>(0);

  const phases = useMemo(() => {
    const fallback = isEs
      ? [
          { title: "Preparar", desc: "Verifica las piezas y organiza el espacio de trabajo." },
          { title: "Cablear", desc: "Conecta alimentación, control y señales según el diagrama." },
          { title: "Programar", desc: "Carga el firmware y comprueba cada subsistema." },
          { title: "Probar", desc: "Realiza una prueba segura y corrige cualquier conexión." },
        ]
      : [
          { title: "Prepare", desc: "Verify the parts and organize the work area." },
          { title: "Wire", desc: "Connect power, control, and signals following the diagram." },
          { title: "Program", desc: "Upload the firmware and verify each subsystem." },
          { title: "Test", desc: "Run a safe test and correct any connection issues." },
        ];
    return scenario.learningSteps.length ? scenario.learningSteps : fallback;
  }, [isEs, scenario.learningSteps]);

  const tools = isEs
    ? ["Destornillador de precisión", "Multímetro", "Pinza de corte", "Cable USB de datos"]
    : ["Precision screwdriver", "Multimeter", "Wire cutters", "USB data cable"];
  const assumptions = isEs
    ? ["Trabajar con la batería desconectada", "Verificar polaridad antes de energizar", "Firmware preparado para el controlador principal"]
    : ["Work with the battery disconnected", "Verify polarity before applying power", "Firmware prepared for the main controller"];

  const toggleComplete = (index: number) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0b0b0e] text-gray-200 custom-scrollbar">
      <div className="sticky top-0 z-20 flex h-11 items-center gap-3 border-b border-white/10 bg-[#0b0b0e]/95 px-5 backdrop-blur-sm">
        <Check size={13} className="text-[#00f0ff]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">
          {isEs ? "Instrucciones" : "Instructions"}
        </span>
        <span className="text-[10px] text-gray-500">{completed.size}/{phases.length} {isEs ? "completadas" : "done"}</span>
        <div className="ml-auto h-1 w-28 overflow-hidden bg-white/10">
          <div className="h-full bg-[#00f0ff] transition-[width] duration-200" style={{ width: `${(completed.size / phases.length) * 100}%` }} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        <section className="mb-4 border border-white/10 bg-[#111115]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <Wrench size={13} className="text-[#00f0ff]" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em]">{isEs ? "Herramientas y supuestos" : "Tools and assumptions"}</h2>
          </div>
          <div className="grid gap-5 p-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">{isEs ? "Herramientas" : "Tools"}</p>
              <ul className="space-y-1.5 text-xs text-gray-300">
                {tools.map((tool) => <li key={tool} className="flex items-center gap-2"><Wrench size={10} className="text-gray-600" />{tool}</li>)}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">{isEs ? "Antes de comenzar" : "Before starting"}</p>
              <ul className="space-y-1.5 text-xs text-gray-300">
                {assumptions.map((item) => <li key={item} className="flex items-start gap-2"><span className="mt-1 text-[#00f0ff]">•</span>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <div className="space-y-3">
          {phases.map((step, index) => {
            const PhaseIcon = phaseIcons[index % phaseIcons.length];
            const isDone = completed.has(index);
            const isOpen = expanded === index;
            const relatedParts = parts.length ? parts.slice(index % parts.length, (index % parts.length) + 3) : [];
            return (
              <section key={`${step.title}-${index}`} className={`border transition-colors ${isDone ? "border-[#39ff14]/25 bg-[#39ff14]/[0.025]" : "border-white/10 bg-[#111115]"}`}>
                <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
                  <span className="text-sm font-bold text-gray-500">{index + 1}.</span>
                  <PhaseIcon size={14} className={isDone ? "text-[#39ff14]" : "text-gray-400"} />
                  <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  <span className="ml-auto text-[9px] text-gray-600">{isDone ? (isEs ? "LISTO" : "DONE") : "0/1"}</span>
                  <button type="button" onClick={() => toggleComplete(index)} className={`grid h-6 w-6 place-items-center border transition-colors ${isDone ? "border-[#39ff14] bg-[#39ff14] text-black" : "border-white/20 text-gray-500 hover:border-[#00f0ff] hover:text-[#00f0ff]"}`} aria-label={isEs ? "Marcar paso" : "Mark step"}>
                    {isDone ? <Check size={13} /> : <Circle size={10} />}
                  </button>
                </div>

                <div className="px-5 py-4 sm:px-10">
                  <p className="mb-3 text-sm leading-relaxed text-gray-300">{step.desc}</p>
                  {relatedParts.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-3">
                      {relatedParts.map((part) => (
                        <div key={part.id} className="flex min-w-0 items-center gap-2 border border-white/10 bg-[#09090c] p-2">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-white">
                            <Image src={part.image} alt={part.name} fill sizes="40px" className="object-contain p-1" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[10px] font-bold text-white">{part.name}</p>
                            <p className="truncate text-[9px] text-gray-500">{part.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button type="button" onClick={() => setExpanded(isOpen ? null : index)} className="mt-3 flex items-center gap-1 text-[10px] text-[#00f0ff] hover:text-white">
                    {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    {isOpen ? (isEs ? "Ocultar detalles" : "Hide details") : (isEs ? "Ver detalles" : "View details")}
                  </button>
                  {isOpen && (
                    <div className="mt-3 border-t border-white/[0.07] pt-3 text-xs leading-relaxed text-gray-400">
                      {isEs
                        ? `Completa este paso con el sistema sin energía. Contrasta cada conexión con la pestaña Cableado antes de continuar.`
                        : `Complete this step with the system powered off. Check every connection against the Wiring tab before continuing.`}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
