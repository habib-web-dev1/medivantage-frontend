"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Pill, Layers, ArrowRight } from "lucide-react";

interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  price: number;
  category: string;
  description: string;
  uses: string;
  sideEffects: string;
}

export default function MedicinesDirectory() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [meds, setMeds] = useState<Medicine[]>([]);
  const [focusedMed, setFocusedMed] = useState<Medicine | null>(null);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/medicines");
        const data = await res.json();
        setMeds(data);
      } catch (e) {
        setMeds([
          {
            id: "m1",
            brandName: "Amoxil",
            genericName: "Amoxicillin",
            price: 24.99,
            category: "Antibiotics",
            description: "Broad spectrum systemic optimization antibiotic.",
            uses: "Bacterial cell degradation.",
            sideEffects: "Mild nausea options.",
          },
          {
            id: "m2",
            brandName: "Calpol",
            genericName: "Paracetamol",
            price: 8.5,
            category: "Fever",
            description: "Thermal control molecular manipulation component.",
            uses: "Pyrexia reset limits.",
            sideEffects: "Hepatic parameters warning.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchMeds, 1000); // Enforce artificial wait to witness shimmer
    return () => clearTimeout(t);
  }, []);

  const categories = ["All", "Antibiotics", "Fever", "Vitamins"];
  const filteredMeds = meds.filter((m) => {
    const matchSearch =
      m.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      selectedCategory === "All" || m.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
      {/* DIRECTORY VIEW */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            Medical Commerce Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Verify structural pharmaceutical compounds and deployment
            directives.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search brand or generic syntax nomenclature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-medical-500 transition font-medium"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedCategory === cat ? "bg-medical-500 text-white shadow-md" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          /* HIGH CONFIGURATION SKELETON SCREENS SHIMMER EFFECT */
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl space-y-3 bg-white dark:bg-slate-900 overflow-hidden relative"
              >
                <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse shimmer-bg" />
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse shimmer-bg" />
                <div className="space-y-1.5 pt-2">
                  <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse shimmer-bg" />
                  <div className="h-2.5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse shimmer-bg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredMeds.map((m) => (
              <div
                key={m.id}
                onClick={() => setFocusedMed(m)}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl hover:border-medical-500 cursor-pointer transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg group-hover:text-medical-500 transition">
                      {m.brandName}
                    </h4>
                    <span className="text-sm font-black text-slate-800 dark:text-white">
                      ${m.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 block -mt-0.5 mb-2 font-medium">
                    {m.genericName}
                  </span>
                  <p className="text-xs text-slate-400 line-clamp-2 font-medium leading-relaxed">
                    {m.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                    {m.category}
                  </span>
                  <span className="text-xs font-bold text-medical-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    Deep Link <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAILED SPECIFICATION CARD PANEL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-fit lg:sticky lg:top-24 shadow-2xl">
        {focusedMed ? (
          <div className="space-y-5">
            <div>
              <div className="w-10 h-10 bg-medical-500/10 text-medical-500 rounded-xl flex items-center justify-center mb-3">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                {focusedMed.brandName}
              </h3>
              <p className="text-xs font-mono text-slate-400 font-bold">
                {focusedMed.genericName} // Spec Node
              </p>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/40 dark:border-slate-800/50">
                <h5 className="font-bold text-slate-400 uppercase tracking-wider mb-1 text-[10px]">
                  Primary Directives (Uses)
                </h5>
                <p className="text-slate-500 dark:text-slate-300 font-medium">
                  {focusedMed.uses}
                </p>
              </div>
              <div className="p-3.5 bg-red-500/5 rounded-xl border border-red-500/10">
                <h5 className="font-bold text-red-400 uppercase tracking-wider mb-1 text-[10px]">
                  Counter-Indications (Side Effects)
                </h5>
                <p className="text-red-500/80 font-medium">
                  {focusedMed.sideEffects}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Layers className="w-8 h-8 mx-auto opacity-40 animate-pulse" />
            <p className="text-xs font-medium max-w-[180px] mx-auto">
              Select any pharmaceutical card matrix component to load structural
              deep-link analytics views.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
