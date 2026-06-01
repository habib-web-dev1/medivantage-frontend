import { redirect } from "next/navigation";

// Redirect /dashboard/doctor/appointments → /dashboard/doctor
// Individual appointment actions are handled via the prescribe sub-route.
export default function DoctorAppointmentsPage() {
  redirect("/doctor");
}
