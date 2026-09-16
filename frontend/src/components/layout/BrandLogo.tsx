import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
export const LOGO_SRC = "/images/logo.png";
export function BrandLogo({ compact, dark }: { compact?: boolean; dark?: boolean }) {
  return (
    <Link to="/" aria-label="SmileCare Dental Clinic" className={cn("flex items-center gap-1.5 shrink-0 rounded-lg select-none outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2", dark && "focus-visible:ring-offset-navy-sidebar")}>
      <img src={LOGO_SRC} alt="" className="h-10 w-10 object-contain shrink-0" />
      {compact ? (
        <span className={cn("font-bold text-base", dark ? "text-white" : "text-navy-900")}>SmileCare</span>
      ) : (
        <div className="leading-none">
          <div className={cn("font-bold text-[17px] tracking-tight", dark ? "text-white" : "text-navy-900")}>SmileCare</div>
          <div className={cn("text-[10px] font-semibold tracking-[0.14em] uppercase mt-1", dark ? "text-slate-500" : "text-slate-400")}>Dental Clinic</div>
        </div>
      )}
    </Link>
  );
}
