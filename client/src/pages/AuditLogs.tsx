import React, { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";

interface AuditLog {
  id: number;
  user: { id: number; name: string };
  action: string;
  entity: string;
  entityId: number;
  timestamp: string;
  details: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/audit-logs")
      .then(res => {
        setLogs(res.data as AuditLog[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load audit logs.");
        setLoading(false);
      });
  }, []);

  const filtered = logs.filter(l =>
    l.user.name.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-4 animate-fade-in"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Audit Logs</h2>
        <input
          type="text"
          placeholder="Search by user, action, or entity..."
          className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-blue-600 animate-pulse">Loading audit logs...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Entity</th>
                <th className="px-4 py-2 text-left">Entity ID</th>
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-blue-400">No audit logs found.</td>
                </tr>
              ) : (
                filtered.map(l => (
                  <tr key={l.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-blue-900">{l.user.name}</td>
                    <td className="px-4 py-2">{l.action}</td>
                    <td className="px-4 py-2">{l.entity}</td>
                    <td className="px-4 py-2">{l.entityId}</td>
                    <td className="px-4 py-2 text-sm text-blue-500">{new Date(l.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2">{l.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
} 