import { useQuery } from "@apollo/client";
import { Shield, Heart, Award, Users } from "lucide-react";
import { GET_CLINICS } from "@/graphql/operations";
import { Card, CardContent } from "@/components/ui/card";
export function About() {
  const { data } = useQuery<{ clinics: { id: string; name: string; address: string }[] }>(GET_CLINICS);
  const clinics = data?.clinics || [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">About SmileCare</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">Providing exceptional dental care with a patient-first approach.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <img src="/images/hero-clinic-interior.jpg" alt="Clinic" className="rounded-2xl shadow-lg w-full object-cover" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed mb-4">At SmileCare, we believe everyone deserves access to high-quality dental care in a comfortable, welcoming environment. Our network serves patients across {clinics.length || "multiple"} clinic location{clinics.length === 1 ? "" : "s"}.</p>
          <p className="text-slate-600 leading-relaxed">We comply with India's Digital Personal Data Protection Act (DPDP Act), ensuring all patient health data is encrypted, access-controlled, and audited.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{ icon: Heart, title: "Patient First", desc: "Your comfort and health are our top priorities" }, { icon: Shield, title: "Privacy Secure", desc: "DPDP Act–compliant healthcare data protection" }, { icon: Award, title: "Excellence", desc: "Award-winning dental professionals" }, { icon: Users, title: "Multi-Clinic", desc: `${clinics.length} active clinic location${clinics.length === 1 ? "" : "s"}` }].map((v) => (
          <Card key={v.title}><CardContent className="p-6 text-center">
            <div className="h-12 w-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4"><v.icon className="h-6 w-6 text-teal-600" /></div>
            <h3 className="font-semibold mb-2">{v.title}</h3>
            <p className="text-sm text-slate-500">{v.desc}</p>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
