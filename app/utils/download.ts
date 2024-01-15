import Papa from 'papaparse';

export function downloadCsv(
  filename: `${string}.csv`,
  records: Record<string, unknown>[],
) {
  const csv = Papa.unparse(records);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
