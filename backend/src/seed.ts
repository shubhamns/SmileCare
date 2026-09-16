import { prisma } from "./prisma";
import { config } from "./config";
const defaultSettings = [
  { key: "docker_compose_cmd", value: "docker compose up --build" },
  { key: "docker_frontend_port", value: "5173" },
  { key: "docker_backend_port", value: "4000" },
  { key: "docker_postgres_port", value: "5432" },
  { key: "docker_redis_url", value: "redis://redis:6379" },
  { key: "vite_graphql_url", value: "http://localhost:4000/graphql" },
  { key: "vite_patient_route", value: "/patient" },
  { key: "vite_doctor_route", value: "/doctor" },
  { key: "vite_admin_route", value: "/admin" },
  { key: "app_name", value: "SmileCare" },
];
const legacyAuditIds = ["l1", "l2", "l3", "l4", "l5"];
async function seedSettings() {
  for (const entry of defaultSettings) {
    await prisma.setting.upsert({ where: { key: entry.key }, update: {}, create: entry });
  }
}
async function seedAdmin() {
  await prisma.user.upsert({
    where: { email: config.adminEmail },
    update: { password: config.adminPassword, role: "ADMIN", name: "Clinic Admin" },
    create: { id: "u3", name: "Clinic Admin", email: config.adminEmail, password: config.adminPassword, role: "ADMIN", clinicId: "c1", avatar: "https://i.pravatar.cc/150?u=admin" },
  });
  await seedSettings();
  await prisma.auditLog.deleteMany({ where: { id: { in: legacyAuditIds } } });
  console.log(`Admin user ready: ${config.adminEmail}`);
}
async function seed() {
  const count = await prisma.clinic.count();
  if (count > 0) {
    await seedAdmin();
    console.log("Database already seeded, admin and settings synced");
    return;
  }
  await prisma.clinic.createMany({
    data: [
      { id: "c1", name: "SmileCare Bandra", address: "12 Linking Road, Bandra West, Mumbai, Maharashtra 400050", phone: "+91 98765 43210", timezone: "Asia/Kolkata" },
      { id: "c2", name: "SmileCare Koramangala", address: "88 5th Block, Koramangala, Bengaluru, Karnataka 560095", phone: "+91 98765 43211", timezone: "Asia/Kolkata" },
      { id: "c3", name: "SmileCare Connaught Place", address: "45 Inner Circle, Connaught Place, New Delhi, Delhi 110001", phone: "+91 98765 43212", timezone: "Asia/Kolkata" },
    ],
  });
  await prisma.service.createMany({
    data: [
      { id: "s1", name: "General Checkup", description: "Comprehensive dental examination and oral health assessment", duration: 30, price: 800, icon: "Stethoscope" },
      { id: "s2", name: "Teeth Cleaning", description: "Professional cleaning to remove plaque and tartar buildup", duration: 45, price: 1500, icon: "Sparkles" },
      { id: "s3", name: "Fillings", description: "Restore damaged teeth with composite or amalgam fillings", duration: 60, price: 2000, icon: "Shield" },
      { id: "s4", name: "Root Canal", description: "Treat infected tooth pulp and save your natural tooth", duration: 90, price: 8000, icon: "Activity" },
      { id: "s5", name: "Teeth Whitening", description: "Professional whitening for a brighter, confident smile", duration: 60, price: 12000, icon: "Sun" },
      { id: "s6", name: "Dental Implants", description: "Permanent solution for missing teeth with titanium implants", duration: 120, price: 35000, icon: "Gem" },
      { id: "s7", name: "Braces & Aligners", description: "Orthodontic treatment for straighter teeth", duration: 45, price: 25000, icon: "AlignCenter" },
      { id: "s8", name: "Emergency Care", description: "Immediate care for dental emergencies and pain relief", duration: 30, price: 1500, icon: "Siren" },
    ],
  });
  await prisma.user.create({
    data: { id: "u1", name: "Priya Sharma", email: "patient@smilecare.com", password: "demo123", role: "PATIENT", avatar: "https://i.pravatar.cc/150?u=patient", phone: "+91 98765 01001" },
  });
  const doctorUser = await prisma.user.create({
    data: { id: "u2", name: "Dr. Priya Menon", email: "doctor@smilecare.com", password: "demo123", role: "DOCTOR", clinicId: "c1", avatar: "/images/dentist-2.jpg" },
  });
  await seedAdmin();
  await prisma.dentist.createMany({
    data: [
      { id: "d1", name: "Dr. Rajesh Sharma", specialty: "General Dentistry", rating: 4.9, reviews: 128, avatar: "/images/dentist-1.jpg", clinicId: "c1" },
      { id: "d2", userId: doctorUser.id, name: "Dr. Priya Menon", specialty: "Orthodontist", rating: 4.8, reviews: 96, avatar: "/images/dentist-2.jpg", clinicId: "c1" },
      { id: "d3", name: "Dr. Amit Patel", specialty: "Oral Surgeon", rating: 4.7, reviews: 84, avatar: "/images/dentist-3.jpg", clinicId: "c2" },
    ],
  });
  console.log("Seed complete — appointments and audit logs are created from live app usage");
}
seed().finally(() => prisma.$disconnect());
