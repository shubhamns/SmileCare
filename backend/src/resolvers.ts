import { AppointmentStatus, Role } from "@prisma/client";
import { logAudit } from "./audit";
import { appointmentQueue } from "./queue/appointment-queue";
import { Context } from "./context";
const activeStatuses: AppointmentStatus[] = ["CONFIRMED", "PENDING"];
const adminActor = { userName: "Clinic Admin", role: "ADMIN" as Role };
export const resolvers = {
  Clinic: {
    dentists: (parent: { id: string }, _: unknown, { prisma }: Context) =>
      prisma.dentist.findMany({ where: { clinicId: parent.id } }),
  },
  Dentist: {
    clinic: (parent: { clinicId: string }, _: unknown, { prisma }: Context) =>
      prisma.clinic.findUniqueOrThrow({ where: { id: parent.clinicId } }),
  },
  Appointment: {
    service: (parent: { serviceId: string }, _: unknown, { prisma }: Context) =>
      prisma.service.findUniqueOrThrow({ where: { id: parent.serviceId } }),
    dentist: (parent: { dentistId: string }, _: unknown, { prisma }: Context) =>
      prisma.dentist.findUniqueOrThrow({ where: { id: parent.dentistId } }),
    clinic: (parent: { clinicId: string }, _: unknown, { prisma }: Context) =>
      prisma.clinic.findUniqueOrThrow({ where: { id: parent.clinicId } }),
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
  },
  AuditLog: {
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
  },
  Query: {
    clinics: (_: unknown, __: unknown, { prisma }: Context) => prisma.clinic.findMany({ orderBy: { name: "asc" } }),
    clinic: (_: unknown, { id }: { id: string }, { prisma }: Context) => prisma.clinic.findUnique({ where: { id } }),
    services: (_: unknown, __: unknown, { prisma }: Context) => prisma.service.findMany({ orderBy: { name: "asc" } }),
    service: (_: unknown, { id }: { id: string }, { prisma }: Context) => prisma.service.findUnique({ where: { id } }),
    dentists: (_: unknown, { clinicId }: { clinicId?: string }, { prisma }: Context) =>
      prisma.dentist.findMany({ where: clinicId ? { clinicId } : undefined, orderBy: { name: "asc" } }),
    dentist: (_: unknown, { id }: { id: string }, { prisma }: Context) => prisma.dentist.findUnique({ where: { id } }),
    appointments: (
      _: unknown,
      args: { patientEmail?: string; clinicId?: string; date?: string; dentistId?: string },
      { prisma }: Context
    ) =>
      prisma.appointment.findMany({
        where: {
          patientEmail: args.patientEmail,
          clinicId: args.clinicId,
          date: args.date,
          dentistId: args.dentistId,
        },
        orderBy: [{ date: "asc" }, { time: "asc" }],
        include: { service: true, dentist: true, clinic: true },
      }),
    appointment: (_: unknown, { id }: { id: string }, { prisma }: Context) =>
      prisma.appointment.findUnique({ where: { id }, include: { service: true, dentist: true, clinic: true } }),
    bookedSlots: async (_: unknown, { date, dentistId }: { date: string; dentistId: string }, { prisma }: Context) => {
      const rows = await prisma.appointment.findMany({
        where: { date, dentistId, status: { in: activeStatuses } },
        select: { time: true },
      });
      return rows.map((r) => r.time);
    },
    auditLogs: (_: unknown, __: unknown, { prisma }: Context) =>
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    settings: (_: unknown, __: unknown, { prisma }: Context) =>
      prisma.setting.findMany({ orderBy: { key: "asc" } }),
    stats: async (_: unknown, __: unknown, { prisma }: Context) => {
      const [patients, dentists, clinics, appointments, ratings] = await Promise.all([
        prisma.user.count({ where: { role: "PATIENT" } }),
        prisma.dentist.count(),
        prisma.clinic.count(),
        prisma.appointment.count(),
        prisma.dentist.aggregate({ _avg: { rating: true } }),
      ]);
      return {
        patients,
        dentists,
        clinics,
        appointments,
        avgRating: Math.round((ratings._avg.rating || 0) * 10) / 10,
      };
    },
    patients: async (_: unknown, __: unknown, { prisma }: Context) => {
      const users = await prisma.user.findMany({ where: { role: "PATIENT" }, orderBy: { name: "asc" } });
      const summaries = await Promise.all(
        users.map(async (user) => {
          const lastAppt = await prisma.appointment.findFirst({
            where: { OR: [{ patientId: user.id }, { patientEmail: user.email }] },
            orderBy: { date: "desc" },
            include: { clinic: true },
          });
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            lastVisit: lastAppt?.date || "",
            clinicName: lastAppt?.clinic.name || "",
          };
        })
      );
      return summaries;
    },
  },
  Mutation: {
    login: async (_: unknown, { email, password, role }: { email: string; password: string; role: Role }, { prisma }: Context) => {
      const user = await prisma.user.findFirst({ where: { email, role } });
      if (!user || user.password !== password) return null;
      await logAudit(prisma, { action: "LOGIN", userName: user.name, role: user.role, resource: "Auth Session" });
      return user;
    },
    register: async (_: unknown, { input }: { input: { name: string; email: string; password: string; phone?: string } }, { prisma }: Context) => {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new Error("Email already registered");
      const user = await prisma.user.create({
        data: { name: input.name, email: input.email, password: input.password, phone: input.phone, role: "PATIENT" },
      });
      await logAudit(prisma, { action: "CREATE", userName: user.name, role: "PATIENT", resource: "Patient Account" });
      return user;
    },
    changePassword: async (_: unknown, { email, currentPassword, newPassword }: { email: string; currentPassword: string; newPassword: string }, { prisma }: Context) => {
      const user = await prisma.user.findFirst({ where: { email, role: { in: ["DOCTOR", "ADMIN"] } } });
      if (!user || user.password !== currentPassword) return false;
      await prisma.user.update({ where: { id: user.id }, data: { password: newPassword } });
      await logAudit(prisma, { action: "UPDATE", userName: user.name, role: user.role, resource: "Password Change" });
      return true;
    },
    createAppointment: async (_: unknown, { input }: { input: Record<string, string> }, { prisma }: Context) => {
      const patient = await prisma.user.findUnique({ where: { email: input.patientEmail } });
      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient?.role === "PATIENT" ? patient.id : undefined,
          patientName: input.patientName,
          patientEmail: input.patientEmail,
          patientPhone: input.patientPhone,
          reason: input.reason,
          serviceId: input.serviceId,
          dentistId: input.dentistId,
          clinicId: input.clinicId,
          date: input.date,
          time: input.time,
          status: "PENDING",
        },
        include: { service: true, dentist: true, clinic: true },
      });
      try {
        await appointmentQueue.add("confirmation", {
          type: "confirmation",
          appointmentId: appointment.id,
          patientEmail: appointment.patientEmail,
          patientName: appointment.patientName,
          date: appointment.date,
          time: appointment.time,
          serviceName: appointment.service.name,
        });
        await appointmentQueue.add(
          "reminder",
          {
            type: "reminder",
            appointmentId: appointment.id,
            patientEmail: appointment.patientEmail,
            patientName: appointment.patientName,
            date: appointment.date,
            time: appointment.time,
            serviceName: appointment.service.name,
          },
          { delay: 24 * 60 * 60 * 1000 }
        );
      } catch (err) {
        console.warn("BullMQ enqueue skipped:", err instanceof Error ? err.message : err);
      }
      await logAudit(prisma, {
        action: "CREATE",
        userName: appointment.patientName,
        role: "PATIENT",
        resource: `Appointment #${appointment.id}`,
      });
      return appointment;
    },
    updateAppointmentStatus: async (
      _: unknown,
      { id, status }: { id: string; status: AppointmentStatus },
      { prisma }: Context
    ) => {
      const appointment = await prisma.appointment.update({
        where: { id },
        data: { status },
        include: { service: true, dentist: true, clinic: true },
      });
      await logAudit(prisma, {
        action: "UPDATE",
        userName: appointment.dentist.name,
        role: "DOCTOR",
        resource: `Appointment #${appointment.id} → ${status}`,
      });
      return appointment;
    },
    cancelAppointment: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      const appointment = await prisma.appointment.update({
        where: { id },
        data: { status: "CANCELLED" },
        include: { service: true, dentist: true, clinic: true },
      });
      await logAudit(prisma, {
        action: "DELETE",
        userName: appointment.patientName,
        role: "PATIENT",
        resource: `Appointment #${appointment.id}`,
      });
      return appointment;
    },
    createClinic: async (_: unknown, { input }: { input: { name: string; address: string; phone: string; timezone: string } }, { prisma }: Context) => {
      const clinic = await prisma.clinic.create({ data: input });
      await logAudit(prisma, { action: "CREATE", ...adminActor, resource: `Clinic ${clinic.name}` });
      return clinic;
    },
    updateClinic: async (_: unknown, { id, input }: { id: string; input: { name: string; address: string; phone: string; timezone: string } }, { prisma }: Context) => {
      const clinic = await prisma.clinic.update({ where: { id }, data: input });
      await logAudit(prisma, { action: "UPDATE", ...adminActor, resource: `Clinic ${clinic.name}` });
      return clinic;
    },
    deleteClinic: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      const clinic = await prisma.clinic.findUniqueOrThrow({ where: { id } });
      const linked = await prisma.appointment.count({ where: { clinicId: id } });
      if (linked > 0) throw new Error("Clinic has appointments and cannot be deleted");
      await prisma.clinic.delete({ where: { id } });
      await logAudit(prisma, { action: "DELETE", ...adminActor, resource: `Clinic ${clinic.name}` });
      return true;
    },
    createService: async (_: unknown, { input }: { input: { name: string; description: string; duration: number; price: number; icon: string } }, { prisma }: Context) => {
      const service = await prisma.service.create({ data: input });
      await logAudit(prisma, { action: "CREATE", ...adminActor, resource: `Service ${service.name}` });
      return service;
    },
    updateService: async (_: unknown, { id, input }: { id: string; input: { name: string; description: string; duration: number; price: number; icon: string } }, { prisma }: Context) => {
      const service = await prisma.service.update({ where: { id }, data: input });
      await logAudit(prisma, { action: "UPDATE", ...adminActor, resource: `Service ${service.name}` });
      return service;
    },
    deleteService: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      const service = await prisma.service.findUniqueOrThrow({ where: { id } });
      const linked = await prisma.appointment.count({ where: { serviceId: id } });
      if (linked > 0) throw new Error("Service has appointments and cannot be deleted");
      await prisma.service.delete({ where: { id } });
      await logAudit(prisma, { action: "DELETE", ...adminActor, resource: `Service ${service.name}` });
      return true;
    },
    createDentist: async (_: unknown, { input }: { input: { name: string; specialty: string; rating: number; reviews: number; avatar: string; clinicId: string } }, { prisma }: Context) => {
      const dentist = await prisma.dentist.create({ data: input });
      await logAudit(prisma, { action: "CREATE", ...adminActor, resource: `Doctor ${dentist.name}` });
      return dentist;
    },
    createDoctorAccount: async (
      _: unknown,
      { input }: { input: { name: string; email: string; password: string; specialty: string; rating: number; reviews: number; avatar: string; clinicId: string } },
      { prisma }: Context
    ) => {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new Error("Email already registered");
      const user = await prisma.user.create({
        data: { name: input.name, email: input.email, password: input.password, role: "DOCTOR", clinicId: input.clinicId, avatar: input.avatar },
      });
      const dentist = await prisma.dentist.create({
        data: { name: input.name, specialty: input.specialty, rating: input.rating, reviews: input.reviews, avatar: input.avatar, clinicId: input.clinicId, userId: user.id },
      });
      await logAudit(prisma, { action: "CREATE", ...adminActor, resource: `Doctor Account ${input.email}` });
      return dentist;
    },
    updateDentist: async (_: unknown, { id, input }: { id: string; input: { name: string; specialty: string; rating: number; reviews: number; avatar: string; clinicId: string } }, { prisma }: Context) => {
      const dentist = await prisma.dentist.update({ where: { id }, data: input });
      await logAudit(prisma, { action: "UPDATE", ...adminActor, resource: `Doctor ${dentist.name}` });
      return dentist;
    },
    deleteDentist: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      const dentist = await prisma.dentist.findUniqueOrThrow({ where: { id } });
      const linked = await prisma.appointment.count({ where: { dentistId: id } });
      if (linked > 0) throw new Error("Doctor has appointments and cannot be deleted");
      await prisma.dentist.delete({ where: { id } });
      await logAudit(prisma, { action: "DELETE", ...adminActor, resource: `Doctor ${dentist.name}` });
      return true;
    },
    upsertSettings: async (_: unknown, { entries }: { entries: { key: string; value: string }[] }, { prisma }: Context) => {
      const results = await Promise.all(
        entries.map((entry) =>
          prisma.setting.upsert({ where: { key: entry.key }, update: { value: entry.value }, create: entry })
        )
      );
      await logAudit(prisma, { action: "UPDATE", ...adminActor, resource: "Deploy Settings" });
      return results;
    },
    deleteSetting: async (_: unknown, { key }: { key: string }, { prisma }: Context) => {
      await prisma.setting.delete({ where: { key } });
      await logAudit(prisma, { action: "DELETE", ...adminActor, resource: `Setting ${key}` });
      return true;
    },
  },
};
