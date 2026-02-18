# RiskTrac GRC - Auth API
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy application source
COPY . .

# Generate login certs at build time so the image always has private.pem/public.pem (no runtime write needed)
RUN node -e "require('./utility/ensure-auth-certs.js').ensureAuthCerts()"

# Port used by this API (override via env in docker-compose)
ENV PORT=6001
EXPOSE 6001

CMD ["node", "app-server.js"]
