import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-teal-50 text-teal-700 border border-teal-100",
      pill: "sc-badge-pill rounded-full px-4 py-1.5 text-[11px]",
      confirmed: "bg-green-50 text-green-700 border border-green-100",
      pending: "bg-orange-50 text-orange-600 border border-orange-100",
      cancelled: "bg-red-50 text-red-600 border border-red-100",
      completed: "bg-blue-50 text-blue-700 border border-blue-100",
      no_show: "bg-slate-100 text-slate-600 border border-slate-200",
      secondary: "bg-slate-100 text-slate-700 border border-slate-200",
    },
  },
  defaultVariants: { variant: "default" },
});
export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
