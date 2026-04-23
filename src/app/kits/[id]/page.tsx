"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, GraduationCap, PackageCheck, Bot, Network } from "lucide-react";
import { MOCK_KITS, MOCK_COMPONENTS, MOCK_COURSES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

export default function KitDetail() {
    const { id } = useParams() as { id: string };
    const { addToCart } = useAppContext();

    const kit = MOCK_KITS.find(k => k.id === id);

    if (!kit) {
        return <div className="container mx-auto p-20 text-center font-mono">Kit not found.</div>;
    }

    const course = kit.courseId ? MOCK_COURSES.find(c => c.id === kit.courseId) : null;
    const parts = kit.components.map(partId => MOCK_COMPONENTS.find(p => p.id === partId)).filter(Boolean);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-gray-500 uppercase mb-8">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link href="/kits" className="hover:text-white transition-colors">Kits</Link>
                <ChevronRight size={12} />
                <span className="text-[#ff5e00]">{kit.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                {/* Left Side: Kit Presentation */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-8 mb-8 border-t-2 border-t-[#ff5e00]">
                        <div className="w-full h-64 bg-[#050507] border border-white/5 rounded-sm mb-8 relative flex items-center justify-center p-4 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none"></div>
                            <img src={kit.image} alt={kit.name} className="w-full h-full object-contain hover:scale-110 transition-transform duration-700 relative z-0" />
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold font-mono text-white max-w-xl">{kit.name}</h1>
                            <span className={`text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest ${kit.level === 'Beginner' ? 'bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/50' : 'bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00]/50'}`}>
                                {kit.level}
                            </span>
                        </div>

                        <p className="text-gray-400 font-mono mb-8 text-lg">{kit.description}</p>

                        {/* Learning Visual Diagram Mock */}
                        <div className="mt-8 bg-[#050507] rounded-sm p-6 border border-white/5 relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 text-[#00f0ff] opacity-5"><Network size={150} /></div>
                            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[#00f0ff] mb-6 flex items-center gap-2"><Network size={16} /> Learning Diagram</h3>

                            <div className="flex flex-col gap-4 relative z-10">
                                {kit.whatYouWillLearn.map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        <div className="w-8 h-8 rounded-full bg-[#121215] border border-gray-700 flex items-center justify-center text-xs font-bold font-mono group-hover:border-[#00f0ff] group-hover:text-[#00f0ff] transition-colors">{idx + 1}</div>
                                        <div className="flex-1 glass-panel p-3 border-l-2 border-l-transparent group-hover:border-l-[#00f0ff] transition-all">
                                            <span className="font-mono text-sm text-gray-300">{step}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Action Panel */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 sticky top-24">
                        <div className="text-3xl font-mono font-bold text-white mb-6 border-b border-white/10 pb-4">${kit.price.toFixed(2)}</div>

                        <div className="space-y-4 mb-8">
                            <Button variant="orange" className="w-full" onClick={() => addToCart(kit, "kit")}>
                                <PackageCheck size={18} className="mr-2" /> Buy Kit
                            </Button>

                            <Link href={`/ai-builder?mode=overview&kit=${kit.id}`} className="block">
                                <Button variant="green" className="w-full">
                                    <Bot size={18} className="mr-2" /> Explore in Dystronic AI
                                </Button>
                            </Link>
                        </div>

                        {course && (
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <h4 className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-4">Associated Course</h4>
                                <div className="bg-[#050507] p-4 border border-white/5 hover:border-[#ffcc00]/50 transition-colors">
                                    <GraduationCap size={20} className="text-[#ffcc00] mb-2" />
                                    <Link href={`/courses/${course.id}`} className="text-sm font-bold text-gray-200 hover:text-white capitalize block mb-1">
                                        {course.title}
                                    </Link>
                                    <span className="text-[10px] text-gray-500 font-mono uppercase">Bundle available</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h4 className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-4">Included Parts</h4>
                            <ul className="text-sm font-mono text-gray-400 space-y-2 h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {parts.map((p, i) => (
                                    <li key={i} className="flex items-center justify-between group">
                                        <Link href={`/store/${p?.id}`} className="hover:text-white flex-1 truncate">{p?.name}</Link>
                                        <span className="w-5 h-5 flex items-center justify-center bg-white/5 rounded-sm text-[10px]">x1</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
