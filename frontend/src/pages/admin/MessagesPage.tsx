import { useQuery } from "@apollo/client";
import { GET_APPOINTMENTS } from "@/graphql/operations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function MessagesPage() {
  const { data, loading } = useQuery<{ appointments: { id: string; patientName: string; patientEmail: string; reason?: string | null; date: string; time: string; status: string }[] }>(GET_APPOINTMENTS);
  const messages = (data?.appointments || []).filter((a) => a.reason?.trim());
  return (
    <Card><CardHeader><CardTitle>Patient Notes</CardTitle></CardHeader><CardContent>
      {loading ? <p className="text-sm text-slate-500">Loading messages...</p> : messages.length === 0 ? (
        <p className="text-sm text-slate-500">No patient notes yet. Reasons submitted during booking will appear here.</p>
      ) : (
        <div className="space-y-3">{messages.map((m) => (
          <div key={m.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-2"><span className="font-medium text-sm">{m.patientName}</span><Badge variant="secondary">{m.status}</Badge></div>
            <p className="text-sm text-slate-600 mb-1">{m.reason}</p>
            <p className="text-xs text-slate-400">{m.date} · {m.time} · {m.patientEmail}</p>
          </div>
        ))}</div>
      )}
    </CardContent></Card>
  );
}
