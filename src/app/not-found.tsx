import Link from "next/link";
import { FileQuestionIcon } from "lucide-react";

export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className="flex min-h-full items-center justify-center bg-slate-950 p-6 text-slate-100 antialiased">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <FileQuestionIcon className="size-8" />
          </div>

          <h1 className="mb-2 text-xl font-bold tracking-tight text-white">
            404 - الصفحة غير موجودة
          </h1>
          <p className="mb-6 text-sm text-slate-400">
            الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
          </p>

          <Link
            href="/"
            className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500"
          >
            العودة للرئيسية / Return Home
          </Link>
        </div>
      </body>
    </html>
  );
}
