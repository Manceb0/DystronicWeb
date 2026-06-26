"use client";

import { useMemo, useRef } from "react";
import { useTranslation } from "@/i18n/LanguageProvider";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Bot, ChevronDown, CheckCircle2, MessageCircle } from "lucide-react";

import BlurText from "@/components/BlurText";
import ShinyText from "@/components/ShinyText";
import CountUp from "@/components/CountUp";
import { BorderBeam } from "@/components/border-beam";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Typewriter } from "@/components/ui/typewriter-text";
import HeroKitShowcase from "@/components/home/HeroKitShowcase";

// WebGL Particles — dynamic import, no SSR
const Particles = dynamic(() => import("@/components/Particles"), { ssr: false });

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DISPLAY = { fontFamily: "var(--font-display)" } as const;

export default function Home() {
  const { t } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);
  const whatsappHref = `https://wa.me/18296486202?text=${encodeURIComponent("Hola Manuel, quiero crear un carro RC con el AI Builder de Dystronic.")}`;

  const headlineLines = useMemo(() => [
    { text: t("home.headline1"), outline: false },
    { text: t("home.headline2"), outline: true },
    { text: t("home.headline3"), outline: false },
  ], [t]);

  const modules = useMemo(() => [
    { tag: t("home.modules.catalog.tag"), label: t("home.modules.catalog.label"), desc: t("home.modules.catalog.desc"), href: "/store", accent: "#38bdf8", img: "/mock/esp32.jpg", imgAlt: "ESP32 DevKit" },
    { tag: t("home.modules.kits.tag"), label: t("home.modules.kits.label"), desc: t("home.modules.kits.desc"), href: "/kits", accent: "#a855f7", img: "/mock/kit-arduino.png", imgAlt: "Starter Kit" },
    { tag: t("home.modules.courses.tag"), label: t("home.modules.courses.label"), desc: t("home.modules.courses.desc"), href: "/courses", accent: "#f59e0b", img: "/mock/course-arduino.jpg", imgAlt: "Arduino course" },
    { tag: t("home.modules.community.tag"), label: t("home.modules.community.label"), desc: t("home.modules.community.desc"), href: "/community", accent: "#34d399", img: "/mock/jumpers-used.jpg", imgAlt: "Used parts" },
  ], [t]);

  const typewriterTexts = useMemo(() => [
    t("home.typewriter.0"),
    t("home.typewriter.1"),
    t("home.typewriter.2"),
    t("home.typewriter.3"),
  ], [t]);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set([".hw", ".h-body", ".h-img", ".scroll-cue", ".mod-row", ".close-content", ".ai-word", ".term-line"], { clearProps: "all" });
      return;
    }

    // ── Hero: headline words clip-reveal ─────────────────
    gsap.from(".hw", {
      yPercent: 108,
      stagger: 0.08,
      duration: 0.72,
      ease: "power3.out",
      delay: 0.08,
    });

    // ── Hero: body fades up (BlurText handles description) ─
    gsap.from(".h-body", { opacity: 0, y: 18, duration: 0.6, ease: "power2.out", delay: 0.42 });

    // ── Hero: kit showcase parallax on scroll ─────────────
    gsap.to(".h-img-wrap", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // ── Scroll cue: bob + fade on scroll ─────────────────
    gsap.to(".scroll-cue", { y: 6, repeat: -1, yoyo: true, duration: 1.1, ease: "sine.inOut" });
    gsap.to(".scroll-cue", {
      opacity: 0,
      scrollTrigger: { trigger: ".hero-section", start: "top top", end: "20% top", scrub: true },
    });

    // ── AI Lab: headline clip reveal ──────────────────────
    gsap.from(".ai-word", {
      yPercent: 105,
      stagger: 0.07,
      duration: 0.65,
      ease: "power3.out",
      scrollTrigger: { trigger: ".ai-section", start: "top 72%" },
    });

    // ── AI Lab: terminal lines stagger ────────────────────
    gsap.from(".term-line", {
      opacity: 0,
      x: 10,
      stagger: 0.22,
      duration: 0.35,
      ease: "power2.out",
      scrollTrigger: { trigger: ".ai-section", start: "top 68%" },
    });
    gsap.to(".term-cursor", {
      opacity: 0, repeat: -1, yoyo: true, duration: 0.55, ease: "none",
    });

    // ── Modules ───────────────────────────────────────────
    gsap.from(".mod-row", {
      opacity: 0,
      x: -24,
      stagger: 0.09,
      duration: 0.52,
      ease: "power2.out",
      scrollTrigger: { trigger: ".mods-section", start: "top 80%" },
    });

    // ── Closing ───────────────────────────────────────────
    gsap.from(".close-content", {
      opacity: 0,
      y: 28,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: ".close-section", start: "top 76%" },
    });
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="flex flex-col min-h-screen bg-[#09090b] text-white overflow-x-hidden">

      {/* ═══ HERO ════════════════════════════════════════════ */}
      <section className="hero-section relative lg:min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Grid bg */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)`,
          backgroundSize: "72px 72px",
        }} />

        <p aria-hidden className="absolute top-6 right-6 md:right-10 font-mono text-[9px] text-white/15 tracking-[0.25em] uppercase leading-loose hidden sm:block select-none">
          DYS-001 // ACTIVE<br />Est. 2024
        </p>

        <HeroKitShowcase />

        {/* LEFT: text */}
        <div className="relative z-10 flex flex-col justify-center lg:min-h-[calc(100vh-4rem)] pt-5 pb-8 lg:py-20 px-6 md:px-12 lg:px-16 lg:w-[54%]">

          {/* Eyebrow — ShinyText for metallic sweep on cyan */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-7 h-px bg-[#38bdf8] shrink-0" />
            <ShinyText
              text={t("home.eyebrow")}
              speed={3}
              color="#38bdf8"
              shineColor="#a5f3fc"
              spread={100}
              delay={1.5}
              className="font-mono text-[10px] tracking-[0.32em] uppercase"
            />
          </div>

          {/* Headline — GSAP clip reveal */}
          <h1
            style={{ ...DISPLAY, textWrap: "balance" } as React.CSSProperties}
            className="text-[clamp(52px,6.2vw,92px)] leading-[0.9] uppercase mb-9"
          >
            {headlineLines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <span
                  className="hw block"
                  style={line.outline ? { WebkitTextStroke: "1.5px rgba(255,255,255,0.28)", color: "transparent" } : undefined}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          {/* Body */}
          <div className="h-body">
            {/* Description — BlurText word-by-word */}
            <div className="mb-7">
              <p className="sm:hidden text-white/50 text-[14px] leading-relaxed font-light max-w-[34ch]">
                {t("home.description")}
              </p>
              <div className="hidden sm:block">
                <BlurText
                  text={t("home.description")}
                  delay={60}
                  animateBy="words"
                  direction="bottom"
                  stepDuration={0.3}
                  className="text-white/45 text-[15px] leading-relaxed font-light max-w-[36ch]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mb-8 max-w-[520px]">
              <Link href="/store" className="col-span-1 order-2 sm:order-none">
                <button className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-4 sm:px-5 py-3 sm:py-2.5 bg-white/[0.06] sm:bg-[#f43f5e] border border-white/12 sm:border-transparent text-white font-mono text-[12px] sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 hover:bg-[#e11d48]">
                  {t("home.exploreParts")}
                  <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </Link>
              <div className="col-span-2 sm:col-span-1 order-1 sm:order-none">
                <MagneticButton distance={0.5}>
                  <Link href="/ai-builder" className="block h-full">
                    <button className="group relative inline-flex h-full w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-2.5 bg-[#00f0ff] text-black overflow-hidden transition-all duration-300 shadow-[0_0_0_1px_rgba(0,240,255,0.35),0_18px_55px_rgba(0,240,255,0.25)] hover:bg-[#39ff14] hover:shadow-[0_0_0_1px_rgba(57,255,20,0.45),0_18px_55px_rgba(57,255,20,0.22)] active:scale-[0.985]">
                      <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
                      <Bot size={12} className="relative" />
                      <span className="relative font-mono text-[12px] sm:text-[13px] font-bold tracking-wider uppercase">{t("home.tryAiBuilder")}</span>
                      <span className="relative flex h-[6px] w-[6px] shrink-0">
                        <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-black" />
                      </span>
                    </button>
                  </Link>
                </MagneticButton>
              </div>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="col-span-1 sm:col-span-1 order-3 sm:order-none group inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3 sm:py-2.5 bg-[#25D366] text-black font-mono text-[12px] sm:text-[13px] font-bold tracking-wider uppercase transition-colors duration-200 hover:bg-[#1ebe57] shadow-[0_18px_45px_rgba(37,211,102,0.18)] active:scale-[0.985]">
                <MessageCircle size={13} />
                WhatsApp
                <ArrowUpRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* Stats — CountUp numbers */}
            <div className="mb-8 hidden sm:grid grid-cols-[1.25fr_0.9fr_0.9fr] gap-2 max-w-[520px]">
              {[
                { img: "/mock/kit-car.png", name: "Carro RC", meta: "Demo principal" },
                { img: "/mock/l298n.jpg", name: "L298N", meta: "Driver" },
                { img: "/mock/dc-gear.jpg", name: "Motores", meta: "x2" },
              ].map((item) => (
                <div key={item.name} className="group relative min-h-[92px] overflow-hidden border border-white/[0.08] bg-white/[0.025]">
                  <img src={item.img} alt={item.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-[11px] font-bold text-white leading-tight">{item.name}</p>
                    <p className="font-mono text-[8px] uppercase tracking-wider text-[#38bdf8]">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-6 pt-5 border-t border-white/[0.06]">
              <div>
                <p className="font-mono text-xl font-bold tabular-nums flex items-end gap-0.5">
                  <CountUp to={5000} from={0} duration={2} separator="," className="text-white" />
                  <span className="text-white">+</span>
                </p>
                <p className="font-mono text-[9px] text-white/28 tracking-[0.25em] uppercase mt-0.5">{t("home.partsStocked")}</p>
              </div>
              <div className="w-px h-8 bg-white/[0.07]" />
              <div>
                <p className="font-mono text-xl font-bold tabular-nums flex items-end gap-0.5">
                  <CountUp to={48} from={0} duration={1.5} className="text-white" />
                  <span className="text-white/60 text-sm font-normal">h</span>
                </p>
                <p className="font-mono text-[9px] text-white/28 tracking-[0.25em] uppercase mt-0.5">{t("home.avgRestock")}</p>
              </div>
              <div className="w-px h-8 bg-white/[0.07]" />
              <div>
                <p className="font-mono text-xl font-bold">Lab</p>
                <p className="font-mono text-[9px] text-white/28 tracking-[0.25em] uppercase mt-0.5">{t("home.testedVerified")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 z-20 lg:left-[27%]">
          <span className="font-mono text-[8px] text-white/20 tracking-[0.3em] uppercase">{t("common.scroll")}</span>
          <ChevronDown size={14} className="text-white/20" />
        </div>
      </section>

      {/* ═══ AI LAB ══════════════════════════════════════════ */}
      <section className="ai-section relative border-t border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-[#060f14]" />

        {/* React Bits WebGL Particles background */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <Particles
            particleCount={80}
            particleSpread={8}
            speed={0.06}
            particleColors={["#38bdf8", "#2dd4bf", "#0ea5e9", "#14b8a6"]}
            alphaParticles={true}
            particleBaseSize={70}
            sizeRandomness={0.8}
            moveParticlesOnHover={false}
            disableRotation={false}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <h2 style={DISPLAY as React.CSSProperties} className="text-[clamp(48px,6.8vw,92px)] leading-[0.88] uppercase mb-6">
              {[t("home.aiLabTitle1"), t("home.aiLabTitle2"), t("home.aiLabTitle3")].map((word, i) => (
                <span key={i} className="block overflow-hidden">
                  <span className={`ai-word block ${i === 1 ? "text-teal-400" : ""}`}>{word}</span>
                </span>
              ))}
            </h2>

            <p className="text-white/40 max-w-[42ch] leading-relaxed text-[15px] mb-8">
              {t("home.aiLabDesc")}
            </p>

            <MagneticButton distance={0.5}>
              <Link href="/ai-builder" className="inline-block">
                <button className="group relative inline-flex items-center gap-3 px-6 py-3.5 border border-teal-500/50 text-teal-400 overflow-hidden transition-all duration-300 hover:border-teal-400 hover:shadow-[0_0_28px_rgba(45,212,191,0.18)]">
                  <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-teal-400/15 to-transparent pointer-events-none" />
                  <span className="relative flex h-[7px] w-[7px] shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-teal-400" />
                  </span>
                  <span className="relative font-mono text-[13px] font-bold tracking-wider uppercase">{t("home.openLab")}</span>
                  <ArrowUpRight size={13} className="relative transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </Link>
            </MagneticButton>
          </div>

          {/* RIGHT: AI Shopping Assistant UI */}
          <div className="space-y-3">

            {/* Prompt input — animated with Typewriter */}
            <div className="relative border border-white/10 bg-white/[0.02] px-5 py-4 flex items-center gap-3">
              <Bot size={15} className="text-teal-400 shrink-0" />
              <span className="text-white/55 text-[14px] font-light flex-1 min-w-0">
                <Typewriter
                  text={typewriterTexts}
                  speed={50}
                  deleteSpeed={22}
                  delay={2000}
                  loop={true}
                  cursor="|"
                  className="text-white/55"
                />
              </span>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
            </div>

            {/* AI response card — BorderBeam from 21st.dev travels around border */}
            <div className="term-line relative border border-teal-500/15 bg-black/40 overflow-hidden">
              <BorderBeam lightColor="#2dd4bf" lightWidth={110} duration={5} borderWidth={1.5} />

              {/* Status bar */}
              <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-3">
                <CheckCircle2 size={12} className="text-teal-400 shrink-0" />
                <span className="font-mono text-[11px] text-teal-400/80 tracking-wide">{t("home.systemPlanReady")}</span>
                <span className="ml-auto font-mono text-[10px] text-white/25">7 items · ~$45</span>
              </div>

              {/* Product cards — real product photos */}
              <div className="p-4 grid grid-cols-4 gap-2">
                {[
                  { img: "/mock/arduino.png",  name: "Arduino UNO",   qty: "×1",  sku: "MCU-001" },
                  { img: "/mock/l298n.jpg",     name: "L298N Driver",  qty: "×1",  sku: "DRV-003" },
                  { img: "/mock/dc-gear.jpg",   name: "DC Gear Motor", qty: "×2",  sku: "MOT-008" },
                  { img: "/mock/ir-line.jpg",   name: "IR Sensor",     qty: "×3",  sku: "SEN-012" },
                ].map((p) => (
                  <div key={p.sku} className="group/card relative border border-white/[0.07] overflow-hidden hover:border-teal-500/30 transition-colors duration-300">
                    <div className="aspect-square bg-white/[0.02]">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/5 transition-colors duration-300" />
                      <span className="absolute top-1.5 right-1.5 font-mono text-[8px] text-teal-400/70 bg-black/50 px-1">{p.qty}</span>
                    </div>
                    <div className="px-2 py-1.5 bg-black/30">
                      <p className="font-mono text-[8px] text-white/50 leading-tight truncate">{p.name}</p>
                      <p className="font-mono text-[7px] text-white/20">{p.sku}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wiring + availability row */}
              <div className="term-line px-4 pb-4 space-y-2">
                <div className="flex items-center gap-2 border border-white/[0.05] px-3 py-2 bg-white/[0.01]">
                  <div className="flex gap-0.5 shrink-0">
                    {["bg-[#38bdf8]","bg-[#a855f7]","bg-[#f59e0b]"].map((c,i) => (
                      <span key={i} className={`w-2.5 h-px ${c} opacity-60`} />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-white/30">{t("home.wiringGenerated")}</span>
                  <span className="ml-auto font-mono text-[9px] text-teal-400/50 uppercase tracking-wider">{t("common.preview")}</span>
                </div>
                <p className="font-mono text-[9px] text-white/20 text-center">{t("home.allStocked")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MODULE LIST ═════════════════════════════════════ */}
      <section className="mods-section border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          {modules.map((mod) => (
            <Link key={mod.tag} href={mod.href}>
              <div className="mod-row group border-b border-white/[0.06] -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16 py-6 flex items-center gap-5 md:gap-9 cursor-pointer transition-colors duration-300 hover:bg-white/[0.015]">
                <span
                  className="hidden sm:block font-mono text-[9px] tracking-[0.28em] uppercase px-2 py-1 border shrink-0 transition-opacity duration-300 opacity-40 group-hover:opacity-100"
                  style={{ borderColor: `${mod.accent}55`, color: mod.accent }}
                >
                  {mod.tag}
                </span>
                <h3 className="text-lg md:text-[20px] font-bold flex-1 text-white/70 transition-colors duration-300 group-hover:text-white">
                  {mod.label}
                </h3>
                <p className="hidden md:block text-white/30 text-[13px] leading-relaxed max-w-[200px] flex-1 transition-colors duration-300 group-hover:text-white/50">
                  {mod.desc}
                </p>
                <div className="hidden lg:block relative w-[68px] h-[48px] border border-white/10 overflow-hidden shrink-0 transition-all duration-300 group-hover:border-white/25">
                  <img src={mod.img} alt={mod.imgAlt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
                <ArrowUpRight size={15} className="shrink-0 text-white/15 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ CLOSING ═════════════════════════════════════════ */}
      <section className="close-section border-t border-white/[0.06] py-32 md:py-44">
        <div className="close-content max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <h2
            style={{ ...DISPLAY, textWrap: "balance" } as React.CSSProperties}
            className="text-[clamp(40px,7vw,94px)] leading-[0.9] uppercase max-w-4xl mb-8"
          >
            {t("home.closingTitle1")}{" "}
            <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.25)", color: "transparent" }}>
              {t("home.closingTitle2")}
            </span>{" "}
            {t("home.closingTitle3")}{" "}
            <span className="text-[#38bdf8]">{t("home.closingTitle4")}</span>
          </h2>
          <p className="text-white/35 max-w-[44ch] leading-relaxed text-[15px] font-light mb-10">
            {t("home.closingDesc")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/request">
              <button className="group inline-flex items-center gap-2.5 px-5 py-2.5 border border-white/15 text-white/45 font-mono text-[13px] tracking-wider uppercase transition-all duration-200 hover:border-white/40 hover:text-white">
                {t("common.requestPart")}
                <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </Link>
            <Link href="/store">
              <button className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-white text-black font-mono text-[13px] font-bold tracking-wider uppercase transition-colors duration-200 hover:bg-[#38bdf8]">
                {t("common.browseCatalog")}
                <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
