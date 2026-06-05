"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Package } from "lucide-react";

const Particles = dynamic(() => import("@/components/Particles"), { ssr: false });

const ROTATE_MS = 5500;
const DISPLAY = { fontFamily: "var(--font-display)" } as const;

const FEATURED_KITS = [
  {
    tag: "Starter",
    name: "Arduino Master Kit",
    level: "Beginner",
    price: 45,
    parts: 8,
    desc: "Todo lo esencial para aprender electrónica desde cero y crear tu primer sistema funcional.",
    img: "/mock/kit-arduino.png",
    accent: "#a855f7",
    href: "/kits/k1",
  },
  {
    tag: "Robotics",
    name: "RC Car Chassis",
    level: "Intermediate",
    price: 65,
    parts: 8,
    desc: "Control de motores, sensores ultrasónicos y conectividad inalámbrica en un solo kit.",
    img: "/mock/kit-car.png",
    accent: "#f43f5e",
    href: "/kits/k2",
  },
  {
    tag: "IoT",
    name: "Weather Station",
    level: "Intermediate",
    price: 40,
    parts: 5,
    desc: "Mide, registra y visualiza datos ambientales usando WiFi y servicios cloud.",
    img: "/mock/kit-weather.jpg",
    accent: "#38bdf8",
    href: "/kits/k3",
  },
  {
    tag: "Automation",
    name: "Robotic Arm",
    level: "Intermediate",
    price: 85,
    parts: 6,
    desc: "Un brazo robótico de escritorio para practicar movimiento, precisión y control en tiempo real.",
    img: "/mock/kit-arm.jpg",
    accent: "#f59e0b",
    href: "/kits/k4",
  },
] as const;

export default function HeroKitShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeKit, setActiveKit] = useState(0);
  const [paused, setPaused] = useState(false);
  const kit = FEATURED_KITS[activeKit];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActiveKit((i) => (i + 1) % FEATURED_KITS.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  // Crossfade animation between kits
  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.fromTo(
        ".kit-photo",
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }
      );
      gsap.fromTo(
        ".kit-text > *",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: "power2.out", delay: 0.15 }
      );

      if (!paused) {
        gsap.fromTo(
          ".kit-timer-fill",
          { scaleX: 0 },
          { scaleX: 1, duration: ROTATE_MS / 1000, ease: "none", overwrite: true }
        );
      }
    },
    { scope: wrapRef, dependencies: [activeKit, paused], revertOnUpdate: true }
  );

  // Initial shell entry
  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      gsap.from(".kit-shell", {
        x: 24,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        delay: 0.1,
      });
    },
    { scope: wrapRef }
  );

  return (
    <div
      ref={wrapRef}
      className="h-img-wrap hidden lg:flex absolute top-0 right-0 w-[46%] h-full p-1.5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="kit-shell relative flex flex-col w-full h-full border border-white/10 bg-[#0a0a0d] overflow-hidden">

        {/* Subtle particles — single subtle accent, not decoration */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <Particles
            particleCount={28}
            particleSpread={6}
            speed={0.03}
            particleColors={[kit.accent, "#ffffff"]}
            alphaParticles
            particleBaseSize={50}
            sizeRandomness={0.7}
            disableRotation
          />
        </div>

        {/* Header strip */}
        <div className="relative z-10 px-5 py-4 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: kit.accent }} />
            <span className="font-mono text-[10px] text-white/55 tracking-[0.32em] uppercase">Featured Kits</span>
          </div>
          <span className="font-mono text-[10px] text-white/30 tabular-nums tracking-wider">
            {String(activeKit + 1).padStart(2, "0")} / {String(FEATURED_KITS.length).padStart(2, "0")}
          </span>
        </div>

        {/* Main photo area — fills most space, photo is the hero */}
        <Link
          href={kit.href}
          className="group relative flex-1 min-h-0 overflow-hidden block"
        >
          {/* The actual kit photo */}
          <div className="kit-photo absolute inset-0">
            <img
              src={kit.img}
              alt={kit.name}
              className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
            />
            {/* Photo tint */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-700" />
            {/* Bottom gradient for text legibility */}
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/85 to-transparent" />
          </div>

          {/* Accent vertical line — left edge */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px] z-10"
            style={{ backgroundColor: kit.accent, opacity: 0.6 }}
          />

          {/* Tag chip — top right */}
          <div className="absolute top-5 right-5 z-10">
            <span
              className="font-mono text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 border backdrop-blur-sm"
              style={{
                borderColor: `${kit.accent}55`,
                color: kit.accent,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              {kit.tag}
            </span>
          </div>

          {/* Bottom content — clean editorial layout */}
          <div className="kit-text absolute inset-x-0 bottom-0 p-6 z-10 space-y-3">
            <div className="flex items-center gap-2">
              <Package size={11} className="text-white/40" />
              <span className="font-mono text-[10px] text-white/40 tracking-wider uppercase">
                {kit.parts} componentes · {kit.level}
              </span>
            </div>

            <h3
              style={DISPLAY as CSSProperties}
              className="text-[clamp(28px,3.2vw,42px)] leading-[0.92] uppercase text-white"
            >
              {kit.name}
            </h3>

            <p className="text-[13px] text-white/60 leading-relaxed max-w-[42ch]">
              {kit.desc}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span
                className="font-mono text-lg font-bold tabular-nums"
                style={{ color: kit.accent }}
              >
                ${kit.price}
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-wider uppercase text-white/70 group-hover:text-white transition-colors">
                Ver kit
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          </div>
        </Link>

        {/* Kit selector strip — minimal, photos as thumbnails */}
        <div className="relative z-10 border-t border-white/[0.06] bg-black/40 backdrop-blur-sm">
          <div className="grid grid-cols-4 gap-px bg-white/[0.04]">
            {FEATURED_KITS.map((item, i) => {
              const active = i === activeKit;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveKit(i)}
                  className={`relative group/btn aspect-[3/2] overflow-hidden transition-all duration-300 ${
                    active ? "bg-black" : "bg-[#0a0a0d] hover:bg-[#101015]"
                  }`}
                  aria-current={active}
                  aria-label={`Ver ${item.name}`}
                >
                  <img
                    src={item.img}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                      active ? "opacity-100" : "opacity-30 grayscale group-hover/btn:opacity-60 group-hover/btn:grayscale-0"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 transition-colors duration-300 ${
                      active ? "bg-black/30" : "bg-black/60"
                    }`}
                  />
                  <div className="absolute inset-0 flex items-end justify-start p-2">
                    <span
                      className="font-mono text-[8px] tracking-[0.25em] uppercase transition-colors"
                      style={{ color: active ? item.accent : "rgba(255,255,255,0.45)" }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  {/* Progress bar — only on active */}
                  {active && (
                    <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-white/[0.06]">
                      <span
                        className="kit-timer-fill block w-full h-full origin-left"
                        style={{ transform: "scaleX(0)", backgroundColor: item.accent }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
