import { Link, useLocation } from "wouter";
import { Search, ChevronDown, Sprout, Coins, Ticket, UserCircle2, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Toko", path: "/" },
  { name: "Produk", path: "/products", isNew: true },
  { name: "Kategori", path: "/categories" },
];

interface HeaderProps {
  scrolled?: boolean;
}

export function Header({ scrolled = false }: HeaderProps) {
  const [location] = useLocation();
  
  const isHome = location === "/";
  const isDetail = location.startsWith("/product/");
  const isCheckout = location === "/checkout";
  const isAccount = ["/account", "/poin", "/level", "/voucher"].includes(location);

  // Define page titles for sub-pages
  const getPageTitle = () => {
    if (location === "/account") return "Akun";
    if (location === "/poin") return "Hypermart Poin";
    if (location === "/level") return "Level Member";
    if (location === "/voucher") return "Voucher Aktif";
    if (location === "/checkout") return "Checkout";
    if (isDetail) return "Detail Produk";
    return null;
  };

  const title = getPageTitle();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm overflow-hidden">
      {/* Sub-page Header with Back Button */}
      {title && (
        <div className="bg-white flex items-center gap-3 px-4 py-3 border-b border-border">
          <button
            onClick={() => window.history.back()}
            className="p-1 -ml-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={22} className="text-foreground" />
          </button>
          <span className="text-base font-bold text-foreground">{title}</span>
        </div>
      )}

      {/* Main App Header - Hidden on sub-pages to avoid double header */}
      {!title && (
        <>
          {/* Top search bar */}
          <div className="bg-white px-3 py-2 flex items-center gap-2 border-b border-border/40">
            <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5">
              <Search size={14} className="text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground font-medium">Hypermart Sarang</span>
            </div>
            <div className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-sm tracking-wider shrink-0">
              HON
            </div>
          </div>

          {/* User / store profile strip */}
          <div
            className={cn(
              "bg-primary px-3 flex items-center gap-2 transition-all duration-300 ease-in-out overflow-hidden",
              scrolled ? "max-h-0 py-0 opacity-0" : "max-h-[60px] py-2.5 opacity-100"
            )}
          >
            <Link href="/account" className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center shrink-0 active:scale-95 transition-transform">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-sm leading-tight">User A</span>
                  <ChevronDown size={13} className="text-white/80" />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                  <span className="text-white/90 text-[10px] font-semibold">25.000 Point</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <Link href="/level">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95">
                  <Sprout size={17} className="text-white" />
                </div>
              </Link>
              <Link href="/poin">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95">
                  <Coins size={17} className="text-white" />
                </div>
              </Link>
              <Link href="/voucher">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95">
                  <Ticket size={17} className="text-white" />
                </div>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-border flex">
            {tabs.map((tab) => {
              const isActive = tab.path === "/" ? location === "/" : location.startsWith(tab.path);
              return (
                <Link key={tab.path} href={tab.path} className="flex-1">
                  <div className={cn(
                    "relative flex items-center justify-center gap-1 py-2.5 text-[13px] font-semibold transition-colors",
                    isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                  )}>
                    {tab.name}
                    {tab.isNew && (
                      <span className="bg-red-500 text-white text-[8px] font-black px-1 py-0.5 rounded-sm leading-none">NEW</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </header>
  );
}
