import axios from 'axios';

// Base URL comes from VITE_API_BASE_URL (see .env.local). Points at the local
// mock server or Azure Functions Core Tools during development, and at the
// deployed Function App URL(s) once hosted on Azure.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:7071/api';

// Excel/PDF export routes live in the separate Python Function App, which the
// README runs on a different port (7072) than the Node CRUD API (7071).
// Defaults to API_BASE_URL so the single-port mock server keeps working with
// no extra config; override VITE_EXPORT_API_BASE_URL when running the real
// Functions apps locally, or once both are deployed behind their own URLs.
const EXPORT_API_BASE_URL = import.meta.env.VITE_EXPORT_API_BASE_URL ?? API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface RecordItem {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
}

export async function listRecords(): Promise<RecordItem[]> {
  const res = await apiClient.get<RecordItem[]>('/records');
  return res.data;
}

export async function createRecord(input: { name: string; amount: number }): Promise<RecordItem> {
  const res = await apiClient.post<RecordItem>('/records', input);
  return res.data;
}

export async function updateRecord(
  id: string,
  input: { name: string; amount: number },
): Promise<RecordItem> {
  const res = await apiClient.put<RecordItem>(`/records/${id}`, input);
  return res.data;
}

export async function deleteRecord(id: string): Promise<void> {
  await apiClient.delete(`/records/${id}`);
}

// Export endpoints are served by the Python Function App. During local dev
// with the mock server, these routes are stubbed too (see api-node/mock-server.js).
export function exportUrl(kind: 'excel' | 'pdf'): string {
  return `${EXPORT_API_BASE_URL}/export/${kind}`;
}
