export const config = {
  port: Number(process.env.PORT) || 4000,
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  adminEmail: process.env.ADMIN_EMAIL || "admin@smilecare.com",
  adminPassword: process.env.ADMIN_PASSWORD || "demo123",
};
