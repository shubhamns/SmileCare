import { lazy } from "react";
// Public
export const Home = lazy(() => import("@/pages/public/Home").then((m) => ({ default: m.Home })));
export const Services = lazy(() => import("@/pages/public/Services").then((m) => ({ default: m.Services })));
export const Dentists = lazy(() => import("@/pages/public/Dentists").then((m) => ({ default: m.Dentists })));
export const About = lazy(() => import("@/pages/public/About").then((m) => ({ default: m.About })));
export const Contact = lazy(() => import("@/pages/public/Contact").then((m) => ({ default: m.Contact })));
export const BookingFlow = lazy(() => import("@/pages/booking/BookingFlow").then((m) => ({ default: m.BookingFlow })));
export const Confirmation = lazy(() => import("@/pages/booking/Confirmation").then((m) => ({ default: m.Confirmation })));
// Patient
export const Login = lazy(() => import("@/pages/auth/Login").then((m) => ({ default: m.Login })));
export const Register = lazy(() => import("@/pages/auth/Register").then((m) => ({ default: m.Register })));
export const PatientDashboard = lazy(() => import("@/pages/patient/PatientDashboard").then((m) => ({ default: m.PatientDashboard })));
// Admin
export const DoctorLogin = lazy(() => import("@/pages/auth/DoctorLogin").then((m) => ({ default: m.DoctorLogin })));
export const DoctorDashboard = lazy(() => import("@/pages/admin/Dashboard").then((m) => ({ default: m.AdminDashboard })));
export const AdminLogin = lazy(() => import("@/pages/auth/AdminLogin").then((m) => ({ default: m.AdminLogin })));
export const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard").then((m) => ({ default: m.AdminDashboard })));
export const AppointmentsPage = lazy(() => import("@/pages/admin/AppointmentsPage").then((m) => ({ default: m.AppointmentsPage })));
export const PatientsPage = lazy(() => import("@/pages/admin/PatientsPage").then((m) => ({ default: m.PatientsPage })));
export const ClinicsPage = lazy(() => import("@/pages/admin/ClinicsPage").then((m) => ({ default: m.ClinicsPage })));
export const DoctorsPage = lazy(() => import("@/pages/admin/DoctorsPage").then((m) => ({ default: m.DoctorsPage })));
export const ServicesPage = lazy(() => import("@/pages/admin/ServicesPage").then((m) => ({ default: m.ServicesPage })));
export const CalendarPage = lazy(() => import("@/pages/admin/CalendarPage").then((m) => ({ default: m.CalendarPage })));
export const MessagesPage = lazy(() => import("@/pages/admin/MessagesPage").then((m) => ({ default: m.MessagesPage })));
export const ReportsPage = lazy(() => import("@/pages/admin/ReportsPage").then((m) => ({ default: m.ReportsPage })));
export const AuditLogsPage = lazy(() => import("@/pages/admin/AuditLogsPage").then((m) => ({ default: m.AuditLogsPage })));
export const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage").then((m) => ({ default: m.SettingsPage })));
