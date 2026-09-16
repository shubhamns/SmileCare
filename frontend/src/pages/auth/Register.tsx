import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LOGO_SRC } from "@/components/layout/BrandLogo";
import { REGISTER } from "@/graphql/operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput, formatPhone91 } from "@/components/ui/phone-input";
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/, "Enter 10-digit mobile number"),
  password: z.string().min(8),
  hipaa: z.boolean().refine((v) => v, "Required"),
});
type FormData = z.infer<typeof schema>;
export function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const [registerUser, { loading }] = useMutation(REGISTER);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { hipaa: false } });
  const onSubmit = async (data: FormData) => {
    try {
      await registerUser({ variables: { input: { name: data.name, email: data.email, password: data.password, phone: formatPhone91(data.phone) } } });
      toast.success("Account created! Please sign in.");
      navigate(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login");
    } catch {
      toast.error("Could not create account. Email may already be registered.");
    }
  };
  return (
    <AuthPageShell>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 text-teal-700 font-bold text-xl mb-2"><img src={LOGO_SRC} alt="" className="h-9 w-9 object-contain" />SmileCare</div>
          <CardTitle>Create Patient Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Label htmlFor="name">Full Name</Label><Input id="name" {...register("name")} className="mt-1" />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}</div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register("email")} className="mt-1" />{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}</div>
            <PhoneInput register={register("phone")} error={errors.phone} />
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" {...register("password")} className="mt-1" />{errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}</div>
            <div className="flex items-start gap-3">
              <Checkbox checked={watch("hipaa")} onCheckedChange={(v) => setValue("hipaa", !!v)} />
              <label className="text-xs text-slate-600">I acknowledge the Privacy Notice and consent to the collection and use of my personal health data for treatment, payment, and healthcare operations as per the DPDP Act, India.</label>
            </div>
            {errors.hipaa && <p className="text-xs text-red-500">{errors.hipaa.message}</p>}
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating..." : "Create Account"}</Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">Already have an account? <Link to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"} className="text-teal-600 hover:underline">Sign In</Link></p>
        </CardContent>
      </Card>
    </AuthPageShell>
  );
}
