import { Role } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
export async function logAudit(
  prisma: PrismaClient,
  data: { action: string; userName: string; role: Role; resource: string; ip?: string }
) {
  await prisma.auditLog.create({ data });
}
