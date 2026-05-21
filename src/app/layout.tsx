"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Shield, User, HeartPulse, LogIn, Bell } from "lucide-react";
import "./globals.css";

interface UserSession {
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  avatar: string;
  token: string;
}

interface AppContextType {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  session: UserSession | null;
  login: (role: "patient" | "doctor" | "admin") => void;
  logout: () => void;
  notifications: string[];
  addNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const [notifications, setNotifications] = useState<string[]>([
    "System security clearance active: Demo protocols loaded.",
  ]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const login = (role: "patient" | "doctor" | "admin") => {
    const names = {
      patient: "Jane Doe",
      doctor: "Dr. Sarah Jenkins",
      admin: "Chief Administrator",
    };
    const emails = {
      patient: "patient@medivantage.ai",
      doctor: "doctor@medivantage.ai",
      admin: "admin@medivantage.ai",
    };
    setSession({
      name: names[role],
      email: emails[role],
      role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${names[role]}`,
      token: "demo_json_web_token_hash",
    });
    setNotifications((prev) => [
      `Logged in successfully as ${names[role]}`,
      ...prev,
    ]);
  };

  const logout = () => {
    setSession(null);
    setNotifications(["Session terminated gracefully."]);
  };

  const addNotification = (msg: string) =>
    setNotifications((prev) => [msg, ...prev]);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        session,
        login,
        logout,
        notifications,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error(
      "useAppState must be executed structural to provider tree context.",
    );
  return context;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>MediVantage - Advanced Diagnostic Portal</title>
      </head>
      <body className="dark transition-colors duration-300">
        <AppProvider>
          <GlobalNavbar />
          <main className="min-h-screen pt-20">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}

function GlobalNavbar() {
  const { darkMode, setDarkMode, session, login, logout, notifications } =
    useAppState();
  const [showBellMenu, setShowBellMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/70 dark:bg-slateCustom-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 z-50 flex items-center justify-between px-8 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-medical-500 to-medical-600 rounded-xl shadow-lg shadow-medical-500/20">
          <HeartPulse className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            MediVantage
          </span>
          <span className="text-xs block font-medium text-medical-500 tracking-widest uppercase -mt-1">
            AI Ecosystem
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Demo Dynamic Action Row */}
        {!session ? (
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/40">
            <span className="text-xs px-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Demo Gate:
            </span>
            <button
              onClick={() => login("patient")}
              className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-white dark:bg-slate-700 hover:text-medical-500 shadow-sm transition"
            >
              Patient
            </button>
            <button
              onClick={() => login("doctor")}
              className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-white dark:bg-slate-700 hover:text-medical-500 shadow-sm transition"
            >
              Doctor
            </button>
            <button
              onClick={() => login("admin")}
              className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-white dark:bg-slate-700 hover:text-red-400 shadow-sm transition"
            >
              ReadOnly Admin
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 border border-medical-500/20 bg-medical-500/5 px-3 py-1.5 rounded-xl">
            <Shield className="w-4 h-4 text-medical-500" />
            <span className="text-xs font-bold uppercase text-medical-500 tracking-wider">
              {session.role} Context
            </span>
          </div>
        )}

        {/* Real-time Notification Engine Drawer Bell */}
        <div className="relative">
          <button
            onClick={() => setShowBellMenu(!showBellMenu)}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl relative transition"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-amber-500 rounded-full animate-pulse" />
            )}
          </button>
          <AnimatePresence>
            {showBellMenu && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 z-50 overflow-hidden"
              >
                <h4 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 tracking-wide text-slate-400 uppercase">
                  Live Pipeline System Transmissions
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="text-xs border-l-2 border-medical-500 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-r-lg font-mono"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Mode Control Trigger */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>

        {session && (
          <button
            onClick={logout}
            className="text-xs font-bold uppercase tracking-wider bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2.5 rounded-xl transition duration-300"
          >
            Exit
          </button>
        )}
      </div>
    </nav>
  );
}
