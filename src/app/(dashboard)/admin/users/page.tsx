"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Loader2,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Mail,
  Calendar,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/axios";
import { SkeletonTable } from "@/components/skeletons/SkeletonTable";
import type { User } from "@/types";

interface UsersResponse {
  success: boolean;
  data: User[];
}

const ROLE_CONFIG = {
  patient: {
    label: "Patient",
    icon: HeartPulse,
    color: "text-medical-500",
    bg: "bg-medical-500/10",
    border: "border-medical-500/20",
  },
  doctor: {
    label: "Doctor",
    icon: Stethoscope,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
};

import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "patient" | "doctor" | "admin"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["admin-users-full"],
    queryFn: () => apiClient.get("/admin/users").then((r) => r.data),
    staleTime: 30_000,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/admin/users/${id}/status`, { isActive }),
    onMutate: async ({ id, isActive }) => {
      await qc.cancelQueries({ queryKey: ["admin-users-full"] });
      const prev = qc.getQueryData<UsersResponse>(["admin-users-full"]);
      qc.setQueryData<UsersResponse>(["admin-users-full"], (old) =>
        old
          ? {
              ...old,
              data: old.data.map((u) => (u.id === id ? { ...u, isActive } : u)),
            }
          : old,
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["admin-users-full"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["admin-users-full"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const users = data?.data ?? [];

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? u.isActive
          : !u.isActive;
    return matchSearch && matchRole && matchStatus;
  });

  const counts = {
    all: users.length,
    patient: users.filter((u) => u.role === "patient").length,
    doctor: users.filter((u) => u.role === "doctor").length,
    admin: users.filter((u) => u.role === "admin").length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black">User Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            View, filter, and manage all platform users.
          </p>
        </div>

        {/* Summary pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(
            [
              {
                key: "patient",
                color: "text-medical-500",
                bg: "bg-medical-500/10",
              },
              {
                key: "doctor",
                color: "text-indigo-500",
                bg: "bg-indigo-500/10",
              },
              {
                key: "admin",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
            ] as const
          ).map(({ key, color, bg }) => (
            <div
              key={key}
              className={`flex items-center gap-1.5 px-3 py-1.5 ${bg} rounded-xl`}
            >
              <span className={`text-sm font-black ${color}`}>
                {counts[key]}
              </span>
              <span className={`text-xs font-semibold capitalize ${color}`}>
                {key}s
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-medical-500 transition font-medium"
          />
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {(["all", "patient", "doctor", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold capitalize transition ${
                roleFilter === r
                  ? r === "patient"
                    ? "bg-medical-500 text-white"
                    : r === "doctor"
                      ? "bg-indigo-500 text-white"
                      : r === "admin"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 text-white dark:bg-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold capitalize transition ${
                statusFilter === s
                  ? s === "active"
                    ? "bg-emerald-500 text-white"
                    : s === "inactive"
                      ? "bg-red-500 text-white"
                      : "bg-slate-800 text-white dark:bg-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Users",
            value: counts.all,
            color: "text-slate-700 dark:text-slate-200",
            bg: "bg-white dark:bg-slate-900",
          },
          {
            label: "Active",
            value: counts.active,
            color: "text-emerald-500",
            bg: "bg-emerald-500/5",
          },
          {
            label: "Inactive",
            value: counts.inactive,
            color: "text-red-500",
            bg: "bg-red-500/5",
          },
          {
            label: "Showing",
            value: filtered.length,
            color: "text-medical-500",
            bg: "bg-medical-500/5",
          },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className={`${bg} border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3`}
          >
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={8} />
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-16 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-500">No users found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            {["User", "Email", "Role", "Status", "Action"].map((h) => (
              <p
                key={h}
                className="text-[10px] font-black uppercase tracking-wider text-slate-400"
              >
                {h}
              </p>
            ))}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((u, i) => {
              const rc = ROLE_CONFIG[u.role] ?? ROLE_CONFIG.patient;
              const RoleIcon = rc.icon;

              return (
                <motion.div
                  key={u.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  {/* User */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 ${rc.bg} rounded-xl flex items-center justify-center shrink-0`}
                    >
                      <span className={`${rc.color} font-black text-xs`}>
                        {u.firstName?.[0]}
                        {u.lastName?.[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        ID: {u.id.slice(-6)}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {u.email}
                    </p>
                  </div>

                  {/* Role */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg w-fit ${rc.color} ${rc.bg} border ${rc.border}`}
                  >
                    <RoleIcon className="w-2.5 h-2.5" />
                    {rc.label}
                  </span>

                  {/* Status */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg w-fit ${
                      u.isActive
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}
                  >
                    {u.isActive ? (
                      <UserCheck className="w-2.5 h-2.5" />
                    ) : (
                      <UserX className="w-2.5 h-2.5" />
                    )}
                    {u.isActive ? "Active" : "Inactive"}
                  </span>

                  {/* Action */}
                  <button
                    onClick={() =>
                      toggleMutation.mutate({ id: u.id, isActive: !u.isActive })
                    }
                    disabled={toggleMutation.isPending}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-50 ${
                      u.isActive
                        ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20"
                    }`}
                  >
                    {toggleMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : u.isActive ? (
                      <UserX className="w-3 h-3" />
                    ) : (
                      <UserCheck className="w-3 h-3" />
                    )}
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">
              Showing {filtered.length} of {users.length} users
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {counts.active} active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                {counts.inactive} inactive
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
