"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, UserPlus } from "lucide-react";
import { useAppState } from "../../layout";

export default function RegisterPage() {
  const { login } = useAppState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");

  const executeRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    login(role);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-50 dark:bg-slateCustom-900 border border-slate-200 dark:border-slate-800/80 p-10 rounded-[32px] w-full max-w-2xl grid md:grid-cols-2 gap-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-4">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              Create Structural Account Node
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
              Join the diagnostic cluster network to provision permanent
              electronic medical indexing.
            </p>
          </div>
          <div className="text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            🔒 Hardware isolated cryptographic hashing ensures protection for
            analytical variables.
          </div>
        </div>

        <form
          onSubmit={executeRegistration}
          className="space-y-4 justify-center flex flex-col"
        >
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
              Practitioner/User Identity Tag
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
              Communication Route
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@network.io"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
              Ecosystem Role Mapping
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition ${role === "patient" ? "bg-medical-500 text-white border-medical-500" : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"}`}
              >
                Patient Node
              </button>
              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition ${role === "doctor" ? "bg-indigo-500 text-white border-indigo-500" : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"}`}
              >
                Physician Node
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-lg mt-2"
          >
            Provision Account Node
          </button>
        </form>
      </motion.div>
    </div>
  );
}
