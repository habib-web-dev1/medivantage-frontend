"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Stethoscope,
  AlertCircle,
  Calendar,
  BadgeCheck,
  Briefcase,
  Star,
  RefreshCw,
} from "lucide-react";
import { apiClient } from "@/lib/axios";
import { SkeletonCard } from "@/components/skeletons/SkeletonCard";
import type { User } from "@/types";

interface DoctorsResponse {
  success: boolean;
  data: User[];
}

const SPECIALTIES = [
  "All",
  "Cardiology",
  "Pulmonology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Psychiatry",
  "General Practice",
];

const SPECIALTY_COLORS: Record<string, string> = {
  Cardiology: "bg-rose-500/10 text-rose-500",
  Pulmonology: "bg-sky-500/10 text-sky-500",
  Endocrinology: "bg-violet-500/10 text-violet-500",
  Gastroenterology: "bg-amber-500/10 text-amber-500",
  Neurology: "bg-indigo-500/10 text-indigo-500",
  Orthopedics: "bg-emerald-500/10 text-emerald-500",
  Pediatrics: "bg-pink-500/10 text-pink-500",
  Dermatology: "bg-orange-500/10 text-orange-500",
  Psychiatry: "bg-purple-500/10 text-purple-500",
  "General Practice": "bg-teal-500/10 text-teal-500",
};

const AVATAR_COLORS = [
  "from-medical-500 to-medical-600",
  "from-indigo-500 to-indigo-600",
  "from-emerald-500 to-emerald-600",
  "from-violet-500 to-violet-600",
  "from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600",
];

export default function DoctorsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("All");

  const { data, isLoading, isError, refetch } = useQuery<DoctorsResponse>({
    queryKey: ["doctors"],
    queryFn: () => apiClient.get("/doctors").then((r) => r.data),
    staleTime: 60_000,
  });

  const allDoctors = data?.data ?? [];

  const filtered = allDoctors.filter((d) => {
    const matchSearch =
      !search ||
      `${d.firstName} ${d.lastName} ${d.doctorProfile?.specialization ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchSpec =
      activeSpecialty === "All" ||
      d.doctorProfile?.specialization === activeSpecialty;
    return matchSearch && matchSpec;
  });

  const handleBook = (doctorId: string) => {
    sessionStorage.setItem("selectedDoctorId", doctorId);
    router.push("/patient/bookings");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-black tracking-tight">Find a Doctor</h1>
        <p className="text-sm text-slate-400 mt-1">
          {allDoctors.length > 0
            ? `${allDoctors.length} verified practitioners ready to help.`
            : "Browse verified practitioners and book a consultation."}
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative max-w-md"
      >
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-medical-500 transition font-medium"
        />
      </motion.div>

      {/* Specialty filter pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 flex-wrap"
      >
        {SPECIALTIES.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSpecialty(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeSpecialty === s
                ? "bg-medical-500 text-white shadow-md shadow-medical-500/25"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-medical-400"
            }`}
          >
            {s}
          </motion.button>
        ))}
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-20 gap-4"
        >
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <p className="font-bold text-slate-600 dark:text-slate-300">
            Failed to load doctors
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-medical-500 text-white rounded-xl text-sm font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </motion.button>
        </motion.div>
      )}

      {/* Empty */}
      {!isLoading && !isError && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center text-slate-400"
        >
          <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-bold">
            No doctors found{search ? ` for "${search}"` : ""}
          </p>
          <p className="text-xs mt-1">
            Try a different search or specialty filter.
          </p>
        </motion.div>
      )}

      {/* Doctor cards */}
      {!isLoading && !isError && filtered.length > 0 && (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((doctor, i) => {
              const specColor =
                SPECIALTY_COLORS[doctor.doctorProfile?.specialization ?? ""] ??
                "bg-slate-500/10 text-slate-500";
              const avatarGrad = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <motion.div
                  key={doctor.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 hover:border-medical-400 dark:hover:border-medical-600 hover:shadow-xl hover:shadow-medical-500/5 transition-shadow"
                >
                  {/* Avatar + info */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-14 h-14 bg-linear-to-br ${avatarGrad} text-white rounded-2xl flex items-center justify-center shrink-0 text-lg font-black shadow-lg`}
                    >
                      {doctor.firstName?.[0]}
                      {doctor.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg mt-1 ${specColor}`}
                      >
                        <Stethoscope className="w-2.5 h-2.5" />
                        {doctor.doctorProfile?.specialization ??
                          "General Practice"}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        4.9
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  {doctor.doctorProfile?.bio && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {doctor.doctorProfile.bio}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {doctor.doctorProfile?.experienceYears && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {doctor.doctorProfile.experienceYears} yrs
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                      <BadgeCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>

                  {/* Book button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleBook(doctor.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-medical-500 text-white rounded-xl text-xs font-bold hover:bg-medical-600 transition shadow-md shadow-medical-500/20"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book Consultation
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
