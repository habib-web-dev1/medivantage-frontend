"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  User,
  Calendar,
  FileText,
  ClipboardList,
} from "lucide-react";
import { apiClient } from "@/lib/axios";
import { bookingSchema, type BookingInput } from "@/validations/schemas";
import type { User as UserType } from "@/types";

interface DoctorsResponse {
  success: boolean;
  data: UserType[];
}

interface BookingFormProps {
  initialSymptoms?: string[];
  onSuccess?: () => void;
}

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

const STEPS = [
  { label: "Doctor", icon: User },
  { label: "Date & Time", icon: Calendar },
  { label: "Symptoms", icon: FileText },
  { label: "Confirm", icon: ClipboardList },
];

export function BookingForm({ initialSymptoms, onSuccess }: BookingFormProps) {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      doctorId: "",
      appointmentDate: "",
      symptomBrief: initialSymptoms?.join(", ") ?? "",
    },
  });

  const watchedDoctorId = watch("doctorId");
  const watchedSymptomBrief = watch("symptomBrief");

  const { data: doctorsData, isLoading: doctorsLoading } =
    useQuery<DoctorsResponse>({
      queryKey: ["doctors"],
      queryFn: () => apiClient.get("/doctors").then((r) => r.data),
      staleTime: 300_000,
    });

  const doctors = doctorsData?.data ?? [];
  const selectedDoctor = doctors.find((d) => d.id === watchedDoctorId);

  // Combine date + time into ISO string for the form field
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const combined = new Date(`${selectedDate}T${selectedTime}:00`);
      setValue("appointmentDate", combined.toISOString());
    }
  }, [selectedDate, selectedTime, setValue]);

  const mutation = useMutation({
    mutationFn: (payload: BookingInput) => {
      // Backend expects `symptoms` as an array, not a string brief
      const symptoms = payload.symptomBrief
        .split(/[,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      return apiClient
        .post("/patient/appointments", {
          doctorId: payload.doctorId,
          appointmentDate: payload.appointmentDate,
          symptoms,
          // Keep the raw brief as the AI diagnosis hint
          aiDiagnosis: payload.symptomBrief,
        })
        .then((r) => r.data);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to book appointment. Please try again.";
      setSubmitError(message);
    },
  });

  const today = new Date().toISOString().split("T")[0]!;

  const canProceedStep0 = !!watchedDoctorId;
  const canProceedStep1 = !!selectedDate && !!selectedTime;
  const canProceedStep2 = watchedSymptomBrief.trim().length > 0;

  const canProceed = [canProceedStep0, canProceedStep1, canProceedStep2, true];

  const onSubmit = handleSubmit((data) => {
    setSubmitError("");
    mutation.mutate(data);
  });

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = i === step;
          const done = i < step;
          return (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  active
                    ? "bg-blue-500 text-white"
                    : done
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {done ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                {s.label}
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 0: Doctor selection */}
      {step === 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-sm uppercase tracking-wide text-slate-500">
            Select a Doctor
          </h2>
          {doctorsLoading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading doctors...
            </div>
          ) : doctors.length === 0 ? (
            <p className="text-sm text-slate-400">No doctors available.</p>
          ) : (
            <div className="grid gap-2">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setValue("doctorId", doc.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    watchedDoctorId === doc.id
                      ? "border-blue-500 bg-blue-500/5"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300"
                  }`}
                >
                  <p className="font-bold text-sm">
                    Dr. {doc.firstName} {doc.lastName}
                  </p>
                  {doc.doctorProfile?.specialization && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {doc.doctorProfile.specialization}
                    </p>
                  )}
                  {doc.doctorProfile?.experienceYears && (
                    <p className="text-xs text-slate-400">
                      {doc.doctorProfile.experienceYears} years experience
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
          {errors.doctorId && (
            <p className="text-xs text-red-500">{errors.doctorId.message}</p>
          )}
        </div>
      )}

      {/* Step 1: Date & Time */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-bold text-sm uppercase tracking-wide text-slate-500">
            Pick a Date & Time
          </h2>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
              Date
            </label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
              Time Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 rounded-xl text-sm font-bold border transition ${
                    selectedTime === slot
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          {errors.appointmentDate && (
            <p className="text-xs text-red-500">
              {errors.appointmentDate.message}
            </p>
          )}
        </div>
      )}

      {/* Step 2: Symptom brief */}
      {step === 2 && (
        <div className="space-y-3">
          <h2 className="font-bold text-sm uppercase tracking-wide text-slate-500">
            Describe Your Symptoms
          </h2>
          <textarea
            {...register("symptomBrief")}
            rows={5}
            placeholder="Describe your symptoms in detail..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition resize-none"
          />
          {errors.symptomBrief && (
            <p className="text-xs text-red-500">
              {errors.symptomBrief.message}
            </p>
          )}
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-bold text-sm uppercase tracking-wide text-slate-500">
            Confirm Booking
          </h2>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Doctor</span>
              <span className="font-bold">
                Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
              </span>
            </div>
            {selectedDoctor?.doctorProfile?.specialization && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">
                  Specialization
                </span>
                <span className="font-bold">
                  {selectedDoctor.doctorProfile.specialization}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Date</span>
              <span className="font-bold">
                {selectedDate
                  ? new Date(
                      `${selectedDate}T${selectedTime}:00`,
                    ).toLocaleString()
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Symptoms</span>
              <span className="font-bold text-right max-w-[60%]">
                {watchedSymptomBrief || "—"}
              </span>
            </div>
          </div>

          {mutation.isSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-600 font-bold">
              <Check className="w-4 h-4" /> Appointment booked successfully!
            </div>
          )}

          {(mutation.isError || submitError) && (
            <p className="text-sm text-red-500 font-medium">
              {submitError || "Failed to book appointment. Please try again."}
            </p>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed[step]}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              // Build the ISO date directly from the selected date/time
              // to avoid any timing issues with the useEffect setValue
              const appointmentDate =
                selectedDate && selectedTime
                  ? new Date(`${selectedDate}T${selectedTime}:00`).toISOString()
                  : "";

              if (
                !watchedDoctorId ||
                !appointmentDate ||
                !watchedSymptomBrief.trim()
              ) {
                setSubmitError("Please complete all steps before confirming.");
                return;
              }

              setSubmitError("");
              mutation.mutate({
                doctorId: watchedDoctorId,
                appointmentDate,
                symptomBrief: watchedSymptomBrief,
              });
            }}
            disabled={isSubmitting || mutation.isPending || mutation.isSuccess}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition disabled:opacity-60"
          >
            {isSubmitting || mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Booking...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Confirm Booking
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
