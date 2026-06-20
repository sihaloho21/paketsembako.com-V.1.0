import { Header } from "./header";
import { BottomNav } from "./bottom-nav";
import { CartBar } from "./cart-bar";
import { ReactNode, useRef, useState, useCallback } from "react";

export function Layout({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    setScrolled(el.scrollTop > 48);
  }, []);

  return (
    <div className="h-[100dvh] w-full bg-slate-50 md:bg-gray-100 flex justify-center overflow-hidden">
      <div className="w-full max-w-[430px] bg-white h-full shadow-xl relative flex flex-col overflow-hidden">
        <Header scrolled={scrolled} />

        <main
          ref={mainRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden relative"
        >
          {children}
        </main>

        <CartBar />
        <BottomNav />
      </div>
    </div>
  );
}
