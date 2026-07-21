"use client";

import { useState } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { Edges, Grid, Html, Line, OrbitControls } from "@react-three/drei";
import { Box, ChevronRight, Focus, Layers3, Ruler, Rotate3D } from "lucide-react";
import type { Locale } from "@/i18n/types";

type MechanicalPart = {
  id: string;
  group: string;
  label: { es: string; en: string };
  color: string;
  forgeObject: string;
  dimensions: string;
  axes: [string, string, string];
  category: "MCU" | "SENSOR" | "ACTUATOR" | "POWER" | "MODULE" | "3D PRINT";
};

const MECHANICAL_PARTS: MechanicalPart[] = [
  { id: "chassis", group: "structure", label: { es: "Chasis principal", en: "Main chassis" }, color: "#38bdf8", forgeObject: "Chassis", dimensions: "142 × 84 × 4 mm", axes: ["142", "84", "4"], category: "3D PRINT" },
  { id: "controller", group: "electronics", label: { es: "Arduino Uno R3", en: "Arduino Uno R3" }, color: "#00f0ff", forgeObject: "Arduino Uno mount", dimensions: "69 × 54 × 15 mm", axes: ["69", "54", "15"], category: "MCU" },
  { id: "battery", group: "electronics", label: { es: "Batería Li-ion 18650", en: "18650 Li-ion battery" }, color: "#facc15", forgeObject: "18650 battery holder", dimensions: "65 × 36 × 20 mm", axes: ["65", "36", "20"], category: "POWER" },
  { id: "regulator", group: "electronics", label: { es: "Regulador LM2596", en: "LM2596 regulator" }, color: "#a855f7", forgeObject: "LM2596 mount", dimensions: "43 × 21 × 14 mm", axes: ["43", "21", "14"], category: "MODULE" },
  { id: "driver", group: "electronics", label: { es: "Driver L298N", en: "L298N motor driver" }, color: "#c026d3", forgeObject: "L298N mount", dimensions: "44 × 44 × 30 mm", axes: ["44", "44", "30"], category: "MODULE" },
  { id: "sensor", group: "electronics", label: { es: "Sensor HC-SR04", en: "HC-SR04 sensor" }, color: "#39ff14", forgeObject: "HC-SR04 mount", dimensions: "45 × 20 × 16 mm", axes: ["45", "20", "16"], category: "SENSOR" },
  { id: "rightMotor", group: "motion", label: { es: "Motor DC derecho", en: "Right DC motor" }, color: "#f97316", forgeObject: "Right motor bracket", dimensions: "70 × 25 × 25 mm", axes: ["70", "25", "25"], category: "ACTUATOR" },
  { id: "leftMotor", group: "motion", label: { es: "Motor DC izquierdo", en: "Left DC motor" }, color: "#fb923c", forgeObject: "Left motor bracket", dimensions: "70 × 25 × 25 mm", axes: ["70", "25", "25"], category: "ACTUATOR" },
  { id: "servo", group: "motion", label: { es: "Servo SG90", en: "SG90 steering servo" }, color: "#ff5e00", forgeObject: "SG90 servo bracket", dimensions: "23 × 12 × 29 mm", axes: ["23", "12", "29"], category: "ACTUATOR" },
];

const CATEGORY_COLORS: Record<MechanicalPart["category"], string> = {
  MCU: "#00f0ff",
  SENSOR: "#39ff14",
  ACTUATOR: "#ff5e00",
  POWER: "#ffcc00",
  MODULE: "#a855f7",
  "3D PRINT": "#60a5fa",
};

function DimensionLabel({ position, axis, value, color }: { position: [number, number, number]; axis: string; value: string; color: string }) {
  return (
    <Html position={position} center style={{ pointerEvents: "none" }}>
      <div className="whitespace-nowrap bg-[#08080b]/85 px-1.5 py-1 font-mono text-[10px] font-bold leading-none" style={{ color }}>
        <span className="mr-1 text-white">{axis}</span>{value}
      </div>
    </Html>
  );
}

function AssemblyDimensions() {
  return (
    <group>
      <Line points={[[-2.8, -0.38, 2.3], [2.8, -0.38, 2.3]]} color="#e2e8f0" lineWidth={1} />
      <Line points={[[-3.3, -0.38, -1.65], [-3.3, -0.38, 1.65]]} color="#7dd3fc" lineWidth={1} />
      <Line points={[[-3.3, -0.35, -1.65], [-3.3, 1.05, -1.65]]} color="#fde047" lineWidth={1} />
      <DimensionLabel position={[0, -0.28, 2.3]} axis="X" value="142 mm" color="#e2e8f0" />
      <DimensionLabel position={[-3.3, -0.28, 0]} axis="Y" value="84 mm" color="#7dd3fc" />
      <DimensionLabel position={[-3.3, 0.45, -1.65]} axis="Z" value="22 mm" color="#fde047" />
    </group>
  );
}

function SelectableBox({
  id,
  selected,
  color,
  position,
  size,
  onSelect,
}: {
  id: string;
  selected: boolean;
  color: string;
  position: [number, number, number];
  size: [number, number, number];
  onSelect: (id: string) => void;
}) {
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(id);
  };

  return (
    <mesh position={position} onClick={handleClick} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={selected ? 0.42 : 0.16}
        roughness={0.42}
        metalness={0.18}
        emissive={selected ? color : "#000000"}
        emissiveIntensity={selected ? 0.12 : 0}
        depthWrite={false}
      />
      <Edges color={selected ? "#ffffff" : color} threshold={15} />
    </mesh>
  );
}

function RcCarAssembly({ selectedPart, onSelect }: { selectedPart: string; onSelect: (id: string) => void }) {
  return (
    <group rotation={[0, -0.16, 0]}>
      {/* Overall mechanical envelope. Components remain simple dimensioned volumes. */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[6.6, 1.55, 4.3]} />
        <meshStandardMaterial color="#facc15" transparent opacity={0.035} depthWrite={false} />
        <Edges color="#facc15" />
      </mesh>

      <SelectableBox id="chassis" selected={selectedPart === "chassis"} color="#38bdf8" position={[0, 0, 0]} size={[5.6, 0.34, 3.3]} onSelect={onSelect} />
      <SelectableBox id="controller" selected={selectedPart === "controller"} color="#00f0ff" position={[-0.9, 0.48, 0.48]} size={[1.45, 0.38, 1.1]} onSelect={onSelect} />
      <SelectableBox id="battery" selected={selectedPart === "battery"} color="#facc15" position={[1.25, 0.55, 0.55]} size={[1.55, 0.5, 0.76]} onSelect={onSelect} />
      <SelectableBox id="regulator" selected={selectedPart === "regulator"} color="#a855f7" position={[0.82, 0.43, -0.92]} size={[0.95, 0.32, 0.5]} onSelect={onSelect} />
      <SelectableBox id="driver" selected={selectedPart === "driver"} color="#c026d3" position={[-0.42, 0.52, -1.02]} size={[1, 0.58, 0.76]} onSelect={onSelect} />
      <SelectableBox id="sensor" selected={selectedPart === "sensor"} color="#39ff14" position={[-2.48, 0.67, 0]} size={[0.3, 0.94, 1.2]} onSelect={onSelect} />
      <SelectableBox id="rightMotor" selected={selectedPart === "rightMotor"} color="#f97316" position={[1.72, 0.18, 1.7]} size={[1.4, 0.58, 0.46]} onSelect={onSelect} />
      <SelectableBox id="leftMotor" selected={selectedPart === "leftMotor"} color="#fb923c" position={[1.72, 0.18, -1.7]} size={[1.4, 0.58, 0.46]} onSelect={onSelect} />
      <SelectableBox id="servo" selected={selectedPart === "servo"} color="#ff5e00" position={[-1.62, 0.5, -0.58]} size={[0.58, 0.68, 0.42]} onSelect={onSelect} />
    </group>
  );
}

export default function MechanicalViewer({ locale }: { locale: Locale }) {
  const [selectedPart, setSelectedPart] = useState("chassis");
  const [viewKey, setViewKey] = useState(0);
  const selected = MECHANICAL_PARTS.find((part) => part.id === selectedPart) ?? MECHANICAL_PARTS[0];
  const copy = locale === "es"
    ? {
        title: "Vista mecánica",
        subtitle: "Volúmenes de componentes y cotas",
        structure: "Estructura",
        electronics: "Electrónica",
        motion: "Movimiento",
        selected: "Ensamble mecánico",
        assembly: "Vehículo RC",
        hint: "Arrastra para rotar, usa la rueda para acercar o alejar",
        reset: "Centrar modelo",
        dimensions: "Dimensiones",
      }
    : {
        title: "Mechanical view",
        subtitle: "Component volumes and dimensions",
        structure: "Structure",
        electronics: "Electronics",
        motion: "Motion",
        selected: "Mechanical assembly",
        assembly: "RC vehicle",
        hint: "Drag to rotate, use the wheel to zoom",
        reset: "Center model",
        dimensions: "Dimensions",
      };

  const groupLabels: Record<string, string> = {
    structure: copy.structure,
    electronics: copy.electronics,
    motion: copy.motion,
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#08080b]">
      <div className="absolute inset-x-0 top-0 z-20 h-11 border-b border-[#00f0ff]/15 bg-[#0a0a0d] px-3 sm:px-4 flex items-center gap-2">
        <Box size={13} className="text-[#00f0ff]" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#00f0ff]">{copy.title}</p>
          <p className="hidden sm:block text-[9px] text-gray-500 truncate">{copy.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setViewKey((key) => key + 1)}
          className="ml-auto inline-flex items-center gap-1.5 border border-white/10 px-2 py-1 text-[9px] text-gray-400 hover:border-[#00f0ff]/40 hover:text-white transition-colors"
          title={copy.reset}
        >
          <Focus size={11} />
          <span className="hidden sm:inline">{copy.reset}</span>
        </button>
      </div>

      <Canvas
        key={viewKey}
        className="!absolute !inset-0 !top-11"
        camera={{ position: [8.5, 6.2, 9.5], fov: 36, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        shadows
        onPointerMissed={() => setSelectedPart("chassis")}
      >
        <color attach="background" args={["#08080b"]} />
        <fog attach="fog" args={["#08080b", 14, 26]} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[6, 9, 5]} intensity={2.2} castShadow />
        <pointLight position={[-6, 4, -4]} color="#00f0ff" intensity={18} distance={18} />
        <RcCarAssembly selectedPart={selectedPart} onSelect={setSelectedPart} />
        <AssemblyDimensions />
        <Grid
          position={[0, -0.5, 0]}
          args={[30, 30]}
          cellSize={0.7}
          cellThickness={0.45}
          cellColor="#164e63"
          sectionSize={3.5}
          sectionThickness={0.7}
          sectionColor="#155e75"
          fadeDistance={22}
          fadeStrength={1.8}
          infiniteGrid
        />
        <OrbitControls
          makeDefault
          enablePan
          enableZoom
          minDistance={5}
          maxDistance={24}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0.2, 0]}
        />
      </Canvas>

      <div className="absolute z-20 left-2 right-2 bottom-2 h-28 sm:left-3 sm:right-auto sm:top-14 sm:bottom-3 sm:h-auto sm:w-64 border border-white/10 bg-[#0a0a0d]/95 flex flex-col">
        <div className="shrink-0 px-3 py-2 border-b border-white/8 flex items-center gap-2">
          <Layers3 size={11} className="text-[#00f0ff]" />
          <span className="text-[9px] uppercase tracking-widest text-gray-400">{copy.selected}</span>
          <span className="ml-auto h-2 w-2" style={{ backgroundColor: selected.color }} />
        </div>
        <div className="flex-1 min-h-0 overflow-x-auto sm:overflow-y-auto p-2 custom-scrollbar">
          <div className="mb-2 flex items-center gap-1.5 px-1 py-1 text-[10px] font-bold text-gray-300">
            <ChevronRight size={10} className="text-gray-600" />
            <span className="h-2 w-2 bg-[#ffcc00]" />
            <span>{copy.assembly}</span>
          </div>
          {Object.entries(groupLabels).map(([group, groupLabel]) => (
            <div key={group} className="ml-3 min-w-[150px] sm:min-w-0 sm:mb-2 last:mb-0">
              <p className="mb-1 flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-gray-600">
                <ChevronRight size={9} /> {groupLabel}
              </p>
              <div className="space-y-0.5">
                {MECHANICAL_PARTS.filter((part) => part.group === group).map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setSelectedPart(part.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-[10px] transition-colors ${selectedPart === part.id ? "bg-white/10 text-white" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}
                  >
                    <span className="h-1.5 w-1.5 shrink-0" style={{ backgroundColor: part.color }} />
                    <span className="truncate">{part.label[locale]}</span>
                    <span className="ml-auto text-[7px]" style={{ color: CATEGORY_COLORS[part.category] }}>{part.category}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden shrink-0 flex-wrap gap-x-2 gap-y-1 border-t border-white/10 px-3 py-2 sm:flex">
          {(Object.keys(CATEGORY_COLORS) as MechanicalPart["category"][]).map((category) => {
            const count = MECHANICAL_PARTS.filter((part) => part.category === category).length;
            return count > 0 ? (
              <span key={category} className="flex items-center gap-1 text-[7px] font-bold" style={{ color: CATEGORY_COLORS[category] }}>
                <span className="h-1.5 w-1.5" style={{ backgroundColor: CATEGORY_COLORS[category] }} />
                {category} ({count})
              </span>
            ) : null;
          })}
        </div>
      </div>

      <aside className="absolute right-3 top-14 z-20 hidden w-52 border border-white/10 bg-[#0a0a0d]/95 md:block">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
          <Ruler size={12} className="text-[#00f0ff]" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">{copy.dimensions}</span>
        </div>
        <div className="p-3">
          <p className="truncate text-[11px] font-bold text-white">{selected.label[locale]}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-3">
            {selected.axes.map((value, index) => (
              <div key={index}>
                <p className="text-[8px] font-bold" style={{ color: ["#e2e8f0", "#7dd3fc", "#fde047"][index] }}>{["X", "Y", "Z"][index]}</p>
                <p className="mt-1 text-[10px] text-gray-300">{value}</p>
                <p className="text-[7px] text-gray-600">mm</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="absolute right-3 bottom-3 z-20 hidden lg:flex items-center gap-2 bg-[#0a0a0d]/90 border border-white/10 px-2.5 py-1.5 text-[9px] text-gray-500">
        <Rotate3D size={11} className="text-[#00f0ff]" />
        {copy.hint}
      </div>
    </div>
  );
}
