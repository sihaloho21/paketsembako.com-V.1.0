import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function Categories() {
  // Static placeholder data for UI development
  const categories: any[] = [];

  return (
    <div className="min-h-full bg-slate-50">
      <div className="bg-white border-b border-border px-4 py-3 sticky top-0 z-10 shadow-sm">
        <h1 className="font-bold text-lg">Kategori Produk</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Tidak ada kategori yang ditemukan
            </div>
          ) : (
            categories.map((category: any) => (
              <Link key={category.id} href={`/products`}>
                <div className="flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="bg-slate-100 rounded-lg w-12 h-12 flex items-center justify-center shrink-0 border border-slate-200">
                    <img src={category.imageUrl} alt={category.name} className="w-8 h-8 object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-0.5">{category.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{category.productCount} Produk</p>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
