import { useState, useEffect } from "react";
import { Minus, Plus, Zap, Sun, Calendar } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface VariantSheetProps {
  product: any;
  open: boolean;
  onClose: () => void;
  onConfirm: (variantId: number, quantity: number) => void;
  isPending?: boolean;
}

const deliverySlots = [
  { icon: <Zap size={11} className="fill-yellow-400 text-yellow-400" />, label: "1-2 Jam Tiba", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { icon: <Sun size={11} className="text-orange-400" />, label: "Hari Ini", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { icon: <Calendar size={11} className="text-blue-400" />, label: "Besok", color: "bg-blue-50 text-blue-700 border-blue-200" },
];

export function VariantSheet({ product, open, onClose, onConfirm, isPending }: VariantSheetProps) {
  const variants = product.variants ?? [];
  const [selectedId, setSelectedId] = useState<number>(variants[0]?.id ?? 0);
  const [quantity, setQuantity] = useState(1);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Reset when product changes
  useEffect(() => {
    if (variants.length > 0) setSelectedId(variants[0].id);
    setQuantity(1);
  }, [product.id]);

  // Slide-in animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return undefined;
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;

  const selected = variants.find((v: any) => v.id === selectedId);
  const price = selected?.price ?? product.price;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-50 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out max-w-md mx-auto",
          visible ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="px-4 pb-6">
          {/* Product summary */}
          <div className="flex gap-3 py-3 border-b border-border/50">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-contain bg-slate-50 border border-border/40 p-1"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">{product.name}</p>
              <p className="text-base font-black text-foreground mt-1">{formatPrice(price)}</p>
              {selected && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{selected.label}</p>
              )}
            </div>
          </div>

          {/* Variant picker */}
          <div className="mt-3">
            <p className="text-xs font-bold text-foreground mb-2">Pilih varian</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedId(v.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                    selectedId === v.id
                      ? "bg-green-600 text-white border-green-600 shadow-sm"
                      : "bg-white text-foreground border-border hover:border-green-400"
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery slots */}
          <div className="mt-3">
            <p className="text-[11px] text-muted-foreground mb-2 font-medium">Tersedia untuk</p>
            <div className="flex gap-2 flex-wrap">
              {deliverySlots.map((s) => (
                <span
                  key={s.label}
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border",
                    s.color
                  )}
                >
                  {s.icon}
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs font-bold text-foreground">Pilih jumlah</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <Minus size={13} className="text-foreground" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-full border border-green-500 bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Plus size={13} className="text-white" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => onConfirm(selectedId, quantity)}
            disabled={isPending}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-bold text-sm py-3.5 rounded-xl transition-all disabled:opacity-60 shadow-sm"
          >
            {isPending ? "Menambahkan..." : "Tambah Ke Keranjang"}
          </button>
        </div>
      </div>
    </>
  );
}
