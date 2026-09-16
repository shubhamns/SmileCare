export type Role = "patient" | "doctor" | "admin";
export type AppointmentStatus = "confirmed" | "pending" | "cancelled" | "completed" | "no_show";
export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  timezone: string;
}
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  icon: string;
}
export interface Dentist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  avatar: string;
  clinicId: string;
}
export interface TimeSlot {
  time: string;
  available: boolean;
}
export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  service: string;
  dentist: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  clinicId: string;
}
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  clinicId: string;
}
export interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: Role;
  resource: string;
  timestamp: string;
  ip: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  clinicId?: string;
  avatar?: string;
}
export interface BookingState {
  serviceId: string;
  dentistId: string;
  date: Date | undefined;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  reason: string;
  consent: boolean;
  clinicId: string;
}
