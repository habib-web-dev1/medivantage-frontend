"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Pill,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Package,
  Tag,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/lib/axios";
import { SkeletonCard } from "@/components/skeletons/SkeletonCard";
import type { Medicine } from "@/types";

interface MedicineDetailResponse {
  success: boolean;
  data: Medicine;
}

export default function MedicineDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, isError } = useQuery<MedicineDetailResponse>({
    queryKey: ["medicine", id],
    queryFn: async () => {
      const res = await apiClient.get(`/medicines/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const medicine = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !medicine) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <Link
          href="/medicines"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-medical-500 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-700 dark:text-slate-200">
              Medicine not found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              This medicine could not be loaded. It may have been removed or the
              ID is invalid.
            </p>
          </div>
          <Link
            href="/medicines"
            className="px-5 py-2.5 bg-medical-500 text-white rounded-xl text-sm font-bold hover:bg-medical-600 transition"
          >
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Back link */}
      <Link
        href="/medicines"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-medical-500 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Hero Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-medical-500/10 text-medical-500 rounded-2xl flex items-center justify-center shrink-0">
                <Pill className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  {medicine.brandName}
                </h1>
                <p className="text-sm font-mono text-slate-400 mt-0.5">
                  {medicine.genericName}
                </p>
                <span className="inline-block mt-2 text-[11px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-500">
                  {medicine.category}
                </span>
              </div>
            </div>
            <div className="flex gap-4 sm:flex-col sm:items-end">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Price</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">
                  ${medicine.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Stock</p>
                <p
                  className={`text-lg font-black ${
                    medicine.stock > 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {medicine.stock > 0
                    ? `${medicine.stock} units`
                    : "Out of stock"}
                </p>
              </div>
            </div>
          </div>

          {medicine.description && (
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              {medicine.description}
            </p>
          )}
        </div>

        {/* Detail Sections */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Uses */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">
                Uses
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {medicine.uses}
            </p>
          </div>

          {/* Side Effects */}
          <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-red-400">
                Side Effects
              </h3>
            </div>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 leading-relaxed">
              {medicine.sideEffects}
            </p>
          </div>

          {/* Precautions */}
          <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-5 space-y-3 sm:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-amber-500">
                Precautions
              </h3>
            </div>
            <p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
              {medicine.precautions}
            </p>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Category:</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {medicine.category}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5">
            <Package className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Stock:</span>
            <span
              className={`text-xs font-bold ${
                medicine.stock > 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {medicine.stock} units
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
