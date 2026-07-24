# Same fake dataset shape as api-node/src/db/mockData.ts, kept here so the
# Python export functions can generate files locally before a real DB and a
# real inter-service data path (shared DB, or a call to the Node API) exist.
#
# When MONGODB_CONNECTION_STRING is set to a real Azure Cosmos DB for MongoDB
# connection string, replace get_records() with a real query via pymongo
# (add `pymongo` to requirements.txt).

import os


def get_records():
    connection_string = os.environ.get("MONGODB_CONNECTION_STRING", "mock")
    use_mock = connection_string == "mock"

    if use_mock:
        return [
            {"name": "Sample widget", "amount": 42, "createdAt": "2026-01-01T00:00:00Z"},
            {"name": "Sample gadget", "amount": 17.5, "createdAt": "2026-01-02T00:00:00Z"},
        ]

    # Placeholder for the real implementation:
    # from pymongo import MongoClient
    # client = MongoClient(connection_string)
    # db = client[os.environ.get("MONGODB_DB_NAME", "r1solution")]
    # return list(db.records.find({}, {"_id": 0}))
    raise NotImplementedError("Real DB access not wired up yet — set MONGODB_CONNECTION_STRING=mock for now.")
