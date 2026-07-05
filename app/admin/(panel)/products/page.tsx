"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/lib/types";

type ModalMode = "create" | "edit" | null;

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  details: "",
  price: "",
  originalPrice: "",
  image: "",
  categoryId: "",
  badge: "",
  stock: "",
  featured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const [pr, cr] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories"),
    ]);
    const [ps, cs] = await Promise.all([pr.json(), cr.json()]);
    setProducts(ps);
    setCategories(cs);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalMode("create");
    setImageFile(null);
    setImagePreview(null);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      details: p.details ?? "",
      price: String(p.price),
      originalPrice: String(p.originalPrice ?? ""),
      image: p.image,
      categoryId: p.categoryId,
      badge: p.badge ?? "",
      stock: String(p.stock),
      featured: p.featured,
    });
    setEditingId(p.id);
    setModalMode("edit");
    setImageFile(null);
    // if existing image is a data URL or URL, show as preview
    if (p.image) setImagePreview(p.image);
    else setImagePreview(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice
        ? parseFloat(form.originalPrice)
        : undefined,
      stock: parseInt(form.stock),
    };
    try {
      // If an image file was selected, send as FormData so the server can store attachment
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        Object.entries(body).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd.append(k, String(v));
        });
        if (modalMode === "create") {
          await fetch("/api/products", { method: "POST", body: fd });
        } else if (editingId) {
          await fetch(`/api/products/${editingId}`, {
            method: "PUT",
            body: fd,
          });
        }
      } else {
        // Fallback to JSON when no file selected (keeps URL workflow)
        if (modalMode === "create") {
          await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } else if (editingId) {
          await fetch(`/api/products/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        }
      }
      setModalMode(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    await load();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pt-12 lg:pt-0">
        <div>
          <h1 className="font-serif text-3xl text-ink">Products</h1>
          <p className="text-ink-soft text-sm mt-1">
            {products.length} total products
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-sage-dark text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-ink transition-colors flex items-center gap-2"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 stroke-current fill-none"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <svg
          viewBox="0 0 24 24"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 stroke-ink-soft fill-none"
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm outline-none focus:border-sage-dark transition-colors"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-ink-soft">Loading…</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Stock",
                    "Featured",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-ink-soft"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden relative flex-shrink-0 bg-cream">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-ink">
                            {product.name}
                          </div>
                          {product.badge && (
                            <span className="text-[10px] bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-ink-soft">
                      {product.categoryName ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-ink">
                      {formatPrice(product.price)}
                      {product.originalPrice && (
                        <span className="text-xs text-ink-soft line-through ml-1">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`text-sm font-medium ${product.stock <= 5 ? "text-red-500" : "text-ink"}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`w-2 h-2 rounded-full inline-block ${product.featured ? "bg-sage" : "bg-gray-300"}`}
                      />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="text-ink-soft hover:text-sage-dark transition-colors text-xs border border-gray-200 px-3 py-2 sm:py-1.5 rounded-full hover:border-sage-dark min-h-[36px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="text-ink-soft hover:text-red-500 transition-colors text-xs border border-gray-200 px-3 py-2 sm:py-1.5 rounded-full hover:border-red-300 min-h-[36px]"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-xl">
            <h3 className="font-serif text-xl text-ink mb-2">
              Delete product?
            </h3>
            <p className="text-sm text-ink-soft mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 py-2.5 rounded-full text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-full text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-ink/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl">
            <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-gray-100">
              <h3 className="font-serif text-xl text-ink">
                {modalMode === "create" ? "Add Product" : "Edit Product"}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 stroke-ink fill-none"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="px-5 sm:px-7 py-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name *" required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        name: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      }))
                    }
                    className={inputCls}
                    placeholder="Pink Peony Bouquet"
                  />
                </Field>
                <Field label="Slug *" required>
                  <input
                    required
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slug: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="pink-peony-bouquet"
                  />
                </Field>
              </div>
              <Field label="Description *" required>
                <input
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Details">
                <textarea
                  rows={3}
                  value={form.details}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, details: e.target.value }))
                  }
                  className={inputCls + " resize-none"}
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Price *" required>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="48"
                  />
                </Field>
                <Field label="Original Price">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, originalPrice: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="62"
                  />
                </Field>
                <Field label="Stock *" required>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, stock: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="10"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Category *" required>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, categoryId: e.target.value }))
                    }
                    className={inputCls}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Badge">
                  <input
                    value={form.badge}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, badge: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="New, Bestseller…"
                  />
                </Field>
              </div>
              <Field label="Image" required>
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setImageFile(f);
                      if (f) setImagePreview(URL.createObjectURL(f));
                      else setImagePreview(null);
                    }}
                    className="text-sm"
                  />
                  <div>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, image: e.target.value }))
                      }
                      className={inputCls}
                      placeholder="Or paste image URL (https://...)"
                    />
                    <p className="text-xs text-ink-soft mt-1">
                      If a file is selected, it will be stored as an attachment
                      instead of a URL.
                    </p>
                  </div>
                </div>
                {imagePreview && (
                  <div className="mt-3 w-28 h-28 rounded-lg overflow-hidden relative bg-cream">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </Field>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, featured: e.target.checked }))
                  }
                  className="w-4 h-4 accent-sage-dark"
                />
                <label htmlFor="featured" className="text-sm text-ink">
                  Featured on home page
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 border border-gray-200 py-3 rounded-full text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-sage-dark text-white py-3 rounded-full text-sm font-medium hover:bg-ink transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sage-dark transition-colors bg-white";

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-ink-soft mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
