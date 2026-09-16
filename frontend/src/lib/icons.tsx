import { Activity, AlignCenter, Gem, Heart, Shield, Sparkles, Stethoscope, Sun, Siren, type LucideIcon } from "lucide-react";
const iconMap: Record<string, LucideIcon> = { Stethoscope, Sparkles, Shield, Activity, Sun, Gem, AlignCenter, Siren };
export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || Heart;
  return <Icon className={className} />;
}
