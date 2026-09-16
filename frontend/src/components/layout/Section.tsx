import { cn } from "@/lib/utils";
type SectionTone = "white" | "alt" | "booking" | "admin" | "primary";
const tones: Record<SectionTone, string> = {
  white: "sc-section-white",
  alt: "sc-section-alt",
  booking: "sc-booking-canvas",
  admin: "sc-admin-canvas",
  primary: "py-16 lg:py-20 bg-teal-600",
};
export function Section({ tone = "white", className, ...props }: React.HTMLAttributes<HTMLElement> & { tone?: SectionTone }) {
  return <section className={cn(tones[tone], className)} {...props} />;
}
export function SectionHeader({ label, title, description, className, action }: { label?: string; title: string; description?: string; className?: string; action?: React.ReactNode }) {
  return (
    <div className={cn("mb-12", action ? "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" : "text-center max-w-2xl mx-auto", className)}>
      <div className={action ? "" : "mx-auto"}>
        {label && <span className="sc-section-label">{label}</span>}
        <h2 className={cn("sc-section-title mt-3", description && "mb-4")}>{title}</h2>
        {description && <p className="sc-body">{description}</p>}
      </div>
      {action}
    </div>
  );
}
