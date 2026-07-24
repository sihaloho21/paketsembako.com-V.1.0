import { cn } from "@/lib/utils";

/**
 * Skeleton component untuk loading state
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200",
        className
      )}
    />
  );
}

/**
 * Skeleton untuk text line
 */
export function TextSkeleton({ lines = 1 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded-md",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton untuk card
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

/**
 * Skeleton untuk header user profile
 */
export function HeaderUserSkeleton() {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

/**
 * Skeleton untuk voucher card
 */
export function VoucherCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50">
      <div className="bg-gradient-to-r from-slate-200 to-slate-300 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="w-7 h-12 rounded-lg" />
      </div>
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="text-right space-y-2 ml-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton untuk level card
 */
export function LevelCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-transparent shadow-sm">
      <Skeleton className="h-52 w-full" />
      <Skeleton className="h-8 m-3" />
      <div className="px-3 py-3 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
