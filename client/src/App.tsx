import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Topbar from './pages/Topbar';
import * as HiIcons from "react-icons/hi";
import { SVGProps } from "react";
import { IconBaseProps } from "react-icons";
import "./App.css";

const Customers = React.lazy(() => import("./pages/Customers"));
const Products = React.lazy(() => import("./pages/Products"));
const Debts = React.lazy(() => import("./pages/Debts"));
const Transactions = React.lazy(() => import("./pages/Transactions"));
const Notifications = React.lazy(() => import("./pages/Notifications"));
const AuditLogs = React.lazy(() => import("./pages/AuditLogs"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Support = React.lazy(() => import("./pages/Support"));

const IconWrapper = ({ IconComponent, className }: { 
  IconComponent: React.ComponentType<SVGProps<SVGSVGElement>>; 
  className?: string 
}) => {
  return <IconComponent className={className} />;
};

const navLinks = [
  { to: "/", label: "Dashboard", icon: <IconWrapper IconComponent={HiIcons.HiOutlineHome as React.ComponentType<SVGProps<SVGSVGElement>>} /> },
  { to: "/customers", label: "Customers", icon: <IconWrapper IconComponent={HiIcons.HiOutlineUserGroup} /> },
  { to: "/products", label: "Products", icon: <IconWrapper IconComponent={HiIcons.HiOutlineCube} /> },
  { to: "/debts", label: "Debts", icon: <IconWrapper IconComponent={HiIcons.HiOutlineCurrencyDollar} /> },
  { to: "/transactions", label: "Transactions", icon: <IconWrapper IconComponent={HiIcons.HiOutlineClipboardList} /> },
  { to: "/reports", label: "Reports", icon: <IconWrapper IconComponent={HiIcons.HiOutlineChartBar} /> },
  { to: "/notifications", label: "Notifications", icon: <IconWrapper IconComponent={HiIcons.HiOutlineBell} /> },
  { to: "/audit-logs", label: "Audit Logs", icon: <IconWrapper IconComponent={HiIcons.HiOutlineDocumentText} /> },
  { to: "/support", label: "Support", icon: <IconWrapper IconComponent={HiIcons.HiOutlineSupport} /> },
];

function Sidebar() {
  return (
    <aside className="bg-gradient-to-b from-blue-700 to-blue-900 text-white w-64 min-h-screen flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-bold tracking-wide flex items-center gap-2">
        <IconWrapper IconComponent={HiIcons.HiOutlineCube} className="text-3xl" /> MDMS
      </div>
      <nav className="flex-1">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-3 px-6 py-3 hover:bg-blue-800 transition-colors text-lg font-medium"
          >
            <span className="text-2xl">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-6 text-xs text-blue-200">&copy; {new Date().getFullYear()} MDMS</div>
    </aside>
  );
}

// rest of the file unchanged
// ...

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<div className="flex items-center justify-center h-full">Dashboard</div>} />        
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/debts" element={<Debts />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/support" element={<Support />} />
        {/* Add other routes here */}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-blue-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
