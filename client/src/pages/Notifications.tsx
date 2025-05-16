import React, { useEffect, useState } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  user: { id: number; name: string };
  type: string;
  message: string;
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

function NotificationForm({ initial, onSave, onClose, loading, users }: {
  initial?: Partial<Notification>;
  onSave: (data: { user: number; type: string; message: string; status: string }) => void;
  onClose: () => void;
  loading: boolean;
  users: UserOption[];
}) {
  const [form, setForm] = useState({
    user: initial?.user?.id || "",
    type: initial?.type || "",
    message: initial?.message || "",
    status: initial?.status || "unread",
  });
  const [error, setError] = useState("");

  function validate() {
    if (!form.user) return "User is required.";
    if (!form.type.trim()) return "Type is required.";
    if (!form.message.trim()) return "Message is required.";
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
      type: form.type,
      message: form.message,
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
        <h3 className="text-xl font-bold mb-4 text-blue-800">{initial ? "Edit Notification" : "Add Notification"}</h3>
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
          <label className="block mb-1 font-medium">Type</label>
          <input className="w-full border rounded px-3 py-2" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Message</label>
          <textarea className="w-full border rounded px-3 py-2" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Status</label>
          <select className="w-full border rounded px-3 py-2" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
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

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editNotification, setEditNotification] = useState<Notification | null>(null);
  const [deleteNotification, setDeleteNotification] = useState<Notification | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);

  useEffect(() => {
    fetchNotifications();
    api.get("/users").then(res => setUsers(res.data as UserOption[]));
  }, []);

  function fetchNotifications() {
    setLoading(true);
    api.get("/notifications")
      .then(res => {
        setNotifications(res.data as Notification[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load notifications.");
        setLoading(false);
      });
  }

  function handleCreate(data: { user: number; type: string; message: string; status: string }) {
    setModalLoading(true);
    api.post("/notifications", data)
      .then(res => {
        setNotifications(n => [res.data as Notification, ...n]);
        setShowForm(false);
        setToast({ type: "success", message: "Notification added." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to add notification." });
        setModalLoading(false);
      });
  }

  function handleEdit(data: { user: number; type: string; message: string; status: string }) {
    if (!editNotification) return;
    setModalLoading(true);
    api.put(`/notifications/${editNotification.id}`, data)
      .then(res => {
        setNotifications(n => n.map(x => x.id === editNotification.id ? (res.data as Notification) : x));
        setEditNotification(null);
        setToast({ type: "success", message: "Notification updated." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to update notification." });
        setModalLoading(false);
      });
  }

  function handleDelete() {
    if (!deleteNotification) return;
    setModalLoading(true);
    api.delete(`/notifications/${deleteNotification.id}`)
      .then(() => {
        setNotifications(n => n.filter(x => x.id !== deleteNotification.id));
        setDeleteNotification(null);
        setToast({ type: "success", message: "Notification deleted." });
        setModalLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to delete notification." });
        setModalLoading(false);
      });
  }

  const filtered = notifications.filter(n =>
    n.user.name.toLowerCase().includes(search.toLowerCase()) ||
    n.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-4 animate-fade-in"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Notifications</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by user or type..."
            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="ml-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
            onClick={() => { setShowForm(true); setEditNotification(null); }}
          >
            + Add
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-blue-600 animate-pulse">Loading notifications...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-blue-400">No notifications found.</td>
                </tr>
              ) : (
                filtered.map(n => (
                  <tr key={n.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-blue-900">{n.user.name}</td>
                    <td className="px-4 py-2">{n.type}</td>
                    <td className="px-4 py-2">{n.message}</td>
                    <td className="px-4 py-2">{n.status}</td>
                    <td className="px-4 py-2 text-sm text-blue-500">{new Date(n.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="text-blue-700 hover:underline" onClick={() => { setEditNotification(n); setShowForm(true); }}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => setDeleteNotification(n)}>Delete</button>
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
          <NotificationForm
            initial={editNotification || undefined}
            onSave={editNotification ? handleEdit : handleCreate}
            onClose={() => { setShowForm(false); setEditNotification(null); }}
            loading={modalLoading}
            users={users}
          />
        )}
        {deleteNotification && (
          <ConfirmModal
            message={`Delete notification for "${deleteNotification.user.name}"?`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteNotification(null)}
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