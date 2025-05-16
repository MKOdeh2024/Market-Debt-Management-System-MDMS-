import React, { useEffect, useState } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: number;
  debtTransaction: { id: number; customer: { id: number; name: string } };
  product: { id: number; name: string };
  quantity: number;
  price_at_sale: number;
  createdAt: string;
}

interface DebtOption {
  id: number;
  customer: { id: number; name: string };
}

interface ProductOption {
  id: number;
  name: string;
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

function TransactionForm({ initial, onSave, onClose, loading, debts, products }: {
  initial?: Partial<Transaction>;
  onSave: (data: { debtTransaction: number; product: number; quantity: number; price_at_sale: number }) => void;
  onClose: () => void;
  loading: boolean;
  debts: DebtOption[];
  products: ProductOption[];
}) {
  const [form, setForm] = useState({
    debtTransaction: initial?.debtTransaction?.id || "",
    product: initial?.product?.id || "",
    quantity: initial?.quantity?.toString() || "",
    price_at_sale: initial?.price_at_sale?.toString() || "",
  });
  const [error, setError] = useState("");

  function validate() {
    if (!form.debtTransaction) return "Debt is required.";
    if (!form.product) return "Product is required.";
    if (!form.quantity.trim() || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) return "Valid quantity is required.";
    if (!form.price_at_sale.trim() || isNaN(Number(form.price_at_sale))) return "Valid price is required.";
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError("");
    onSave({
      debtTransaction: Number(form.debtTransaction),
      product: Number(form.product),
      quantity: Number(form.quantity),
      price_at_sale: Number(form.price_at_sale),
    });
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
        <h3 className="text-xl font-bold mb-4 text-blue-800">{initial ? "Edit Transaction" : "Add Transaction"}</h3>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Debt (Customer)</label>
          <select className="w-full border rounded px-3 py-2" value={form.debtTransaction} onChange={e => setForm(f => ({ ...f, debtTransaction: e.target.value }))}>
            <option value="">Select debt</option>
            {debts.map(d => (
              <option key={d.id} value={d.id}>{d.customer.name} (ID: {d.id})</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Product</label>
          <select className="w-full border rounded px-3 py-2" value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))}>
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Quantity</label>
          <input className="w-full border rounded px-3 py-2" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Price at Sale</label>
          <input className="w-full border rounded px-3 py-2" value={form.price_at_sale} onChange={e => setForm(f => ({ ...f, price_at_sale: e.target.value }))} />
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

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [debts, setDebts] = useState<DebtOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);

  useEffect(() => {
    fetchTransactions();
    api.get("/debt-transactions").then(res => setDebts(res.data as DebtOption[]));
    api.get("/products").then(res => setProducts(res.data as ProductOption[]));
  }, []);

  function fetchTransactions() {
    setLoading(true);
    api.get("/product-transactions")
      .then(res => {
        setTransactions(res.data as Transaction[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load transactions.");
        setLoading(false);
      });
  }

  function handleCreate(data: { debtTransaction: number; product: number; quantity: number; price_at_sale: number }) {
    setModalLoading(true);
    api.post("/product-transactions", data)
      .then(res => {
        setTransactions(t => [res.data as Transaction, ...t]);
        setShowForm(false);
        setToast({ type: "success", message: "Transaction added." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to add transaction." });
        setModalLoading(false);
      });
  }

  function handleEdit(data: { debtTransaction: number; product: number; quantity: number; price_at_sale: number }) {
    if (!editTransaction) return;
    setModalLoading(true);
    api.put(`/product-transactions/${editTransaction.id}`, data)
      .then(res => {
        setTransactions(t => t.map(x => x.id === editTransaction.id ? (res.data as Transaction) : x));
        setEditTransaction(null);
        setToast({ type: "success", message: "Transaction updated." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to update transaction." });
        setModalLoading(false);
      });
  }

  function handleDelete() {
    if (!deleteTransaction) return;
    setModalLoading(true);
    api.delete(`/product-transactions/${deleteTransaction.id}`)
      .then(() => {
        setTransactions(t => t.filter(x => x.id !== deleteTransaction.id));
        setDeleteTransaction(null);
        setToast({ type: "success", message: "Transaction deleted." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to delete transaction." });
        setModalLoading(false);
      });
  }

  const filtered = transactions.filter(t =>
    t.debtTransaction.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    t.product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-4 animate-fade-in"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Transactions</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by customer or product..."
            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="ml-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
            onClick={() => { setShowForm(true); setEditTransaction(null); }}
          >
            + Add
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-blue-600 animate-pulse">Loading transactions...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price at Sale</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-blue-400">No transactions found.</td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-blue-900">{t.debtTransaction.customer.name}</td>
                    <td className="px-4 py-2">{t.product.name}</td>
                    <td className="px-4 py-2">{t.quantity}</td>
                    <td className="px-4 py-2">${t.price_at_sale.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm text-blue-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="text-blue-700 hover:underline" onClick={() => { setEditTransaction(t); setShowForm(true); }}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => setDeleteTransaction(t)}>Delete</button>
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
          <TransactionForm
            initial={editTransaction || undefined}
            onSave={editTransaction ? handleEdit : handleCreate}
            onClose={() => { setShowForm(false); setEditTransaction(null); }}
            loading={modalLoading}
            debts={debts}
            products={products}
          />
        )}
        {deleteTransaction && (
          <ConfirmModal
            message={`Delete transaction for "${deleteTransaction.debtTransaction.customer.name}"?`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTransaction(null)}
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