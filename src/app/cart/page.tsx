"use client";

import Link from "next/link";
import { Trash2, ShoppingCart, Store, Truck, Bot } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/LanguageProvider";
import { translateCategory } from "@/i18n/helpers";
import DemoRequestModal, { useDemoRequest } from "@/components/shared/DemoRequestModal";

export default function CartPage() {
    const { cart, removeFromCart, cartTotal } = useAppContext();
    const { t, locale } = useTranslation();
    const demo = useDemoRequest();

    const buildCartSummary = () => {
        const lines = cart.map(item => {
            const data = item.itemData as { name?: string; title?: string; price: number };
            const label = data.name || data.title || "Item";
            return `- ${label} × ${item.quantity} — $${(data.price * item.quantity).toFixed(2)}`;
        });
        const subtotal = cartTotal.toFixed(2);
        const taxAmount = (cartTotal * 0.16).toFixed(2);
        const shippingAmount = cartTotal > 100 ? "0.00" : "15.00";
        const totalAmount = (cartTotal + cartTotal * 0.16 + (cartTotal > 100 ? 0 : 15)).toFixed(2);
        return [
            "PEDIDO:",
            ...lines,
            "",
            `Subtotal: $${subtotal}`,
            `Impuestos (16%): $${taxAmount}`,
            `Envío: $${shippingAmount}`,
            `Total: $${totalAmount}`,
        ].join("\n");
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <ShoppingCart size={80} className="mx-auto text-gray-800 mb-6" />
                <h1 className="text-3xl font-bold font-mono text-white mb-4">{t("cart.emptyTitle")}</h1>
                <p className="text-gray-400 font-mono mb-8">{t("cart.emptyDesc")}</p>
                <Link href="/store">
                    <Button variant="cyan">{t("common.exploreCatalog")}</Button>
                </Link>
            </div>
        );
    }

    const tax = cartTotal * 0.16;
    const shipping = cartTotal > 100 ? 0 : 15;
    const total = cartTotal + tax + shipping;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold font-mono uppercase tracking-widest text-[#ff5e00] mb-8 border-b border-white/5 pb-4">
                {t("cart.title")}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="glass-panel p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="w-24 h-24 bg-[#050507] border border-white/5 rounded-sm flex items-center justify-center shrink-0 overflow-hidden relative group">
                                <div className="text-[10px] font-mono text-gray-700">{item.itemData.image.split('/')[2]}</div>
                                <div className="absolute top-0 right-0 bg-white/10 px-1 text-[9px] font-bold uppercase">{t(`cartTypes.${item.type}`)}</div>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-100 text-lg mb-1">{(item.itemData as { name?: string; title?: string }).name || (item.itemData as { title?: string }).title}</h3>
                                <p className="text-xs text-gray-500 font-mono line-clamp-1 mb-4">
                                    {item.type === "part"
                                        ? `${t("cart.categoryLabel")}: ${translateCategory(locale, (item.itemData as { category: string }).category)}`
                                        : `${t("common.level")}: ${(item.itemData as { level: string }).level}`}
                                </p>
                                <div className="flex items-center gap-4 text-sm font-mono">
                                    <span className="text-[#00f0ff] font-bold">${item.itemData.price.toFixed(2)}</span>
                                    <span className="text-gray-500">{t("common.qty")}: {item.quantity}</span>
                                </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-4 h-full pt-2">
                                <div className="font-bold text-white font-mono text-lg">
                                    ${(item.itemData.price * item.quantity).toFixed(2)}
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 transition-colors p-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="bg-[#39ff14]/5 border border-[#39ff14]/30 p-4 rounded-sm flex items-start gap-4">
                        <Bot size={20} className="text-[#39ff14] mt-1 shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-[#39ff14] font-mono">{t("cart.aiVerified")}</h4>
                            <p className="text-xs text-gray-400 font-mono mt-1">{t("cart.aiVerifiedDesc")}</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 sticky top-24">
                        <h3 className="text-xl font-bold font-mono uppercase tracking-widest text-white border-b border-white/10 pb-4 mb-6">{t("cart.orderSummary")}</h3>

                        <div className="space-y-3 text-sm font-mono text-gray-300 border-b border-white/10 pb-6 mb-6">
                            <div className="flex justify-between">
                                <span>{t("cart.subtotal")}</span>
                                <span className="text-white">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t("cart.tax")}</span>
                                <span className="text-white">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t("cart.shipping")}</span>
                                <span className="text-white">{shipping === 0 ? <span className="text-[#39ff14]">{t("cart.freeShipping")}</span> : `$${shipping.toFixed(2)}`}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-xl font-bold font-mono text-white mb-8">
                            <span>{t("cart.total")}</span>
                            <span className="text-[#ff5e00]">${total.toFixed(2)}</span>
                        </div>

                        <div className="space-y-4 font-mono text-sm mb-8">
                            <label className="flex items-center gap-3 cursor-pointer group glass-panel p-3 border-transparent hover:border-[#00f0ff] transition-all">
                                <input type="radio" name="delivery" defaultChecked className="accent-[#00f0ff]" />
                                <Store size={18} className="text-[#00f0ff]" />
                                <span className="group-hover:text-white transition-colors">{t("cart.localPickup")}</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group glass-panel p-3 border-transparent hover:border-[#ff5e00] transition-all">
                                <input type="radio" name="delivery" className="accent-[#ff5e00]" />
                                <Truck size={18} className="text-[#ff5e00]" />
                                <span className="group-hover:text-white transition-colors">{t("cart.standardShipping")}</span>
                            </label>
                        </div>

                        <Button
                            variant="orange"
                            size="lg"
                            className="w-full"
                            onClick={() => demo.request("checkout", buildCartSummary())}
                        >
                            {t("cart.simulateCheckout")}
                        </Button>

                        <p className="mt-3 text-[10px] text-gray-500 font-mono text-center leading-relaxed">
                            Esta versión es una demo · el pago real lo activamos por solicitud
                        </p>
                    </div>
                </div>
            </div>

            <DemoRequestModal
                open={demo.open}
                onClose={demo.close}
                context={demo.context}
                extraInfo={demo.extraInfo}
            />
        </div>
    );
}
