# PostgreSQL setup

All application records are read from and written to PostgreSQL. The former files in `data/` are only retained as a one-time migration backup and are not used by the running application.

1. Set `DATABASE_URL` in `.env.local`. For the included local PostgreSQL service, also set `POSTGRES_PASSWORD`:

   ```dotenv
   POSTGRES_PASSWORD=use-a-long-unique-password
   DATABASE_URL=postgresql://deal:use-a-long-unique-password@localhost:5432/deal
   ```

2. If PostgreSQL is not already running, start the local service:

   ```powershell
   docker compose up -d postgres
   ```

3. Create the schema and import the current JSON records once:

   ```powershell
   npm run db:migrate
   npm run db:import-legacy
   ```

The import uses upserts, so it can be run again safely. After checking the site and taking a backup, the legacy JSON files can be archived or removed manually. Uploaded images remain static assets under `public/uploads`; their metadata and URLs are stored in PostgreSQL.
