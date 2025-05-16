import React, { useEffect, useState } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";

interface SupportTicket {
  id: number;
  user: { id: number; name: string };
  subject: string;
  description: string;
  status: string;
  createdAt: string;
}

interface UserOption {
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

function SupportForm({ initial, onSave, onClose, loading, users }: {
  initial?: Partial<SupportTicket>;
  onSave: (data: { user: number; subject: string; description: string; status: string }) => void;
  onClose: () => void;
  loading: boolean;
  users: UserOption[];
}) {
  const [form, setForm] = useState({
    user: initial?.user?.id || "",
    subject: initial?.subject || "",
    description: initial?.description || "",
    status: initial?.status || "open",
  });
  const [error, setError] = useState("");

  function validate() {
    if (!form.user) return "User is required.";
    if (!form.subject.trim()) return "Subject is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.status.trim()) return "Status is required.";
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError("");
    onSave({
      user: Number(form.user),
      subject: form.subject,
      description: form.description,
      status: form.status,
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
        <h3 className="text-xl font-bold mb-4 text-blue-800">{initial ? "Edit Ticket" : "Add Ticket"}</h3>
        <div className="mb-3">
          <label className="block mb-1 font-medium">User</label>
          <select className="w-full border rounded px-3 py-2" value={form.user} onChange={e => setForm(f => ({ ...f, user: e.target.value }))}>
            <option value="">Select user</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Subject</label>
          <input className="w-full border rounded px-3 py-2" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Description</label>
          <textarea className="w-full border rounded px-3 py-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Status</label>
          <select className="w-full border rounded px-3 py-2" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
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

export default function Support() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTicket, setEditTicket] = useState<SupportTicket | null>(null);
  const [deleteTicket, setDeleteTicket] = useState<SupportTicket | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);

  useEffect(() => {
    fetchTickets();
    api.get("/users").then(res => setUsers(res.data as UserOption[]));
  }, []);

  function fetchTickets() {
    setLoading(true);
    api.get("/support-tickets")
      .then(res => {
        setTickets(res.data as SupportTicket[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load tickets.");
        setLoading(false);
      });
  }

  function handleCreate(data: { user: number; subject: string; description: string; status: string }) {
    setModalLoading(true);
    api.post("/support-tickets", data)
      .then(res => {
        setTickets(t => [res.data as SupportTicket, ...t]);
        setShowForm(false);
        setToast({ type: "success", message: "Ticket added." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to add ticket." });
        setModalLoading(false);
      });
  }

  function handleEdit(data: { user: number; subject: string; description: string; status: string }) {
    if (!editTicket) return;
    setModalLoading(true);
    api.put(`/support-tickets/${editTicket.id}`, data)
      .then(res => {
        setTickets(t => t.map(x => x.id === editTicket.id ? (res.data as SupportTicket) : x));
        setEditTicket(null);
        setToast({ type: "success", message: "Ticket updated." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to update ticket." });
        setModalLoading(false);
      });
  }

  function handleDelete() {
    if (!deleteTicket) return;
    setModalLoading(true);
    api.delete(`/support-tickets/${deleteTicket.id}`)
      .then(() => {
        setTickets(t => t.filter(x => x.id !== deleteTicket.id));
        setDeleteTicket(null);
        setToast({ type: "success", message: "Ticket deleted." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to delete ticket." });
        setModalLoading(false);
      });
  }

  const filtered = tickets.filter(t =>
    t.user.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-4 animate-fade-in"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Support Tickets</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by user, subject, or status..."
            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="ml-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
            onClick={() => { setShowForm(true); setEditTicket(null); }}
          >
            + Add
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-blue-600 animate-pulse">Loading tickets...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-blue-400">No tickets found.</td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-blue-900">{t.user.name}</td>
                    <td className="px-4 py-2">{t.subject}</td>
                    <td className="px-4 py-2">{t.description}</td>
                    <td className="px-4 py-2">{t.status}</td>
                    <td className="px-4 py-2 text-sm text-blue-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="text-blue-700 hover:underline" onClick={() => { setEditTicket(t); setShowForm(true); }}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => setDeleteTicket(t)}>Delete</button>
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
          <SupportForm
            initial={editTicket || undefined}
            onSave={editTicket ? handleEdit : handleCreate}
            onClose={() => { setShowForm(false); setEditTicket(null); }}
            loading={modalLoading}
            users={users}
          />
        )}
        {deleteTicket && (
          <ConfirmModal
            message={`Delete ticket for "${deleteTicket.user.name}"?`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTicket(null)}
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