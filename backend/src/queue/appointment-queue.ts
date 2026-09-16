import { Queue } from "bullmq";
import { redis } from "./connection";
export const APPOINTMENT_QUEUE = "appointment-jobs";
export type AppointmentJobData = {
  type: "confirmation" | "reminder";
  appointmentId: string;
  patientEmail: string;
  patientName: string;
  date: string;
  time: string;
  serviceName: string;
};
export const appointmentQueue = new Queue<AppointmentJobData>(APPOINTMENT_QUEUE, { connection: redis });
