import { Copy, Check, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VoucherDetailModalProps {
  open: boolean;
  voucherCode: string;
  voucherTitle: string;
  expiryDays: number;
  onClose: () => void;
}

export function VoucherDetailModal({
  open,
  voucherCode,
  voucherTitle,
  expiryDays,
  onClose,
}: VoucherDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  const formattedExpiry = expiryDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voucher Berhasil Ditukar! 🎉</DialogTitle>
          <DialogDescription>
            Simpan kode voucher Anda dan gunakan sebelum kadaluarsa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Voucher Title */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nama Voucher</p>
            <p className="text-sm font-semibold text-foreground">{voucherTitle}</p>
          </div>

          {/* Voucher Code */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Kode Voucher</p>
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-3">
              <code className="flex-1 text-sm font-mono font-bold text-foreground">
                {voucherCode}
              </code>
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                title="Salin kode"
              >
                {copied ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} className="text-muted-foreground" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 mt-1">Kode berhasil disalin!</p>
            )}
          </div>

          {/* Expiry Date */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Berlaku Hingga</p>
            <p className="text-sm font-semibold text-foreground">{formattedExpiry}</p>
            <p className="text-xs text-muted-foreground mt-1">
              ({expiryDays} hari dari sekarang)
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
            <p className="text-xs text-blue-800">
              💡 Jangan lupa untuk menggunakan voucher sebelum tanggal kadaluarsa!
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <X size={16} />
            Tutup
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
