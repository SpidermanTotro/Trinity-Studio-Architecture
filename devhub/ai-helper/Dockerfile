# Trinity Studio AI Helper Service - Dockerfile
# SKELETON IMPLEMENTATION

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create logs directory
RUN mkdir -p logs

# Expose AI helper port
EXPOSE 3001

# Start server
CMD ["npm", "start"]
