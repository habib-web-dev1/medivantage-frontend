"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/axios";
import { SkeletonCard } from "@/components/skeletons/SkeletonCard";
import type { Medicine } from "@/types";

interface MedicinesResponse {
  success: boolean;
  data: Medicine[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const CATEGORIES = [
  "All",
  "Antibiotics",
  "Fever/Pain",
  "Cardiovascular",
  "Respiratory",
  "Vitamins",
  "Supplements",
  "Antihistamines",
];

export default function MedicinesDirectory() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery<MedicinesResponse>({
    queryKey: ["medicines", search, category, page],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      const res = await apiClient.get("/medicines", { params });
      return res.data;
    },
  });

  const medicines = data?.data ?? [];
  const pagination = data?.pagination;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black tracking-tight">
          Medicine Directory
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Browse and search pharmaceutical compounds available on the platform.
        </p>
      </div>

      {/* Search + Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by brand or generic name..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-medical-500 transition font-medium"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                category === cat
                  ? "bg-medical-500 text-white shadow-md"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-medical-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-700 dark:text-slate-200">
              Failed to load medicines
            </p>
            <p className="text-xs text-slate-400 mt-1">
              There was a problem fetching the medicine directory.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-medical-500 text-white rounded-xl text-sm font-bold hover:bg-medical-600 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Medicine Cards Grid */}
      {!isLoading && !isError && (
        <>
          {medicines.length === 0 ? (
            <div className="py-20 text-center text-slate-400 space-y-2">
              <p className="font-medium">
                No medicines found matching your criteria.
              </p>
              <p className="text-xs">
                Try adjusting your search or category filter.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {medicines.map((medicine, idx) => (
                <motion.div
                  key={medicine._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link
                    href={`/medicines/${medicine._id}`}
                    className="block p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-medical-500 transition group h-full"
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-base group-hover:text-medical-500 transition leading-tight">
                            {medicine.brandName}
                          </h4>
                          <span className="text-sm font-black text-slate-800 dark:text-white whitespace-nowrap">
                            ${medicine.price.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 block mt-0.5 mb-2">
                          {medicine.genericName}
                        </span>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {medicine.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                          {medicine.category}
                        </span>
                        <span className="text-xs font-bold text-medical-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:border-medical-400 transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pagination.pages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition ${
                      page === p
                        ? "bg-medical-500 text-white shadow-md"
                        : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-medical-400"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={page === pagination.pages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:border-medical-400 transition"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
