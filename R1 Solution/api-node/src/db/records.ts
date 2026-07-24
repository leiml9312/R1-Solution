// Data access layer for "records". Switches between the in-memory mock and a
// real Azure Cosmos DB (NoSQL API) implementation based on
// COSMOS_CONNECTION_STRING. The HTTP function handlers don't need to know
// which one is active.

import { randomUUID } from 'crypto';
import { mockCreate, mockDelete, mockList, mockUpdate, RecordItem } from './mockData';
import { getContainer } from './cosmosClient';

const useMock = !process.env.COSMOS_CONNECTION_STRING || process.env.COSMOS_CONNECTION_STRING === 'mock';

function toRecordItem(doc: any): RecordItem {
  return {
    id: doc.id,
    name: doc.name,
    amount: doc.amount,
    createdAt: doc.createdAt,
  };
}

export async function listAll(): Promise<RecordItem[]> {
  if (useMock) return mockList();
  const container = await getContainer();
  const { resources } = await container.items
    .query('SELECT * FROM c ORDER BY c.createdAt DESC')
    .fetchAll();
  return resources.map(toRecordItem);
}

export async function create(input: { name: string; amount: number }): Promise<RecordItem> {
  if (useMock) return mockCreate(input);
  const container = await getContainer();
  const doc = { id: randomUUID(), ...input, createdAt: new Date().toISOString() };
  const { resource } = await container.items.create(doc);
  return toRecordItem(resource);
}

export async function update(
  id: string,
  input: { name: string; amount: number },
): Promise<RecordItem | null> {
  if (useMock) return mockUpdate(id, input);
  const container = await getContainer();
  try {
    const { resource: existing } = await container.item(id, id).read();
    if (!existing) return null;
    const updated = { ...existing, ...input };
    const { resource } = await container.item(id, id).replace(updated);
    return toRecordItem(resource);
  } catch (err: any) {
    if (err.code === 404) return null;
    throw err;
  }
}

export async function remove(id: string): Promise<boolean> {
  if (useMock) return mockDelete(id);
  const container = await getContainer();
  try {
    await container.item(id, id).delete();
    return true;
  } catch (err: any) {
    if (err.code === 404) return false;
    throw err;
  }
}
