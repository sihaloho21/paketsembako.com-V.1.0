import { Link } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Coins,
  Sprout,
  Ticket,
  ClipboardList,
  MapPin,
  RefreshCcw,
  Inbox,
  Settings,
  Lock,
  FileText,
  HelpCircle,
} from "lucide-react";

const menuSections = [
  {
    items: [
      {
        icon: <Coins size={20} className="text-yellow-500" />,
        bg: "bg-yellow-50",
        label: "Hypermart Poin",
        sub: "25.000 Poin. Tukar poin di sini",
        href: "#",
      },
      {
        icon: <Sprout size={20} className="text-green-600" />,
        bg: "bg-green-50",
        label: "Level Member - Silver",
        sub: "Kumpulkan +750 XP lagi untuk naik level!",
        href: "#",
      },
      {
        icon: <Ticket size={20} className="text-primary" />,
        bg: "bg-blue-50",
        label: "Voucher Aktif",
        sub: "1 Voucher Tersedia",
        href: "#",
      },
    ],
  },
  {
    items: [
      {
        icon: <ClipboardList size={20} className="text-muted-foreground" />,
        bg: "bg-slate-100",
        label: "Daftar Pesanan",
        sub: null,
        href: "#",
      },
      {
        icon: <MapPin size={20} className="text-muted-foreground" />,
        bg: "bg-slate-100",
        label: "Alamat Tersimpan",
        sub: null,
        href: "#",
      },
      {
        icon: <RefreshCcw size={20} className="text-muted-foreground" />,
        bg: "bg-slate-100",
        label: "Metode Pengembalian Dana",
        sub: null,
        href: "#",
      },
      {
        icon: <Inbox size={20} className="text-muted-foreground" />,
        bg: "bg-slate-100",
        label: "Inbox",
        sub: null,
        href: "#",
      },
      {
        icon: <Settings size={20} className="text-muted-foreground" />,
        bg: "bg-slate-100",
        label: "Pengaturan Akun",
        sub: null,
        href: "#",
      },
    ],
  },
  {
    items: [
      {
        icon: <Lock size={20} className="text-muted-foreground" />,
        bg: "bg-slate-100",
        label: "Kebijakan Privasi",
        sub: null,
        href: "#",
      },
      {
        icon: <FileText size={20} className="text-muted-foreground" />,
        bg: "bg-slate-100",
        label: "Syarat dan Ketentuan",
        sub: null,
        href: "#",
      },
      {
        icon: <HelpCircle size={20} className="text-muted-foreground" />,
        bg: "bg-slate-100",
        label: "Bantuan",
        sub: null,
        href: "#",
      },
    ],
  },
];

export default function Account() {
  return (
    <div className="min-h-full bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-border shadow-sm">
        <button
          data-testid="button-back-account"
          onClick={() => window.history.back()}
          className="p-1 -ml-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <span className="text-base font-bold text-foreground">Akun</span>
      </div>

      {/* User profile card */}
      <div className="bg-white px-4 py-5 flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-foreground leading-tight">User A</h2>
          <button
            data-testid="button-ubah-akun"
            className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 hover:text-primary transition-colors"
          >
            Ubah Akun <Pencil size={11} />
          </button>
        </div>
        {/* Avatar circle */}
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
          <span className="text-green-700 font-bold text-lg">U</span>
        </div>
      </div>

      {/* Menu sections */}
      {menuSections.map((section, si) => (
        <div key={si} className="bg-white mb-3">
          {section.items.map((item, ii) => (
            <Link key={ii} href={item.href}>
              <div
                data-testid={`menu-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors ${
                  ii < section.items.length - 1 ? "border-b border-border/60" : ""
                }`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">{item.label}</p>
                  {item.sub && (
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{item.sub}</p>
                  )}
                </div>

                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
