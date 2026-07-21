import Image from "next/image";
import { Check, CircleDollarSign, PackageCheck, ShoppingCart, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AIScenario, Part } from "@/lib/mock-data";
import type { Locale } from "@/i18n/types";

type Props = { scenario: AIScenario; parts: Part[]; locale: Locale; onAddAll: () => void; onRequestMissing: () => void };

export default function PurchaseView({ scenario, parts, locale, onAddAll, onRequestMissing }: Props) {
  const isEs = locale === "es";
  const copy = isEs
    ? { title: "Compra del proyecto", subtitle: "Lista de materiales y disponibilidad para construir el prototipo.", available: "Disponibles", unavailable: "Con faltantes", part: "Componente", qty: "Cant.", stock: "Stock", subtotal: "Subtotal", hardware: "Componentes electrónicos", extras: "Chasis y consumibles estimados", total: "Costo estimado del proyecto", add: "Añadir proyecto al carrito", request: "Solicitar piezas faltantes", inStock: "Disponible" }
    : { title: "Project purchase", subtitle: "Bill of materials and availability for building the prototype.", available: "Available", unavailable: "Missing items", part: "Component", qty: "Qty.", stock: "Stock", subtotal: "Subtotal", hardware: "Electronic components", extras: "Estimated chassis and consumables", total: "Estimated project cost", add: "Add project to cart", request: "Request missing parts", inStock: "In stock" };

  const items = Array.from(parts.reduce<Map<string, { part: Part; quantity: number }>>((map, part) => {
    const current = map.get(part.id);
    map.set(part.id, { part, quantity: (current?.quantity ?? 0) + 1 });
    return map;
  }, new Map()).values());
  const hardwareSubtotal = parts.reduce((sum, part) => sum + part.price, 0);
  const estimatedExtras = Math.max(0, scenario.overview.cost - hardwareSubtotal);
  const availableUnits = items.reduce((sum, item) => sum + (item.part.stock >= item.quantity ? item.quantity : 0), 0);
  const allAvailable = availableUnits === parts.length;

  return (
    <div className="h-full overflow-y-auto bg-[#09090c] custom-scrollbar">
      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-7">
        <header className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#00f0ff]"><ShoppingCart size={14} /><span className="text-[9px] font-bold uppercase tracking-[0.16em]">{scenario.projectName}</span></div>
            <h2 className="text-2xl font-bold text-white">{copy.title}</h2>
            <p className="mt-2 max-w-xl text-xs leading-5 text-gray-400">{copy.subtitle}</p>
          </div>
          <div className={`flex shrink-0 items-center gap-2 text-[10px] ${allAvailable ? "text-[#39ff14]" : "text-amber-400"}`}>
            {allAvailable ? <PackageCheck size={15} /> : <TriangleAlert size={15} />}
            <span>{availableUnits}/{parts.length} {allAvailable ? copy.available : copy.unavailable}</span>
          </div>
        </header>

        <section className="border border-white/10 bg-[#0d0d11]">
          <div className="grid grid-cols-[1fr_42px_64px_72px] gap-2 border-b border-white/10 px-3 py-2 text-[8px] font-bold uppercase tracking-widest text-gray-600 sm:grid-cols-[1fr_54px_80px_86px]">
            <span>{copy.part}</span><span>{copy.qty}</span><span>{copy.stock}</span><span className="text-right">{copy.subtotal}</span>
          </div>
          <div className="divide-y divide-white/[0.07]">
            {items.map(({ part, quantity }) => {
              const isAvailable = part.stock >= quantity;
              return (
                <div key={part.id} className="grid grid-cols-[1fr_42px_64px_72px] items-center gap-2 px-3 py-3 sm:grid-cols-[1fr_54px_80px_86px]">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-white"><Image src={part.image} alt={part.name} fill sizes="40px" className="object-contain p-1" /></div>
                    <div className="min-w-0"><p className="truncate text-[11px] font-bold text-gray-200">{part.name}</p><p className="mt-0.5 truncate text-[8px] uppercase text-gray-600">{part.category} · ${part.price.toFixed(2)} c/u</p></div>
                  </div>
                  <span className="text-xs text-gray-300">×{quantity}</span>
                  <span className={`flex items-center gap-1 text-[9px] ${isAvailable ? "text-[#39ff14]" : "text-amber-400"}`}>{isAvailable && <Check size={10} />}<span className="hidden sm:inline">{isAvailable ? copy.inStock : part.stock}</span></span>
                  <span className="text-right text-xs font-bold text-white">${(part.price * quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-5 border-t border-white/10 pt-4">
          <div className="ml-auto max-w-sm space-y-2 text-xs">
            <div className="flex justify-between text-gray-400"><span>{copy.hardware}</span><span>${hardwareSubtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-400"><span>{copy.extras}</span><span>${estimatedExtras.toFixed(2)}</span></div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3"><span className="flex items-center gap-2 font-bold text-white"><CircleDollarSign size={14} className="text-[#39ff14]" />{copy.total}</span><span className="text-xl font-bold text-[#39ff14]">${scenario.overview.cost.toFixed(2)}</span></div>
          </div>
        </section>

        <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
          <Button variant="orange" size="lg" className="font-mono font-bold" onClick={onAddAll}>{copy.add}</Button>
          <Button variant="outline" size="lg" onClick={onRequestMissing}>{copy.request}</Button>
        </div>
      </div>
    </div>
  );
}
