# syntax=docker/dockerfile:1

# base step: set WORKDIR, enable pnpm
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# prod-deps step: install only prod deps
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml /app/
RUN --mount=type=cache,id=pnpm,target=$PNPM_HOME/store pnpm install --prod --frozen-lockfile

# build step: build app
FROM base AS build
COPY package.json pnpm-lock.yaml /app/
RUN --mount=type=cache,id=pnpm,target=$PNPM_HOME/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build --no-lint

# prod step: deply prod app
FROM base AS prod
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next/static /app/.next/static
EXPOSE 3000

CMD [ "pnpm", "run", "start" ]
