import { Link, useLocation } from "wouter";
import { Search, ChevronDown, Sprout, Coins, Ticket, UserCircle2 } from "lucide-react";
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
  const isDetail = location.startsWith("/product/");
  const isHidden = isDetail || location === "/account" || location === "/poin" || location === "/level";

  if (isHidden) return null;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm overflow-hidden">
      {/* Top search bar — always visible */}
      <div className="bg-white px-3 py-2 flex items-center gap-2 border-b border-border/40">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground font-medium">Hypermart Sarang</span>
        </div>
        <div className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-sm tracking-wider shrink-0">
          HON
        </div>
      </div>

      {/* User / store profile strip — collapses when scrolled */}
      <div
        className={cn(
          "bg-primary px-3 flex items-center gap-2 transition-all duration-300 ease-in-out overflow-hidden",
          scrolled ? "max-h-0 py-0 opacity-0" : "max-h-[60px] py-2.5 opacity-100"
        )}
      >
        {/* Clickable avatar + name → /account */}
        <Link href="/account" className="flex items-center gap-2 flex-1 min-w-0">
          <div
            data-testid="avatar-user"
            className="w-9 h-9 rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
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

        {/* Icon action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/level">
            <div data-testid="icon-level" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95">
              <Sprout size={17} className="text-white" />
            </div>
          </Link>
          <Link href="/poin">
            <div data-testid="icon-poin" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95">
              <Coins size={17} className="text-white" />
            </div>
          </Link>
          <button data-testid="icon-voucher" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95">
            <Ticket size={17} className="text-white" />
          </button>
          <Link href="/account">
            <div data-testid="icon-akun" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95">
              <UserCircle2 size={17} className="text-white" />
            </div>
          </Link>
        </div>
      </div>

      {/* Toko / Produk / Kategori tabs — always visible */}
      <div className="bg-white border-b border-border flex">
        {tabs.map((tab) => {
          const isActive =
            tab.path === "/"
              ? location === "/"
              : location.startsWith(tab.path);

          return (
            <Link key={tab.path} href={tab.path} className="flex-1">
              <div
                className={cn(
                  "relative flex items-center justify-center gap-1 py-2.5 text-[13px] font-semibold transition-colors",
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                )}
              >
                {tab.name}
                {tab.isNew && (
                  <span className="bg-red-500 text-white text-[8px] font-black px-1 py-0.5 rounded-sm leading-none">
                    NEW
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
