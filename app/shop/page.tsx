import StoreLayout from "@/components/StoreLayout";
import { listCategories } from "@/lib/repo/categories";
import { listProducts } from "@/lib/repo/products";
import ShopClient from "./ShopClient";

export default function ShopPage() {
  const products = listProducts();
  const categories = listCategories();

  return (
    <StoreLayout>
      <ShopClient products={products} categories={categories} />
    </StoreLayout>
  );
}
