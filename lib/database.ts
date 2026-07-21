import "server-only";

import { Pool, type PoolClient, type QueryResultRow } from "pg";

declare global {
  // Reuse the pool during development hot reloads instead of opening a pool per module evaluation.
  var dealDatabasePool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required. Configure a PostgreSQL connection before starting DEAL.");
  }

  return new Pool({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined,
  });
}

function getPool() {
  const database = global.dealDatabasePool ?? createPool();

  if (process.env.NODE_ENV !== "production") {
    global.dealDatabasePool = database;
  }

  return database;
}

export function query<Row extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]) {
  return getPool().query<Row>(text, values);
}

export async function transaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
