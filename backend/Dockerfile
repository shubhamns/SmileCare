FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY prisma ./prisma
RUN pnpm db:generate
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build
EXPOSE 4000
CMD ["sh", "-c", "pnpm exec prisma db push --accept-data-loss && pnpm db:seed && pnpm start"]
