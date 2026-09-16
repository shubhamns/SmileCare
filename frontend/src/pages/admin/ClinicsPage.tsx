import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { CREATE_CLINIC, DELETE_CLINIC, GET_CLINICS, UPDATE_CLINIC } from "@/graphql/operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type ClinicRow = { id: string; name: string; address: string; phone: string; timezone: string };
const empty = { name: "", address: "", phone: "", timezone: "Asia/Kolkata" };
export function ClinicsPage() {
  const { data, loading, refetch } = useQuery<{ clinics: ClinicRow[] }>(GET_CLINICS);
  const [createClinic] = useMutation(CREATE_CLINIC);
  const [updateClinic] = useMutation(UPDATE_CLINIC);
  const [deleteClinic] = useMutation(DELETE_CLINIC);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const clinics = data?.clinics || [];
  const set = (key: keyof typeof empty, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const reset = () => { setForm(empty); setEditId(null); };
  const save = async () => {
    if (!form.name || !form.address || !form.phone) return toast.error("Fill all required fields.");
    try {
      if (editId) await updateClinic({ variables: { id: editId, input: form } });
      else await createClinic({ variables: { input: form } });
      await refetch();
      toast.success(editId ? "Clinic updated." : "Clinic created.");
      reset();
    } catch {
      toast.error("Could not save clinic.");
    }
  };
  const edit = (c: ClinicRow) => { setEditId(c.id); setForm({ name: c.name, address: c.address, phone: c.phone, timezone: c.timezone }); };
  const remove = async (id: string) => {
    try {
      await deleteClinic({ variables: { id } });
      await refetch();
      toast.success("Clinic deleted.");
      if (editId === id) reset();
    } catch {
      toast.error("Clinic cannot be deleted while it has appointments.");
    }
  };
  return (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle>{editId ? "Edit Clinic" : "Add Clinic"}</CardTitle></CardHeader><CardContent className="grid sm:grid-cols-2 gap-4">
        <div><Label>Name</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1" /></div>
        <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1" /></div>
        <div className="sm:col-span-2"><Label>Address</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} className="mt-1" /></div>
        <div><Label>Timezone</Label><Input value={form.timezone} onChange={(e) => set("timezone", e.target.value)} className="mt-1" /></div>
        <div className="flex items-end gap-2"><Button onClick={save}>{editId ? "Update" : "Create"}</Button>{editId && <Button variant="outline" onClick={reset}>Cancel</Button>}</div>
      </CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Clinics</CardTitle><Button size="sm" onClick={reset}><Plus className="h-4 w-4" />New</Button></CardHeader><CardContent>
        {loading ? <p className="text-slate-500">Loading...</p> : (
        <div className="space-y-3">{clinics.map((c) => (
          <div key={c.id} className="flex flex-wrap items-start justify-between gap-3 p-4 border rounded-lg">
            <div><h3 className="font-semibold">{c.name}</h3><p className="text-sm text-slate-500">{c.address}</p><p className="text-sm text-teal-600">{c.phone} · {c.timezone}</p></div>
            <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => edit(c)}>Edit</Button><Button size="sm" variant="destructive" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button></div>
          </div>
        ))}</div>
        )}
      </CardContent></Card>
    </div>
  );
}
