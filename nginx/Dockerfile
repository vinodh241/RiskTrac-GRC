# RiskTrac GRC - Nginx reverse proxy for all APIs and web modules
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
