import { Link, useLocation } from "wouter";
import { Store, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();
  const isDetail = location.startsWith("/product/");

  if (isDetail) return null;

  const tabs = [
    { name: "Toko", path: "/", icon: Store },
    { name: "Produk", path: "/products", icon: LayoutGrid },
    { name: "Kategori", path: "/categories", icon: List },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-white border-t border-border flex items-center justify-around px-2 pb-safe pt-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location === tab.path || (tab.path === "/products" && location.startsWith("/products")) || (tab.path === "/categories" && location.startsWith("/categories"));
        
        return (
          <Link key={tab.path} href={tab.path} className="flex-1">
            <div className="flex flex-col items-center justify-center w-full py-1 gap-1">
              <Icon 
                size={22} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary fill-primary/10" : "text-muted-foreground"
                )} 
              />
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {tab.name}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
