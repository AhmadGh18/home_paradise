// Runs a real Postgres for local development, with its data in ./.localdb.
// Usage: npm run db:local (leave it running; Ctrl+C to stop).
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import EmbeddedPostgres from "embedded-postgres";
import pg from "pg";

const PORT = 5433;
const databaseDir = resolve(".localdb");
const firstRun = !existsSync(join(databaseDir, "PG_VERSION"));

/** True if a Postgres on this port can actually answer a query. */
async function isHealthy() {
  const client = new pg.Client({
    connectionString: `postgres://local:local@localhost:${PORT}/hompar`,
    connectionTimeoutMillis: 5000,
  });
  client.on("error", () => {});
  try {
    await client.connect();
    await client.query("SELECT 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

function stopExistingServer() {
  const platform = process.platform === "win32" ? "windows" : process.platform;
  const binary = process.platform === "win32" ? "pg_ctl.exe" : "pg_ctl";
  const pgCtl = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "node_modules",
    "@embedded-postgres",
    `${platform}-${process.arch}`,
    "native",
    "bin",
    binary,
  );
  spawnSync(pgCtl, ["stop", "-D", databaseDir, "-m", "fast", "-t", "30"], {
    stdio: "ignore",
  });
}

// A leftover server is either fine to keep using, or stuck and needs replacing.
if (existsSync(join(databaseDir, "postmaster.pid"))) {
  if (await isHealthy()) {
    console.log(`Local database is already running on port ${PORT}.`);
    process.exit(0);
  }
  console.log("Found a stuck local database. Restarting it...");
  stopExistingServer();
}

const postgres = new EmbeddedPostgres({
  databaseDir,
  user: "local",
  password: "local",
  port: PORT,
  persistent: true,
});

try {
  if (firstRun) await postgres.initialise();
  await postgres.start();
  if (firstRun) await postgres.createDatabase("hompar");
} catch (err) {
  console.error("Could not start the local database.", err?.message ?? "");
  console.error(`Check whether something else is using port ${PORT}.`);
  process.exit(1);
}

console.log(`Local database ready on port ${PORT}.`);

const stop = async () => {
  await postgres.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);

// Keeps this process alive while Postgres runs.
setInterval(() => {}, 1 << 30);
