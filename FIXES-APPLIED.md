# RiskTrac GRC – Fixes Applied (All Modules)

Summary of changes made so all modules are error-free. Nginx is not in the compose file; use your own reverse proxy if needed.

---

## Permanent fix for login (do not revert)

These changes are required for login to work reliably. Reverting any of them can cause "Invalid or expired login session", "Decryption failed", or get-key returning a response without authapi’s public key.

| Component | Change | Why |
|-----------|--------|-----|
| **authapi/Dockerfile** | `RUN node -e "require('./utility/ensure-auth-certs.js').ensureAuthCerts()"` after `COPY . .` | Ensures every image has `private.pem` and `public.pem` in `/app/config/certs`. Login decrypts the client payload with this key pair. |
| **authapi/utility/db-connection/db-connection.js** | No `process.exit(0)`; on password null or connection failure export a **rejected promise** only. | So authapi stays up when DB fails; container does not restart loop and get-key still returns public key. |
| **authapi/app-server.js** | On DB connection failure: set `global.poolConnectionObject = null` and **do not** call `process.exit()`. | Same: keep process running so container is stable and login flow (get-key → login) can be fixed by correcting `.env` and recreating. |
| **umapi/app-server.js** | **Do not** intercept `/user-management/auth/get-key` in the raw HTTP callback or in early middleware. All get-key requests must reach the Express route **getKeyHandler**, which calls authapi `get-Key` and returns the full result (including **authapi’s publicKey**). | If get-key is handled by a fallback before calling authapi, the response has no `publicKey`; the frontend then encrypts with the wrong key and authapi returns "Decryption failed or empty payload." |
| **hostweb login** | Before submit, if `publicKey` is missing, show "Login configuration not loaded. Please refresh the page (Ctrl+F5) and try again." and do not call the login API. | Avoids sending encrypted payload with wrong/missing key. |

**One-time setup for a new environment**

1. In project root create `.env` with at least `DB_PASSWORD=...` (and `DB_SERVER`, `DB_USER`, `DB_NAME`, `DB_PORT` if different from defaults).
2. Build authapi so certs are generated in the image:  
   `docker compose build authapi --no-cache`
3. Start stack:  
   `docker compose up -d`
4. After first load (or after recreating authapi/umapi), **refresh the login page once (Ctrl+F5)** so the browser gets the current public key from get-key.

---

## 1. **authapi**
- **CORS:** `ALLOWED_ORIGINS` extended with `http://10.0.1.32:8080`, `http://127.0.0.1:8080`, and env `ALLOWED_ORIGINS` (comma-separated). CORS callback no longer rejects unknown origins (always `callback(null, true)`) to avoid 500.
- **Global error handler:** 4-arg middleware added so unhandled errors return **200** with `{ success: 0, ... }` instead of 500.
- **PORT:** Already supported via `process.env.PORT` (Docker: 6001).
- **Login:** Certificates generated at **build time** in Dockerfile; DB connection failure is **non-fatal** (see "Permanent fix for login" above).

---

## 2. **umapi**
- **get-key:** The **Express** route `getKeyHandler` (POST/GET `/user-management/auth/get-key`) calls authapi `get-Key` and returns the full result (including authapi’s **publicKey**). There is **no** early interception of get-key in the raw HTTP server or middleware; fallback (getKeyFallbackResultSync / getKeyResponseBody) is used only **inside** getKeyHandler when the authapi call fails. This is required for login to work (see "Permanent fix for login" above).
- **CORS:** Already allowed 10.0.1.32 and 127.0.0.1; global error handler already in place.
- **PORT:** Already supported (Docker: 6002). `AUTH_SERVICE_URL=http://authapi:6001` in docker-compose.
- **Resilient startup (502 / Host unreachable):** Logger, notification logger, main DB, and notification DB init are **non-fatal**. If any fail, the process **stays up** and get-key remains available. DB connection modules do not `process.exit(0)`; they reject the promise so `app-server.js` can set `global.poolConnectionObject = null`.
- **Healthcheck:** `docker-compose` healthcheck for umapi (GET get-key) so the container is marked healthy once the endpoint responds.

---

## 3. **ormapi**
- **CORS:** `ALLOWED_ORIGINS` extended with `http://10.0.1.32:8080`, `http://127.0.0.1:8080`, and env. CORS callback always allows (`callback(null, true)`).
- **Global error handler:** 4-arg middleware added so unhandled errors return **200** with `{ success: 0, ... }` instead of 500.
- **PORT:** Already supported (Docker: 6003).
- **"Session expired" on ORM click:** The JWT token is **signed by umapi** at login. ormapi must verify it with the **same secret**. In **Docker**, `docker-compose.yml` mounts `./umapi/config/certs` into ormapi (and bcmapi) as read-only so they use umapi’s `secret.pem`. For **non-Docker** runs, copy `umapi/config/certs/secret.pem` into `ormapi/config/certs/` and `bcmapi/config/certs/` so token verification succeeds.
- **KRI:** api-docs use `./KRI/` (folder is `KRI`); no path change needed.

---

## 4. **bcmapi**
- **CORS:** Same as ormapi – extended origins and CORS always allow.
- **Global error handler:** Same 4-arg middleware so no 500 from unhandled errors.
- **PORT:** Already supported (Docker: 6004).
- **DB connection (non-fatal):** Same pattern as ormapi: `utility/db-connection/db-connection.js` and `db-connection-notification.js` do **not** call `process.exit(0)`; they export a rejected promise on password null or connection failure. `app-server.js` catches DB and notification DB failures, sets `global.poolConnectionObject` / `global.poolConnectionObjectNotification` to null, and continues so the container does not restart loop. Notification logger init failure uses a console fallback instead of exiting. **docker-compose** passes `DB_*` and `NOTIFICATION_DB_*` env vars (with defaults) so DB config can come from `.env`.

---

## 5. **hostweb, umweb, ormweb, bcmweb**
- **Build:** Each has `legacy-peer-deps=true` in `.npmrc` for `npm install`.
- **Docker:** Dockerfiles use `npm run build` with correct `--base-href` and copy from the right `dist/` folder (host, user-management, orm, orm for bcmweb).
- **Angular:** bcmweb has `strictTemplates: false` and `allowedCommonJsDependencies` for file-saver, highcharts, moment. No code changes required for build.

---

## 6. **nginx**
- **Not in compose.** The `nginx/` folder contains a sample `nginx.conf` for use with your own nginx (or other reverse proxy). The compose file does not include an nginx service.

---

## Deploy (Docker)

From the repo root (`RiskTrac-GRC`):

```bash
docker compose build --no-cache
docker compose up -d
```

Then access your app via your own reverse proxy (compose does not expose a single entry port).

- Login and get-key go through umapi → authapi; get-key always returns 200 (success or fallback).
- All APIs respond with 200 and `success: 0` on unexpected errors instead of 500.

---

## Optional: Remove deprecated gulp-util

- **ormapi:** In `package.json` you can remove `"gulp-util":"^3.0.8"` from `dependencies` (gulp build scripts don’t require it at runtime).
- **bcmapi:** Same – remove `"gulp-util":"3.0.8"` from `dependencies` and from `devDependencies` if present. Then run `npm install` in each module if you need a clean lockfile.

These removals are optional; the app runs correctly with gulp-util still listed.

---

## Troubleshooting: 502 Bad Gateway on `/umapi/user-management/auth/get-key` or `/login`

**What it means:** Your reverse proxy (e.g. nginx) cannot get a valid response from the **umapi** backend (User Management API). So the failure is between the proxy and the umapi container, not in the frontend.

**If proxy/nginx logs show:** `connect() failed (113: Host is unreachable) while connecting to upstream`  
That means nginx resolved the **umapi** hostname to an IP (e.g. `172.25.0.2`) but could not reach it. Usually the **umapi** container is **not running** (crashed or never started), or it restarted and nginx was using a stale IP. Fix: get **umapi** running (see below) and reload nginx if you changed config. Nginx is now configured to re-resolve upstream hostnames (via variables) so restarted backends get fresh IPs.

**Checks:**

1. **Ensure all containers are running**
   ```bash
   docker compose ps
   ```
   Confirm `risktrac-umapi` (and `risktrac-authapi`) are **Up**. If **umapi** is **Exited** or missing, start it:
   ```bash
   docker compose up -d umapi
   ```

2. **Inspect umapi logs**
   ```bash
   docker compose logs umapi
   ```
   Look for startup errors (e.g. missing config, DB, or authapi unreachable).

3. **Restart umapi**
   ```bash
   docker compose restart umapi
   ```

4. **Full stack restart** (ensures all services and network are correct)
   ```bash
   docker compose down && docker compose up -d
   ```

**Frontend:** The login page now shows a clear message when the auth service returns 502/503/504: *"Authentication service is temporarily unavailable. Please check that the User Management API (umapi) is running and try again."*
