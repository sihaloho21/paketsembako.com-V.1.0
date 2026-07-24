import React, { ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Error caught by boundary:", error);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.retry);
      }

      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Terjadi Kesalahan</h2>
          <p className="text-sm text-muted-foreground text-center mb-4">
            {this.state.error?.message || "Terjadi kesalahan yang tidak terduga"}
          </p>
          <button
            onClick={this.retry}
            className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            <RotateCcw size={16} />
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Komponen untuk menampilkan error state dengan tombol retry
 */
export function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertCircle size={32} className="text-red-600" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-2">Gagal Memuat Data</h2>
      <p className="text-sm text-muted-foreground text-center mb-4">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
      >
        <RotateCcw size={16} />
        Coba Lagi
      </button>
    </div>
  );
}
