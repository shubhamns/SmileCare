import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { Clock, Globe, KeyRound, Lock, MapPin, Phone, Shield, User } from "lucide-react";
import { CHANGE_PASSWORD, GET_CLINICS, UPDATE_CLINIC } from "@/graphql/operations";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
function initials(name?: string) {
  return (name || "A").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
const roleLabels: Record<string, string> = { admin: "Administrator", doctor: "Doctor", patient: "Patient" };
export function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data: clinicsData, refetch: refetchClinics } = useQuery<{ clinics: { id: string; name: string; phone: string; address: string; timezone: string }[] }>(GET_CLINICS, { skip: !isAdmin });
  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);
  const [updateClinic] = useMutation(UPDATE_CLINIC);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const clinics = clinicsData?.clinics || [];
  const [clinicId, setClinicId] = useState("");
  const [clinicForm, setClinicForm] = useState({ name: "", phone: "", address: "", timezone: "Asia/Kolkata" });
  useEffect(() => {
    if (!clinicId && clinics[0]) setClinicId(clinics[0].id);
  }, [clinics, clinicId]);
  useEffect(() => {
    const c = clinics.find((x) => x.id === clinicId);
    if (c) setClinicForm({ name: c.name, phone: c.phone, address: c.address, timezone: c.timezone });
  }, [clinicId, clinics]);
  const onChangePassword = async () => {
    if (!user?.email || newPassword.length < 8) return toast.error("New password must be at least 8 characters.");
    try {
      const { data: result } = await changePassword({ variables: { email: user.email, currentPassword, newPassword } });
      if (result?.changePassword) {
        toast.success("Password updated.");
        setCurrentPassword("");
        setNewPassword("");
      } else toast.error("Current password is incorrect.");
    } catch {
      toast.error("Could not update password.");
    }
  };
  const saveClinic = async () => {
    if (!clinicId) return;
    try {
      await updateClinic({ variables: { id: clinicId, input: clinicForm } });
      await refetchClinics();
      toast.success("Clinic settings saved.");
    } catch {
      toast.error("Could not save clinic settings.");
    }
  };
  const tabCount = isAdmin ? 3 : 2;
  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">{isAdmin ? "Manage your account, clinics, and security preferences." : "Manage your account and security preferences."}</p>
      </div>
      <Card variant="elevated"><CardContent className="p-5 flex flex-col lg:flex-row lg:items-center gap-4">
        <Avatar className="h-14 w-14 ring-2 ring-teal-100"><AvatarImage src={user?.avatar || undefined} /><AvatarFallback className="text-base">{initials(user?.name)}</AvatarFallback></Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-semibold text-navy-900">{user?.name || "User"}</h3><Badge variant="default">{roleLabels[user?.role || "admin"] || "User"}</Badge></div>
          <p className="text-sm text-slate-500 mt-0.5 truncate">{user?.email}</p>
        </div>
        <div className="flex gap-8 text-center lg:text-left lg:ml-auto">
          {isAdmin && <div><div className="text-lg font-bold text-navy-900">{clinics.length}</div><div className="text-[11px] text-slate-400 uppercase tracking-wide">Clinics</div></div>}
          <div><div className="text-lg font-bold text-teal-600">Active</div><div className="text-[11px] text-slate-400 uppercase tracking-wide">Status</div></div>
        </div>
      </CardContent></Card>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className={`w-full grid h-auto gap-1 p-1 ${tabCount === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          <TabsTrigger value="account" className="gap-1.5"><KeyRound className="h-3.5 w-3.5" />Account</TabsTrigger>
          {isAdmin && <TabsTrigger value="clinic" className="gap-1.5"><Globe className="h-3.5 w-3.5" />Clinic</TabsTrigger>}
          <TabsTrigger value="security" className="gap-1.5"><Shield className="h-3.5 w-3.5" />Security</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card variant="elevated"><CardHeader className="pb-3">
            <div className="flex items-start gap-3"><div className="sc-icon-box"><KeyRound className="h-5 w-5 text-teal-600" /></div><div><CardTitle>Change Password</CardTitle><CardDescription>Update your login credentials. Use at least 8 characters.</CardDescription></div></div>
          </CardHeader><CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div><Label htmlFor="current">Current Password</Label><Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1.5" placeholder="Enter current password" /></div>
              <div><Label htmlFor="new">New Password</Label><Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1.5" placeholder="Min 8 characters" /></div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-400 flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 shrink-0" />Passwords are hashed and never stored in plain text.</p>
              <Button onClick={onChangePassword} disabled={loading} className="sm:shrink-0">{loading ? "Updating..." : "Update Password"}</Button>
            </div>
          </CardContent></Card>
        </TabsContent>
        {isAdmin && <TabsContent value="clinic">
          <Card variant="elevated"><CardHeader className="pb-3">
            <div className="flex items-start gap-3"><div className="sc-icon-box"><Globe className="h-5 w-5 text-teal-600" /></div><div className="flex-1"><CardTitle>Clinic Settings</CardTitle><CardDescription>Configure clinic details shown to patients and used for scheduling.</CardDescription></div><Badge variant="secondary">{clinics.length} clinic{clinics.length !== 1 ? "s" : ""}</Badge></div>
          </CardHeader><CardContent className="space-y-4">
            <div><Label>Active Clinic</Label><Select value={clinicId} onValueChange={setClinicId}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select clinic" /></SelectTrigger><SelectContent>{clinics.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <Separator />
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div><Label className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-slate-400" />Clinic Name</Label><Input value={clinicForm.name} onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })} className="mt-1.5" /></div>
              <div><Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" />Phone</Label><Input value={clinicForm.phone} onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })} className="mt-1.5" /></div>
              <div className="sm:col-span-2 xl:col-span-2"><Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" />Address</Label><Input value={clinicForm.address} onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Timezone</Label><Select value={clinicForm.timezone} onValueChange={(v) => setClinicForm({ ...clinicForm, timezone: v })}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem><SelectItem value="UTC">UTC</SelectItem></SelectContent></Select></div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100"><Button onClick={saveClinic} disabled={!clinicId}>Save Clinic</Button></div>
          </CardContent></Card>
        </TabsContent>}
        <TabsContent value="security">
          <Card variant="elevated"><CardHeader className="pb-3">
            <div className="flex items-start gap-3"><div className="sc-icon-box"><Shield className="h-5 w-5 text-teal-600" /></div><div><CardTitle>Security & Compliance</CardTitle><CardDescription>Healthcare data protection settings aligned with DPDP requirements.</CardDescription></div></div>
          </CardHeader><CardContent className="grid lg:grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3.5">
              <div className="flex items-start gap-3"><div className="sc-icon-box h-9 w-9"><Clock className="h-4 w-4 text-teal-600" /></div><div><div className="font-medium text-sm text-navy-900">Session Timeout</div><div className="text-xs text-slate-500 mt-0.5">Auto-logout after inactivity</div></div></div>
              <Select defaultValue="15"><SelectTrigger className="w-28 bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="15">15 min</SelectItem><SelectItem value="30">30 min</SelectItem><SelectItem value="60">60 min</SelectItem></SelectContent></Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3.5">
              <div className="flex items-start gap-3"><div className="sc-icon-box h-9 w-9"><Lock className="h-4 w-4 text-teal-600" /></div><div><div className="font-medium text-sm text-navy-900">PHI Encryption</div><div className="text-xs text-slate-500 mt-0.5">AES-256 at rest, TLS 1.3 in transit</div></div></div>
              <Badge variant="confirmed">Active</Badge>
            </div>
            {isAdmin && <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3.5">
              <div className="flex items-start gap-3"><div className="sc-icon-box h-9 w-9"><Shield className="h-4 w-4 text-teal-600" /></div><div><div className="font-medium text-sm text-navy-900">Audit Logging</div><div className="text-xs text-slate-500 mt-0.5">All admin actions are recorded</div></div></div>
              <Badge variant="confirmed">Enabled</Badge>
            </div>}
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3.5">
              <div className="flex items-start gap-3"><div className="sc-icon-box h-9 w-9"><User className="h-4 w-4 text-teal-600" /></div><div><div className="font-medium text-sm text-navy-900">Role-Based Access</div><div className="text-xs text-slate-500 mt-0.5">Patient, doctor, and admin portals isolated</div></div></div>
              <Badge variant="confirmed">Enforced</Badge>
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
