import { saveAs } from "file-saver";
import Papa from "papaparse";

export function exportToCSV<T>(data: T[], filename = "export.csv") {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
}
