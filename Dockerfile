# syntax=docker/dockerfile:1

FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
COPY libs/shared/package.json ./libs/shared/package.json
COPY services/package.json ./services/package.json
COPY webapp/package.json ./webapp/package.json

RUN npm ci --legacy-peer-deps --ignore-scripts

FROM dependencies AS build

COPY tsconfig.base.json tsconfig.json ./
COPY libs ./libs
COPY services ./services

RUN npm run build --workspace=libs/shared
RUN npm run prisma:generate --workspace=services
RUN npm run build --workspace=services

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY package.json package-lock.json ./
COPY libs/shared/package.json ./libs/shared/package.json
COPY services/package.json ./services/package.json
COPY webapp/package.json ./webapp/package.json

RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts \
  && npm cache clean --force

COPY --from=build /app/services/dist ./services/dist

EXPOSE 8080

USER node

CMD ["node", "services/dist/index.js"]
