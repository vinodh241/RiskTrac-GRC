# RiskTrac GRC - Docker Setup

**Server IP:** 10.0.1.32  
**Docker Hub:** vinod9072 (image tag format: `vinod9072/imagename:v1`)

## Ports

| Port | Service  |
|------|----------|
| 8080 | Nginx (main entry - all UIs and API routes) |
| 6001 | Auth API (direct) |
| 6002 | UM API (direct) |
| 6003 | ORM API (direct) |
| 6004 | BCM API (direct) |

## Quick Start

From project root `RiskTrac-GRC`:

```bash
# Build and run all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

**Access:**
- App (host + all modules): **http://10.0.1.32:8080** or **http://localhost:8080**
- User Management: http://10.0.1.32:8080/um/
- ORM: http://10.0.1.32:8080/orm/
- BCM: http://10.0.1.32:8080/bcm/
- APIs via nginx: http://10.0.1.32:8080/authapi/, /umapi/, /ormapi/, /bcmapi/

## Build and push images to Docker Hub

```bash
# Login (once)
docker login

# Build all
docker-compose build

# Tag and push (use your username vinod9072)
docker-compose push
```

Or build and tag individually (use **risktrac-nginx** for nginx, not `nginx`):

```bash
docker build -t vinod9072/authapi:v1 ./authapi
docker build -t vinod9072/umapi:v1 ./umapi
docker build -t vinod9072/ormapi:v1 ./ormapi
docker build -t vinod9072/bcmapi:v1 ./bcmapi
docker build -t vinod9072/hostweb:v1 ./hostweb
docker build -t vinod9072/umweb:v1 ./umweb
docker build -t vinod9072/ormweb:v1 ./ormweb
docker build -t vinod9072/bcmweb:v1 ./bcmweb
docker build -t vinod9072/risktrac-nginx:v1 ./nginx

docker push vinod9072/authapi:v1
docker push vinod9072/umapi:v1
# ... etc
```

**Nginx: one image only.** The nginx image must be tagged only as `vinod9072/risktrac-nginx:v1`. Do **not** use `vinod9072/nginx:v1` when building. If you see both tags (same image ID), remove the extra one:
```bash
docker rmi vinod9072/nginx:v1
```
Build nginx with: `docker compose build nginx` or `docker build -t vinod9072/risktrac-nginx:v1 ./nginx`.

## Stop

```bash
docker-compose down
```
