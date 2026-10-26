export type MessageBoxType = "success" | "error" | "info" | "warning";

export interface MessageBoxOptions {
  message: string;
  title?: string;
  type?: MessageBoxType;
  confirmText?: string;
  onConfirm?: () => void;
}

export interface MessageBoxState extends MessageBoxOptions {
  isOpen: boolean;
  type: MessageBoxType;
}
