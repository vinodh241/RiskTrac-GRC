# RiskTrac GRC - User Management Web (Angular)
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build -- --base-href=/um/

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist/user-management /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
