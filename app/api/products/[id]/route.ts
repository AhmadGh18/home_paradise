import { NextResponse } from "next/server";
import { db } from "@/lib/data";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const product = db.products.find((p) => p.id === id);
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    let body: any;
    let imageValue: string | undefined;
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      body = {} as any;
      form.forEach((val, key) => {
        if (key === "image") return; // handle separately
        body[key] = String(val);
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
    const existing = db.products[idx];

    db.products[idx] = {
      ...existing,
      name: body.name ?? existing.name,
      slug: body.slug ?? existing.slug,
      description: body.description ?? existing.description,
      details: body.details ?? existing.details,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      originalPrice: body.originalPrice
        ? Number(body.originalPrice)
        : existing.originalPrice,
      image: imageValue ?? body.image ?? existing.image,
      categoryId: body.categoryId ?? existing.categoryId,
      categoryName: category?.name ?? existing.categoryName,
      badge: body.badge || undefined,
      stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
      featured:
        body.featured !== undefined
          ? Boolean(body.featured)
          : existing.featured,
    };

    return NextResponse.json(db.products[idx]);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.products.splice(idx, 1);
  return NextResponse.json({ success: true });
}
