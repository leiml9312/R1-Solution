// Lazily-created singleton Cosmos DB client/container, pointed at Azure
// Cosmos DB for NoSQL once COSMOS_CONNECTION_STRING is set to a real
// connection string. Until then, records.ts uses the in-memory mock instead
// of ever touching this file.

import { Container, CosmosClient } from '@azure/cosmos';

let client: CosmosClient | null = null;
let container: Container | null = null;

export async function getContainer(): Promise<Container> {
  if (container) return container;

  const connectionString = process.env.COSMOS_CONNECTION_STRING;
  const databaseName = process.env.COSMOS_DATABASE_NAME || 'r1solution';
  const containerName = process.env.COSMOS_CONTAINER_NAME || 'records';

  if (!connectionString || connectionString === 'mock') {
    throw new Error('COSMOS_CONNECTION_STRING is not set — getContainer() should not be called in mock mode.');
  }

  client = new CosmosClient(connectionString);
  const { database } = await client.databases.createIfNotExists({ id: databaseName });
  const { container: c } = await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: { paths: ['/id'] },
  });
  container = c;
  return container;
}
