"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  TrendingUp,
  Stethoscope,
  FileText,
  Activity,
  Check,
  X,
  Loader2,
  Star,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { apiClient } from "@/lib/axios";
import { SkeletonList } from "@/components/skeletons/SkeletonList";
import { useAuthStore } from "@/store/authStore";
import type { Appointment } from "@/types";

interface AppointmentsResponse {
  success: boolean;
  data: Appointment[];
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  completed: {
    label: "Completed",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function DoctorDashboard() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery<AppointmentsResponse>({
    queryKey: ["doctor-appointments"],
    queryFn: () => apiClient.get("/doctor/appointments").then((r) => r.data),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch(`/doctor/appointments/${id}/status`, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["doctor-appointments"] });
      const prev = qc.getQueryData<AppointmentsResponse>([
        "doctor-appointments",
      ]);
      qc.setQueryData<AppointmentsResponse>(["doctor-appointments"], (old) =>
        old
          ? {
              ...old,
              data: old.data.map((a) =>
                a._id === id
                  ? { ...a, status: status as Appointment["status"] }
                  : a,
              ),
            }
          : old,
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["doctor-appointments"], ctx.prev);
    },
    onSettled: () =>
      qc.invalidateQueries({ queryKey: ["doctor-appointments"] }),
  });

  const appointments = data?.data ?? [];
  const sorted = [...appointments].sort(
    (a, b) =>
      new Date(a.appointmentDate).getTime() -
      new Date(b.appointmentDate).getTime(),
  );

  const pending = appointments.filter((a) => a.status === "pending");
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const completed = appointments.filter((a) => a.status === "completed");
  const today = appointments.filter((a) => {
    const d = new Date(a.appointmentDate);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const stats = [
    {
      label: "Today",
      value: today.length,
      icon: Calendar,
      color: "text-medical-500",
      bg: "bg-medical-500/10",
    },
    {
      label: "Pending",
      value: pending.length,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Confirmed",
      value: confirmed.length,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: Star,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-linear-to-br from-indigo-600 to-indigo-800 rounded-3xl p-7 text-white"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">
              {greeting()},
            </p>
            <h1 className="text-2xl font-black">
              Dr. {user?.firstName} {user?.lastName} 🩺
            </h1>
            <p className="text-indigo-200 text-sm mt-2 max-w-sm">
              {user?.doctorProfile?.specialization && (
                <span className="font-semibold">
                  {user.doctorProfile.specialization} ·{" "}
                </span>
              )}
              You have{" "}
              <span className="font-black text-white">{pending.length}</span>{" "}
              pending appointment{pending.length !== 1 ? "s" : ""} awaiting
              review.
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm shrink-0">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="relative flex items-center gap-3 mt-5">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            {today.length} appointment{today.length !== 1 ? "s" : ""} today
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl shimmer-bg"
              />
            ))
          : stats.map(({ label, value, icon: Icon, color, bg }, i) => (
              <motion.div
                key={label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
              >
                <div
                  className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-3xl font-black">{value}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {label}
                </p>
              </motion.div>
            ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointment queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <h2 className="font-black text-base">Appointment Queue</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {sorted.length} total
            </span>
          </div>

          {isLoading && <SkeletonList count={4} />}

          {isError && (
            <div className="flex flex-col items-center py-16 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="font-bold text-slate-600 dark:text-slate-300">
                Failed to load appointments
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && sorted.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-500">No appointments yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Patients will appear here once they book with you.
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="space-y-3">
              {sorted.map((appt, i) => {
                const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.pending;
                return (
                  <motion.div
                    key={appt._id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                          <span className="text-indigo-500 font-black text-sm">
                            {appt.patient?.firstName?.[0]}
                            {appt.patient?.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {appt.patient?.firstName} {appt.patient?.lastName}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(appt.appointmentDate).toLocaleString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {appt.aiDiagnostics?.reportedSymptoms?.length ? (
                      <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3 mb-3">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                          Reported Symptoms
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {appt.aiDiagnostics.reportedSymptoms.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-lg font-medium text-slate-600 dark:text-slate-300"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                        {appt.aiDiagnostics.aiSuggestedPreliminaryDiagnosis && (
                          <p className="text-xs text-indigo-500 font-medium mt-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            AI:{" "}
                            {appt.aiDiagnostics.aiSuggestedPreliminaryDiagnosis}
                          </p>
                        )}
                      </div>
                    ) : null}

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {appt.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              statusMutation.mutate({
                                id: appt._id,
                                status: "confirmed",
                              })
                            }
                            disabled={statusMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition disabled:opacity-50"
                          >
                            {statusMutation.isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              statusMutation.mutate({
                                id: appt._id,
                                status: "cancelled",
                              })
                            }
                            disabled={statusMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50"
                          >
                            <X className="w-3 h-3" /> Decline
                          </button>
                        </>
                      )}
                      {(appt.status === "confirmed" ||
                        appt.status === "completed") && (
                        <Link
                          href={`/doctor/appointments/${appt._id}/prescribe`}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition"
                        >
                          <FileText className="w-3 h-3" /> Write Prescription
                        </Link>
                      )}
                      {appt.status === "cancelled" && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Appointment
                          cancelled
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Doctor profile card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-black text-base">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <div>
                <p className="font-black text-sm">
                  Dr. {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-400">
                  {user?.doctorProfile?.specialization ?? "General Physician"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                {
                  label: "Experience",
                  value: user?.doctorProfile?.experienceYears
                    ? `${user.doctorProfile.experienceYears} years`
                    : "—",
                },
                {
                  label: "License",
                  value: user?.doctorProfile?.licenseNumber ?? "—",
                },
                {
                  label: "Status",
                  value: user?.doctorProfile?.isVerified
                    ? "Verified"
                    : "Pending",
                  valueClass: user?.doctorProfile?.isVerified
                    ? "text-emerald-500"
                    : "text-amber-500",
                },
              ].map(({ label, value, valueClass }) => (
                <div
                  key={label}
                  className="flex justify-between items-center text-xs"
                >
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className={`font-bold ${valueClass ?? ""}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Today's schedule */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <h3 className="font-black text-sm">Today&apos;s Schedule</h3>
              </div>
              <span className="text-xs font-bold text-indigo-500">
                {today.length} appt{today.length !== 1 ? "s" : ""}
              </span>
            </div>
            {today.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No appointments scheduled for today.
              </p>
            ) : (
              <div className="space-y-2">
                {today.slice(0, 4).map((appt) => (
                  <div
                    key={appt._id}
                    className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">
                        {appt.patient?.firstName} {appt.patient?.lastName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(appt.appointmentDate).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-linear-to-br from-indigo-500/10 to-indigo-500/0 border border-indigo-500/20 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h3 className="font-black text-sm">Performance</h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Completion Rate",
                  pct: appointments.length
                    ? Math.round((completed.length / appointments.length) * 100)
                    : 0,
                  color: "bg-emerald-500",
                },
                {
                  label: "Approval Rate",
                  pct:
                    pending.length + confirmed.length + completed.length > 0
                      ? Math.round(
                          ((confirmed.length + completed.length) /
                            (pending.length +
                              confirmed.length +
                              completed.length)) *
                            100,
                        )
                      : 0,
                  color: "bg-indigo-500",
                },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">{label}</span>
                    <span className="font-black">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        delay: 0.6,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`h-full ${color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/doctor/appointments"
              className="flex items-center justify-center gap-1.5 w-full mt-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl text-xs font-bold hover:bg-indigo-500/20 transition"
            >
              View All Appointments <ArrowUpRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
