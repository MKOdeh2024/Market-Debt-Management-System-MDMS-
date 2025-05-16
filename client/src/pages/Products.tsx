import React, { useEffect, useState } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  barcode: string;
  price_per_unit: number;
  quantity_in_stock: number;
  tax: number;
  createdAt: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 40 },
};

function ProductForm({ initial, onSave, onClose, loading }: {
  initial?: Partial<Product>;
  onSave: (data: Omit<Product, "id" | "createdAt">) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    brand: initial?.brand || "",
    category: initial?.category || "",
    barcode: initial?.barcode || "",
    price_per_unit: initial?.price_per_unit?.toString() || "",
    quantity_in_stock: initial?.quantity_in_stock?.toString() || "",
    tax: initial?.tax?.toString() || "",
  });
  const [error, setError] = useState("");

  function validate() {
    if (!form.name.trim()) return "Name is required.";
    if (!form.brand.trim()) return "Brand is required.";
    if (!form.category.trim()) return "Category is required.";
    if (!form.barcode.trim()) return "Barcode is required.";
    if (!form.price_per_unit.trim() || isNaN(Number(form.price_per_unit))) return "Valid price is required.";
    if (!form.quantity_in_stock.trim() || isNaN(Number(form.quantity_in_stock))) return "Valid stock is required.";
    if (!form.tax.trim() || isNaN(Number(form.tax))) return "Valid tax is required.";
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError("");
    onSave({
      name: form.name,
      brand: form.brand,
      category: form.category,
      barcode: form.barcode,
      price_per_unit: Number(form.price_per_unit),
      quantity_in_stock: Number(form.quantity_in_stock),
      tax: Number(form.tax),
    } as Omit<Product, "id" | "createdAt">);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md animate-fade-in">
        <h3 className="text-xl font-bold mb-4 text-blue-800">{initial ? "Edit Product" : "Add Product"}</h3>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Name</label>
          <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Brand</label>
          <input className="w-full border rounded px-3 py-2" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Category</label>
          <input className="w-full border rounded px-3 py-2" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Barcode</label>
          <input className="w-full border rounded px-3 py-2" value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Price per unit</label>
          <input className="w-full border rounded px-3 py-2" value={form.price_per_unit} onChange={e => setForm(f => ({ ...f, price_per_unit: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Stock</label>
          <input className="w-full border rounded px-3 py-2" value={form.quantity_in_stock} onChange={e => setForm(f => ({ ...f, quantity_in_stock: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Tax (%)</label>
          <input className="w-full border rounded px-3 py-2" value={form.tax} onChange={e => setForm(f => ({ ...f, tax: e.target.value }))} />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors disabled:opacity-60" disabled={loading}>{initial ? "Save" : "Add"}</button>
          <button type="button" className="px-4 py-2 rounded border" onClick={onClose} disabled={loading}>Cancel</button>
        </div>
      </form>
    </motion.div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel, loading }: { message: string; onConfirm: () => void; onCancel: () => void; loading: boolean; }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm animate-fade-in">
        <div className="mb-4 text-blue-800 font-semibold">{message}</div>
        <div className="flex gap-2 mt-4">
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-60" disabled={loading}>Delete</button>
          <button onClick={onCancel} className="px-4 py-2 rounded border" disabled={loading}>Cancel</button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    setLoading(true);
    api.get("/products")
      .then(res => {
        setProducts(res.data as Product[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products.");
        setLoading(false);
      });
  }

  function handleCreate(data: Omit<Product, "id" | "createdAt">) {
    setModalLoading(true);
    api.post("/products", data)
      .then(res => {
        setProducts(p => [res.data as Product, ...p]);
        setShowForm(false);
        setToast({ type: "success", message: "Product added." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to add product." });
        setModalLoading(false);
      });
  }

  function handleEdit(data: Omit<Product, "id" | "createdAt">) {
    if (!editProduct) return;
    setModalLoading(true);
    api.put(`/products/${editProduct.id}`, data)
      .then(res => {
        setProducts(p => p.map(x => x.id === editProduct.id ? (res.data as Product) : x));
        setEditProduct(null);
        setToast({ type: "success", message: "Product updated." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to update product." });
        setModalLoading(false);
      });
  }

  function handleDelete() {
    if (!deleteProduct) return;
    setModalLoading(true);
    api.delete(`/products/${deleteProduct.id}`)
      .then(() => {
        setProducts(p => p.filter(x => x.id !== deleteProduct.id));
        setDeleteProduct(null);
        setToast({ type: "success", message: "Product deleted." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to delete product." });
        setModalLoading(false);
      });
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-4 animate-fade-in"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Products</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name or category..."
            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="ml-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
            onClick={() => { setShowForm(true); setEditProduct(null); }}
          >
            + Add
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-blue-600 animate-pulse">Loading products...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Brand</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Barcode</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Tax</th>
                <th className="px-4 py-2 text-left">Added</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-blue-400">No products found.</td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-blue-900">{p.name}</td>
                    <td className="px-4 py-2">{p.brand}</td>
                    <td className="px-4 py-2">{p.category}</td>
                    <td className="px-4 py-2">{p.barcode}</td>
                    <td className="px-4 py-2">${p.price_per_unit.toFixed(2)}</td>
                    <td className="px-4 py-2">{p.quantity_in_stock}</td>
                    <td className="px-4 py-2">{p.tax}%</td>
                    <td className="px-4 py-2 text-sm text-blue-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="text-blue-700 hover:underline" onClick={() => { setEditProduct(p); setShowForm(true); }}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => setDeleteProduct(p)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            initial={editProduct || undefined}
            onSave={editProduct ? handleEdit : handleCreate}
            onClose={() => { setShowForm(false); setEditProduct(null); }}
            loading={modalLoading}
          />
        )}
        {deleteProduct && (
          <ConfirmModal
            message={`Delete product "${deleteProduct.name}"?`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteProduct(null)}
            loading={modalLoading}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onAnimationComplete={() => setTimeout(() => setToast(null), 2000)}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 