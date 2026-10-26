import type { RefObject } from "react";

export function MessageBoxActions({
  showCancel,
  confirmLabel,
  cancelLabel,
  buttonClass,
  confirmBtnRef,
  onConfirm,
  onCancel,
}: {
  showCancel?: boolean;
  confirmLabel: string;
  cancelLabel: string;
  buttonClass: string;
  confirmBtnRef: RefObject<HTMLButtonElement | null>;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (showCancel) {
    return (
      <div className="flex w-full items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-border bg-background py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          {cancelLabel}
        </button>
        <button
          ref={confirmBtnRef}
          type="button"
          onClick={onConfirm}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.99] cursor-pointer ${buttonClass}`}
        >
          {confirmLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pt-2">
      <button
        ref={confirmBtnRef}
        type="button"
        onClick={onConfirm}
        className={`w-full rounded-xl py-2.5 text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.99] cursor-pointer ${buttonClass}`}
      >
        {confirmLabel}
      </button>
    </div>
  );
}
