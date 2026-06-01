import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["patient", "doctor"]),
  // Optional doctor profile fields
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  experienceYears: z.string().optional(),
  bio: z.string().optional(),
  // Optional patient profile fields
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  bloodType: z.string().optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const bookingSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  symptomBrief: z.string().min(1, "Please describe your symptoms"),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const prescriptionSchema = z.object({
  medications: z
    .array(
      z.object({
        name: z.string().min(1, "Medicine name is required"),
        dosage: z.string().min(1, "Dosage is required"),
        frequency: z.string().min(1, "Frequency is required"),
        duration: z.string().min(1, "Duration is required"),
      }),
    )
    .min(1, "At least one medication is required"),
  clinicalNotes: z.string().optional(),
});
export type PrescriptionInput = z.infer<typeof prescriptionSchema>;

export const medicineSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  genericName: z.string().min(1, "Generic name is required"),
  price: z.string().min(1, "Price is required"),
  stock: z.string().min(1, "Stock is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  uses: z.string().min(1, "Uses are required"),
  sideEffects: z.string().min(1, "Side effects are required"),
  precautions: z.string().min(1, "Precautions are required"),
});
export type MedicineInput = z.infer<typeof medicineSchema>;
