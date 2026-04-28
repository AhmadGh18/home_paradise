import { getProducts, getCategories } from '@/lib/data';
import StoreLayout from '@/components/StoreLayout';
import ShopClient from './ShopClient';

export default function ShopPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <StoreLayout>
      <ShopClient products={products} categories={categories} />
    </StoreLayout>
  );
}
