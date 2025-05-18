// Topbar.tsx
import React from 'react';

const Topbar = () => {
  // component code here
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-900 text-white p-4 flex items-center justify-between shadow-md">
      <div className="text-2xl font-bold tracking-wide">MDMS</div>
      <nav className="flex space-x-4">
        <a href="/" className="hover:text-blue-300">Dashboard</a>
        <a href="/customers" className="hover:text-blue-300">Customers</a>
        <a href="/products" className="hover:text-blue-300">Products</a>
        <a href="/debts" className="hover:text-blue-300">Debts</a>
        <a href="/transactions" className="hover:text-blue-300">Transactions</a>
        <a href="/reports" className="hover:text-blue-300">Reports</a>
        <a href="/notifications" className="hover:text-blue-300">Notifications</a>
        <a href="/audit-logs" className="hover:text-blue-300">Audit Logs</a>
        <a href="/support" className="hover:text-blue-300">Support</a>
      </nav>
    </header>
  );
};

export default Topbar;