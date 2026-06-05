"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    X, ShoppingCart, ExternalLink, BadgeCheck, ChevronRight,
    Battery, Cpu, Radio, Activity, LayoutTemplate, MonitorSmartphone,
    Zap, FileText, Download, Search, Plus
} from "lucide-react";
import type { Part } from "@/lib/mock-data";

type NodeType = "MCU" | "POWER" | "SENSOR" | "ACTUATOR" | "MODULE" | "DISPLAY";

type Props = {
    part: Part;
    nodeType?: NodeType | string;
    connections?: { label: string; type: "POWER" | "DATA" | "GROUND" }[];
    onClose: () => void;
    onAddToCart?: (part: Part) => void;
};

const TYPE_META: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
    MCU:      { color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10", border: "border-[#00f0ff]/40", icon: <Cpu size={11} />,                label: "MCU"      },
    POWER:    { color: "text-yellow-400", bg: "bg-yellow-950",   border: "border-yellow-800",   icon: <Battery size={11} />,            label: "Power"    },
    SENSOR:   { color: "text-[#39ff14]", bg: "bg-[#39ff14]/10",  border: "border-[#39ff14]/40", icon: <Radio size={11} />,              label: "Sensor"   },
    ACTUATOR: { color: "text-[#ff5e00]", bg: "bg-[#ff5e00]/10",  border: "border-[#ff5e00]/40", icon: <Activity size={11} />,           label: "Actuator" },
    MODULE:   { color: "text-[#a855f7]", bg: "bg-[#a855f7]/10",  border: "border-[#a855f7]/40", icon: <LayoutTemplate size={11} />,     label: "Module"   },
    DISPLAY:  { color: "text-pink-400",  bg: "bg-pink-900/30",   border: "border-pink-700",     icon: <MonitorSmartphone size={11} />,  label: "Display"  },
};

// Build sourcing search URLs from the part name
const buildSources = (partName: string) => {
    const q = encodeURIComponent(partName);
    return [
        {
            store: "AliExpress",
            verified: true,
            title: `${partName} - búsqueda en AliExpress`,
            price: "~$2.86",
            url: `https://aliexpress.com/wholesale?SearchText=${q}`,
            domain: "aliexpress.com",
        },
        {
            store: "Amazon",
            verified: true,
            title: `${partName} - búsqueda en Amazon`,
            price: "~$12.99",
            url: `https://www.amazon.com/s?k=${q}`,
            domain: "amazon.com",
        },
        {
            store: "Adafruit",
            verified: false,
            title: `Search for: ${partName}`,
            url: `https://www.adafruit.com/?q=${q}`,
            domain: "adafruit.com",
        },
        {
            store: "eBay",
            verified: false,
            title: `Search for: ${partName}`,
            url: `https://www.ebay.com/sch/i.html?_nkw=${q}`,
            domain: "ebay.com",
        },
        {
            store: "Mouser",
            verified: false,
            title: `Search for: ${partName}`,
            url: `https://www.mouser.com/c/?q=${q}`,
            domain: "mouser.com",
        },
    ];
};

const buildCADSources = (partName: string) => {
    const q = encodeURIComponent(partName);
    return [
        { name: "GrabCAD",       desc: "STEP/IGES models, assemblies, and parts for mechanical design.",   url: `https://grabcad.com/library?query=${q}`,             domain: "grabcad.com" },
        { name: "SnapEDA",       desc: "ECAD models including footprint, symbol, and 3D models (STEP).",   url: `https://www.snapeda.com/search/?q=${q}`,             domain: "snapeda.com" },
        { name: "Ultra Librarian", desc: "ECAD models (footprints, symbols) and 3D CAD models for EDA.",  url: `https://www.ultralibrarian.com/search?searchTerm=${q}`, domain: "ultralibrarian.com" },
        { name: "Thingiverse",   desc: "STL files for 3D printing and various user-contributed designs.", url: `https://www.thingiverse.com/search?q=${q}`,          domain: "thingiverse.com" },
    ];
};

export default function PartDetailSheet({ part, nodeType = "MODULE", connections = [], onClose, onAddToCart }: Props) {
    const meta = TYPE_META[nodeType as string] ?? TYPE_META.MODULE;
    const [openSection, setOpenSection] = useState<Record<string, boolean>>({
        sourcing: true,
        specs:    false,
        physical: true,
        connections: connections.length > 0,
        docs:     false,
        examples: false,
        cad:      false,
    });

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const toggle = (k: string) => setOpenSection(s => ({ ...s, [k]: !s[k] }));
    const sources = buildSources(part.name);
    const cadSources = buildCADSources(part.name);
    const componentId = part.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

    return (
        <div className="h-full overflow-y-auto font-mono bg-black border-l border-gray-800">
            <div className="p-5">
                {/* MAIN CARD */}
                <div className={`border ${meta.border} bg-black`}>
                    {/* Image header */}
                    <div className="relative">
                        <div className="border-b border-gray-800 bg-gray-950 flex items-center justify-center h-48 overflow-hidden">
                            <Image
                                src={part.image}
                                alt={part.name}
                                width={300}
                                height={300}
                                className="h-full w-full object-contain p-4"
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-2 border border-red-900/50 bg-black/70 text-red-500 hover:bg-red-950 hover:border-red-700 transition-all backdrop-blur-sm"
                            aria-label="Close detail"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Title row */}
                    <div className="p-5 border-b border-gray-800 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 border ${meta.border} flex items-center justify-center shrink-0`}>
                                <span className={meta.color}>{meta.icon}</span>
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-white uppercase tracking-wider leading-tight">{part.name}</h1>
                                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">{part.category}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${meta.bg} ${meta.color} ${meta.border}`}>
                                        {meta.icon}{meta.label}
                                    </span>
                                    {part.tags?.[0] && (
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 border border-gray-800 px-1.5 py-0.5">{part.tags[0]}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed text-left max-w-[180px] shrink-0">{part.description}</p>
                    </div>

                    {/* SECTIONS */}
                    <div className="p-5 space-y-5">

                        {/* SOURCING */}
                        <Section
                            title="Sourcing Options"
                            open={openSection.sourcing}
                            onToggle={() => toggle("sourcing")}
                            dotColor="bg-emerald-500"
                        >
                            <div className="space-y-2">
                                {sources.slice(0, 2).map(s => (
                                    <a
                                        key={s.store}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 border border-gray-800 p-3 hover:border-gray-600 hover:bg-gray-900/40 transition-colors group"
                                    >
                                        <ShoppingCart size={12} className="text-gray-600 group-hover:text-gray-400 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">{s.store}</span>
                                                {s.verified && <BadgeCheck size={12} className="text-emerald-400 shrink-0" />}
                                            </div>
                                            <p className="text-[11px] text-gray-500 mt-0.5 truncate" title={s.title}>{s.title}</p>
                                        </div>
                                        {s.price && <span className="text-xs text-white font-bold shrink-0">{s.price}</span>}
                                        <ExternalLink size={11} className="text-gray-600 group-hover:text-gray-400 shrink-0" />
                                    </a>
                                ))}
                            </div>

                            <hr className="border-gray-800 my-3" />

                            <div className="space-y-2">
                                {sources.slice(2).map(s => (
                                    <a
                                        key={s.store}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 border border-gray-800 p-3 hover:border-gray-600 hover:bg-gray-900/40 transition-colors group"
                                    >
                                        <ShoppingCart size={12} className="text-gray-600 group-hover:text-gray-400 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">{s.store}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-500 mt-0.5 truncate" title={s.title}>{s.title}</p>
                                        </div>
                                        <span className="text-[11px] text-gray-500 group-hover:text-gray-300 shrink-0 uppercase tracking-wider">Search</span>
                                        <ExternalLink size={11} className="text-gray-600 group-hover:text-gray-400 shrink-0" />
                                    </a>
                                ))}
                            </div>

                            <div className="pt-3 flex items-center justify-between">
                                <button type="button" className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300 transition-colors">
                                    Search more
                                    <ChevronRight size={11} />
                                </button>
                                {onAddToCart && (
                                    <button
                                        onClick={() => onAddToCart(part)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff5e00] text-black font-bold text-[10px] uppercase tracking-wider hover:bg-[#ff7a2e] transition-colors"
                                    >
                                        <Plus size={11} />
                                        Add to cart · ${part.price.toFixed(2)}
                                    </button>
                                )}
                            </div>
                        </Section>

                        {/* TECHNICAL SPECS */}
                        <Section
                            title="Technical Specifications"
                            open={openSection.specs}
                            onToggle={() => toggle("specs")}
                            dotColor={openSection.specs ? "bg-emerald-500" : "bg-gray-700"}
                        >
                            <ul className="space-y-1.5 text-[12px] text-gray-300">
                                {Object.entries(part.specs).map(([k, v]) => (
                                    <li key={k} className="flex items-baseline gap-2 border-b border-gray-900 py-1.5">
                                        <span className="text-gray-500 uppercase text-[10px] tracking-wider w-32 shrink-0">{k}</span>
                                        <span className="text-white">{String(v)}</span>
                                    </li>
                                ))}
                                <li className="flex items-baseline gap-2 border-b border-gray-900 py-1.5">
                                    <span className="text-gray-500 uppercase text-[10px] tracking-wider w-32 shrink-0">Stock</span>
                                    <span className="text-emerald-400">{part.stock} units available</span>
                                </li>
                                <li className="flex items-baseline gap-2 py-1.5">
                                    <span className="text-gray-500 uppercase text-[10px] tracking-wider w-32 shrink-0">Price (Dystronic)</span>
                                    <span className="text-white font-bold">${part.price.toFixed(2)}</span>
                                </li>
                            </ul>
                        </Section>

                        {/* CONNECTIONS */}
                        {connections.length > 0 && (
                            <Section
                                title="Connections"
                                open={openSection.connections}
                                onToggle={() => toggle("connections")}
                                dotColor="bg-emerald-500"
                            >
                                <ul className="space-y-1.5">
                                    {connections.map((c, i) => {
                                        const color = c.type === "POWER" ? "text-[#f97316] border-[#f97316]/30" : c.type === "DATA" ? "text-[#39ff14] border-[#39ff14]/30" : "text-slate-400 border-slate-600";
                                        return (
                                            <li key={i} className={`flex items-center gap-3 border ${color.split(" ")[1]} bg-black p-2.5`}>
                                                <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 border ${color}`}>{c.type}</span>
                                                <span className="text-[11px] text-gray-300 flex-1">{c.label}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Section>
                        )}

                        {/* DOCUMENTATION */}
                        <Section
                            title="Documentation & Libraries"
                            open={openSection.docs}
                            onToggle={() => toggle("docs")}
                            dotColor={openSection.docs ? "bg-emerald-500" : "bg-gray-700"}
                        >
                            <div className="space-y-2">
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(part.name + " datasheet")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 border border-gray-800 p-2.5 hover:border-gray-600 hover:bg-gray-900/40 transition-colors group"
                                >
                                    <FileText size={12} className="text-gray-600 group-hover:text-gray-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Datasheet</span>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Search for: {part.name} datasheet</p>
                                    </div>
                                    <ExternalLink size={11} className="text-gray-600 group-hover:text-gray-400" />
                                </a>
                                <a
                                    href={`https://github.com/search?q=${encodeURIComponent(part.name)}&type=repositories`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 border border-gray-800 p-2.5 hover:border-gray-600 hover:bg-gray-900/40 transition-colors group"
                                >
                                    <FileText size={12} className="text-gray-600 group-hover:text-gray-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Libraries · GitHub</span>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Open-source code & examples</p>
                                    </div>
                                    <ExternalLink size={11} className="text-gray-600 group-hover:text-gray-400" />
                                </a>
                            </div>
                        </Section>

                        {/* EXAMPLE PROJECTS */}
                        <Section
                            title="Example Projects"
                            open={openSection.examples}
                            onToggle={() => toggle("examples")}
                            dotColor={openSection.examples ? "bg-emerald-500" : "bg-gray-700"}
                        >
                            <div className="space-y-2">
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(part.name + " tutorial project")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block border border-gray-800 p-3 hover:border-gray-600 hover:bg-gray-900/40 transition-colors group"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Search size={11} className="text-gray-600 group-hover:text-gray-400" />
                                        <span className="text-xs text-gray-300 font-bold">Tutorial videos · YouTube</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">
                                        Comprehensive guides covering wiring, code examples, and integration patterns for {part.name}.
                                    </p>
                                </a>
                                <Link
                                    href="/courses"
                                    className="block border border-gray-800 p-3 hover:border-gray-600 hover:bg-gray-900/40 transition-colors group"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Zap size={11} className="text-[#00f0ff]" />
                                        <span className="text-xs text-gray-300 font-bold">Dystronic Courses</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">Cursos guiados con {part.name} en proyectos reales.</p>
                                </Link>
                            </div>
                        </Section>

                        {/* CAD / 3D */}
                        <Section
                            title="CAD / 3D Files"
                            open={openSection.cad}
                            onToggle={() => toggle("cad")}
                            dotColor={openSection.cad ? "bg-emerald-500" : "bg-gray-700"}
                        >
                            <div className="space-y-2">
                                {cadSources.map(s => (
                                    <a
                                        key={s.name}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 border border-gray-800 p-2.5 hover:border-gray-600 hover:bg-gray-900/40 transition-colors group"
                                    >
                                        <Download size={12} className="text-gray-600 group-hover:text-gray-400 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">{s.name}</span>
                                            <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{s.desc}</p>
                                            <p className="text-[9px] text-gray-600 mt-0.5">{s.domain}</p>
                                        </div>
                                        <ExternalLink size={11} className="text-gray-600 group-hover:text-gray-400" />
                                    </a>
                                ))}
                            </div>
                        </Section>

                    </div>

                    {/* COMPONENT ID FOOTER */}
                    <div className="px-5 py-4 border-t border-gray-800">
                        <span className="text-[10px] text-gray-600 uppercase tracking-widest">Component ID</span>
                        <p className="text-gray-500 font-mono text-xs mt-0.5">{componentId}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Collapsible section ────────────────────────────────────
function Section({
    title, open, onToggle, dotColor, children,
}: {
    title: string;
    open: boolean;
    onToggle: () => void;
    dotColor: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center justify-between mb-2 group"
            >
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors flex items-center gap-2">
                    <ChevronRight size={12} className={`transition-transform ${open ? "rotate-90" : ""}`} />
                    <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                    {title}
                </h2>
            </button>
            {open && <div className="pl-1.5">{children}</div>}
        </div>
    );
}
