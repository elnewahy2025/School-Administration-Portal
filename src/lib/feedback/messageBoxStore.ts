import type {
  MessageBoxOptions,
  MessageBoxState,
} from "./types";

let currentState: MessageBoxState = {
  isOpen: false,
  message: "",
  type: "info",
};

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export const messageBoxStore = {
  getState(): MessageBoxState {
    return currentState;
  },

  show(options: MessageBoxOptions | string): void {
    const opts: MessageBoxOptions =
      typeof options === "string" ? { message: options } : options;

    currentState = {
      isOpen: true,
      message: opts.message,
      title: opts.title,
      type: opts.type ?? "info",
      confirmText: opts.confirmText,
      onConfirm: opts.onConfirm,
    };
    notify();
  },

  close(): void {
    if (currentState.onConfirm) {
      currentState.onConfirm();
    }
    currentState = {
      ...currentState,
      isOpen: false,
      onConfirm: undefined,
    };
    notify();
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
