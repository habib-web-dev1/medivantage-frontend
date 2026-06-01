// Shared TypeScript interfaces for MediVantage platform

export interface DoctorProfile {
  specialization?: string;
  licenseNumber?: string;
  experienceYears?: number;
  isVerified?: boolean;
  bio?: string;
}

export interface PatientProfile {
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  avatar?: string;
  doctorProfile?: DoctorProfile;
  patientProfile?: PatientProfile;
  isActive: boolean;
}

export interface Medicine {
  _id: string;
  brandName: string;
  genericName: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  uses: string;
  sideEffects: string;
  precautions: string;
}

export interface Disease {
  _id: string;
  name: string;
  symptoms: string[];
  description: string;
  precautions: string[];
  suggestedMeds: Medicine[];
  emergencyLevel: "low" | "medium" | "high" | "critical";
}

export interface AiDiagnostics {
  reportedSymptoms: string[];
  severityAssessment: string;
  aiSuggestedPreliminaryDiagnosis?: string;
  aiConfidenceScore?: number;
}

export interface ClinicalNotes {
  symptomsObserved?: string;
  doctorDiagnosis?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  medications: Medication[];
  pdfUrl?: string;
  issuedAt?: string;
}

export interface Appointment {
  _id: string;
  patient: User;
  doctor: User;
  appointmentDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  aiDiagnostics?: AiDiagnostics;
  clinicalNotes?: ClinicalNotes;
  prescription?: Prescription;
}

export interface EngineResult {
  diseaseId: string;
  name: string;
  probabilityMatch: number;
  description: string;
  precautions: string[];
  emergencyLevel: "low" | "medium" | "high" | "critical";
  suggestedMedicines: Medicine[];
}

export interface Notification {
  id: string;
  message: string;
  type: "appointment" | "prescription";
  read: boolean;
  createdAt: string;
}
