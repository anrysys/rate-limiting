FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Start fresh from new base image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies and cache manager deps
RUN npm install --only=production && \
    npm install keyv @nestjs/cache-manager cache-manager cache-manager-redis-yet

# Copy build artifacts from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 5111

CMD ["npm", "run", "start:prod"]