# Same fake dataset shape as api-node/src/db/mockData.ts, kept here so the
# Python export functions can generate files locally before a real DB and a
# real inter-service data path (shared DB, or a call to the Node API) exist.
#
# When COSMOS_CONNECTION_STRING is set to a real Azure Cosmos DB (NoSQL API)
# connection string, replace get_records() with a real query via
# azure-cosmos (add `azure-cosmos` to requirements.txt).

import os


def get_records():
    connection_string = os.environ.get("COSMOS_CONNECTION_STRING", "mock")
    use_mock = connection_string == "mock"

    if use_mock:
        return [
            {"name": "Sample widget", "amount": 42, "createdAt": "2026-01-01T00:00:00Z"},
            {"name": "Sample gadget", "amount": 17.5, "createdAt": "2026-01-02T00:00:00Z"},
        ]

    # Placeholder for the real implementation:
    # from azure.cosmos import CosmosClient
    # client = CosmosClient.from_connection_string(connection_string)
    # database = client.get_database_client(os.environ.get("COSMOS_DATABASE_NAME", "r1solution"))
    # container = database.get_container_client(os.environ.get("COSMOS_CONTAINER_NAME", "records"))
    # return list(container.query_items("SELECT c.name, c.amount, c.createdAt FROM c", enable_cross_partition_query=True))
    raise NotImplementedError("Real DB access not wired up yet — set COSMOS_CONNECTION_STRING=mock for now.")
