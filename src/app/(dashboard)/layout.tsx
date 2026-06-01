"use client";
import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  HeartPulse,
  LayoutDashboard,
  Calendar,
  Pill,
  FileText,
  Brain,
  BarChart3,
  LogOut,
  Stethoscope,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNotifications } from "@/hooks/useNotifications";
import { useSocket } from "@/hooks/useSocket";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { DarkModeToggle } from "@/components/shared/DarkModeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { notifications, unreadCount, addNotification, markAllRead } =
    useNotifications();

  const handleNotification = useCallback(
    (data: { message: string }) => {
      addNotification({ message: data.message, type: "appointment" });
    },
    [addNotification],
  );

  useSocket(handleNotification);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const handleLogout = () => {
    clearAuth();
    document.cookie = "medivantage-role=; path=/; max-age=0";
    router.push("/login");
  };

  const patientLinks = [
    { href: "/patient", label: "Overview", icon: LayoutDashboard },
    { href: "/patient/bookings", label: "Bookings", icon: Calendar },
    { href: "/patient/symptoms", label: "Symptom Check", icon: Brain },
    { href: "/patient/prescriptions", label: "Prescriptions", icon: FileText },
    { href: "/patient/medicines", label: "Med Tracker", icon: Pill },
  ];

  const doctorLinks = [
    { href: "/doctor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/doctor/appointments", label: "Appointments", icon: Calendar },
  ];

  const adminLinks = [
    { href: "/admin", label: "Overview", icon: BarChart3 },
    { href: "/admin/medicines", label: "Medicines", icon: Pill },
    { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  const links =
    user?.role === "patient"
      ? patientLinks
      : user?.role === "doctor"
        ? doctorLinks
        : adminLinks;

  const roleConfig: Record<
    string,
    { color: string; bg: string; label: string }
  > = {
    patient: {
      color: "text-medical-500",
      bg: "bg-medical-500",
      label: "Patient Portal",
    },
    doctor: {
      color: "text-indigo-500",
      bg: "bg-indigo-500",
      label: "Doctor Portal",
    },
    admin: {
      color: "text-emerald-500",
      bg: "bg-emerald-500",
      label: "Admin Portal",
    },
  };

  const rc = roleConfig[user?.role ?? "patient"];

  const activeColor: Record<string, string> = {
    patient: "bg-medical-500/10 text-medical-500",
    doctor: "bg-indigo-500/10 text-indigo-500",
    admin: "bg-emerald-500/10 text-emerald-500",
  };

  const activeStyle = activeColor[user?.role ?? "patient"];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 ${rc.bg} rounded-lg flex items-center justify-center shadow-sm`}
            >
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-sm block leading-tight">
                MediVantage
              </span>
              <span
                className={`text-[9px] font-bold uppercase tracking-widest ${rc.color}`}
              >
                {rc.label}
              </span>
            </div>
          </Link>
        </div>

        {/* User card */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
            <div
              className={`w-9 h-9 ${rc.bg} rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm`}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className={`text-[10px] font-semibold capitalize ${rc.color}`}>
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">
            Navigation
          </p>
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/patient" &&
                href !== "/doctor" &&
                href !== "/admin" &&
                pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  active
                    ? `${activeStyle} font-bold`
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {active && (
                  <span
                    className={`ml-auto w-1.5 h-1.5 rounded-full ${rc.bg}`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-5 ${rc.bg} rounded-full`} />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">
              {user?.role} Dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              markAllRead={markAllRead}
            />
          </div>
        </header>

        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
