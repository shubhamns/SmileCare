import { useQuery } from "@apollo/client";
import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Users, XCircle } from "lucide-react";
import { GET_APPOINTMENTS } from "@/graphql/operations";
import { mapAppointment } from "@/lib/graphql-mappers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { parseISO } from "date-fns";
export function AdminDashboard() {
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const { data, loading } = useQuery<{ appointments: Parameters<typeof mapAppointment>[0][] }>(GET_APPOINTMENTS);
  const appts = (data?.appointments || []).map(mapAppointment);
  const todayAppts = appts.filter((a) => a.date === todayKey);
  const upcoming = appts.filter((a) => a.status === "confirmed" || a.status === "pending");
  const cancelled = appts.filter((a) => a.status === "cancelled");
  const patients = new Set(appts.map((a) => a.patientEmail)).size;
  const stats = [
    { label: "Today's Appointments", value: String(todayAppts.length), icon: Calendar, iconBg: "bg-teal-50", iconColor: "text-teal-600", trend: `${todayAppts.length} scheduled`, trendUp: true },
    { label: "Total Patients", value: String(patients), icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-600", trend: "Unique patients", trendUp: true },
    { label: "Upcoming Appointments", value: String(upcoming.length), icon: TrendingUp, iconBg: "bg-green-50", iconColor: "text-green-600", trend: "Active bookings", trendUp: true },
    { label: "Cancelled", value: String(cancelled.length), icon: XCircle, iconBg: "bg-red-50", iconColor: "text-red-500", trend: "All time", trendUp: false },
  ];
  return (
    <div>
      {loading ? <p className="text-slate-500 mb-4">Loading dashboard...</p> : null}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card variant="stat" className="lg:col-span-2"><CardHeader className="pb-2"><CardTitle>Today's Appointments</CardTitle></CardHeader><CardContent>
          {todayAppts.length === 0 ? <p className="text-sm text-slate-500">No appointments scheduled for today.</p> : (
          <div className="overflow-x-auto"><table className="w-full text-[13px]">
            <thead><tr className="border-b border-slate-100"><th className="pb-2.5 font-medium text-slate-400 text-[11px] text-left">Time</th><th className="pb-2.5 font-medium text-slate-400 text-[11px] text-left">Patient</th><th className="pb-2.5 font-medium text-slate-400 text-[11px] text-left">Service</th><th className="pb-2.5 font-medium text-slate-400 text-[11px] text-left">Status</th></tr></thead>
            <tbody>{todayAppts.map((a) => (
              <tr key={a.id} className="border-b border-slate-50 last:border-0"><td className="py-3 font-semibold text-navy-900">{a.time}</td><td className="py-3 text-navy-900">{a.patientName}</td><td className="py-3 text-slate-500">{a.service}</td><td className="py-3"><Badge variant={a.status}>{a.status}</Badge></td></tr>
            ))}</tbody>
          </table></div>
          )}
        </CardContent></Card>
        <Card variant="stat"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle>{format(new Date(), "MMMM yyyy")}</CardTitle><div className="flex gap-0.5"><button type="button" className="p-1 hover:bg-slate-50 rounded sc-focus"><ChevronLeft className="h-3.5 w-3.5 text-slate-400" /></button><button type="button" className="p-1 hover:bg-slate-50 rounded sc-focus"><ChevronRight className="h-3.5 w-3.5 text-slate-400" /></button></div></CardHeader><CardContent>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => <div key={d} className="text-slate-400 py-1 font-medium text-[9px]">{d}</div>)}
            {Array.from({ length: 3 }, (_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const isSelected = day === new Date().getDate();
              const hasAppt = appts.some((a) => { try { return parseISO(a.date).getDate() === day; } catch { return false; } });
              return <div key={day} className={`py-1.5 rounded-full text-[10px] mx-auto w-7 ${isSelected ? "bg-teal-600 text-white font-bold" : hasAppt ? "bg-teal-50 text-teal-700 font-semibold" : "text-slate-600"}`}>{day}</div>;
            })}
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
}
