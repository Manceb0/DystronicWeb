"use client";

import { useState } from "react";
import { Link2, Bot, Send, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RequestPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        // Mock simulation
        setTimeout(() => {
            setStatus("success");
        }, 2000);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-mono uppercase tracking-widest text-[#00f0ff] mb-4">Intelligent Part Request</h1>
                <p className="text-gray-400 font-mono max-w-2xl mx-auto text-sm leading-relaxed">
                    Can't find exactly what you need? Describe the part or your project. Our system will source it for you or suggest an equivalent from our current stock.
                </p>
            </div>

            {status === "success" ? (
                <div className="glass-panel p-12 text-center border-l-4 border-l-[#39ff14] bg-gradient-to-r from-[#121215] to-[#050507]">
                    <div className="w-16 h-16 bg-[#39ff14]/10 text-[#39ff14] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bot size={32} />
                    </div>
                    <h2 className="text-2xl font-bold font-mono text-white mb-4">Request Analyzed</h2>
                    <p className="text-gray-400 font-mono max-w-md mx-auto mb-8">
                        We've found 2 equivalent alternatives in our local stock that match your specifications.
                    </p>
                    <div className="bg-[#050507] border border-white/5 rounded-sm p-4 text-left max-w-md mx-auto mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[#00f0ff] font-mono text-xs font-bold uppercase">Alternative #1</span>
                            <span className="text-[#39ff14] text-xs font-mono">In Stock</span>
                        </div>
                        <p className="text-white text-sm">ESP8266 NodeMCU</p>
                        <p className="text-gray-500 text-xs mt-1 font-mono">Matches your requirement for "IoT WiFi Module"</p>
                        <Button variant="outline" size="sm" className="w-full mt-4 text-xs">Add to cart ($6.50)</Button>
                    </div>
                    <Button variant="solid" onClick={() => setStatus("idle")}>Submit Another Request</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-10 relative overflow-hidden">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[#00f0ff] font-mono text-xs font-bold uppercase tracking-widest mb-2">What do you need?</label>
                                <input type="text" required placeholder="e.g. Raspberry Pi 4 8GB or similar" className="w-full bg-[#050507] border border-white/10 rounded-sm px-4 py-3 text-sm font-mono focus:border-[#00f0ff] outline-none text-white transition-colors" />
                            </div>

                            <div>
                                <label className="block text-gray-400 font-mono text-xs font-bold uppercase tracking-widest mb-2">Quantity</label>
                                <input type="number" min="1" defaultValue="1" className="w-full bg-[#050507] border border-white/10 rounded-sm px-4 py-3 text-sm font-mono focus:border-[#00f0ff] outline-none text-white transition-colors" />
                            </div>

                            <div>
                                <label className="block text-gray-400 font-mono text-xs font-bold uppercase tracking-widest mb-2">Project Context</label>
                                <textarea rows={4} placeholder="If we don't have it, tell us what you're building so we can suggest alternatives..." className="w-full bg-[#050507] border border-white/10 rounded-sm px-4 py-3 text-sm font-mono focus:border-[#00f0ff] outline-none text-white transition-colors resize-none"></textarea>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="glass-panel p-6 bg-[#121215]/50 border-white/5 space-y-4">
                                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 mb-4">Request Options</h4>

                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="mt-1 accent-[#00f0ff]" />
                                    <div>
                                        <span className="block text-sm text-gray-200 font-bold mb-1 group-hover:text-white transition-colors">Accept Alternatives</span>
                                        <span className="block text-xs text-gray-500 font-mono">Dystronic AI will suggest equivalent components in stock.</span>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" className="mt-1 accent-[#ff5e00]" />
                                    <div>
                                        <span className="block text-sm text-gray-200 font-bold mb-1 group-hover:text-white transition-colors">Urgent (24h)</span>
                                        <span className="block text-xs text-gray-500 font-mono">I need this sourced immediately or a guaranteed alternative today.</span>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" className="mt-1 accent-[#39ff14]" />
                                    <div>
                                        <span className="block text-sm text-gray-200 font-bold mb-1 group-hover:text-white transition-colors">Request Technical Advice</span>
                                        <span className="block text-xs text-gray-500 font-mono">I need help from a human tech expert to review my needs.</span>
                                    </div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-gray-400 font-mono text-xs font-bold uppercase tracking-widest mb-2">Reference Link (Optional)</label>
                                <div className="relative">
                                    <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input type="url" placeholder="Paste a link to Amazon, Adafruit, etc." className="w-full bg-[#050507] border border-white/10 rounded-sm pl-10 pr-4 py-3 text-sm font-mono focus:border-[#00f0ff] outline-none text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                        <p className="text-xs text-gray-500 font-mono max-w-sm"><Bot size={14} className="inline mr-1 text-[#00f0ff]" /> Requests are processed immediately by our AI for stock checks.</p>
                        <Button variant="cyan" type="submit" disabled={status === "submitting"}>
                            {status === "submitting" ? (
                                <span className="flex items-center"><Search className="animate-spin mr-2" size={18} /> Analyzing...</span>
                            ) : (
                                <span className="flex items-center"><Send size={18} className="mr-2" /> Submit Request</span>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
