# R1 Solution

React UI (Material UI) + Azure Functions serverless backend (Node/TypeScript for CRUD, Python for Excel/PDF export).

## Folder structure

```
R1 Solution/
├── frontend/        React app (Vite + MUI)
├── api-node/         Azure Functions (Node/TS) - CRUD, uses mock in-memory DB until a real COSMOS_CONNECTION_STRING is set
├── api-python/       Azure Functions (Python) - Excel/PDF export, uses mock data until wired to the real DB
└── infra/            Placeholder for Bicep/Terraform (added later, before Azure deployment)
```

## Database

Planned: **Azure Cosmos DB for NoSQL** (RU-based), using Azure's lifetime free tier (1,000 RU/s + 25 GB storage, free forever, one per subscription). The Node API uses the `@azure/cosmos` npm package, and the Python export functions would use the `azure-cosmos` package — the native Cosmos SDKs, not a Mongo- or Postgres-compatible driver. Not provisioned yet.

## Status

This is a skeleton only:
- No real database is connected yet. `api-node` and `api-python` both fall back to an in-memory mock dataset (see `api-node/src/db/mockData.ts` and `api-python/shared/mock_data.py`) whenever `COSMOS_CONNECTION_STRING` is unset or `"mock"`.
- Nothing has been deployed to Azure. Deployment/infra (Bicep, Function Apps, Static Web App, Cosmos DB) comes later.
- Not committed to git yet, per instructions.

## Running locally

You'll need Node.js 18+, and for the Python function app: Python 3.10+ and the [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) (`func`) if you want to run the Functions themselves rather than just the frontend.

### 1. Frontend only (fastest way to see the UI working)

The Customers/Orders pages use frontend-only mock data (`frontend/src/data/mockCustomers.ts`) — no backend needed to browse them. Document export (Excel/PDF) does need `api-python` running (see section 2).

```bash
cd frontend
npm install
npm run dev
# open the printed localhost URL (usually http://localhost:5173)
```

`api-node`'s generic CRUD API (`mock-server.js` or `func start`, `/api/records`) still exists and works the same as before — it's just not wired into any page currently, since the old generic Records page was replaced by Customers.

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

The Export Excel/PDF buttons call a separate base URL from the CRUD API, since they're served by `api-python` (port 7072) rather than `api-node` (port 7071). Set `VITE_EXPORT_API_BASE_URL=http://localhost:7072/api` in `frontend/.env.local` when running both real Function Apps locally — otherwise export requests go to `api-node`, which has no `/export/*` routes, and you'll get a 404 instead of a file.

## Customers, Orders & Documents

Behind sign-in:

- `/customers` — list of customers (frontend-only mock data for now, see `frontend/src/data/mockCustomers.ts`).
- `/customers/:customerId` — customer info, plus embedded Packing List and Statement export forms (tabs). The Statement form is pre-filled with that customer's orders from the past month; both stay fully editable.
- `/customers/:customerId/orders` — that customer's orders, each with a status (Intake / In Progress / Completed) and a "Generate Invoice" action.
- `/customers/:customerId/orders/:orderId/invoice` — an Invoice form pre-filled from the order's line items, still editable before export.

Each export form (Invoice, Packing List, Statement) is modeled on the company's existing Excel template (`R.1 SOLUTION (HK) CO., LIMITED` letterhead). "Export Excel"/"Export PDF" POST the form data to `api-python` and download a generated file with the letterhead image baked in:

- `POST /api/documents/invoice/{excel|pdf}`
- `POST /api/documents/packing-list/{excel|pdf}`
- `POST /api/documents/statement/{excel|pdf}`

Generation logic lives in `api-python/shared/documents.py`. The `.xlsx` outputs use real formulas (line totals, sums, and — for the Statement — `SUMIFS`-based aging buckets computed against the Date field) rather than pre-computed values, so they keep recalculating if edited afterward. This feature has no mock-server equivalent — it needs `api-python` running (see section 2 above); `mock-server.js` returns a `501` explaining that if you hit it without the Python app running.

### 3. Switching to a real database later

1. Create an Azure Cosmos DB for NoSQL account on the free tier, and grab its connection string.
2. Set `COSMOS_CONNECTION_STRING` (and optionally `COSMOS_DATABASE_NAME` / `COSMOS_CONTAINER_NAME`) in `api-node/local.settings.json` (local) or the Function App's environment settings (deployed) to that connection string.
3. That's it on the Node side — `api-node/src/db/records.ts` automatically switches from the in-memory mock to real Cosmos DB calls (via `api-node/src/db/cosmosClient.ts`, using the `@azure/cosmos` SDK) as soon as the connection string is present and isn't `"mock"`.
4. For the Python export functions, add `azure-cosmos` to `api-python/requirements.txt` and fill in the real query in `api-python/shared/mock_data.py` (the placeholder code is already sketched in a comment there), then set the same `COSMOS_CONNECTION_STRING` in `api-python/local.settings.json`.
