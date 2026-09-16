import { BarChart3, Building2, Calendar, ClipboardList, LayoutDashboard, MessageSquare, Settings, Stethoscope, Users } from "lucide-react";
import { adminPath } from "@/lib/env";
import { StaffSidebar } from "./StaffSidebar";
const adminNav = [
  { suffix: "", label: "Dashboard", icon: LayoutDashboard },
  { suffix: "appointments", label: "Appointments", icon: Calendar },
  { suffix: "patients", label: "Patients", icon: Users },
  { suffix: "clinics", label: "Clinics", icon: Building2 },
  { suffix: "doctors", label: "Doctors", icon: Stethoscope },
  { suffix: "services", label: "Services", icon: ClipboardList },
  { suffix: "calendar", label: "Calendar", icon: Calendar },
  { suffix: "messages", label: "Messages", icon: MessageSquare },
  { suffix: "reports", label: "Reports", icon: BarChart3 },
  { suffix: "audit-logs", label: "Audit Logs", icon: ClipboardList },
  { suffix: "settings", label: "Settings", icon: Settings },
];
export function AdminSidebar() {
  return <StaffSidebar items={adminNav} path={adminPath} />;
}
