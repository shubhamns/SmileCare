import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { homeForRole } from "@/lib/routes";
export function PublicRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to={homeForRole(user.role)} replace />;
  return <Outlet />;
}
