import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { formatPrice } from "@/lib/format";
import { Link } from "wouter";
import { Plus, Star } from "lucide-react";
import { useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  horizontal?: boolean;
}

export function ProductCard({ product, className, horizontal }: ProductCardProps) {
  const queryClient = useQueryClient();
  const addToCart = useAddToCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success("Ditambahkan ke keranjang", {
            description: product.name,
            duration: 2000,
          });
        }
      }
    );
  };

  return (
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
        <button 
          onClick={handleAdd}
          disabled={addToCart.isPending}
          className="absolute bottom-2 right-2 bg-[#16A34A] text-white rounded-full p-1.5 shadow-sm hover:bg-[#15803D] active:scale-95 transition-all disabled:opacity-50"
          aria-label="Add to cart"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>
    </Link>
  );
}
