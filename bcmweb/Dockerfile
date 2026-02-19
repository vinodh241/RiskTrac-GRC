# RiskTrac GRC - BCM Web (Angular)
# Build: docker build -t bcmweb:v1 .
# Serves at /bcm/ behind nginx

FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-timeout 300000 && \
    (npm install --legacy-peer-deps || npm install --legacy-peer-deps || npm install --legacy-peer-deps)

COPY . .
# Project "bcm" in angular.json has outputPath "dist/web" - do not use dist/bcm
RUN npx ng build bcm --configuration=production --base-href=/bcm/

FROM nginx:alpine
# Must match outputPath in angular.json (currently dist/web)
COPY --from=build /app/dist/web /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
