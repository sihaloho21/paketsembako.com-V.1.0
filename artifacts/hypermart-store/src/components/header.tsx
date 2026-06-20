import { Link, useLocation } from "wouter";
import { Search, MapPin, ChevronDown, Bell, User } from "lucide-react";
import { Badge } from "./ui/badge";

export function Header() {
  const [location] = useLocation();

  // The blue header is shared, but we might adjust content based on route
  const isDetail = location.startsWith("/product/");

  if (isDetail) {
    return null; // Product detail has its own transparent/back header
  }

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-40 px-4 pt-4 pb-3 flex flex-col gap-3 rounded-b-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-full">
            <User size={18} className="text-white" />
          </div>
          <div>
            <div className="text-xs text-white/80 font-medium">Hypermart Sarang</div>
            <div className="flex items-center text-sm font-bold">
              <span className="truncate max-w-[150px]">Kirim ke Alamat Utama</span>
              <ChevronDown size={14} className="ml-1" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0 shadow-none font-bold text-xs py-1 px-2 rounded-full">
            1.2K Pts
          </Badge>
          <Bell size={20} />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input 
          type="search" 
          placeholder="Cari produk disini..." 
          className="w-full bg-white rounded-full py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner"
        />
      </div>
    </header>
  );
}
