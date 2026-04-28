import { NextResponse } from 'next/server';
import { db, generateId } from '@/lib/data';
import type { Product } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const featured = searchParams.get('featured');

  let products = db.products;

  if (categoryId) products = products.filter((p) => p.categoryId === categoryId);
  if (featured === 'true') products = products.filter((p) => p.featured);

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const category = db.categories.find((c) => c.id === body.categoryId);

    const product: Product = {
      id: generateId('prod'),
      name: body.name,
      slug: body.slug,
      description: body.description,
      details: body.details ?? '',
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      image: body.image,
      categoryId: body.categoryId,
      categoryName: category?.name,
      badge: body.badge || undefined,
      stock: Number(body.stock),
      featured: Boolean(body.featured),
      createdAt: new Date().toISOString(),
    };

    db.products.push(product);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
