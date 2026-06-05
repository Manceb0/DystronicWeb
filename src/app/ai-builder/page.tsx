"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Edit3, MessageSquare, Download,
    Cpu, Zap, Radio, Activity, LayoutTemplate, MonitorSmartphone, Share2, CornerDownRight, Bot, List, Send,
    ZoomIn, ZoomOut, RotateCcw, ShoppingCart, ExternalLink, X, Package, BadgeCheck, ChevronDown,
    ScanLine, BookOpen, ShoppingBag, Workflow, Globe, Clock
} from "lucide-react";
import { Suspense } from "react";
import { MOCK_SCENARIOS, MOCK_COMPONENTS, Part } from "@/lib/mock-data";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import PartDetailSheet from "@/components/ai-builder/PartDetailSheet";
import ChatWelcomeFlow from "@/components/ai-builder/ChatWelcomeFlow";

type ViewMode = "overview" | "wiring" | "learn" | "purchase";
type LeftPanelView = "plan" | "chat";

type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

function AIBuilderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToCart, activeAIProject } = useAppContext();

    // State
    const [hasStartedBuilder, setHasStartedBuilder] = useState(false);
    const [activeTab, setActiveTab] = useState<ViewMode>("wiring");
    const [projectId, setProjectId] = useState<string>("sc-rc-car"); // Default RC Car
    const [isGenerating, setIsGenerating] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [leftPanelView, setLeftPanelView] = useState<LeftPanelView>("plan");
    const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
    const [chatByPart, setChatByPart] = useState<Record<string, ChatMessage[]>>({});
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
    const [boardNodes, setBoardNodes] = useState<typeof MOCK_SCENARIOS[0]["nodes"]>([]);
    const [boardZoom, setBoardZoom] = useState(1);
    const [inspectedPartId, setInspectedPartId] = useState<string | null>(null);
    const boardScrollRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);
    const dragRef = useRef<{
        nodeId: string;
        startX: number;
        startY: number;
        nodeStartX: number;
        nodeStartY: number;
        moved: boolean;
    } | null>(null);

    const scenario = MOCK_SCENARIOS.find(s => s.id === projectId) || MOCK_SCENARIOS[0];
    // Use node.id as key source — partId can repeat (e.g. two DC Gear Motors)
    const partNodes = scenario.nodes
        .map(n => ({ node: n, part: MOCK_COMPONENTS.find(c => c.id === n.partId) }))
        .filter(v => v.part) as { node: typeof scenario.nodes[0]; part: Part }[];
    const parts = partNodes.map(v => v.part);

    useEffect(() => {
        const idFromParam = searchParams.get("project");
        if (idFromParam && MOCK_SCENARIOS.find(s => s.id === idFromParam)) {
            setProjectId(idFromParam);
            setHasStartedBuilder(true); // skip welcome if landing with project
        } else if (activeAIProject) {
            setProjectId(activeAIProject);
            setHasStartedBuilder(true);
        }
    }, [searchParams, activeAIProject]);

    useEffect(() => {
        setBoardNodes(scenario.nodes.map(n => ({ ...n })));
        setChatByPart({});
        setSelectedPartId(null);
        setLeftPanelView("plan");
    }, [scenario]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatByPart, selectedPartId, leftPanelView]);

    const selectedPart = selectedPartId
        ? MOCK_COMPONENTS.find(c => c.id === selectedPartId)
        : null;
    const activeChatMessages = selectedPartId ? (chatByPart[selectedPartId] ?? []) : [];

    const selectPartForChat = (partId: string) => {
        setSelectedPartId(partId);
        setHoveredNodeId(partId);
    };

    const openComponentChat = (partId?: string | null) => {
        const target = partId ?? hoveredNodeId ?? parts[0]?.id ?? null;
        if (target) selectPartForChat(target);
        setLeftPanelView("chat");
        setTimeout(() => chatInputRef.current?.focus(), 0);
    };

    const getComponentReply = (part: Part, question: string): string => {
        const q = question.toLowerCase();
        if (q.includes("pin") || q.includes("conect"))
            return `Soy ${part.name}. Revisa las especificaciones (${Object.keys(part.specs).slice(0, 2).join(", ")}) y conéctame según el esquema del board.`;
        if (q.includes("volt") || q.includes("aliment"))
            return part.specs["Operating Voltage"] || part.specs["Voltage"] || part.specs["Input"]
                ? `Mi alimentación típica: ${part.specs["Operating Voltage"] || part.specs["Voltage"] || part.specs["Input"]}.`
                : `Consulta la hoja de ${part.name} en la tienda Dystronic para el rango de tensión exacto.`;
        return `Como ${part.name}: ${part.description} ¿Quieres saber cómo cablearme con otro módulo del proyecto?`;
    };

    const sendChatMessage = () => {
        const text = inputValue.trim();
        if (!text || isGenerating) return;

        if (leftPanelView === "plan") {
            handleSimulateGenerating(MOCK_SCENARIOS.find(s => s.id !== projectId)?.id || "sc-rc-car");
            return;
        }

        const partId = selectedPartId ?? parts[0]?.id;
        if (!partId) return;
        const part = MOCK_COMPONENTS.find(c => c.id === partId);
        if (!part) return;

        if (!selectedPartId) setSelectedPartId(partId);

        const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text };
        const assistantMsg: ChatMessage = {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: getComponentReply(part, text),
        };

        setChatByPart(prev => ({
            ...prev,
            [partId]: [...(prev[partId] ?? []), userMsg, assistantMsg],
        }));
        setInputValue("");
    };

    const GRID = 30;
    const BOARD_HEADER = 32;
    const NODE_W = 220;
    const NODE_H = 192;
    const CANVAS_W = 1200;
    const CANVAS_H = 800;
    const MAX_NODE_Y = CANVAS_H - NODE_H - BOARD_HEADER;

    const snapToGrid = useCallback((value: number) => Math.round(value / GRID) * GRID, []);

    const clampNode = useCallback((x: number, y: number, snap = false) => {
        let nx = Math.max(0, Math.min(x, CANVAS_W - NODE_W));
        let ny = Math.max(0, Math.min(y, MAX_NODE_Y));
        if (snap) {
            nx = Math.max(0, Math.min(snapToGrid(nx), CANVAS_W - NODE_W));
            ny = Math.max(0, Math.min(snapToGrid(ny), MAX_NODE_Y));
        }
        return { x: nx, y: ny };
    }, [snapToGrid]);

    const updateDraggedNode = useCallback((clientX: number, clientY: number, snap: boolean) => {
        const drag = dragRef.current;
        if (!drag) return;
        // Divide by current zoom — screen pixels → canvas pixels
        const zoom = boardZoom || 1;
        const dx = (clientX - drag.startX) / zoom;
        const dy = (clientY - drag.startY) / zoom;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.moved = true;
        const { x, y } = clampNode(
            drag.nodeStartX + dx,
            drag.nodeStartY + dy,
            snap
        );
        setBoardNodes(nodes =>
            nodes.map(n => (n.id === drag.nodeId ? { ...n, x, y } : n))
        );
    }, [clampNode, boardZoom]);

    useEffect(() => {
        const onPointerMove = (e: PointerEvent) => updateDraggedNode(e.clientX, e.clientY, false);
        const onPointerUp = (e: PointerEvent) => {
            if (!dragRef.current) return;
            updateDraggedNode(e.clientX, e.clientY, true);
            dragRef.current = null;
            setDraggingNodeId(null);
        };
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);
        };
    }, [updateDraggedNode]);

    // ── Ctrl+wheel zoom ───────────────────────────────────
    useEffect(() => {
        const el = boardScrollRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (!e.ctrlKey && !e.metaKey) return;
            e.preventDefault();
            setBoardZoom(z => Math.min(2, Math.max(0.3, z - e.deltaY * 0.001)));
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
        const node = boardNodes.find(n => n.id === nodeId);
        if (!node) return;
        // Capture pointer so move/up always fire on this element even if cursor leaves
        try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
        e.preventDefault();
        e.stopPropagation();
        dragRef.current = {
            nodeId,
            startX: e.clientX,
            startY: e.clientY,
            nodeStartX: node.x,
            nodeStartY: node.y,
            moved: false,
        };
        setDraggingNodeId(nodeId);
    };

    const handleNodePointerUp = (e: React.PointerEvent, partId: string) => {
        try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
        // Only open inspect if it was a real click (no drag movement)
        if (dragRef.current?.moved) return;
        setInspectedPartId(partId);
    };

    // ── Board panning (drag empty area to pan) ────────────
    const panRef = useRef<{ startX: number; startY: number; scrollLeft: number; scrollTop: number } | null>(null);
    const handleBoardPointerDown = (e: React.PointerEvent) => {
        // Only pan if clicking the canvas background (not a node)
        if (e.target !== e.currentTarget) return;
        const el = boardScrollRef.current;
        if (!el) return;
        panRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            scrollLeft: el.scrollLeft,
            scrollTop: el.scrollTop,
        };
        document.body.style.cursor = "grabbing";
    };
    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            const pan = panRef.current;
            const el = boardScrollRef.current;
            if (!pan || !el) return;
            el.scrollLeft = pan.scrollLeft - (e.clientX - pan.startX);
            el.scrollTop = pan.scrollTop - (e.clientY - pan.startY);
        };
        const onUp = () => {
            if (panRef.current) {
                panRef.current = null;
                document.body.style.cursor = "";
            }
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
    }, []);

    // Generate external sourcing links based on part name
    const getSourcingLinks = (part: Part) => {
        const q = encodeURIComponent(part.name);
        return [
            { store: "AliExpress", url: `https://www.aliexpress.com/wholesale?SearchText=${q}`, badge: true, note: "Precio más bajo" },
            { store: "Amazon", url: `https://www.amazon.com/s?k=${q}`, badge: true, note: "Envío rápido" },
            { store: "Adafruit", url: `https://www.adafruit.com/search?q=${q}`, badge: false, note: "Calidad garantizada" },
            { store: "eBay", url: `https://www.ebay.com/sch/i.html?_nkw=${q}`, badge: false, note: "Ofertas usados/nuevos" },
        ];
    };

    const handleSimulateGenerating = (scenarioId: string) => {
        setInputValue("");
        setIsGenerating(true);
        // Simulate thinking process
        setTimeout(() => {
            setProjectId(scenarioId);
            setIsGenerating(false);
        }, 2000);
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case "MCU": return <Cpu size={14} className="text-[#00f0ff]" />;
            case "POWER": return <Zap size={14} className="text-[#ffcc00]" />;
            case "SENSOR": return <Radio size={14} className="text-[#39ff14]" />;
            case "ACTUATOR": return <Activity size={14} className="text-[#ff5e00]" />;
            case "MODULE": return <LayoutTemplate size={14} className="text-[#a855f7]" />;
            case "DISPLAY": return <MonitorSmartphone size={14} className="text-pink-500" />;
            default: return <Cpu size={14} />;
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case "MCU": return "border-[#00f0ff]";
            case "POWER": return "border-[#ffcc00]";
            case "SENSOR": return "border-[#39ff14]";
            case "ACTUATOR": return "border-[#ff5e00]";
            case "MODULE": return "border-[#a855f7]";
            case "DISPLAY": return "border-pink-500";
            default: return "border-gray-500";
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-[#050507] text-white overflow-hidden font-mono text-sm relative z-50 fixed inset-0">

            {/* Welcome chat flow — shown until user picks a project */}
            {!hasStartedBuilder && (
                <ChatWelcomeFlow
                    onOpenScenario={(sid) => {
                        setProjectId(sid);
                        setHasStartedBuilder(true);
                    }}
                />
            )}

            {/*
        ========================================
        TOP BAR
        ========================================
      */}
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0a0d] shrink-0">
                {/* Left: back + project name */}
                <div className="flex items-center gap-3 w-[220px]">
                    <button onClick={() => router.push("/")} className="text-gray-600 hover:text-white transition-colors p-1">
                        <ArrowLeft size={14} />
                    </button>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <Bot size={13} className="text-[#00f0ff] shrink-0" />
                        <span className="font-bold tracking-widest text-[#00f0ff] uppercase text-[11px] truncate">{scenario.projectName}</span>
                    </div>
                </div>

                {/* Center: icon tabs — matches reference design */}
                <div className="flex items-center gap-0.5 bg-[#111114] border border-white/[0.07] p-0.5">
                    {([
                        { mode: "overview",  icon: <ScanLine size={13} />,    label: "OVERVIEW" },
                        { mode: "wiring",    icon: <Workflow size={13} />,     label: "WIRING"   },
                        { mode: "learn",     icon: <BookOpen size={13} />,     label: "LEARN"    },
                        { mode: "purchase",  icon: <ShoppingBag size={13} />,  label: "PURCHASE" },
                    ] as { mode: ViewMode; icon: React.ReactNode; label: string }[]).map(({ mode, icon, label }) => {
                        const isActive = activeTab === mode;
                        return (
                            <button
                                key={mode}
                                onClick={() => setActiveTab(mode)}
                                title={label}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    isActive
                                        ? "bg-white/10 text-white border border-white/[0.12]"
                                        : "text-gray-600 hover:text-gray-300 border border-transparent"
                                }`}
                            >
                                <span className={isActive ? "text-[#00f0ff]" : ""}>{icon}</span>
                                <span className={isActive ? "" : "hidden sm:inline"}>{label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Right: actions + publish */}
                <div className="flex items-center gap-2 w-[220px] justify-end">
                    {/* session timer */}
                    <div className="flex items-center gap-1 text-[10px] text-gray-600 font-mono border border-white/[0.07] px-2 py-1 bg-[#111114]">
                        <Clock size={11} />
                        <span>18:00</span>
                    </div>
                    <button className="text-gray-600 hover:text-white transition-colors p-1" title="Export"><Download size={14} /></button>
                    <button className="text-gray-600 hover:text-white transition-colors p-1" title="Share"><Globe size={14} /></button>
                    <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-[#00f0ff] text-black px-3 py-1.5 hover:bg-[#00d4e0] transition-colors">
                        <Share2 size={11} /> Publish
                    </button>
                </div>
            </div>

            {/* 
        ========================================
        MAIN THREE-COLUMN LAYOUT
        ========================================
      */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* === LEFT COLUMN: PLAN / COMPONENT CHAT === */}
                <div className="w-[320px] lg:w-[380px] shrink-0 border-r border-[#1a1a20] flex flex-col bg-[#050507] min-h-0">

                    <div className="shrink-0 border-b border-[#1a1a20]">
                        <div className="flex">
                            <button
                                type="button"
                                onClick={() => setLeftPanelView("plan")}
                                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${leftPanelView === "plan" ? "border-white text-white bg-white/5" : "border-transparent text-gray-500 hover:text-gray-300"}`}
                            >
                                Plan
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const firstPart = parts[0];
                                    if (firstPart && !selectedPartId) selectPartForChat(firstPart.id);
                                    setLeftPanelView("chat");
                                    setTimeout(() => chatInputRef.current?.focus(), 50);
                                }}
                                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-1.5 ${leftPanelView === "chat" ? "border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/5" : "border-transparent text-gray-500 hover:text-gray-300"}`}
                            >
                                <MessageSquare size={11} /> Chat
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
                        {isGenerating ? (
                            <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-[#00f0ff]">
                                <Bot size={48} className="animate-pulse mb-6 opacity-50 text-[#00f0ff]" />
                                <p className="text-xs uppercase tracking-widest animate-pulse">GENERATING SYSTEM PLAN...</p>
                                <div className="w-1/2 h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00f0ff] animate-[progress_2s_ease-in-out_infinite]"></div>
                                </div>
                            </div>
                        ) : leftPanelView === "plan" ? (
                            <div className="space-y-6">
                                <div>
                                    <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest text-right">USER_INPUT</div>
                                    <div className="border border-white/20 p-4 bg-[#121215]/50 text-gray-300">
                                        &quot;{scenario.prompt}&quot;
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-[#00f0ff] mb-2 uppercase tracking-widest">SYSTEM_PLAN</div>
                                    <div className="border border-white/10 bg-[#0a0a0d] p-4 text-gray-400 space-y-4">
                                        {scenario.systemPlan.length > 0 ? (
                                            scenario.systemPlan.map((step, idx) => (
                                                <div key={idx} className="flex gap-2 items-start">
                                                    <span className="text-[#00f0ff] mt-0.5">-</span>
                                                    <p className="leading-relaxed text-[13px]">{step}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500 text-xs italic">[ No system plan data for this module in demo ]</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full min-h-0 gap-3">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Componente activo</p>
                                {/* Chips — node.id as key fixes duplicate key bug */}
                                <div className="flex flex-wrap gap-1.5">
                                    {partNodes.map(({ node, part }) => {
                                        const active = selectedPartId === part.id;
                                        return (
                                            <button
                                                key={node.id}
                                                type="button"
                                                onClick={() => selectPartForChat(part.id)}
                                                className={`text-[9px] uppercase px-2 py-1 border transition-colors ${active ? "border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10" : "border-white/10 text-gray-400 hover:border-white/30"}`}
                                            >
                                                {node.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {selectedPart ? (
                                    <div className="shrink-0 flex items-center gap-3 border border-[#00f0ff]/20 bg-[#0a0a0d] p-3">
                                        <div className="w-9 h-9 border border-white/10 shrink-0 overflow-hidden">
                                            <img src={selectedPart.image} alt={selectedPart.name} className="w-full h-full object-contain p-1" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-bold text-[#00f0ff] truncate">{selectedPart.name}</p>
                                            <p className="text-[10px] text-gray-500 line-clamp-1">{selectedPart.description}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 italic">Selecciona un componente para chatear.</p>
                                )}

                                {/* Chat messages — blueprint.am inspired */}
                                <div className="flex-1 min-h-[100px] space-y-3 overflow-y-auto">
                                    {activeChatMessages.length === 0 && selectedPart && (
                                        <div className="flex gap-2.5 items-start">
                                            <div className="w-6 h-6 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/30 flex items-center justify-center shrink-0 mt-0.5">
                                                <Bot size={9} className="text-[#00f0ff]" />
                                            </div>
                                            <div className="flex-1 bg-[#0d0d12] border border-white/8 p-3 text-[11px] leading-relaxed text-gray-400">
                                                <span className="text-[#00f0ff]/70 text-[9px] font-bold uppercase tracking-wider block mb-1.5">{selectedPart.name}</span>
                                                Pregúntame sobre pines, voltaje o cómo integrarme en este proyecto.
                                            </div>
                                        </div>
                                    )}
                                    {activeChatMessages.map(msg => (
                                        <div key={msg.id} className={`flex gap-2.5 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                            {msg.role === "assistant" ? (
                                                <div className="w-6 h-6 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/30 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Bot size={9} className="text-[#00f0ff]" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-white/8 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                                                    <span className="text-[8px] text-gray-400 font-bold">U</span>
                                                </div>
                                            )}
                                            <div className={`flex-1 p-3 text-[11px] leading-relaxed ${msg.role === "user" ? "bg-white/5 border border-white/10 text-gray-200" : "bg-[#0d0d12] border border-white/8 text-gray-300"}`}>
                                                {msg.role === "assistant" && (
                                                    <span className="text-[#00f0ff]/70 text-[9px] font-bold uppercase tracking-wider block mb-1.5">{selectedPart?.name ?? "AI"}</span>
                                                )}
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="shrink-0 p-4 border-t border-[#1a1a20] bg-[#0a0a0d]">
                        <div className="flex gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setLeftPanelView("plan")}
                                className={`flex-1 flex items-center justify-center gap-2 font-bold py-1.5 text-xs uppercase transition-all ${leftPanelView === "plan" ? "bg-[#ff5e00] text-black" : "border border-white/20 text-gray-400 hover:bg-white/5"}`}
                            >
                                <Edit3 size={12} /> Plan
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const firstPart = parts[0];
                                    if (firstPart && !selectedPartId) selectPartForChat(firstPart.id);
                                    setLeftPanelView("chat");
                                    setTimeout(() => chatInputRef.current?.focus(), 50);
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 font-bold py-1.5 text-xs uppercase transition-all ${leftPanelView === "chat" ? "bg-[#00f0ff] text-black" : "border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/10"}`}
                            >
                                <MessageSquare size={12} /> Ask
                            </button>
                        </div>
                        <div className="relative flex gap-2">
                            <input
                                ref={chatInputRef}
                                type="text"
                                placeholder={leftPanelView === "chat" ? "Pregunta al componente..." : "Pide cambios al proyecto..."}
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter") sendChatMessage();
                                }}
                                className="flex-1 bg-[#121215] border border-white/10 rounded-sm px-3 py-2 text-sm focus:border-[#00f0ff] outline-none text-white transition-colors"
                                disabled={isGenerating || (leftPanelView === "chat" && parts.length === 0)}
                            />
                            <button
                                type="button"
                                onClick={sendChatMessage}
                                disabled={isGenerating || !inputValue.trim()}
                                className="shrink-0 px-3 border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/10 disabled:opacity-40 disabled:pointer-events-none rounded-sm transition-colors"
                                aria-label="Enviar"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* === CENTER COLUMN: DYNAMIC CANVAS === */}
                <div className="flex-1 relative bg-[#09090b] overflow-hidden flex flex-col min-h-0">

                    {/* DYNAMIC CONTENT SWITCH BASED ON TAB */}
                    {activeTab === "wiring" && !isGenerating && (
                        <>
                        {/* Zoom controls */}
                        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1 bg-[#0a0a0d]/90 border border-white/10 px-2 py-1 backdrop-blur-sm">
                            <button onClick={() => setBoardZoom(z => Math.min(2, z + 0.1))} className="p-1 text-gray-400 hover:text-white transition-colors" title="Zoom in (+)"><ZoomIn size={14} /></button>
                            <span className="text-[10px] text-gray-500 font-mono w-9 text-center tabular-nums">{Math.round(boardZoom * 100)}%</span>
                            <button onClick={() => setBoardZoom(z => Math.max(0.3, z - 0.1))} className="p-1 text-gray-400 hover:text-white transition-colors" title="Zoom out (-)"><ZoomOut size={14} /></button>
                            <div className="w-px h-4 bg-white/10 mx-0.5" />
                            <button onClick={() => setBoardZoom(1)} className="p-1 text-gray-400 hover:text-white transition-colors" title="Reset zoom"><RotateCcw size={13} /></button>
                        </div>

                        <div ref={boardScrollRef} className="flex-1 w-full h-full relative z-10 overflow-auto p-3 min-h-0">
                        <div style={{ transform: `scale(${boardZoom})`, transformOrigin: "top left", width: `${1200 * boardZoom}px`, height: `${800 * boardZoom}px`, minWidth: `${1200 * boardZoom}px`, minHeight: `${800 * boardZoom}px` }}>
                            <div
                                ref={canvasRef}
                                onPointerDown={handleBoardPointerDown}
                                className="w-[1200px] h-[800px] shrink-0 relative rounded-sm border border-[#00f0ff]/20 bg-[#0c0c10] cursor-grab active:cursor-grabbing"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to right, rgba(0,240,255,0.12) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0,240,255,0.12) 1px, transparent 1px)
                                    `,
                                    backgroundSize: `${GRID}px ${GRID}px`,
                                    transformOrigin: "top left",
                                }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-8 border-b border-[#00f0ff]/20 bg-[#0a0a0d]/80 flex items-center px-3 gap-2 z-20 pointer-events-none">
                                    <LayoutTemplate size={12} className="text-[#00f0ff]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f0ff]">Prototype board</span>
                                    <span className="text-[10px] text-gray-500 ml-auto">
                                        {leftPanelView === "chat" ? "Clic en un módulo para chatear · arrastra para mover" : "Arrastra los componentes dentro del board"}
                                    </span>
                                </div>
                                {/* Connections SVG Layer */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
                                    <defs>
                                        <marker id="arrow-data" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                                            <polygon points="0 0, 7 3.5, 0 7" fill="#39ff14" opacity="0.85" />
                                        </marker>
                                        <marker id="arrow-power" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                                            <polygon points="0 0, 7 3.5, 0 7" fill="#f97316" opacity="0.85" />
                                        </marker>
                                        <marker id="arrow-ground" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                                            <polygon points="0 0, 7 3.5, 0 7" fill="#94a3b8" opacity="0.7" />
                                        </marker>
                                    </defs>
                                    {scenario.connections.map((conn, idx) => {
                                        const sourceNode = boardNodes.find(n => n.id === conn.source);
                                        const targetNode = boardNodes.find(n => n.id === conn.target);
                                        if (!sourceNode || !targetNode) return null;

                                        const boardTop = BOARD_HEADER;
                                        const x1 = sourceNode.x + NODE_W;
                                        const y1 = sourceNode.y + boardTop + NODE_H / 2;
                                        const x2 = targetNode.x;
                                        const y2 = targetNode.y + boardTop + NODE_H / 2;
                                        const cx1 = x1 + Math.abs(x2 - x1) * 0.45;
                                        const cx2 = x2 - Math.abs(x2 - x1) * 0.45;

                                        const path = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
                                        const midX = (x1 + x2) / 2;
                                        const midY = (y1 + y2) / 2 - 8;

                                        const isPower = conn.type === "POWER";
                                        const color = isPower ? "#f97316" : "#39ff14";
                                        const marker = isPower ? "url(#arrow-power)" : "url(#arrow-data)";
                                        const dash = isPower ? "6 4" : undefined;
                                        const label = isPower ? "PWR" : "DATA";

                                        return (
                                            <g key={idx}>
                                                {/* hit area */}
                                                <path d={path} fill="none" stroke="transparent" strokeWidth="12" />
                                                {/* visible line */}
                                                <path
                                                    d={path}
                                                    fill="none"
                                                    stroke={color}
                                                    strokeWidth="1.5"
                                                    strokeDasharray={dash}
                                                    opacity="0.8"
                                                    markerEnd={marker}
                                                />
                                                {/* label */}
                                                <rect x={midX - 14} y={midY - 8} width={28} height={13} rx={2} fill="#0a0a0d" opacity="0.85" />
                                                <text x={midX} y={midY + 2} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={color} opacity="0.9" fontWeight="bold">
                                                    {label}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Nodes */}
                                {boardNodes.map(node => {
                                    const part = MOCK_COMPONENTS.find(c => c.id === node.partId);
                                    const isHovered = hoveredNodeId === node.id;
                                    const isInspected = inspectedPartId === part?.id;
                                    const isDragging = draggingNodeId === node.id;

                                    // Per-type accent
                                    const accent: Record<string, { border: string; text: string; bg: string }> = {
                                        MCU:      { border: "#00f0ff", text: "#00f0ff", bg: "rgba(0,240,255,0.06)" },
                                        SENSOR:   { border: "#39ff14", text: "#39ff14", bg: "rgba(57,255,20,0.06)" },
                                        ACTUATOR: { border: "#ff5e00", text: "#ff5e00", bg: "rgba(255,94,0,0.06)" },
                                        POWER:    { border: "#ffcc00", text: "#ffcc00", bg: "rgba(255,204,0,0.06)" },
                                        MODULE:   { border: "#a855f7", text: "#a855f7", bg: "rgba(168,85,247,0.06)" },
                                        DISPLAY:  { border: "#ec4899", text: "#ec4899", bg: "rgba(236,72,153,0.06)" },
                                    };
                                    const ac = accent[node.type] ?? accent.MCU;
                                    const pinKeys = part?.specs ? Object.keys(part.specs).slice(0, 5) : [];

                                    return (
                                        <div
                                            key={node.id}
                                            className={`absolute bg-[#0c0c10] ${isDragging ? "z-30 opacity-95" : "z-10"} touch-none select-none transition-shadow duration-150 cursor-grab active:cursor-grabbing`}
                                            style={{
                                                width: NODE_W,
                                                height: NODE_H,
                                                left: node.x,
                                                top: node.y + BOARD_HEADER,
                                                border: `1px solid ${isInspected ? "#00f0ff" : isHovered ? ac.border : "rgba(255,255,255,0.1)"}`,
                                                boxShadow: isInspected
                                                    ? `0 0 0 1px #00f0ff, 0 4px 20px rgba(0,240,255,0.2)`
                                                    : isHovered && !isDragging
                                                    ? `0 0 0 1px ${ac.border}66, 0 4px 20px rgba(0,0,0,0.5)`
                                                    : isDragging
                                                    ? "0 8px 32px rgba(0,0,0,0.7)"
                                                    : undefined,
                                            }}
                                            onPointerDown={e => handleNodePointerDown(e, node.id)}
                                            onPointerUp={e => part && handleNodePointerUp(e, part.id)}
                                            onMouseEnter={() => setHoveredNodeId(node.id)}
                                            onMouseLeave={() => setHoveredNodeId(null)}
                                        >
                                            {/* Colored top accent bar */}
                                            <div className="pointer-events-none h-[3px] w-full" style={{ background: ac.border }} />

                                            {/* Header: type badge + node label */}
                                            <div className="pointer-events-none px-2 pt-1.5 pb-1 flex items-center gap-1.5">
                                                <span
                                                    className="text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 shrink-0"
                                                    style={{ color: ac.text, background: ac.bg, border: `1px solid ${ac.border}44` }}
                                                >
                                                    {node.type}
                                                </span>
                                                <span className="text-[8px] text-gray-500 truncate leading-tight">{node.label}</span>
                                            </div>

                                            {/* Body: image + name */}
                                            <div className="pointer-events-none flex items-start gap-2 px-2 pb-1.5">
                                                <div
                                                    className="w-[60px] h-[60px] shrink-0 flex items-center justify-center overflow-hidden"
                                                    style={{ background: "#080808", border: `1px solid ${ac.border}22` }}
                                                >
                                                    {part ? (
                                                        <Image src={part.image} alt={part.name} width={58} height={58} className="object-contain p-1" draggable={false} />
                                                    ) : (
                                                        <span className="text-[10px] text-gray-600">—</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 pt-0.5">
                                                    <p className="text-[10px] font-bold text-white leading-tight truncate">{part?.name ?? node.label}</p>
                                                    <p className="text-[8px] text-gray-500 mt-0.5 line-clamp-2 leading-tight">{part?.description ?? ""}</p>
                                                </div>
                                            </div>

                                            {/* Pin row */}
                                            <div
                                                className="pointer-events-none px-2 pb-2 flex flex-wrap gap-1 border-t"
                                                style={{ borderColor: "rgba(255,255,255,0.06)" }}
                                            >
                                                {pinKeys.map(k => (
                                                    <span
                                                        key={k}
                                                        className="font-mono text-[7px] uppercase px-1.5 py-0.5 mt-1"
                                                        style={{
                                                            color: ac.text,
                                                            background: ac.bg,
                                                            border: `1px solid ${ac.border}33`,
                                                        }}
                                                    >
                                                        {k.replace(/\s+/g, "").substring(0, 6)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Full legend */}
                                <div className="absolute bottom-4 left-4 w-52 border border-[#1e1e24] bg-[#09090b]/95 backdrop-blur-md p-3 z-20 pointer-events-none">
                                    <h4 className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2.5">SCHEMATIC</h4>

                                    <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-1.5 font-bold">Node types</p>
                                    <ul className="space-y-1 mb-3">
                                        {([
                                            ["MCU",      "#00f0ff"],
                                            ["SENSOR",   "#39ff14"],
                                            ["ACTUATOR", "#ff5e00"],
                                            ["POWER",    "#ffcc00"],
                                            ["MODULE",   "#a855f7"],
                                            ["DISPLAY",  "#ec4899"],
                                        ] as [string, string][]).map(([label, color]) => (
                                            <li key={label} className="flex items-center gap-2 text-[9px]">
                                                <span className="w-2 h-2 shrink-0 border" style={{ borderColor: color, background: color + "18" }} />
                                                <span style={{ color }}>{label}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-1.5 font-bold border-t border-white/5 pt-2">Connections</p>
                                    <ul className="space-y-1.5">
                                        <li className="flex items-center gap-2 text-[9px]">
                                            <svg width="24" height="8"><line x1="0" y1="4" x2="22" y2="4" stroke="#39ff14" strokeWidth="1.5" markerEnd="url(#arrow-data)" /></svg>
                                            <span className="text-[#39ff14]">DATA</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-[9px]">
                                            <svg width="24" height="8"><line x1="0" y1="4" x2="22" y2="4" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrow-power)" /></svg>
                                            <span className="text-[#f97316]">POWER</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-[9px]">
                                            <svg width="24" height="8"><line x1="0" y1="4" x2="22" y2="4" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow-ground)" /></svg>
                                            <span className="text-slate-400">GROUND</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        </div>
                        </>
                    )}

                    {activeTab === "overview" && !isGenerating && (
                        <div className="w-full h-full p-12 overflow-y-auto relative z-10">
                            <div className="max-w-3xl">
                                <h2 className="text-3xl font-bold font-sans text-white mb-6 uppercase tracking-widest">Project: {scenario.projectName}</h2>
                                <div className="grid grid-cols-3 gap-6 mb-12">
                                    <div className="bg-[#121215] border border-white/5 p-6 rounded-sm">
                                        <p className="text-[#00f0ff] uppercase text-[10px] font-bold tracking-widest mb-1">Difficulty</p>
                                        <p className="text-xl font-bold text-white">{scenario.overview.level}</p>
                                    </div>
                                    <div className="bg-[#121215] border border-white/5 p-6 rounded-sm">
                                        <p className="text-[#ff5e00] uppercase text-[10px] font-bold tracking-widest mb-1">Est. Time</p>
                                        <p className="text-xl font-bold text-white">{scenario.overview.time}</p>
                                    </div>
                                    <div className="bg-[#121215] border border-white/5 p-6 rounded-sm">
                                        <p className="text-[#39ff14] uppercase text-[10px] font-bold tracking-widest mb-1">Est. Cost</p>
                                        <p className="text-xl font-bold text-white">${scenario.overview.cost.toFixed(2)}</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-[#00f0ff] uppercase tracking-widest mb-4">Objective</h3>
                                <p className="text-gray-400 text-lg leading-relaxed mb-8">{scenario.overview.description}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "learn" && !isGenerating && (
                        <div className="w-full h-full p-12 overflow-y-auto relative z-10">
                            <div className="max-w-3xl">
                                <h2 className="text-3xl font-bold font-sans text-white mb-6 uppercase tracking-widest">Learning Path</h2>
                                <p className="text-gray-400 mb-8">Follow these generated steps to assemble your {scenario.projectName}.</p>

                                <div className="space-y-6">
                                    {scenario.learningSteps.map((step, idx) => (
                                        <div key={idx} className="bg-[#121215] border border-white/5 p-6 rounded-sm relative">
                                            <div className="absolute top-6 left-0 w-1 h-12 bg-[#00f0ff]"></div>
                                            <h3 className="text-lg font-bold text-[#00f0ff] mb-2">{idx + 1}. {step.title}</h3>
                                            <p className="text-gray-400 text-base">{step.desc}</p>
                                        </div>
                                    ))}
                                    {scenario.learningSteps.length === 0 && <p className="text-gray-500 italic">No learning steps defined for this demo model.</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "purchase" && !isGenerating && (
                        <div className="w-full h-full p-12 overflow-y-auto relative z-10 flex flex-col justify-center items-center">
                            <div className="max-w-md w-full bg-[#121215] border border-white/10 p-8 text-center rounded-sm">
                                <Zap size={48} className="text-[#ff5e00] mx-auto mb-6" />
                                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">Project Bundle</h2>
                                <p className="text-gray-400 font-mono mb-8">Get all {scenario.nodes.length} necessary components for this project in one click. Verified by Dystronic AI.</p>

                                <div className="text-4xl font-bold font-mono text-[#39ff14] mb-8">
                                    ${scenario.overview.cost.toFixed(2)}
                                </div>

                                <Button
                                    variant="orange"
                                    size="lg"
                                    className="w-full mb-4 font-mono font-bold"
                                    onClick={() => {
                                        // Add all to cart 
                                        parts.forEach(p => addToCart(p, "part"));
                                        router.push("/cart");
                                    }}
                                >
                                    Add Complete Bundle to Cart
                                </Button>

                                <Button variant="outline" size="lg" className="w-full" onClick={() => router.push("/request")}>
                                    Request Sourcing (Out of stock parts)
                                </Button>
                            </div>
                        </div>
                    )}

                </div>

                {/* === RIGHT COLUMN: PARTS LIST / COMPONENT INSPECT === */}
                <div className={`${inspectedPartId ? "w-[420px]" : "w-[300px]"} shrink-0 border-l border-[#1a1a20] bg-[#050507] flex flex-col relative z-20 min-h-0 transition-all duration-200`}>

                    {inspectedPartId ? (() => {
                        const ip = MOCK_COMPONENTS.find(c => c.id === inspectedPartId)!;
                        const ipNode = partNodes.find(v => v.part.id === inspectedPartId)?.node;
                        // Build connections list for this part from scenario
                        const partConnections: { label: string; type: "POWER" | "DATA" | "GROUND" }[] = [];
                        scenario.connections.forEach(conn => {
                            const srcNode = scenario.nodes.find(n => n.id === conn.source);
                            const dstNode = scenario.nodes.find(n => n.id === conn.target);
                            if (srcNode && dstNode && (srcNode.partId === ip.id || dstNode.partId === ip.id)) {
                                const otherNode = srcNode.partId === ip.id ? dstNode : srcNode;
                                const otherPart = MOCK_COMPONENTS.find(c => c.id === otherNode.partId);
                                partConnections.push({
                                    label: `${otherNode.label}${otherPart ? ` (${otherPart.name})` : ""}`,
                                    type: conn.type as "POWER" | "DATA",
                                });
                            }
                        });
                        return (
                            <PartDetailSheet
                                part={ip}
                                nodeType={ipNode?.type ?? "MODULE"}
                                connections={partConnections}
                                onClose={() => setInspectedPartId(null)}
                                onAddToCart={(p) => addToCart(p, "part")}
                            />
                        );
                    })() : (
                        <>
                            <div className="p-4 border-b border-[#1a1a20] flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-widest shrink-0">
                                <span className="flex items-center gap-2"><List size={14} /> PARTS LIST</span>
                                <span>({parts.length})</span>
                            </div>
                            <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar space-y-1.5">
                                {!isGenerating ? partNodes.map(({ node, part }) => {
                                    const isHovered = hoveredNodeId === node.id;
                                    return (
                                        <div
                                            key={node.id}
                                            role="button"
                                            tabIndex={0}
                                            className={`flex items-center gap-3 p-2 cursor-pointer transition-colors ${isHovered ? "bg-white/8" : "hover:bg-white/5"}`}
                                            onMouseEnter={() => setHoveredNodeId(node.id)}
                                            onMouseLeave={() => setHoveredNodeId(null)}
                                            onClick={() => setInspectedPartId(part.id)}
                                            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setInspectedPartId(part.id); }}
                                        >
                                            <div className="shrink-0">{getIconForType(node.type)}</div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className={`text-[11px] truncate font-bold font-mono ${isHovered ? "text-white" : "text-gray-300"}`}>{node.label}</p>
                                                <p className="text-[9px] text-gray-600 truncate">{part.name}</p>
                                            </div>
                                        </div>
                                    );
                                }) : [1,2,3,4,5,6].map(i => (
                                    <div key={i} className="flex items-center gap-3 p-2">
                                        <div className="w-3 h-3 bg-white/10 rounded-full animate-pulse" />
                                        <div className="flex-1 h-3 bg-white/10 rounded-sm animate-pulse" />
                                    </div>
                                ))}
                            </div>
                            <div className="shrink-0 p-4 border-t border-[#1a1a20] bg-[#0a0a0d]">
                                <Button variant="cyan" className="w-full mb-3 text-[10px] tracking-widest" onClick={() => setActiveTab("purchase")} disabled={isGenerating}>
                                    VIEW PURCHASE OPTIONS
                                </Button>
                                <span className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1"><CornerDownRight size={10} /> Haz clic en un componente del board</span>
                            </div>
                        </>
                    )}
                </div>

            </div>

        </div>
    );
}

export default function AIBuilder() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-[#050507] text-[#00f0ff] flex items-center justify-center font-mono tracking-widest animate-pulse">INITIALIZING LAB...</div>}>
            <AIBuilderContent />
        </Suspense>
    );
}
