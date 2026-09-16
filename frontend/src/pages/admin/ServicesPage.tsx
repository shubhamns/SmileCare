import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { Clock, Plus, Trash2 } from "lucide-react";
import { CREATE_SERVICE, DELETE_SERVICE, GET_SERVICES, UPDATE_SERVICE } from "@/graphql/operations";
import { ServiceIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
type ServiceRow = { id: string; name: string; description: string; duration: number; price: number; icon: string };
const empty = { name: "", description: "", duration: 30, price: 1000, icon: "Stethoscope" };
export function ServicesPage() {
  const { data, loading, refetch } = useQuery<{ services: ServiceRow[] }>(GET_SERVICES);
  const [createService] = useMutation(CREATE_SERVICE);
  const [updateService] = useMutation(UPDATE_SERVICE);
  const [deleteService] = useMutation(DELETE_SERVICE);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const services = data?.services || [];
  const reset = () => { setForm(empty); setEditId(null); };
  const save = async () => {
    if (!form.name || !form.description) return toast.error("Fill all required fields.");
    const input = { ...form, duration: Number(form.duration), price: Number(form.price) };
    try {
      if (editId) await updateService({ variables: { id: editId, input } });
      else await createService({ variables: { input } });
      await refetch();
      toast.success(editId ? "Service updated." : "Service created.");
      reset();
    } catch {
      toast.error("Could not save service.");
    }
  };
  const edit = (s: ServiceRow) => { setEditId(s.id); setForm({ name: s.name, description: s.description, duration: s.duration, price: s.price, icon: s.icon }); };
  const remove = async (id: string) => {
    try {
      await deleteService({ variables: { id } });
      await refetch();
      toast.success("Service deleted.");
      if (editId === id) reset();
    } catch {
      toast.error("Service cannot be deleted while it has appointments.");
    }
  };
  return (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle>{editId ? "Edit Service" : "Add Service"}</CardTitle></CardHeader><CardContent className="grid sm:grid-cols-2 gap-4">
        <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
        <div><Label>Icon</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="mt-1" /></div>
        <div className="sm:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
        <div><Label>Duration (mins)</Label><Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} className="mt-1" /></div>
        <div><Label>Price (INR)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1" /></div>
        <div className="flex items-end gap-2"><Button onClick={save}>{editId ? "Update" : "Create"}</Button>{editId && <Button variant="outline" onClick={reset}>Cancel</Button>}</div>
      </CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Services</CardTitle><Button size="sm" onClick={reset}><Plus className="h-4 w-4" />New</Button></CardHeader><CardContent>
        {loading ? <p className="text-slate-500">Loading services...</p> : (
        <div className="grid sm:grid-cols-2 gap-4">{services.map((s) => (
          <div key={s.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="h-10 w-10 bg-teal-50 rounded-lg flex items-center justify-center shrink-0"><ServiceIcon name={s.icon} className="h-5 w-5 text-teal-600" /></div>
            <div className="flex-1 min-w-0"><h3 className="font-medium truncate">{s.name}</h3><p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" />{s.duration} mins · {formatINR(s.price)}</p></div>
            <div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => edit(s)}>Edit</Button><Button size="sm" variant="destructive" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button></div>
          </div>
        ))}</div>
        )}
      </CardContent></Card>
    </div>
  );
}
