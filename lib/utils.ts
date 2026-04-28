export function formatPrice(price: number): string {
  return `$${price.toFixed(0)}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
