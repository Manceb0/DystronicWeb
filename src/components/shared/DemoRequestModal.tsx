"use client";

import { useEffect, useRef, useState } from "react";
import { X, CheckCircle2, Mail, Sparkles, ArrowRight, MessageCircle, Copy } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

// Email rendered split so it's not visually parseable at first glance.
// Plain mailto: handler still works for the click.
const PARTS = ["manu", "mancebo", "outlook", "com"] as const;
const buildEmail = () => `${PARTS[0]}${PARTS[1]}@${PARTS[2]}.${PARTS[3]}`;

// ⚠️ Cambia este número por el tuyo (formato internacional sin +, ej. 521234567890)
const WHATSAPP_NUMBER = "18296486202";

export type DemoRequestContext =
    | "checkout"
    | "ai-builder"
    | "mobile"
    | "feature-locked"
    | "request-part"
    | "subscribe";

export interface DemoRequestModalProps {
    open: boolean;
    onClose: () => void;
    context?: DemoRequestContext;
    // Optional extra info to include in the request (e.g. cart contents)
    extraInfo?: string;
    title?: string;
    subtitle?: string;
}

const CONTEXT_COPY: Record<DemoRequestContext, { title: string; subtitle: string; cta: string; subject: string }> = {
    checkout: {
        title: "Solicita acceso completo",
        subtitle: "Esta versión es una demo. Cuéntanos sobre ti y abrimos el checkout, los descuentos por kit y el envío real para tu cuenta.",
        cta: "Pedir checkout activo",
        subject: "Solicitud de checkout — Demo Dystronic",
    },
    "ai-builder": {
        title: "Activa el AI Builder completo",
        subtitle: "El builder de IA está en preview. Envíanos tu proyecto y te activamos generación con LLM real, exportación de BOM y links de compra automáticos.",
        cta: "Solicitar activación",
        subject: "Solicitud de acceso al AI Builder — Dystronic",
    },
    mobile: {
        title: "Probando desde móvil",
        subtitle: "La demo está optimizada para escritorio. Dinos tu correo y te avisamos cuando la versión móvil esté lista, o agéndate una demo guiada.",
        cta: "Quiero la versión móvil",
        subject: "Aviso versión móvil — Dystronic",
    },
    "feature-locked": {
        title: "Esta función no está en la demo",
        subtitle: "Algunas integraciones (pagos, envío real, cuenta) sólo están disponibles para clientes piloto. Pídelas y te las activamos.",
        cta: "Pedir acceso a la feature",
        subject: "Feature locked — Demo Dystronic",
    },
    "request-part": {
        title: "Pide la pieza que necesitas",
        subtitle: "Aún no integramos sourcing automático. Cuéntanos qué componente buscas y te lo cotizamos manualmente.",
        cta: "Enviar solicitud",
        subject: "Solicitud de componente — Dystronic",
    },
    subscribe: {
        title: "Apúntate al lanzamiento",
        subtitle: "Te avisaremos cuando Dystronic abra al público con los kits y cursos cerrados.",
        cta: "Sumarme a la lista",
        subject: "Lista de espera — Dystronic",
    },
};

const CONTEXT_COPY_EN: typeof CONTEXT_COPY = {
    checkout: {
        title: "Request full access",
        subtitle: "This version is a demo. Tell us about your project and we will enable live checkout, kit discounts, and shipping for your account.",
        cta: "Request active checkout",
        subject: "Checkout request — Dystronic demo",
    },
    "ai-builder": {
        title: "Activate the full AI Builder",
        subtitle: "The AI Builder is in preview. Send us your project to request live generation, BOM export, and automatic purchasing links.",
        cta: "Request activation",
        subject: "AI Builder access request — Dystronic",
    },
    mobile: {
        title: "Testing on mobile",
        subtitle: "The demo is optimized for desktop. Share your email for the mobile release or request a guided demonstration.",
        cta: "Request mobile access",
        subject: "Mobile access request — Dystronic",
    },
    "feature-locked": {
        title: "This feature is not active in the demo",
        subtitle: "Payments, live shipping, and accounts are available to pilot customers by request.",
        cta: "Request feature access",
        subject: "Feature access request — Dystronic demo",
    },
    "request-part": {
        title: "Request the part you need",
        subtitle: "Automatic sourcing is not active yet. Tell us which component you need and we will prepare a manual quote.",
        cta: "Send request",
        subject: "Component request — Dystronic",
    },
    subscribe: {
        title: "Join the launch list",
        subtitle: "We will notify you when Dystronic launches publicly with complete kits and courses.",
        cta: "Join the list",
        subject: "Launch list — Dystronic",
    },
};

export default function DemoRequestModal({
    open,
    onClose,
    context = "feature-locked",
    extraInfo,
    title,
    subtitle,
}: DemoRequestModalProps) {
    const { locale } = useTranslation();
    const isEs = locale === "es";
    const copy = (isEs ? CONTEXT_COPY : CONTEXT_COPY_EN)[context];
    const dialogTitle = title ?? copy.title;
    const dialogSubtitle = subtitle ?? copy.subtitle;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const defaultMessage = context === "ai-builder"
        ? (isEs ? "Crear carro RC con sensores usando el AI Builder de Dystronic." : "Build an obstacle-avoiding RC car with the Dystronic AI Builder.")
        : "";
    const [message, setMessage] = useState(defaultMessage);
    const [sent, setSent] = useState<null | "whatsapp" | "email" | "copied">(null);
    const firstFieldRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => {
            setSent(null);
            setMessage(defaultMessage);
            firstFieldRef.current?.focus();
        }, 80);
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            clearTimeout(t);
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose, context, defaultMessage]);

    if (!open) return null;

    const buildMessageBody = () => {
        const lines = isEs
            ? [`Hola Manuel,`, ``, `Estoy probando la demo de Dystronic y me gustaría:`, ``, `> ${message || "(deja tu mensaje aquí)"}`, ``, `Mis datos:`, `Nombre: ${name || "(sin nombre)"}`, `Email de contacto: ${email || "(sin email)"}`]
            : [`Hello Manuel,`, ``, `I am testing the Dystronic demo and would like to:`, ``, `> ${message || "(add your message here)"}`, ``, `My details:`, `Name: ${name || "(not provided)"}`, `Contact email: ${email || "(not provided)"}`];
        if (extraInfo) {
            lines.push(``, `---`, isEs ? `Contexto adicional:` : `Additional context:`, extraInfo);
        }
        lines.push(``, `${isEs ? "Enviado desde" : "Sent from"}: ${typeof window !== "undefined" ? window.location.href : ""}`);
        return lines.join("\n");
    };

    const validate = () => true;

    const sendWhatsApp = () => {
        if (!validate()) return;
        const text = `*${copy.subject}*\n\n${buildMessageBody()}`;
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank", "noopener");
        setSent("whatsapp");
    };

    const sendEmail = () => {
        if (!validate()) return;
        const to = buildEmail();
        const subject = copy.subject;
        const body = buildMessageBody();
        const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        setSent("email");
    };

    const copyToClipboard = async () => {
        if (!validate()) return;
        const fullText = `${isEs ? "Solicitud" : "Request"}: ${copy.subject}\n\n${buildMessageBody()}`;
        try {
            await navigator.clipboard.writeText(fullText);
            setSent("copied");
        } catch {
            // ignore
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendWhatsApp();
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-mono"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-request-title"
        >
            {/* Backdrop */}
            <button
                aria-label={isEs ? "Cerrar" : "Close"}
                onClick={onClose}
                className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-default"
            />

            {/* Dialog */}
            <div
                className="relative w-full max-w-2xl bg-[#0a0a0d] border border-[#00f0ff]/25 shadow-[0_0_60px_rgba(0,240,255,0.12)]"
            >
                {/* Top accent line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00f0ff]/80 to-transparent" />

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors p-1.5"
                    aria-label={isEs ? "Cerrar" : "Close"}
                >
                    <X size={15} />
                </button>

                <div className="p-5 sm:p-6">
                    {sent ? (
                        <div className="text-center py-4">
                            <div className="mx-auto w-12 h-12 border border-[#39ff14]/40 bg-[#39ff14]/10 flex items-center justify-center mb-4">
                                <CheckCircle2 size={20} className="text-[#39ff14]" />
                            </div>
                            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">
                                {sent === "whatsapp" && (isEs ? "Abriendo WhatsApp" : "Opening WhatsApp")}
                                {sent === "email" && (isEs ? "Abriendo correo" : "Opening email")}
                                {sent === "copied" && (isEs ? "Mensaje copiado" : "Message copied")}
                            </h2>
                            <p className="text-[12px] text-gray-400 leading-relaxed mb-5">
                                {sent === "whatsapp" && (isEs ? "Te llevamos a WhatsApp con la solicitud lista. Sólo presiona enviar y nos contactamos en menos de 24h." : "Your request is ready in WhatsApp. Press send and we will contact you within 24 hours.")}
                                {sent === "email" && (isEs ? "Abrimos tu cliente de correo. Si no se abrió, prueba con WhatsApp o copia el mensaje." : "Your email client is opening. If it does not open, use WhatsApp or copy the message.")}
                                {sent === "copied" && (isEs ? "Pega el mensaje donde te resulte cómodo. WhatsApp y correo siguen disponibles." : "Paste the request wherever you prefer. WhatsApp and email are still available.")}
                            </p>
                            <div className="flex flex-col gap-2">
                                {sent !== "whatsapp" && (
                                    <button
                                        type="button"
                                        onClick={sendWhatsApp}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-black text-[11px] font-bold uppercase tracking-widest hover:bg-[#1ebe57] transition-colors"
                                    >
                                        <MessageCircle size={12} />
                                        {isEs ? "Enviar por WhatsApp" : "Send via WhatsApp"}
                                    </button>
                                )}
                                {sent !== "email" && (
                                    <button
                                        type="button"
                                        onClick={sendEmail}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-white/15 hover:border-white/35 text-white/70 hover:text-white text-[11px] uppercase tracking-widest transition-colors"
                                    >
                                        <Mail size={12} />
                                        {isEs ? "Enviar por correo" : "Send via email"}
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors"
                                >
                                    {isEs ? "Volver a la demo" : "Back to demo"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-5">
                                <div className="w-9 h-9 border border-[#00f0ff]/40 bg-[#00f0ff]/10 flex items-center justify-center shrink-0">
                                    <Sparkles size={14} className="text-[#00f0ff]" />
                                </div>
                                <div>
                                    <p className="text-[9px] tracking-[0.32em] uppercase text-[#00f0ff]/70 mb-1">{isEs ? "Solicitud de acceso · Demo" : "Access request · Demo"}</p>
                                    <h2 id="demo-request-title" className="text-[15px] font-bold text-white uppercase tracking-wider leading-tight">
                                        {dialogTitle}
                                    </h2>
                                </div>
                            </div>

                            <p className="text-[12px] text-gray-400 leading-relaxed mb-5">
                                {dialogSubtitle}
                            </p>

                            <div className="mb-4 border border-[#25D366]/25 bg-[#25D366]/[0.06] p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex-1">
                                    <p className="text-[9px] text-[#25D366] font-bold uppercase tracking-widest mb-1">{isEs ? "WhatsApp directo" : "Direct WhatsApp"}</p>
                                    <p className="text-sm font-bold text-white">+1 (829) 648 6202</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={sendWhatsApp}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-[#1ebe57] transition-colors"
                                >
                                    <MessageCircle size={12} />
                                    {isEs ? "Abrir WhatsApp" : "Open WhatsApp"}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <Field
                                    label={isEs ? "Nombre opcional" : "Name (optional)"}
                                    value={name}
                                    onChange={setName}
                                    placeholder={isEs ? "Tu nombre" : "Your name"}
                                    inputRef={firstFieldRef}
                                />
                                <Field
                                    label={isEs ? "Email opcional" : "Email (optional)"}
                                    value={email}
                                    onChange={setEmail}
                                    placeholder="tu@email.com"
                                    type="email"
                                />
                                <div>
                                    <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">{isEs ? "Mensaje" : "Message"}</label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder={isEs ? "Cuéntanos qué quieres hacer..." : "Tell us what you want to build..."}
                                        rows={4}
                                        className="w-full bg-[#050507] border border-[#25D366]/25 hover:border-[#25D366]/45 focus:border-[#25D366] px-3 py-2.5 text-[12px] text-white placeholder:text-gray-600 outline-none transition-colors resize-none font-mono"
                                    />
                                </div>

                                {/* Primary CTA: WhatsApp (recomendada — más rápido y confiable) */}
                                <button
                                    type="submit"
                                    disabled={!validate()}
                                    className="group w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-black font-bold text-[11px] tracking-wider uppercase disabled:opacity-30 disabled:pointer-events-none hover:bg-[#1ebe57] transition-colors"
                                >
                                    <MessageCircle size={13} />
                                    {copy.cta} · WhatsApp
                                    <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                                </button>

                                {/* Secondary CTAs: Email + Copy */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={sendEmail}
                                        disabled={!validate()}
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-white/15 hover:border-white/35 text-white/65 hover:text-white text-[10px] font-bold tracking-wider uppercase disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                    >
                                        <Mail size={11} />
                                        {isEs ? "Correo" : "Email"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={copyToClipboard}
                                        disabled={!validate()}
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-white/15 hover:border-white/35 text-white/65 hover:text-white text-[10px] font-bold tracking-wider uppercase disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                    >
                                        <Copy size={11} />
                                        {isEs ? "Copiar" : "Copy"}
                                    </button>
                                </div>
                            </form>

                            {/* Footer note */}
                            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-[10px] text-gray-500">
                                <MessageCircle size={10} className="text-[#25D366]/70" />
                                <span>{isEs ? "WhatsApp se abre al instante. No requiere llenar el formulario." : "WhatsApp opens instantly. Completing the form is optional."}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function Field({
    label, value, onChange, placeholder, type = "text", required, inputRef,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    type?: string;
    required?: boolean;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
    return (
        <div>
            <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
            <input
                ref={inputRef}
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full bg-[#050507] border border-white/12 hover:border-white/25 focus:border-[#00f0ff]/60 px-3 py-2 text-[12px] text-white placeholder:text-gray-600 outline-none transition-colors font-mono"
            />
        </div>
    );
}

// ─── Convenience hook ────────────────────────────────────────────
export function useDemoRequest() {
    const [open, setOpen] = useState(false);
    const [context, setContext] = useState<DemoRequestContext>("feature-locked");
    const [extraInfo, setExtraInfo] = useState<string | undefined>(undefined);

    const request = (ctx: DemoRequestContext = "feature-locked", info?: string) => {
        setContext(ctx);
        setExtraInfo(info);
        setOpen(true);
    };

    const close = () => setOpen(false);

    return { open, context, extraInfo, request, close };
}
