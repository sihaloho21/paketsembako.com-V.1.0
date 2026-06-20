import { useGetCart } from "@workspace/api-client-react";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useLocation } from "wouter";

export function CartBar() {
  const { data: cart } = useGetCart();
  const [location] = useLocation();
  
  if (!cart || cart.totalItems === 0) return null;
  if (location.startsWith("/product/")) return null; // Detailed view has its own sticky cart
  
  return (
    <div className="fixed bottom-[70px] left-0 right-0 z-50 px-4 max-w-[430px] mx-auto pointer-events-none">
      <div className="bg-[#16A34A] text-white rounded-xl p-3 flex items-center justify-between shadow-lg pointer-events-auto cursor-pointer hover:bg-[#15803D] transition-colors active:scale-[0.98]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag size={20} />
            <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-[#16A34A]">
              {cart.totalItems}
            </div>
          </div>
          <div>
            <div className="text-xs opacity-90">Total Belanja</div>
            <div className="font-bold text-sm">{formatPrice(cart.totalPrice)}</div>
          </div>
        </div>
        <div className="text-sm font-bold flex items-center gap-1">
          Lihat Keranjang
        </div>
      </div>
    </div>
  );
}
