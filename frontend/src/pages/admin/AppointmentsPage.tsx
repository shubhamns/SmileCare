import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { CANCEL_APPOINTMENT, GET_APPOINTMENTS } from "@/graphql/operations";
import { mapAppointment } from "@/lib/graphql-mappers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Appointment, AppointmentStatus } from "@/types";
export function AppointmentsPage() {
  const { data, loading, refetch } = useQuery<{ appointments: Parameters<typeof mapAppointment>[0][] }>(GET_APPOINTMENTS);
  const [cancelAppointment] = useMutation(CANCEL_APPOINTMENT);
  const [filter, setFilter] = useState("all");
  const appts: Appointment[] = (data?.appointments || []).map(mapAppointment);
  const filtered = filter === "all" ? appts : appts.filter((a) => a.status === filter);
  const cancel = async (id: string) => {
    try {
      await cancelAppointment({ variables: { id } });
      await refetch();
      toast.success("Appointment cancelled. Patient notified via email.");
    } catch {
      toast.error("Could not cancel appointment.");
    }
  };
  return (
    <Card><CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
      <CardTitle>All Appointments</CardTitle>
      <div className="flex gap-3 flex-wrap">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search..." className="pl-9 w-48" /></div>
        <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select>
      </div>
    </CardHeader><CardContent>
      {loading ? <p className="text-slate-500">Loading appointments...</p> : (
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="border-b text-left text-slate-500"><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Time</th><th className="pb-3 font-medium">Patient</th><th className="pb-3 font-medium">Service</th><th className="pb-3 font-medium">Dentist</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Actions</th></tr></thead>
        <tbody>{filtered.map((a) => (
          <tr key={a.id} className="border-b last:border-0">
            <td className="py-3">{a.date}</td><td className="py-3">{a.time}</td><td className="py-3">{a.patientName}</td><td className="py-3 text-slate-500">{a.service}</td><td className="py-3">{a.dentist}</td>
            <td className="py-3"><Badge variant={a.status as AppointmentStatus}>{a.status}</Badge></td>
            <td className="py-3">{a.status !== "cancelled" && <Button variant="destructive" size="sm" onClick={() => cancel(a.id)}>Cancel</Button>}</td>
          </tr>
        ))}</tbody>
      </table></div>
      )}
    </CardContent></Card>
  );
}
