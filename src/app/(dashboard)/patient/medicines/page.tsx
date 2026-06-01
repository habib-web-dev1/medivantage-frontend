"use client";
import { useQuery } from "@tanstack/react-query";
import { Pill } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { SkeletonList } from "@/components/skeletons/SkeletonList";
import { MedicineTrackerItem } from "@/components/dashboard/MedicineTrackerItem";
import type { Appointment, Medication } from "@/types";

interface AppointmentsResponse {
  success: boolean;
  data: Appointment[];
}

interface TrackerEntry {
  medicineId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctorName: string;
  prescriptionDate: string;
}

export default function MedicineTrackerPage() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery<AppointmentsResponse>({
    queryKey: ["patient-appointments"],
    queryFn: () => apiClient.get("/appointments").then((r) => r.data),
    staleTime: 60_000,
  });

  const entries: TrackerEntry[] = (data?.data ?? [])
    .filter((a) => a.prescription?.medications?.length)
    .flatMap((a) =>
      (a.prescription!.medications as Medication[]).map((m) => ({
        medicineId: `${a._id}-${m.name}`,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        doctorName: `Dr. ${a.doctor?.firstName ?? ""} ${a.doctor?.lastName ?? ""}`,
        prescriptionDate: a.prescription!.issuedAt ?? a.appointmentDate,
      })),
    );

  if (isLoading) return <SkeletonList count={3} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Medicine Tracker</h1>
        <p className="text-sm text-slate-400 mt-1">
          Track your prescribed medications.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center space-y-3">
          <Pill className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-500">No active medications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <MedicineTrackerItem
              key={entry.medicineId}
              entry={entry}
              userId={user?.id ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
