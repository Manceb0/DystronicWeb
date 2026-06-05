"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircuitBoard, Search, ShoppingCart, User } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function Navbar() {
    const pathname = usePathname();
    const { cart } = useAppContext();
    const { t } = useTranslation();

    const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

    const navLinks = [
        { name: t("common.store"), path: "/store" },
        { name: t("common.kits"), path: "/kits" },
        { name: t("common.courses"), path: "/courses" },
        { name: t("common.community"), path: "/community" },
    ];

    if (pathname === "/ai-builder") {
        return null;
    }

    return (
        <header className="fixed top-0 w-full h-16 bg-[#050507]/80 backdrop-blur-md z-50 border-b border-white/5 top-0 left-0 right-0">
            <div className="container mx-auto h-full px-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="text-[#00f0ff] group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all">
                            <CircuitBoard size={24} />
                        </div>
                        <span className="font-mono font-bold tracking-wider text-xl uppercase">Dystronic</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`text-sm tracking-wide font-medium transition-colors hover:text-[#00f0ff] ${pathname.startsWith(link.path) ? "text-[#00f0ff]" : "text-gray-400"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center bg-[#121215] border border-white/10 rounded-sm px-3 py-1.5 focus-within:border-[#00f0ff]/50 transition-colors">
                        <Search size={16} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder={t("common.search")}
                            className="bg-transparent text-sm w-40 lg:w-48 focus:outline-none placeholder:text-gray-600 font-mono"
                        />
                    </div>

                    <LanguageSwitcher />

                    <Link href="/ai-builder" className="text-sm font-bold font-mono px-3 py-1.5 border border-[#39ff14]/30 text-[#39ff14] bg-[#39ff14]/5 rounded-sm hover:bg-[#39ff14]/10 transition-colors">
                        {t("common.aiBuilder").toUpperCase()}
                    </Link>

                    <Link href="/cart" className="relative text-gray-300 hover:text-white transition-colors">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-[#ff5e00] text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <Link href="/profile" className="text-gray-300 hover:text-white transition-colors" title={t("common.profile")}>
                        <User size={20} />
                    </Link>
                </div>
            </div>
        </header>
    );
}
