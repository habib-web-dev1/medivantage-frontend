"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, LogIn, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { DarkModeToggle } from "./DarkModeToggle";

export default function GlobalNavbar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    document.cookie = "medivantage-role=; path=/; max-age=0";
    window.location.href = "/login";
  };

  const dashboardHref = user ? `/${user.role}` : "/login";

  const navLinks = [
    { href: "/medicines", label: "Medicines" },
    { href: "/doctors", label: "Doctors" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm"
          : "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="p-2 bg-linear-to-br from-medical-500 to-medical-600 rounded-xl shadow-lg shadow-medical-500/20"
        >
          <HeartPulse className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
            MediVantage
          </span>
          <span className="text-[10px] block font-semibold text-medical-500 tracking-widest uppercase -mt-0.5">
            AI Ecosystem
          </span>
        </div>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative px-3 py-2 rounded-xl text-sm font-medium transition group"
            >
              <span
                className={`relative z-10 transition-colors ${active ? "text-medical-500 font-bold" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"}`}
              >
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-medical-500/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                />
              )}
            </Link>
          );
        })}

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
        <DarkModeToggle />

        {user ? (
          <div className="flex items-center gap-2 ml-1">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={dashboardHref}
                className="text-sm font-bold px-4 py-2 bg-medical-500 text-white rounded-xl hover:bg-medical-600 transition shadow-md shadow-medical-500/20"
              >
                Dashboard
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="ml-1"
          >
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-medical-500 text-white rounded-xl hover:bg-medical-600 transition shadow-md shadow-medical-500/20"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          </motion.div>
        )}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center gap-2">
        <DarkModeToggle />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={menuOpen ? "x" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-1 md:hidden shadow-xl"
          >
            {navLinks.map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={href}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            {user ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 }}
                >
                  <Link
                    href={dashboardHref}
                    className="block px-4 py-2.5 rounded-xl text-sm font-bold text-medical-500 hover:bg-medical-500/10 transition"
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                  >
                    Logout
                  </button>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 }}
              >
                <Link
                  href="/login"
                  className="block px-4 py-2.5 rounded-xl text-sm font-bold text-medical-500 hover:bg-medical-500/10 transition"
                >
                  Sign In
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
