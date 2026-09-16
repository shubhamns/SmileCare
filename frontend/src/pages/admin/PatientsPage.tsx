import { useQuery } from "@apollo/client";
import { Shield } from "lucide-react";
import { GET_PATIENTS } from "@/graphql/operations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
export function PatientsPage() {
  const { hasRole } = useAuth();
  const { data, loading } = useQuery<{ patients: { id: string; name: string; email: string; phone?: string | null; lastVisit: string; clinicName: string }[] }>(GET_PATIENTS);
  const patients = data?.patients || [];
  return (
    <Card><CardHeader><CardTitle className="flex items-center gap-2">Patients {hasRole("doctor", "admin") && <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" />PHI Access Logged</Badge>}</CardTitle></CardHeader><CardContent>
      {loading ? <p className="text-slate-500">Loading patients...</p> : patients.length === 0 ? <p className="text-slate-500">No registered patients yet.</p> : (
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="border-b text-left text-slate-500"><th className="pb-3 font-medium">Name</th><th className="pb-3 font-medium">Email</th><th className="pb-3 font-medium">Phone</th><th className="pb-3 font-medium">Last Visit</th><th className="pb-3 font-medium">Clinic</th></tr></thead>
        <tbody>{patients.map((p) => (
          <tr key={p.id} className="border-b last:border-0"><td className="py-3 font-medium">{p.name}</td><td className="py-3 text-slate-500">{p.email}</td><td className="py-3 text-slate-500">{p.phone || "—"}</td><td className="py-3">{p.lastVisit || "—"}</td><td className="py-3"><Badge variant="secondary">{p.clinicName || "—"}</Badge></td></tr>
        ))}</tbody>
      </table></div>
      )}
    </CardContent></Card>
  );
}
