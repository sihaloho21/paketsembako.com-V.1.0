import { useGetFeaturedProducts, useGetPromoProducts, useGetTrendingProducts } from "@/hooks/use-gas-api";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Zap, TrendingUp, Star } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: featured, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: promo, isLoading: loadingPromo } = useGetPromoProducts();
  const { data: trending, isLoading: loadingTrending } = useGetTrendingProducts();

  const LoadingSection = () => (
    <div className="flex gap-3 overflow-x-auto pb-4 px-4 hide-scrollbar">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-[140px] shrink-0">
          <Skeleton className="aspect-square w-full rounded-xl mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-full bg-slate-50 pb-8">
      {/* Hero Banner */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-primary to-green-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-1">Paket Sembako</h2>
            <p className="text-sm opacity-90 font-medium">Belanja harian jadi lebih mudah & hemat!</p>
            <Link href="/products">
              <button className="mt-4 bg-white text-primary px-6 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform">
                Belanja Sekarang
              </button>
            </Link>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
            <Zap size={120} />
          </div>
        </div>
      </div>

      {/* Promo Section */}
      <section className="bg-white py-4 mb-2 shadow-sm">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-1.5 rounded-lg">
              <Zap size={18} className="text-red-600 fill-red-600" />
            </div>
            <h3 className="font-black text-base">Lagi Promo Nih!</h3>
          </div>
          <Link href="/products?isPromo=true">
            <div className="text-xs font-bold text-primary flex items-center gap-0.5">
              Lihat Semua <ChevronRight size={14} />
            </div>
          </Link>
        </div>
        {loadingPromo ? <LoadingSection /> : (
          <div className="flex gap-3 overflow-x-auto pb-4 px-4 hide-scrollbar">
            {promo?.map((p: any) => (
              <ProductCard key={p.id} product={p} horizontal />
            ))}
          </div>
        )}
      </section>

      {/* Trending Section */}
      <section className="bg-white py-4 mb-2 shadow-sm">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-1.5 rounded-lg">
              <TrendingUp size={18} className="text-orange-600" />
            </div>
            <h3 className="font-black text-base">Paling Laris</h3>
          </div>
          <Link href="/products?sort=teratas">
            <div className="text-xs font-bold text-primary flex items-center gap-0.5">
              Lihat Semua <ChevronRight size={14} />
            </div>
          </Link>
        </div>
        {loadingTrending ? <LoadingSection /> : (
          <div className="flex gap-3 overflow-x-auto pb-4 px-4 hide-scrollbar">
            {trending?.map((p: any) => (
              <ProductCard key={p.id} product={p} horizontal />
            ))}
          </div>
        )}
      </section>

      {/* Featured Grid */}
      <section className="px-4 py-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-blue-100 p-1.5 rounded-lg">
            <Star size={18} className="text-blue-600 fill-blue-600" />
          </div>
          <h3 className="font-black text-base">Rekomendasi Untukmu</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {loadingFeatured ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[220px] rounded-xl" />
            ))
          ) : (
            featured?.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
