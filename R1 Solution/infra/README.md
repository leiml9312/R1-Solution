Placeholder for Azure infrastructure-as-code (Bicep or Terraform).

Will define, once ready to deploy:
- Azure Static Web App (frontend, and the Node Function App as its managed API)
- A second Azure Function App for the Python export functions
- Azure Database for PostgreSQL (Flexible Server)
- Storage account (required by Functions, and optionally for large export files via Blob Storage)
