import {
  useGetFeaturedProducts,
  useGetPromoProducts,
  useGetTrendingProducts,
} from "@/hooks/use-gas-api";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Flame, Zap, Tag } from "lucide-react";
import { Link } from "wouter";

const quickCats = [
  { emoji: "🥩", label: "Daging" },
  { emoji: "🥦", label: "Sayur" },
  { emoji: "🍎", label: "Buah" },
  { emoji: "🥛", label: "Susu" },
  { emoji: "🍜", label: "Mie & Pasta" },
  { emoji: "🧴", label: "Perawatan" },
  { emoji: "🧹", label: "Kebersihan" },
  { emoji: "🍪", label: "Snack" },
];

export default function Home() {
  const { data: featured, isLoading: loadFeatured } = useGetFeaturedProducts();
  const { data: promos, isLoading: loadPromos } = useGetPromoProducts();
  const { data: trending, isLoading: loadTrending } = useGetTrendingProducts();

  return (
    <div className="bg-slate-100 pb-24">

      {/* ── 1. HERO PROMO BANNER ── */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(120deg, #1a56db 0%, #0ea5e9 60%, #38bdf8 100%)" }}>
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 right-12 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-yellow-400/80" />

          <div className="relative px-5 py-5 flex items-center justify-between">
            <div>
              <span className="inline-block bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-0.5 rounded-full mb-2 tracking-wider uppercase">
                🔥 Promo Hari Ini
              </span>
              <h1 className="text-white text-2xl font-black leading-tight">
                UP TO<br />
                <span className="text-yellow-300">40% OFF</span>
              </h1>
              <p className="text-white/80 text-[11px] mt-1 mb-3">Belanja hemat setiap hari!</p>
              <Link href="/products">
                <span className="inline-flex items-center gap-1 bg-white text-primary text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm hover:bg-yellow-50 transition-colors">
                  Belanja Sekarang <ChevronRight size={12} />
                </span>
              </Link>
            </div>
            {/* Illustration */}
            <div className="flex flex-col items-center gap-0.5 shrink-0">
              <div className="text-5xl drop-shadow-lg">🛒</div>
              <div className="flex gap-1 mt-1">
                {["🥕","🍊","🥬"].map((e, i) => (
                  <span key={i} className="text-lg">{e}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. QUICK CATEGORY ICONS ── */}
      <div className="bg-white mb-2 py-3">
        <div className="overflow-x-auto px-3 hide-scrollbar">
          <div className="flex gap-4 w-max">
            {quickCats.map((c) => (
              <Link key={c.label} href="/categories">
                <div className="flex flex-col items-center gap-1.5 w-14">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl shadow-sm border border-blue-100 hover:bg-blue-100 transition-colors">
                    {c.emoji}
                  </div>
                  <span className="text-[10px] font-medium text-foreground/80 text-center leading-tight">{c.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. PROMO SPECIAL UP TO 40% ── */}
      <section className="bg-white mb-2">
        <div className="px-3 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center">
              <Tag size={13} className="text-white" />
            </div>
            <h2 className="text-[13px] font-bold text-foreground">PROMO SPECIAL UP TO 40%</h2>
          </div>
          <Link href="/products" className="text-[11px] text-primary font-semibold flex items-center gap-0.5 hover:underline">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="overflow-x-auto pb-3 px-3 hide-scrollbar">
          <div className="flex gap-2.5 w-max">
            {loadPromos
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-[130px] h-[210px] rounded-xl shrink-0" />
                ))
              : promos?.map((product: any) => (
                  <ProductCard key={product.id} product={product} horizontal />
                ))}
          </div>
        </div>
      </section>

      {/* ── 4. PRODUK TERLARIS (horizontal) ── */}
      <section className="bg-white mb-2">
        <div className="px-3 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center">
              <Flame size={13} className="text-white" />
            </div>
            <h2 className="text-[13px] font-bold text-foreground">PRODUK TERLARIS</h2>
          </div>
          <Link href="/products" className="text-[11px] text-primary font-semibold flex items-center gap-0.5 hover:underline">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="overflow-x-auto pb-3 px-3 hide-scrollbar">
          <div className="flex gap-2.5 w-max">
            {loadTrending
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-[130px] h-[210px] rounded-xl shrink-0" />
                ))
              : trending?.map((product: any) => (
                  <ProductCard key={product.id} product={product} horizontal />
                ))}
          </div>
        </div>
      </section>

      {/* ── 5. PRODUK REKOMENDASI (grid) ── */}
      <section className="mb-2">
        <div className="px-3 py-2.5 flex items-center justify-between bg-white border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <h2 className="text-[13px] font-bold text-foreground">PRODUK REKOMENDASI</h2>
          </div>
          <Link href="/products" className="text-[11px] text-primary font-semibold flex items-center gap-0.5 hover:underline">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="bg-white px-3 pt-3 pb-3">
          <div className="grid grid-cols-2 gap-3">
            {loadFeatured
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[240px] rounded-xl" />
                ))
              : featured?.slice(0, 6).map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* ── 6. Kamu Mungkin Suka ── */}
      <section className="bg-white mb-2">
        <div className="px-3 pt-3 pb-2 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-foreground">Kamu Mungkin Suka</h2>
          <Link href="/products" className="text-[11px] text-primary font-semibold flex items-center gap-0.5 hover:underline">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="overflow-x-auto pb-3 px-3 hide-scrollbar">
          <div className="flex gap-2.5 w-max">
            {loadFeatured
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-[130px] h-[210px] rounded-xl shrink-0" />
                ))
              : featured?.map((product: any) => (
                  <ProductCard key={product.id} product={product} horizontal />
                ))}
          </div>
        </div>
      </section>

      {/* ── 8. Semua Produk grid ── */}
      <section className="bg-white px-3 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-bold text-foreground">Semua Produk</h2>
          <Link href="/products" className="text-[11px] text-primary font-semibold flex items-center gap-0.5 hover:underline">
            Lihat Semua <ChevronRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {loadTrending
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[240px] rounded-xl" />
              ))
            : trending?.slice(0, 8).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

    </div>
  );
}
