import {
  useGetFeaturedProducts,
  useGetPromoProducts,
  useGetTrendingProducts,
  useListCategories,
} from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ShoppingBag, Truck, Tag } from "lucide-react";
import { Link } from "wouter";
import { formatPrice } from "@/lib/format";

export default function Home() {
  const { data: featured, isLoading: loadFeatured } = useGetFeaturedProducts();
  const { data: promos, isLoading: loadPromos } = useGetPromoProducts();
  const { data: trending, isLoading: loadTrending } = useGetTrendingProducts();
  const { data: categories, isLoading: loadCategories } = useListCategories();

  return (
    <div className="pb-8">

      {/* Hero Promo Banner */}
      <div className="bg-primary px-4 pt-3 pb-5">
        <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between border border-white/20">
          <div className="text-white">
            <p className="text-xs text-white/80 font-medium mb-0.5">Promo Spesial</p>
            <h2 className="text-xl font-bold leading-tight mb-2">
              Belanja lengkap<br />bikin happy
            </h2>
            <Link href="/products">
              <span className="bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-full inline-block shadow">
                Belanja Sekarang
              </span>
            </Link>
          </div>
          <div className="flex flex-col gap-2 items-center shrink-0 ml-4">
            <div className="bg-white/20 rounded-xl p-3 flex flex-col items-center justify-center w-[72px] h-[72px]">
              <ShoppingBag size={28} className="text-white mb-1" />
              <span className="text-white text-[9px] font-bold text-center leading-tight">GRATIS ONGKIR</span>
            </div>
            <div className="bg-yellow-400 rounded-lg px-3 py-1.5">
              <span className="text-primary text-[10px] font-black">UP TO 40% OFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Strip */}
      <div className="bg-primary/5 border-b border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Truck size={13} className="text-primary" />
          <span>1-2 Jam Tiba</span>
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-1.5">
          <Tag size={13} className="text-red-500" />
          <span>Promo Setiap Hari</span>
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-1.5">
          <ShoppingBag size={13} className="text-green-600" />
          <span>25.000 Produk</span>
        </div>
      </div>

      {/* Kamu Mungkin Suka */}
      <section className="mt-4">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Kamu Mungkin Suka</h2>
          <Link href="/products" className="text-xs text-primary font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto pb-4 px-4 hide-scrollbar">
          <div className="flex gap-3 w-max">
            {loadFeatured
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-[140px] h-[220px] rounded-xl shrink-0" />
                ))
              : featured?.map((product) => (
                  <ProductCard key={product.id} product={product} horizontal />
                ))}
          </div>
        </div>
      </section>

      {/* Mid Banner — Belanja Lengkap */}
      <div className="mx-4 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#1565C0] to-[#1976D2] p-4 flex items-center gap-4">
          <div className="bg-white/20 rounded-xl p-3 shrink-0">
            <ShoppingBag size={32} className="text-white" />
          </div>
          <div className="text-white flex-1">
            <p className="text-xs text-white/80 font-medium">Hypermart Sarang</p>
            <h3 className="font-bold text-base leading-tight">
              belanja lengkap<br />bikin happy
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <div className="bg-yellow-400 text-primary text-[10px] font-black px-2 py-1 rounded-full mb-1">
              SO EASY
            </div>
            <div className="bg-white/20 text-white text-[9px] px-2 py-0.5 rounded-full">
              Go Anywhere
            </div>
          </div>
        </div>
        <div className="bg-primary/80 px-4 py-1.5 flex items-center justify-between">
          <span className="text-white text-[10px] font-bold">PROMO SPESIAL</span>
          <div className="flex gap-1">
            {["13%", "18%", "20%"].map((d) => (
              <span key={d} className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                -{d}
              </span>
            ))}
          </div>
          <Link href="/products" className="text-yellow-300 text-[10px] font-bold flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={10} />
          </Link>
        </div>
      </div>

      {/* PROMO SPECIAL UP TO 40% */}
      <section className="mt-5 bg-red-50 py-4">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-red-600 flex items-center gap-1.5">
            <span className="bg-red-600 w-1 h-4 rounded-full inline-block" />
            PROMO SPECIAL UP TO 40%
          </h2>
          <Link href="/products" className="text-xs text-red-600 font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto pb-2 px-4 hide-scrollbar">
          <div className="flex gap-3 w-max">
            {loadPromos
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-[140px] h-[220px] rounded-xl shrink-0" />
                ))
              : promos?.map((product) => (
                  <ProductCard key={product.id} product={product} horizontal />
                ))}
          </div>
        </div>
      </section>

      {/* KATEGORI PRODUK */}
      <section className="mt-5 px-4">
        <div className="bg-primary rounded-xl px-4 py-2.5 mb-3">
          <h2 className="text-sm font-bold text-white tracking-wide">KATEGORI PRODUK</h2>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          {loadCategories
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[44px] m-2 rounded-lg" />
              ))
            : categories?.slice(0, 10).map((cat, idx) => (
                <Link key={cat.id} href={`/categories`}>
                  <div
                    className={`flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors ${
                      idx < (categories?.slice(0, 10).length ?? 0) - 1
                        ? "border-b border-border/60"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">({cat.productCount})</span>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
          <Link href="/categories">
            <div className="px-4 py-3 flex items-center justify-center gap-1 text-primary text-xs font-bold border-t border-border/60 bg-blue-50/50">
              Lihat Semua Kategori <ChevronRight size={13} />
            </div>
          </Link>
        </div>
      </section>

      {/* PRODUK REKOMENDASI */}
      <section className="mt-6 px-4">
        <div className="bg-primary rounded-xl px-4 py-2.5 mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-wide">PRODUK REKOMENDASI</h2>
          <Link href="/products" className="text-white/80 text-[10px] font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {loadFeatured
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[240px] rounded-xl" />
              ))
            : featured?.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* PRODUK TERLARIS */}
      <section className="mt-6 px-4">
        <div className="bg-primary rounded-xl px-4 py-2.5 mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-wide">PRODUK TERLARIS</h2>
          <Link href="/products?sort=teratas" className="text-white/80 text-[10px] font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex gap-3 w-max">
            {loadTrending
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-[140px] h-[220px] rounded-xl shrink-0" />
                ))
              : trending?.map((product) => (
                  <ProductCard key={product.id} product={product} horizontal />
                ))}
          </div>
        </div>
      </section>

      {/* Rekomendasi (full grid) */}
      <section className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Rekomendasi</h2>
          <Link href="/products" className="text-xs text-primary font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={12} />
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

      <div className="h-10" />
    </div>
  );
}
