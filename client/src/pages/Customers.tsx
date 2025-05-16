import React, { useEffect, useState } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
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

function CustomerForm({ initial, onSave, onClose, loading }: {
  initial?: Partial<Customer>;
  onSave: (data: Omit<Customer, "id" | "createdAt">) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    address: initial?.address || "",
  });
  const [error, setError] = useState("");

  function validate() {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Valid email is required.";
    if (!form.phone.trim()) return "Phone is required.";
    if (!form.address.trim()) return "Address is required.";
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError("");
    onSave(form);
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
        <h3 className="text-xl font-bold mb-4 text-blue-800">{initial ? "Edit Customer" : "Add Customer"}</h3>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Name</label>
          <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Email</label>
          <input className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Phone</label>
          <input className="w-full border rounded px-3 py-2" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Address</label>
          <input className="w-full border rounded px-3 py-2" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
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

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  function fetchCustomers() {
    setLoading(true);
    api.get("/customers")
      .then(res => {
        setCustomers(res.data as Customer[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load customers.");
        setLoading(false);
      });
  }

  function handleCreate(data: Omit<Customer, "id" | "createdAt">) {
    setModalLoading(true);
    api.post("/customers", data)
      .then(res => {
        setCustomers(c => [res.data as Customer, ...c]);
        setShowForm(false);
        setToast({ type: "success", message: "Customer added." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to add customer." });
        setModalLoading(false);
      });
  }

  function handleEdit(data: Omit<Customer, "id" | "createdAt">) {
    if (!editCustomer) return;
    setModalLoading(true);
    api.put(`/customers/${editCustomer.id}`, data)
      .then(res => {
        setCustomers(c => c.map(x => x.id === editCustomer.id ? (res.data as Customer) : x));
        setEditCustomer(null);
        setToast({ type: "success", message: "Customer updated." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to update customer." });
        setModalLoading(false);
      });
  }

  function handleDelete() {
    if (!deleteCustomer) return;
    setModalLoading(true);
    api.delete(`/customers/${deleteCustomer.id}`)
      .then(() => {
        setCustomers(c => c.filter(x => x.id !== deleteCustomer.id));
        setDeleteCustomer(null);
        setToast({ type: "success", message: "Customer deleted." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to delete customer." });
        setModalLoading(false);
      });
  }

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-4 animate-fade-in"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Customers</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="ml-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
            onClick={() => { setShowForm(true); setEditCustomer(null); }}
          >
            + Add
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-blue-600 animate-pulse">Loading customers...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Joined</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-blue-400">No customers found.</td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-blue-900">{c.name}</td>
                    <td className="px-4 py-2">{c.email}</td>
                    <td className="px-4 py-2">{c.phone}</td>
                    <td className="px-4 py-2">{c.address}</td>
                    <td className="px-4 py-2 text-sm text-blue-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="text-blue-700 hover:underline" onClick={() => { setEditCustomer(c); setShowForm(true); }}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => setDeleteCustomer(c)}>Delete</button>
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
          <CustomerForm
            initial={editCustomer || undefined}
            onSave={editCustomer ? handleEdit : handleCreate}
            onClose={() => { setShowForm(false); setEditCustomer(null); }}
            loading={modalLoading}
          />
        )}
        {deleteCustomer && (
          <ConfirmModal
            message={`Delete customer "${deleteCustomer.name}"?`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteCustomer(null)}
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