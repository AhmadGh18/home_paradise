import { NextResponse } from "next/server";
import { db, generateId } from "@/lib/data";
import type { Product } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const featured = searchParams.get("featured");

  let products = db.products;

  if (categoryId)
    products = products.filter((p) => p.categoryId === categoryId);
  if (featured === "true") products = products.filter((p) => p.featured);

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    let body: any;
    let imageValue: string | undefined;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      body = {} as any;
      form.forEach((val, key) => {
        if (key === "image" && val instanceof File) {
          // convert file to data URL
          // @ts-ignore Buffer exists in Node
          const f = val as File;
          // read file as arrayBuffer
          // Need to await per-file reading
        } else {
          body[key] = String(val);
        }
      });

      const imageFile = form.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        const ab = await imageFile.arrayBuffer();
        const b = Buffer.from(ab);
        imageValue = `data:${imageFile.type};base64,${b.toString("base64")}`;
      }
    } else {
      body = await request.json();
      imageValue = body.image;
    }

    const category = db.categories.find((c) => c.id === body.categoryId);

    const product: Product = {
      id: generateId("prod"),
      name: body.name,
      slug: body.slug,
      description: body.description,
      details: body.details ?? "",
      price: Number(body.price),
      originalPrice: body.originalPrice
        ? Number(body.originalPrice)
        : undefined,
      image: imageValue,
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
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
