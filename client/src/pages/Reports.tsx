import React, { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";

interface Report {
  id: number;
  title: string;
  description: string;
  createdBy: { id: number; name: string };
  createdAt: string;
  type: string;
  status: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/reports")
      .then(res => {
        setReports(res.data as Report[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load reports.");
        setLoading(false);
      });
  }, []);

  const filtered = reports.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    r.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-4 animate-fade-in"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Reports</h2>
        <input
          type="text"
          placeholder="Search by title, type, or status..."
          className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-blue-600 animate-pulse">Loading reports...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created By</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-blue-400">No reports found.</td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-blue-900">{r.title}</td>
                    <td className="px-4 py-2">{r.type}</td>
                    <td className="px-4 py-2">{r.status}</td>
                    <td className="px-4 py-2">{r.createdBy.name}</td>
                    <td className="px-4 py-2 text-sm text-blue-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{r.description}</td>
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