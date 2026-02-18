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

**1. Set database connection for APIs (required):**  
Create a `.env` file in the project root with your SQL Server details. Example for the default dev DB:
```bash
# Copy and paste (or run as one block). Do not commit .env.
DB_SERVER=10.0.1.22
DB_NAME=SE_GRC
DB_USER=sqldev
DB_PASSWORD=RegXTrac1234
DB_PORT=1433
```
To create `.env` in one go:  
`printf 'DB_SERVER=10.0.1.22\nDB_NAME=SE_GRC\nDB_USER=sqldev\nDB_PASSWORD=RegXTrac1234\nDB_PORT=1433\n' > .env`

**2. Build and run:**
```bash
docker-compose up -d --build
```

**3. View logs:**
```bash
docker-compose logs -f
```

APIs use `DB_PASSWORD` from the environment when set; otherwise they decrypt the password from config. **umapi** can run with no values in `config/db-config.js` if these env vars are set:

| Env var | Description | Default |
|---------|-------------|---------|
| `DB_PASSWORD` | SQL Server password | (required if config empty) |
| `DB_USER` | SQL user | sqldev |
| `DB_SERVER` or `DB_HOST` | Server IP/host | 10.0.1.22 |
| `DB_PORT` | Port | 1433 |
| `DB_NAME` or `DB_DATABASE` | Database name | SE_GRC |

Optional for notification DB: `NOTIFICATION_DB_PASSWORD`, `NOTIFICATION_DB_SERVER`, `NOTIFICATION_DB_USER`, `NOTIFICATION_DB_PORT`, `NOTIFICATION_DB_NAME` (each falls back to the main `DB_*` value).

**If you see "Database password is null" in umapi logs:** The container is not getting `DB_PASSWORD`. From the **project root** (where `docker-compose.yml` is), create `.env` with your SQL password, then recreate the container:
```bash
cd ~/RiskTrac/RiskTrac-GRC
echo "DB_PASSWORD=YourActualSqlPassword" > .env
docker compose up -d --force-recreate umapi
```

**Auth API – certificates for login:** Login decrypts the client payload with the auth API’s private key. The compose file mounts `./authapi/config/certs` into the authapi container. If `private.pem` is missing, **authapi auto-generates** a new key pair at startup (and writes it to the mounted dir so it persists). If certs were auto-generated, **refresh the login page** after the first successful authapi start so the frontend fetches the new public key from get-key. To use your own keys, place `private.pem` and `public.pem` in `authapi/config/certs/` on the host before starting.

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
