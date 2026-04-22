"use client";

import Link from "next/link";
import { User, Library, PackageCheck, Zap, History, Settings, Bot } from "lucide-react";
import { MOCK_SCENARIOS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-12 border-b border-white/5 pb-8 relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute -left-20 top-0 w-64 h-64 bg-[#00f0ff] opacity-10 blur-[100px] rounded-full"></div>

                <div className="w-24 h-24 bg-[#121215] border-2 border-[#00f0ff]/50 rounded-full flex items-center justify-center shrink-0">
                    <User size={40} className="text-[#00f0ff]" />
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold font-mono text-white">Student_0x94F</h1>
                        <span className="bg-[#39ff14]/20 text-[#39ff14] text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm">Maker</span>
                    </div>
                    <p className="text-sm font-mono text-gray-500">Member since 2024 • Tech University</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    <div className="bg-[#0b1122] border-l-2 border-[#00f0ff] text-white p-3 font-mono text-sm tracking-wide flex items-center gap-3">
                        <Library size={16} /> Saved Projects
                    </div>
                    <div className="hover:bg-white/5 text-gray-400 hover:text-gray-200 cursor-pointer p-3 font-mono text-sm tracking-wide transition-colors flex items-center gap-3">
                        <History size={16} /> Order History
                    </div>
                    <div className="hover:bg-white/5 text-gray-400 hover:text-gray-200 cursor-pointer p-3 font-mono text-sm tracking-wide transition-colors flex items-center gap-3">
                        <Zap size={16} /> Active Courses
                    </div>
                    <div className="hover:bg-white/5 text-gray-400 hover:text-gray-200 cursor-pointer p-3 font-mono text-sm tracking-wide transition-colors flex items-center gap-3">
                        <PackageCheck size={16} /> My Resell Posts
                    </div>
                    <div className="hover:bg-white/5 text-gray-400 hover:text-gray-200 cursor-pointer p-3 font-mono text-sm tracking-wide transition-colors flex items-center gap-3">
                        <Settings size={16} /> Settings
                    </div>
                </div>

                {/* Content View - Saved AI Projects */}
                <div className="lg:col-span-3">
                    <h3 className="text-xl font-bold font-mono uppercase tracking-widest text-[#00f0ff] mb-6 flex items-center gap-2">
                        <Bot size={20} /> AI Lab Projects
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {MOCK_SCENARIOS.slice(0, 3).map((scenario) => (
                            <div key={scenario.id} className="glass-panel p-6 border-transparent hover:border-[#39ff14]/50 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-lg font-bold text-gray-100 group-hover:text-white mb-2">{scenario.projectName}</h4>
                                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#39ff14] border border-[#39ff14]/30 px-2 py-0.5 rounded-sm">Draft</span>
                                </div>

                                <p className="text-xs text-gray-500 font-mono mb-4 line-clamp-2">
                                    Prompt: "{scenario.prompt}"
                                </p>

                                <div className="flex items-center gap-4 text-xs font-mono text-gray-400 bg-[#050507] p-3 rounded-sm mb-6 border border-white/5">
                                    <span>{scenario.nodes.length > 0 ? scenario.nodes.length : 8} Nodes</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                    <span>Est: ${scenario.overview.cost.toFixed(2)}</span>
                                </div>

                                <Link href={`/ai-builder?mode=overview&project=${scenario.id}`} className="block w-full">
                                    <Button variant="green" size="sm" className="w-full">
                                        Open in Workspace
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
