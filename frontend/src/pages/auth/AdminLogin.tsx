import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { LOGO_SRC } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { adminRoutes } from "@/lib/routes";
const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type FormData = z.infer<typeof schema>;
export function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const onSubmit = async (data: FormData) => {
    if (await login(data.email, data.password, "admin")) {
      toast.success("Welcome back!");
      navigate(redirect || adminRoutes.dashboard);
    } else toast.error("Invalid admin credentials.");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 text-teal-700 font-bold text-xl mb-2"><img src={LOGO_SRC} alt="" className="h-9 w-9 object-contain" />SmileCare Admin</div>
          <CardTitle>Admin Sign In</CardTitle>
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mt-2"><Shield className="h-3 w-3" />Authorized staff only</div>
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
