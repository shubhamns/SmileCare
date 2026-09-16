import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "sonner";
import { X } from "lucide-react";
import { client } from "@/apollo/client";
import { adminPath, doctorPath, env } from "@/lib/env";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DoctorLayout } from "@/components/layout/DoctorLayout";
import { RouteFallback } from "@/components/layout/RouteFallback";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import * as Pages from "@/routes/lazy-pages";
const patientBase = env.patientRoute.replace(/^\//, "");
const doctorBase = env.doctorRoute.replace(/^\//, "");
const adminBase = env.adminRoute.replace(/^\//, "");
export default function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route index element={<Pages.Home />} />
              <Route path="services" element={<Pages.Services />} />
              <Route path="dentists" element={<Pages.Dentists />} />
              <Route path="about" element={<Pages.About />} />
              <Route path="contact" element={<Pages.Contact />} />
              <Route element={<ProtectedRoute roles={["patient"]} loginPath="/login" />}>
                <Route path="book" element={<Pages.BookingFlow />} />
                <Route path="book/confirmation" element={<Pages.Confirmation />} />
              </Route>
            </Route>
            {/* Patient */}
            <Route element={<PublicRoute />}>
              <Route path="login" element={<Pages.Login />} />
              <Route path="register" element={<Pages.Register />} />
            </Route>
            <Route element={<ProtectedRoute roles={["patient"]} loginPath="/login" />}>
              <Route path={patientBase} element={<Pages.PatientDashboard />} />
            </Route>
            {/* Admin */}
            <Route path={doctorBase}>
              <Route element={<PublicRoute />}>
                <Route path="login" element={<Pages.DoctorLogin />} />
              </Route>
              <Route element={<ProtectedRoute roles={["doctor"]} loginPath={doctorPath("login")} />}>
                <Route element={<DoctorLayout />}>
                  <Route index element={<Pages.DoctorDashboard />} />
                  <Route path="appointments" element={<Pages.AppointmentsPage />} />
                  <Route path="patients" element={<Pages.PatientsPage />} />
                  <Route path="calendar" element={<Pages.CalendarPage />} />
                  <Route path="messages" element={<Pages.MessagesPage />} />
                  <Route path="settings" element={<Pages.SettingsPage />} />
                </Route>
              </Route>
            </Route>
            <Route path={adminBase}>
              <Route element={<PublicRoute />}>
                <Route path="login" element={<Pages.AdminLogin />} />
              </Route>
              <Route element={<ProtectedRoute roles={["admin"]} loginPath={adminPath("login")} />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Pages.AdminDashboard />} />
                  <Route path="appointments" element={<Pages.AppointmentsPage />} />
                    <Route path="patients" element={<Pages.PatientsPage />} />
                    <Route path="clinics" element={<Pages.ClinicsPage />} />
                    <Route path="doctors" element={<Pages.DoctorsPage />} />
                  <Route path="services" element={<Pages.ServicesPage />} />
                  <Route path="calendar" element={<Pages.CalendarPage />} />
                  <Route path="messages" element={<Pages.MessagesPage />} />
                  <Route path="reports" element={<Pages.ReportsPage />} />
                  <Route path="audit-logs" element={<Pages.AuditLogsPage />} />
                  <Route path="settings" element={<Pages.SettingsPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors closeButton icons={{ close: <X className="h-4 w-4" /> }} />
      </BrowserRouter>
    </ApolloProvider>
  );
}
