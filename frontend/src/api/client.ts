// Base URL comes from VITE_API_BASE_URL (see .env.local). Points at the local
// mock server or Azure Functions Core Tools during development, and at the
// deployed Function App URL(s) once hosted on Azure.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:7071/api';

// Excel/PDF export routes live in the separate Python Function App, which the
// README runs on a different port (7072) than the Node CRUD API (7071).
// Defaults to API_BASE_URL so the single-port mock server keeps working with
// no extra config; override VITE_EXPORT_API_BASE_URL when running the real
// Functions apps locally, or once both are deployed behind their own URLs.
export const EXPORT_API_BASE_URL = import.meta.env.VITE_EXPORT_API_BASE_URL ?? API_BASE_URL;
