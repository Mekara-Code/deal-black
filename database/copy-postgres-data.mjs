import process from "node:process";
import pg from "pg";

const sourceConnectionString = process.env.SOURCE_DATABASE_URL;
const destinationConnectionString = process.env.DATABASE_URL;

if (!sourceConnectionString) {
  throw new Error("SOURCE_DATABASE_URL is required to copy data from the local PostgreSQL database.");
}

if (!destinationConnectionString) {
  throw new Error("DATABASE_URL is required to copy data to the destination PostgreSQL database.");
}

const tables = [
  "sectors",
  "team_members",
  "partner_logos",
  "partner_stories",
  "collaboration_requests",
  "contact_settings",
  "news_articles",
];

function quoteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

const source = new pg.Pool({
  connectionString: sourceConnectionString,
  ssl: process.env.SOURCE_DATABASE_SSL === "true" ? { rejectUnauthorized: process.env.SOURCE_DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined,
});

const destination = new pg.Pool({
  connectionString: destinationConnectionString,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined,
});

try {
  for (const table of tables) {
    const count = await destination.query(`SELECT COUNT(*)::integer AS count FROM ${quoteIdentifier(table)}`);
    if (count.rows[0].count > 0) {
      throw new Error(`Destination table ${table} is not empty. Data was not copied.`);
    }
  }

  const client = await destination.connect();
  try {
    await client.query("BEGIN");

    for (const table of tables) {
      const result = await source.query(`SELECT * FROM ${quoteIdentifier(table)}`);
      if (result.rows.length === 0) {
        console.log(`${table}: 0 rows`);
        continue;
      }

      const columns = Object.keys(result.rows[0]);
      const jsonColumns = new Set(
        result.fields
          .filter((field) => field.dataTypeID === 114 || field.dataTypeID === 3802)
          .map((field) => field.name),
      );
      const fields = columns.map(quoteIdentifier).join(", ");
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
      const statement = `INSERT INTO ${quoteIdentifier(table)} (${fields}) VALUES (${placeholders})`;

      for (const row of result.rows) {
        await client.query(
          statement,
          columns.map((column) => (jsonColumns.has(column) ? JSON.stringify(row[column]) : row[column])),
        );
      }

      console.log(`${table}: ${result.rows.length} rows`);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
} finally {
  await Promise.all([source.end(), destination.end()]);
}
