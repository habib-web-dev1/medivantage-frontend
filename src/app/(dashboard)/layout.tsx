"use client";
import React, { useState, useEffect } from "react";
import { useAppState } from "../layout";
import {
  Activity,
  Clipboard,
  ShieldCheck,
  Download,
  AlertOctagon,
  Check,
  Send,
  Plus,
  Trash2,
} from "lucide-react";

export default function UnifiedDashboardBridge() {
  const { session, addNotification } = useAppState();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctorsList] = useState([
    {
      name: "Dr. Sarah Jenkins",
      specialty: "Cardiology",
      availability: "Available Tomorrow",
    },
    {
      name: "Dr. Marcus Vance",
      specialty: "Pediatrics",
      availability: "Slots Open Today",
    },
  ]);
  const [bookingForm, setBookingForm] = useState({
    doctor: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    slot: "10:00 AM - May 25",
    symptom: "Persistent substernal compression variables",
  });

  // Admin Context CRUD Matrix State
  const [adminMeds, setAdminMeds] = useState([
    { id: "1", name: "Amoxil", stock: 142, price: 24.99 },
    { id: "2", name: "Calpol", stock: 400, price: 8.5 },
  ]);
  const [newMedName, setNewMedName] = useState("");

  // Doctor Dynamic Treatment Context State
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [dosageInput, setDosageInput] = useState("");

  useEffect(() => {
    const pollAppointments = async () => {
      try {
        const headers: any = {};
        if (session) headers["Authorization"] = `Bearer ${session.token}`;
        const res = await fetch("http://localhost:5000/api/appointments", {
          headers,
        });
        const data = await res.json();
        if (Array.isArray(data)) setAppointments(data);
      } catch (e) {
        // Safe context injection fallback if pipeline server isn't reading ports
        setAppointments([
          {
            id: "app-1",
            patientName: "Jane Doe",
            patientId: "pat-100",
            doctorId: "doc-1",
            doctorName: "Dr. Sarah Jenkins",
            specialty: "Cardiology",
            timeSlot: "10:00 AM - May 25",
            status: "Pending",
            symptomBrief: "Palpitations, Mild Dyspnea",
          },
          {
            id: "app-2",
            patientName: "Alex Smith",
            patientId: "pat-200",
            doctorId: "doc-1",
            doctorName: "Dr. Sarah Jenkins",
            specialty: "Cardiology",
            timeSlot: "11:30 AM - May 26",
            status: "Approved",
            symptomBrief: "Chest tightness under exertion",
            dosageBrief: "Lisinopril 10mg PO QD",
            prescriptionUrl: "#",
          },
        ]);
      }
    };
    pollAppointments();
  }, [session]);

  const triggerStatusChange = async (
    id: string,
    nextStatus: "Approved" | "Declined",
  ) => {
    addNotification(
      `Updating record ${id} configuration state parameter to: ${nextStatus}`,
    );
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)),
    );
    try {
      await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (e) {}
  };

  const executePrescriptionIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !dosageInput) return;
    addNotification(
      `Injecting digital dosage blueprint payload inside database record ID: ${selectedAppId}`,
    );

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === selectedAppId
          ? {
              ...a,
              dosageBrief: dosageInput,
              prescriptionUrl: `http://localhost:5000/api/prescription/download/${selectedAppId}`,
            }
          : a,
      ),
    );
    try {
      await fetch(
        `http://localhost:5000/api/appointments/${selectedAppId}/prescribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({ dosageBrief: dosageInput }),
        },
      );
    } catch (e) {}
    setDosageInput("");
    setSelectedAppId(null);
  };

  const executeBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      id: `app-${Date.now()}`,
      patientName: "Jane Doe",
      doctorName: bookingForm.doctor,
      specialty: bookingForm.specialty,
      timeSlot: bookingForm.slot,
      status: "Pending" as const,
      symptomBrief: bookingForm.symptom,
    };
    setAppointments([newRecord, ...appointments]);
    addNotification(
      `Dispatched consultation request payload to ${bookingForm.doctor}`,
    );
    try {
      await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          doctorName: bookingForm.doctor,
          specialty: bookingForm.specialty,
          timeSlot: bookingForm.slot,
          symptomBrief: bookingForm.symptom,
        }),
      });
    } catch (e) {}
  };

  const handleAdminCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Force Read Only demo authorization guard bypass warning evaluation
    addNotification(
      "🛡️ CRITICAL ADMIN PERMISSION REJECTION: Mutation blocks operational read-only restriction.",
    );
    alert(
      "Demo Security Action Blocked: This administrative role configuration enforces absolute Read-Only power. Edit and Delete permissions are omitted.",
    );
  };

  if (!session) {
    return (
      <div className="max-w-md mx-auto my-24 text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
        <AlertOctagon className="w-12 h-12 text-medical-500 mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-bold">RBAC Environment Encrypted</h3>
        <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed font-medium">
          No valid active session configuration signature found in route
          execution scope. Use the simulation shortcuts inside the top
          navigation header.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* HEADER SUMMARY PANEL */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-[24px] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-medical-500 font-bold block mb-1">
            Active Cluster Session Node
          </span>
          <h2 className="text-3xl font-black tracking-tight">{session.name}</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {session.email}
          </p>
        </div>
        <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <span className="text-[9px] font-mono uppercase tracking-wider block text-slate-400">
            System Gateway Security
          </span>
          <span className="text-sm font-bold text-medical-400 uppercase tracking-widest">
            {session.role} Clear
          </span>
        </div>
      </div>

      {/* PATIENT CONTEXT VIEW PORT */}
      {session.role === "patient" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clipboard className="w-5 h-5 text-medical-500" /> Consultations
                & Tracking Matrices
              </h3>
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm">{a.doctorName}</h4>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-medium">
                          {a.specialty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {a.timeSlot}
                      </p>
                      <p className="text-xs text-slate-400 mt-2 italic font-medium">
                        Brief: &ldquo;{a.symptomBrief}&rdquo;
                      </p>
                      {a.dosageBrief && (
                        <div className="mt-3 p-2 bg-medical-500/5 border border-medical-500/20 rounded-xl text-xs">
                          <span className="font-bold text-medical-500 block text-[10px] uppercase">
                            Treatment Instruction
                          </span>
                          <span className="font-medium text-slate-300">
                            {a.dosageBrief}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row sm:flex-col items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/40">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${a.status === "Approved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}
                      >
                        {a.status}
                      </span>
                      {a.prescriptionUrl && a.prescriptionUrl !== "#" && (
                        <a
                          href={a.prescriptionUrl}
                          download
                          className="px-3 py-1.5 bg-medical-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-medical-500/10 hover:opacity-90 transition"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF Document
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md h-fit">
            <h3 className="font-bold text-base mb-4">
              Request New Telehealth Stream
            </h3>
            <form
              onSubmit={executeBooking}
              className="space-y-4 text-xs font-medium"
            >
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  Target Professional Node
                </label>
                <select
                  value={bookingForm.doctor}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, doctor: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl font-medium focus:outline-none text-slate-300"
                >
                  {doctorsList.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  Target Synchronous Window
                </label>
                <input
                  type="text"
                  value={bookingForm.slot}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, slot: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs focus:outline-none font-medium text-slate-300"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  Symptom Diagnostic Compilations (Brief)
                </label>
                <textarea
                  value={bookingForm.symptom}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, symptom: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs focus:outline-none font-medium text-slate-300 h-20"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-medical-500 text-white font-bold rounded-xl uppercase tracking-wider text-[11px] shadow-lg"
              >
                Commit Queue Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DOCTOR CONTEXT VIEW PORT */}
      {session.role === "doctor" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> Operational
              Consultation Queue
            </h3>
            <div className="space-y-3">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                        {a.patientName}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {a.timeSlot}
                      </span>
                    </div>
                    <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-bold">
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 p-2.5 rounded-xl mt-2 italic font-medium">
                    Manifested Symptoms: &ldquo;{a.symptomBrief}&rdquo;
                  </p>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
                    {a.status === "Pending" && (
                      <>
                        <button
                          onClick={() => triggerStatusChange(a.id, "Approved")}
                          className="px-3 py-1.5 bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => triggerStatusChange(a.id, "Declined")}
                          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 font-bold rounded-lg text-xs"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {a.status === "Approved" && !a.dosageBrief && (
                      <button
                        onClick={() => setSelectedAppId(a.id)}
                        className="px-3 py-1.5 bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Transcribe Digital
                        Prescription
                      </button>
                    )}
                    {a.dosageBrief && (
                      <span className="text-[11px] font-mono text-slate-400 font-bold bg-slate-200/50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        ✅ Prescription Synchronized Payload Stored
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {selectedAppId ? (
              <div className="bg-white dark:bg-slate-900 border border-indigo-500/30 p-6 rounded-3xl shadow-xl">
                <h3 className="font-bold text-base mb-2">
                  Prescription Layout Transcriber
                </h3>
                <p className="text-[11px] text-slate-400 mb-4 font-medium">
                  Target Record Scope ID: {selectedAppId}
                </p>
                <form onSubmit={executePrescriptionIssue} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                      Dosage Delivery Syntax Instructions
                    </label>
                    <textarea
                      value={dosageInput}
                      onChange={(e) => setDosageInput(e.target.value)}
                      placeholder="E.g., Lisinopril 10mg PO QD PC"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs focus:outline-none text-slate-300 font-mono h-24"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                  >
                    <Send className="w-3 h-3 inline mr-1" /> Commit Blueprint
                    Signature
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center text-slate-400 text-xs font-medium">
                Select an approved appointment queue element to launch the
                real-time prescription transcriber module.
              </div>
            )}
          </div>
        </div>
      )}

      {/* READ ONLY ADMINISTRATIVE CONTEXT VIEW PORT */}
      {session.role === "admin" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-400" /> Administrative
              Commodity Index
            </h3>
            <p className="text-[11px] text-slate-400 mb-4 font-medium">
              Demo Security State Verification: Read-Only parameters active.
            </p>

            <div className="space-y-2">
              {adminMeds.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/60 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-sm">{m.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Stock Volume Matrix: {m.stock} items
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-black text-slate-300">
                      ${m.price}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={handleAdminCreate}
                        className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl h-fit">
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wide text-slate-400">
              Inventory Registry Append
            </h4>
            <form
              onSubmit={handleAdminCreate}
              className="space-y-3 text-xs font-medium"
            >
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Brand Syntax Nomenclature
                </label>
                <input
                  type="text"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="E.g., Lipitor"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded-lg text-slate-300 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 font-bold rounded-xl uppercase tracking-wider text-[10px] transition duration-300"
              >
                Execute Data Addition Payload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
