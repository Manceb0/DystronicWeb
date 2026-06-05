"use client";

import Link from "next/link";
import { PackageOpen, ArrowRight, BrainCircuit, Bot } from "lucide-react";
import { MOCK_KITS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/LanguageProvider";
import { translateLevel } from "@/i18n/helpers";

export default function KitsPage() {
    const { t, locale } = useTranslation();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 border-b border-white/5 pb-8 relative">
                <div className="absolute right-0 top-0 opacity-10 text-[#ff5e00]">
                    <PackageOpen size={120} />
                </div>
                <h1 className="text-4xl font-bold font-mono uppercase tracking-widest text-white mb-4">{t("kits.title")}</h1>
                <p className="text-gray-400 font-mono max-w-2xl text-sm leading-relaxed">
                    {t("kits.subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {MOCK_KITS.map(kit => (
                    <div key={kit.id} className="glass-panel group overflow-hidden flex flex-col sm:flex-row">
                        <div className="sm:w-1/3 bg-[#050507] border-r border-white/5 relative p-6 flex flex-col items-center justify-center min-h-[200px]">
                            <div className="absolute top-2 left-2 flex gap-1">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest ${kit.level === 'Beginner' ? 'bg-[#39ff14]/20 text-[#39ff14]' : kit.level === 'Intermediate' ? 'bg-[#ffcc00]/20 text-[#ffcc00]' : 'bg-[#ff5e00]/20 text-[#ff5e00]'}`}>
                                    {translateLevel(locale, kit.level)}
                                </span>
                            </div>
                            <div className="absolute inset-0 w-full h-full z-0">
                                <img src={kit.image} alt={kit.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                            </div>
                        </div>

                        <div className="sm:w-2/3 p-6 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-100 hover:text-white transition-colors mb-2 font-mono">{kit.name}</h2>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{kit.description}</p>

                                <div className="mb-4">
                                    <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 font-mono flex items-center gap-1"><BrainCircuit size={12} /> {t("kits.whatYouLearn")}</h4>
                                    <ul className="text-xs text-gray-300 space-y-1 font-mono">
                                        {kit.whatYouWillLearn.slice(0, 2).map((learned, i) => (
                                            <li key={i} className="flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-[#00f0ff] before:rounded-full">{learned}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 md:mt-0">
                                <span className="text-lg font-bold font-mono text-white">${kit.price.toFixed(2)}</span>
                                <div className="flex gap-2">
                                    <Link href={`/ai-builder?mode=learn&kit=${kit.id}`}>
                                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-[#39ff14] hover:text-[#39ff14] hover:bg-[#39ff14]/10">
                                            <Bot size={14} className="mr-2" /> {t("common.viewPath")}
                                        </Button>
                                    </Link>
                                    <Link href={`/kits/${kit.id}`}>
                                        <Button variant="outline" size="sm">{t("common.details")} <ArrowRight size={14} className="ml-2" /></Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
