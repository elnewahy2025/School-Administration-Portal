"use client";

import { useEffect, useState } from "react";

export function useExcelDocumentReader(url: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [sheetsData, setSheetsData] = useState<Record<string, (string | number)[][]>>({});

  useEffect(() => {
    let isCancelled = false;

    async function loadExcel() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch spreadsheet (${response.status})`);
        }
        const buffer = await response.arrayBuffer();
        if (isCancelled) return;

        const XLSX = await import("xlsx");
        const workbook = XLSX.read(buffer, { type: "array" });

        const extracted: Record<string, (string | number)[][]> = {};
        for (const name of workbook.SheetNames) {
          const sheet = workbook.Sheets[name];
          if (sheet) {
            extracted[name] = XLSX.utils.sheet_to_json(sheet, {
              header: 1,
              defval: "",
            }) as (string | number)[][];
          }
        }

        if (!isCancelled) {
          setSheetNames(workbook.SheetNames);
          setActiveSheet(workbook.SheetNames[0] || "");
          setSheetsData(extracted);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Error reading Excel file");
          setLoading(false);
        }
      }
    }

    loadExcel();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return {
    loading,
    error,
    sheetNames,
    activeSheet,
    setActiveSheet,
    currentRows: sheetsData[activeSheet] || [],
  };
}

