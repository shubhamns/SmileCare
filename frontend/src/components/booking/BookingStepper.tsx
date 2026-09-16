import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
const steps = ["Service", "Dentist", "Date & Time", "Details"];
export function BookingStepper({ current }: { current: number }) {
  return (
    <div className="mb-8 px-2">
      <div className="flex items-start justify-between relative max-w-lg mx-auto">
        <div className="absolute top-[15px] left-[12%] right-[12%] h-[2px] bg-slate-200" />
        <div className="absolute top-[15px] left-[12%] h-[2px] bg-teal-600 transition-all duration-500 ease-out" style={{ width: current === 0 ? "0%" : `${(current / (steps.length - 1)) * 76}%` }} />
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center z-10 flex-1 min-w-0">
            <div className={cn("h-[30px] w-[30px] rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all", i < current ? "bg-teal-600 border-teal-600 text-white" : i === current ? "bg-white border-teal-600 text-teal-600 ring-4 ring-teal-600/10" : "bg-white border-slate-200 text-slate-400")}>
              {i < current ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </div>
            <span className={cn("text-[10px] sm:text-[11px] mt-2 font-semibold text-center leading-tight px-0.5", i <= current ? "text-teal-600" : "text-slate-400")}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
