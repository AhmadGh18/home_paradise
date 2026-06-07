import { NextResponse } from "next/server";

export const ok = <T>(data: T, status = 200) =>
  NextResponse.json(data, { status });

export const created = <T>(data: T) => NextResponse.json(data, { status: 201 });

export const badRequest = (message = "Invalid request") =>
  NextResponse.json({ error: message }, { status: 400 });

export const notFound = (message = "Not found") =>
  NextResponse.json({ error: message }, { status: 404 });

export const serverError = (message = "Server error") =>
  NextResponse.json({ error: message }, { status: 500 });

export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

async function fileToDataUrl(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buf.toString("base64")}`;
}

/**
 * Parses a request as JSON or multipart/form-data. When the body contains an
 * "image" file field, the file is read and exposed under `body.image` as a
 * base64 data URL.
 */
export async function parseRequestBody(
  request: Request,
): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return (await request.json()) as Record<string, unknown>;
  }

  const form = await request.formData();
  const body: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (key === "image" && value instanceof File) continue;
    body[key] = String(value);
  }
  const image = form.get("image");
  if (image instanceof File && image.size > 0) {
    body.image = await fileToDataUrl(image);
  }
  return body;
}
