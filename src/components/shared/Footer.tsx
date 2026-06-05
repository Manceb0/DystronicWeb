"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircuitBoard } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

export default function Footer() {
    const pathname = usePathname();
    const { t } = useTranslation();

    if (pathname === "/ai-builder") {
        return null;
    }

    return (
        <footer className="w-full bg-[#121215] border-t border-white/5 py-12 mt-20 relative z-10">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <Link href="/" className="flex items-center gap-2 group mb-4">
                        <div className="text-[#00f0ff]">
                            <CircuitBoard size={20} />
                        </div>
                        <span className="font-mono font-bold tracking-wider text-sm uppercase">Dystronic</span>
                    </Link>
                    <p className="text-sm text-gray-500 font-mono leading-relaxed">
                        {t("footer.status")}<br />
                        {t("footer.project")}<br />
                        {t("footer.tagline")}
                    </p>
                </div>

                <div>
                    <h4 className="text-gray-100 font-bold mb-4 font-mono text-sm tracking-widest uppercase">{t("footer.platform")}</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><Link href="/store" className="hover:text-[#00f0ff] transition-colors">{t("footer.components")}</Link></li>
                        <li><Link href="/kits" className="hover:text-[#00f0ff] transition-colors">{t("common.kits")}</Link></li>
                        <li><Link href="/courses" className="hover:text-[#00f0ff] transition-colors">{t("common.courses")}</Link></li>
                        <li><Link href="/ai-builder" className="hover:text-[#39ff14] transition-colors">{t("footer.aiLab")}</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-gray-100 font-bold mb-4 font-mono text-sm tracking-widest uppercase">{t("footer.community")}</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><Link href="/community" className="hover:text-[#ff5e00] transition-colors">{t("footer.resellDonate")}</Link></li>
                        <li><Link href="/request" className="hover:text-[#00f0ff] transition-colors">{t("footer.requestPart")}</Link></li>
                        <li><Link href="/profile" className="hover:text-[#00f0ff] transition-colors">{t("footer.myProjects")}</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-gray-100 font-bold mb-4 font-mono text-sm tracking-widest uppercase">{t("footer.terminal")}</h4>
                    <div className="bg-[#050507] rounded-sm p-3 border border-white/5 font-mono text-xs text-gray-400">
                        <span className="text-[#39ff14]">guest@dystronic:~$</span> ./subscribe.sh<br />
                        <span className="text-gray-600">{t("footer.subscribe")}</span>
                        <div className="mt-2 flex">
                            <input type="text" className="bg-transparent border-b border-white/20 outline-none w-full text-white placeholder:text-gray-600 focus:border-[#00f0ff]" placeholder="user@email.com" />
                            <button className="text-[#00f0ff] ml-2 font-bold">{">>"}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600 font-mono">
                © {new Date().getFullYear()} DYSTRONIC. {t("common.rights")}
            </div>
        </footer>
    );
}
