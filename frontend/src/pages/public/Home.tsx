import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ArrowRight, Award, Calendar, CheckCircle2, Clock, Heart, MapPin, Shield, Sparkles, Star, Users } from "lucide-react";
import { GET_CLINICS, GET_DENTISTS, GET_SERVICES, GET_STATS } from "@/graphql/operations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { Section, SectionHeader } from "@/components/layout/Section";
import { ServiceIcon } from "@/lib/icons";
import { topDentists } from "@/lib/dentists";
import { cn, formatINR } from "@/lib/utils";
const whyUs = [
  { icon: Shield, title: "Data Privacy Compliant", desc: "Your health data is encrypted and protected under India's DPDP Act." },
  { icon: Calendar, title: "Easy Online Booking", desc: "Book, reschedule, or cancel appointments in minutes." },
  { icon: Heart, title: "Patient-First Care", desc: "Comfort-focused treatment tailored to your needs." },
  { icon: Sparkles, title: "Modern Technology", desc: "State-of-the-art equipment for precise, painless care." },
];
const steps = [
  { num: "01", title: "Choose a Service", desc: "Pick from checkups, cleaning, cosmetic, and more." },
  { num: "02", title: "Select Your Dentist", desc: "Browse profiles, ratings, and specialties." },
  { num: "03", title: "Pick Date & Time", desc: "Real-time availability with instant confirmation." },
  { num: "04", title: "Confirm & Visit", desc: "Receive email reminders before your appointment." },
];
const faqs = [
  { q: "Do you accept health insurance or mediclaim?", a: "Yes, we accept most major health insurance and mediclaim policies. Contact us to verify your coverage before your visit." },
  { q: "How do I reschedule an appointment?", a: "Log in to your patient portal or call us at least 24 hours before your scheduled time." },
  { q: "Is emergency care available?", a: "Yes, we offer same-day emergency appointments for urgent dental issues at all our clinics." },
  { q: "What should I bring to my first visit?", a: "Bring a valid photo ID, insurance or mediclaim details, and a list of current medications." },
];
export function Home() {
  const { data: servicesData } = useQuery<{ services: { id: string; name: string; description: string; duration: number; price: number; icon: string }[] }>(GET_SERVICES);
  const { data: dentistsData } = useQuery<{ dentists: { id: string; name: string; specialty: string; rating: number; reviews: number; avatar: string }[] }>(GET_DENTISTS);
  const { data: clinicsData } = useQuery<{ clinics: { id: string; name: string; address: string; phone: string }[] }>(GET_CLINICS);
  const { data: statsData } = useQuery<{ stats: { patients: number; dentists: number; clinics: number; appointments: number; avgRating: number } }>(GET_STATS);
  const services = servicesData?.services || [];
  const dentists = topDentists(dentistsData?.dentists || []);
  const clinics = clinicsData?.clinics || [];
  const stats = statsData?.stats;
  const heroStats = [
    { icon: Users, value: String(stats?.patients ?? 0), label: "Registered Patients" },
    { icon: Award, value: String(stats?.dentists ?? 0), label: "Expert Dentists" },
    { icon: Star, value: String(stats?.avgRating ?? 0), label: "Average Rating", star: true },
  ];
  return (
    <div>
      <section className="bg-white pt-7 pb-10 sm:pt-9 sm:pb-11 lg:pt-10 lg:pb-12">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-14 items-center">
          <div className="max-w-[520px] md:max-w-none">
            <span className="sc-badge-pill mb-4">Healthier Smiles, Brighter Lives</span>
            <h1 className="sc-hero-title mb-4">Expert Dental Care for a Healthier, Happier You</h1>
            <p className="sc-body mb-6 max-w-[440px]">Experience world-class dental services with our team of experienced professionals. Book your appointment online in minutes.</p>
            <div className="flex flex-wrap items-center gap-3 mb-7">
              <Button size="lg" asChild><Link to="/book">Book Appointment<ArrowRight className="h-4 w-4" /></Link></Button>
              <Button size="lg" variant="outline" asChild><Link to="/services">Our Services</Link></Button>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 lg:gap-x-8 sm:gap-y-3 pt-5 border-t border-slate-100">
              {heroStats.map((s) => (
                <div key={s.label} className="sc-hero-stat">
                  <div className="sc-icon-box h-9 w-9 rounded-lg bg-[#ecfdf8] border border-teal-100/80"><s.icon className={cn("h-4 w-4", s.star ? "text-amber-400 fill-amber-400" : "text-teal-600")} /></div>
                  <div><div className="sc-hero-stat-value">{s.value}</div><div className="sc-hero-stat-label">{s.label}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:max-w-[520px] md:justify-self-end lg:max-w-[540px]">
            <HeroCarousel />
          </div>
        </Container>
      </section>
      <Section tone="white">
        <Container>
          <SectionHeader label="Our Services" title="Comprehensive Dental Care" description="From routine checkups to advanced procedures, we offer everything your smile needs under one roof." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.slice(0, 6).map((s) => (
              <Card key={s.id} className="hover:shadow-md hover:border-teal-100 transition-all group">
                <CardContent className="p-5 pt-5">
                  <div className="sc-icon-box mb-4 group-hover:bg-teal-100 transition-colors"><ServiceIcon name={s.icon} className="h-5 w-5 text-teal-600" /></div>
                  <h3 className="font-semibold text-navy-900 mb-2">{s.name}</h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{s.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-slate-400"><Clock className="h-3.5 w-3.5" />{s.duration} mins</span>
                    <span className="font-semibold text-teal-600">From {formatINR(s.price)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10"><Button variant="outline" asChild><Link to="/services">View All Services<ArrowRight className="h-4 w-4" /></Link></Button></div>
        </Container>
      </Section>
      <Section tone="alt">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader label="Why SmileCare" title="Why Patients Choose Us" description={`We've built our reputation on trust, transparency, and exceptional care across ${clinics.length} clinic location${clinics.length === 1 ? "" : "s"}.`} className="mb-8 text-left max-w-none mx-0" />
              <div className="grid sm:grid-cols-2 gap-5">
                {whyUs.map((w) => (
                  <div key={w.title} className="flex gap-4">
                    <div className="sc-icon-box bg-white border border-slate-100 shadow-sm"><w.icon className="h-5 w-5 text-teal-600" /></div>
                    <div><h3 className="font-semibold text-navy-900 text-sm mb-1">{w.title}</h3><p className="text-xs text-slate-500 leading-relaxed">{w.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-slate-200"><img src="/images/hero-patient.jpg" alt="" className="w-full h-full object-cover" /></div>
              <div className="flex flex-col gap-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-square bg-slate-200"><img src="/images/dentist-2.jpg" alt="" className="w-full h-full object-cover" /></div>
                <Card className="border-teal-100 bg-teal-50 shadow-none"><CardContent className="p-5 text-center pt-5"><div className="text-3xl font-bold text-teal-700">15+</div><div className="text-sm text-teal-600 font-medium">Years of Excellence</div></CardContent></Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <SectionHeader label="How It Works" title="Book in 4 Simple Steps" description="Schedule your visit online — no phone calls needed." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center p-6 rounded-2xl border border-slate-100 bg-page">
                <div className="text-4xl font-bold text-teal-100 mb-3">{s.num}</div>
                <h3 className="font-semibold text-navy-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10"><Button asChild><Link to="/book">Start Booking<ArrowRight className="h-4 w-4" /></Link></Button></div>
        </Container>
      </Section>
      <Section tone="alt">
        <Container>
          <SectionHeader label="Our Team" title="Meet Our Dentists" action={<Button variant="outline" asChild><Link to="/dentists">View All Dentists</Link></Button>} className="text-left max-w-none mx-0" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dentists.map((d) => (
              <Card key={d.id} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6 pt-6">
                  <img src={d.avatar} alt={d.name} width={96} height={96} className="h-24 w-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-white shadow-md" />
                  <h3 className="font-semibold text-navy-900">{d.name}</h3>
                  <p className="text-sm text-teal-600 mt-1">{d.specialty}</p>
                  <div className="flex items-center justify-center gap-1 text-sm text-slate-500 mt-2"><Star className="h-4 w-4 text-amber-400 fill-amber-400" />{d.rating} ({d.reviews} reviews)</div>
                  <Button variant="outline" size="sm" className="mt-4 w-full" asChild><Link to="/book">Book with {d.name.split(" ").pop()}</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="alt">
        <Container>
          <SectionHeader label="Locations" title="Visit Us Near You" description={`${clinics.length} convenient location${clinics.length === 1 ? "" : "s"} ready to serve you.`} />
          <div className="grid md:grid-cols-3 gap-5">
            {clinics.map((c) => (
              <Card key={c.id} className="hover:border-teal-100 transition-colors">
                <CardContent className="p-5 pt-5">
                  <div className="sc-icon-box mb-4"><MapPin className="h-5 w-5 text-teal-600" /></div>
                  <h3 className="font-semibold text-navy-900 mb-2">{c.name}</h3>
                  <p className="text-sm text-slate-500 mb-1">{c.address}</p>
                  <p className="text-sm text-teal-600 font-medium">{c.phone}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="white" className="py-16">
        <Container className="max-w-[800px]">
          <SectionHeader label="FAQ" title="Frequently Asked Questions" />
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="p-5 rounded-xl border border-slate-100 bg-page">
                <h3 className="font-semibold text-navy-900 text-sm mb-2 flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />{f.q}</h3>
                <p className="text-sm text-slate-500 pl-6">{f.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="primary" className="py-16">
        <Container className="max-w-[800px] text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready for Your Best Smile?</h2>
          <p className="text-teal-100 mb-8 text-lg">{stats?.appointments ? `${stats.appointments} appointments booked.` : "Book your appointment today — it only takes 2 minutes."}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" variant="secondary" asChild><Link to="/book"><Calendar className="h-5 w-5" />Book Now</Link></Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white bg-transparent hover:bg-white/10" asChild><Link to="/contact">Contact Us</Link></Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
