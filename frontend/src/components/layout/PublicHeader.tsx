import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "./BrandLogo";
import { Container } from "./Container";
import { useAuth } from "@/lib/auth";
import { homeForRole } from "@/lib/routes";
import { cn } from "@/lib/utils";
const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/dentists", label: "Our Dentists" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];
export function PublicHeader() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const portalPath = user ? homeForRole(user.role) : null;
  const navClass = (active: boolean) => cn("text-sm font-medium whitespace-nowrap rounded-md px-1 py-0.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2", active ? "text-teal-600" : "text-slate-600 hover:text-navy-900");
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <Container className="hidden lg:grid grid-cols-[auto_1fr_auto] items-center h-[var(--height-header)] gap-x-8 xl:gap-x-10">
        <BrandLogo />
        <nav className="flex items-center justify-center gap-7">
          {links.map((l) => (<Link key={l.to} to={l.to} className={navClass(pathname === l.to)}>{l.label}</Link>))}
        </nav>
        <div className="flex justify-end min-w-[160px]">
          {user && portalPath ? (
            <div className="flex gap-2"><Button variant="ghost" size="sm" asChild><Link to={portalPath}>Dashboard</Link></Button><Button variant="outline" size="sm" onClick={logout}>Logout</Button></div>
          ) : (
            <Button variant="navy" size="default" asChild><Link to="/book">Book Appointment</Link></Button>
          )}
        </div>
      </Container>
      <Container className="lg:hidden flex items-center justify-between h-[var(--height-header)]">
        <BrandLogo />
        <button type="button" className="p-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </Container>
      {open && (
        <div className="lg:hidden border-t px-6 py-4 space-y-3 bg-white">
          {links.map((l) => (<Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={cn("block text-sm font-medium py-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-teal-600", pathname === l.to ? "text-teal-600" : "text-slate-600")}>{l.label}</Link>))}
          <Button variant="navy" className="w-full" asChild><Link to="/book" onClick={() => setOpen(false)}>Book Appointment</Link></Button>
        </div>
      )}
    </header>
  );
}
