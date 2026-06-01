"use client";
import { useQuery } from "@tanstack/react-query";
import { FileText, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { SkeletonList } from "@/components/skeletons/SkeletonList";
import { DownloadPrescription } from "@/components/shared/DownloadPrescription";
import type { Appointment } from "@/types";

interface AppointmentsResponse {
  success: boolean;
  data: Appointment[];
}

export default function PatientPrescriptionsPage() {
  const { data, isLoading, isError, refetch } = useQuery<AppointmentsResponse>({
    queryKey: ["patient-appointments"],
    queryFn: () => apiClient.get("/patient/appointments").then((r) => r.data),
    staleTime: 60_000,
  });

  const prescriptions = (data?.data ?? []).filter(
    (a) => a.prescription?.pdfUrl,
  );

  if (isLoading) return <SkeletonList count={3} />;

  if (isError) {
    return (
      <div className="flex flex-col items-center py-20 gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="font-bold text-slate-600 dark:text-slate-300">
          Failed to load prescriptions
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">My Prescriptions</h1>
        <p className="text-sm text-slate-400 mt-1">
          Download your digital prescriptions.
        </p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-500">No prescriptions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((appt) => (
            <div
              key={appt._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                </p>
                <p className="text-xs text-slate-400">
                  Issued:{" "}
                  {appt.prescription?.issuedAt
                    ? new Date(appt.prescription.issuedAt).toLocaleDateString()
                    : "—"}
                </p>
                {appt.prescription?.medications?.length ? (
                  <p className="text-xs text-slate-400">
                    {appt.prescription.medications
                      .map((m) => m.name)
                      .join(", ")}
                  </p>
                ) : null}
              </div>
              <DownloadPrescription
                pdfUrl={appt.prescription!.pdfUrl!}
                appointmentId={appt._id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
