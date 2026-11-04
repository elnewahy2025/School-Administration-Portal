import { useTranslations } from "next-intl";
import { DownloadIcon, PaperclipIcon } from "lucide-react";
import type { CircularAttachmentRow } from "@/lib/circulars/types";

/** Attachment list of a public circular, linking to the time-limited signed URLs. */
export function PublicCircularAttachments({
  attachments,
}: {
  attachments: CircularAttachmentRow[];
}) {
  const t = useTranslations("circulars");

  if (attachments.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
      <h2 className="flex items-center gap-2 font-heading text-sm font-extrabold text-[#0c1f44] dark:text-white">
        <PaperclipIcon className="size-4" aria-hidden="true" />
        {t("attachments")}
      </h2>
      <ul className="mt-3 space-y-2">
        {attachments.map((attachment) => {
          const fileName = attachment.path.split("/").pop() ?? attachment.path;
          return (
            <li key={attachment.id}>
              <a
                href={attachment.public_url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-[#0c1f44] transition-colors hover:border-[#0b5cce] hover:bg-white dark:border-slate-700 dark:bg-slate-900/40 dark:text-white"
              >
                <DownloadIcon className="size-4" aria-hidden="true" />
                {fileName}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
