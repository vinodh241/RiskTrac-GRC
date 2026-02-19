# RiskTrac GRC - BCM API
# Build: docker build -t bcmapi:v1 .
# Run with PORT=6004 (override via docker-compose env)

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=6004
EXPOSE 6004

CMD ["node", "app-server.js"]
