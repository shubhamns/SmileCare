# Public
# Patient
# Admin
# Docker
FROM node:20-alpine AS build
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
ARG VITE_GRAPHQL_URL=http://localhost:4000/graphql
ARG VITE_PATIENT_ROUTE=/patient
ARG VITE_DOCTOR_ROUTE=/doctor
ARG VITE_ADMIN_ROUTE=/admin
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
ENV VITE_PATIENT_ROUTE=$VITE_PATIENT_ROUTE
ENV VITE_DOCTOR_ROUTE=$VITE_DOCTOR_ROUTE
ENV VITE_ADMIN_ROUTE=$VITE_ADMIN_ROUTE
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
