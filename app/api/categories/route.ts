import { ok } from "@/lib/api";
import { listCategories } from "@/lib/repo/categories";

export async function GET() {
  return ok(await listCategories());
}
