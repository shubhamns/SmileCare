import { useForm } from "react-hook-form";
import { useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { GET_CLINICS } from "@/graphql/operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
const schema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().regex(/^\d{10}$/, "Enter 10-digit mobile number"), message: z.string().min(10) });
type FormData = z.infer<typeof schema>;
export function Contact() {
  const { data, loading } = useQuery<{ clinics: { id: string; name: string; address: string; phone: string }[] }>(GET_CLINICS);
  const clinics = data?.clinics || [];
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = () => { toast.success("Message sent! We'll respond within 24 hours."); reset(); };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Contact Us</h1>
        <p className="text-slate-600">Have questions? We'd love to hear from you.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><Label htmlFor="name">Full Name</Label><Input id="name" {...register("name")} className="mt-1" />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}</div>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register("email")} className="mt-1" />{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}</div>
          <PhoneInput register={register("phone")} error={errors.phone} />
          <div><Label htmlFor="message">Message</Label><Textarea id="message" {...register("message")} className="mt-1" />{errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}</div>
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
        <div className="space-y-4">
          {loading ? <p className="text-slate-500">Loading clinics...</p> : clinics.map((c) => (
            <Card key={c.id}><CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-3">{c.name}</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{c.address}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />{c.phone}</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" />info@smilecare.in</div>
              </div>
            </CardContent></Card>
          ))}
        </div>
      </div>
    </div>
  );
}
