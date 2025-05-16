import React, { useEffect, useState } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";

interface Debt {
  id: number;
  customer: { id: number; name: string };
  amount: number;
  status: string;
  dueDate: string;
  createdAt: string;
}

interface CustomerOption {
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

function DebtForm({ initial, onSave, onClose, loading, customers }: {
  initial?: Partial<Debt>;
  onSave: (data: { customer: number; amount: number; status: string; dueDate: string }) => void;
  onClose: () => void;
  loading: boolean;
  customers: CustomerOption[];
}) {
  const [form, setForm] = useState({
    customer: initial?.customer?.id || "",
    amount: initial?.amount?.toString() || "",
    status: initial?.status || "pending",
    dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : "",
  });
  const [error, setError] = useState("");

  function validate() {
    if (!form.customer) return "Customer is required.";
    if (!form.amount.trim() || isNaN(Number(form.amount))) return "Valid amount is required.";
    if (!form.status.trim()) return "Status is required.";
    if (!form.dueDate.trim()) return "Due date is required.";
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError("");
    onSave({
      customer: Number(form.customer),
      amount: Number(form.amount),
      status: form.status,
      dueDate: form.dueDate,
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
        <h3 className="text-xl font-bold mb-4 text-blue-800">{initial ? "Edit Debt" : "Add Debt"}</h3>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Customer</label>
          <select className="w-full border rounded px-3 py-2" value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))}>
            <option value="">Select customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Amount</label>
          <input className="w-full border rounded px-3 py-2" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Status</label>
          <select className="w-full border rounded px-3 py-2" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Due Date</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
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

export default function Debts() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editDebt, setEditDebt] = useState<Debt | null>(null);
  const [deleteDebt, setDeleteDebt] = useState<Debt | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);

  useEffect(() => {
    fetchDebts();
    api.get("/customers").then(res => setCustomers(res.data as CustomerOption[]));
  }, []);

  function fetchDebts() {
    setLoading(true);
    api.get("/debt-transactions")
      .then(res => {
        setDebts(res.data as Debt[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load debts.");
        setLoading(false);
      });
  }

  function handleCreate(data: { customer: number; amount: number; status: string; dueDate: string }) {
    setModalLoading(true);
    api.post("/debt-transactions", data)
      .then(res => {
        setDebts(d => [res.data as Debt, ...d]);
        setShowForm(false);
        setToast({ type: "success", message: "Debt added." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to add debt." });
        setModalLoading(false);
      });
  }

  function handleEdit(data: { customer: number; amount: number; status: string; dueDate: string }) {
    if (!editDebt) return;
    setModalLoading(true);
    api.put(`/debt-transactions/${editDebt.id}`, data)
      .then(res => {
        setDebts(d => d.map(x => x.id === editDebt.id ? (res.data as Debt) : x));
        setEditDebt(null);
        setToast({ type: "success", message: "Debt updated." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to update debt." });
        setModalLoading(false);
      });
  }

  function handleDelete() {
    if (!deleteDebt) return;
    setModalLoading(true);
    api.delete(`/debt-transactions/${deleteDebt.id}`)
      .then(() => {
        setDebts(d => d.filter(x => x.id !== deleteDebt.id));
        setDeleteDebt(null);
        setToast({ type: "success", message: "Debt deleted." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to delete debt." });
        setModalLoading(false);
      });
  }

  const filtered = debts.filter(d => d.customer.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-4 animate-fade-in"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Debts</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by customer name..."
            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="ml-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
            onClick={() => { setShowForm(true); setEditDebt(null); }}
          >
            + Add
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-blue-600 animate-pulse">Loading debts...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-blue-400">No debts found.</td>
                </tr>
              ) : (
                filtered.map(d => (
                  <tr key={d.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-blue-900">{d.customer.name}</td>
                    <td className="px-4 py-2">${d.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">{d.status}</td>
                    <td className="px-4 py-2">{new Date(d.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm text-blue-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="text-blue-700 hover:underline" onClick={() => { setEditDebt(d); setShowForm(true); }}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => setDeleteDebt(d)}>Delete</button>
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
          <DebtForm
            initial={editDebt || undefined}
            onSave={editDebt ? handleEdit : handleCreate}
            onClose={() => { setShowForm(false); setEditDebt(null); }}
            loading={modalLoading}
            customers={customers}
          />
        )}
        {deleteDebt && (
          <ConfirmModal
            message={`Delete debt for "${deleteDebt.customer.name}"?`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteDebt(null)}
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