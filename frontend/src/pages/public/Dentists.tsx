import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { GET_DENTISTS } from "@/graphql/operations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export function Dentists() {
  const { data, loading } = useQuery<{ dentists: { id: string; name: string; specialty: string; rating: number; reviews: number; avatar: string; clinic: { name: string } }[] }>(GET_DENTISTS);
  const dentists = data?.dentists || [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Our Expert Dentists</h1>
        <p className="text-slate-600">Board-certified professionals across all our clinic locations</p>
      </div>
      {loading ? <p className="text-center text-slate-500">Loading dentists...</p> : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dentists.map((d) => (
            <Card key={d.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <img src={d.avatar} alt={d.name} width={96} height={96} className="h-24 w-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-teal-50" />
                <h3 className="font-semibold text-lg text-slate-900">{d.name}</h3>
                <p className="text-teal-600 text-sm mb-2">{d.specialty}</p>
                <Badge variant="secondary" className="mb-3">{d.clinic.name}</Badge>
                <div className="flex items-center justify-center gap-1 text-sm mb-4"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />{d.rating} ({d.reviews} reviews)</div>
                <Button variant="outline" className="w-full" asChild><Link to="/book">Book with {d.name.split(" ").pop()}</Link></Button>
              </CardContent>
            </Card>
        ))}
      </div>
      )}
    </div>
  );
}
