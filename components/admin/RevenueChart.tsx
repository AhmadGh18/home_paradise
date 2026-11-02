"use client";

import { useState } from "react";
import type { RevenueBucket } from "@/lib/dashboard";
import { formatPrice } from "@/lib/utils";

const TICK_COUNT = 4;

/** Rounds up to a clean axis maximum, such as 40, 100 or 2,500. */
function niceMax(value: number): number {
  const step = value / TICK_COUNT;
  const magnitude = 10 ** Math.floor(Math.log10(step));
  const nice = [1, 2, 2.5, 5, 10].find((n) => n * magnitude >= step) ?? 10;
  return nice * magnitude * TICK_COUNT;
}

const axisMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const axisMoneyCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 0,
});

export default function RevenueChart({ buckets }: { buckets: RevenueBucket[] }) {
  const [active, setActive] = useState<number | null>(null);
  const highest = Math.max(...buckets.map((b) => b.revenue));

  if (highest === 0) {
    return (
      <p className="flex h-[200px] items-center justify-center text-[14px] text-ink-soft">
        No sales in this period.
      </p>
    );
  }

  const max = niceMax(highest);
  const format = max >= 10_000 ? axisMoneyCompact : axisMoney;
  const ticks = Array.from(
    { length: TICK_COUNT + 1 },
    (_, i) => (max / TICK_COUNT) * (TICK_COUNT - i),
  );
  const middle = Math.floor((buckets.length - 1) / 2);
  const activeBucket = active === null ? null : buckets[active];
  const activeLeft =
    active === null ? 0 : ((active + 0.5) / buckets.length) * 100;

  return (
    <div>
      <div className="flex gap-3">
        {/* Y axis */}
        <div className="flex h-[200px] flex-col justify-between text-right text-[12px] tabular-nums text-ink-soft">
          {/* Zero-height rows centre each label on its gridline. */}
          {ticks.map((tick) => (
            <span key={tick} className="flex h-px items-center justify-end">
              {format.format(tick)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-[200px]">
            {/* Gridlines */}
            <div
              className="absolute inset-0 flex flex-col justify-between"
              aria-hidden="true"
            >
              {ticks.map((tick) => (
                <div key={tick} className="h-px bg-cream-deep" />
              ))}
            </div>

            {/* Bars: each column is a hit target far larger than its mark. */}
            <div
              className="absolute inset-0 flex"
              onPointerLeave={() => setActive(null)}
            >
              {buckets.map((bucket, i) => (
                <div
                  key={bucket.label}
                  tabIndex={0}
                  role="img"
                  aria-label={`${bucket.label}: ${formatPrice(bucket.revenue)} from ${bucket.orders} ${bucket.orders === 1 ? "order" : "orders"}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="flex h-full min-w-0 flex-1 items-end justify-center px-px outline-none focus-visible:bg-cream-deep/70"
                >
                  {bucket.revenue > 0 && (
                    <div
                      className={`w-full max-w-6 rounded-t-[4px] transition-colors duration-150 ${
                        active === i ? "bg-sage-dark" : "bg-chart"
                      }`}
                      style={{
                        height: `${(bucket.revenue / max) * 100}%`,
                        minHeight: 2,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Tooltip. Shifting by its own position keeps it inside the card. */}
            {activeBucket && (
              <div
                className="pointer-events-none absolute top-0 z-10 whitespace-nowrap border border-beige bg-white px-3 py-2 shadow-sm"
                style={{
                  left: `${activeLeft}%`,
                  transform: `translateX(-${activeLeft}%)`,
                }}
              >
                <p className="text-[15px] font-semibold text-ink">
                  {formatPrice(activeBucket.revenue)}
                </p>
                <p className="text-[12px] text-ink-soft">
                  {activeBucket.label} · {activeBucket.orders}{" "}
                  {activeBucket.orders === 1 ? "order" : "orders"}
                </p>
              </div>
            )}
          </div>

          {/* X axis: only the start, middle and end are labelled. */}
          <div className="relative mt-2 h-4 text-[12px] leading-none text-ink-soft">
            <span className="absolute left-0">
              {buckets[0].label.split(" – ")[0]}
            </span>
            <span className="absolute left-1/2 -translate-x-1/2">
              {buckets[middle].label.split(" – ")[0]}
            </span>
            <span className="absolute right-0">
              {buckets[buckets.length - 1].label.split(" – ").pop()}
            </span>
          </div>
        </div>
      </div>

      <details className="mt-4 border-t border-beige pt-3">
        <summary className="cursor-pointer text-[13px] text-ink-soft hover:text-ink">
          View as table
        </summary>
        <div className="mt-3 max-h-64 overflow-y-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-beige text-left text-ink-soft">
                <th scope="col" className="py-2 font-medium">Period</th>
                <th scope="col" className="py-2 text-right font-medium">Orders</th>
                <th scope="col" className="py-2 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {buckets.map((bucket) => (
                <tr key={bucket.label} className="border-b border-cream-deep">
                  <td className="py-1.5 text-ink">{bucket.label}</td>
                  <td className="py-1.5 text-right text-ink">{bucket.orders}</td>
                  <td className="py-1.5 text-right text-ink">{formatPrice(bucket.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
