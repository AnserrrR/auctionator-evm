FROM node:16.20-alpine as development
WORKDIR /usr/src/app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
EXPOSE 5000

FROM node:16.20-alpine as build
WORKDIR /app
# Install deps
COPY package*.json ./
RUN npm ci
# Build NestJS app
COPY . .
RUN npm run build
# Clean dev dependencies (https://classic.yarnpkg.com/lang/en/docs/cli/prune/)
RUN npm prune --production

FROM node:16.20-alpine as production
WORKDIR /app
# Copy built app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["node", "dist/main"]
