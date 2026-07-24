import axios from 'axios';
import { EXPORT_API_BASE_URL } from './client';

export type DocumentFormat = 'excel' | 'pdf';
export type DocumentKind = 'invoice' | 'packing-list' | 'statement';

const CONTENT_TYPE: Record<DocumentFormat, string> = {
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
};

const EXTENSION: Record<DocumentFormat, string> = {
  excel: 'xlsx',
  pdf: 'pdf',
};

// Documents are generated server-side (openpyxl/reportlab, with the company
// letterhead baked in) rather than fetched, so this POSTs the form data and
// downloads the response as a file instead of navigating to a URL.
export async function exportDocument(
  kind: DocumentKind,
  format: DocumentFormat,
  data: unknown,
  filenamePrefix: string,
): Promise<void> {
  const res = await axios.post(`${EXPORT_API_BASE_URL}/documents/${kind}/${format}`, data, {
    responseType: 'blob',
  });
  const blob = new Blob([res.data], { type: CONTENT_TYPE[format] });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filenamePrefix}.${EXTENSION[format]}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
