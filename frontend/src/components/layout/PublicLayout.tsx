import { Outlet, useLocation } from "react-router-dom";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
export function PublicLayout() {
  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith("/book");
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1"><Outlet /></main>
      {!hideFooter && <PublicFooter />}
    </div>
  );
}
