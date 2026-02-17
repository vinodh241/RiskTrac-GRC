# RiskTrac GRC - User Management API
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=6002
EXPOSE 6002

CMD ["node", "app-server.js"]
