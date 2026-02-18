#!/bin/sh
# Build nginx image with the single canonical tag only (vinod9072/risktrac-nginx:v1).
# Do not use vinod9072/nginx:v1 — use this script or: docker compose build nginx
set -e
cd "$(dirname "$0")/.."
docker build -t vinod9072/risktrac-nginx:v1 ./nginx
echo "Built: vinod9072/risktrac-nginx:v1 (only)"
