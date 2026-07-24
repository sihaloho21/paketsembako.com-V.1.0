import { useState } from "react";
import { ChevronLeft, ChevronRight, Coins, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetUser, useGetAvailableVouchers } from "@/hooks/use-gas-api";
import { useUserId } from "@/hooks/use-user-id";
import { useToast } from "@/hooks/use-toast";
import { VoucherCardSkeleton, Skeleton } from "@/components/skeletons";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { VoucherDetailModal } from "@/components/voucher-detail-modal";
import { ErrorState } from "@/components/error-boundary";
import * as gasApi from "@/lib/gas-api";
import { useQueryClient } from "@tanstack/react-query";

const filters = ["All", "Voucher Belanja", "Merchandise"];

function formatPoints(n: number) {
  return n.toLocaleString("id-ID");
}

interface PendingRedeem {
  voucherId: number;
  voucherTitle: string;
}

interface SuccessfulRedeem {
  code: string;
  title: string;
  expiryDays: number;
}

export default function Poin() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { userId, isLoaded } = useUserId();
  const [isRedeeming, setIsRedeeming] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user, isLoading: userLoading, error: userError, refetch: refetchUser } = useGetUser(userId);
  const { data: vouchers, isLoading: vouchersLoading, error: vouchersError, refetch: refetchVouchers } = useGetAvailableVouchers();

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; pending: PendingRedeem | null }>({
    open: false,
    pending: null,
  });
  const [voucherModal, setVoucherModal] = useState<{ open: boolean; data: SuccessfulRedeem | null }>({
    open: false,
    data: null,
  });

  const filtered =
    activeFilter === "All"
      ? vouchers
      : vouchers?.filter((v: any) => v.type === activeFilter) || [];

  const handleRedeemClick = (voucherId: number, voucherTitle: string) => {
    setConfirmDialog({
      open: true,
      pending: { voucherId, voucherTitle },
    });
  };

  const handleConfirmRedeem = async () => {
    if (!confirmDialog.pending || !user) {
      toast.error("Data tidak lengkap");
      return;
    }

    const { voucherId, voucherTitle } = confirmDialog.pending;
    setIsRedeeming(voucherId);

    try {
      const result = await gasApi.redeemVoucher(userId, voucherId);
      
      if (result.success) {
        setConfirmDialog({ open: false, pending: null });
        
        // Tampilkan modal detail voucher
        setVoucherModal({
          open: true,
          data: {
            code: result.voucherCode,
            title: voucherTitle,
            expiryDays: vouchers?.find((v: any) => v.id === voucherId)?.expiryDays || 30,
          },
        });

        // Invalidate queries untuk refresh data
        await queryClient.invalidateQueries({ queryKey: ["user", userId] });
        await queryClient.invalidateQueries({ queryKey: ["userVouchers", userId] });
        await queryClient.invalidateQueries({ queryKey: ["pointsHistory", userId] });
      } else {
        toast.error(result.message || "Gagal menukar voucher");
        setConfirmDialog({ open: false, pending: null });
      }
    } catch (error: any) {
      const errorMessage = error.message || "Gagal menukar voucher. Silakan coba lagi.";
      toast.error(errorMessage);
      console.error("Redeem error:", error);
      setConfirmDialog({ open: false, pending: null });
    } finally {
      setIsRedeeming(null);
    }
  };

  const isLoadingUser = userLoading || !isLoaded;
  const hasUserError = !!userError;
  const hasVouchersError = !!vouchersError;
  const userPoints = user?.points || 0;
  const userPointsFormatted = formatPoints(userPoints);

  return (
    <div className="min-h-full bg-slate-100 pb-8">
      {/* Header nav */}
      <div className="bg-white sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-border shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="p-1 -ml-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <span className="text-base font-bold text-foreground">Poin Saya</span>
      </div>

      {/* Error state for user data */}
      {hasUserError && (
        <div className="mx-4 mt-4">
          <ErrorState
            error="Gagal memuat data profil. Silakan coba lagi."
            onRetry={() => refetchUser()}
          />
        </div>
      )}

      {/* Hero banner */}
      {!hasUserError && (
        <div className="relative bg-gradient-to-br from-green-700 to-green-500 mx-4 mt-4 rounded-2xl overflow-hidden px-5 py-5">
          {/* Coin decoration */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 right-2 w-10 h-10 rounded-full bg-yellow-400 border-4 border-yellow-300 shadow-lg" />
              <div className="absolute top-4 right-10 w-8 h-8 rounded-full bg-yellow-400 border-4 border-yellow-300 shadow-md" />
              <div className="absolute top-8 right-3 w-12 h-12 rounded-full bg-yellow-400 border-4 border-yellow-300 shadow-xl" />
              <div className="absolute bottom-0 right-6 w-9 h-9 rounded-full bg-yellow-400 border-4 border-yellow-200 shadow-lg" />
            </div>
          </div>

          <p className="text-white/80 text-xs font-medium mb-1">Total Poin</p>
          <h1 className="text-white text-3xl font-black tracking-tight mb-1">
            {isLoadingUser ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              `${userPointsFormatted} Poin`
            )}
          </h1>
          <p className="text-white/70 text-[11px] mb-4">
            Kadaluarsa 20 September 2026
          </p>
          <button className="bg-white text-green-700 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:bg-green-50 transition-colors active:scale-95">
            Lihat Selengkapnya
          </button>
        </div>
      )}

      {/* Activity rows */}
      {!hasUserError && (
        <div className="bg-white mx-4 mt-3 rounded-2xl overflow-hidden divide-y divide-border/60">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
              <Coins size={18} className="text-yellow-500" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">
                Aktivitas Poin &amp; Loyalitas
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Lihat riwayat poin dan Loyalty kamu disini
              </p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
              <Sprout size={18} className="text-pink-500" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">
                Voucher Saya
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kamu memiliki voucher aktif!
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {filtered.length}
              </span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </button>
        </div>
      )}

      {/* Tukar Poin section */}
      {!hasUserError && (
        <div className="mt-4 px-4">
          <h2 className="text-sm font-bold text-foreground mb-3">Tukar Poin</h2>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                  activeFilter === f
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-border hover:border-primary"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Error state for vouchers */}
          {hasVouchersError && (
            <ErrorState
              error="Gagal memuat daftar voucher. Silakan coba lagi."
              onRetry={() => refetchVouchers()}
            />
          )}

          {/* Loading state */}
          {vouchersLoading && !hasVouchersError && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <VoucherCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!vouchersLoading && !hasVouchersError && filtered.length === 0 && (
            <div className="flex justify-center py-8">
              <div className="text-sm text-muted-foreground">Tidak ada voucher tersedia</div>
            </div>
          )}

          {/* Voucher cards */}
          <div className="flex flex-col gap-3">
            {!hasVouchersError && filtered.map((v: any) => {
              const canRedeem = userPoints >= v.points;
              const isRedeeming_ = isRedeeming === v.id;

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50"
                >
                  {/* Card banner */}
                  <div
                    className={cn(
                      "bg-gradient-to-r px-4 py-4 flex items-center justify-between",
                      v.color
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Percent icon */}
                      <div className="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center shadow">
                        <span className="text-white font-black text-lg leading-none">%</span>
                      </div>
                      <div>
                        <p className="text-white/80 text-[10px] font-semibold uppercase tracking-wider">
                          {v.type}
                        </p>
                        <p className="text-white font-black text-2xl leading-tight">
                          Rp{v.value}
                        </p>
                      </div>
                    </div>
                    {/* Coin stack visual */}
                    <div className="flex flex-col gap-0.5 items-center opacity-80">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-7 h-2.5 rounded-full bg-yellow-400 border border-yellow-300 shadow-sm"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{v.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Berlaku hingga {v.expiryDays} hari setelah klaim
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className={cn(
                        "text-sm font-black",
                        canRedeem ? "text-green-600" : "text-red-500"
                      )}>
                        {formatPoints(v.points)} Poin
                      </p>
                      <button
                        onClick={() => handleRedeemClick(v.id, v.title)}
                        disabled={!canRedeem || isRedeeming_}
                        className={cn(
                          "mt-1 text-[10px] font-bold px-3 py-1 rounded-full transition-all active:scale-95",
                          canRedeem
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        )}
                      >
                        {isRedeeming_ ? "Menukar..." : "Tukar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        title="Konfirmasi Penukaran Poin"
        description={`Apakah Anda yakin ingin menukar ${
          confirmDialog.pending ? formatPoints(
            vouchers?.find((v: any) => v.id === confirmDialog.pending?.voucherId)?.points || 0
          ) : "0"
        } poin untuk "${confirmDialog.pending?.voucherTitle}"?`}
        confirmText="Ya, Tukar"
        cancelText="Batal"
        variant="default"
        isLoading={isRedeeming !== null}
        onConfirm={handleConfirmRedeem}
        onCancel={() => setConfirmDialog({ open: false, pending: null })}
      />

      {/* Voucher Detail Modal */}
      {voucherModal.data && (
        <VoucherDetailModal
          open={voucherModal.open}
          voucherCode={voucherModal.data.code}
          voucherTitle={voucherModal.data.title}
          expiryDays={voucherModal.data.expiryDays}
          onClose={() => setVoucherModal({ open: false, data: null })}
        />
      )}
    </div>
  );
}
