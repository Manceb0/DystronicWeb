"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Smartphone, X, ArrowRight } from "lucide-react";
import DemoRequestModal, { useDemoRequest } from "./DemoRequestModal";

const STORAGE_KEY = "dystronic-mobile-banner-dismissed";

export default function MobileDemoBanner() {
    const [visible, setVisible] = useState(false);
    const pathname = usePathname();
    const demo = useDemoRequest();

    useEffect(() => {
        const check = () => {
            if (typeof window === "undefined") return;
            if (pathname === "/ai-builder") {
                setVisible(false);
                return;
            }
            const dismissed = sessionStorage.getItem(STORAGE_KEY);
            const isMobile = window.matchMedia("(max-width: 768px)").matches;
            if (isMobile && !dismissed) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };
        check();
        const mq = window.matchMedia("(max-width: 768px)");
        mq.addEventListener("change", check);
        return () => mq.removeEventListener("change", check);
    }, [pathname]);

    const dismiss = () => {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setVisible(false);
    };

    if (!visible) {
        return (
            <DemoRequestModal
                open={demo.open}
                onClose={demo.close}
                context={demo.context}
                extraInfo={demo.extraInfo}
            />
        );
    }

    return (
        <>
            <div className="fixed top-16 left-3 right-3 z-[60] md:hidden bg-[linear-gradient(135deg,rgba(0,240,255,0.14),rgba(0,0,0,0.82)_36%,rgba(57,255,20,0.10))] shadow-[0_18px_60px_rgba(0,240,255,0.18),inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl font-mono">
                
                <div className="px-3 py-2.5 flex items-center gap-2.5">
                    <Smartphone size={14} className="text-[#00f0ff] shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-[#00f0ff]/85 font-bold">
                            Demo · Móvil en preview
                        </p>
                        <p className="hidden text-[11px] text-gray-400 leading-snug mb-2">
                            La experiencia está optimizada para escritorio. Pide acceso anticipado y te avisamos.
                        </p>
                        <button
                            onClick={() => demo.request("mobile")}
                            className="mt-1 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/70 hover:text-white font-bold transition-colors"
                        >
                            Pedir demo móvil
                            <ArrowRight size={10} />
                        </button>
                    </div>
                    <button
                        onClick={dismiss}
                        aria-label="Cerrar aviso"
                        className="text-gray-500 hover:text-white transition-colors shrink-0 -mr-0.5 p-1"
                    >
                        <X size={13} />
                    </button>
                </div>
            </div>

            <DemoRequestModal
                open={demo.open}
                onClose={demo.close}
                context={demo.context}
                extraInfo={demo.extraInfo}
            />
        </>
    );
}
