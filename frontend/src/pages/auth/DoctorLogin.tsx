import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Stethoscope } from "lucide-react";
import { LOGO_SRC } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { doctorRoutes } from "@/lib/routes";
const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type FormData = z.infer<typeof schema>;
export function DoctorLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const onSubmit = async (data: FormData) => {
    if (await login(data.email, data.password, "doctor")) {
      toast.success("Welcome back!");
      navigate(redirect || doctorRoutes.dashboard);
    } else toast.error("Invalid doctor credentials.");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-teal-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 text-teal-700 font-bold text-xl mb-2"><img src={LOGO_SRC} alt="" className="h-9 w-9 object-contain" />SmileCare Doctor</div>
          <CardTitle>Doctor Sign In</CardTitle>
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mt-2"><Stethoscope className="h-3 w-3" />Clinical staff only</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" {...register("email")} className="mt-1" /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" {...register("password")} className="mt-1" /></div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
