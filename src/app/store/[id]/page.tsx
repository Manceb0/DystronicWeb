"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, CircuitBoard, Bot, ShoppingCart } from "lucide-react";
import { MOCK_COMPONENTS, MOCK_SCENARIOS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

export default function ProductDetail() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { addToCart, setActiveAIProject } = useAppContext();

    const product = MOCK_COMPONENTS.find(p => p.id === id);

    if (!product) {
        return <div className="container mx-auto p-20 text-center font-mono">Component not found.</div>;
    }

    // Find a related scenario
    const relatedScenario = MOCK_SCENARIOS.find(sc => sc.nodes.some(n => n.partId === product.id));

    const handleAskAI = () => {
        if (relatedScenario) {
            setActiveAIProject(relatedScenario.id);
            router.push("/ai-builder?mode=learn");
        } else {
            router.push("/ai-builder");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-gray-500 uppercase mb-8">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link href="/store" className="hover:text-white transition-colors">Store</Link>
                <ChevronRight size={12} />
                <span className="text-[#00f0ff]">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Product Image Zone */}
                <div className="glass-panel aspect-square flex items-center justify-center relative p-8 bg-gradient-to-tr from-[#050507] to-[#121215]">
                    <div className="absolute top-4 left-4 flex gap-2">
                        {product.tags.map(tag => (
                            <span key={tag} className="bg-white/5 border border-white/10 text-[10px] text-gray-300 font-bold px-3 py-1 rounded-sm uppercase tracking-widest">{tag}</span>
                        ))}
                    </div>
                    {/* Placeholder for image */}
                    <div className="w-3/4 h-3/4 border-2 border-dashed border-gray-800 rounded-sm flex items-center justify-center text-gray-700 font-mono text-2xl">
                        [ {product.image} ]
                    </div>
                </div>

                {/* Product Info Zone */}
                <div className="flex flex-col">
                    <div className="text-[10px] text-[#00f0ff] font-mono font-bold tracking-widest uppercase mb-2">
                        [ CATEGORY: {product.category} ]
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                        <div className="text-3xl font-mono text-[#00f0ff]">${product.price.toFixed(2)}</div>
                        <div className="flex items-center gap-2 text-sm text-[#39ff14] font-mono bg-[#39ff14]/10 px-3 py-1 rounded-sm">
                            <CheckCircle2 size={16} /> In Stock ({product.stock})
                        </div>
                    </div>

                    <p className="text-gray-400 font-mono leading-relaxed mb-8">
                        {product.description}
                    </p>

                    <div className="flex items-center gap-4 mb-12">
                        <Button variant="solid" size="lg" className="flex-1" onClick={() => addToCart(product, "part")}>
                            <ShoppingCart size={18} className="mr-2" /> Add to List
                        </Button>
                        <Button variant="outline" size="lg" className="w-12 h-12 p-0 flex items-center justify-center">
                            <CircuitBoard size={18} />
                        </Button>
                    </div>

                    {/* CRITICAL FEATURE: Ask AI Block */}
                    <div className="glass-panel p-6 border-[#39ff14]/30 bg-gradient-to-r from-[#121215] to-[#050507] relative overflow-hidden">
                        {/* Glow */}
                        <div className="absolute right-0 top-0 w-32 h-32 bg-[#39ff14]/10 blur-[50px] rounded-full"></div>

                        <div className="flex items-start gap-4 relative z-10">
                            <div className="p-3 bg-[#39ff14]/10 rounded-full text-[#39ff14]">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2 font-mono">Don't know if this works for your project?</h3>
                                <p className="text-sm text-gray-400 font-mono mb-4">
                                    Our automated Assistant can verify compatibility, give you a wiring diagram, or recommend alternatives.
                                </p>
                                <Button variant="green" size="sm" onClick={handleAskAI}>
                                    Ask Dystronic AI
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 glass-panel p-8">
                    <h3 className="text-xl font-bold font-mono uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-4">Tech Specs</h3>
                    <ul className="space-y-4 font-mono text-sm">
                        {Object.entries(product.specs).map(([key, val]) => (
                            <li key={key} className="flex border-b border-dashed border-gray-800 pb-2">
                                <span className="text-gray-500 w-1/3">{key}</span>
                                <span className="text-gray-200 w-2/3">{val}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
