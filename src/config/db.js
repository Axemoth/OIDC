import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Use the environment variable if present, otherwise default to local docker setup
const connectionString = process.env.DATABASE_URL || "postgres://admin:password@localhost:5432/axemoth";

// Create a Postgres connection pool
const pool = new pg.Pool({
    connectionString,
});

// Export the Drizzle database instance
export const db = drizzle(pool);
