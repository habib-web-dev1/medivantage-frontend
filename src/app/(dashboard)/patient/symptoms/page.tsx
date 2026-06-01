"use client";
import { useState } from "react";
import { Brain } from "lucide-react";
import { SymptomCheckerModal } from "@/components/symptom-checker/SymptomCheckerModal";
import { useRouter } from "next/navigation";
import type { EngineResult } from "@/types";

export default function SymptomsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleBookConsultation = (
    topResult: EngineResult,
    symptoms: string[],
  ) => {
    sessionStorage.setItem(
      "symptomBrief",
      `${topResult.name}: ${symptoms.join(", ")}`,
    );
    sessionStorage.setItem("aiDiagnosis", topResult.name);
    setIsModalOpen(false);
    router.push("/doctors");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight">Symptom Checker</h2>
        <p className="text-sm text-slate-400 mt-1">
          Describe your symptoms and get AI-powered diagnostic insights.
        </p>
      </div>
      <div className="bg-linear-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-3xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto">
          <Brain className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black">AI Symptom Analysis</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Enter your symptoms and our engine will cross-reference them against
          our medical database to suggest potential conditions.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-500/20"
        >
          Check Symptoms
        </button>
      </div>
      <SymptomCheckerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookConsultation={handleBookConsultation}
      />
    </div>
  );
}
