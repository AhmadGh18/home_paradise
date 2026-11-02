import { HttpError, imageBytesToDataUrl } from "./api";
import type { OrderStatus, Product } from "./types";

type Body = Record<string, unknown>;

const invalid = (message: string) => new HttpError(400, message);

const ID_PATTERN = /^[\w-]{1,64}$/;

export function isValidId(id: unknown): id is string {
  return typeof id === "string" && ID_PATTERN.test(id);
}

function readString(
  body: Body,
  key: string,
  label: string,
  max: number,
): string | undefined {
  const value = body[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") throw invalid(`${label} must be text`);
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw invalid(`${label} must be ${max} characters or fewer`);
  }
  return trimmed;
}

function requireString(
  body: Body,
  key: string,
  label: string,
  max: number,
): string {
  const value = readString(body, key, label, max);
  if (!value) throw invalid(`${label} is required`);
  return value;
}

function readNumber(value: unknown, label: string, max: number): number {
  // Number("") is 0 and Number(true) is 1, so only accept real numeric input.
  const isNumeric =
    typeof value === "number" ||
    (typeof value === "string" && value.trim() !== "");
  const parsed = isNumeric ? Number(value) : NaN;
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > max) {
    throw invalid(`Invalid ${label}`);
  }
  return parsed;
}

const MAX_PRICE = 1_000_000;
const MAX_STOCK = 1_000_000;

const parsePrice = (value: unknown, label: string) =>
  Math.round(readNumber(value, label, MAX_PRICE) * 100) / 100;

function parseStock(value: unknown): number {
  const stock = readNumber(value, "stock", MAX_STOCK);
  if (!Number.isInteger(stock)) throw invalid("Invalid stock");
  return stock;
}

function parseFeatured(value: unknown): boolean {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  throw invalid("Invalid featured value");
}

const DATA_URL = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/]+={0,2})$/;

/** Decodes a stored or submitted image data URL, or null if it isn't one. */
export function parseImageDataUrl(
  value: string,
): { type: string; bytes: Buffer } | null {
  const match = DATA_URL.exec(value);
  return match
    ? { type: match[1], bytes: Buffer.from(match[2], "base64") }
    : null;
}

/** Hosts allowed by `images.remotePatterns` in next.config.ts. */
const IMAGE_HOSTS = new Set(["images.unsplash.com"]);

/**
 * `next/image` throws on hosts missing from next.config.ts, which would take
 * the storefront page down, so only sources it can render are accepted.
 */
function parseImage(value: string): string {
  if (value === "") return "";
  if (value.startsWith("data:")) {
    const decoded = parseImageDataUrl(value);
    if (!decoded) throw invalid("Image must be a JPEG, PNG, WebP or GIF");
    return imageBytesToDataUrl(decoded.bytes);
  }
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) {
    return value;
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw invalid("Invalid image URL");
  }
  if (url.protocol !== "https:" || !IMAGE_HOSTS.has(url.hostname)) {
    throw invalid(
      `Image URLs must use https and one of: ${[...IMAGE_HOSTS].join(", ")}. Upload the file instead.`,
    );
  }
  return value;
}

function parseSlug(value: string): string {
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw invalid("Slug may only contain lowercase letters, numbers and hyphens");
  }
  return value;
}

/** An empty value clears the optional price; anything else must be valid. */
function parseOriginalPrice(value: unknown): number | undefined {
  if (value === null || value === "") return undefined;
  return parsePrice(value, "original price");
}

export type ProductFields = Pick<
  Product,
  "name" | "slug" | "description" | "price" | "stock" | "featured" | "image"
> &
  Pick<Product, "details" | "originalPrice" | "badge"> & {
    categoryId: string;
  };

export function parseNewProduct(body: Body): ProductFields {
  const image = readString(body, "image", "Image", Infinity) ?? "";
  return {
    name: requireString(body, "name", "Name", 200),
    slug: parseSlug(requireString(body, "slug", "Slug", 200)),
    description: requireString(body, "description", "Description", 2000),
    details: readString(body, "details", "Details", 10_000) || undefined,
    price: parsePrice(body.price, "price"),
    originalPrice:
      body.originalPrice === undefined
        ? undefined
        : parseOriginalPrice(body.originalPrice),
    stock: parseStock(body.stock),
    featured: body.featured === undefined ? false : parseFeatured(body.featured),
    image: parseImage(image),
    badge: readString(body, "badge", "Badge", 40) || undefined,
    categoryId: requireString(body, "categoryId", "Category", 64),
  };
}

export type ProductPatch = Partial<ProductFields>;

/**
 * Only fields present in the body end up in the patch. An image or slug that
 * matches the stored value is skipped, so editing an older product doesn't fail
 * because of a value it was saved with before these rules existed.
 */
export function parseProductPatch(body: Body, existing: Product): ProductPatch {
  const patch: ProductPatch = {};

  if (body.name !== undefined) {
    patch.name = requireString(body, "name", "Name", 200);
  }
  if (body.slug !== undefined && body.slug !== existing.slug) {
    patch.slug = parseSlug(requireString(body, "slug", "Slug", 200));
  }
  if (body.description !== undefined) {
    patch.description = requireString(body, "description", "Description", 2000);
  }
  if (body.details !== undefined) {
    patch.details = readString(body, "details", "Details", 10_000);
  }
  if (body.image !== undefined && body.image !== existing.image) {
    patch.image = parseImage(readString(body, "image", "Image", Infinity) ?? "");
  }
  if (body.badge !== undefined) {
    patch.badge = readString(body, "badge", "Badge", 40) || undefined;
  }
  if (body.featured !== undefined) patch.featured = parseFeatured(body.featured);
  if (body.price !== undefined) patch.price = parsePrice(body.price, "price");
  if (body.originalPrice !== undefined) {
    patch.originalPrice = parseOriginalPrice(body.originalPrice);
  }
  if (body.stock !== undefined) patch.stock = parseStock(body.stock);
  if (body.categoryId !== undefined) {
    patch.categoryId = requireString(body, "categoryId", "Category", 64);
  }
  return patch;
}

const MAX_ORDER_LINES = 50;
const MAX_QUANTITY_PER_PRODUCT = 100;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+(\p{Nd}][\p{Nd}\s().-]{5,29}$/u;

export interface NewOrder {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: { productId: string; quantity: number }[];
}

export function parseNewOrder(body: Body): NewOrder {
  const customerName = requireString(body, "customerName", "Name", 120);
  const customerEmail = requireString(body, "customerEmail", "Email", 254);
  const customerPhone = requireString(body, "customerPhone", "Phone", 30);
  const address = requireString(body, "address", "Address", 500);

  if (!EMAIL.test(customerEmail)) throw invalid("Invalid email address");
  if (!PHONE.test(customerPhone)) throw invalid("Invalid phone number");

  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw invalid("Order must contain items");
  }
  if (rawItems.length > MAX_ORDER_LINES) {
    throw invalid(`Orders are limited to ${MAX_ORDER_LINES} different products`);
  }

  // Only the product and quantity are read: prices and names come from the
  // database when the order is placed, so a client can't forge the total.
  const quantities = new Map<string, number>();
  for (const raw of rawItems) {
    const { productId, quantity } = (raw ?? {}) as {
      productId?: unknown;
      quantity?: unknown;
    };
    if (!isValidId(productId)) throw invalid("Invalid product in order");
    if (!Number.isInteger(quantity) || (quantity as number) <= 0) {
      throw invalid("Each item requires a positive whole quantity");
    }
    const total = (quantities.get(productId) ?? 0) + (quantity as number);
    if (total > MAX_QUANTITY_PER_PRODUCT) {
      throw invalid(
        `Orders are limited to ${MAX_QUANTITY_PER_PRODUCT} of each product`,
      );
    }
    quantities.set(productId, total);
  }

  return {
    customerName,
    customerEmail,
    customerPhone,
    address,
    items: [...quantities].map(([productId, quantity]) => ({
      productId,
      quantity,
    })),
  };
}

const ORDER_STATUSES: readonly OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function parseOrderStatus(value: unknown): OrderStatus {
  if (!ORDER_STATUSES.includes(value as OrderStatus)) {
    throw invalid("Invalid status");
  }
  return value as OrderStatus;
}
