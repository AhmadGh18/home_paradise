import StoreLayout from "@/components/StoreLayout";
import { listCategories } from "@/lib/repo/categories";
import { listProducts } from "@/lib/repo/products";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const [{ category }, products, categories] = await Promise.all([
    searchParams,
    listProducts(),
    listCategories(),
  ]);

  // The deep-link uses a category slug; ShopClient filters by id.
  const initialCategory =
    categories.find((c) => c.slug === category || c.id === category)?.id ??
    "all";

  return (
    <StoreLayout>
      <ShopClient
        products={products}
        categories={categories}
        initialCategory={initialCategory}
      />
    </StoreLayout>
  );
}
