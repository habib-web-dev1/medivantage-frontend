"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/axios";
import { PrescriptionForm } from "@/components/forms/PrescriptionForm";
import type { Appointment } from "@/types";

interface AppointmentResponse {
  success: boolean;
  data: Appointment;
}

export default function PrescribePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery<AppointmentResponse>({
    queryKey: ["appointment", id],
    queryFn: () =>
      apiClient.get(`/doctor/appointments/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const appt = data?.data;

  if (isLoading) {
    return (
      <div className="p-6 text-slate-400 text-sm">Loading appointment...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/doctor"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-500 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </Link>

      <div>
        <h1 className="text-2xl font-black">Issue Prescription</h1>
        {appt && (
          <p className="text-sm text-slate-400 mt-1">
            Patient:{" "}
            <strong>
              {appt.patient?.firstName} {appt.patient?.lastName}
            </strong>{" "}
            · {new Date(appt.appointmentDate).toLocaleDateString()}
          </p>
        )}
        {appt?.aiDiagnostics?.reportedSymptoms?.length ? (
          <p className="text-xs text-slate-400 mt-1 italic">
            Reported symptoms: {appt.aiDiagnostics.reportedSymptoms.join(", ")}
          </p>
        ) : null}
      </div>

      <PrescriptionForm
        appointmentId={id}
        onSuccess={() => router.push("/doctor")}
      />
    </div>
  );
}
