# RiskTrac GRC - ORM API
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Generate config/certs at build time so the image has private.pem/public.pem for decrypting SFTP/DB secrets
RUN node -e "require('./utility/ensure-certs.js').ensureCerts()"

ENV PORT=6003
EXPOSE 6003

CMD ["node", "app-server.js"]
