import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SortOption = "popular" | "terbaru" | "teratas" | "harga";

export default function Products() {
  const [sort, setSort] = useState<SortOption>("popular");
  
  const { data: products, isLoading } = useListProducts({ sort });

  const tabs: { label: string, value: SortOption }[] = [
    { label: "Populer", value: "popular" },
    { label: "Terbaru", value: "terbaru" },
    { label: "Teratas", value: "teratas" },
    { label: "Harga", value: "harga" },
  ];

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <div className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
        <div className="flex overflow-x-auto hide-scrollbar px-2 py-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSort(tab.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                sort === tab.value 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-3">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[240px] rounded-xl" />
            ))
          ) : (
            products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        
        {!isLoading && products?.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Tidak ada produk yang ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
