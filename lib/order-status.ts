import type { OrderStatus } from "./types";

/** Shared by the admin pages and the server, so they can't drift apart. */
export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "New",
  processing: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};
