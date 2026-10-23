export function printAttachment(url?: string) {
  if (!url) return;
  const printWindow = window.open(url, "_blank");
  if (printWindow) {
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
