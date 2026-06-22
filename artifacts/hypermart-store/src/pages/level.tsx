import { useState } from "react";
import { ChevronLeft, ChevronRight, HelpCircle, Sprout, Star, Ticket, Gift, Users, Headphones, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const levels = [
  {
    id: 0,
    name: "Benih",
    color: "from-green-400 to-green-600",
    labelBg: "bg-pink-100",
    labelText: "text-pink-800",
    locked: false,
    xp: 0,
    xpNeeded: 750,
    expiry: "20 September 2026",
    emoji: "🌱",
    rewards: [
      { icon: <Star size={22} className="text-yellow-500" />, label: "Sayurpoin Tiap Transaksi", active: true },
      { icon: <Ticket size={22} className="text-red-500" />, label: "Tukar Voucher", active: true },
    ],
    characterBg: "from-green-100 to-green-200",
    char1: "🥕",
    char2: "🥝",
  },
  {
    id: 1,
    name: "Bunga",
    color: "from-yellow-400 to-yellow-500",
    labelBg: "bg-yellow-100",
    labelText: "text-yellow-800",
    locked: true,
    xp: 0,
    xpNeeded: 1500,
    expiry: "",
    emoji: "🌸",
    rewards: [
      { icon: <Star size={22} className="text-yellow-500" />, label: "Ekstra Sayurpoin +10%", active: true, badge: "+10%" },
      { icon: <Ticket size={22} className="text-gray-400" />, label: "Tukar Voucher", active: true },
      { icon: <Gift size={22} className="text-gray-400" />, label: "Bonus Voucher Naik Level", active: true },
    ],
    characterBg: "from-gray-100 to-gray-200",
    char1: "🌼",
    char2: "🌺",
  },
  {
    id: 2,
    name: "Buah",
    color: "from-orange-400 to-orange-500",
    labelBg: "bg-orange-100",
    labelText: "text-orange-800",
    locked: true,
    xp: 0,
    xpNeeded: 3000,
    expiry: "",
    emoji: "🍎",
    rewards: [
      { icon: <Star size={22} className="text-yellow-500" />, label: "Ekstra Sayurpoin +20%", active: true, badge: "+20%" },
      { icon: <Ticket size={22} className="text-gray-400" />, label: "Tukar Voucher", active: true },
      { icon: <Gift size={22} className="text-gray-400" />, label: "Bonus Voucher Naik Level", active: true },
    ],
    characterBg: "from-gray-100 to-gray-200",
    char1: "🍊",
    char2: "🍇",
  },
  {
    id: 3,
    name: "Panen",
    color: "from-teal-400 to-teal-600",
    labelBg: "bg-teal-50",
    labelText: "text-teal-800",
    locked: true,
    xp: 0,
    xpNeeded: 6000,
    expiry: "",
    emoji: "🌾",
    rewards: [
      { icon: <Star size={22} className="text-yellow-500" />, label: "Ekstra Sayurpoin +30%", active: true, badge: "+30%" },
      { icon: <Ticket size={22} className="text-gray-400" />, label: "Tukar Voucher", active: true },
      { icon: <Gift size={22} className="text-gray-400" />, label: "Bonus Voucher Naik Level", active: true },
      { icon: <Users size={22} className="text-gray-400" />, label: "Undangan Event Eksklusif", active: true },
      { icon: <Headphones size={22} className="text-gray-400" />, label: "Pelayanan Prioritas", active: true },
    ],
    characterBg: "from-gray-100 to-gray-200",
    char1: "🌽",
    char2: "🎃",
  },
];

const CURRENT_XP = 0;
const NEEDED_XP = 750;

export default function Level() {
  const [activeLevel, setActiveLevel] = useState(0);
  const level = levels[activeLevel];

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-border/40">
        <button
          onClick={() => window.history.back()}
          className="p-1 -ml-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <span className="text-base font-bold text-green-600">Level Member</span>
        <button className="p-1 rounded-full hover:bg-slate-100 transition-colors">
          <HelpCircle size={20} className="text-muted-foreground" />
        </button>
      </div>

      {/* Level carousel */}
      <div className="relative">
        {/* Cards strip */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-3 pt-4 pb-2">
          {levels.map((lv, i) => (
            <div
              key={lv.id}
              onClick={() => setActiveLevel(i)}
              className={cn(
                "snap-center shrink-0 w-[82vw] max-w-[320px] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer",
                activeLevel === i ? "border-green-400 shadow-lg" : "border-transparent shadow-sm opacity-70 scale-[0.97]"
              )}
            >
              {/* Illustration area */}
              <div className={cn(
                "relative h-52 bg-gradient-to-b flex items-end justify-center overflow-hidden",
                lv.locked ? "from-gray-100 to-gray-200" : "from-green-50 to-green-100"
              )}>
                {/* Background circle */}
                <div className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-40 rounded-t-full",
                  lv.locked ? "bg-gray-300/50" : "bg-green-200/60"
                )} />

                {/* Characters */}
                <div className={cn(
                  "relative z-10 flex items-end gap-4 pb-3",
                  lv.locked ? "grayscale" : ""
                )}>
                  <div className="text-6xl drop-shadow-md select-none" style={{ transform: "scaleX(-1)" }}>
                    {lv.char1}
                  </div>
                  <div className="text-5xl drop-shadow-md select-none mb-2">
                    {lv.char2}
                  </div>
                </div>

                {/* XP badge for current level */}
                {!lv.locked && (
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2.5 py-1 flex items-center gap-1 shadow">
                    <Zap size={11} className="text-yellow-500 fill-yellow-400" />
                    <span className="text-[11px] font-black text-foreground">XP {CURRENT_XP}</span>
                  </div>
                )}
              </div>

              {/* Level label */}
              <div className={cn("px-3 py-2 flex items-center gap-2", lv.labelBg)}>
                <Sprout size={16} className={lv.locked ? "text-gray-500" : "text-green-600"} />
                <span className={cn("text-sm font-bold", lv.labelText)}>{lv.name}</span>
              </div>

              {/* Info area */}
              {!lv.locked ? (
                <div className="bg-white px-3 py-3">
                  {/* XP progress */}
                  <p className="text-xs text-center text-muted-foreground mb-2 font-medium">
                    Kumpulkan +{NEEDED_XP.toLocaleString("id-ID")} XP lagi untuk naik level!
                  </p>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                      style={{ width: `${Math.min((CURRENT_XP / NEEDED_XP) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-muted-foreground">Sebelum {lv.expiry}</span>
                    <button className="text-[10px] text-green-600 font-bold flex items-center gap-0.5 hover:underline">
                      Lihat Caranya <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800 px-3 py-2.5">
                  <p className="text-white text-xs font-bold text-center">Level Masih Terkunci</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-2 mb-1">
          {levels.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveLevel(i)}
              className={cn(
                "rounded-full transition-all",
                activeLevel === i ? "w-4 h-2 bg-green-600" : "w-2 h-2 bg-slate-300"
              )}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={() => setActiveLevel((p) => Math.max(0, p - 1))}
            disabled={activeLevel === 0}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setActiveLevel((p) => Math.min(levels.length - 1, p + 1))}
            disabled={activeLevel === levels.length - 1}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Rewards section */}
      <div className="mt-5 bg-white border-t border-border/40 pt-4 px-4">
        <h2 className="text-sm font-bold text-foreground text-center mb-4">
          Rewards di Level {level.name}
        </h2>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-5">
          {level.rewards.map((r, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 w-[72px]">
              <div className={cn(
                "relative w-14 h-14 rounded-full flex items-center justify-center shadow-md",
                level.locked ? "bg-gray-200" : "bg-gradient-to-br from-green-500 to-green-700"
              )}>
                <div className={level.locked ? "text-gray-400 grayscale" : "text-white"}>
                  {r.icon}
                </div>
                {r.badge && !level.locked && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1 py-0.5 rounded-full leading-none">
                    {r.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-center text-muted-foreground font-medium leading-tight">
                {r.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* XP History */}
      <div className="mt-4 mx-4 mb-6 bg-white border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-slate-50 transition-colors">
          <div>
            <p className="text-sm font-bold text-foreground text-left">Riwayat XP</p>
            <p className="text-xs text-muted-foreground mt-0.5">Yang telah didapat dari transaksimu</p>
          </div>
          <ChevronRight size={18} className="text-muted-foreground shrink-0" />
        </button>
      </div>
    </div>
  );
}
