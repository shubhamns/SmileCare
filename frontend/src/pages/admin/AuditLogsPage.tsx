import { useQuery } from "@apollo/client";
import { GET_AUDIT_LOGS } from "@/graphql/operations";
import { mapAuditLog } from "@/lib/graphql-mappers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function AuditLogsPage() {
  const { data, loading, refetch } = useQuery<{ auditLogs: Parameters<typeof mapAuditLog>[0][] }>(GET_AUDIT_LOGS, { pollInterval: 15000 });
  const logs = (data?.auditLogs || []).map(mapAuditLog);
  return (
    <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Audit Logs</CardTitle><button type="button" onClick={() => refetch()} className="text-xs text-teal-600 hover:underline">Refresh</button></CardHeader><CardContent>
      {loading ? <p className="text-slate-500">Loading audit logs...</p> : logs.length === 0 ? (
        <p className="text-slate-500">No audit logs yet. Logs are created when users log in, book appointments, or admins change data.</p>
      ) : (
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="border-b text-left text-slate-500"><th className="pb-3 font-medium">Timestamp</th><th className="pb-3 font-medium">User</th><th className="pb-3 font-medium">Role</th><th className="pb-3 font-medium">Action</th><th className="pb-3 font-medium">Resource</th><th className="pb-3 font-medium">IP</th></tr></thead>
        <tbody>{logs.map((l) => (
          <tr key={l.id} className="border-b last:border-0">
            <td className="py-3 text-slate-500">{new Date(l.timestamp).toLocaleString()}</td>
            <td className="py-3">{l.user}</td>
            <td className="py-3"><Badge variant="secondary">{l.role}</Badge></td>
            <td className="py-3"><Badge>{l.action}</Badge></td>
            <td className="py-3 text-slate-500">{l.resource}</td>
            <td className="py-3 text-slate-400">{l.ip || "—"}</td>
          </tr>
        ))}</tbody>
      </table></div>
      )}
    </CardContent></Card>
  );
}
