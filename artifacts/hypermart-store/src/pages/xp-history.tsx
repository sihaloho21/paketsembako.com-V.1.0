import { ChevronLeft } from "lucide-react";
import { useGetPointsHistory } from "@/hooks/use-gas-api";
import { useUserId } from "@/hooks/use-user-id";
import { TextSkeleton } from "@/components/skeletons";

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function to format points
const formatPoints = (n: number) => {
  return n.toLocaleString("id-ID");
};

export default function XPHistory() {
  const { userId, isLoaded } = useUserId();
  const { data: pointsHistory, isLoading } = useGetPointsHistory(userId);

  const isLoadingData = isLoading || !isLoaded;

  // Sort history by date (newest first)
  const sortedHistory = pointsHistory
    ? [...pointsHistory].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <div className="min-h-full bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-border shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="p-1 -ml-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <span className="text-base font-bold text-foreground">Riwayat XP</span>
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-br from-green-700 to-green-500 mx-4 mt-4 rounded-2xl overflow-hidden px-5 py-5">
        <p className="text-white/80 text-xs font-medium mb-1">Total Transaksi</p>
        <h1 className="text-white text-3xl font-black tracking-tight mb-1">
          {isLoadingData ? "Loading..." : sortedHistory.length}
        </h1>
        <p className="text-white/70 text-[11px]">
          Transaksi poin yang telah tercatat
        </p>
      </div>

      {/* History list */}
      <div className="mt-4 px-4">
        {isLoadingData ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 space-y-2">
                <TextSkeleton lines={2} />
              </div>
            ))}
          </div>
        ) : sortedHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Tidak ada riwayat transaksi
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedHistory.map((transaction: any, index: number) => {
              const isEarn = transaction.type === "Earn";
              const amount = Math.abs(transaction.amount);
              const amountFormatted = formatPoints(amount);

              return (
                <div
                  key={transaction.id || index}
                  className="bg-white rounded-xl overflow-hidden border border-border/60 shadow-sm"
                >
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg ${
                        isEarn
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isEarn ? "📈" : "📉"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {transaction.description || (isEarn ? "Earn XP" : "Redeem XP")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-bold ${
                          isEarn ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isEarn ? "+" : "-"}{amountFormatted} XP
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
