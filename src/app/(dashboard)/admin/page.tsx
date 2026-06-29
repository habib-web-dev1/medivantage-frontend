"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Stethoscope,
  Calendar,
  Pill,
  CheckCircle,
  TrendingUp,
  Shield,
  Activity,
  ChevronRight,
  UserCheck,
  UserX,
  BadgeCheck,
  BarChart3,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { apiClient } from "@/lib/axios";
import { SkeletonCard } from "@/components/skeletons/SkeletonCard";
import { SkeletonTable } from "@/components/skeletons/SkeletonTable";
import type { User } from "@/types";

interface StatsResponse {
  success: boolean;
  data: {
    totalUsers: number;
    verifiedDoctors: number;
    pendingDoctors: number;
    totalAppointments: number;
    totalMedicines: number;
  };
}

interface DoctorsResponse {
  success: boolean;
  data: User[];
}

interface UsersResponse {
  success: boolean;
  data: User[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AdminDashboard() {
  const qc = useQueryClient();

  const { data: statsData, isLoading: statsLoading } = useQuery<StatsResponse>({
    queryKey: ["admin-stats"],
    queryFn: () => apiClient.get("/admin/stats").then((r) => r.data),
    staleTime: 60_000,
  });

  const { data: doctorsData, isLoading: doctorsLoading } =
    useQuery<DoctorsResponse>({
      queryKey: ["unverified-doctors"],
      queryFn: () =>
        apiClient.get("/doctors?verified=false&active=all").then((r) => r.data),
      staleTime: 30_000,
    });

  const { data: usersData, isLoading: usersLoading } = useQuery<UsersResponse>({
    queryKey: ["admin-users"],
    queryFn: () => apiClient.get("/admin/users").then((r) => r.data),
    staleTime: 60_000,
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/admin/doctors/${id}/verify`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["unverified-doctors"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const toggleUserMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/admin/users/${id}/status`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const stats = statsData?.data;
  const unverifiedDoctors = (doctorsData?.data ?? []).filter(
    (d) => !d.doctorProfile?.isVerified,
  );
  const users = usersData?.data ?? [];

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-medical-500",
      bg: "bg-medical-500/10",
      gradient: "from-medical-500/5",
      change: "+12%",
    },
    {
      label: "Verified Doctors",
      value: stats?.verifiedDoctors ?? 0,
      icon: BadgeCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      gradient: "from-emerald-500/5",
      change: "+3",
    },
    {
      label: "Pending Approval",
      value: stats?.pendingDoctors ?? 0,
      icon: Stethoscope,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      gradient: "from-amber-500/5",
      change: "Needs review",
    },
    {
      label: "Appointments",
      value: stats?.totalAppointments ?? 0,
      icon: Calendar,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      gradient: "from-indigo-500/5",
      change: "+8%",
    },
    {
      label: "Medicines",
      value: stats?.totalMedicines ?? 0,
      icon: Pill,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      gradient: "from-rose-500/5",
      change: "In catalog",
    },
  ];

  const roleColors: Record<string, string> = {
    patient: "bg-medical-500/10 text-medical-500",
    doctor: "bg-indigo-500/10 text-indigo-500",
    admin: "bg-emerald-500/10 text-emerald-500",
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-linear-to-br from-emerald-600 to-teal-700 rounded-3xl p-7 text-white"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">
              Admin Control Center
            </p>
            <h1 className="text-2xl font-black">System Overview 🛡️</h1>
            <p className="text-emerald-100 text-sm mt-2 max-w-md">
              Manage users, verify doctors, and monitor platform health. You
              have{" "}
              <span className="font-black text-white">
                {unverifiedDoctors.length}
              </span>{" "}
              doctor{unverifiedDoctors.length !== 1 ? "s" : ""} pending
              verification.
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm shrink-0">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="relative flex items-center gap-3 mt-5">
          <Link
            href="/admin/medicines"
            className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-50 transition"
          >
            <Pill className="w-3.5 h-3.5" />
            Manage Medicines
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            {stats?.totalUsers ?? "—"} registered users
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statsLoading
          ? [1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
          : statCards.map(
              (
                { label, value, icon: Icon, color, bg, gradient, change },
                i,
              ) => (
                <motion.div
                  key={label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className={`bg-linear-to-br ${gradient} to-transparent bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5`}
                >
                  <div
                    className={`w-9 h-9 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    {label}
                  </p>
                  <p className={`text-[10px] font-bold mt-1.5 ${color}`}>
                    {change}
                  </p>
                </motion.div>
              ),
            )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Doctor Verification */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
              <h2 className="font-black text-sm">Doctor Verification</h2>
            </div>
            {unverifiedDoctors.length > 0 && (
              <span className="text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                {unverifiedDoctors.length} pending
              </span>
            )}
          </div>

          <div className="p-4">
            {doctorsLoading ? (
              <SkeletonTable rows={3} />
            ) : unverifiedDoctors.length === 0 ? (
              <div className="flex flex-col items-center py-10 gap-3 text-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="font-bold text-slate-500 text-sm">
                  All doctors are verified
                </p>
                <p className="text-xs text-slate-400">
                  No pending verification requests.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {unverifiedDoctors.map((doc, i) => (
                  <motion.div
                    key={doc.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-500/5 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-indigo-500 font-black text-xs">
                          {doc.firstName?.[0]}
                          {doc.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          Dr. {doc.firstName} {doc.lastName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {doc.doctorProfile?.specialization ?? "General"} ·{" "}
                          {doc.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => verifyMutation.mutate(doc.id)}
                      disabled={verifyMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition disabled:opacity-50 shrink-0"
                    >
                      {verifyMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <BadgeCheck className="w-3 h-3" />
                      )}
                      Approve
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Platform health */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h2 className="font-black text-sm">Platform Health</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Doctor Verification Rate",
                pct:
                  (stats?.verifiedDoctors ?? 0) + (stats?.pendingDoctors ?? 0) >
                  0
                    ? Math.round(
                        ((stats?.verifiedDoctors ?? 0) /
                          ((stats?.verifiedDoctors ?? 0) +
                            (stats?.pendingDoctors ?? 0))) *
                          100,
                      )
                    : 0,
                color: "bg-emerald-500",
                textColor: "text-emerald-500",
              },
              {
                label: "Medicine Catalog Coverage",
                pct: Math.min(100, ((stats?.totalMedicines ?? 0) / 50) * 100),
                color: "bg-rose-500",
                textColor: "text-rose-500",
              },
              {
                label: "User Engagement",
                pct: Math.min(
                  100,
                  ((stats?.totalAppointments ?? 0) /
                    Math.max(1, stats?.totalUsers ?? 1)) *
                    100,
                ),
                color: "bg-indigo-500",
                textColor: "text-indigo-500",
              },
            ].map(({ label, pct, color, textColor }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">{label}</span>
                  <span className={`font-black ${textColor}`}>
                    {Math.round(pct)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      delay: 0.5,
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`h-full ${color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-emerald-500">
                {stats?.verifiedDoctors ?? 0}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Active Doctors
              </p>
            </div>
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-indigo-500">
                {stats?.totalAppointments ?? 0}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Total Bookings
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Management */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-medical-500" />
            <h2 className="font-black text-sm">User Management</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              {users.length} users
            </span>
            <Link
              href="/admin/users"
              className="text-xs text-medical-500 font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {usersLoading ? (
          <div className="p-6">
            <SkeletonTable rows={5} />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3 text-center">
            <Users className="w-10 h-10 text-slate-300" />
            <p className="font-bold text-slate-500 text-sm">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.slice(0, 8).map((u, i) => (
              <motion.div
                key={u.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-slate-500 font-black text-xs">
                      {u.firstName?.[0]}
                      {u.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${roleColors[u.role] ?? "bg-slate-100 text-slate-500"}`}
                  >
                    {u.role}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${u.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() =>
                      toggleUserMutation.mutate({
                        id: u.id,
                        isActive: !u.isActive,
                      })
                    }
                    disabled={toggleUserMutation.isPending}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-50 ${
                      u.isActive
                        ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                        : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                    }`}
                  >
                    {toggleUserMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : u.isActive ? (
                      <UserX className="w-3 h-3" />
                    ) : (
                      <UserCheck className="w-3 h-3" />
                    )}
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {users.length > 8 && (
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <Link
              href="/admin/users"
              className="flex items-center justify-center gap-2 text-xs text-medical-500 font-bold hover:gap-3 transition-all"
            >
              View all {users.length} users <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </motion.div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            href: "/admin/medicines",
            label: "Medicine Catalog",
            desc: "Add, edit, or remove medicines",
            icon: Pill,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
          },
          {
            href: "/admin/doctors",
            label: "Doctor Directory",
            desc: "View and manage all doctors",
            icon: Stethoscope,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/20",
          },
          {
            href: "/admin/reports",
            label: "Analytics & Reports",
            desc: "Platform usage and insights",
            icon: BarChart3,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
          },
        ].map(({ href, label, desc, icon: Icon, color, bg, border }, i) => (
          <motion.div
            key={href}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <Link
              href={href}
              className={`flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border ${border} rounded-2xl hover:shadow-md transition group`}
            >
              <div
                className={`w-11 h-11 ${bg} ${color} rounded-xl flex items-center justify-center shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <ChevronRight
                className={`w-4 h-4 ${color} opacity-0 group-hover:opacity-100 transition`}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
