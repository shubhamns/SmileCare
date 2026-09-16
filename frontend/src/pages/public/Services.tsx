import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { GET_SERVICES } from "@/graphql/operations";
import { ServiceIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
export function Services() {
  const { data, loading } = useQuery<{ services: { id: string; name: string; description: string; duration: number; price: number; icon: string }[] }>(GET_SERVICES);
  const services = data?.services || [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Our Dental Services</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">From routine checkups to advanced procedures, we offer comprehensive dental care for the whole family.</p>
      </div>
      {loading ? <p className="text-center text-slate-500">Loading services...</p> : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4"><ServiceIcon name={s.icon} className="h-6 w-6 text-teal-600" /></div>
                <h3 className="font-semibold text-slate-900 mb-2">{s.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{s.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-slate-400"><Clock className="h-3.5 w-3.5" />{s.duration} mins</span>
                  <span className="font-semibold text-teal-600">{formatINR(s.price)}</span>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>
      )}
      <div className="text-center mt-10"><Button size="lg" asChild><Link to="/book">Book a Service</Link></Button></div>
    </div>
  );
}
