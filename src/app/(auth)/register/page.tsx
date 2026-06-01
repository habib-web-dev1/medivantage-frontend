"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Stethoscope,
  Calendar,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterInput } from "@/validations/schemas";
import { apiClient } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import type { User as UserType } from "@/types";

interface RegisterResponse {
  success: boolean;
  accessToken: string;
  data: UserType;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAccessToken, setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "patient" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      specialization,
      licenseNumber,
      experienceYears,
      bio,
      dateOfBirth,
      gender,
      bloodType,
    } = data;

    const payload: Record<string, unknown> = {
      firstName,
      lastName,
      email,
      password,
      role,
    };

    if (role === "doctor") {
      payload.doctorProfile = {
        ...(specialization && { specialization }),
        ...(licenseNumber && { licenseNumber }),
        ...(experienceYears && { experienceYears: Number(experienceYears) }),
        ...(bio && { bio }),
      };
    }

    if (role === "patient") {
      payload.patientProfile = {
        ...(dateOfBirth && { dateOfBirth }),
        ...(gender && { gender }),
        ...(bloodType && { bloodType }),
      };
    }

    try {
      const res = await apiClient.post<RegisterResponse>(
        "/auth/register",
        payload,
      );
      const { accessToken, data: user } = res.data;
      setAccessToken(accessToken);
      setUser(user);
      document.cookie = `medivantage-role=${user.role}; path=/; SameSite=Lax`;
      const roleRoutes: Record<string, string> = {
        patient: "/patient",
        doctor: "/doctor",
        admin: "/admin",
      };
      router.push(roleRoutes[user.role] ?? "/patient");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Registration failed. Please try again.";
      setError("root", { message });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-medical-500 to-indigo-500" />

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Join the MediVantage network
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Role toggle — clean buttons, no hidden inputs */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setValue("role", "patient", { shouldValidate: true })
                }
                className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                  selectedRole === "patient"
                    ? "bg-medical-500 text-white border-medical-500"
                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-medical-400"
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() =>
                  setValue("role", "doctor", { shouldValidate: true })
                }
                className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                  selectedRole === "doctor"
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400"
                }`}
              >
                Doctor
              </button>
            </div>
            {/* Hidden input so RHF tracks the value */}
            <input type="hidden" {...register("role")} />
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder="Alex"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-medical-500 transition"
                />
              </div>
              {errors.firstName && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Mercer"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-medical-500 transition"
                />
              </div>
              {errors.lastName && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                {...register("email")}
                placeholder="alex@medivantage.ai"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-medical-500 transition"
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-red-500 mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                {...register("password")}
                placeholder="Min. 8 characters"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-medical-500 transition"
              />
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-500 mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Doctor fields */}
          {selectedRole === "doctor" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-3"
            >
              <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider flex items-center gap-1">
                <Stethoscope className="w-3 h-3" /> Doctor Profile
              </p>
              <input
                type="text"
                {...register("specialization")}
                placeholder="Specialization (e.g. Cardiology)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
              <input
                type="text"
                {...register("licenseNumber")}
                placeholder="License Number (e.g. MD-123456)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
              <input
                type="number"
                {...register("experienceYears")}
                placeholder="Years of Experience"
                min={0}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
              <textarea
                {...register("bio")}
                placeholder="Brief professional bio…"
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </motion.div>
          )}

          {/* Patient fields */}
          {selectedRole === "patient" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-3"
            >
              <p className="text-[10px] font-black uppercase text-medical-500 tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Patient Profile (optional)
              </p>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-medical-500 transition"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  {...register("gender")}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-medical-500 transition"
                >
                  <option value="">Gender…</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <select
                  {...register("bloodType")}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-medical-500 transition"
                >
                  <option value="">Blood Type…</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </motion.div>
          )}

          {/* API error */}
          {errors.root && (
            <p className="text-[11px] font-mono bg-red-500/10 text-red-500 p-2.5 rounded-lg border border-red-500/20">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-medical-500 text-white rounded-xl font-bold text-sm hover:bg-medical-600 transition shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Account…
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-xs text-center text-slate-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-medical-500 font-bold hover:underline"
            >
              Sign in
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
