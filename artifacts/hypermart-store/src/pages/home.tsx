import {
  useGetFeaturedProducts,
  useGetPromoProducts,
  useGetTrendingProducts,
  useListCategories,
} from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: featured, isLoading: loadFeatured } = useGetFeaturedProducts();
  const { data: promos, isLoading: loadPromos } = useGetPromoProducts();
  const { data: trending, isLoading: loadTrending } = useGetTrendingProducts();
  const { data: categories, isLoading: loadCategories } = useListCategories();

  return (
    <div className="bg-slate-50 pb-24">

      {/* 1. PROMO SPECIAL UP TO 40% */}
      <section className="bg-white mb-2 pb-3">
        <div className="px-3 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-4 bg-primary rounded-full block" />
            <h2 className="text-[13px] font-bold text-foreground">PROMO SPECIAL UP TO 40%</h2>
          </div>
          <Link href="/products" className="text-[11px] text-primary font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="overflow-x-auto pb-1 px-3 hide-scrollbar">
          <div className="flex gap-2 w-max">
            {loadPromos
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-[130px] h-[210px] rounded-xl shrink-0" />
                ))
              : promos?.map((product) => (
                  <ProductCard key={product.id} product={product} horizontal />
                ))}
          </div>
        </div>
      </section>

      {/* 2. PRODUK REKOMENDASI */}
      <section className="mb-2">
        <div className="bg-primary px-3 py-2.5 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-white tracking-wide">PRODUK REKOMENDASI</h2>
          <Link href="/products" className="text-white/80 text-[11px] font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="bg-white px-3 pt-3 pb-3">
          <div className="grid grid-cols-2 gap-3">
            {loadFeatured
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[240px] rounded-xl" />
                ))
              : featured?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 3. Kamu Mungkin Suka */}
      <section className="bg-white mb-2">
        <div className="px-3 pt-3 pb-2 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-foreground">Kamu Mungkin Suka</h2>
          <Link href="/products" className="text-[11px] text-primary font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="overflow-x-auto pb-3 px-3 hide-scrollbar">
          <div className="flex gap-2 w-max">
            {loadFeatured
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-[130px] h-[210px] rounded-xl shrink-0" />
                ))
              : featured?.map((product) => (
                  <ProductCard key={product.id} product={product} horizontal />
                ))}
          </div>
        </div>
      </section>

      {/* 4. Hypermart promo banner */}
      <div className="bg-white mb-2 px-3 py-3">
        <div
          className="rounded-2xl overflow-hidden flex items-stretch"
          style={{ background: "linear-gradient(135deg, #e8f4fd 0%, #b8d9f5 100%)" }}
        >
          <div className="flex-1 p-4 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="bg-primary rounded px-1.5 py-0.5">
                <span className="text-white text-[9px] font-black tracking-wider">hypermart</span>
              </div>
            </div>
            <p className="text-primary text-[15px] font-bold leading-tight">
              belanja lengkap<br />bikin happy
            </p>
          </div>
          <div className="w-[120px] relative bg-primary/10 flex items-end justify-center overflow-hidden">
            <div className="relative mb-0 flex flex-col items-center pb-3">
              <div className="w-9 h-9 bg-[#f5c99a] rounded-full border-2 border-[#e8a96a] mb-1 flex items-center justify-center">
                <div className="w-4 h-2 bg-primary rounded-full mt-2" />
              </div>
              <div className="w-12 h-10 bg-primary rounded-t-xl flex items-center justify-center relative">
                <span className="text-white text-[7px] font-bold text-center leading-tight">SO<br/>EASY</span>
                <div className="absolute -left-3 top-1 w-4 h-2 bg-primary rounded-full" />
                <div className="absolute -right-3 top-1 w-4 h-2 bg-primary rounded-full" />
              </div>
              <div className="w-10 h-8 bg-yellow-400 rounded border-2 border-yellow-500 flex items-center justify-center mt-1">
                <span className="text-primary text-[8px] font-black">Go</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. KATEGORI PRODUK */}
      <section className="mb-2">
        <div className="bg-primary px-3 py-2.5 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-white tracking-wide">KATEGORI PRODUK</h2>
          <Link href="/categories" className="text-white/80 text-[11px] font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="bg-white px-3 pt-2 pb-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-0">
            {loadCategories
              ? Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 mb-1 rounded" />
                ))
              : categories?.slice(0, 14).map((cat) => (
                  <Link key={cat.id} href="/categories">
                    <div className="py-2 border-b border-border/50 text-[12px] font-medium text-foreground hover:text-primary transition-colors leading-tight">
                      {cat.name}
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* 6. PRODUK TERLARIS */}
      <section className="mb-2">
        <div className="bg-primary px-3 py-2.5 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-white tracking-wide">PRODUK TERLARIS</h2>
          <Link href="/products" className="text-white/80 text-[11px] font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="bg-white overflow-x-auto px-3 py-3 hide-scrollbar">
          <div className="flex gap-2 w-max">
            {loadTrending
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-[130px] h-[210px] rounded-xl shrink-0" />
                ))
              : trending?.map((product) => (
                  <ProductCard key={product.id} product={product} horizontal />
                ))}
          </div>
        </div>
      </section>

      {/* 7. Rekomendasi grid */}
      <section className="bg-white px-3 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-bold text-foreground">Rekomendasi</h2>
          <Link href="/products" className="text-[11px] text-primary font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {loadTrending
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[240px] rounded-xl" />
              ))
            : trending?.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

    </div>
  );
}
