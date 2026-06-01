"use client";
import { useState, useEffect } from "react";
import { CheckCircle, Clock } from "lucide-react";

interface TrackerEntry {
  medicineId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctorName: string;
  prescriptionDate: string;
}

interface MedicineTrackerItemProps {
  entry: TrackerEntry;
  userId: string;
}

function parseDurationDays(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1]!, 10) : 7;
}

function isActive(prescriptionDate: string, duration: string): boolean {
  const issued = new Date(prescriptionDate);
  const days = parseDurationDays(duration);
  const end = new Date(issued.getTime() + days * 86_400_000);
  return new Date() <= end;
}

function getTakenKey(userId: string, medicineId: string): string {
  const today = new Date().toISOString().split("T")[0];
  return `medivantage:tracker:${userId}:${medicineId}:${today}`;
}

export function MedicineTrackerItem({
  entry,
  userId,
}: MedicineTrackerItemProps) {
  const active = isActive(entry.prescriptionDate, entry.duration);
  const storageKey = getTakenKey(userId, entry.medicineId);

  const [takenToday, setTakenToday] = useState(false);

  // Read from localStorage on mount (client-side only)
  useEffect(() => {
    setTakenToday(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  // Listen for storage events from other components
  useEffect(() => {
    const handleStorage = () => {
      setTakenToday(localStorage.getItem(storageKey) === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  const markTaken = () => {
    localStorage.setItem(storageKey, "true");
    setTakenToday(true);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-sm">{entry.name}</p>
          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${
              active
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
            }`}
          >
            {active ? "Active" : "Completed"}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {entry.dosage} · {entry.frequency} · {entry.duration}
        </p>
        <p className="text-xs text-slate-400">
          Prescribed by {entry.doctorName}
        </p>
        <p className="text-xs text-slate-400">
          {new Date(entry.prescriptionDate).toLocaleDateString()}
        </p>
      </div>
      {active && (
        <button
          onClick={markTaken}
          disabled={takenToday}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            takenToday
              ? "bg-emerald-500/10 text-emerald-500 cursor-default"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          aria-label={
            takenToday ? "Already taken today" : "Mark as taken today"
          }
        >
          {takenToday ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" /> Taken
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5" /> Mark Taken
            </>
          )}
        </button>
      )}
    </div>
  );
}
