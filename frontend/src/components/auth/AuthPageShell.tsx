import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
export function AuthPageShell({ children, homeTo = "/" }: { children: ReactNode; homeTo?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex flex-col">
      <header className="shrink-0 px-4 py-4 sm:px-6">
        <Link to={homeTo} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to Home
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-4 pt-0">{children}</div>
    </div>
  );
}
