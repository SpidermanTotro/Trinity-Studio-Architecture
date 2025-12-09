FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Create necessary directories
RUN mkdir -p logs data/extracted

# Expose ports
# 8085 - Main server
# 8086 - AI Debugger dashboard
EXPOSE 8085 8086

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8085/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "src/core/index.js"]
