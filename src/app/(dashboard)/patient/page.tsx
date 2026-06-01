"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  FileText,
  Pill,
  Brain,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  Stethoscope,
  ChevronRight,
  Sparkles,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { apiClient } from "@/lib/axios";
import { SkeletonCard } from "@/components/skeletons/SkeletonCard";
import { useAuthStore } from "@/store/authStore";
import type { Appointment } from "@/types";

interface AppointmentsResponse {
  success: boolean;
  data: Appointment[];
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
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
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function PatientDashboard() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery<AppointmentsResponse>({
    queryKey: ["patient-appointments"],
    queryFn: () => apiClient.get("/patient/appointments").then((r) => r.data),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const appointments = data?.data ?? [];
  const upcoming = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed",
  );
  const completed = appointments.filter((a) => a.status === "completed");
  const withPrescriptions = appointments.filter((a) => a.prescription?.pdfUrl);
  const medicineCount = withPrescriptions.reduce(
    (acc, a) => acc + (a.prescription?.medications?.length ?? 0),
    0,
  );

  const recentAppointments = [...appointments]
    .sort(
      (a, b) =>
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime(),
    )
    .slice(0, 4);

  const stats = [
    {
      label: "Upcoming",
      value: upcoming.length,
      icon: Calendar,
      href: "/patient/bookings",
      color: "text-medical-500",
      bg: "bg-medical-500/10",
      gradient: "from-medical-500/5 to-medical-500/0",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: CheckCircle2,
      href: "/patient/bookings",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      gradient: "from-emerald-500/5 to-emerald-500/0",
    },
    {
      label: "Prescriptions",
      value: withPrescriptions.length,
      icon: FileText,
      href: "/patient/prescriptions",
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      gradient: "from-violet-500/5 to-violet-500/0",
    },
    {
      label: "Active Meds",
      value: medicineCount,
      icon: Pill,
      href: "/patient/medicines",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      gradient: "from-rose-500/5 to-rose-500/0",
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
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-linear-to-br from-medical-500 to-medical-700 rounded-3xl p-7 text-white"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-medical-100 text-sm font-medium mb-1">
              {greeting()},
            </p>
            <h1 className="text-2xl font-black">
              {user?.firstName} {user?.lastName} 👋
            </h1>
            <p className="text-medical-100 text-sm mt-2 max-w-sm">
              Here&apos;s your health snapshot for today. Stay on top of your
              appointments and medications.
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm shrink-0">
            <Heart className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="relative flex items-center gap-3 mt-5">
          <Link
            href="/patient/bookings"
            className="px-4 py-2 bg-white text-medical-600 rounded-xl text-xs font-bold hover:bg-medical-50 transition"
          >
            Book Appointment
          </Link>
          <Link
            href="/patient/symptoms"
            className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl text-xs font-bold hover:bg-white/20 transition"
          >
            Check Symptoms
          </Link>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          : stats.map(
              ({ label, value, icon: Icon, href, color, bg, gradient }, i) => (
                <motion.div
                  key={label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                >
                  <Link
                    href={href}
                    className={`block bg-linear-to-br ${gradient} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-medical-400 dark:hover:border-medical-600 transition group`}
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
                    <span
                      className={`text-xs ${color} font-bold flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition`}
                    >
                      View all <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </motion.div>
              ),
            )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent appointments */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-medical-500" />
              <h2 className="font-black text-sm">Recent Appointments</h2>
            </div>
            <Link
              href="/patient/bookings"
              className="text-xs text-medical-500 font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl shimmer-bg"
                />
              ))}
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-slate-300" />
              </div>
              <p className="font-bold text-slate-500">No appointments yet</p>
              <p className="text-xs text-slate-400">
                Book your first consultation with a doctor.
              </p>
              <Link
                href="/doctors"
                className="mt-1 px-5 py-2.5 bg-medical-500 text-white rounded-xl text-xs font-bold hover:bg-medical-600 transition"
              >
                Find a Doctor
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAppointments.map((appt, i) => {
                const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                return (
                  <motion.div
                    key={appt._id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <div className="w-10 h-10 bg-medical-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5 text-medical-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">
                        Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(appt.appointmentDate).toLocaleDateString(
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
                    <span
                      className={`flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${cfg.color} ${cfg.bg} ${cfg.border} shrink-0`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          {/* AI Symptom Checker */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-linear-to-br from-violet-500 to-indigo-600 rounded-2xl p-5 text-white"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <p className="font-black text-sm">AI Symptom Checker</p>
                <p className="text-violet-200 text-[10px]">
                  Powered by MediVantage AI
                </p>
              </div>
            </div>
            <p className="text-violet-100 text-xs mb-4 leading-relaxed">
              Describe your symptoms and get instant AI-powered diagnostic
              insights before your appointment.
            </p>
            <Link
              href="/patient/symptoms"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-violet-600 rounded-xl text-xs font-bold hover:bg-violet-50 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Start Analysis
            </Link>
          </motion.div>

          {/* Health stats */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-medical-500" />
              <h3 className="font-black text-sm">Health Summary</h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Total Visits",
                  value: appointments.length,
                  color: "bg-medical-500",
                  pct: Math.min(100, appointments.length * 10),
                },
                {
                  label: "Completion Rate",
                  value: `${appointments.length ? Math.round((completed.length / appointments.length) * 100) : 0}%`,
                  color: "bg-emerald-500",
                  pct: appointments.length
                    ? Math.round((completed.length / appointments.length) * 100)
                    : 0,
                },
                {
                  label: "Active Prescriptions",
                  value: withPrescriptions.length,
                  color: "bg-violet-500",
                  pct: Math.min(100, withPrescriptions.length * 20),
                },
              ].map(({ label, value, color, pct }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">{label}</span>
                    <span className="font-black">{value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        delay: 0.5,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`h-full ${color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <h3 className="font-black text-sm mb-3">Quick Access</h3>
            <div className="space-y-1">
              {[
                {
                  href: "/doctors",
                  label: "Find a Doctor",
                  icon: Stethoscope,
                  color: "text-medical-500",
                },
                {
                  href: "/patient/prescriptions",
                  label: "My Prescriptions",
                  icon: FileText,
                  color: "text-violet-500",
                },
                {
                  href: "/patient/medicines",
                  label: "Medicine Tracker",
                  icon: Pill,
                  color: "text-rose-500",
                },
              ].map(({ href, label, icon: Icon, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
                >
                  <Icon className={`w-4 h-4 ${color} shrink-0`} />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition">
                    {label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-slate-500 transition" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
