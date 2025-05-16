import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineDocumentText,
  HiOutlineSupport
} from "react-icons/hi";
import "./App.css";

const Customers = React.lazy(() => import("./pages/Customers"));
const Products = React.lazy(() => import("./pages/Products"));
const Debts = React.lazy(() => import("./pages/Debts"));
const Transactions = React.lazy(() => import("./pages/Transactions"));
const Notifications = React.lazy(() => import("./pages/Notifications"));
const AuditLogs = React.lazy(() => import("./pages/AuditLogs"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Support = React.lazy(() => import("./pages/Support"));

const navLinks = [
  { to: "/", label: "Dashboard", icon: <HiOutlineHome /> },
  { to: "/customers", label: "Customers", icon: <HiOutlineUserGroup /> },
  { to: "/products", label: "Products", icon: <HiOutlineCube /> },
  { to: "/debts", label: "Debts", icon: <HiOutlineCurrencyDollar /> },
  { to: "/transactions", label: "Transactions", icon: <HiOutlineClipboardList /> },
  { to: "/reports", label: "Reports", icon: <HiOutlineChartBar /> },
  { to: "/notifications", label: "Notifications", icon: <HiOutlineBell /> },
  { to: "/audit-logs", label: "Audit Logs", icon: <HiOutlineDocumentText /> },
  { to: "/support", label: "Support", icon: <HiOutlineSupport /> },
];

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -30 },
};

const pageTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

function Sidebar() {
  return (
    <aside className="bg-gradient-to-b from-blue-700 to-blue-900 text-white w-64 min-h-screen flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-bold tracking-wide flex items-center gap-2">
        <HiOutlineCube className="text-3xl" /> MDMS
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

function Topbar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md sticky top-0 z-10 animate-fade-in">
      <h1 className="text-2xl font-semibold text-blue-900 tracking-tight">Market Debt Management System</h1>
      <div className="flex items-center gap-4">
        <span className="text-blue-700 font-medium">Welcome, Admin</span>
        <img
          src={`https://ui-avatars.com/api/?name=Admin&background=1e40af&color=fff&rounded=true`}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-blue-700 shadow"
        />
      </div>
    </header>
  );
}

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      className="p-8 min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-white"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.main>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
      <h2 className="text-4xl font-bold text-blue-800 mb-4 drop-shadow-lg">{title}</h2>
      <p className="text-lg text-blue-600">This page is under construction.</p>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageContainer><Placeholder title="Dashboard" /></PageContainer>} />
        <Route path="/customers" element={<PageContainer><Suspense fallback={<div className='text-blue-600 animate-pulse'>Loading...</div>}><Customers /></Suspense></PageContainer>} />
        <Route path="/products" element={<PageContainer><Suspense fallback={<div className='text-blue-600 animate-pulse'>Loading...</div>}><Products /></Suspense></PageContainer>} />
        <Route path="/debts" element={<PageContainer><Suspense fallback={<div className='text-blue-600 animate-pulse'>Loading...</div>}><Debts /></Suspense></PageContainer>} />
        <Route path="/transactions" element={<PageContainer><Suspense fallback={<div className='text-blue-600 animate-pulse'>Loading...</div>}><Transactions /></Suspense></PageContainer>} />
        <Route path="/reports" element={<PageContainer><Suspense fallback={<div className='text-blue-600 animate-pulse'>Loading...</div>}><Reports /></Suspense></PageContainer>} />
        <Route path="/notifications" element={<PageContainer><Suspense fallback={<div className='text-blue-600 animate-pulse'>Loading...</div>}><Notifications /></Suspense></PageContainer>} />
        <Route path="/audit-logs" element={<PageContainer><Suspense fallback={<div className='text-blue-600 animate-pulse'>Loading...</div>}><AuditLogs /></Suspense></PageContainer>} />
        <Route path="/support" element={<PageContainer><Suspense fallback={<div className='text-blue-600 animate-pulse'>Loading...</div>}><Support /></Suspense></PageContainer>} />
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
          <Topbar />
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
