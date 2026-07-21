"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    Bot, Send, ArrowRight, Sparkles, Workflow, GraduationCap, PackageOpen, Cpu,
    Cog, Radio, BookOpen, ShoppingCart, ChevronRight, CheckCircle2,
} from "lucide-react";
import { MOCK_KITS, MOCK_COURSES, MOCK_COMPONENTS, AIScenario, Part } from "@/lib/mock-data";
import type { AIProviderMode, ProjectPlanResult } from "@/lib/ai-builder/contracts";
import { useTranslation } from "@/i18n/LanguageProvider";

gsap.registerPlugin(useGSAP);

const DEMO_RC_PROMPT = "Quiero hacer un carro RC con sensores";

type FlowMsg =
    | { id: string; role: "user"; content: string }
    | { id: string; role: "assistant"; type: "text"; content: string; done?: boolean }
    | { id: string; role: "assistant"; type: "thinking" }
    | { id: string; role: "assistant"; type: "provider-note"; mode: AIProviderMode; label: string }
    | { id: string; role: "assistant"; type: "scenario-card"; scenario: AIScenario; done?: boolean }
    | { id: string; role: "assistant"; type: "kits-card"; kitIds: string[]; done?: boolean }
    | { id: string; role: "assistant"; type: "courses-card"; courseIds: string[]; done?: boolean }
    | { id: string; role: "assistant"; type: "parts-card"; parts: { partId: string; qty: number; reason?: string }[]; done?: boolean }
    | { id: string; role: "assistant"; type: "open-builder-cta"; scenario: AIScenario; done?: boolean };

type Intent =
    | { kind: "project"; scenario: AIScenario; plan: ProjectPlanResult }
    | { kind: "course"; courseIds: string[] }
    | { kind: "kit"; kitIds: string[] }
    | { kind: "parts"; partIds: string[] }
    | { kind: "general" };

const SUGGESTIONS: { label: string; prompt: string; icon: React.ReactNode; accent: string }[] = [
    { label: "Carro RC",            prompt: "Quiero construir un carro RC con sensores",          icon: <Workflow size={14} />,      accent: "#f43f5e" },
    { label: "Estación climática",  prompt: "Necesito una estación meteorológica IoT",            icon: <Radio size={14} />,         accent: "#38bdf8" },
    { label: "Brazo robótico",      prompt: "Cómo armar un brazo robótico de 4 ejes",             icon: <Cog size={14} />,           accent: "#a855f7" },
    { label: "Aprender Arduino",    prompt: "Quiero aprender Arduino desde cero",                 icon: <GraduationCap size={14} />, accent: "#f59e0b" },
    { label: "Kit para empezar",    prompt: "¿Qué kit me recomiendan para empezar?",              icon: <PackageOpen size={14} />,   accent: "#34d399" },
    { label: "Comprar sensores",    prompt: "Necesito sensores para detección de obstáculos",     icon: <Cpu size={14} />,           accent: "#00f0ff" },
];

// Route every free-form project request through the same server-side provider boundary.
async function detectIntent(prompt: string, locale: "es" | "en"): Promise<Intent> {
    const response = await fetch("/api/ai-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, locale }),
    });
    const payload = (await response.json()) as ProjectPlanResult | { error: string };
    if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "No se pudo generar el plan.");
    }
    return { kind: "project", scenario: payload.scenario, plan: payload };
}

// ─── Typewriter hook ─────────────────────────────────────────
function useTypewriter(fullText: string, speed = 18, onDone?: () => void) {
    const [text, setText] = useState("");
    const doneCalled = useRef(false);
    useEffect(() => {
        let i = 0;
        doneCalled.current = false;
        const reset = setTimeout(() => setText(""), 0);
        const interval = setInterval(() => {
            i++;
            if (i > fullText.length) {
                clearInterval(interval);
                if (!doneCalled.current) {
                    doneCalled.current = true;
                    onDone?.();
                }
                return;
            }
            setText(fullText.slice(0, i));
        }, speed);
        return () => {
            clearTimeout(reset);
            clearInterval(interval);
        };
    }, [fullText, speed]); // eslint-disable-line
    return text;
}

// ─── Sleep helper ─────────────────────────────────────────
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// ─── MAIN COMPONENT ─────────────────────────────────────────
type Props = {
    onOpenScenario: (scenario: AIScenario) => void;
    onComplete?: () => void;
};

export default function ChatWelcomeFlow({ onOpenScenario }: Props) {
    const { locale } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const threadRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [stage, setStage] = useState<"welcome" | "chat">("welcome");
    const [thread, setThread] = useState<FlowMsg[]>([]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);

    // Auto scroll the thread
    useEffect(() => {
        threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
    }, [thread]);

    // Welcome → chat fade
    useGSAP(() => {
        if (stage === "chat") {
            gsap.from(".welcome-card", { opacity: 0, y: 24, duration: 0.6, ease: "power3.out" });
        }
    }, { scope: containerRef, dependencies: [stage] });

    // ─── Submit flow ─────────────────────────────────────────
    const pushTyped = useCallback((msg: Extract<FlowMsg, { type: "text" }>) => {
        return new Promise<void>(resolve => {
            setThread(t => [...t, { ...msg, done: false }]);
            const dur = Math.min(Math.max(msg.content.length * 22, 600), 3200);
            setTimeout(() => {
                setThread(t => t.map(m => m.id === msg.id ? { ...m, done: true } as FlowMsg : m));
                resolve();
            }, dur);
        });
    }, []);

    const markDone = useCallback(() => {
        setThread(t => {
            const last = t[t.length - 1];
            if (!last || last.role !== "assistant") return t;
            return [...t.slice(0, -1), { ...last, done: true } as FlowMsg];
        });
    }, []);

    const handleSubmit = useCallback(async (rawPrompt?: string) => {
        const prompt = (rawPrompt ?? input).trim();
        if (!prompt || busy) return;
        setBusy(true);
        setInput("");

        const userMsg: FlowMsg = { id: `u-${Date.now()}`, role: "user", content: prompt };
        setThread(t => [...t, userMsg]);
        if (stage === "welcome") setStage("chat");

        await sleep(450);
        const thinkingId = `a-thinking-${Date.now()}`;
        setThread(t => [...t, { id: thinkingId, role: "assistant", type: "thinking" }]);

        await sleep(1100);

        let intent: Intent;
        try {
            intent = await detectIntent(prompt, locale);
        } catch (error) {
            setThread(t => [
                ...t.filter(m => m.id !== thinkingId),
                {
                    id: `a-error-${Date.now()}`,
                    role: "assistant",
                    type: "text",
                    content: error instanceof Error ? error.message : "No se pudo generar el plan.",
                    done: true,
                },
            ]);
            setBusy(false);
            return;
        }

        // Remove thinking, push intro text
        setThread(t => t.filter(m => m.id !== thinkingId));

        if (intent.kind === "project") {
            const scenario = intent.scenario;
            setThread(t => [...t, {
                id: `a-provider-${Date.now()}`,
                role: "assistant",
                type: "provider-note",
                mode: intent.plan.mode,
                label: intent.plan.notice,
            }]);

            await pushTyped({
                id: `a-text-${Date.now()}`,
                role: "assistant", type: "text",
                content: intent.plan.intro,
            });

            await sleep(400);

            // Scenario card
            setThread(t => [...t, { id: `a-scn-${Date.now()}`, role: "assistant", type: "scenario-card", scenario, done: false }]);
            await sleep(900);
            markDone();

            await pushTyped({
                id: `a-text2-${Date.now()}`,
                role: "assistant", type: "text",
                content: intent.plan.partsIntro,
            });

            // Parts card from scenario
            const parts = scenario?.nodes.map(n => ({ partId: n.partId, qty: 1, reason: n.label })) ?? [];
            setThread(t => [...t, { id: `a-parts-${Date.now()}`, role: "assistant", type: "parts-card", parts, done: false }]);
            await sleep(900);
            markDone();

            await sleep(300);
            await pushTyped({
                id: `a-text3-${Date.now()}`,
                role: "assistant", type: "text",
                content: intent.plan.completion,
            });

            setThread(t => [...t, { id: `a-cta-${Date.now()}`, role: "assistant", type: "open-builder-cta", scenario, done: false }]);
            await sleep(500);
            markDone();

        } else if (intent.kind === "course") {
            await pushTyped({
                id: `a-text-${Date.now()}`,
                role: "assistant", type: "text",
                content: `Excelente decisión. Te recomiendo estos cursos guiados según tu nivel. Cada uno incluye material teórico y proyectos prácticos.`,
            });
            setThread(t => [...t, { id: `a-crs-${Date.now()}`, role: "assistant", type: "courses-card", courseIds: intent.courseIds, done: false }]);
            await sleep(900);
            markDone();

        } else if (intent.kind === "kit") {
            await pushTyped({
                id: `a-text-${Date.now()}`,
                role: "assistant", type: "text",
                content: `Te recomiendo estos kits curados según el tipo de proyecto que quieras explorar. Todos vienen con guía paso a paso.`,
            });
            setThread(t => [...t, { id: `a-kits-${Date.now()}`, role: "assistant", type: "kits-card", kitIds: intent.kitIds, done: false }]);
            await sleep(900);
            markDone();

        } else if (intent.kind === "parts") {
            const parts = intent.partIds.map(pid => ({ partId: pid, qty: 1 }));
            await pushTyped({
                id: `a-text-${Date.now()}`,
                role: "assistant", type: "text",
                content: `Aquí están los componentes que mejor se ajustan a tu búsqueda. Todos con precio Dystronic y stock local.`,
            });
            setThread(t => [...t, { id: `a-parts-${Date.now()}`, role: "assistant", type: "parts-card", parts, done: false }]);
            await sleep(700);
            markDone();
        } else {
            await pushTyped({
                id: `a-text-${Date.now()}`,
                role: "assistant", type: "text",
                content: `Puedo ayudarte a planear un proyecto desde cero, recomendarte un kit, sugerirte cursos o encontrar componentes específicos. Dime un poco más sobre lo que quieres lograr.`,
            });
        }

        setBusy(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [input, busy, stage, pushTyped, markDone, locale]);

    return (
        <div ref={containerRef} className="absolute inset-0 bg-[#050507] flex flex-col z-50 overflow-hidden font-mono">

            {/* Ambient gradient */}
            <div aria-hidden className="absolute inset-0 pointer-events-none opacity-50">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00f0ff]/10 blur-[140px]" />
                <div className="absolute bottom-[-15%] right-[-15%] w-[500px] h-[500px] rounded-full bg-[#a855f7]/10 blur-[120px]" />
            </div>

            {/* Top bar */}
            <div className="relative z-10 h-14 border-b border-white/[0.06] flex items-center justify-between px-5 shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00f0ff]" />
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00f0ff]/80">
                        Dystronic AI Lab
                    </span>
                </div>
                <Link
                    href="/"
                    className="font-mono text-[9px] text-white/30 hover:text-white/60 tracking-widest uppercase transition-colors"
                >
                    ← Volver al inicio
                </Link>
            </div>

            {/* Body */}
            {stage === "welcome" ? (
                <WelcomeHero
                    onSubmit={handleSubmit}
                    input={input}
                    setInput={setInput}
                    inputRef={inputRef}
                />
            ) : (
                <div className="relative z-10 flex-1 flex flex-col overflow-hidden">

                    {/* Thread */}
                    <div
                        ref={threadRef}
                        className="welcome-card flex-1 overflow-y-auto px-6 py-8 custom-scrollbar"
                    >
                        <div className="max-w-3xl mx-auto space-y-5">
                            {thread.map(msg => (
                                <ThreadItem
                                    key={msg.id}
                                    msg={msg}
                                    onOpenScenario={onOpenScenario}
                                />
                            ))}
                            {busy && thread[thread.length - 1]?.role !== "assistant" && (
                                <div className="flex justify-center text-white/30 font-mono text-[10px] tracking-widest uppercase animate-pulse">
                                    procesando ...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input bar */}
                    <div className="relative z-10 border-t border-white/[0.06] bg-black/40 backdrop-blur-md px-6 py-4 shrink-0">
                        <div className="max-w-3xl mx-auto">
                            <form
                                onSubmit={e => { e.preventDefault(); handleSubmit(); }}
                                className="relative flex items-center gap-3 border border-white/15 hover:border-white/30 focus-within:border-[#00f0ff]/60 bg-[#0a0a0d] px-4 py-3 transition-colors"
                            >
                                <Bot size={15} className="text-[#00f0ff] shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder={busy ? "Esperando respuesta..." : "Pregúntame algo más..."}
                                    disabled={busy}
                                    className="flex-1 bg-transparent outline-none text-[13px] text-white placeholder:text-white/30 font-mono"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || busy}
                                    className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 bg-[#00f0ff] text-black font-mono text-[11px] font-bold tracking-wider uppercase disabled:opacity-30 disabled:pointer-events-none hover:bg-[#33f3ff] transition-colors"
                                >
                                    <Send size={11} />
                                    Enviar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── WelcomeHero (initial screen) ───────────────────────────────
function WelcomeHero({
    onSubmit, input, setInput, inputRef,
}: {
    onSubmit: (p?: string) => void;
    input: string;
    setInput: (v: string) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useGSAP(() => {
        gsap.from(".w-eyebrow", { opacity: 0, y: 12, duration: 0.5, ease: "power2.out", delay: 0.1 });
        gsap.from(".w-title", { opacity: 0, y: 24, duration: 0.7, ease: "power3.out", delay: 0.2 });
        gsap.from(".w-sub", { opacity: 0, y: 18, duration: 0.55, ease: "power2.out", delay: 0.4 });
        gsap.from(".w-input", { opacity: 0, y: 14, duration: 0.55, ease: "power2.out", delay: 0.55 });
        gsap.from(".w-chip", { opacity: 0, y: 14, stagger: 0.05, duration: 0.45, ease: "power2.out", delay: 0.7 });
        gsap.to(".w-cursor", { opacity: 0, repeat: -1, yoyo: true, duration: 0.55, ease: "none" });
    }, { scope: ref });

    return (
        <div ref={ref} className="relative z-10 flex-1 flex items-center justify-center overflow-y-auto py-10 px-6">
            <div className="w-full max-w-2xl text-center">

                {/* Eyebrow */}
                <div className="w-eyebrow inline-flex items-center gap-2 mb-10 px-3 py-1.5 border border-[#00f0ff]/25 bg-[#00f0ff]/[0.06]">
                    <Sparkles size={11} className="text-[#00f0ff]" />
                    <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#00f0ff]">
                        AI Lab Builder · Beta
                    </span>
                </div>

                {/* Title */}
                <h1
                    className="w-title text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-tight text-white mb-5 font-bold"
                    style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
                >
                    ¿Qué quieres construir{" "}
                    <span className="text-[#00f0ff] inline-flex items-baseline">
                        hoy<span className="w-cursor inline-block w-[3px] h-[0.85em] bg-[#00f0ff] ml-1" />
                    </span>
                </h1>

                {/* Sub */}
                <p className="w-sub text-[14px] text-white/45 leading-relaxed max-w-xl mx-auto mb-10">
                    Cuéntame tu idea. Yo genero el plan, las conexiones, los componentes y el curso para aprender.
                </p>

                {/* Input */}
                <form
                    onSubmit={e => { e.preventDefault(); onSubmit(); }}
                    className="w-input relative max-w-xl mx-auto mb-8"
                >
                    <div className="flex items-center gap-3 border border-white/15 hover:border-white/30 focus-within:border-[#00f0ff]/60 focus-within:shadow-[0_0_28px_rgba(0,240,255,0.08)] bg-[#0a0a0d] px-4 py-3.5 transition-all">
                        <Bot size={15} className="text-[#00f0ff] shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder={DEMO_RC_PROMPT}
                            className="flex-1 bg-transparent outline-none text-[13px] text-white placeholder:text-white/30 font-mono"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[#00f0ff] text-black font-mono text-[11px] font-bold tracking-wider uppercase disabled:opacity-30 disabled:pointer-events-none hover:bg-[#33f3ff] transition-colors"
                        >
                            <Send size={11} />
                            Empezar
                        </button>
                    </div>
                </form>

                {/* Suggestion chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                    {SUGGESTIONS.map(s => (
                        <button
                            key={s.label}
                            onClick={() => onSubmit(s.prompt)}
                            className="w-chip group inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/12 hover:border-white/35 hover:bg-white/[0.03] transition-all"
                        >
                            <span style={{ color: s.accent }}>{s.icon}</span>
                            <span className="text-[11px] text-white/65 group-hover:text-white tracking-wide">
                                {s.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── ThreadItem (each message bubble) ───────────────────────────
function ThreadItem({
    msg, onOpenScenario,
}: {
    msg: FlowMsg;
    onOpenScenario: (scenario: AIScenario) => void;
}) {
    if (msg.role === "user") {
        return (
            <div className="flex justify-end">
                <div className="max-w-[82%] rounded-lg rounded-tr-sm bg-white/[0.075] shadow-[0_14px_45px_rgba(0,0,0,0.28),inset_0_0_0_1px_rgba(255,255,255,0.08)] px-4 py-2.5 text-[13px] text-white/90 leading-relaxed">
                    {msg.content}
                </div>
            </div>
        );
    }

    // assistant variants
    if (msg.type === "thinking") return <ThinkingBubble />;

    if (msg.type === "text") return <TextBubble fullText={msg.content} done={msg.done ?? false} />;

    if (msg.type === "provider-note") return <ProviderNote mode={msg.mode} label={msg.label} />;

    if (msg.type === "scenario-card") return <ScenarioCard scenario={msg.scenario} done={msg.done ?? false} />;

    if (msg.type === "parts-card") return <PartsCard parts={msg.parts} done={msg.done ?? false} />;

    if (msg.type === "kits-card") return <KitsCard kitIds={msg.kitIds} done={msg.done ?? false} />;

    if (msg.type === "courses-card") return <CoursesCard courseIds={msg.courseIds} done={msg.done ?? false} />;

    if (msg.type === "open-builder-cta") return (
        <OpenBuilderCTA scenario={msg.scenario} onOpen={() => onOpenScenario(msg.scenario)} />
    );

    return null;
}

// ─── Assistant building blocks ──────────────────────────────────

function AvatarBubble({ children, accent }: { children: React.ReactNode; accent?: string }) {
    return (
        <div className="flex gap-3 items-start">
            <div
                className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                style={{
                    background: accent ? `${accent}18` : "rgba(0,240,255,0.12)",
                    borderColor: accent ? `${accent}55` : "rgba(0,240,255,0.35)",
                }}
            >
                <Bot size={11} style={{ color: accent ?? "#00f0ff" }} />
            </div>
            <div className="flex-1 min-w-0">{children}</div>
        </div>
    );
}

function ThinkingBubble() {
    return (
        <AvatarBubble>
            <div className="inline-flex items-center gap-2 bg-[#0d0d12] border border-white/8 px-3 py-2">
                <span className="flex gap-1">
                    {[0, 1, 2].map(i => (
                        <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]/70"
                            style={{ animation: `pulse-dot 1.2s ease-in-out infinite ${i * 0.15}s` }}
                        />
                    ))}
                </span>
                <span className="text-[11px] text-white/45 tracking-wide">Analizando tu proyecto</span>
            </div>
        </AvatarBubble>
    );
}

function ProviderNote({ mode, label }: { mode: AIProviderMode; label: string }) {
    const isDemo = mode === "demo";
    return (
        <AvatarBubble accent={isDemo ? "#f59e0b" : "#39ff14"}>
            <div className="max-w-[90%] border border-white/10 bg-white/[0.025] px-3 py-2 flex items-start gap-2">
                <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${isDemo ? "bg-[#f59e0b]" : "bg-[#39ff14]"}`} />
                <p className="text-[10px] leading-relaxed text-white/45">
                    <span className="uppercase tracking-widest text-white/70 mr-2">
                        {isDemo ? "Demo provider" : "OpenAI provider"}
                    </span>
                    {label}
                </p>
            </div>
        </AvatarBubble>
    );
}

function TextBubble({ fullText, done }: { fullText: string; done: boolean }) {
    const displayed = useTypewriter(done ? fullText : fullText, 18);
    // Bold via **
    const segments = (done ? fullText : displayed).split(/(\*\*[^*]+\*\*)/g);
    return (
        <AvatarBubble>
            <div className="relative overflow-hidden rounded-lg rounded-tl-sm bg-[linear-gradient(135deg,rgba(0,240,255,0.09),rgba(13,13,18,0.96)_34%,rgba(244,63,94,0.08))] shadow-[0_18px_55px_rgba(0,0,0,0.32),inset_0_0_0_1px_rgba(255,255,255,0.08)] px-4 py-3 text-[13px] leading-relaxed text-gray-200 max-w-[90%]">
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/60 to-transparent" />
                {segments.map((s, i) => {
                    if (s.startsWith("**") && s.endsWith("**")) {
                        return <span key={i} className="text-white font-bold">{s.slice(2, -2)}</span>;
                    }
                    return <span key={i}>{s}</span>;
                })}
                {!done && <span className="inline-block w-[2px] h-[1em] bg-[#00f0ff] ml-0.5 align-middle animate-pulse" />}
            </div>
        </AvatarBubble>
    );
}

function ScenarioCard({ scenario, done }: { scenario: AIScenario; done: boolean }) {
    return (
        <AvatarBubble>
            <div
                className="border border-[#00f0ff]/25 bg-[#0d0d12] p-4 max-w-[90%]"
                style={{ animation: done ? undefined : "slide-up 0.45s ease-out" }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <Workflow size={13} className="text-[#00f0ff]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#00f0ff]/80 font-bold">System Plan</span>
                </div>
                <h3 className="text-[15px] font-bold text-white mb-1 uppercase tracking-wider">{scenario.projectName}</h3>
                <p className="text-[12px] text-gray-400 mb-3 leading-relaxed">{scenario.overview.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    <Tag label={scenario.overview.level} color="#34d399" />
                    <Tag label={scenario.overview.time} color="#f59e0b" />
                    <Tag label={`$${scenario.overview.cost}`} color="#00f0ff" />
                </div>
                <ul className="space-y-1.5">
                    {scenario.systemPlan.slice(0, 4).map((step, i) => (
                        <li key={i} className="flex gap-2 items-start text-[11.5px] text-gray-400 leading-relaxed">
                            <CheckCircle2 size={11} className="text-[#00f0ff]/60 shrink-0 mt-0.5" />
                            <span>{step}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </AvatarBubble>
    );
}

function PartsCard({ parts, done }: { parts: { partId: string; qty: number; reason?: string }[]; done: boolean }) {
    const resolved = parts
        .map(p => ({ ...p, component: MOCK_COMPONENTS.find(c => c.id === p.partId) }))
        .filter(p => p.component) as { partId: string; qty: number; reason?: string; component: Part }[];
    const total = resolved.reduce((sum, p) => sum + (p.component.price * p.qty), 0);

    return (
        <AvatarBubble accent="#f43f5e">
            <div className="border border-[#f43f5e]/25 bg-[#0d0d12] p-4 max-w-[92%]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={13} className="text-[#f43f5e]" />
                        <span className="text-[10px] uppercase tracking-widest text-[#f43f5e]/85 font-bold">Components</span>
                    </div>
                    <span className="font-mono text-[10px] text-white/40">{resolved.length} items · ${total.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {resolved.slice(0, 6).map((p, i) => (
                        <div
                            key={`${p.partId}-${i}`}
                            className="border border-white/[0.06] bg-black/30 overflow-hidden group hover:border-white/15 transition-colors"
                            style={{ animation: done ? undefined : `card-in 0.5s ease-out ${i * 0.07}s both` }}
                        >
                            <div className="relative aspect-square bg-white/[0.02]">
                                <Image
                                    src={p.component.image}
                                    alt={p.component.name}
                                    fill
                                    className="object-contain p-2 transition-transform group-hover:scale-105"
                                    sizes="120px"
                                />
                                <span className="absolute top-1 right-1 text-[8px] font-mono text-[#f43f5e]/80 bg-black/60 px-1">×{p.qty}</span>
                            </div>
                            <div className="px-2 py-1.5">
                                <p className="text-[10px] font-mono text-white/65 truncate leading-tight">{p.component.name}</p>
                                <p className="text-[8px] text-white/30 mt-0.5">${p.component.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span>· Todo en stock en Dystronic</span>
                    <Link href="/store" className="text-[#f43f5e]/85 hover:text-[#f43f5e] font-mono uppercase tracking-widest flex items-center gap-1">
                        Ver catálogo <ChevronRight size={10} />
                    </Link>
                </div>
            </div>
        </AvatarBubble>
    );
}

function KitsCard({ kitIds, done }: { kitIds: string[]; done: boolean }) {
    const kits = kitIds.map(id => MOCK_KITS.find(k => k.id === id)).filter(Boolean) as typeof MOCK_KITS;

    return (
        <AvatarBubble accent="#a855f7">
            <div className="border border-[#a855f7]/25 bg-[#0d0d12] p-4 max-w-[92%]">
                <div className="flex items-center gap-2 mb-3">
                    <PackageOpen size={13} className="text-[#a855f7]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#a855f7]/85 font-bold">Kits Recomendados</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {kits.map((kit, i) => (
                        <Link
                            key={kit.id}
                            href={`/kits/${kit.id}`}
                            className="block group border border-white/[0.07] bg-black/30 hover:border-[#a855f7]/40 transition-colors overflow-hidden"
                            style={{ animation: done ? undefined : `card-in 0.5s ease-out ${i * 0.1}s both` }}
                        >
                            <div className="relative aspect-[4/3] bg-white/[0.02]">
                                <Image
                                    src={kit.image}
                                    alt={kit.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-[1.04]"
                                    sizes="180px"
                                />
                                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <div className="p-3">
                                <p className="text-[12px] font-bold text-white leading-tight mb-1 truncate">{kit.name}</p>
                                <p className="text-[10px] text-white/35 mb-2">{kit.level}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[12px] font-bold text-[#a855f7]">${kit.price}</span>
                                    <span className="text-[9px] text-white/30 group-hover:text-white/60 inline-flex items-center gap-0.5 transition-colors uppercase tracking-wider">
                                        Ver <ChevronRight size={9} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AvatarBubble>
    );
}

function CoursesCard({ courseIds, done }: { courseIds: string[]; done: boolean }) {
    const courses = courseIds.map(id => MOCK_COURSES.find(c => c.id === id)).filter(Boolean) as typeof MOCK_COURSES;
    return (
        <AvatarBubble accent="#f59e0b">
            <div className="border border-[#f59e0b]/25 bg-[#0d0d12] p-4 max-w-[92%]">
                <div className="flex items-center gap-2 mb-3">
                    <GraduationCap size={13} className="text-[#f59e0b]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#f59e0b]/85 font-bold">Cursos Sugeridos</span>
                </div>
                <div className="space-y-2">
                    {courses.map((c, i) => (
                        <Link
                            key={c.id}
                            href={`/courses/${c.id}`}
                            className="flex gap-3 border border-white/[0.07] hover:border-[#f59e0b]/40 bg-black/30 p-2.5 group transition-colors"
                            style={{ animation: done ? undefined : `card-in 0.5s ease-out ${i * 0.08}s both` }}
                        >
                            <div className="relative w-14 h-14 border border-white/8 overflow-hidden shrink-0">
                                <Image src={c.image} alt={c.title} fill className="object-cover" sizes="56px" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-white truncate leading-tight">{c.title}</p>
                                <p className="text-[10px] text-white/40 line-clamp-1 mt-0.5">Proyecto final: {c.finalProject}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[#f59e0b]/40 text-[#f59e0b]/85 font-bold">{c.level}</span>
                                    <span className="text-[10px] text-white/45">· {c.duration}</span>
                                    <span className="text-[10px] text-white/45">· ${c.price}</span>
                                </div>
                            </div>
                            <BookOpen size={14} className="text-white/30 group-hover:text-[#f59e0b] transition-colors shrink-0 mt-1" />
                        </Link>
                    ))}
                </div>
            </div>
        </AvatarBubble>
    );
}

function OpenBuilderCTA({ scenario, onOpen }: { scenario: AIScenario; onOpen: () => void }) {
    return (
        <AvatarBubble>
            <button
                onClick={onOpen}
                className="group relative w-full max-w-[90%] block border border-[#00f0ff]/40 hover:border-[#00f0ff] bg-[#00f0ff]/[0.06] hover:bg-[#00f0ff]/[0.12] overflow-hidden text-left transition-all hover:shadow-[0_0_32px_rgba(0,240,255,0.15)]"
                style={{ animation: "slide-up 0.5s ease-out" }}
            >
                <div className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 border border-[#00f0ff]/40 bg-black/40 flex items-center justify-center shrink-0">
                        <Workflow size={20} className="text-[#00f0ff]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-[#00f0ff]/70 font-bold mb-0.5">Diagrama listo</p>
                        <p className="text-[14px] font-bold text-white truncate">{scenario?.projectName ?? "Tu proyecto"}</p>
                        <p className="text-[11px] text-white/45 mt-0.5">Abre el board interactivo · arrastra componentes · ve detalles</p>
                    </div>
                    <ArrowRight size={16} className="text-[#00f0ff] group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
                {/* Scan line effect */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff]/80 to-transparent opacity-60" />
            </button>
        </AvatarBubble>
    );
}

function Tag({ label, color }: { label: string; color: string }) {
    return (
        <span
            className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border"
            style={{ borderColor: `${color}55`, color, background: `${color}10` }}
        >
            {label}
        </span>
    );
}
