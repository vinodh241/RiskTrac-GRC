# RiskTrac GRC - Docker Setup

**Server IP:** 10.0.1.32  
**Docker Hub:** vinod9072 (image tag format: `vinod9072/imagename:v1`)

## Ports

| Port | Service  |
|------|----------|
| 6001 | Auth API (direct) |
| 6002 | UM API (direct) |
| 6003 | ORM API (direct) |
| 6004 | BCM API (direct) |
| 8080 | Nginx (main entry; app at http://host:8080) |

**If `docker compose config --services` does not list nginx** (e.g. you only see authapi, umapi, ormapi, bcmapi, hostweb, umweb, ormweb, bcmweb), the compose file on the server is outdated. Either pull the latest repo, or run from project root: `chmod +x scripts/add-nginx-to-compose.sh && ./scripts/add-nginx-to-compose.sh` to add the nginx service. Then `docker compose build nginx && docker compose up -d nginx`.

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

**2. Build and run (error-free images for login):**  
All API containers (authapi, umapi, ormapi, bcmapi) are set up so DB connection failure does not restart the container; authapi has login certs baked in at build time; umapi get-key calls authapi for the full response. Build and start:
```bash
# From project root (where .env and docker-compose.yml are)
docker compose build authapi --no-cache
docker compose build umapi ormapi bcmapi
docker compose up -d
```
Or build everything: `docker compose build --no-cache && docker compose up -d`

**3. After first deploy (or after recreating authapi/umapi):** Refresh the login page once (Ctrl+F5) so the app fetches the public key from get-key.

**4. View logs:**
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

**Auth API – certificates for login (permanent):** Login requires authapi’s key pair. The **authapi Dockerfile** runs `ensureAuthCerts()` at **build time** so every image has `private.pem` and `public.pem` in the container (no host volume). **umapi** must not intercept get-key before calling authapi: the Express route `getKeyHandler` calls authapi and returns the full response including authapi’s `publicKey`; only if authapi is down does it return a fallback. After deploying or recreating authapi/umapi, **refresh the login page once** (Ctrl+F5) so the app loads the current public key; then login works.

**Troubleshooting – Unable to login**

1. **Refresh the login page (Ctrl+F5 or clear cache)**  
   The app must load the current public key from get-key. If you see "Invalid or expired login session" or login fails right after a deploy, do a full refresh and try again.

2. **Check that authapi and umapi are running and reachable**
   ```bash
   docker ps
   docker logs risktrac-authapi --tail 30
   docker logs risktrac-umapi --tail 30
   ```
   In authapi logs you should see "Database Connected......" and optionally "Auth API: generated new certs...". In umapi, no "Database password is null" or connection errors.

3. **Confirm umapi can call authapi**  
   umapi uses `AUTH_SERVICE_URL` (default in compose: `http://authapi:6001`). If get-key fails, the login page may not get the public key. Check umapi logs for errors when calling authapi.

4. **Database and credentials**  
   Ensure `.env` has the correct `DB_PASSWORD` (and `DB_SERVER`, `DB_USER`, `DB_NAME` if different). The SQL user (e.g. `sqldev`) must exist and have access to the `SE_GRC` database. Use valid application user credentials (as stored in your DB).

**Access:**  
Use your own reverse proxy (e.g. nginx) in front of the APIs and webs. APIs: 6001 (auth), 6002 (um), 6003 (orm), 6004 (bcm). Webs: hostweb, umweb, ormweb, bcmweb (no port exposed by default; put them behind your proxy).

## Build and push images to Docker Hub

```bash
# Login (once)
docker login

# Build all
docker-compose build

# Tag and push (use your username vinod9072)
docker-compose push
```

Or build and tag individually:

```bash
docker build -t vinod9072/authapi:v1 ./authapi
docker build -t vinod9072/umapi:v1 ./umapi
docker build -t vinod9072/ormapi:v1 ./ormapi
docker build -t vinod9072/bcmapi:v1 ./bcmapi
docker build -t vinod9072/hostweb:v1 ./hostweb
docker build -t vinod9072/umweb:v1 ./umweb
docker build -t vinod9072/ormweb:v1 ./ormweb
docker build -t vinod9072/bcmweb:v1 ./bcmweb

docker push vinod9072/authapi:v1
docker push vinod9072/umapi:v1
# ... etc
```

## Stop

```bash
docker-compose down
```
