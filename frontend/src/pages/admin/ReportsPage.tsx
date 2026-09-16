import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { BarChart3, TrendingUp } from "lucide-react";
import { GET_APPOINTMENTS } from "@/graphql/operations";
import { mapAppointment } from "@/lib/graphql-mappers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function ReportsPage() {
  const { data, loading } = useQuery<{ appointments: Parameters<typeof mapAppointment>[0][] }>(GET_APPOINTMENTS);
  const appts = (data?.appointments || []).map(mapAppointment);
  const patients = new Set(appts.map((a) => a.patientEmail)).size;
  const cancelled = appts.filter((a) => a.status === "cancelled").length;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"];
  const chart = useMemo(() => {
    const counts = new Array(9).fill(0);
    appts.forEach((a) => {
      const month = Number(a.date.split("-")[1]) - 1;
      if (month >= 0 && month < 9) counts[month] += 1;
    });
    return counts;
  }, [appts]);
  const max = Math.max(...chart, 1);
  const stats = [
    { label: "Total Appointments", value: String(appts.length), trend: "All clinics" },
    { label: "Unique Patients", value: String(patients), trend: "From bookings" },
    { label: "Cancelled", value: String(cancelled), trend: "All time" },
  ];
  return (
    <div className="space-y-6">
      {loading ? <p className="text-slate-500">Loading reports...</p> : null}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}><CardContent className="p-5"><p className="text-sm text-slate-500">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p><p className="text-xs text-green-600 flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3" />{s.trend}</p></CardContent></Card>
        ))}
      </div>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Appointments Overview</CardTitle></CardHeader><CardContent>
        <div className="flex items-end gap-3 h-48">
          {months.map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-teal-600 rounded-t-md transition-all" style={{ height: `${(chart[i] / max) * 100}%` }} />
              <span className="text-xs text-slate-500">{m}</span>
            </div>
          ))}
        </div>
      </CardContent></Card>
    </div>
  );
}
