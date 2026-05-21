"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, Sparkles } from "lucide-react";
import { useAppState } from "../../layout";

export default function LoginPage() {
  const { login } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setValidationError(
        "Structural standard requires explicit email routing characters (@).",
      );
      return;
    }
    if (password.length < 4) {
      setValidationError(
        "Cryptographic parameter safety bounds demand lengths >= 4.",
      );
      return;
    }
    setValidationError("");
    if (email.includes("admin")) login("admin");
    else if (email.includes("doctor")) login("doctor");
    else login("patient");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-medical-500 to-indigo-500" />

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-medical-500/10 text-medical-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Access Verification Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Verify your session parameters to map access tokens
          </p>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1.5">
              Network Route (Email)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@medivantage.ai"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-medical-500 transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1.5">
              Security Token (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-medical-500 transition font-medium"
              />
            </div>
          </div>

          {validationError && (
            <p className="text-[11px] font-mono bg-red-500/10 text-red-500 p-2.5 rounded-lg border border-red-500/20">
              {validationError}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-medical-500/10 hover:opacity-90 transition"
          >
            Validate Credentials
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-2">
            Instant Rig Testing Matrix
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => login("patient")}
              className="px-2 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold hover:text-medical-500 transition"
            >
              Patient.ctx
            </button>
            <button
              onClick={() => login("doctor")}
              className="px-2 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold hover:text-medical-500 transition"
            >
              Doctor.ctx
            </button>
            <button
              onClick={() => login("admin")}
              className="px-2 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold hover:text-red-400 transition"
            >
              Admin.ctx
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
