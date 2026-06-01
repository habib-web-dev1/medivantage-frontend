"use client";
import { Check, X, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Appointment } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  cancelled: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

interface AppointmentCardProps {
  appointment: Appointment;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
  isUpdating?: boolean;
}

export function AppointmentCard({
  appointment,
  onApprove,
  onDecline,
  isUpdating,
}: AppointmentCardProps) {
  const { _id, patient, appointmentDate, status, aiDiagnostics } = appointment;

  return (
    <div
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3"
      data-date={appointmentDate}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-sm">
            {patient?.firstName} {patient?.lastName}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(appointmentDate).toLocaleString()}
          </p>
        </div>
        <span
          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border shrink-0 ${STATUS_STYLES[status] ?? ""}`}
        >
          {status}
        </span>
      </div>

      {aiDiagnostics?.reportedSymptoms?.length ? (
        <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-xl p-2.5 italic">
          Symptoms: {aiDiagnostics.reportedSymptoms.join(", ")}
        </p>
      ) : null}

      {aiDiagnostics?.aiSuggestedPreliminaryDiagnosis && (
        <p className="text-xs text-blue-500 font-medium">
          AI Suggestion: {aiDiagnostics.aiSuggestedPreliminaryDiagnosis}
        </p>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        {status === "pending" && (
          <>
            <button
              onClick={() => onApprove?.(_id)}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Check className="w-3 h-3" />
              )}
              Approve
            </button>
            <button
              onClick={() => onDecline?.(_id)}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50"
            >
              <X className="w-3 h-3" /> Decline
            </button>
          </>
        )}
        {(status === "confirmed" || status === "completed") && (
          <Link
            href={`/doctor/appointments/${_id}/prescribe`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition"
          >
            <FileText className="w-3 h-3" /> Prescribe
          </Link>
        )}
      </div>
    </div>
  );
}
