# RiskTrac GRC - Auth API
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Port used by this API (override via env in docker-compose)
ENV PORT=6001
EXPOSE 6001

CMD ["node", "app-server.js"]
