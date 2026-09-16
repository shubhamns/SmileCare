import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function formatPhone91(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits ? `+91 ${digits}` : "";
}
export function PhoneInput({ id = "phone", register, error, labelClassName, inputClassName }: { id?: string; register: UseFormRegisterReturn; error?: FieldError; labelClassName?: string; inputClassName?: string }) {
  return (
    <div>
      <Label htmlFor={id} className={labelClassName}>Phone Number</Label>
      <div className="flex gap-2 mt-1">
        <div className="flex items-center px-3 h-10 rounded-md border border-input bg-slate-50 text-sm font-medium text-slate-600 shrink-0">+91</div>
        <Input id={id} type="tel" inputMode="numeric" placeholder="98765 43210" maxLength={10} {...register} className={inputClassName || "flex-1"} />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
