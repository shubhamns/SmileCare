function parseRoute(raw: string | undefined, fallback: string): string {
  const value = raw?.trim() || fallback;
  const path = value.startsWith("/") ? value : `/${value}`;
  return path.replace(/\/+$/, "") || fallback;
}
export const env = {
  graphqlUrl: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql",
  patientRoute: parseRoute(import.meta.env.VITE_PATIENT_ROUTE, "/patient"),
  doctorRoute: parseRoute(import.meta.env.VITE_DOCTOR_ROUTE, "/doctor"),
  adminRoute: parseRoute(import.meta.env.VITE_ADMIN_ROUTE, "/admin"),
} as const;
export function patientPath(suffix = ""): string {
  if (!suffix) return env.patientRoute;
  return `${env.patientRoute}/${suffix.replace(/^\//, "")}`;
}
export function doctorPath(suffix = ""): string {
  if (!suffix) return env.doctorRoute;
  return `${env.doctorRoute}/${suffix.replace(/^\//, "")}`;
}
export function adminPath(suffix = ""): string {
  if (!suffix) return env.adminRoute;
  return `${env.adminRoute}/${suffix.replace(/^\//, "")}`;
}
