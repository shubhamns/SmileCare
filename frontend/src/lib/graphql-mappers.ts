import type { Appointment, AppointmentStatus, AuditLog, Role, User } from "@/types";
export function mapRole(role: string): Role {
  if (role === "DOCTOR") return "doctor";
  if (role === "ADMIN") return "admin";
  return "patient";
}
export function toGraphRole(role: Role): string {
  if (role === "doctor") return "DOCTOR";
  if (role === "admin") return "ADMIN";
  return "PATIENT";
}
export function mapStatus(status: string): AppointmentStatus {
  return status.toLowerCase() as AppointmentStatus;
}
export function toGraphStatus(status: AppointmentStatus): string {
  return status.toUpperCase();
}
export function mapUser(u: { id: string; name: string; email: string; role: string; phone?: string | null; avatar?: string | null; clinicId?: string | null }): User {
  return { id: u.id, name: u.name, email: u.email, role: mapRole(u.role), clinicId: u.clinicId || undefined, avatar: u.avatar || undefined };
}
export function mapAppointment(a: {
  id: string;
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  status: string;
  clinicId: string;
  service: { name: string };
  dentist: { name: string };
}): Appointment {
  return { id: a.id, patientName: a.patientName, patientEmail: a.patientEmail, service: a.service.name, dentist: a.dentist.name, date: a.date, time: a.time, status: mapStatus(a.status), clinicId: a.clinicId };
}
export function mapAuditLog(l: { id: string; action: string; userName: string; role: string; resource: string; ip?: string | null; createdAt: string }): AuditLog {
  return { id: l.id, action: l.action, user: l.userName, role: mapRole(l.role), resource: l.resource, timestamp: l.createdAt, ip: l.ip || "" };
}
