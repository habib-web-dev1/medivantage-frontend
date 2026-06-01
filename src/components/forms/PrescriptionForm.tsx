"use client";
import { useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Download, Loader2, Check } from "lucide-react";
import { apiClient } from "@/lib/axios";
import {
  prescriptionSchema,
  type PrescriptionInput,
} from "@/validations/schemas";

interface PrescriptionFormProps {
  appointmentId: string;
  onSuccess?: () => void;
}

export function PrescriptionForm({
  appointmentId,
  onSuccess,
}: PrescriptionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrescriptionInput>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  });

  const mutation = useMutation({
    mutationFn: (payload: PrescriptionInput) =>
      apiClient
        .post(`/doctor/appointments/${appointmentId}/prescription`, payload)
        .then((r) => r.data),
    onSuccess: () => {
      onSuccess?.();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((d) => mutation.mutate(d))}
      className="space-y-5"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm uppercase tracking-wide text-slate-500">
            Medications
          </h2>
          <button
            type="button"
            onClick={() =>
              append({ name: "", dosage: "", frequency: "", duration: "" })
            }
            className="flex items-center gap-1 text-xs text-blue-500 font-bold hover:underline"
          >
            <Plus className="w-3 h-3" /> Add Medicine
          </button>
        </div>

        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                Medicine {idx + 1}
              </span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-red-400 hover:text-red-600 transition"
                  aria-label={`Remove medicine ${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(["name", "dosage", "frequency", "duration"] as const).map(
                (field_name) => (
                  <div key={field_name}>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1 capitalize">
                      {field_name}
                    </label>
                    <input
                      {...register(`medications.${idx}.${field_name}`)}
                      placeholder={
                        field_name === "name"
                          ? "e.g. Amoxicillin"
                          : field_name === "dosage"
                            ? "e.g. 500mg"
                            : field_name === "frequency"
                              ? "e.g. Twice daily"
                              : "e.g. 7 days"
                      }
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-500 transition"
                    />
                    {errors.medications?.[idx]?.[field_name] && (
                      <p className="text-[10px] text-red-500 mt-0.5">
                        {errors.medications[idx]?.[field_name]?.message}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        ))}

        {errors.medications?.root && (
          <p className="text-xs text-red-500">
            {errors.medications.root.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
          Clinical Notes (optional)
        </label>
        <textarea
          {...register("clinicalNotes")}
          rows={3}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition resize-none"
        />
      </div>

      {mutation.isSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-600 font-bold">
          <Check className="w-4 h-4" />
          <Download className="w-4 h-4" /> Prescription issued successfully!
        </div>
      )}

      {mutation.isError && (
        <p className="text-sm text-red-500 font-medium">
          Failed to issue prescription. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || mutation.isPending || mutation.isSuccess}
        className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isSubmitting || mutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...
          </>
        ) : (
          "Issue Prescription"
        )}
      </button>
    </form>
  );
}
