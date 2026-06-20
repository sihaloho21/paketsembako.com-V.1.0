import { 
  useGetFeaturedProducts, 
  useGetPromoProducts, 
  useGetTrendingProducts,
  useListCategories 
} from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import bannerImg from "@assets/gambar_1_1781949704212.png";
import heroBanner from "@assets/gambar_2_1781949704212.png";

export default function Home() {
  const { data: featured, isLoading: loadFeatured } = useGetFeaturedProducts();
  const { data: promos, isLoading: loadPromos } = useGetPromoProducts();
  const { data: trending, isLoading: loadTrending } = useGetTrendingProducts();
  const { data: categories, isLoading: loadCategories } = useListCategories();

  return (
    <div className="pb-8">
      {/* Banner */}
      <div className="px-4 py-3">
        <div className="rounded-xl overflow-hidden shadow-sm border border-border">
          <img src={heroBanner} alt="Promo Banner" className="w-full h-auto object-cover" />
        </div>
      </div>

      {/* Kamu Mungkin Suka */}
      <section className="mt-2">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Kamu Mungkin Suka</h2>
        </div>
        <div className="overflow-x-auto pb-4 px-4 hide-scrollbar">
          <div className="flex gap-3 w-max">
            {loadFeatured ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-[140px] h-[220px] rounded-xl shrink-0" />
              ))
            ) : (
              featured?.map((product) => (
                <ProductCard key={product.id} product={product} horizontal />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Mid Banner */}
      <div className="px-4 py-2">
        <div className="rounded-xl overflow-hidden bg-primary shadow-sm relative h-[100px] flex items-center justify-between px-6">
          <div className="text-white z-10 w-2/3">
            <h3 className="font-bold text-lg leading-tight mb-1">Belanja lengkap<br/>bikin happy</h3>
            <div className="bg-white text-primary text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">Cek Sekarang</div>
          </div>
          <img src={bannerImg} alt="Decoration" className="absolute right-0 top-0 bottom-0 w-1/2 object-cover opacity-50 mix-blend-overlay" />
        </div>
      </div>

      {/* PROMO SPECIAL */}
      <section className="mt-4 bg-red-50/50 py-4">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-red-600 flex items-center gap-1">
            <span className="bg-red-600 w-1.5 h-4 rounded-full inline-block"></span>
            PROMO SPECIAL UP TO 40%
          </h2>
          <Link href="/products" className="text-xs text-red-600 font-medium">Lihat Semua</Link>
        </div>
        <div className="overflow-x-auto pb-2 px-4 hide-scrollbar">
          <div className="flex gap-3 w-max">
            {loadPromos ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-[140px] h-[220px] rounded-xl shrink-0" />
              ))
            ) : (
              promos?.map((product) => (
                <ProductCard key={product.id} product={product} horizontal />
              ))
            )}
          </div>
        </div>
      </section>

      {/* KATEGORI PRODUK */}
      <section className="mt-6 px-4">
        <h2 className="text-base font-bold text-primary mb-3">KATEGORI PRODUK</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {loadCategories ? (
             Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[60px] rounded-lg" />
            ))
          ) : (
            categories?.slice(0, 6).map((cat) => (
              <Link key={cat.id} href={`/categories`}>
                <div className="bg-white border border-border rounded-lg p-2.5 flex items-center gap-3 shadow-sm hover:border-primary/30 transition-colors">
                  <div className="bg-slate-50 rounded-md w-10 h-10 flex items-center justify-center shrink-0">
                    <img src={cat.imageUrl} alt={cat.name} className="w-8 h-8 object-contain" />
                  </div>
                  <span className="text-xs font-semibold leading-tight">{cat.name}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* PRODUK REKOMENDASI */}
      <section className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-primary">PRODUK REKOMENDASI</h2>
          <Link href="/products" className="text-xs font-medium text-primary flex items-center">
            Semua <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {loadTrending ? (
             Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[240px] rounded-xl" />
            ))
          ) : (
            trending?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
      
      {/* Footer spacing */}
      <div className="h-10" />
    </div>
  );
}
