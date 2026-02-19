# RiskTrac GRC - BCM Web (Angular)
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
# Retry npm install on transient network errors (ECONNRESET)
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-timeout 300000 && \
    (npm install --legacy-peer-deps || npm install --legacy-peer-deps || npm install --legacy-peer-deps)

COPY . .
RUN npm run build -- --configuration=production --base-href=/bcm/

FROM nginx:alpine
COPY --from=build /app/dist/bcm /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
