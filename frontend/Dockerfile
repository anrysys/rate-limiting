FROM node:18-alpine

WORKDIR /app

# Install required system dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set production environment and port
ENV NODE_ENV=production
ENV PORT=3111

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

EXPOSE 3111

# Start the application with explicit port
CMD ["sh", "-c", "node .next/standalone/server.js -p 3111"]
