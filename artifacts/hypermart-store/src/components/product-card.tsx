import { useState, useRef } from "react";
import { formatPrice } from "@/lib/format";
import { Link } from "wouter";
import { Plus, Check, Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { VariantSheet } from "./variant-sheet";

interface ProductCardProps {
  product: any;
  className?: string;
  horizontal?: boolean;
}

export function ProductCard({ product, className, horizontal }: ProductCardProps) {
  const { addToCart } = useCart();

  const [anim, setAnim] = useState<"idle" | "popping" | "done">("idle");
  const [showFloat, setShowFloat] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMultipleVariants = (product.variants?.length ?? 0) > 1;

  const triggerSuccessAnim = () => {
    setAnim("popping");
    setShowFloat(true);
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 500);
    setTimeout(() => setAnim("done"), 420);
    setTimeout(() => setShowFloat(false), 650);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAnim("idle"), 1400);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (anim !== "idle") return;

    if (hasMultipleVariants) {
      setSheetOpen(true);
      return;
    }

    triggerSuccessAnim();
    addToCart(product.id, 1);
  };

  const handleSheetConfirm = (variantId: number, quantity: number) => {
    addToCart(product.id, quantity, variantId);
    setSheetOpen(false);
    triggerSuccessAnim();
  };

  const isDone = anim === "done";

  return (
    <>
      <Link href={`/product/${product.id}`} className="block">
        <div className={cn(
          "bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-border/50 hover:shadow-md transition-shadow relative flex",
          horizontal ? "w-[140px] flex-col shrink-0" : "flex-col h-full",
          className
        )}>
          <div className="relative aspect-square w-full bg-slate-50 p-2 flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-contain h-full w-full mix-blend-multiply"
              loading="lazy"
            />
          </div>

          <div className="p-2.5 flex flex-col flex-grow">
            <h3 className="text-xs font-medium text-foreground line-clamp-2 h-[32px] leading-tight mb-1">
              {product.name}
            </h3>

            <div className="mt-auto">
              {product.originalPrice ? (
                <div className="text-[10px] text-muted-foreground line-through decoration-red-500 decoration-1">
                  {formatPrice(product.originalPrice)}
                </div>
              ) : <div className="h-[15px]" />}

              <div className="text-sm font-bold text-foreground">
                {formatPrice(product.price)}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                  <span className="px-0.5">•</span>
                  <span>{product.sold} terjual</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="absolute bottom-2 right-2">
            {showFloat && (
              <span className="animate-float-up absolute -top-1 left-1/2 -translate-x-1/2 text-[11px] font-black text-green-600 pointer-events-none select-none whitespace-nowrap">
                +1
              </span>
            )}
            {showRipple && (
              <span className="animate-ripple-out absolute inset-0 rounded-full border-2 border-green-400 pointer-events-none" />
            )}
            <button
              onClick={handleAdd}
              className={cn(
                "relative flex items-center justify-center rounded-full p-1.5 shadow-sm transition-colors disabled:opacity-50",
                anim === "popping" && "animate-cart-pop",
                isDone
                  ? "bg-green-100 text-green-600"
                  : "bg-[#16A34A] text-white hover:bg-[#15803D]"
              )}
              aria-label="Add to cart"
            >
              {isDone
                ? <Check size={16} strokeWidth={3} className="text-green-600" />
                : <Plus size={16} strokeWidth={3} />
              }
            </button>
          </div>
        </div>
      </Link>

      {/* Variant bottom sheet — rendered outside the Link */}
      {hasMultipleVariants && (
        <VariantSheet
          product={product}
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onConfirm={handleSheetConfirm}
          isPending={false}
        />
      )}
    </>
  );
}
