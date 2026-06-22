import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, ShoppingCart, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const tabs = ["Bisa Digunakan", "Tidak Bisa Digunakan", "Sudah Digunakan"];

const vouchers = [
  {
    id: 1,
    color: "bg-green-700",
    label: "Rp",
    title: "Diskon 10% hingga Rp50.000",
    subtitle: "Voucher untuk Transaksi Keduamu!",
    saving: "Hemat s.d Rp50.000",
    expiry: "S.d 31/12/26",
    minBelanja: "Min. Belanja Rp125rb",
    usable: true,
  },
  {
    id: 2,
    color: "bg-blue-600",
    label: "%",
    title: "Gratis Ongkir hingga Rp20.000",
    subtitle: "Voucher Gratis Ongkos Kirim",
    saving: "Hemat s.d Rp20.000",
    expiry: "S.d 15/07/26",
    minBelanja: "Min. Belanja Rp50rb",
    usable: true,
  },
  {
    id: 3,
    color: "bg-orange-500",
    label: "Rp",
    title: "Cashback Rp10.000",
    subtitle: "Voucher Cashback Spesial Member",
    saving: "Hemat s.d Rp10.000",
    expiry: "S.d 30/06/26",
    minBelanja: "Min. Belanja Rp75rb",
    usable: false,
  },
];

export default function Voucher() {
  const [activeTab, setActiveTab] = useState(0);

  const displayed =
    activeTab === 0
      ? vouchers.filter((v) => v.usable)
      : activeTab === 1
      ? vouchers.filter((v) => !v.usable)
      : [];

  return (
    <div className="min-h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-border shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="p-1 -ml-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <span className="text-base font-bold text-foreground">Voucher Saya</span>
      </div>

      {/* Butuh Voucher banner */}
      <div className="bg-pink-50 mx-4 mt-4 rounded-xl px-4 py-3 flex items-center justify-between border border-pink-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
            <Ticket size={16} className="text-pink-500" />
          </div>
          <span className="text-sm font-semibold text-foreground">Butuh Voucher?</span>
        </div>
        <Link href="/poin">
          <div className="flex items-center gap-0.5 text-primary text-sm font-bold hover:underline">
            Tukar <ChevronRight size={15} />
          </div>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide mt-4 bg-white border-b border-border px-2">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={cn(
              "shrink-0 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap",
              activeTab === i
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
            {i === 0 && (
              <span className="ml-1.5 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full inline-flex items-center justify-center">
                {vouchers.filter((v) => v.usable).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 mt-4 flex flex-col gap-3 pb-8">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Ticket size={28} className="text-slate-300" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Tidak ada voucher</p>
          </div>
        ) : (
          displayed.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl overflow-hidden border border-border/60 shadow-sm"
            >
              {/* Main row */}
              <div className="flex items-start gap-3 px-3.5 pt-3.5 pb-2">
                {/* Icon */}
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5",
                  v.color
                )}>
                  <span className="text-white font-black text-base">{v.label}</span>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground leading-tight">{v.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.subtitle}</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">{v.saving}</p>
                </div>

                <ChevronRight size={16} className="text-muted-foreground shrink-0 mt-1" />
              </div>

              {/* Divider with notch */}
              <div className="flex items-center mx-3 my-2">
                <div className="w-3 h-3 rounded-full bg-slate-100 -ml-5 border border-border/40 shrink-0" />
                <div className="flex-1 border-t border-dashed border-border mx-1" />
                <div className="w-3 h-3 rounded-full bg-slate-100 -mr-5 border border-border/40 shrink-0" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-3.5 pb-3 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={11} className="shrink-0" />
                  <span>{v.expiry}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingCart size={11} className="shrink-0" />
                  <span>{v.minBelanja}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
