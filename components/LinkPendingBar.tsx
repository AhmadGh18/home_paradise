"use client";

import { useLinkStatus } from "next/link";

/**
 * A thin bar along the top of the screen while this link's page loads. Fast
 * navigations finish during its delay, so it only appears when one is slow.
 * Must be rendered inside a <Link>.
 */
export default function LinkPendingBar() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <span aria-hidden="true" className="link-pending-bar" />;
}
