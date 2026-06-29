"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Stethoscope,
  BadgeCheck,
  Clock,
  Search,
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  Briefcase,
  Hash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/axios";
import { SkeletonTable } from "@/components/skeletons/SkeletonTable";
import type { User } from "@/types";

interface DoctorsResponse {
  success: boolean;
  data: User[];
}

import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AdminDoctorsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "pending">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading } = useQuery<DoctorsResponse>({
    queryKey: ["admin-all-doctors"],
    queryFn: () =>
      apiClient.get("/doctors?verified=all&active=all").then((r) => r.data),
    staleTime: 30_000,
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/admin/doctors/${id}/verify`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-all-doctors"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      qc.invalidateQueries({ queryKey: ["unverified-doctors"] });
    },
  });

  const doctors = data?.data ?? [];

  const filtered = doctors.filter((d) => {
    const matchSearch =
      !search ||
      `${d.firstName} ${d.lastName} ${d.email} ${d.doctorProfile?.specialization ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : filter === "verified"
          ? d.doctorProfile?.isVerified === true
          : d.doctorProfile?.isVerified !== true;

    return matchSearch && matchFilter;
  });

  const verified = doctors.filter((d) => d.doctorProfile?.isVerified).length;
  const pending = doctors.filter((d) => !d.doctorProfile?.isVerified).length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Doctor Directory</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage and verify all registered doctors on the platform.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center">
            <p className="text-xl font-black text-emerald-500">{verified}</p>
            <p className="text-[10px] text-slate-400 font-medium">Verified</p>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <p className="text-xl font-black text-amber-500">{pending}</p>
            <p className="text-[10px] text-slate-400 font-medium">Pending</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition font-medium"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "verified", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition ${
                filter === f
                  ? f === "verified"
                    ? "bg-emerald-500 text-white"
                    : f === "pending"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-800 text-white dark:bg-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-16 text-center">
          <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-500">No doctors found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search or filter.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            {["Doctor", "Specialization", "Experience", "Status", "Action"].map(
              (h) => (
                <p
                  key={h}
                  className="text-[10px] font-black uppercase tracking-wider text-slate-400"
                >
                  {h}
                </p>
              ),
            )}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((doc, i) => {
              const isVerified = doc.doctorProfile?.isVerified === true;
              const isExpanded = expanded === doc.id;

              return (
                <motion.div
                  key={doc.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                >
                  {/* Main row */}
                  <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    {/* Doctor info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-indigo-500 font-black text-xs">
                          {doc.firstName?.[0]}
                          {doc.lastName?.[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">
                          Dr. {doc.firstName} {doc.lastName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {doc.email}
                        </p>
                      </div>
                    </div>

                    {/* Specialization */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                      {doc.doctorProfile?.specialization ?? (
                        <span className="text-slate-300 dark:text-slate-600">
                          —
                        </span>
                      )}
                    </p>

                    {/* Experience */}
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {doc.doctorProfile?.experienceYears ? (
                        `${doc.doctorProfile.experienceYears} yrs`
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">
                          —
                        </span>
                      )}
                    </p>

                    {/* Status badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg w-fit ${
                        isVerified
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}
                    >
                      {isVerified ? (
                        <BadgeCheck className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {isVerified ? "Verified" : "Pending"}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!isVerified && (
                        <button
                          onClick={() => verifyMutation.mutate(doc.id)}
                          disabled={verifyMutation.isPending}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition disabled:opacity-50"
                        >
                          {verifyMutation.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <BadgeCheck className="w-3 h-3" />
                          )}
                          Verify
                        </button>
                      )}
                      {isVerified && (
                        <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : doc.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-1 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                          <div className="grid sm:grid-cols-3 gap-4 mt-3">
                            <div className="flex items-start gap-2">
                              <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                  Email
                                </p>
                                <p className="text-xs font-medium mt-0.5">
                                  {doc.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Hash className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                  License
                                </p>
                                <p className="text-xs font-medium mt-0.5">
                                  {doc.doctorProfile?.licenseNumber ?? "—"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                  Bio
                                </p>
                                <p className="text-xs font-medium mt-0.5 text-slate-500 line-clamp-2">
                                  {doc.doctorProfile?.bio ?? "No bio provided."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <p className="text-xs text-slate-400 font-medium">
              Showing {filtered.length} of {doctors.length} doctors
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
