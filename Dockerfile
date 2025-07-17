# Multi-stage build for React app
FROM node:18-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# Set environment variable for build
ARG VITE_API_HOST
ENV VITE_API_HOST=$VITE_API_HOST

# Debug: Print environment variable
RUN echo "Building with VITE_API_HOST: $VITE_API_HOST"

RUN pnpm run build

# Production stage with nginx
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

COPY ssl/ /etc/nginx/ssl/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
