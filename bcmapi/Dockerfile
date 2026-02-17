# RiskTrac GRC - BCM API
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=6004
EXPOSE 6004

CMD ["node", "app-server.js"]
