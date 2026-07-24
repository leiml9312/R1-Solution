// Data access layer for "records". Switches between the in-memory mock and a
// real MongoDB (Azure Cosmos DB for MongoDB) implementation based on
// MONGODB_CONNECTION_STRING. The HTTP function handlers don't need to know
// which one is active.

import { ObjectId } from 'mongodb';
import { mockCreate, mockDelete, mockList, mockUpdate, RecordItem } from './mockData';
import { getDb } from './mongoClient';

const useMock = !process.env.MONGODB_CONNECTION_STRING || process.env.MONGODB_CONNECTION_STRING === 'mock';

const COLLECTION = 'records';

function toRecordItem(doc: any): RecordItem {
  return {
    id: doc._id.toString(),
    name: doc.name,
    amount: doc.amount,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
  };
}

export async function listAll(): Promise<RecordItem[]> {
  if (useMock) return mockList();
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).toArray();
  return docs.map(toRecordItem);
}

export async function create(input: { name: string; amount: number }): Promise<RecordItem> {
  if (useMock) return mockCreate(input);
  const db = await getDb();
  const doc = { ...input, createdAt: new Date() };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return toRecordItem({ _id: result.insertedId, ...doc });
}

export async function update(
  id: string,
  input: { name: string; amount: number },
): Promise<RecordItem | null> {
  if (useMock) return mockUpdate(id, input);
  const db = await getDb();
  const result = await db
    .collection(COLLECTION)
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: input }, { returnDocument: 'after' });
  return result ? toRecordItem(result) : null;
}

export async function remove(id: string): Promise<boolean> {
  if (useMock) return mockDelete(id);
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
