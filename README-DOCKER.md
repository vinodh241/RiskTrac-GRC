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

**1. Set database password for APIs (required):**  
Create a `.env` file in the project root with your SQL Server password so APIs can connect:
```bash
echo "DB_PASSWORD=RegXTrac1234" > .env
# Or create .env with: DB_PASSWORD=your_actual_password
```
Do not commit `.env`; add it to `.gitignore` if needed.

**2. Build and run:**
```bash
docker-compose up -d --build
```

**3. View logs:**
```bash
docker-compose logs -f
```

APIs (authapi, umapi, ormapi, bcmapi) use `DB_PASSWORD` from the environment when set; otherwise they decrypt the password from config (requires `config/certs/private.pem` in each API image).

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

# Build all (nginx service is named risktrac-nginx so only one image tag is created)
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

**Nginx: one image only.** Use only `vinod9072/risktrac-nginx:v1`. Never build or tag as `vinod9072/nginx:v1`.

- **If you already have both tags** (same image ID), remove the extra tag:
  ```bash
  docker rmi vinod9072/nginx:v1
  ```
- **To build nginx** (creates only the one image):
  ```bash
  docker compose build risktrac-nginx
  ```
  Or from repo root: `./scripts/build-nginx.sh` or `docker build -t vinod9072/risktrac-nginx:v1 ./nginx`.

## Stop

```bash
docker-compose down
```
