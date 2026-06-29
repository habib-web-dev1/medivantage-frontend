"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, CheckCircle, Calendar, Loader2, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { EngineResult } from "@/types";

interface SymptomCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookConsultation: (topResult: EngineResult, symptoms: string[]) => void;
}

const EMERGENCY_COLORS: Record<string, string> = {
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
};

// Inner component — mounted only when isOpen is true, so state auto-resets on close
function SymptomCheckerContent({
  onClose,
  onBookConsultation,
}: {
  onClose: () => void;
  onBookConsultation: (topResult: EngineResult, symptoms: string[]) => void;
}) {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [results, setResults] = useState<EngineResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Focus input on step 1
  useEffect(() => {
    if (step === 1) setTimeout(() => inputRef.current?.focus(), 100);
  }, [step]);

  const mutation = useMutation({
    mutationFn: async (syms: string[]) => {
      const res = await apiClient.post<{
        success: boolean;
        results: EngineResult[];
        message?: string;
      }>("/engine/analyze", { symptoms: syms });
      return res.data;
    },
    onSuccess: (data) => {
      setResults(data.results);
      setStep(3);
    },
    onMutate: () => setStep(2),
  });

  const addSymptom = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !symptoms.includes(trimmed))
      setSymptoms((prev) => [...prev, trimmed]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSymptom(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && symptoms.length > 0) {
      setSymptoms((prev) => prev.slice(0, -1));
    }
  };

  const removeSymptom = (sym: string) =>
    setSymptoms((prev) => prev.filter((s) => s !== sym));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Symptom Checker"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base">Symptom Checker</h3>
                <p className="text-xs text-slate-400">Step {step} of 3</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Step 1: Input */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Enter your symptoms one by one. Press Enter or comma to add
                  each one.
                </p>
                <div
                  className="min-h-[80px] border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-wrap gap-2 cursor-text"
                  onClick={() => inputRef.current?.focus()}
                >
                  {symptoms.map((sym) => (
                    <span
                      key={sym}
                      className="flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-lg"
                    >
                      {sym}
                      <button
                        onClick={() => removeSymptom(sym)}
                        className="hover:text-red-500 transition"
                        aria-label={`Remove ${sym}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      symptoms.length === 0
                        ? "e.g. headache, fever, cough..."
                        : "Add more..."
                    }
                    className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
                {inputValue && (
                  <button
                    onClick={() => addSymptom(inputValue)}
                    className="flex items-center gap-1 text-xs text-blue-500 font-bold hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Add &quot;{inputValue}&quot;
                  </button>
                )}
                <button
                  onClick={() =>
                    symptoms.length > 0 && mutation.mutate(symptoms)
                  }
                  disabled={symptoms.length === 0}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Analyze{" "}
                  {symptoms.length > 0
                    ? `${symptoms.length} Symptom${symptoms.length > 1 ? "s" : ""}`
                    : "Symptoms"}
                </button>
              </div>
            )}

            {/* Step 2: Loading */}
            {step === 2 && (
              <div className="py-12 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
                <p className="font-bold text-slate-700 dark:text-slate-200">
                  Analyzing your symptoms...
                </p>
                <p className="text-xs text-slate-400 text-center">
                  Cross-referencing {symptoms.length} symptom
                  {symptoms.length > 1 ? "s" : ""} against our medical database
                </p>
              </div>
            )}

            {/* Step 3: Results */}
            {step === 3 && (
              <div className="space-y-4">
                {results.length === 0 ? (
                  <div className="py-8 text-center space-y-3">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                    <p className="font-bold">No matching conditions found</p>
                    <p className="text-xs text-slate-400">
                      Please consult a doctor for a professional evaluation.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-500">
                      Found <strong>{results.length}</strong> potential match
                      {results.length > 1 ? "es" : ""}.
                    </p>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {results.map((result) => (
                        <div
                          key={result.diseaseId}
                          className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm">{result.name}</h4>
                            <span
                              className={`text-xs font-black px-2 py-0.5 rounded-lg border ${EMERGENCY_COLORS[result.emergencyLevel] ?? ""}`}
                            >
                              {result.emergencyLevel.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${result.probabilityMatch}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-blue-500">
                              {result.probabilityMatch}%
                            </span>
                          </div>
                          {result.suggestedMedicines.length > 0 && (
                            <p className="text-xs text-slate-400">
                              Suggested:{" "}
                              {result.suggestedMedicines
                                .map((m) => m.brandName)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => onBookConsultation(results[0]!, symptoms)}
                      className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" /> Book Consultation
                    </button>
                  </>
                )}
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 transition font-medium"
                >
                  ← Check different symptoms
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Outer wrapper — only mounts SymptomCheckerContent when open,
// so all inner state is automatically reset when the modal closes.
export function SymptomCheckerModal({
  isOpen,
  onClose,
  onBookConsultation,
}: SymptomCheckerModalProps) {
  if (!isOpen) return null;
  return (
    <SymptomCheckerContent
      onClose={onClose}
      onBookConsultation={onBookConsultation}
    />
  );
}
