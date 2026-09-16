import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const cardVariants = cva("rounded-xl border bg-white", {
  variants: {
    variant: {
      default: "border-slate-100 shadow-sm",
      elevated: "border-slate-200/60 rounded-2xl shadow-[var(--shadow-card)]",
      flat: "border-slate-100 shadow-none",
      stat: "border-slate-100 shadow-sm rounded-xl",
      selected: "sc-card-selected rounded-xl",
    },
  },
  defaultVariants: { variant: "default" },
});
export function Card({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />;
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-5", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-[15px] font-semibold leading-none text-navy-900", className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-500", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
