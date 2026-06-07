import StoreLayout from "@/components/StoreLayout";
import { listCategories } from "@/lib/repo/categories";
import { listProducts } from "@/lib/repo/products";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  return (
    <StoreLayout>
      <ShopClient products={products} categories={categories} />
    </StoreLayout>
  );
}
