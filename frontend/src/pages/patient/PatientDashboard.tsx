import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import { GET_APPOINTMENTS } from "@/graphql/operations";
import { mapAppointment } from "@/lib/graphql-mappers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
export function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data, loading } = useQuery<{ appointments: Parameters<typeof mapAppointment>[0][] }>(GET_APPOINTMENTS, {
    variables: { patientEmail: user?.email },
    skip: !user?.email,
  });
  if (!user) return null;
  const upcoming = (data?.appointments || []).map(mapAppointment);
  const handleLogout = () => { logout(); navigate("/login"); };
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">My Appointments</h1>
        <div className="flex gap-3"><Button variant="outline" size="sm" asChild><Link to="/">Home</Link></Button><Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button></div>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Card><CardHeader className="flex flex-row items-center justify-between gap-4"><CardTitle>Welcome, {user.name}</CardTitle><Button size="sm" asChild><Link to="/book"><Plus className="h-4 w-4" />Book New</Link></Button></CardHeader><CardContent><p className="text-sm text-slate-500">Manage your appointments, reschedule, or cancel below.</p></CardContent></Card>
        {loading ? <p className="text-slate-500">Loading appointments...</p> : upcoming.length === 0 ? <p className="text-slate-500">No appointments yet. Book your first visit.</p> : (
        <div className="space-y-4">
          {upcoming.map((a) => (
              <Card key={a.id}><CardContent className="p-5">
                <div className="flex items-start justify-between mb-3"><div><h3 className="font-semibold">{a.service}</h3><p className="text-sm text-slate-500">{a.dentist}</p></div><Badge variant={a.status}>{a.status}</Badge></div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-teal-600" />{a.date}</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-teal-600" />{a.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-teal-600" />Clinic #{a.clinicId}</div>
                </div>
              </CardContent></Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
