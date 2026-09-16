import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Mail, MapPin, Phone, Shield } from "lucide-react";
import { GET_CLINICS } from "@/graphql/operations";
import { LOGO_SRC } from "./BrandLogo";
export function PublicFooter() {
  const { data } = useQuery<{ clinics: { id: string; name: string; address: string; phone: string }[] }>(GET_CLINICS);
  const main = data?.clinics[0];
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-4"><img src={LOGO_SRC} alt="" className="h-8 w-8 object-contain rounded-md bg-white/95 p-0.5" />SmileCare</div>
          <p className="text-sm leading-relaxed">Expert dental care for a healthier, happier you. Patient data protected under India's DPDP Act.</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-teal-400"><Shield className="h-4 w-4" />DPDP Act Compliant</div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm">
            <Link to="/services" className="block hover:text-teal-400">Services</Link>
            <Link to="/dentists" className="block hover:text-teal-400">Our Dentists</Link>
            <Link to="/book" className="block hover:text-teal-400">Book Appointment</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          {main ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{main.address}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />{main.phone}</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" />info@smilecare.in</div>
          </div>
          ) : <p className="text-sm text-slate-500">Loading...</p>}
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Hours</h4>
          <div className="space-y-1 text-sm">
            <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
            <p>Sunday: 10:00 AM - 2:00 PM</p>
            <p className="text-slate-500 text-xs mt-2">IST (India Standard Time)</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">&copy; 2026 SmileCare Dental Clinic. All rights reserved. Patient data protected under the DPDP Act, India.</div>
    </footer>
  );
}
