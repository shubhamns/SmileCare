import { useQuery } from "@apollo/client";
import { DayPicker } from "react-day-picker";
import { GET_APPOINTMENTS } from "@/graphql/operations";
import { mapAppointment } from "@/lib/graphql-mappers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import "react-day-picker/style.css";
export function CalendarPage() {
  const { data, loading } = useQuery<{ appointments: Parameters<typeof mapAppointment>[0][] }>(GET_APPOINTMENTS);
  const appointments = (data?.appointments || []).map(mapAppointment);
  const apptDates = appointments.map((a) => new Date(a.date + "T12:00:00"));
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card><CardHeader><CardTitle>Clinic Calendar</CardTitle></CardHeader><CardContent className="flex justify-center">
        <DayPicker mode="multiple" selected={apptDates} classNames={{ selected: "bg-teal-600 text-white rounded-md" }} />
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Upcoming Schedule</CardTitle></CardHeader><CardContent className="space-y-3">
        {loading ? <p className="text-slate-500">Loading schedule...</p> : appointments.length === 0 ? <p className="text-slate-500">No upcoming appointments.</p> : appointments.map((a) => (
          <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div><div className="font-medium text-sm">{a.patientName}</div><div className="text-xs text-slate-500">{a.date} · {a.time} · {a.dentist}</div></div>
            <Badge variant={a.status}>{a.status}</Badge>
          </div>
        ))}
      </CardContent></Card>
    </div>
  );
}
