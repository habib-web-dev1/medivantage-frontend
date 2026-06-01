"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, AlertCircle, X, Plus } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { SkeletonList } from "@/components/skeletons/SkeletonList";
import { BookingForm } from "@/components/forms/BookingForm";
import { DownloadPrescription } from "@/components/shared/DownloadPrescription";
import type { Appointment } from "@/types";

interface AppointmentsResponse {
  success: boolean;
  data: Appointment[];
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  cancelled: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function PatientBookingsPage() {
  const qc = useQueryClient();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery<AppointmentsResponse>({
    queryKey: ["patient-appointments"],
    queryFn: () => apiClient.get("/patient/appointments").then((r) => r.data),
    staleTime: 60_000,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.patch(`/patient/appointments/${id}/status`, {
        status: "cancelled",
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["patient-appointments"] }),
  });

  const appointments = data?.data ?? [];

  if (isLoading) return <SkeletonList count={4} />;

  if (isError) {
    return (
      <div className="flex flex-col items-center py-20 gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="font-bold text-slate-600 dark:text-slate-300">
          Failed to load appointments
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">My Bookings</h1>
          <p className="text-sm text-slate-400 mt-1">
            All your consultation appointments.
          </p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-500">No appointments yet</p>
          <button
            onClick={() => setShowBookingModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" /> Book your first appointment
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">
                    Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                  </p>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${STATUS_STYLES[appt.status] ?? ""}`}
                  >
                    {appt.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {new Date(appt.appointmentDate).toLocaleString()}
                </p>
                {appt.aiDiagnostics?.reportedSymptoms?.length ? (
                  <p className="text-xs text-slate-400 italic">
                    Symptoms: {appt.aiDiagnostics.reportedSymptoms.join(", ")}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {appt.prescription?.pdfUrl && (
                  <DownloadPrescription
                    pdfUrl={appt.prescription.pdfUrl}
                    appointmentId={appt._id}
                    label="Download PDF"
                  />
                )}
                {appt.status === "pending" && (
                  <button
                    onClick={() => cancelMutation.mutate(appt._id)}
                    disabled={cancelMutation.isPending}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition"
                    aria-label="Cancel appointment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Book Appointment"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black">Book Appointment</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <BookingForm
                onSuccess={() => {
                  setShowBookingModal(false);
                  qc.invalidateQueries({ queryKey: ["patient-appointments"] });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
