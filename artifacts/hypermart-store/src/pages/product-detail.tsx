import { useGetProduct, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useRoute, Link } from "wouter";
import { ChevronLeft, Share2, ShoppingBag, Minus, Plus, Heart, MapPin, Clock } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = Number(params?.id);
  const { data: product, isLoading } = useGetProduct(productId);
  
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const queryClient = useQueryClient();
  const addToCart = useAddToCart();

  if (isLoading) {
    return (
      <div className="min-h-full bg-slate-50 pb-20">
        <div className="h-[350px] w-full bg-white relative">
          <div className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full">
            <ChevronLeft size={24} />
          </div>
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-4 bg-white mt-2">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-6">Maaf, produk yang Anda cari tidak tersedia.</p>
        <Link href="/">
          <div className="bg-primary text-white px-6 py-2 rounded-full font-semibold">
            Kembali ke Beranda
          </div>
        </Link>
      </div>
    );
  }

  // Set initial variant if available
  if (product.variants && product.variants.length > 0 && selectedVariant === null) {
    setSelectedVariant(product.variants[0].id);
  }

  const activePrice = selectedVariant 
    ? product.variants?.find(v => v.id === selectedVariant)?.price || product.price
    : product.price;

  const handleAdd = () => {
    addToCart.mutate(
      { 
        data: { 
          productId: product.id, 
          quantity,
          variantId: selectedVariant 
        } 
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success("Ditambahkan ke keranjang", {
            description: `${quantity}x ${product.name}`,
          });
          setQuantity(1);
        }
      }
    );
  };

  return (
    <div className="min-h-full bg-slate-50 pb-24">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between max-w-[430px] mx-auto pointer-events-none">
        <Link href="~/" onClick={() => window.history.back()}>
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm pointer-events-auto cursor-pointer hover:bg-white transition-colors">
            <ChevronLeft size={24} />
          </div>
        </Link>
        <div className="flex gap-2 pointer-events-auto">
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm cursor-pointer hover:bg-white transition-colors">
            <Share2 size={20} />
          </div>
          <Link href="/">
            <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm cursor-pointer hover:bg-white transition-colors">
              <ShoppingBag size={20} />
            </div>
          </Link>
        </div>
      </div>

      {/* Images Carousel */}
      <div className="bg-white relative">
        <div className="aspect-square w-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-8"
          />
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-primary/30" />
          <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
      </div>

      {/* Variants — directly below image */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-white border-t border-border px-4 pt-3 pb-3">
          <div className="flex items-end gap-2 overflow-x-auto hide-scrollbar pb-1">
            {product.variants.map((v) => {
              const isSelected = selectedVariant === v.id;
              const isLowest = product.variants
                ? v.price === Math.min(...product.variants.map((x) => x.price))
                : false;
              const showPromoBadge = isSelected && !!product.discountPercent;
              const showBestBadge = isLowest && !isSelected;
              return (
                <div key={v.id} className="flex flex-col items-center flex-shrink-0">
                  {/* Badge row — always takes space to keep alignment */}
                  <div className="h-5 flex items-center justify-center mb-1">
                    {showPromoBadge && (
                      <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap leading-none">
                        Promo {formatPrice(v.price)}
                      </span>
                    )}
                    {showBestBadge && (
                      <span className="bg-[#16A34A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap leading-none">
                        Harga Terbaik
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedVariant(v.id)}
                    className={cn(
                      "px-4 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap",
                      isSelected
                        ? "border-[#16A34A] bg-white text-foreground"
                        : "border-border bg-white text-foreground hover:bg-slate-50"
                    )}
                  >
                    {v.label}
                  </button>
                </div>
              );
            })}
          </div>
          <button className="mt-2 text-xs text-primary font-medium flex items-center gap-0.5">
            Pilihan Lainnya
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Main Info */}
      <div className="bg-white p-4 mb-2 shadow-sm border-b border-border">
        {product.discountPercent && (
          <div className="flex gap-2 mb-2">
            <Badge variant="destructive" className="rounded-sm font-bold px-1.5 py-0">
              {product.badge || `-${product.discountPercent}%`}
            </Badge>
            <Badge variant="secondary" className="bg-[#16A34A] text-white hover:bg-[#16A34A]/90 rounded-sm font-bold px-1.5 py-0 border-0">
              Harga Terbaik
            </Badge>
          </div>
        )}

        <h1 className="text-lg font-medium leading-snug mb-2 text-foreground">
          {product.name}
        </h1>

        {product.originalPrice && (
          <div className="text-sm text-muted-foreground line-through decoration-red-500 mb-1">
            {formatPrice(product.originalPrice)}
          </div>
        )}
        <div className="text-2xl font-bold text-foreground mb-3">
          {formatPrice(activePrice)}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 font-bold">★</span>
            <span className="text-foreground font-medium">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div>{product.sold} Terjual</div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <MapPin size={16} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Dikirim dari</div>
              <div className="text-sm font-medium">Hypermart Sarang</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-[#16A34A]">
            <Clock size={16} />
            <span>{product.deliveryInfo}</span>
          </div>
        </div>
      </div>

      {/* Product Info Accordion Alternative */}
      <div className="bg-white p-4 mb-2 shadow-sm border-y border-border">
        <h3 className="font-bold text-base mb-3 border-b border-border pb-2">Informasi Produk</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex">
            <div className="w-1/3 text-sm text-muted-foreground">Kategori</div>
            <div className="w-2/3 text-sm font-medium text-primary">{product.categoryName}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 text-sm text-muted-foreground">Masa Simpan</div>
            <div className="w-2/3 text-sm font-medium">{product.shelfLife}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 text-sm text-muted-foreground">Kondisi</div>
            <div className="w-2/3 text-sm font-medium"><Badge variant="outline" className="font-normal">Konvensional</Badge></div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {product.description}
        </div>
        <button className="text-sm font-medium text-primary mt-2 flex items-center">
          Baca Selengkapnya <ChevronLeft size={14} className="rotate-270 ml-1" />
        </button>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="bg-white py-4 shadow-sm border-t border-border">
          <div className="px-4 mb-3">
            <h3 className="font-bold text-base">Yang lain beli ini juga!</h3>
          </div>
          <div className="overflow-x-auto pb-4 px-4 hide-scrollbar">
            <div className="flex gap-3 w-max">
              {product.relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} horizontal />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border px-4 py-3 flex items-center gap-3 max-w-[430px] mx-auto pb-safe">
        <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-slate-50 transition-colors shrink-0">
          <Heart size={24} />
        </button>
        
        <div className="flex items-center justify-between border border-border rounded-xl px-2 h-12 bg-white shrink-0 w-[110px]">
          <button 
            className="w-8 h-8 flex items-center justify-center text-primary disabled:opacity-30 transition-opacity"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus size={18} />
          </button>
          <span className="font-semibold text-sm w-6 text-center">{quantity}</span>
          <button 
            className="w-8 h-8 flex items-center justify-center text-primary transition-opacity"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus size={18} />
          </button>
        </div>
        
        <button 
          className="flex-1 h-12 bg-[#16A34A] text-white rounded-xl font-bold text-sm shadow-sm hover:bg-[#15803D] active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
          onClick={handleAdd}
          disabled={addToCart.isPending}
        >
          {addToCart.isPending ? "Memproses..." : "+ Tambah Produk"}
        </button>
      </div>
    </div>
  );
}
