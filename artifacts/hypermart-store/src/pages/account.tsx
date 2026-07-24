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
import { useGetUser, useGetUserVouchers } from "@/hooks/use-gas-api";
import { useUserId } from "@/hooks/use-user-id";
import { TextSkeleton } from "@/components/skeletons";

// Level progression thresholds
const LEVEL_THRESHOLDS = {
  "Benih": 0,
  "Bunga": 750,
  "Buah": 1500,
  "Panen": 3000,
};

interface MenuItem {
  icon: React.ReactNode;
  bg: string;
  label: string;
  sub: string | null;
  href: string;
}

interface MenuSection {
  items: MenuItem[];
}

export default function Account() {
  const { userId, isLoaded } = useUserId();
  const { data: user, isLoading: userLoading } = useGetUser(userId);
  const { data: userVouchers, isLoading: vouchersLoading } = useGetUserVouchers(userId);

  // Calculate XP needed for next level
  const getXPForNextLevel = () => {
    if (!user) return 0;
    const currentLevel = user.level || "Benih";
    const levelOrder = ["Benih", "Bunga", "Buah", "Panen"];
    const currentIndex = levelOrder.indexOf(currentLevel);
    
    if (currentIndex === -1 || currentIndex === levelOrder.length - 1) {
      return 0; // Max level reached
    }
    
    const nextLevel = levelOrder[currentIndex + 1];
    const nextThreshold = LEVEL_THRESHOLDS[nextLevel as keyof typeof LEVEL_THRESHOLDS] || 0;
    const currentXP = user.xp || 0;
    
    return Math.max(0, nextThreshold - currentXP);
  };

  // Count active vouchers
  const activeVouchersCount = userVouchers?.filter(
    (v: any) => v.status === "Active"
  ).length || 0;

  // Format points
  const formattedPoints = user?.points
    ? user.points.toLocaleString("id-ID")
    : "0";

  // Get user initials
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts[0][0].toUpperCase();
  };

  const userInitial = user?.name ? getInitials(user.name) : "U";
  const userName = user?.name || "User";
  const userLevel = user?.level || "Benih";
  const isLoadingUser = userLoading || !isLoaded;

  const menuSections: MenuSection[] = [
    {
      items: [
        {
          icon: <Coins size={20} className="text-yellow-500" />,
          bg: "bg-yellow-50",
          label: "Hypermart Poin",
          sub: `${formattedPoints} Poin. Tukar poin di sini`,
          href: "/poin",
        },
        {
          icon: <Sprout size={20} className="text-green-600" />,
          bg: "bg-green-50",
          label: `Level Member - ${userLevel}`,
          sub: getXPForNextLevel() > 0 
            ? `Kumpulkan +${getXPForNextLevel()} XP lagi untuk naik level!`
            : "Level maksimal tercapai!",
          href: "/level",
        },
        {
          icon: <Ticket size={20} className="text-primary" />,
          bg: "bg-blue-50",
          label: "Voucher Aktif",
          sub: `${activeVouchersCount} Voucher Tersedia`,
          href: "/voucher",
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
          {isLoadingUser ? (
            <TextSkeleton lines={2} />
          ) : (
            <>
              <h2 className="text-base font-bold text-foreground leading-tight">
                {userName}
              </h2>
              <button
                data-testid="button-ubah-akun"
                className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 hover:text-primary transition-colors"
              >
                Ubah Akun <Pencil size={11} />
              </button>
            </>
          )}
        </div>
        {/* Avatar circle */}
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
          <span className="text-green-700 font-bold text-lg">{userInitial}</span>
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
