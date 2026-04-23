"use client";

import { useState } from "react";
import { Recycle, Search, MapPin, Tag, HeartHandshake, UploadCloud } from "lucide-react";
import { MOCK_COMMUNITY } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
    const [filter, setFilter] = useState<"all" | "sell" | "donate">("all");

    const filteredPosts = MOCK_COMMUNITY.filter(p => filter === "all" || p.type === filter);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="glass-panel p-8 md:p-12 mb-8 relative overflow-hidden bg-gradient-to-r from-[#0b1122] to-[#050507]">
                <div className="absolute top-1/2 right-10 -translate-y-1/2 text-white/5">
                    <Recycle size={250} />
                </div>
                <div className="relative z-10 md:w-2/3">
                    <h1 className="text-4xl font-bold font-mono uppercase tracking-widest text-white mb-4">Community Resell & Donation</h1>
                    <p className="text-gray-400 font-mono mb-8 text-lg">
                        Finished a project? Don't let your parts collect dust. Sell or donate electronic components to other students and creators.
                    </p>
                    <div className="flex gap-4">
                        <Button variant="cyan"><UploadCloud size={18} className="mr-2" /> Create Post</Button>
                        <Button variant="outline"><HeartHandshake size={18} className="mr-2" /> View My Donations</Button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex bg-[#121215] border border-white/5 rounded-sm p-1">
                    <button
                        className={`px-4 py-2 text-sm font-mono tracking-widest uppercase transition-colors ${filter === "all" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
                        onClick={() => setFilter("all")}
                    >All</button>
                    <button
                        className={`px-4 py-2 text-sm font-mono tracking-widest uppercase transition-colors ${filter === "sell" ? "bg-[#00f0ff]/10 text-[#00f0ff]" : "text-gray-500 hover:text-gray-300"}`}
                        onClick={() => setFilter("sell")}
                    >For Sale</button>
                    <button
                        className={`px-4 py-2 text-sm font-mono tracking-widest uppercase transition-colors ${filter === "donate" ? "bg-[#39ff14]/10 text-[#39ff14]" : "text-gray-500 hover:text-gray-300"}`}
                        onClick={() => setFilter("donate")}
                    >Donations</button>
                </div>

                <div className="flex items-center bg-[#121215] border border-white/10 rounded-sm px-3 py-2 w-full md:w-64 focus-within:border-[#00f0ff]/50 transition-colors">
                    <Search size={16} className="text-gray-500 mr-2" />
                    <input type="text" placeholder="Search community..." className="bg-transparent text-sm w-full focus:outline-none placeholder:text-gray-600 font-mono text-white" />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPosts.map(post => (
                    <div key={post.id} className="glass-panel flex flex-col group hover:-translate-y-1 transition-transform relative">
                        {/* Image Zone */}
                        <div className="aspect-[4/3] bg-[#050507] border-b border-white/5 relative flex items-center justify-center p-4">
                            <div className="absolute top-2 left-2 flex gap-1 z-10">
                                {post.type === "sell" ? (
                                    <span className="bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">Sale</span>
                                ) : (
                                    <span className="bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/30 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">Donate</span>
                                )}
                                <span className="bg-[#121215]/80 text-white border border-white/10 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">{post.condition}</span>
                            </div>

                            <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 z-0" />
                        </div>

                        {/* Content Zone */}
                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="font-bold text-gray-100 line-clamp-1 mb-2 group-hover:text-white transition-colors">{post.title}</h3>

                            <div className="space-y-2 mb-4">
                                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
                                    <Tag size={12} /> {post.origin}
                                </p>
                                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={12} /> {post.location}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4">
                                <span className="text-xl font-bold font-mono text-white">
                                    {post.price === 0 ? <span className="text-[#39ff14]">FREE</span> : `$${post.price.toFixed(2)}`}
                                </span>
                                <Button variant="outline" size="sm" className="text-xs">
                                    {post.type === "donate" ? "Request" : "Message"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
