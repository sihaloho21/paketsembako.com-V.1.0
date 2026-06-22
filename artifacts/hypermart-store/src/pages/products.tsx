import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowDown, ArrowUp, TrendingUp, Clock, Flame } from "lucide-react";

type MainTab = "popular" | "terbaru" | "teratas" | "harga";
type PriceDir = "harga-asc" | "harga-desc";

export default function Products() {
  const [activeTab, setActiveTab] = useState<MainTab>("popular");
  const [priceDir, setPriceDir] = useState<PriceDir>("harga-asc");

  const sortParam = activeTab === "harga" ? priceDir : activeTab;

  const { data: products, isLoading } = useListProducts({ sort: sortParam });

  const tabs: { label: string; value: MainTab; icon: React.ReactNode }[] = [
    { label: "Populer", value: "popular", icon: <Flame size={13} /> },
    { label: "Terbaru", value: "terbaru", icon: <Clock size={13} /> },
    { label: "Teratas", value: "teratas", icon: <TrendingUp size={13} /> },
    { label: "Harga", value: "harga", icon: <ArrowUpDown size={13} /> },
  ];

  return (
    <div className="min-h-full bg-slate-100 flex flex-col">
      {/* ── Tab bar ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
        <div className="flex overflow-x-auto hide-scrollbar px-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className={cn(isActive ? "text-primary" : "text-muted-foreground/70")}>
                  {tab.icon}
                </span>
                {tab.label}
                {/* Active underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Price direction chips — only visible when Harga is active ── */}
        {activeTab === "harga" && (
          <div className="flex gap-2 px-3 py-2 bg-slate-50 border-t border-border/50">
            <button
              onClick={() => setPriceDir("harga-asc")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                priceDir === "harga-asc"
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              <ArrowUp size={12} />
              Termurah
            </button>
            <button
              onClick={() => setPriceDir("harga-desc")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                priceDir === "harga-desc"
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              <ArrowDown size={12} />
              Termahal
            </button>
          </div>
        )}
      </div>

      {/* ── Result count ── */}
      {!isLoading && products && (
        <div className="px-4 pt-3 pb-1 text-xs text-muted-foreground">
          {products.length} produk ditemukan
        </div>
      )}

      {/* ── Product grid ── */}
      <div className="flex-1 px-3 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[240px] rounded-xl" />
              ))
            : products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {!isLoading && products?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            Tidak ada produk yang ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
