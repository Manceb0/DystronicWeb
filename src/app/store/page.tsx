"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, ChevronDown, Check, LayoutGrid, List } from "lucide-react";
import { MOCK_COMPONENTS, ProductCategory } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "@/i18n/LanguageProvider";
import { translateCategory } from "@/i18n/helpers";

export default function StoreCatalog() {
    const { addToCart } = useAppContext();
    const { t, locale } = useTranslation();
    const [filterMode, setFilterMode] = useState<ProductCategory | "all">("all");
    const [search, setSearch] = useState("");

    const filteredComponents = MOCK_COMPONENTS.filter(c => {
        if (filterMode !== "all" && c.category !== filterMode) return false;
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const categories = ["all", "microcontroller", "sensor", "motor", "power", "driver", "prototyping", "module", "display", "tool"] as const;

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="glass-panel p-6 sticky top-24">
                    <div className="flex items-center gap-2 mb-6 text-gray-100 font-mono font-bold tracking-wider">
                        <Filter size={18} className="text-[#00f0ff]" /> {t("common.filters")}
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder={t("store.search")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#050507] border border-white/10 rounded-sm px-3 py-2 text-sm font-mono focus:border-[#00f0ff] outline-none text-white transition-colors"
                        />
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">{t("store.category")}</h4>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-sm border ${filterMode === cat ? 'bg-[#00f0ff] border-[#00f0ff]' : 'border-gray-600 group-hover:border-[#00f0ff]'} flex items-center justify-center transition-colors`}>
                                        {filterMode === cat && <Check size={12} className="text-black" />}
                                    </div>
                                    <span className={`text-sm tracking-wide font-mono ${filterMode === cat ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                        {translateCategory(locale, cat)}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-mono uppercase tracking-widest text-white">{t("store.title")}</h1>
                        <p className="text-gray-500 text-sm font-mono mt-2">{t("common.showing")} {filteredComponents.length} {t("common.modules")}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="glass-panel px-4 py-2 flex items-center gap-3 text-sm text-gray-300 font-mono cursor-pointer hover:bg-white/5 transition-colors">
                            {t("common.sortBy")} {t("common.recommended")} <ChevronDown size={14} />
                        </div>
                        <div className="flex bg-[#121215] border border-white/5 rounded-sm overflow-hidden">
                            <button className="p-2 bg-white/10 text-white"><LayoutGrid size={18} /></button>
                            <button className="p-2 text-gray-500 hover:text-white transition-colors"><List size={18} /></button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredComponents.map(comp => (
                        <div key={comp.id} className="glass-panel group flex flex-col relative overflow-hidden transition-all hover:border-[#00f0ff]/50">
                            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                {comp.stock > 0 && <span className="bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/30 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-[0_0_10px_rgba(57,255,20,0.2)]">{t("common.inStock")}</span>}
                                {comp.tags.slice(0, 1).map(tag => (
                                    <span key={tag} className="bg-[#121215]/80 text-white border border-white/10 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">{tag}</span>
                                ))}
                            </div>

                            <Link href={`/store/${comp.id}`} className="block relative aspect-square bg-[#050507] p-8 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                    <span className="text-xs font-mono tracking-widest text-[#00f0ff] uppercase bg-black/50 px-3 py-1 border border-[#00f0ff]/30">{t("common.quickView")}</span>
                                </div>
                                <img src={comp.image} alt={comp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </Link>

                            <div className="p-5 flex flex-col flex-1 border-t border-white/5 bg-[#121215]/50">
                                <p className="text-[#00f0ff] font-mono text-[10px] uppercase tracking-widest mb-1">{translateCategory(locale, comp.category)}</p>
                                <Link href={`/store/${comp.id}`} className="text-lg font-bold text-gray-100 hover:text-white mb-2 leading-tight">
                                    {comp.name}
                                </Link>
                                <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed font-mono flex-1">
                                    {comp.description}
                                </p>

                                <div className="flex items-end justify-between mt-auto">
                                    <div className="text-xl font-bold font-mono text-white">${comp.price.toFixed(2)}</div>
                                    <Button variant="outline" size="sm" onClick={() => addToCart(comp, "part")} className="text-xs">
                                        {t("common.addToList")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
