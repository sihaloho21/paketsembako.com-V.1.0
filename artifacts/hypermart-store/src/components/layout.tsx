import { Header } from "./header";
import { BottomNav } from "./bottom-nav";
import { CartBar } from "./cart-bar";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 md:bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] bg-white min-h-[100dvh] shadow-xl relative flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
        
        <CartBar />
        <BottomNav />
      </div>
    </div>
  );
}
