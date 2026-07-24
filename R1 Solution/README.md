# R1 Solution

React UI (Material UI) + Azure Functions serverless backend (Node/TypeScript for CRUD, Python for Excel/PDF export).

## Folder structure

```
R1 Solution/
├── frontend/        React app (Vite + MUI)
├── api-node/         Azure Functions (Node/TS) - CRUD, uses mock in-memory DB until a real MONGODB_CONNECTION_STRING is set
├── api-python/       Azure Functions (Python) - Excel/PDF export, uses mock data until wired to the real DB
└── infra/            Placeholder for Bicep/Terraform (added later, before Azure deployment)
```

## Database

Planned: **Azure Cosmos DB for MongoDB** (RU-based), using Azure's lifetime free tier (1,000 RU/s + 25 GB storage, free forever, one per subscription). It speaks the standard MongoDB wire protocol, so the Node API uses the plain `mongodb` npm driver and the Python export functions would use `pymongo` — no special SDK. Not provisioned yet.

## Status

This is a skeleton only:
- No real database is connected yet. `api-node` and `api-python` both fall back to an in-memory mock dataset (see `api-node/src/db/mockData.ts` and `api-python/shared/mock_data.py`) whenever `MONGODB_CONNECTION_STRING` is unset or `"mock"`.
- Nothing has been deployed to Azure. Deployment/infra (Bicep, Function Apps, Static Web App, Cosmos DB) comes later.
- Not committed to git yet, per instructions.

## Running locally

You'll need Node.js 18+, and for the Python function app: Python 3.10+ and the [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) (`func`) if you want to run the Functions themselves rather than just the frontend.

### 1. Frontend only, against the built-in local mock server (fastest way to see the UI working)

No Azure Functions Core Tools required — a tiny zero-dependency mock server is included.

```bash
cd api-node
node mock-server.js
# serves the same CRUD endpoints as the real Functions app, on http://localhost:7071/api
```

In a second terminal:

```bash
cd frontend
npm install
npm run dev
# open the printed localhost URL (usually http://localhost:5173)
```

The frontend calls `VITE_API_BASE_URL` (see `frontend/.env.local`, defaults to `http://localhost:7071/api`), so it talks to the mock server exactly like it would talk to the real Azure Functions app.

### 2. Running the real Azure Functions locally (once Core Tools are installed)

```bash
cd api-node
npm install
npm start        # runs `func start`, serves on http://localhost:7071/api, still using the mock in-memory DB
```

```bash
cd api-python
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
func start --port 7072   # export endpoints, also on mock data
```

### 3. Switching to a real database later

1. Create an Azure Cosmos DB for MongoDB (RU-based) account on the free tier, and grab its connection string.
2. Set `MONGODB_CONNECTION_STRING` (and optionally `MONGODB_DB_NAME`) in `api-node/local.settings.json` (local) or the Function App's environment settings (deployed) to that connection string.
3. That's it on the Node side — `api-node/src/db/records.ts` automatically switches from the in-memory mock to real MongoDB calls (via `api-node/src/db/mongoClient.ts`) as soon as the connection string is present and isn't `"mock"`.
4. For the Python export functions, add `pymongo` to `api-python/requirements.txt` and fill in the real query in `api-python/shared/mock_data.py` (the placeholder code is already sketched in a comment there), then set the same `MONGODB_CONNECTION_STRING` in `api-python/local.settings.json`.
