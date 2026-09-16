import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
export function StatCard({ label, value, trend, trendUp, icon: Icon, iconBg, iconColor }: { label: string; value: string; trend?: string; trendUp?: boolean; icon: LucideIcon; iconBg: string; iconColor: string }) {
  return (
    <Card variant="stat"><CardContent className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-slate-500 font-medium truncate">{label}</p>
          <p className="text-[1.65rem] font-bold text-navy-900 mt-1 leading-none">{value}</p>
          {trend && <p className={cn("text-[10px] font-semibold mt-2", trendUp ? "text-green-600" : "text-red-500")}>{trend}</p>}
        </div>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", iconBg)}><Icon className={cn("h-[18px] w-[18px]", iconColor)} /></div>
      </div>
    </CardContent></Card>
  );
}
