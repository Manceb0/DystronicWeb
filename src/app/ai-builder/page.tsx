"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Edit3, MessageSquare, Plus, Save, Download,
    Cpu, Zap, Radio, Activity, LayoutTemplate, MonitorSmartphone, Share2, CornerDownRight, Bot, List
} from "lucide-react";
import { Suspense } from "react";
import { MOCK_SCENARIOS, MOCK_COMPONENTS, Part } from "@/lib/mock-data";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

type ViewMode = "overview" | "wiring" | "learn" | "purchase";

function AIBuilderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToCart, activeAIProject } = useAppContext();

    // State
    const [activeTab, setActiveTab] = useState<ViewMode>("wiring");
    const [projectId, setProjectId] = useState<string>("sc-rc-car"); // Default RC Car
    const [isGenerating, setIsGenerating] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    const scenario = MOCK_SCENARIOS.find(s => s.id === projectId) || MOCK_SCENARIOS[0];
    const parts = scenario.nodes.map(n => MOCK_COMPONENTS.find(c => c.id === n.partId)).filter(Boolean) as Part[];

    useEffect(() => {
        const idFromParam = searchParams.get("project");
        if (idFromParam && MOCK_SCENARIOS.find(s => s.id === idFromParam)) {
            setProjectId(idFromParam);
        } else if (activeAIProject) {
            setProjectId(activeAIProject);
        }
    }, [searchParams, activeAIProject]);

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

            {/* 
        ========================================
        TOP BAR 
        ========================================
      */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0a0d] shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push("/")} className="text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft size={16} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Bot size={16} className="text-[#00f0ff]" />
                        <span className="font-bold tracking-widest text-[#00f0ff] uppercase">{scenario.projectName}</span>
                    </div>
                </div>

                {/* Mode Tabs */}
                <div className="flex bg-[#121215] border border-white/5 p-1 rounded-sm">
                    {(["overview", "wiring", "learn", "purchase"] as ViewMode[]).map(mode => (
                        <button
                            key={mode}
                            onClick={() => setActiveTab(mode)}
                            className={`px-6 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === mode ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button className="text-gray-500 hover:text-white transition-colors"><Download size={16} /></button>
                    <button className="text-gray-500 hover:text-white transition-colors"><Share2 size={16} /></button>
                    <Link href="/profile" className="text-xs bg-[#121215] border border-white/10 px-3 py-1.5 hover:border-[#00f0ff] transition-colors">PROFILE</Link>
                </div>
            </div>

            {/* 
        ========================================
        MAIN THREE-COLUMN LAYOUT
        ========================================
      */}
            <div className="flex-1 flex overflow-hidden">

                {/* === LEFT COLUMN: CHAT & PLAN === */}
                <div className="w-[320px] lg:w-[380px] shrink-0 border-r border-[#1a1a20] flex flex-col bg-[#050507]">

                    <div className="p-4 border-b border-[#1a1a20] flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2"><MessageSquare size={14} /> CHAT_LOG</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {isGenerating ? (
                            <div className="h-full flex flex-col items-center justify-center text-[#00f0ff]">
                                <Bot size={48} className="animate-pulse mb-6 opacity-50 text-[#00f0ff]" />
                                <p className="text-xs uppercase tracking-widest animate-pulse">GENERATING SYSTEM PLAN...</p>
                                <div className="w-1/2 h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00f0ff] animate-[progress_2s_ease-in-out_infinite]"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">

                                {/* User Input Block */}
                                <div>
                                    <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest text-right">USER_INPUT</div>
                                    <div className="border border-white/20 p-4 bg-[#121215]/50 text-gray-300">
                                        "{scenario.prompt}"
                                    </div>
                                </div>

                                {/* System Plan Block */}
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
                        )}
                    </div>

                    {/* Action Zone Bottom */}
                    <div className="p-4 border-t border-[#1a1a20] bg-[#0a0a0d]">
                        <div className="flex gap-2 mb-3">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-[#ff5e00] text-black font-bold py-1.5 text-xs uppercase hover:bg-[#ff7a2e] transition-colors"><Edit3 size={12} /> EDIT</button>
                            <button className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-gray-300 py-1.5 text-xs uppercase hover:bg-white/5 transition-colors"><MessageSquare size={12} /> ASK</button>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask Dystronic to modify..."
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && inputValue) {
                                        // Just cycle through scenarios for demo
                                        handleSimulateGenerating(MOCK_SCENARIOS.find(s => s.id !== projectId)?.id || "sc-rc-car")
                                    }
                                }}
                                className="w-full bg-[#121215] border border-white/10 rounded-sm px-3 py-2 text-sm focus:border-[#00f0ff] outline-none text-white transition-colors"
                                disabled={isGenerating}
                            />
                        </div>
                    </div>
                </div>

                {/* === CENTER COLUMN: DYNAMIC CANVAS === */}
                <div className="flex-1 relative bg-[#09090b] overflow-hidden">

                    {/* Subtle Grid Background for Blueprint feel */}
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
                    <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)", backgroundSize: "150px 150px" }}></div>

                    {/* DYNAMIC CONTENT SWITCH BASED ON TAB */}
                    {activeTab === "wiring" && !isGenerating && (
                        <div className="w-full h-full relative z-10 overflow-auto">

                            <div className="w-[1400px] h-[900px] relative">
                                {/* Connections SVG Layer */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    {scenario.connections.map((conn, idx) => {
                                        const sourceNode = scenario.nodes.find(n => n.id === conn.source);
                                        const targetNode = scenario.nodes.find(n => n.id === conn.target);
                                        if (!sourceNode || !targetNode) return null;

                                        // Calculate connection points (assuming basic boxes, from right to left)
                                        const x1 = sourceNode.x + 180;
                                        const y1 = sourceNode.y + 70;
                                        const x2 = targetNode.x;
                                        const y2 = targetNode.y + 70;

                                        const path = `M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`;

                                        return (
                                            <g key={idx}>
                                                <path
                                                    d={path}
                                                    fill="none"
                                                    stroke={conn.type === "POWER" ? "#ffcc00" : "#39ff14"}
                                                    strokeWidth="2"
                                                    strokeDasharray={conn.type === "POWER" ? "4 4" : "none"}
                                                    className="opacity-70 drop-shadow-md"
                                                />
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Nodes */}
                                {scenario.nodes.map(node => {
                                    const part = MOCK_COMPONENTS.find(c => c.id === node.partId);
                                    const isHovered = hoveredNodeId === node.id || hoveredNodeId === part?.id;
                                    return (
                                        <div
                                            key={node.id}
                                            className={`absolute w-[180px] h-[140px] bg-[#121215]/90 border-2 ${getColorForType(node.type)} ${isHovered ? 'shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' : ''} transition-all cursor-pointer backdrop-blur-sm`}
                                            style={{ left: node.x, top: node.y }}
                                            onMouseEnter={() => setHoveredNodeId(node.partId)}
                                            onMouseLeave={() => setHoveredNodeId(null)}
                                        >
                                            <div className="flex flex-col h-full items-center justify-center p-2">
                                                <span className="text-[8px] font-bold text-gray-500 mb-1 block w-full truncate text-center">{node.label}</span>
                                                <div className="w-16 h-16 border border-white/10 mb-2 flex items-center justify-center bg-[#050507]">
                                                    <span className="text-[10px] text-gray-600">{part ? part.image.split('/')[2] : "img"}</span>
                                                </div>
                                                {/* Badges */}
                                                <div className="flex gap-1 flex-wrap justify-center">
                                                    {part?.specs && Object.keys(part.specs).slice(0, 3).map((specKey, i) => (
                                                        <span key={i} className="text-[8px] uppercase tracking-wider text-[#00f0ff] border border-[#00f0ff]/30 px-1 rounded-sm bg-[#00f0ff]/5">{specKey.substring(0, 4)}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Legend Panel over WIRING */}
                            <div className="absolute bottom-6 left-6 w-48 border border-[#1a1a20] bg-[#0a0a0d]/90 backdrop-blur-md p-4">
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">SCHEMATIC LEGEND</h4>

                                <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">NODE TYPES</div>
                                <ul className="space-y-1.5 mb-4">
                                    <li className="flex items-center gap-2"><span className="w-2 h-2 border border-[#00f0ff]"></span><span className="text-[#00f0ff]">MCU</span></li>
                                    <li className="flex items-center gap-2"><span className="w-2 h-2 border border-[#39ff14]"></span><span className="text-[#39ff14]">SENSOR</span></li>
                                    <li className="flex items-center gap-2"><span className="w-2 h-2 border border-[#ff5e00]"></span><span className="text-[#ff5e00]">ACTUATOR</span></li>
                                    <li className="flex items-center gap-2"><span className="w-2 h-2 border border-[#ffcc00]"></span><span className="text-[#ffcc00]">POWER</span></li>
                                    <li className="flex items-center gap-2"><span className="w-2 h-2 border border-[#a855f7]"></span><span className="text-[#a855f7]">MODULE</span></li>
                                    <li className="flex items-center gap-2"><span className="w-2 h-2 border border-pink-500"></span><span className="text-pink-500">DISPLAY</span></li>
                                </ul>

                                <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">CONNECTION TYPES</div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2"><span className="w-6 h-0.5 bg-[#39ff14]"></span><span className="text-[#39ff14]">DATA</span></li>
                                    <li className="flex items-center gap-2"><span className="w-6 h-0.5 border-t border-dashed border-[#ffcc00]"></span><span className="text-[#ffcc00]">POWER</span></li>
                                </ul>
                            </div>

                        </div>
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

                {/* === RIGHT COLUMN: PARTS LIST (BOM) === */}
                <div className="w-[300px] shrink-0 border-l border-[#1a1a20] bg-[#050507] flex flex-col relative z-20">

                    <div className="p-4 border-b border-[#1a1a20] flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2"><List size={14} /> PARTS LIST</span>
                        <span>({parts.length})</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                        {!isGenerating ? parts.map((part, idx) => {
                            const nodeType = scenario.nodes.find(n => n.partId === part?.id)?.type || "MCU";
                            const isHovered = hoveredNodeId === part.id;

                            return (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-3 p-2 rounded-sm cursor-pointer transition-colors ${isHovered ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                    onMouseEnter={() => setHoveredNodeId(part.id)}
                                    onMouseLeave={() => setHoveredNodeId(null)}
                                >
                                    <div className="shrink-0">
                                        {getIconForType(nodeType)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className={`text-xs truncate font-bold font-mono ${isHovered ? 'text-white' : 'text-gray-300'}`}>{part.name}</p>
                                    </div>
                                </div>
                            )
                        }) : (
                            [1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex items-center gap-3 p-2">
                                    <div className="w-3 h-3 bg-white/10 rounded-full animate-pulse"></div>
                                    <div className="flex-1 h-3 bg-white/10 rounded-sm animate-pulse"></div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Call to action panel */}
                    <div className="p-4 border-t border-[#1a1a20] bg-[#0a0a0d]">
                        <Button
                            variant="cyan"
                            className="w-full mb-3 text-[10px] tracking-widest"
                            onClick={() => setActiveTab("purchase")}
                            disabled={isGenerating}
                        >
                            VIEW PURCHASE OPTIONS
                        </Button>
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1"><CornerDownRight size={10} /> Syncs with Dystronic Store</span>
                        </div>
                    </div>

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
