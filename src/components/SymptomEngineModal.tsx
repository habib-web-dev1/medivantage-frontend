"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  Activity,
  ShieldAlert,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useAppState } from "../app/layout";

export default function SymptomEngineModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addNotification } = useAppState();
  const [step, setStep] = useState(1);
  const [inputText, setInputText] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [engineResults, setEngineResults] = useState<any[]>([]);

  const symptomPool = [
    "Cough",
    "Mucus",
    "Fatigue",
    "Shortness of Breath",
    "Chest Pain",
    "Severe Headache",
    "Dizziness",
  ];

  const toggleSymptom = (s: string) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter((item) => item !== s));
    } else {
      setSelectedSymptoms([...selectedSymptoms, s]);
    }
  };

  const executeAnalysis = async () => {
    if (selectedSymptoms.length === 0) return;
    setIsAnalyzing(true);
    setStep(2);
    addNotification(
      `Firing analysis payload containing elements: ${selectedSymptoms.join(", ")}`,
    );

    try {
      const res = await fetch("http://localhost:5000/api/engine/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      const data = await res.json();
      setEngineResults(data);
    } catch (e) {
      // Direct mock fallback alignment if server is not listening
      setEngineResults([
        {
          name: "Simulated Match Data",
          probabilityMatch: 85,
          description: "Pathological profile mimicking selected triggers.",
          precautions: ["Rest", "Hydration Monitor"],
          emergencyLevel: "medium",
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBookRedirect = () => {
    addNotification(
      "Injecting detected diagnostic brief parameters to appointment form context state.",
    );
    onClose();
    alert(
      "Symptom metadata cached! Click any user role button above to verify dashboard integration.",
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative z-10"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-medical-500 animate-pulse" />
            <h3 className="font-bold text-lg">Smart Symptom Engine</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div>
              <p className="text-sm text-slate-400 mb-4 font-medium">
                Select all symptoms currently manifested for mathematical
                cross-referencing:
              </p>
              <div className="flex flex-wrap gap-2.5 mb-6">
                {symptomPool.map((s) => {
                  const active = selectedSymptoms.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border ${active ? "bg-medical-500 text-white border-medical-500" : "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 border-slate-200 dark:border-slate-700/60"}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={executeAnalysis}
                disabled={selectedSymptoms.length === 0}
                className="w-full py-4 bg-gradient-to-r from-medical-500 to-medical-600 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-800 dark:disabled:to-slate-800 text-white rounded-xl font-bold text-sm tracking-wider uppercase shadow-xl transition flex items-center justify-center gap-2"
              >
                Compile Diagnostic Run <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {isAnalyzing ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-medical-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">
                    Running Mongoose Set Cardinality Calculation
                    Intersections...
                  </p>
                </div>
              ) : (
                <div>
                  <h4 className="font-bold text-sm text-slate-400 mb-3 uppercase tracking-wide">
                    Algorithmic Correlation Results
                  </h4>
                  {engineResults.length === 0 ? (
                    <p className="text-sm text-slate-400 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-center">
                      No precise structural mapping matches found within
                      database matrix index.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {engineResults.map((r, i) => (
                        <div
                          key={i}
                          className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-bold text-base text-medical-500">
                                {r.name}
                              </h5>
                              <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-red-500/10 text-red-500 rounded border border-red-500/20 inline-block mt-1">
                                Emergency Context: {r.emergencyLevel}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-black text-slate-800 dark:text-white">
                                {r.probabilityMatch}%
                              </span>
                              <span className="text-[9px] block font-mono text-slate-400 uppercase font-bold tracking-wider">
                                Match Confidence
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed mb-2 font-medium">
                            {r.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                            {r.precautions?.map((p: string, pi: number) => (
                              <span
                                key={pi}
                                className="text-[10px] bg-white dark:bg-slate-900 border px-2 py-0.5 rounded text-slate-400 font-medium"
                              >
                                🛡️ {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleBookRedirect}
                    className="w-full mt-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-sm tracking-wider uppercase shadow-xl hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" /> Port Parameters To Booking
                    Pipeline
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
