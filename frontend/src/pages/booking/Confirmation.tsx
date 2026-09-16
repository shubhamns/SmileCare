import { Link, useLocation } from "react-router-dom";
import { Calendar, CheckCircle2, Clock, MapPin, Stethoscope, User } from "lucide-react";
import { patientRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
interface ConfirmState {
  fullName: string;
  email: string;
  service: string;
  dentist: string;
  date: string;
  time: string;
  clinic: string;
  address: string;
}
export function Confirmation() {
  const { state } = useLocation() as { state: ConfirmState | null };
  if (!state) return (
    <div className="sc-booking-canvas flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center p-8"><p className="text-slate-600 mb-4">No appointment data found.</p><Button asChild><Link to="/book">Book an Appointment</Link></Button></Card>
    </div>
  );
  return (
    <div className="sc-booking-canvas py-10 sm:py-14 px-4">
      <div className="max-w-[var(--width-confirm)] mx-auto">
        <Card variant="elevated">
          <CardContent className="p-8 text-center">
            <div className="h-[72px] w-[72px] bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-green-50/80"><CheckCircle2 className="h-10 w-10 text-green-500" strokeWidth={1.5} /></div>
            <h1 className="text-[22px] font-bold text-navy-900 mb-1.5">Appointment Confirmed!</h1>
            <p className="text-[13px] text-slate-500 mb-7 leading-relaxed">Your appointment has been successfully booked.<br />A confirmation email has been sent to <span className="text-navy-900 font-medium">{state.email}</span></p>
            <div className="bg-[#f8fafc] rounded-xl p-4 text-left space-y-3.5 mb-7 border border-slate-100">
              {[{ icon: Stethoscope, label: "Service", value: state.service }, { icon: User, label: "Doctor", value: state.dentist }, { icon: Clock, label: "Date & Time", value: `${state.date} at ${state.time}` }, { icon: MapPin, label: "Location", value: state.clinic, sub: state.address }].map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <row.icon className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                  <div><div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{row.label}</div><div className="text-[13px] font-semibold text-navy-900 mt-0.5">{row.value}</div>{row.sub && <div className="text-[12px] text-slate-500 mt-0.5">{row.sub}</div>}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Button variant="outline" className="rounded-lg h-10 text-[13px] font-semibold border-slate-200"><Calendar className="h-4 w-4" />Add to Calendar</Button>
              <Button className="rounded-lg h-10 text-[13px] font-semibold" asChild><Link to={patientRoutes.dashboard}>View My Appointments</Link></Button>
            </div>
          </CardContent>
        </Card>
        <div className="mt-12 flex justify-center">
          <div className="relative w-[260px]">
            <div className="bg-navy-900 rounded-[2.25rem] p-2.5 shadow-2xl">
              <div className="bg-white rounded-[1.75rem] overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 flex justify-center"><div className="w-14 h-1 bg-slate-300 rounded-full" /></div>
                <div className="px-4 pb-5 pt-2">
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                    <div className="h-6 w-6 rounded-md bg-teal-600 flex items-center justify-center text-white text-[9px] font-bold">S</div>
                    <div><div className="text-[10px] font-bold text-navy-900">SmileCare Dental</div><div className="text-[8px] text-slate-400">Appointment Reminder</div></div>
                  </div>
                  <p className="text-[11px] font-bold text-navy-900 mb-1.5">Your Appointment is Tomorrow!</p>
                  <p className="text-[9px] text-slate-500 mb-2.5 leading-relaxed">Hi {state.fullName.split(" ")[0]}, friendly reminder for your upcoming visit.</p>
                  <div className="bg-teal-50 rounded-lg p-2.5 text-[9px] space-y-0.5 mb-2.5 border border-teal-100">
                    <div className="font-bold text-teal-700">{state.service}</div>
                    <div className="text-slate-600">{state.dentist}</div>
                    <div className="text-slate-600">{state.date} · {state.time}</div>
                    <div className="text-slate-500">{state.clinic}</div>
                  </div>
                  <div className="bg-teal-600 text-white text-[10px] font-semibold text-center py-2 rounded-lg">View Appointment Details</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
