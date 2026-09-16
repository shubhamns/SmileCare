import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Calendar, Shield } from "lucide-react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LOGO_SRC } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { patientRoutes } from "@/lib/routes";
const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type FormData = z.infer<typeof schema>;
export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const isBookingFlow = redirect.startsWith("/book");
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const onSubmit = async (data: FormData) => {
    if (await login(data.email, data.password, "patient")) {
      toast.success("Welcome back!");
      navigate(redirect || patientRoutes.dashboard);
    } else toast.error("Invalid email or password.");
  };
  const title = isBookingFlow ? "Sign In to Book" : "Patient Sign In";
  return (
    <AuthPageShell>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 text-teal-700 font-bold text-xl mb-2"><img src={LOGO_SRC} alt="" className="h-9 w-9 object-contain" />SmileCare</div>
          <CardTitle>{title}</CardTitle>
          {isBookingFlow ? (
            <div className="flex items-center justify-center gap-2 text-xs text-teal-600 bg-teal-50 rounded-lg px-3 py-2 mt-2"><Calendar className="h-3.5 w-3.5" />Please log in to continue booking your appointment</div>
          ) : (
            <div className="flex items-center justify-center gap-1 text-xs text-slate-500"><Shield className="h-3 w-3" />Secure login with DPDP Act–compliant data handling</div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" {...register("email")} className="mt-1" /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" {...register("password")} className="mt-1" /></div>
            <Button type="submit" className="w-full">{isBookingFlow ? "Sign In & Continue" : "Sign In"}{isBookingFlow && <Calendar className="h-4 w-4" />}</Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">Don't have an account? <Link to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-teal-600 hover:underline">Register</Link></p>
        </CardContent>
      </Card>
    </AuthPageShell>
  );
}
