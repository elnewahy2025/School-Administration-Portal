"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application boundary caught error:", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className="flex min-h-full items-center justify-center bg-slate-950 p-6 text-slate-100 antialiased">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertTriangleIcon className="size-8" />
          </div>

          <h1 className="mb-2 text-xl font-bold tracking-tight text-white">
            حدث خطأ جسيم في النظام
          </h1>
          <p className="mb-6 text-sm text-slate-400">
            نواجه صعوبة مؤقتة في تحميل التطبيق. يرجى إعادة المحاولة أو التواصل مع الدعم الفني.
          </p>

          {error.digest && (
            <div className="mb-6 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-500">
              Reference: {error.digest}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={() => reset()}
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500"
            >
              <RefreshCwIcon className="size-4" />
              <span>إعادة المحاولة / Try Again</span>
            </button>
            <Link
              href="/"
              className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
            >
              العودة للرئيسية / Return to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
