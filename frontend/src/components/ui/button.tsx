import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
export const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors sc-focus disabled:pointer-events-none disabled:opacity-50 cursor-pointer", {
  variants: {
    variant: {
      default: "bg-teal-600 text-white hover:bg-teal-700 shadow-sm",
      outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700",
      ghost: "hover:bg-slate-100 text-slate-700",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      secondary: "bg-slate-100 text-navy-900 hover:bg-slate-200",
      link: "text-teal-600 underline-offset-4 hover:underline font-medium",
      navy: "bg-navy-900 text-white hover:bg-navy-800",
      success: "bg-green-600 text-white hover:bg-green-700",
    },
    size: {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs rounded-lg",
      lg: "h-11 px-6 text-[15px] rounded-lg",
      xl: "h-12 px-8 text-base rounded-lg",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
