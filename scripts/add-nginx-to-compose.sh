#!/bin/sh
# Adds the nginx service to docker-compose.yml if it's missing.
# Run from repo root: ./scripts/add-nginx-to-compose.sh

set -e
cd "$(dirname "$0")/.."
COMPOSE="docker-compose.yml"

if grep -q '^  nginx:' "$COMPOSE" 2>/dev/null; then
  echo "nginx service already present in $COMPOSE"
  exit 0
fi

# Insert nginx block before "networks:"
# Use a temp file for portability
tmp=$(mktemp)
awk '
  /^networks:/ && !done {
    print "  nginx:"
    print "    image: vinod9072/nginx:v1"
    print "    build:"
    print "      context: ./nginx"
    print "      dockerfile: Dockerfile"
    print "    container_name: risktrac-nginx"
    print "    ports:"
    print "      - \"8080:80\""
    print "    depends_on:"
    print "      - authapi"
    print "      - umapi"
    print "      - ormapi"
    print "      - bcmapi"
    print "      - hostweb"
    print "      - umweb"
    print "      - ormweb"
    print "      - bcmweb"
    print "    networks:"
    print "      - risktrac-net"
    print "    restart: unless-stopped"
    print ""
    done=1
  }
  { print }
' "$COMPOSE" > "$tmp"
mv "$tmp" "$COMPOSE"
echo "Added nginx service to $COMPOSE. Run: docker compose config --services"
echo "You should see nginx in the list. Then: docker compose build nginx && docker compose up -d nginx"
