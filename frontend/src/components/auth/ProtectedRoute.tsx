import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { homeForRole } from "@/lib/routes";
import type { Role } from "@/types";
export function ProtectedRoute({ roles, loginPath }: { roles?: Role[]; loginPath?: string }) {
  const location = useLocation();
  const { user, hasRole } = useAuth();
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    const base = loginPath || "/login";
    return <Navigate to={`${base}?redirect=${redirect}`} replace state={{ from: location }} />;
  }
  if (roles?.length && !hasRole(...roles)) return <Navigate to={homeForRole(user.role)} replace />;
  return <Outlet />;
}
