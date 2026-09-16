import { Worker } from "bullmq";
import { redis } from "./connection";
import { APPOINTMENT_QUEUE, AppointmentJobData } from "./appointment-queue";
export function startWorker() {
  if (process.env.DISABLE_BULLMQ === "true") {
    console.log("BullMQ worker disabled (DISABLE_BULLMQ=true)");
    return null;
  }
  const worker = new Worker<AppointmentJobData>(
    APPOINTMENT_QUEUE,
    async (job) => {
      const { type, patientEmail, patientName, date, time, serviceName, appointmentId } = job.data;
      if (type === "confirmation") {
        console.log(`[email] Confirmation sent to ${patientEmail} for ${serviceName} on ${date} at ${time} (${appointmentId})`);
      } else {
        console.log(`[email] Reminder sent to ${patientName} <${patientEmail}> for ${serviceName} on ${date} at ${time}`);
      }
    },
    { connection: redis }
  );
  worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed:`, err.message));
  worker.on("error", (err) => console.warn("BullMQ worker error:", err.message));
  console.log("BullMQ appointment worker started");
  return worker;
}
