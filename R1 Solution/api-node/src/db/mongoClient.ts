// Lazily-created singleton MongoDB client, pointed at Azure Cosmos DB for
// MongoDB (RU-based, free tier) once MONGODB_CONNECTION_STRING is set to a
// real connection string. Until then, records.ts uses the in-memory mock
// instead of ever touching this file.

import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  const connectionString = process.env.MONGODB_CONNECTION_STRING;
  const dbName = process.env.MONGODB_DB_NAME || 'r1solution';

  if (!connectionString || connectionString === 'mock') {
    throw new Error('MONGODB_CONNECTION_STRING is not set — getDb() should not be called in mock mode.');
  }

  client = new MongoClient(connectionString);
  await client.connect();
  db = client.db(dbName);
  return db;
}
