export interface ExcelTableSheetProps {
  rows: (string | number)[][];
}

export function ExcelTableSheet({ rows }: ExcelTableSheetProps) {
  return (
    <div className="flex-1 overflow-auto p-4">
      <table className="min-w-full border-collapse border border-border text-xs text-foreground">
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={
                rowIdx === 0
                  ? "sticky top-0 z-1 bg-muted/80 font-bold"
                  : "even:bg-muted/10 hover:bg-muted/30"
              }
            >
              <td className="border border-border bg-muted/60 px-2.5 py-1.5 text-center font-mono text-[10px] text-muted-foreground select-none">
                {rowIdx + 1}
              </td>
              {row.map((cell, colIdx) => (
                <td key={colIdx} className="border border-border px-3 py-1.5 whitespace-pre">
                  {cell !== null && cell !== undefined ? String(cell) : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
