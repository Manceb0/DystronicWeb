"use client";

import Link from "next/link";
import { Trash2, ShoppingCart, CheckCircle, PackageOpen, ArrowRight, Store, Truck, Bot } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export default function CartPage() {
    const { cart, removeFromCart, cartTotal } = useAppContext();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <ShoppingCart size={80} className="mx-auto text-gray-800 mb-6" />
                <h1 className="text-3xl font-bold font-mono text-white mb-4">Your workspace is empty</h1>
                <p className="text-gray-400 font-mono mb-8">Add components, kits, or projects to your list.</p>
                <Link href="/store">
                    <Button variant="cyan">Explore Catalog</Button>
                </Link>
            </div>
        );
    }

    // Simulate a tax and shipping logic
    const tax = cartTotal * 0.16;
    const shipping = cartTotal > 100 ? 0 : 15;
    const total = cartTotal + tax + shipping;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold font-mono uppercase tracking-widest text-[#ff5e00] mb-8 border-b border-white/5 pb-4">
                Project Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="glass-panel p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="w-24 h-24 bg-[#050507] border border-white/5 rounded-sm flex items-center justify-center shrink-0 overflow-hidden relative group">
                                <div className="text-[10px] font-mono text-gray-700">{item.itemData.image.split('/')[2]}</div>
                                <div className="absolute top-0 right-0 bg-white/10 px-1 text-[9px] font-bold uppercase">{item.type}</div>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-100 text-lg mb-1">{(item.itemData as any).name || (item.itemData as any).title}</h3>
                                <p className="text-xs text-gray-500 font-mono line-clamp-1 mb-4">
                                    {item.type === "part" ? `Category: ${(item.itemData as any).category}` : "Level: " + (item.itemData as any).level}
                                </p>
                                <div className="flex items-center gap-4 text-sm font-mono">
                                    <span className="text-[#00f0ff] font-bold">${item.itemData.price.toFixed(2)}</span>
                                    <span className="text-gray-500">Qty: {item.quantity}</span>
                                </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-4 h-full pt-2">
                                <div className="font-bold text-white font-mono text-lg">
                                    ${(item.itemData.price * item.quantity).toFixed(2)}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Alert for AI users */}
                    <div className="bg-[#39ff14]/5 border border-[#39ff14]/30 p-4 rounded-sm flex items-start gap-4">
                        <Bot size={20} className="text-[#39ff14] mt-1 shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-[#39ff14] font-mono">Dystronic AI Verified</h4>
                            <p className="text-xs text-gray-400 font-mono mt-1">If these parts belong to an AI generated project, checking out will automatically attach the wiring diagram to your receipt.</p>
                        </div>
                    </div>
                </div>

                {/* Checkout column */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 sticky top-24">
                        <h3 className="text-xl font-bold font-mono uppercase tracking-widest text-white border-b border-white/10 pb-4 mb-6">Order Summary</h3>

                        <div className="space-y-3 text-sm font-mono text-gray-300 border-b border-white/10 pb-6 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-white">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes (16%)</span>
                                <span className="text-white">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-white">{shipping === 0 ? <span className="text-[#39ff14]">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-xl font-bold font-mono text-white mb-8">
                            <span>Total</span>
                            <span className="text-[#ff5e00]">${total.toFixed(2)}</span>
                        </div>

                        <div className="space-y-4 font-mono text-sm mb-8">
                            <label className="flex items-center gap-3 cursor-pointer group glass-panel p-3 border-transparent hover:border-[#00f0ff] transition-all">
                                <input type="radio" name="delivery" defaultChecked className="accent-[#00f0ff]" />
                                <Store size={18} className="text-[#00f0ff]" />
                                <span className="group-hover:text-white transition-colors">Local Lab Pickup</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group glass-panel p-3 border-transparent hover:border-[#ff5e00] transition-all">
                                <input type="radio" name="delivery" className="accent-[#ff5e00]" />
                                <Truck size={18} className="text-[#ff5e00]" />
                                <span className="group-hover:text-white transition-colors">Standard Shipping</span>
                            </label>
                        </div>

                        <Button variant="orange" size="lg" className="w-full">
                            Simulate Checkout
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
