import { Pool, type PoolClient } from "pg";

/**
 * Local development driver. @vercel/postgres only talks to hosted databases, so
 * a localhost POSTGRES_URL goes through plain `pg` with the same `sql` API.
 */
type Values = (string | number | boolean | undefined | null)[];

let pool: Pool | undefined;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.POSTGRES_URL, max: 10 });
    // A dropped idle connection must not crash the server. The pool discards
    // it and opens a new one when Postgres is reachable again.
    pool.on("error", (err) => {
      console.error("[db] idle connection lost:", err.message);
    });
  }
  return pool;
}

function toQuery(strings: TemplateStringsArray, values: Values) {
  const text = strings.reduce(
    (query, part, i) => `${query}$${i}${part}`,
  );
  return { text, values };
}

export function localSql(strings: TemplateStringsArray, ...values: Values) {
  const query = toQuery(strings, values);
  return getPool().query(query.text, query.values);
}

export const localDb = {
  async connect() {
    const client: PoolClient = await getPool().connect();
    return Object.assign(client, {
      sql(strings: TemplateStringsArray, ...values: Values) {
        const query = toQuery(strings, values);
        return client.query(query.text, query.values);
      },
    });
  },
};

export function isLocalDatabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}
