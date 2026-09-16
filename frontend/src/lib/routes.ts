import { adminPath, doctorPath, env, patientPath } from "@/lib/env";
import type { Role } from "@/types";
export const publicRoutes = {
  home: "/",
  login: "/login",
  register: "/register",
  services: "/services",
  dentists: "/dentists",
  book: "/book",
} as const;
export const patientRoutes = {
  base: env.patientRoute,
  dashboard: patientPath(),
  login: publicRoutes.login,
  register: publicRoutes.register,
} as const;
export const doctorRoutes = {
  base: env.doctorRoute,
  login: doctorPath("login"),
  dashboard: doctorPath(),
} as const;
export const adminRoutes = {
  base: env.adminRoute,
  login: adminPath("login"),
  dashboard: adminPath(),
} as const;
export function homeForRole(role: Role): string {
  if (role === "admin") return adminRoutes.dashboard;
  if (role === "doctor") return doctorRoutes.dashboard;
  return patientRoutes.dashboard;
}
