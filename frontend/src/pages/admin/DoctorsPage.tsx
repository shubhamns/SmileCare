import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { Plus, Star, Trash2 } from "lucide-react";
import { CREATE_DOCTOR_ACCOUNT, DELETE_DENTIST, GET_CLINICS, GET_DENTISTS, UPDATE_DENTIST } from "@/graphql/operations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type DentistRow = { id: string; name: string; specialty: string; rating: number; reviews: number; avatar: string; clinicId: string; clinic: { name: string } };
type FormState = { name: string; email: string; password: string; specialty: string; rating: number; reviews: number; avatar: string; clinicId: string };
function buildEmpty(clinicId: string): FormState {
  return { name: "", email: "", password: "", specialty: "", rating: 4.5, reviews: 0, avatar: "/images/dentist-1.jpg", clinicId };
}
export function DoctorsPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const { data, loading, refetch } = useQuery<{ dentists: DentistRow[] }>(GET_DENTISTS);
  const { data: clinicsData } = useQuery<{ clinics: { id: string; name: string }[] }>(GET_CLINICS);
  const [createDoctorAccount] = useMutation(CREATE_DOCTOR_ACCOUNT);
  const [updateDentist] = useMutation(UPDATE_DENTIST);
  const [deleteDentist] = useMutation(DELETE_DENTIST);
  const clinics = clinicsData?.clinics || [];
  const [form, setForm] = useState<FormState>(() => buildEmpty(""));
  const [editId, setEditId] = useState<string | null>(null);
  const dentists = data?.dentists || [];
  useEffect(() => {
    if (clinics.length && !form.clinicId && !editId) setForm((f) => ({ ...f, clinicId: clinics[0].id }));
  }, [clinics, form.clinicId, editId]);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const startNew = () => {
    setEditId(null);
    setForm(buildEmpty(clinics[0]?.id || ""));
    scrollToForm();
    toast.message("Add a new doctor with login email and password.");
  };
  const save = async () => {
    if (!form.name || !form.specialty || !form.clinicId) return toast.error("Fill name, specialty, and clinic.");
    const input = { name: form.name, specialty: form.specialty, rating: Number(form.rating), reviews: Number(form.reviews), avatar: form.avatar, clinicId: form.clinicId };
    try {
      if (editId) {
        await updateDentist({ variables: { id: editId, input } });
        toast.success("Doctor updated.");
      } else {
        if (!form.email || !form.password) return toast.error("Email and password are required for a new doctor.");
        if (form.password.length < 6) return toast.error("Password must be at least 6 characters.");
        await createDoctorAccount({ variables: { input: { ...input, email: form.email, password: form.password } } });
        toast.success("Doctor created. They can log in at /doctor/login");
      }
      await refetch();
      startNew();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save doctor.");
    }
  };
  const edit = (d: DentistRow) => {
    setEditId(d.id);
    setForm({ name: d.name, email: "", password: "", specialty: d.specialty, rating: d.rating, reviews: d.reviews, avatar: d.avatar, clinicId: d.clinicId });
    scrollToForm();
  };
  const remove = async (id: string) => {
    try {
      await deleteDentist({ variables: { id } });
      await refetch();
      toast.success("Doctor deleted.");
      if (editId === id) startNew();
    } catch {
      toast.error("Doctor cannot be deleted while they have appointments.");
    }
  };
  return (
    <div className="space-y-6">
      <div ref={formRef} id="doctor-form"><Card><CardHeader><CardTitle>{editId ? "Edit Doctor" : "Add Doctor"}</CardTitle></CardHeader><CardContent className="grid sm:grid-cols-2 gap-4">
        <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
        <div><Label>Specialty</Label><Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="mt-1" /></div>
        {!editId && (
          <>
            <div><Label>Login Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" placeholder="doctor@smilecare.com" /></div>
            <div><Label>Login Password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1" placeholder="Min 6 characters" /></div>
          </>
        )}
        <div><Label>Rating</Label><Input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="mt-1" /></div>
        <div><Label>Reviews</Label><Input type="number" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: Number(e.target.value) })} className="mt-1" /></div>
        <div><Label>Avatar URL</Label><Input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="mt-1" /></div>
        <div><Label>Clinic</Label>{clinics.length === 0 ? <p className="text-sm text-slate-500 mt-2">Add a clinic first.</p> : (
          <Select value={form.clinicId} onValueChange={(v) => setForm({ ...form, clinicId: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Select clinic" /></SelectTrigger><SelectContent>{clinics.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
        )}</div>
        <div className="sm:col-span-2 flex items-end gap-2"><Button type="button" onClick={save} disabled={clinics.length === 0}>{editId ? "Update" : "Create Doctor"}</Button>{editId && <Button type="button" variant="outline" onClick={startNew}>Cancel</Button>}</div>
      </CardContent></Card></div>
      <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Doctors</CardTitle><Button type="button" size="sm" onClick={startNew}><Plus className="h-4 w-4" />New</Button></CardHeader><CardContent>
        {loading ? <p className="text-slate-500 mt-4">Loading doctors...</p> : dentists.length === 0 ? <p className="text-slate-500">No doctors yet. Click New to add one.</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{dentists.map((d) => (
          <Card key={d.id}><CardContent className="p-5">
            <div className="flex items-center gap-4 mb-4"><img src={d.avatar} alt={d.name} className="h-14 w-14 rounded-full object-cover" /><div><h3 className="font-semibold">{d.name}</h3><p className="text-sm text-teal-600">{d.specialty}</p></div></div>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />{d.rating} ({d.reviews})</div>
            <Badge variant="secondary" className="mb-3">{d.clinic.name}</Badge>
            <div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => edit(d)}>Edit</Button><Button type="button" size="sm" variant="destructive" onClick={() => remove(d.id)}><Trash2 className="h-4 w-4" /></Button></div>
          </CardContent></Card>
        ))}</div>
        )}
      </CardContent></Card>
    </div>
  );
}
