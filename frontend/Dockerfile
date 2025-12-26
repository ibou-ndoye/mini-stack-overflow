# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Définition des arguments de build pour Railway
# Cela permet d'injecter l'URL du backend lors du npm run build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose default port
EXPOSE 8080

# Use a shell to allow environment variable expansion (optional but port 8080 is standard)
CMD ["nginx", "-g", "daemon off;"]
