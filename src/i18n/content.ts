import type { AIScenario, Part } from "@/lib/mock-data";
import type { Locale } from "./types";

type ScenarioLocale = {
  prompt?: string;
  projectName?: string;
  systemPlan?: string[];
  overview?: Partial<AIScenario["overview"]>;
  learningSteps?: { title: string; desc: string }[];
  nodeLabels?: Record<string, string>;
};

type PartLocale = {
  name?: string;
  description?: string;
  specs?: Record<string, string>;
};

const scenarioEs: Record<string, ScenarioLocale> = {
  "sc-rc-car": {
    prompt: "Auto a control remoto con kits electrónicos",
    projectName: "AUTO RC",
    systemPlan: [
      "Selecciona un MCU: Arduino Uno o ESP32 para control y comunicación Wi-Fi/Bluetooth.",
      "Implementa drivers de motor (p. ej. L298N) para motores DC que controlen las ruedas.",
      "Diseña un chasis: usa una base de acrílico o impresa en 3D.",
      "Integra el sistema de energía: pack LiPo con regulador de voltaje adecuado.",
      "Añade sensor ultrasónico para detección de obstáculos.",
      "Agrupa todas las piezas necesarias en una lista lista para comprar.",
      "Sugiere kit y curso relacionados.",
    ],
    overview: {
      level: "Intermedio",
      time: "4-6 horas",
      description:
        "Un rover autónomo y controlado por Bluetooth. Ideal para entender lógica de control y mecánica de motores.",
    },
    learningSteps: [
      { title: "Entender el chasis", desc: "Empieza ensamblando la base de acrílico y montando los motores con firmeza." },
      { title: "Gestión de energía", desc: "Nunca conectes los motores directo al MCU. Enruta la energía por el driver de motores." },
      { title: "Lógica de cableado", desc: "Conecta los pines lógicos del L298N a los pines PWM del Arduino." },
      { title: "Sensado", desc: "Coloca el sensor ultrasónico mirando al frente para detectar obstáculos." },
    ],
    nodeLabels: {
      n1: "Batería LiPo principal",
      n2: "Regulador de 5V",
      n3: "Controlador principal (Arduino)",
      n4: "Sensor ultrasónico frontal",
      n5: "Driver de motores",
      n6: "Motor de tracción derecho",
      n7: "Motor de tracción izquierdo",
      n8: "Servo de dirección",
    },
  },
};

const partsEs: Record<string, PartLocale> = {
  c1: {
    name: "Arduino Uno R3",
    description: "Placa microcontroladora clásica basada en ATmega328P.",
    specs: { Microcontrolador: "ATmega328P", "Voltaje de operación": "5V" },
  },
  c5: {
    name: "Sensor ultrasónico HC-SR04",
    description: "Módulo de medición por ultrasonido de 2 cm a 400 cm.",
    specs: { Voltaje: "5V", "Distancia de medición": "2cm - 400cm" },
  },
  c11: {
    name: "Micro servo SG90",
    description: "Servomotor pequeño y liviano con alta potencia de salida.",
    specs: { Torque: "1.8 kg-cm", Velocidad: "0.1 s/60°" },
  },
  c13: {
    name: "Motor DC con caja reductora",
    description: "Motor TT para autos inteligentes y robots.",
    specs: { Voltaje: "3-6V", Relación: "1:48" },
  },
  c16: {
    name: "Batería Li-ion 18650 2600mAh",
    description: "Celda de litio-ion recargable.",
    specs: { Capacidad: "2600mAh", Voltaje: "3.7V" },
  },
  c18: {
    name: "Convertidor buck LM2596",
    description: "Módulo DC-DC reductor de voltaje.",
    specs: { Entrada: "3.2V-40V", Salida: "1.25V-35V" },
  },
  c21: {
    name: "Driver de motor L298N",
    description: "Driver dual H-Bridge para motores DC o paso a paso.",
    specs: { "Voltaje motor": "5V-35V", "Voltaje lógica": "5V" },
  },
};

export function localizePart(part: Part, locale: Locale): Part {
  if (locale === "en") return part;
  const loc = partsEs[part.id];
  if (!loc) return part;
  return {
    ...part,
    name: loc.name ?? part.name,
    description: loc.description ?? part.description,
    specs: loc.specs ?? part.specs,
  };
}

export function localizeScenario(scenario: AIScenario, locale: Locale): AIScenario {
  if (locale === "en") return scenario;
  const loc = scenarioEs[scenario.id];
  if (!loc) return scenario;

  return {
    ...scenario,
    prompt: loc.prompt ?? scenario.prompt,
    projectName: loc.projectName ?? scenario.projectName,
    systemPlan: loc.systemPlan ?? scenario.systemPlan,
    overview: { ...scenario.overview, ...loc.overview },
    learningSteps: loc.learningSteps ?? scenario.learningSteps,
    nodes: scenario.nodes.map((node) => ({
      ...node,
      label: loc.nodeLabels?.[node.id] ?? node.label,
    })),
  };
}
