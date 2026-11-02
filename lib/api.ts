import { NextResponse, type NextRequest } from "next/server";

export const ok = <T>(data: T, status = 200) =>
  NextResponse.json(data, { status });

export const created = <T>(data: T) => NextResponse.json(data, { status: 201 });

export const badRequest = (message = "Invalid request") =>
  NextResponse.json({ error: message }, { status: 400 });

export const notFound = (message = "Not found") =>
  NextResponse.json({ error: message }, { status: 404 });

export const serverError = (message = "Server error") =>
  NextResponse.json({ error: message }, { status: 500 });

/** An error whose message is safe to show to the API client. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly headers?: Record<string, string>,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function generateId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

/** True when a Postgres error is a unique-constraint violation. */
export function isUniqueViolation(err: unknown): boolean {
  return (err as { code?: unknown } | null)?.code === "23505";
}

function isCrossOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false; // Browsers always send Origin on these methods.
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host !== host;
  } catch {
    return true; // Includes the opaque "null" origin.
  }
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Wraps a route handler with the behaviour every endpoint needs: cross-origin
 * writes are rejected (CSRF defence), `HttpError`s become JSON responses, and
 * anything unexpected is logged and returned as a generic 500.
 */
export function route<Context = unknown>(
  handler: (request: NextRequest, context: Context) => Promise<Response>,
) {
  return async (request: NextRequest, context: Context): Promise<Response> => {
    try {
      if (!SAFE_METHODS.has(request.method) && isCrossOrigin(request)) {
        throw new HttpError(403, "Cross-origin request rejected");
      }
      return await handler(request, context);
    } catch (err) {
      if (err instanceof HttpError) {
        return NextResponse.json(
          { error: err.message },
          { status: err.status, headers: err.headers },
        );
      }
      // Only the message and code: driver errors can quote customer data.
      const { message, code } = (err ?? {}) as {
        message?: string;
        code?: string;
      };
      console.error(
        `[api] ${request.method} ${request.nextUrl.pathname} failed:`,
        code ?? "",
        message ?? "unknown error",
      );
      return serverError();
    }
  };
}

const tooLarge = () => new HttpError(413, "Request is too large");

async function readTextWithLimit(
  request: Request,
  maxBytes: number,
): Promise<string> {
  if (Number(request.headers.get("content-length")) > maxBytes) throw tooLarge();
  if (!request.body) return "";

  // Content-Length can be absent or wrong, so count what actually arrives.
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw tooLarge();
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

/**
 * Reads a JSON object from the request. Requiring the JSON content type also
 * stops cross-site HTML forms from reaching the handler without a preflight.
 */
export async function readJsonObject(
  request: Request,
  maxBytes = 64 * 1024,
): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new HttpError(415, "Content-Type must be application/json");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(await readTextWithLimit(request, maxBytes));
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(400, "Invalid JSON");
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new HttpError(400, "Expected a JSON object");
  }
  return parsed as Record<string, unknown>;
}

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/** Identifies an image from its leading bytes, ignoring what the client claims. */
function sniffImageType(bytes: Buffer): string | null {
  const ascii = (start: number, end: number) =>
    bytes.subarray(start, end).toString("latin1");
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (ascii(0, 8) === "\x89PNG\r\n\x1a\n") return "image/png";
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a") return "image/gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

/** Validates image bytes and returns them as a base64 data URL. */
export function imageBytesToDataUrl(bytes: Buffer): string {
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new HttpError(413, "Image must be 2 MB or smaller");
  }
  const type = sniffImageType(bytes);
  if (!type) throw new HttpError(400, "Image must be a JPEG, PNG, WebP or GIF");
  return `data:${type};base64,${bytes.toString("base64")}`;
}

/**
 * Parses a request as JSON or multipart/form-data. When the body contains an
 * "image" file field, the file is validated and exposed under `body.image` as
 * a base64 data URL.
 */
export async function parseRequestBody(
  request: Request,
): Promise<Record<string, unknown>> {
  // A base64 image is about a third larger than the file, plus the text fields.
  const maxBytes = MAX_IMAGE_BYTES * 2;

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return readJsonObject(request, maxBytes);
  }

  // formData() buffers the whole body, so the size must be declared up front.
  const declared = Number(request.headers.get("content-length"));
  if (!declared || declared > maxBytes) throw tooLarge();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new HttpError(400, "Invalid form data");
  }

  const body: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") body[key] = value;
  }
  const image = form.get("image");
  if (image instanceof File && image.size > 0) {
    body.image = imageBytesToDataUrl(Buffer.from(await image.arrayBuffer()));
  }
  return body;
}
