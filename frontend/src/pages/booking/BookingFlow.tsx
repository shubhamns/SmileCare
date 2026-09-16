import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import { ArrowLeft, ArrowRight, Clock, Star } from "lucide-react";
import { CREATE_APPOINTMENT, GET_BOOKED_SLOTS, GET_DENTISTS, GET_SERVICES } from "@/graphql/operations";
import { ServiceIcon } from "@/lib/icons";
import { timeSlots } from "@/lib/time-slots";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { PhoneInput, formatPhone91 } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import "react-day-picker/style.css";
const detailsSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(/^\d{10}$/, "Enter 10-digit mobile number"),
  reason: z.string().optional(),
  consent: z.boolean().refine((v) => v, "You must agree to continue"),
});
type DetailsForm = z.infer<typeof detailsSchema>;
export function BookingFlow() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState("");
  const [dentistId, setDentistId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:00 AM");
  const [clinicId, setClinicId] = useState("");
  const { data: servicesData, loading: servicesLoading } = useQuery<{ services: { id: string; name: string; description: string; duration: number; icon: string }[] }>(GET_SERVICES);
  const { data: dentistsData, loading: dentistsLoading } = useQuery<{ dentists: { id: string; name: string; specialty: string; rating: number; reviews: number; avatar: string; clinicId: string }[] }>(GET_DENTISTS);
  const dateKey = date ? format(date, "yyyy-MM-dd") : "";
  const { data: slotsData } = useQuery<{ bookedSlots: string[] }>(GET_BOOKED_SLOTS, { variables: { date: dateKey, dentistId }, skip: !dateKey || !dentistId });
  const [createAppointment, { loading: saving }] = useMutation(CREATE_APPOINTMENT);
  const services = servicesData?.services || [];
  const dentists = dentistsData?.dentists || [];
  useEffect(() => {
    if (services.length && !serviceId) setServiceId(services[0].id);
  }, [services, serviceId]);
  useEffect(() => {
    if (dentists.length && !dentistId) {
      setDentistId(dentists[0].id);
      setClinicId(dentists[0].clinicId);
    }
  }, [dentists, dentistId]);
  const unavailable = slotsData?.bookedSlots || [];
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DetailsForm>({ resolver: zodResolver(detailsSchema), defaultValues: { fullName: user?.name || "", email: user?.email || "", phone: "", consent: false } });
  const consent = watch("consent");
  const next = () => {
    if (step === 0 && !serviceId) return toast.error("Please select a service");
    if (step === 1 && !dentistId) return toast.error("Please select a dentist");
    if (step === 2 && (!date || !time)) return toast.error("Please select date and time");
    if (step === 1) {
      const dentist = dentists.find((d) => d.id === dentistId);
      if (dentist) setClinicId(dentist.clinicId);
    }
    setStep((s) => s + 1);
  };
  const onConfirm = async (data: DetailsForm) => {
    if (unavailable.includes(time)) return toast.error("This slot was just booked. Please choose another.");
    try {
      const result = await createAppointment({
        variables: {
          input: {
            patientName: data.fullName,
            patientEmail: data.email,
            patientPhone: formatPhone91(data.phone),
            reason: data.reason,
            serviceId,
            dentistId,
            clinicId,
            date: dateKey,
            time,
          },
        },
      });
      const appt = result.data?.createAppointment;
      navigate("/book/confirmation", {
        state: {
          ...data,
          service: appt?.service?.name,
          dentist: appt?.dentist?.name,
          date: dateKey,
          time,
          clinic: appt?.clinic?.name,
          address: appt?.clinic?.address,
        },
      });
      toast.success("Appointment confirmed! Confirmation email sent.");
    } catch {
      toast.error("Could not book appointment. Please try again.");
    }
  };
  if (servicesLoading || dentistsLoading) {
    return <div className="sc-booking-canvas"><div className="max-w-[var(--width-booking)] mx-auto px-4 py-12 text-center text-slate-500">Loading booking data...</div></div>;
  }
  return (
    <div className="sc-booking-canvas">
      <div className="max-w-[var(--width-booking)] mx-auto px-4">
        <h1 className="text-[22px] font-bold text-navy-900 text-center mb-6">Book Your Appointment</h1>
        <Card variant="elevated">
          <CardContent className="p-6 sm:p-8">
            <BookingStepper current={step} />
            {step === 0 && (
              <div>
                <h2 className="text-[17px] font-semibold text-navy-900 mb-4">Select a Service</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <button key={s.id} type="button" onClick={() => setServiceId(s.id)} className={cn("text-left p-4 rounded-xl border-2 transition-all bg-white", serviceId === s.id ? "sc-card-selected" : "border-slate-100 hover:border-slate-200")}>
                      <div className="h-9 w-9 bg-teal-50 rounded-lg flex items-center justify-center mb-2.5"><ServiceIcon name={s.icon} className="h-[18px] w-[18px] text-teal-600" /></div>
                      <h3 className="font-semibold text-[14px] text-navy-900">{s.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">{s.description}</p>
                      <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1"><Clock className="h-3 w-3" />{s.duration} mins</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="text-[17px] font-semibold text-navy-900 mb-4">Choose a Dentist</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {dentists.map((d) => (
                    <div key={d.id} className={cn("text-center p-4 rounded-xl border-2 transition-all bg-white", dentistId === d.id ? "sc-card-selected" : "border-slate-100")}>
                      <img src={d.avatar} alt={d.name} width={68} height={68} className="h-[68px] w-[68px] rounded-full mx-auto mb-2.5 object-cover" />
                      <h3 className="font-semibold text-[13px] text-navy-900">{d.name}</h3>
                      <p className="text-[11px] text-teal-600 mt-0.5">{d.specialty}</p>
                      <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 mt-1.5"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{d.rating} ({d.reviews} reviews)</div>
                      <Button variant={dentistId === d.id ? "default" : "outline"} size="sm" className="mt-3 w-full rounded-lg text-[11px] h-8 font-semibold" onClick={() => setDentistId(d.id)}>{dentistId === d.id ? "Selected" : "Select"}</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="text-[17px] font-semibold text-navy-900 mb-4">Select a Date & Time</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="border border-slate-100 rounded-xl p-2 bg-white">
                    <DayPicker mode="single" selected={date} onSelect={(d) => { setDate(d); setTime(""); }} defaultMonth={new Date(2026, 8, 1)} disabled={{ before: new Date(2026, 8, 1) }} classNames={{ month_caption: "font-semibold text-navy-900 text-sm mb-2", selected: "!bg-teal-600 !text-white !rounded-full", today: "font-bold text-teal-600", day_button: "rounded-full h-8 w-8 text-[13px] hover:bg-teal-50" }} />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-navy-900 mb-3">Available Time Slots</h3>
                    {!date ? <p className="text-[13px] text-slate-400">Select a date to see available slots</p> : (
                      <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1">
                        {timeSlots.slice(0, 10).map((t) => {
                          const taken = unavailable.includes(t);
                          return (
                            <button key={t} type="button" disabled={taken} onClick={() => setTime(t)} className={cn("w-full px-4 py-2.5 rounded-lg text-[13px] font-medium border text-left transition-all", taken ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" : time === t ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:text-teal-600")}>
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="text-[17px] font-semibold text-navy-900 mb-4">Patient Details</h2>
                <form id="details-form" onSubmit={handleSubmit(onConfirm)} className="space-y-3.5">
                  <div><Label htmlFor="fullName" className="text-[13px] text-slate-600">Full Name</Label><Input id="fullName" placeholder="John Doe" {...register("fullName")} className="mt-1 h-10 text-[14px]" />{errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}</div>
                  <div><Label htmlFor="email" className="text-[13px] text-slate-600">Email Address</Label><Input id="email" type="email" placeholder="john@example.com" {...register("email")} className="mt-1 h-10 text-[14px]" />{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}</div>
                  <PhoneInput register={register("phone")} error={errors.phone} labelClassName="text-[13px] text-slate-600" inputClassName="flex-1 h-10 text-[14px]" />
                  <div><Label htmlFor="reason" className="text-[13px] text-slate-600">Reason for Visit <span className="text-slate-400 font-normal">(Optional)</span></Label><Textarea id="reason" placeholder="Describe your symptoms or concerns..." {...register("reason")} className="mt-1 min-h-[80px] text-[14px]" /></div>
                  <div className="flex items-start gap-2.5 pt-1">
                    <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setValue("consent", !!v)} className="mt-0.5" />
                    <label htmlFor="consent" className="text-[12px] text-slate-500 leading-relaxed">I agree to the privacy policy and consent to receive appointment confirmations and reminders via email/SMS.</label>
                  </div>
                  {errors.consent && <p className="text-xs text-red-500">{errors.consent.message}</p>}
                </form>
              </div>
            )}
            <div className="flex justify-between mt-7 pt-5 border-t border-slate-100">
              <Button variant="outline" className="rounded-lg px-4 h-9 text-[13px]" onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}><ArrowLeft className="h-3.5 w-3.5" />Back</Button>
              {step < 3 ? (
                <Button className="rounded-lg px-5 h-9 text-[13px] font-semibold" onClick={next}>Continue<ArrowRight className="h-3.5 w-3.5" /></Button>
              ) : (
                <Button type="submit" form="details-form" disabled={saving} className="rounded-lg px-5 h-9 text-[13px] font-semibold">{saving ? "Booking..." : "Confirm Appointment"}</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
