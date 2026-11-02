import { ok, route } from "@/lib/api";
import { listCategories } from "@/lib/repo/categories";

export const GET = route(async () => ok(await listCategories()));
