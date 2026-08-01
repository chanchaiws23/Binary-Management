"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const toastStyles: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900"
};

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 3200);

    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  const Icon = type === "success" ? CheckCircle2 : XCircle;

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm animate-[toast-in_180ms_ease-out] md:right-6 md:top-6">
      <div
        role="status"
        aria-live="polite"
        className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg shadow-black/10 ${toastStyles[type]}`}
      >
        <Icon size={20} className="mt-0.5 shrink-0" aria-hidden />
        <p className="min-w-0 flex-1 text-sm font-medium leading-6">
          {message}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md p-1 transition hover:bg-black/5"
          aria-label="ปิดการแจ้งเตือน"
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}

