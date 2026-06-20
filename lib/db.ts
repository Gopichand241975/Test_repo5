import { Pool } from "pg";

// Aurora PostgreSQL connection pool.
// Set DATABASE_URL in your environment, e.g.:
// postgres://<user>:<password>@<aurora-cluster-endpoint>:5432/<dbname>?sslmode=require
//
// In Vercel: Project Settings -> Environment Variables -> DATABASE_URL

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add your Aurora PostgreSQL connection string to your environment variables."
    );
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Aurora requires SSL by default
    max: 5,
  });
}

// Reuse the pool across hot reloads in dev / across invocations in serverless.
const pool = global._pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export default pool;

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}
