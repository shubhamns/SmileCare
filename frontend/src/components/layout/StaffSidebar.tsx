import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";
export type StaffNavItem = { suffix: string; label: string; icon: LucideIcon };
export function StaffSidebar({ items, path }: { items: StaffNavItem[]; path: (suffix: string) => string }) {
  const { pathname } = useLocation();
  return (
    <aside className="w-[var(--width-sidebar)] bg-navy-sidebar text-slate-400 min-h-screen flex flex-col shrink-0">
      <div className="px-5 py-6 border-b border-white/5">
        <BrandLogo dark />
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {items.map((item) => {
          const to = path(item.suffix);
          const active = pathname === to || (!!item.suffix && pathname.startsWith(`${to}/`));
          return (
            <Link key={item.label} to={to} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors", active ? "bg-teal-600/15 text-teal-400" : "hover:bg-white/5 hover:text-white")}>
              <item.icon className="h-[18px] w-[18px]" />{item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
