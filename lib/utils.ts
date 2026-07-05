/** Local fallback shown when a product/category has no image. */
export const PLACEHOLDER_IMAGE = "/placeholder-product.svg";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(price: number): string {
  return priceFormatter.format(Number.isFinite(price) ? price : 0);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
