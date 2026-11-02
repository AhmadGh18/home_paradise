import { notFound, route } from "@/lib/api";
import { findProductImage } from "@/lib/repo/products";
import { isValidId, parseImageDataUrl } from "@/lib/validation";

interface Context {
  params: Promise<{ id: string; version: string }>;
}

/** Serves an uploaded product image. The version in the URL changes with it. */
export const GET = route<Context>(async (_request, { params }) => {
  const { id, version } = await params;
  const stored = isValidId(id) ? await findProductImage(id) : undefined;
  const decoded = stored ? parseImageDataUrl(stored.image) : null;
  if (!stored || !decoded) return notFound();

  return new Response(new Uint8Array(decoded.bytes), {
    headers: {
      "Content-Type": decoded.type,
      // An out-of-date link still shows the current image, but mustn't be
      // cached for long under a URL that was meant to be permanent.
      "Cache-Control":
        version === stored.version
          ? "public, max-age=31536000, immutable"
          : "public, max-age=60",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
});
