import * as XLSX from "xlsx";
import type { TableColumnsType } from "antd";

function getNestedValue(obj: unknown, path: string | string[]): unknown {
  const keys = Array.isArray(path) ? path : path.split(".");
  return keys.reduce((acc: unknown, key: string) => {
    if (acc != null && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function formatCellValue(value: unknown): string | number {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (typeof value === "number") return value;
  if (typeof value === "string") return value || "-";
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "object" && item !== null
          ? Object.values(item as Record<string, unknown>).join(" - ")
          : String(item),
      )
      .join(" | ");
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function exportOrdersXLSX({
  data,
  visibleColumns,
  extraExportColumns = [],
  excludeDataIndexes = [],
  filename = "pedidos.xlsx",
}: {
  data: unknown[];
  visibleColumns: TableColumnsType<unknown>;
  extraExportColumns?: Array<{
    title: string;
    getValue: (record: unknown) => string | number;
  }>;
  excludeDataIndexes?: string[];
  filename?: string;
}) {
  if (!data.length) return;

  // Colunas exportáveis: têm dataIndex e título de texto visível
  const exportableColumns = visibleColumns.filter(
    (col) =>
      "dataIndex" in col &&
      col.title &&
      typeof col.title === "string" &&
      col.title.trim() !== "" &&
      !excludeDataIndexes.includes(
        Array.isArray((col as { dataIndex: unknown }).dataIndex)
          ? (col as { dataIndex: string[] }).dataIndex.join(".")
          : String((col as { dataIndex: unknown }).dataIndex ?? ""),
      ),
  ) as Array<{ title: string; dataIndex: string | string[] }>;

  const rows = data.map((record) => {
    const row: Record<string, string | number> = {};
    extraExportColumns.forEach((col) => {
      row[col.title] = col.getValue(record);
    });
    exportableColumns.forEach((col) => {
      const value = getNestedValue(record, col.dataIndex);
      row[col.title] = formatCellValue(value);
    });
    return row;
  });

  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Pedidos");
  XLSX.writeFile(workbook, filename);
}
