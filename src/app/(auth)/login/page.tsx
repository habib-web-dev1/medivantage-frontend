"use client";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
  Stethoscope,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginInput } from "@/validations/schemas";
import { apiClient } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import type { User as UserType } from "@/types";

interface LoginResponse {
  success: boolean;
  accessToken: string;
  data: UserType;
}

function setRoleCookie(role: string) {
  document.cookie = `medivantage-role=${role}; path=/; SameSite=Lax`;
}

const DEMO_ACCOUNTS = [
  {
    label: "Doctor Demo",
    icon: Stethoscope,
    email: "sarah.jenkins@medivantage.com",
    password: "Doctor@1234",
    color:
      "border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10",
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
    badge: "Doctor",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    label: "Patient Demo",
    icon: User,
    email: "patient@gmail.com",
    password: "Patient123",
    color:
      "border-medical-200 dark:border-medical-800 hover:border-medical-400 hover:bg-medical-50 dark:hover:bg-medical-500/10",
    iconColor: "text-medical-500",
    iconBg: "bg-medical-500/10",
    badge: "Patient",
    badgeColor: "bg-medical-500/10 text-medical-600 dark:text-medical-400",
  },
] as const;

// ── Inner component — uses useSearchParams so must be inside <Suspense> ───────
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from");
  const { setAccessToken, setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginInput) => {
    try {
      const res = await apiClient.post<LoginResponse>("/auth/login", data);
      const { accessToken, data: user } = res.data;

      setAccessToken(accessToken);
      setUser(user);

      setRoleCookie(user.role);

      const roleRoutes: Record<string, string> = {
        patient: "/patient",
        doctor: "/doctor",
        admin: "/admin",
      };
      const destination = fromPath ?? roleRoutes[user.role] ?? "/patient";
      router.push(destination);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Invalid email or password.";
      setError("root", { message });
    }
  };

  const fillDemo = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: false });
    setValue("password", password, { shouldValidate: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
    >
      {/* Gradient header bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-medical-500 to-indigo-500" />

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-medical-500/10 text-medical-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black tracking-tight">
          Welcome to MediVantage
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Sign in to your account
        </p>
      </div>

      {/* Demo account buttons */}
      <div className="mb-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 text-center">
          Try a demo account
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((demo) => {
            const Icon = demo.icon;
            return (
              <button
                key={demo.label}
                type="button"
                onClick={() => fillDemo(demo.email, demo.password)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border bg-white dark:bg-slate-900 transition cursor-pointer ${demo.color}`}
              >
                <div
                  className={`w-8 h-8 ${demo.iconBg} rounded-xl flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-4 h-4 ${demo.iconColor}`} />
                </div>
                <div className="text-left min-w-0">
                  <span
                    className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md ${demo.badgeColor}`}
                  >
                    {demo.badge}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate font-medium">
                    {demo.email}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          <span className="text-[10px] text-slate-400 font-medium">
            or enter manually
          </span>
          <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-4"
        noValidate
      >
        <div>
          <label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="email"
              {...register("email")}
              placeholder="name@example.com"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-medical-500 transition font-medium"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-mono text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-medical-500 transition font-medium"
            />
          </div>
          {errors.password && (
            <p className="text-[11px] font-mono text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="text-[11px] font-mono bg-red-500/10 text-red-500 p-2.5 rounded-lg border border-red-500/20">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-linear-to-r from-medical-500 to-medical-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-medical-500/10 hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-medical-500 font-bold hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
    </motion.div>
  );
}

// ── Page export — wraps LoginForm in Suspense as required by Next.js ──────────
export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-medical-500" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
