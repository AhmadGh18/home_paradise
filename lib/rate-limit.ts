import { createHash } from "node:crypto";
import { HttpError } from "./api";
import { createRateLimitsTable, sql } from "./db";

let tableReady: Promise<unknown> | undefined;

function ensureTable(): Promise<unknown> {
  tableReady ??= createRateLimitsTable().catch((err) => {
    tableReady = undefined;
    throw err;
  });
  return tableReady;
}

/**
 * The client address as reported by the platform. Vercel overwrites this
 * header; if self-hosting, the reverse proxy in front must do the same,
 * otherwise clients can spoof it and dodge the limits.
 */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/** Addresses are hashed so the table doesn't accumulate personal data. */
function bucketKey(scope: string, request: Request, shared?: boolean): string {
  if (shared) return `${scope}:all`;
  const hash = createHash("sha256").update(clientIp(request)).digest("hex");
  return `${scope}:${hash}`;
}

interface Limit {
  scope: string;
  max: number;
  windowSeconds: number;
  /** One counter for everyone, which a changing or faked address can't dodge. */
  shared?: boolean;
}

/**
 * Counts a request against a per-client limit and throws a 429 once it's used
 * up. Counters live in Postgres because serverless instances share no memory.
 */
export async function enforceRateLimit(
  request: Request,
  { scope, max, windowSeconds, shared }: Limit,
): Promise<void> {
  await ensureTable();
  const key = bucketKey(scope, request, shared);

  const { rows } = await sql`
    INSERT INTO rate_limits (key, count, reset_at)
    VALUES (${key}, 1, now() + make_interval(secs => ${windowSeconds}::double precision))
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN rate_limits.reset_at <= now() THEN 1 ELSE rate_limits.count + 1 END,
      reset_at = CASE WHEN rate_limits.reset_at <= now() THEN EXCLUDED.reset_at ELSE rate_limits.reset_at END
    RETURNING count, CEIL(EXTRACT(EPOCH FROM reset_at - now())) AS retry_after
  `;

  // Occasional cleanup, so expired buckets don't pile up.
  if (Math.random() < 0.01) {
    await sql`DELETE FROM rate_limits WHERE reset_at < now()`.catch(() => {});
  }

  if (Number(rows[0].count) > max) {
    throw new HttpError(429, "Too many attempts. Please try again later.", {
      "Retry-After": String(rows[0].retry_after),
    });
  }
}

export async function resetRateLimit(
  request: Request,
  { scope, shared }: Pick<Limit, "scope" | "shared">,
): Promise<void> {
  await sql`DELETE FROM rate_limits WHERE key = ${bucketKey(scope, request, shared)}`;
}
