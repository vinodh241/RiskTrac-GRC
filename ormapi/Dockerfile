# RiskTrac GRC - ORM API
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=6003
EXPOSE 6003

CMD ["node", "app-server.js"]
