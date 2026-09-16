import { Outlet, useNavigate } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import { Calendar, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";
import { StaffSidebar } from "./StaffSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { doctorPath } from "@/lib/env";
import { doctorRoutes } from "@/lib/routes";
const doctorNav = [
  { suffix: "", label: "Dashboard", icon: LayoutDashboard },
  { suffix: "appointments", label: "Appointments", icon: Calendar },
  { suffix: "patients", label: "Patients", icon: Users },
  { suffix: "calendar", label: "Calendar", icon: Calendar },
  { suffix: "messages", label: "Messages", icon: MessageSquare },
  { suffix: "settings", label: "Settings", icon: Settings },
];
export function DoctorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate(doctorRoutes.login); };
  return (
    <div className="flex min-h-screen sc-admin-canvas">
      <StaffSidebar items={doctorNav} path={doctorPath} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[60px] bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-[15px] font-semibold text-navy-900">Doctor Portal</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 relative"><Bell className="h-[17px] w-[17px] text-slate-400" /><span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full" /></Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
              <img src={user?.avatar || "/images/dentist-2.jpg"} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100" />
              <div className="hidden sm:block leading-tight"><div className="text-[13px] font-semibold text-navy-900">{user?.name || "Doctor"}</div><div className="text-[10px] text-slate-400 capitalize">Doctor</div></div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>
        <main data-scroll-container className="flex-1 p-5 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
}
