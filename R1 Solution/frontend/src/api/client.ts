import axios from 'axios';

// Base URL comes from VITE_API_BASE_URL (see .env.local). Points at the local
// mock server or Azure Functions Core Tools during development, and at the
// deployed Function App URL(s) once hosted on Azure.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:7071/api';

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
  return `${API_BASE_URL}/export/${kind}`;
}
