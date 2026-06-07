import { NextResponse } from "next/server";
import {
  generateId,
  getProducts,
  addProduct,
  getCategoryById,
} from "@/lib/data";
import type { Product } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const featured = searchParams.get("featured");

  let products = getProducts();
  if (categoryId)
    products = products.filter((p: Product) => p.categoryId === categoryId);
  if (featured === "true")
    products = products.filter((p: Product) => p.featured);

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
      for (const [key, val] of form.entries()) {
        if (key === "image") continue; // handle below
        body[key] = String(val);
      }

      const imageFile = form.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        const ab = await imageFile.arrayBuffer();
        // runtime-safe conversion to base64
        const toBase64 = (arrayBuffer: ArrayBuffer) => {
          if (typeof Buffer !== "undefined")
            return Buffer.from(arrayBuffer).toString("base64");
          const bytes = new Uint8Array(arrayBuffer);
          let binary = "";
          const chunkSize = 0x8000;
          for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode.apply(
              null,
              Array.from(bytes.subarray(i, i + chunkSize)),
            );
          }
          return globalThis.btoa(binary);
        };

        const base64 = toBase64(ab);
        imageValue = `data:${imageFile.type};base64,${base64}`;
      }
    } else {
      body = await request.json();
      imageValue = body.image;
    }

    const category = getCategoryById(body.categoryId);

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
      image: imageValue ?? body.image ?? "",
      categoryId: body.categoryId,
      categoryName: category?.name,
      badge: body.badge || undefined,
      stock: Number(body.stock),
      featured: Boolean(body.featured),
      createdAt: new Date().toISOString(),
    };

    addProduct(product);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
