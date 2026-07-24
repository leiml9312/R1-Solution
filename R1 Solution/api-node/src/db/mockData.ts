// In-memory fake "database" used whenever DATABASE_URL is unset or "mock".
// Resets every time the process restarts — good enough for local dev/testing
// of the UI and API shape before a real database is connected.

export interface RecordItem {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
}

let records: RecordItem[] = [
  { id: '1', name: 'Sample widget', amount: 42, createdAt: new Date().toISOString() },
  { id: '2', name: 'Sample gadget', amount: 17.5, createdAt: new Date().toISOString() },
];

let nextId = 3;

export function mockList(): RecordItem[] {
  return records;
}

export function mockCreate(input: { name: string; amount: number }): RecordItem {
  const item: RecordItem = {
    id: String(nextId++),
    name: input.name,
    amount: input.amount,
    createdAt: new Date().toISOString(),
  };
  records.push(item);
  return item;
}

export function mockUpdate(id: string, input: { name: string; amount: number }): RecordItem | null {
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...input };
  return records[idx];
}

export function mockDelete(id: string): boolean {
  const before = records.length;
  records = records.filter((r) => r.id !== id);
  return records.length < before;
}
